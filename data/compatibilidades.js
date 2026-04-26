// ficheiro de dados de compatibilidade
const MEDICAMENTOS = [
{ id: "acido_tranexamico", nome: "Ácido Tranexâmico" },
{ id: "adrenalina", nome: "Adrenalina" },
{ id: "albumina_humana_20", nome: "Albumina Humana 20%" },
{ id: "alteplase", nome: "Alteplase" },
{ id: "aminofilina", nome: "Aminofilina" },
{ id: "amiodarona_cloridrato", nome: "Amiodarona (Cloridrato)" },
{ id: "bicarbonato_sodio", nome: "Bicarbonato de Sódio" },
{ id: "cetamina_cloridrato", nome: "Cetamina (Cloridrato)" },
{ id: "ciclofosfamida", nome: "Ciclofosfamida" },
{ id: "cloreto_calcio", nome: "Cloreto de Cálcio" },
{ id: "cloreto_potassio", nome: "Cloreto de Potássio" },
{ id: "cloreto_sodio_0_9", nome: "Cloreto de Sódio 0,9%" },
{ id: "dantroleno_sodico", nome: "Dantroleno (Sódico)" },
{ id: "dexmedetomidina", nome: "Dexmedetomidina" },
{ id: "dinitrato_isossorbida", nome: "Dinitrato de Isossorbida" },
{ id: "dobutamina_cloridrato", nome: "Dobutamina (Cloridrato)" },
{ id: "dopamina_cloridrato", nome: "Dopamina (Cloridrato)" },
{ id: "esmolol_cloridrato", nome: "Esmolol (Cloridrato)" },
{ id: "fosfato_potassio", nome: "Fosfato de Potássio" },
{ id: "furosemida", nome: "Furosemida" },
{ id: "glucose_5", nome: "Glucose 5%" },
{ id: "gluconato_calcio", nome: "Gluconato de Cálcio" },
{ id: "heparina_sodica", nome: "Heparina (Sódica)" },
{ id: "insulina", nome: "Insulina" },
{ id: "isoprenalina_cloridrato", nome: "Isoprenalina (Cloridrato)" },
{ id: "labetalol_cloridrato", nome: "Labetalol (Cloridrato)" },
{ id: "levosimendan", nome: "Levosimendan" },
{ id: "manitol", nome: "Manitol" },
{ id: "metotrexato_sodico", nome: "Metotrexato (Sódico)" },
{ id: "midazolam_cloridrato", nome: "Midazolam (Cloridrato)" },
{ id: "morfina_sulfato", nome: "Morfina (Sulfato)" },
{ id: "noradrenalina_bitartarato", nome: "Noradrenalina (Bitartarato)" },
{ id: "nutricao_parenterica_binaria", nome: "Nutrição Parentérica Binária" },
{ id: "nutricao_parenterica_com_lipidos", nome: "Nutrição Parentérica com Lípidos" },
{ id: "octreotido_acetato", nome: "Octreótido (Acetato)" },
{ id: "omeprazol_sodico", nome: "Omeprazol (Sódico)" },
{ id: "piperacilina_sodica", nome: "Piperacilina (Sódica)" },
{ id: "piperacilina_sodica_tazobactam", nome: "Piperacilina (Sódica) + Tazobactam" },
{ id: "propofol", nome: "Propofol" },
{ id: "remifentanil_cloridrato", nome: "Remifentanil (Cloridrato)" },
{ id: "ringer_lactato", nome: "Ringer Lactato" },
{ id: "rocuronio_brometo", nome: "Rocurónio (Brometo)" },
{ id: "sufentanil_citrato", nome: "Sufentanil (Citrato)" },
{ id: "sulfato_magnesio", nome: "Sulfato de Magnésio" },
{ id: "tacrolimus", nome: "Tacrolimus" },
{ id: "vancomicina_cloridrato", nome: "Vancomicina (Cloridrato)" },
{ id: "vasopressina", nome: "Vasopressina" }
];
    const COMPATIBILIDADE_POR_DROGA = {
const COMPATIBILIDADE_POR_DROGA = {
  "glucose_5": {
    compativel: [
      "aminofilina",
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "gluconato_calcio",
      "ciclofosfamida",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "heparina_sodica",
      "insulina",
      "dinitrato_isossorbida",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "levosimendan",
      "metotrexato_sodico",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "octreotido_acetato",
      "omeprazol_sodico",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "remifentanil_cloridrato",
      "rocuronio_brometo",
      "bicarbonato_sodio",
      "sufentanil_citrato",
      "tacrolimus",
      "acido_tranexamico",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "alteplase",
      "furosemida"
    ],
    variavel: []
  },
  "nutricao_parenterica_com_lipidos": {
    compativel: [
      "aminofilina",
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "gluconato_calcio",
      "ciclofosfamida",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "manitol",
      "metotrexato_sodico",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "octreotido_acetato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "bicarbonato_sodio",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "albumina_humana_20",
      "rocuronio_brometo"
    ],
    variavel: [
      "furosemida",
      "heparina_sodica",
      "insulina",
      "fosfato_potassio"
    ]
  },
  "nutricao_parenterica_binaria": {
    compativel: [
      "aminofilina",
      "cloreto_calcio",
      "gluconato_calcio",
      "ciclofosfamida",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "furosemida",
      "heparina_sodica",
      "albumina_humana_20",
      "insulina",
      "manitol",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "octreotido_acetato",
      "omeprazol_sodico",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "tacrolimus",
      "acido_tranexamico",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "amiodarona_cloridrato",
      "metotrexato_sodico",
      "bicarbonato_sodio"
    ],
    variavel: [
      "midazolam_cloridrato",
      "fosfato_potassio",
      "propofol"
    ]
  },
  "ringer_lactato": {
    compativel: [
      "aminofilina",
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "albumina_humana_20",
      "insulina",
      "isoprenalina_cloridrato",
      "labetalol_cloridrato",
      "manitol",
      "metotrexato_sodico",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "octreotido_acetato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "fosfato_potassio",
      "remifentanil_cloridrato",
      "rocuronio_brometo",
      "bicarbonato_sodio",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "cetamina_cloridrato",
      "propofol"
    ],
    variavel: []
  },
  "cloreto_sodio_0_9": {
    compativel: [
      "alteplase",
      "aminofilina",
      "cloreto_calcio",
      "gluconato_calcio",
      "ciclofosfamida",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "dinitrato_isossorbida",
      "cetamina_cloridrato",
      "metotrexato_sodico",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "octreotido_acetato",
      "omeprazol_sodico",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "remifentanil_cloridrato",
      "rocuronio_brometo",
      "bicarbonato_sodio",
      "sufentanil_citrato",
      "tacrolimus",
      "acido_tranexamico",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "amiodarona_cloridrato"
    ],
    variavel: []
  },
  "alteplase": {
    compativel: [
      "cloreto_sodio_0_9"
    ],
    incompativel: [
      "glucose_5",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "heparina_sodica",
      "morfina_sulfato"
    ],
    variavel: []
  },
  "aminofilina": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "esmolol_cloridrato",
      "furosemida",
      "labetalol_cloridrato",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
      "amiodarona_cloridrato",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "vancomicina_cloridrato"
    ],
    variavel: [
      "midazolam_cloridrato"
    ]
  },
  "amiodarona_cloridrato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "gluconato_calcio",
      "dexmedetomidina",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "morfina_sulfato",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "nutricao_parenterica_binaria",
      "cloreto_sodio_0_9",
      "aminofilina",
      "heparina_sodica",
      "piperacilina_sodica",
      "fosfato_potassio",
      "bicarbonato_sodio"
    ],
    variavel: [
      "dobutamina_cloridrato",
      "furosemida",
      "insulina",
      "midazolam_cloridrato",
      "noradrenalina_bitartarato",
      "cloreto_potassio"
    ]
  },
  "cloreto_calcio": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "insulina",
      "vasopressina"
    ],
    incompativel: [
      "fosfato_potassio",
      "propofol"
    ],
    variavel: [
      "heparina_sodica"
    ]
  },
  "gluconato_calcio": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "dexmedetomidina",
      "furosemida",
      "insulina",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
      "dobutamina_cloridrato",
      "heparina_sodica",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "fosfato_potassio",
      "bicarbonato_sodio",
      "sufentanil_citrato"
    ],
    variavel: []
  },
  "ciclofosfamida": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "cloreto_sodio_0_9",
      "metotrexato_sodico",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "bicarbonato_sodio"
    ],
    incompativel: [],
    variavel: []
  },
  "dantroleno_sodico": {
    compativel: [],
    incompativel: [],
    variavel: []
  },
  "dexmedetomidina": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "aminofilina",
      "amiodarona_cloridrato",
      "gluconato_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "albumina_humana_20",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "levosimendan",
      "manitol",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "rocuronio_brometo",
      "bicarbonato_sodio",
      "sufentanil_citrato",
      "acido_tranexamico",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: []
  },
  "dobutamina_cloridrato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "cloreto_calcio",
      "dexmedetomidina",
      "dopamina_cloridrato",
      "adrenalina",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "alteplase",
      "aminofilina",
      "gluconato_calcio",
      "piperacilina_sodica_tazobactam",
      "fosfato_potassio",
      "bicarbonato_sodio"
    ],
    variavel: [
      "amiodarona_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "midazolam_cloridrato"
    ]
  },
  "dopamina_cloridrato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "manitol",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "remifentanil_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "alteplase",
      "aminofilina",
      "bicarbonato_sodio"
    ],
    variavel: [
      "furosemida",
      "heparina_sodica",
      "insulina",
      "propofol"
    ]
  },
  "adrenalina": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "levosimendan",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "aminofilina",
      "bicarbonato_sodio"
    ],
    variavel: []
  },
  "esmolol_cloridrato": {
    compativel: [
      "glucose_5",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "aminofilina",
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "dexmedetomidina",
      "dopamina_cloridrato",
      "adrenalina",
      "heparina_sodica",
      "albumina_humana_20",
      "insulina",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "cloreto_potassio",
      "fosfato_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: [
      "furosemida",
      "bicarbonato_sodio"
    ]
  },
  "furosemida": {
    compativel: [
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "aminofilina",
      "gluconato_calcio",
      "dexmedetomidina",
      "adrenalina",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "dinitrato_isossorbida",
      "levosimendan",
      "manitol",
      "metotrexato_sodico",
      "noradrenalina_bitartarato",
      "omeprazol_sodico",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "bicarbonato_sodio",
      "sufentanil_citrato",
      "tacrolimus"
    ],
    incompativel: [
      "glucose_5",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "fosfato_potassio",
      "rocuronio_brometo",
      "vancomicina_cloridrato"
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "amiodarona_cloridrato",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "remifentanil_cloridrato",
      "vasopressina"
    ]
  },
  "heparina_sodica": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "insulina",
      "isoprenalina_cloridrato",
      "levosimendan",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "fosfato_potassio",
      "remifentanil_cloridrato",
      "bicarbonato_sodio",
      "sufentanil_citrato",
      "tacrolimus",
      "acido_tranexamico",
      "vasopressina"
    ],
    incompativel: [
      "alteplase",
      "amiodarona_cloridrato",
      "gluconato_calcio",
      "cetamina_cloridrato"
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "cloreto_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "labetalol_cloridrato",
      "metotrexato_sodico",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "propofol",
      "vancomicina_cloridrato"
    ]
  },
  "albumina_humana_20": {
    compativel: [
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "dexmedetomidina",
      "esmolol_cloridrato",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "nutricao_parenterica_com_lipidos",
      "labetalol_cloridrato",
      "midazolam_cloridrato"
    ],
    variavel: []
  },
  "insulina": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "cloreto_calcio",
      "gluconato_calcio",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "dinitrato_isossorbida",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "fosfato_potassio",
      "propofol",
      "bicarbonato_sodio",
      "tacrolimus",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "rocuronio_brometo"
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "amiodarona_cloridrato",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "noradrenalina_bitartarato",
      "remifentanil_cloridrato"
    ]
  },
  "isoprenalina_cloridrato": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "furosemida",
      "heparina_sodica",
      "cetamina_cloridrato",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
      "aminofilina"
    ],
    variavel: []
  },
  "dinitrato_isossorbida": {
    compativel: [
      "glucose_5",
      "cloreto_sodio_0_9",
      "furosemida",
      "insulina",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: []
  },
  "cetamina_cloridrato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "isoprenalina_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "sufentanil_citrato",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "ringer_lactato",
      "aminofilina",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "fosfato_potassio",
      "bicarbonato_sodio"
    ],
    variavel: [
      "piperacilina_sodica"
    ]
  },
  "labetalol_cloridrato": {
    compativel: [
      "glucose_5",
      "ringer_lactato",
      "aminofilina",
      "amiodarona_cloridrato",
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "cloreto_potassio",
      "fosfato_potassio",
      "propofol",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "furosemida",
      "albumina_humana_20",
      "insulina",
      "bicarbonato_sodio"
    ],
    variavel: [
      "heparina_sodica"
    ]
  },
  "levosimendan": {
    compativel: [
      "glucose_5",
      "dexmedetomidina",
      "adrenalina",
      "furosemida",
      "heparina_sodica",
      "midazolam_cloridrato",
      "morfina_sulfato"
    ],
    incompativel: [],
    variavel: []
  },
  "manitol": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "dexmedetomidina",
      "dopamina_cloridrato",
      "furosemida",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "bicarbonato_sodio"
    ],
    incompativel: [],
    variavel: []
  },
  "metotrexato_sodico": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "ciclofosfamida",
      "furosemida",
      "piperacilina_sodica_tazobactam"
    ],
    incompativel: [
      "nutricao_parenterica_binaria",
      "midazolam_cloridrato",
      "propofol",
      "vancomicina_cloridrato"
    ],
    variavel: [
      "heparina_sodica"
    ]
  },
  "midazolam_cloridrato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "gluconato_calcio",
      "dexmedetomidina",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "insulina",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "levosimendan",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "cloreto_potassio",
      "fosfato_potassio",
      "remifentanil_cloridrato",
      "rocuronio_brometo",
      "sufentanil_citrato",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "albumina_humana_20",
      "metotrexato_sodico",
      "omeprazol_sodico",
      "bicarbonato_sodio"
    ],
    variavel: [
      "nutricao_parenterica_binaria",
      "aminofilina",
      "amiodarona_cloridrato",
      "dobutamina_cloridrato",
      "furosemida",
      "heparina_sodica",
      "propofol"
    ]
  },
  "morfina_sulfato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "insulina",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "levosimendan",
      "midazolam_cloridrato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "remifentanil_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "alteplase",
      "aminofilina",
      "gluconato_calcio",
      "bicarbonato_sodio"
    ],
    variavel: [
      "furosemida",
      "heparina_sodica",
      "propofol"
    ]
  },
  "noradrenalina_bitartarato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "propofol",
      "remifentanil_cloridrato",
      "sufentanil_citrato",
      "vasopressina"
    ],
    incompativel: [
      "aminofilina",
      "gluconato_calcio",
      "bicarbonato_sodio"
    ],
    variavel: [
      "amiodarona_cloridrato",
      "insulina"
    ]
  },
  "octreotido_acetato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9"
    ],
    incompativel: [],
    variavel: []
  },
  "omeprazol_sodico": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_binaria",
      "cloreto_sodio_0_9",
      "furosemida"
    ],
    incompativel: [
      "midazolam_cloridrato",
      "vancomicina_cloridrato"
    ],
    variavel: []
  },
  "piperacilina_sodica": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "esmolol_cloridrato",
      "heparina_sodica",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "propofol",
      "remifentanil_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
      "amiodarona_cloridrato",
      "bicarbonato_sodio"
    ],
    variavel: [
      "cetamina_cloridrato",
      "vancomicina_cloridrato"
    ]
  },
  "piperacilina_sodica_tazobactam": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "aminofilina",
      "gluconato_calcio",
      "ciclofosfamida",
      "dexmedetomidina",
      "dopamina_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "cetamina_cloridrato",
      "manitol",
      "metotrexato_sodico",
      "morfina_sulfato",
      "cloreto_potassio",
      "remifentanil_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "dobutamina_cloridrato"
    ],
    variavel: [
      "bicarbonato_sodio",
      "vancomicina_cloridrato"
    ]
  },
  "cloreto_potassio": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "aminofilina",
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "manitol",
      "midazolam_cloridrato",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "remifentanil_cloridrato",
      "bicarbonato_sodio",
      "tacrolimus"
    ],
    incompativel: [],
    variavel: [
      "amiodarona_cloridrato"
    ]
  },
  "fosfato_potassio": {
    compativel: [
      "ringer_lactato",
      "esmolol_cloridrato",
      "heparina_sodica",
      "insulina",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "propofol",
      "remifentanil_cloridrato",
      "sufentanil_citrato"
    ],
    incompativel: [
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "gluconato_calcio",
      "dobutamina_cloridrato",
      "furosemida",
      "cetamina_cloridrato",
      "bicarbonato_sodio"
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria"
    ]
  },
  "propofol": {
    compativel: [
      "aminofilina",
      "gluconato_calcio",
      "ciclofosfamida",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "furosemida",
      "insulina",
      "isoprenalina_cloridrato",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "manitol",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "cloreto_potassio",
      "fosfato_potassio",
      "bicarbonato_sodio",
      "sufentanil_citrato"
    ],
    incompativel: [
      "ringer_lactato",
      "cloreto_calcio",
      "metotrexato_sodico"
    ],
    variavel: [
      "nutricao_parenterica_binaria",
      "dopamina_cloridrato",
      "heparina_sodica",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "remifentanil_cloridrato",
      "vancomicina_cloridrato"
    ]
  },
  "remifentanil_cloridrato": {
    compativel: [
      "glucose_5",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "aminofilina",
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "heparina_sodica",
      "isoprenalina_cloridrato",
      "manitol",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "fosfato_potassio",
      "rocuronio_brometo",
      "sufentanil_citrato",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: [
      "furosemida",
      "insulina",
      "propofol"
    ]
  },
  "rocuronio_brometo": {
    compativel: [
      "glucose_5",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "midazolam_cloridrato",
      "remifentanil_cloridrato"
    ],
    incompativel: [
      "nutricao_parenterica_com_lipidos",
      "furosemida",
      "insulina",
      "vancomicina_cloridrato"
    ],
    variavel: []
  },
  "bicarbonato_sodio": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "ciclofosfamida",
      "dexmedetomidina",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "manitol",
      "cloreto_potassio",
      "propofol",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "nutricao_parenterica_binaria",
      "amiodarona_cloridrato",
      "gluconato_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "fosfato_potassio"
    ],
    variavel: [
      "esmolol_cloridrato",
      "piperacilina_sodica_tazobactam",
      "tacrolimus"
    ]
  },
  "sufentanil_citrato": {
    compativel: [
      "glucose_5",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "furosemida",
      "heparina_sodica",
      "cetamina_cloridrato",
      "midazolam_cloridrato",
      "noradrenalina_bitartarato",
      "fosfato_potassio",
      "propofol",
      "remifentanil_cloridrato",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "gluconato_calcio"
    ],
    variavel: []
  },
  "tacrolimus": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "cloreto_sodio_0_9",
      "aminofilina",
      "gluconato_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "morfina_sulfato",
      "piperacilina_sodica",
      "cloreto_potassio",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: [
      "bicarbonato_sodio"
    ]
  },
  "acido_tranexamico": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_binaria",
      "cloreto_sodio_0_9",
      "dexmedetomidina",
      "heparina_sodica"
    ],
    incompativel: [],
    variavel: []
  },
  "vancomicina_cloridrato": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "cloreto_sodio_0_9",
      "amiodarona_cloridrato",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "esmolol_cloridrato",
      "albumina_humana_20",
      "insulina",
      "dinitrato_isossorbida",
      "cetamina_cloridrato",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "remifentanil_cloridrato",
      "bicarbonato_sodio",
      "sufentanil_citrato",
      "tacrolimus"
    ],
    incompativel: [
      "aminofilina",
      "furosemida",
      "metotrexato_sodico",
      "omeprazol_sodico",
      "rocuronio_brometo"
    ],
    variavel: [
      "heparina_sodica",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "propofol"
    ]
  },
  "vasopressina": {
    compativel: [
      "amiodarona_cloridrato",
      "cloreto_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "adrenalina",
      "heparina_sodica",
      "insulina",
      "cetamina_cloridrato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica_tazobactam",
      "bicarbonato_sodio"
    ],
    incompativel: [],
    variavel: [
      "furosemida"
    ]
  }
};
