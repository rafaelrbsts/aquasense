import L from 'leaflet';
import { STATUS } from '../../utils/waterQuality';
import styles from './Map.module.css';

const STATUS_CLASS = {
  [STATUS.IDEAL]: styles.pinIdeal,
  [STATUS.ALERTA]: styles.pinAlerta,
  [STATUS.CRITICO]: styles.pinCritico,
};

/**
 * Ícones são memorizados por (status + seleção): o react-leaflet só troca o
 * ícone do marcador quando a referência muda, então recriá-los a cada ciclo
 * de leitura provocaria repaints desnecessários.
 */
const cache = new Map();

export function getMarkerIcon(status, isSelected = false) {
  const key = `${status}:${isSelected}`;
  if (cache.has(key)) return cache.get(key);

  const classes = [styles.pin, STATUS_CLASS[status], isSelected ? styles.pinSelected : '']
    .filter(Boolean)
    .join(' ');

  const icon = L.divIcon({
    className: '',
    html: `<span class="${styles.pinWrap}"><span class="${classes}"></span></span>`,
    iconSize: [24, 30],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22],
  });

  cache.set(key, icon);
  return icon;
}
