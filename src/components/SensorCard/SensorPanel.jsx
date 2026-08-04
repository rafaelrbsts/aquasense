import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import { SENSOR_TYPE, SENSOR_TYPE_ALL, formatTime } from '../../utils/waterQuality';
import SensorCard from './SensorCard';
import styles from './SensorPanel.module.css';

const FILTERS = [
  { id: SENSOR_TYPE_ALL, label: 'Todos' },
  { id: SENSOR_TYPE.POCO, label: 'Poços' },
  { id: SENSOR_TYPE.CRIADOURO, label: 'Criadouros' },
];

/**
 * O filtro é controlado pelo App porque o mesmo recorte alimenta os marcadores
 * do mapa — clicar em "Poços" precisa esconder os criadouros dos dois lados.
 */
export default function SensorPanel({
  sensors,
  visibleSensors,
  filter,
  onFilterChange,
  selectedId,
  onSelect,
  lastUpdate,
}) {
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
              onClick={() => onFilterChange(id)}
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
