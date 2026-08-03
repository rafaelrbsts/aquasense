/**
 * Simulador de telemetria.
 *
 * Substitui, no MVP, o consumo da API REST que receberia as leituras
 * enviadas pelos ESP32 em campo. A cada ciclo aplica um passeio aleatório
 * sobre o pH e a temperatura, mantendo os valores dentro de limites
 * plausíveis para água subterrânea e tanques de piscicultura.
 */

export const SIMULATION_INTERVAL_MS = 5000;

const PH_MIN = 4.8;
const PH_MAX = 9.8;
const PH_MAX_DRIFT = 0.18;

const TEMP_MIN = 24;
const TEMP_MAX = 32;
const TEMP_MAX_DRIFT = 0.25;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const drift = (amplitude) => (Math.random() * 2 - 1) * amplitude;
const round1 = (value) => Math.round(value * 10) / 10;

/** Gera a próxima leitura de um sensor a partir da leitura anterior. */
export function nextReading(sensor, timestamp) {
  return {
    ...sensor,
    ph: round1(clamp(sensor.ph + drift(PH_MAX_DRIFT), PH_MIN, PH_MAX)),
    temperature: round1(
      clamp(sensor.temperature + drift(TEMP_MAX_DRIFT), TEMP_MIN, TEMP_MAX),
    ),
    battery: sensor.battery,
    lastReading: timestamp,
  };
}

/** Aplica um ciclo de leitura em toda a rede de sensores. */
export function nextReadingCycle(sensors, timestamp = new Date().toISOString()) {
  return sensors.map((sensor) => nextReading(sensor, timestamp));
}

/** Carimba a base inicial com o horário da primeira leitura. */
export function seedReadings(sensors, timestamp = new Date().toISOString()) {
  return sensors.map((sensor) => ({ ...sensor, lastReading: timestamp }));
}

/**
 * Inicia o ciclo periódico de leituras.
 * @param {Function} onCycle recebe o timestamp de cada novo ciclo
 * @param {number} intervalMs
 * @returns {Function} função de parada
 */
export function startSimulation(onCycle, intervalMs = SIMULATION_INTERVAL_MS) {
  const timerId = setInterval(() => onCycle(new Date().toISOString()), intervalMs);
  return () => clearInterval(timerId);
}
