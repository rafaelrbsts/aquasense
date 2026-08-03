/**
 * Regras de negócio de classificação do pH.
 *
 * Poços artesianos (água de consumo):
 *   Ideal   6.5 – 8.5
 *   Alerta  6.0 – 6.4  |  8.6 – 9.0
 *   Crítico < 6.0      |  > 9.0
 *
 * Criadouros de peixes (piscicultura):
 *   Ideal   6.5 – 7.5
 *   Alerta  6.0 – 6.4  |  7.6 – 8.0
 *   Crítico < 6.0      |  > 8.0
 */

export const SENSOR_TYPE = {
  POCO: 'poco',
  CRIADOURO: 'criadouro',
};

export const SENSOR_TYPE_LABEL = {
  [SENSOR_TYPE.POCO]: 'Poço Artesiano',
  [SENSOR_TYPE.CRIADOURO]: 'Criadouro de Peixes',
};

export const STATUS = {
  IDEAL: 'ideal',
  ALERTA: 'alerta',
  CRITICO: 'critico',
};

export const PH_RANGES = {
  [SENSOR_TYPE.POCO]: { ideal: [6.5, 8.5], tolerado: [6.0, 9.0] },
  [SENSOR_TYPE.CRIADOURO]: { ideal: [6.5, 7.5], tolerado: [6.0, 8.0] },
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
 * Determina o status de um sensor a partir do pH lido e do tipo de instalação.
 * @param {number} ph
 * @param {'poco'|'criadouro'} type
 * @returns {'ideal'|'alerta'|'critico'}
 */
export function getPhStatus(ph, type) {
  const ranges = PH_RANGES[type];
  if (!ranges || !Number.isFinite(ph)) return STATUS.CRITICO;

  const value = round1(ph);
  const [idealMin, idealMax] = ranges.ideal;
  const [toleradoMin, toleradoMax] = ranges.tolerado;

  if (value >= idealMin && value <= idealMax) return STATUS.IDEAL;
  if (value >= toleradoMin && value <= toleradoMax) return STATUS.ALERTA;
  return STATUS.CRITICO;
}

/** Texto curto da faixa ideal, usado em popups e cards. */
export function getIdealRangeLabel(type) {
  const [min, max] = PH_RANGES[type].ideal;
  return `${min.toFixed(1)} – ${max.toFixed(1)}`;
}

export const formatPh = (ph) => ph.toFixed(1);

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
