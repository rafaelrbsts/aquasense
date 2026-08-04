/**
 * Simulador de telemetria.
 *
 * Substitui, no MVP, o consumo da API REST que receberia as leituras
 * enviadas pelos ESP32 em campo. A cada ciclo aplica um passeio aleatório
 * sobre pH, temperatura e turbidez, mantendo os valores dentro de limites
 * plausíveis para água subterrânea e tanques de piscicultura.
 */

import { SENSOR_TYPE } from '../utils/waterQuality';

export const SIMULATION_INTERVAL_MS = 5000;

const PH_MIN = 4.8;
const PH_MAX = 9.8;
const PH_MAX_DRIFT = 0.18;

const TEMP_MIN = 24;
const TEMP_MAX = 32;
const TEMP_MAX_DRIFT = 0.25;

/**
 * Turbidez não aceita limite único: um poço vive na casa de poucos NTU e um
 * tanque de piscicultura opera uma ordem de grandeza acima. As amplitudes
 * cruzam de propósito as duas bordas da faixa de criadouro, para o painel
 * mostrar tanto água turva demais quanto limpa demais.
 */
const TURBIDITY_LIMITS = {
  [SENSOR_TYPE.POCO]: { min: 0.2, max: 14, drift: 0.6 },
  [SENSOR_TYPE.CRIADOURO]: { min: 15, max: 95, drift: 3 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const drift = (amplitude) => (Math.random() * 2 - 1) * amplitude;
const round1 = (value) => Math.round(value * 10) / 10;

/** Gera a próxima leitura de um sensor a partir da leitura anterior. */
export function nextReading(sensor, timestamp) {
  const turbidez = TURBIDITY_LIMITS[sensor.type];

  return {
    ...sensor,
    ph: round1(clamp(sensor.ph + drift(PH_MAX_DRIFT), PH_MIN, PH_MAX)),
    temperature: round1(
      clamp(sensor.temperature + drift(TEMP_MAX_DRIFT), TEMP_MIN, TEMP_MAX),
    ),
    turbidity: round1(
      clamp(sensor.turbidity + drift(turbidez.drift), turbidez.min, turbidez.max),
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
