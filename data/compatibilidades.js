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
{ id: "dexmedetomidina", nome: "Dexmedetomidina" },
{ id: "dinitrato_isossorbida", nome: "Dinitrato de Isossorbida" },
{ id: "dobutamina_cloridrato", nome: "Dobutamina (Cloridrato)" },
{ id: "dopamina_cloridrato", nome: "Dopamina (Cloridrato)" },
{ id: "esmolol_cloridrato", nome: "Esmolol (Cloridrato)" },
{ id: "fentanilo_citrato", nome: "Fentanilo (Citrato)" },
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
{ id: "nitroprussiato_sodio", nome: "Nitroprussiato de Sódio" },
{ id: "noradrenalina_bitartarato", nome: "Noradrenalina (Bitartarato)" },
{ id: "nutricao_parenterica_binaria", nome: "Nutrição Parentérica Binária" },
{ id: "nutricao_parenterica_com_lipidos", nome: "Nutrição Parentérica com Lípidos" },
{ id: "octreotido_acetato", nome: "Octreótido (Acetato)" },
{ id: "omeprazol_sodico", nome: "Omeprazol (Sódico)" },
{ id: "piperacilina_sodica", nome: "Piperacilina (Sódica)" },
{ id: "piperacilina_sodica_tazobactam", nome: "Piperacilina (Sódica) + Tazobactam" },
{ id: "propofol", nome: "Propofol" },
{ id: "remifentanilo_cloridrato", nome: "Remifentanilo (Cloridrato)" },
{ id: "ringer_lactato", nome: "Ringer Lactato" },
{ id: "rocuronio_brometo", nome: "Rocurónio (Brometo)" },
{ id: "sufentanilo_citrato", nome: "Sufentanilo (Citrato)" },
{ id: "sulfato_magnesio", nome: "Sulfato de Magnésio" },
{ id: "tacrolimus", nome: "Tacrolimus" },
{ id: "vancomicina_cloridrato", nome: "Vancomicina (Cloridrato)" },
{ id: "vasopressina", nome: "Vasopressina" }
];
const COMPATIBILIDADE_POR_DROGA = {
  "glucose_5": {
    compativel: [
      "heparina_sodica",
      "insulina",
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
      "remifentanilo_cloridrato",
      "rocuronio_brometo",
      "sufentanilo_citrato",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
    ],
    variavel: []
  },
  "nutricao_parenterica_com_lipidos": {
    compativel: [
      "octreotido_acetato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "rocuronio_brometo"
    ],
    variavel: [
    ]
  },
  "nutricao_parenterica_binaria": {
    compativel: [
      "octreotido_acetato",
      "omeprazol_sodico",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
    ],
    variavel: [
      "propofol"
    ]
  },
  "ringer_lactato": {
    compativel: [
      "rocuronio_brometo",
      "vancomicina_cloridrato"
    ],
    incompativel: [
    ],
    variavel: []
  },
  "cloreto_sodio_0_9": {
    compativel: [
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "dinitrato_isossorbida",
      "metotrexato_sodico",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "octreotido_acetato",
      "omeprazol_sodico",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "remifentanilo_cloridrato",
      "rocuronio_brometo",
      "sufentanilo_citrato",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
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
      "remifentanilo_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
      "amiodarona_cloridrato",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
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
      "insulina",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "remifentanilo_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
      "heparina_sodica",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "sufentanilo_citrato"
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
    ],
    incompativel: [],
    variavel: []
  },
  "dexmedetomidina": {
    compativel: [
      "glucose_5",
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "gluconato_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "isoprenalina_cloridrato",
      "labetalol_cloridrato",
      "levosimendan",
      "manitol",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "remifentanilo_cloridrato",
      "rocuronio_brometo",
      "sufentanilo_citrato",
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
      "dopamina_cloridrato",
      "isoprenalina_cloridrato",
      "labetalol_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "propofol",
      "remifentanilo_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "gluconato_calcio",
      "piperacilina_sodica_tazobactam",
      "fosfato_potassio",
    ],
    variavel: [
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
      "esmolol_cloridrato",
      "labetalol_cloridrato",
      "manitol",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica_tazobactam",
      "remifentanilo_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
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
      "remifentanilo_cloridrato",
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
      "heparina_sodica",
      "insulina",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "fosfato_potassio",
      "propofol",
      "remifentanilo_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: [
      "furosemida",
    ]
  },
  "furosemida": {
    compativel: [
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "gluconato_calcio",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "levosimendan",
      "manitol",
      "metotrexato_sodico",
      "noradrenalina_bitartarato",
      "omeprazol_sodico",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "sufentanilo_citrato",
      "tacrolimus"
    ],
    incompativel: [
      "glucose_5",
      "labetalol_cloridrato",
      "rocuronio_brometo",
      "vancomicina_cloridrato"
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "remifentanilo_cloridrato",
      "vasopressina"
    ]
  },
  "heparina_sodica": {
    compativel: [
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "insulina",
      "isoprenalina_cloridrato",
      "levosimendan",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "remifentanilo_cloridrato",
      "sufentanilo_citrato",
      "tacrolimus",
      "vasopressina"
    ],
    incompativel: [
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
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
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "tacrolimus",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "labetalol_cloridrato",
      "rocuronio_brometo"
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "noradrenalina_bitartarato",
      "remifentanilo_cloridrato"
    ]
  },
  "isoprenalina_cloridrato": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "propofol",
      "remifentanilo_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
    ],
    variavel: []
  },
  "dinitrato_isossorbida": {
    compativel: [
      "glucose_5",
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
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "isoprenalina_cloridrato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica_tazobactam",
      "cloreto_potassio",
      "propofol",
      "sufentanilo_citrato",
      "vancomicina_cloridrato",
      "vasopressina"
    ],
    incompativel: [
      "ringer_lactato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "fosfato_potassio",
    ],
    variavel: [
      "piperacilina_sodica"
    ]
  },
  "labetalol_cloridrato": {
    compativel: [
      "ringer_lactato",
      "midazolam_cloridrato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "propofol",
      "vancomicina_cloridrato"
    ],
    incompativel: [
    ],
    variavel: [
    ]
  },
  "levosimendan": {
    compativel: [
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
      "piperacilina_sodica_tazobactam",
      "propofol",
      "remifentanilo_cloridrato",
    ],
    incompativel: [],
    variavel: []
  },
  "metotrexato_sodico": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "piperacilina_sodica_tazobactam"
    ],
    incompativel: [
      "nutricao_parenterica_binaria",
      "midazolam_cloridrato",
      "propofol",
      "vancomicina_cloridrato"
    ],
    variavel: [
    ]
  },
  "midazolam_cloridrato": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "ringer_lactato",
      "morfina_sulfato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "remifentanilo_cloridrato",
      "rocuronio_brometo",
      "sufentanilo_citrato",
      "vancomicina_cloridrato"
    ],
    incompativel: [
      "omeprazol_sodico",
    ],
    variavel: [
      "nutricao_parenterica_binaria",
      "propofol"
    ]
  },
  "morfina_sulfato": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "noradrenalina_bitartarato",
      "piperacilina_sodica",
      "piperacilina_sodica_tazobactam",
      "remifentanilo_cloridrato",
      "tacrolimus",
      "vancomicina_cloridrato"
    ],
    incompativel: [
    ],
    variavel: [
      "propofol"
    ]
  },
  "nitroprussiato_sodio": {
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
    "esmolol_cloridrato",
    "heparina_sodica",
    "insulina",
    "labetalol_cloridrato",
    "midazolam_cloridrato",
    "morfina_sulfato",
    "propofol",
    "tacrolimus"
  ],
  incompativel: [],
  variavel: []
},
  "noradrenalina_bitartarato": {
    compativel: [
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria",
      "ringer_lactato",
      "propofol",
      "remifentanilo_cloridrato",
      "sufentanilo_citrato",
      "vasopressina"
    ],
    incompativel: [
    ],
    variavel: [
    ]
  },
  "octreotido_acetato": {
    compativel: [
      "ringer_lactato",
    ],
    incompativel: [],
    variavel: []
  },
  "omeprazol_sodico": {
    compativel: [
    ],
    incompativel: [
      "vancomicina_cloridrato"
    ],
    variavel: []
  },
  "piperacilina_sodica": {
    compativel: [
      "ringer_lactato",
      "propofol",
      "remifentanilo_cloridrato",
      "tacrolimus"
    ],
    incompativel: [
    ],
    variavel: [
      "vancomicina_cloridrato"
    ]
  },
  "piperacilina_sodica_tazobactam": {
    compativel: [
      "ringer_lactato",
      "remifentanilo_cloridrato",
      "vasopressina"
    ],
    incompativel: [
    ],
    variavel: [
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
      "gluconato_calcio",
      "dexmedetomidina",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
      "esmolol_cloridrato",
      "furosemida",
      "heparina_sodica",
      "insulina",
      "isoprenalina_cloridrato",
      "labetalol_cloridrato",
      "manitol",
      "midazolam_cloridrato",
      "piperacilina_sodica_tazobactam",
      "propofol",
      "remifentanilo_cloridrato",
      "tacrolimus"
    ],
    incompativel: [],
    variavel: [
    ]
  },
  "fosfato_potassio": {
    compativel: [
      "ringer_lactato",
      "heparina_sodica",
      "insulina",
      "labetalol_cloridrato",
      "midazolam_cloridrato",
      "propofol",
      "remifentanilo_cloridrato",
      "sufentanilo_citrato"
    ],
    incompativel: [
      "gluconato_calcio",
      "furosemida",
    ],
    variavel: [
      "nutricao_parenterica_com_lipidos",
      "nutricao_parenterica_binaria"
    ]
  },
  "propofol": {
    compativel: [
      "sufentanilo_citrato"
    ],
    incompativel: [
      "ringer_lactato",
    ],
    variavel: [
      "remifentanilo_cloridrato",
      "vancomicina_cloridrato"
    ]
  },
  "remifentanilo_cloridrato": {
    compativel: [
      "ringer_lactato",
      "rocuronio_brometo",
      "sufentanilo_citrato",
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: [
    ]
  },
  "rocuronio_brometo": {
    compativel: [
    ],
    incompativel: [
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
      "gluconato_calcio",
      "dobutamina_cloridrato",
      "dopamina_cloridrato",
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
  "sufentanilo_citrato": {
    compativel: [
      "vancomicina_cloridrato"
    ],
    incompativel: [
    ],
    variavel: []
  },
  "tacrolimus": {
    compativel: [
      "vancomicina_cloridrato"
    ],
    incompativel: [],
    variavel: [
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
    ],
    incompativel: [
    ],
    variavel: [
    ]
  },
  "vasopressina": {
    compativel: [
    ],
    incompativel: [],
    variavel: [
    ]
  }
};
