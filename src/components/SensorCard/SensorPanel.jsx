import { useMemo, useState } from 'react';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import { SENSOR_TYPE, formatTime } from '../../utils/phStatus';
import SensorCard from './SensorCard';
import styles from './SensorPanel.module.css';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: SENSOR_TYPE.POCO, label: 'Poços' },
  { id: SENSOR_TYPE.CRIADOURO, label: 'Criadouros' },
];

export default function SensorPanel({ sensors, selectedId, onSelect, lastUpdate }) {
  const [filter, setFilter] = useState('todos');

  const visibleSensors = useMemo(
    () => (filter === 'todos' ? sensors : sensors.filter((s) => s.type === filter)),
    [sensors, filter],
  );

  return (
    <section className={styles.panel} aria-label="Painel de sensores">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Sensores</h2>
          <span className={styles.count}>
            {visibleSensors.length} de {sensors.length}
          </span>
        </div>
        <div className={styles.filters} role="group" aria-label="Filtrar por tipo">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.filter} ${filter === id ? styles.filterActive : ''}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {visibleSensors.map((sensor) => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            isSelected={sensor.id === selectedId}
            onSelect={onSelect}
          />
        ))}
        {visibleSensors.length === 0 && (
          <p className={styles.empty}>Nenhum sensor para o filtro selecionado.</p>
        )}
      </div>

      <div className={styles.footer}>
        <UpdateOutlinedIcon sx={{ fontSize: 14 }} />
        Última atualização: {formatTime(lastUpdate)}
      </div>
    </section>
  );
}
