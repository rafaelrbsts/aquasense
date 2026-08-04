import WaterOutlinedIcon from '@mui/icons-material/WaterOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';
import {
  SENSOR_TYPE,
  SENSOR_TYPE_LABEL,
  STATUS,
  STATUS_META,
  formatPh,
  formatTurbidity,
  getPhStatus,
  getTurbidityStatus,
} from '../../utils/waterQuality';
import styles from './SensorCard.module.css';

export default function SensorCard({ sensor, isSelected, onSelect }) {
  const meta = STATUS_META[sensor.status];
  const TypeIcon = sensor.type === SENSOR_TYPE.POCO ? WaterOutlinedIcon : SetMealOutlinedIcon;
  // Cada leitura carrega a cor do seu próprio status. Usar a cor consolidada
  // aqui pintaria de vermelho um pH perfeito só porque a turbidez estourou.
  const phMeta = STATUS_META[getPhStatus(sensor.ph, sensor.type)];
  const turbidityMeta = STATUS_META[getTurbidityStatus(sensor.turbidity, sensor.type)];

  const className = [
    styles.card,
    isSelected ? styles.cardSelected : '',
    sensor.status === STATUS.CRITICO ? styles.cardCritical : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      style={{ '--status-color': meta.color, '--status-bg': meta.background }}
      aria-pressed={isSelected}
      onClick={() => onSelect(sensor)}
    >
      <span className={styles.icon}>
        <TypeIcon sx={{ fontSize: 17 }} />
      </span>

      <span className={styles.info}>
        <span className={styles.topLine}>
          <span className={styles.name}>{sensor.name}</span>
          <span className={styles.id}>{sensor.id}</span>
        </span>
        <span className={styles.meta}>
          {sensor.city} · {SENSOR_TYPE_LABEL[sensor.type]}
        </span>
      </span>

      <span className={styles.reading}>
        <span className={styles.ph} style={{ '--reading-color': phMeta.color }}>
          {formatPh(sensor.ph)} <span className={styles.phUnit}>pH</span>
        </span>
        <span className={styles.turbidity} style={{ '--reading-color': turbidityMeta.color }}>
          {formatTurbidity(sensor.turbidity)}
        </span>
        <span className={styles.status}>{meta.label}</span>
      </span>
    </button>
  );
}
