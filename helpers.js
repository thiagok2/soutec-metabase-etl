export const DAYS = [
  'NA','SEG','TER','QUA','QUI','SEX','SAB','DOM'
];


export const INTERESSES_RESPOSTA_LABEL = {
  "A": "Estético-Criativo",
  "C":"Organizacional",
  "E":"Empreendedor",
  "I":"Intelectual-Ciêntifico",
  "R":"Técnico-Operacional",
  "S": "Social"
}

export const VALORES_RESPOSTA_LABEL = {
  "AU": "Autonomia",
  "EQ":"Equipe",
  "SU":"Supervisão",
  "CR": "Criatividade",
  "ES":"Estrutura",
  "AP":"Aprendizagem",
  "SE": "Serviço",
  "PO": "Poder"
}

export const ESTADOS =  [
  {uf: "AC", nome: "Acre"},
  {uf: "AL", nome:"Alagoas"},
  {uf: "AP", nome:"Amapá"},
  {uf: "AM", nome:"Amazonas"},
  {uf: "BA", nome:"Bahia"},
  {uf: "CE", nome:"Ceara"},
  {uf: "DF", nome:"Distrito Federal"},
  {uf: "ES", nome:"Espirito Santo"},
  {uf: "GO", nome:"Goiás"},
  {uf: "MA", nome:"Maranhão"},
  {uf: "MT", nome:"Mato Grosso"},
  {uf: "MS", nome:"Mato Grosso do Sul"},
  {uf: "MG", nome:"Minas Gerais"},
  {uf: "PA", nome:"Para"},
  {uf: "PB", nome:"Paraíba"},
  {uf: "PR", nome:"Paraná"},
  {uf: "PE", nome:"Pernambuco"},
  {uf: "PI", nome:"Piauí"},
  {uf: "RJ", nome:"Rio de Janeiro"},
  {uf: "RN", nome:"Rio Grande do Norte"},
  {uf: "RS", nome:"Rio Grande do Sul"},
  {uf: "RO", nome:"Rondônia"},
  {uf: "RR", nome:"Roraima"},
  {uf: "SC", nome:"Santa Catarina"},
  {uf: "SP", nome:"São Paulo"},
  {uf: "SE", nome:"Sergipe"},
  {uf: "TO", nome:"Tocantins"},
];

export function getUfFromNomeEstado(nome){
  if(!nome) return 'NA';

  return (ESTADOS.find(e => e.uf.toLocaleUpperCase() == nome.toLocaleUpperCase())?.uf) || ESTADOS.find(e => e.nome.toLocaleUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, "") == nome.toLocaleUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))?.uf || 'NA';
}

export function isEstadoBrasileiro(nome){
  if(!nome) return false;

  return ESTADOS.some(e => e.uf.toLocaleUpperCase() == nome.toLocaleUpperCase())?.uf || ESTADOS.some(e => e.nome.toLocaleUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, "") == nome.toLocaleUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""));
}

export function isNumeric(num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
}