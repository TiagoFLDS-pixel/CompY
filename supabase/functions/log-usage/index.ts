import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_PAYLOAD_BYTES = 8192;
const allowedOrigins = new Set([
  "https://tiagoflds-pixel.github.io"
]);

const baseCorsHeaders: Record<string, string> = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin"
};

const allowedEvents = new Set([
  "app_open",
  "analysis_run",
  "alert_expanded",
  "base_status_viewed"
]);

const allowedKeys = new Set([
  "event_name",
  "timestamp",
  "app_version",
  "base_version",
  "environment",
  "device_type",
  "selected_count",
  "pair_count",
  "compatible_count",
  "incompatible_count",
  "variable_count",
  "no_data_count",
  "alert_count"
]);

const countFields = [
  "selected_count",
  "pair_count",
  "compatible_count",
  "incompatible_count",
  "variable_count",
  "no_data_count",
  "alert_count"
];

function corsHeadersForRequest(request: Request) {
  const origin = request.headers.get("origin");
  const headers = { ...baseCorsHeaders };

  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function isAllowedCorsOrigin(request: Request) {
  const origin = request.headers.get("origin");

  return !origin || allowedOrigins.has(origin);
}

function jsonResponse(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeadersForRequest(request),
      "Content-Type": "application/json"
    }
  });
}

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function sanitizeCount(value: unknown, max: number) {
  if (value === undefined || value === null) {
    return null;
  }

  if (!Number.isInteger(value) || value < 0 || value > max) {
    return undefined;
  }

  return value;
}

class PayloadTooLargeError extends Error {
  constructor() {
    super("Payload demasiado grande.");
    this.name = "PayloadTooLargeError";
  }
}

async function readBodyWithinLimit(request: Request, maxBytes: number) {
  const reader = request.body?.getReader();

  if (!reader) {
    return "";
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    totalBytes += value.byteLength;

    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

function validatePayload(payload: Record<string, unknown>) {
  for (const key of Object.keys(payload)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Campo não permitido no payload: ${key}`);
    }
  }

  const eventName = sanitizeString(payload.event_name, 40);

  if (!eventName || !allowedEvents.has(eventName)) {
    throw new Error("Evento não permitido.");
  }

  const timestamp =
    typeof payload.timestamp === "string" ? new Date(payload.timestamp) : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Timestamp inválido.");
  }

  const appVersion = sanitizeString(payload.app_version, 80);
  const baseVersion = sanitizeString(payload.base_version, 40);
  const environment = sanitizeString(payload.environment, 80);
  const deviceType = sanitizeString(payload.device_type, 20);

  if (!appVersion || !baseVersion || !environment) {
    throw new Error("Metadados obrigatórios em falta.");
  }

  if (deviceType !== "mobile" && deviceType !== "desktop") {
    throw new Error("device_type inválido.");
  }

  const sanitized: Record<string, unknown> = {
    event_name: eventName,
    occurred_at: timestamp.toISOString(),
    app_version: appVersion,
    base_version: baseVersion,
    environment,
    device_type: deviceType
  };

  for (const field of countFields) {
    const max = field === "selected_count" ? 6 : field === "alert_count" ? 12 : 15;
    const count = sanitizeCount(payload[field], max);

    if (count === undefined) {
      throw new Error(`Contador inválido: ${field}`);
    }

    sanitized[field] = count;
  }

  if (eventName === "analysis_run") {
    for (const field of countFields) {
      if (sanitized[field] === null) {
        throw new Error(`Contador obrigatório em falta: ${field}`);
      }
    }

    const pairCount = sanitized.pair_count as number;
    const resultTotal =
      (sanitized.compatible_count as number) +
      (sanitized.incompatible_count as number) +
      (sanitized.variable_count as number) +
      (sanitized.no_data_count as number);

    if (pairCount !== resultTotal) {
      throw new Error("Contadores de resultado não somam o total de pares.");
    }
  }

  return sanitized;
}

Deno.serve(async request => {
  if (!isAllowedCorsOrigin(request)) {
    return new Response("Origem não permitida.", {
      status: 403,
      headers: {
        "Vary": "Origin"
      }
    });
  }

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeadersForRequest(request) });
  }

  if (request.method !== "POST") {
    return jsonResponse(request, { error: "Método não permitido." }, 405);
  }

  const contentType = (request.headers.get("content-type") || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return jsonResponse(request, { error: "Content-Type inválido." }, 415);
  }

  const contentLength = request.headers.get("content-length");

  if (contentLength) {
    const parsedLength = Number(contentLength);

    if (
      !Number.isInteger(parsedLength) ||
      parsedLength < 0 ||
      parsedLength > MAX_PAYLOAD_BYTES
    ) {
      return jsonResponse(request, { error: "Payload demasiado grande." }, 413);
    }
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse(request, { error: "Configuração do backend incompleta." }, 500);
    }

    let rawBody = "";

    try {
      rawBody = await readBodyWithinLimit(request, MAX_PAYLOAD_BYTES);
    } catch (error) {
      if (!(error instanceof PayloadTooLargeError)) {
        throw error;
      }

      return jsonResponse(request, { error: "Payload demasiado grande." }, 413);
    }

    const rawPayload = JSON.parse(rawBody);

    if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
      return jsonResponse(request, { error: "Payload inválido." }, 400);
    }

    const event = validatePayload(rawPayload as Record<string, unknown>);
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false
      }
    });

    const { error } = await supabase.from("usage_events").insert(event);

    if (error) {
      console.error("Falha ao inserir usage_event:", error.message);
      return jsonResponse(request, { error: "Falha ao registar evento." }, 500);
    }

    return jsonResponse(request, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return jsonResponse(request, { error: message }, 400);
  }
});
