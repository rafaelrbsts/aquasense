import WaterOutlinedIcon from '@mui/icons-material/WaterOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';
import {
  SENSOR_TYPE,
  SENSOR_TYPE_LABEL,
  STATUS_META,
  formatDateTime,
  formatPh,
  formatTemperature,
  getIdealRangeLabel,
} from '../../utils/phStatus';
import styles from './Map.module.css';

export default function SensorPopup({ sensor }) {
  const meta = STATUS_META[sensor.status];
  const TypeIcon = sensor.type === SENSOR_TYPE.POCO ? WaterOutlinedIcon : SetMealOutlinedIcon;

  return (
    <div className={styles.popup}>
      <div className={styles.popupHead}>
        <div>
          <div className={styles.popupName}>{sensor.name}</div>
          <div className={styles.popupType}>
            <TypeIcon sx={{ fontSize: 13 }} />
            {SENSOR_TYPE_LABEL[sensor.type]}
          </div>
        </div>
        <span
          className={styles.badge}
          style={{ color: meta.color, backgroundColor: meta.background }}
        >
          {meta.label}
        </span>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Cidade</span>
          <span className={styles.rowValue}>{sensor.city}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Ponto</span>
          <span className={styles.rowValue}>{sensor.site}</span>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Última leitura</p>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Data / hora</span>
          <span className={styles.rowValue}>{formatDateTime(sensor.lastReading)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>pH</span>
          <span className={styles.rowValue} style={{ color: meta.color }}>
            <span className={styles.phValue}>{formatPh(sensor.ph)}</span>
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Temperatura</span>
          <span className={styles.rowValue}>{formatTemperature(sensor.temperature)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Faixa ideal</span>
          <span className={styles.rowValue}>{getIdealRangeLabel(sensor.type)}</span>
        </div>
      </div>
    </div>
  );
}
