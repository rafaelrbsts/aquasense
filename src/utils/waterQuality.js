/**
 * Regras de negócio da qualidade da água: pH e turbidez.
 *
 * pH — poços artesianos (água de consumo):
 *   Ideal   6.5 – 8.5
 *   Alerta  6.0 – 6.4  |  8.6 – 9.0
 *   Crítico < 6.0      |  > 9.0
 *
 * pH — criadouros de peixes (piscicultura):
 *   Ideal   6.5 – 7.5
 *   Alerta  6.0 – 6.4  |  7.6 – 8.0
 *   Crítico < 6.0      |  > 8.0
 *
 * Turbidez — poços artesianos, em NTU:
 *   Ideal   ≤ 5     (limite de potabilidade da Portaria GM/MS 888/2021)
 *   Alerta  5.1 – 10
 *   Crítico > 10
 * A faixa é unilateral: em água de consumo, quanto mais limpa, melhor.
 *
 * Turbidez — criadouros de peixes, em NTU:
 *   Ideal   25 – 80
 *   Crítico < 25  |  > 80
 * Aqui a faixa é bilateral, e a borda de baixo não é um detalhe: água limpa
 * demais tem pouca produtividade primária e favorece a planta aquática, do
 * mesmo modo que turbidez alta demais bloqueia a luz. Como não há banda de
 * tolerância, a turbidez de criadouro nunca fica em "alerta" — só ideal ou
 * crítica.
 */

export const SENSOR_TYPE = {
  POCO: 'poco',
  CRIADOURO: 'criadouro',
};

export const SENSOR_TYPE_LABEL = {
  [SENSOR_TYPE.POCO]: 'Poço Artesiano',
  [SENSOR_TYPE.CRIADOURO]: 'Criadouro de Peixes',
};

/** Valor do filtro de tipo que dispensa qualquer recorte. */
export const SENSOR_TYPE_ALL = 'todos';

/**
 * Recorta a rede pelo tipo escolhido no painel. O resultado alimenta ao mesmo
 * tempo a lista lateral e os marcadores do mapa.
 * @param {Array} sensors
 * @param {'todos'|'poco'|'criadouro'} type
 */
export function filterSensorsByType(sensors, type) {
  return type === SENSOR_TYPE_ALL ? sensors : sensors.filter((sensor) => sensor.type === type);
}

export const STATUS = {
  IDEAL: 'ideal',
  ALERTA: 'alerta',
  CRITICO: 'critico',
};

export const PH_RANGES = {
  [SENSOR_TYPE.POCO]: { ideal: [6.5, 8.5], tolerado: [6.0, 9.0] },
  [SENSOR_TYPE.CRIADOURO]: { ideal: [6.5, 7.5], tolerado: [6.0, 8.0] },
};

/** Turbidez em NTU. Criadouro não tem banda de tolerância: `tolerado` = `ideal`. */
export const TURBIDITY_RANGES = {
  [SENSOR_TYPE.POCO]: { ideal: [0, 5], tolerado: [0, 10] },
  [SENSOR_TYPE.CRIADOURO]: { ideal: [25, 80], tolerado: [25, 80] },
};

export const STATUS_META = {
  [STATUS.IDEAL]: {
    label: 'Ideal',
    color: 'var(--status-ideal)',
    background: 'var(--status-ideal-bg)',
    description: 'Leitura dentro da faixa recomendada',
  },
  [STATUS.ALERTA]: {
    label: 'Alerta',
    color: 'var(--status-alerta)',
    background: 'var(--status-alerta-bg)',
    description: 'Leitura fora do ideal, requer atenção',
  },
  [STATUS.CRITICO]: {
    label: 'Crítico',
    color: 'var(--status-critico)',
    background: 'var(--status-critico-bg)',
    description: 'Leitura crítica, intervenção imediata',
  },
};

/** Evita erros de ponto flutuante nas comparações de faixa (ex.: 6.4999). */
const round1 = (value) => Math.round(value * 10) / 10;

/**
 * Classifica uma leitura contra uma tabela de faixas. Quando `tolerado` é igual
 * a `ideal` — caso da turbidez em criadouro — não existe banda de alerta e o
 * resultado é apenas ideal ou crítico.
 * @param {number} value
 * @param {{ideal: number[], tolerado: number[]}} ranges
 * @returns {'ideal'|'alerta'|'critico'}
 */
function classify(value, ranges) {
  if (!ranges || !Number.isFinite(value)) return STATUS.CRITICO;

  const reading = round1(value);
  const [idealMin, idealMax] = ranges.ideal;
  const [toleradoMin, toleradoMax] = ranges.tolerado;

  if (reading >= idealMin && reading <= idealMax) return STATUS.IDEAL;
  if (reading >= toleradoMin && reading <= toleradoMax) return STATUS.ALERTA;
  return STATUS.CRITICO;
}

/**
 * Status a partir do pH lido e do tipo de instalação.
 * @param {number} ph
 * @param {'poco'|'criadouro'} type
 */
export function getPhStatus(ph, type) {
  return classify(ph, PH_RANGES[type]);
}

/**
 * Status a partir da turbidez lida, em NTU, e do tipo de instalação.
 * @param {number} ntu
 * @param {'poco'|'criadouro'} type
 */
export function getTurbidityStatus(ntu, type) {
  return classify(ntu, TURBIDITY_RANGES[type]);
}

/** Severidade crescente — define qual parâmetro prevalece no status do sensor. */
const SEVERITY = [STATUS.IDEAL, STATUS.ALERTA, STATUS.CRITICO];

/**
 * Status consolidado do sensor: o pior entre pH e turbidez. Um poço com pH
 * perfeito e turbidez acima do limite de potabilidade continua sendo um
 * problema, então a cor tem de acompanhar o parâmetro mais grave.
 * @param {{ph: number, turbidity: number, type: string}} sensor
 */
export function getSensorStatus({ ph, turbidity, type }) {
  const rank = Math.max(
    SEVERITY.indexOf(getPhStatus(ph, type)),
    SEVERITY.indexOf(getTurbidityStatus(turbidity, type)),
  );
  return SEVERITY[rank];
}

/** Texto curto da faixa ideal de pH, usado em popups e cards. */
export function getIdealRangeLabel(type) {
  const [min, max] = PH_RANGES[type].ideal;
  return `${min.toFixed(1)} – ${max.toFixed(1)}`;
}

/**
 * Texto curto da faixa ideal de turbidez. Poço começa em zero, então lê melhor
 * como um teto ("≤ 5 NTU") do que como intervalo.
 */
export function getIdealTurbidityLabel(type) {
  const [min, max] = TURBIDITY_RANGES[type].ideal;
  return min === 0 ? `≤ ${max} NTU` : `${min} – ${max} NTU`;
}

export const formatPh = (ph) => ph.toFixed(1);

export const formatTurbidity = (ntu) => `${ntu.toFixed(1)} NTU`;

export const formatTemperature = (celsius) => `${celsius.toFixed(1)} °C`;

export const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
