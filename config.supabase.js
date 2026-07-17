// config.supabase.js

window.SUPABASE_URL = "https://uyuutsygidbjlwmurkfl.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dXV0c3lnaWRiamx3bXVya2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzkzMDksImV4cCI6MjA5Mjg1NTMwOX0.i8mm3C70x221lNyEE_fFPsLwTkDvvA0D6aS3nvZMqh4";
window.BACKEND_MODE = "hybrid"; // "hybrid" | "supabase" | "local"
window.SUPABASE_ENABLED = true;
window.LOCAL_FALLBACK_ENABLED = true;
window.METRICS_ENABLED = false;

window.COMPY_USAGE_LOG_ENDPOINT = `${window.SUPABASE_URL}/functions/v1/log-usage`;
