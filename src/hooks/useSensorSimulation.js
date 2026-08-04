import { useEffect, useMemo, useState } from 'react';
import {
  SIMULATION_INTERVAL_MS,
  nextReadingCycle,
  seedReadings,
  startSimulation,
} from '../services/sensorSimulator';
import { STATUS, SENSOR_TYPE, getSensorStatus } from '../utils/waterQuality';

/**
 * Mantém a rede de sensores viva: dispara um ciclo de leituras a cada
 * `intervalMs`, deriva o status de cada sensor pelo pior entre pH e turbidez
 * e consolida os indicadores exibidos no topo do painel.
 */
export function useSensorSimulation(initialSensors, intervalMs = SIMULATION_INTERVAL_MS) {
  const [readings, setReadings] = useState(() => seedReadings(initialSensors));

  useEffect(
    () =>
      startSimulation(
        (timestamp) => setReadings((current) => nextReadingCycle(current, timestamp)),
        intervalMs,
      ),
    [intervalMs],
  );

  const sensors = useMemo(
    () => readings.map((sensor) => ({ ...sensor, status: getSensorStatus(sensor) })),
    [readings],
  );

  const stats = useMemo(() => {
    const count = (predicate) => sensors.filter(predicate).length;
    return {
      total: sensors.length,
      pocos: count((s) => s.type === SENSOR_TYPE.POCO),
      criadouros: count((s) => s.type === SENSOR_TYPE.CRIADOURO),
      alertas: count((s) => s.status !== STATUS.IDEAL),
      criticos: count((s) => s.status === STATUS.CRITICO),
    };
  }, [sensors]);

  const lastUpdate = readings[0]?.lastReading ?? new Date().toISOString();

  return { sensors, stats, lastUpdate };
}
