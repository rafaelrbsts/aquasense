import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { FOCUS_ZOOM } from '../../data/mockSensors';
import { formatTime } from '../../utils/phStatus';
import { getMarkerIcon } from './markerIcons';
import OfflineBaseLayer, { RONDONIA_BOUNDS } from './OfflineBaseLayer';
import SensorPopup from './SensorPopup';
import styles from './Map.module.css';

const BOUNDS_PADDING = { padding: [26, 26] };

const BASE_LAYERS = [
  { id: 'vetorial', label: 'Vetorial', title: 'Malhas do IBGE embarcadas — funciona sem internet' },
  { id: 'osm', label: 'OSM', title: 'Tiles do OpenStreetMap — requer internet' },
];

/**
 * Reage às seleções vindas do painel lateral: centraliza o mapa no sensor
 * escolhido e abre o popup correspondente.
 */
function MapFocus({ focus, markerRefs }) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;
    map.flyTo(focus.coords, FOCUS_ZOOM, { duration: 0.9 });
    markerRefs.current[focus.id]?.openPopup();
  }, [focus, map, markerRefs]);

  return null;
}

export default function SensorMap({ sensors, selectedId, focus, onSelect, lastUpdate }) {
  const markerRefs = useRef({});
  const mapRef = useRef(null);
  // Base vetorial por padrão: a apresentação não pode depender de rede.
  const [baseLayer, setBaseLayer] = useState('vetorial');

  const resetView = useCallback(() => {
    mapRef.current?.closePopup();
    mapRef.current?.flyToBounds(RONDONIA_BOUNDS, { ...BOUNDS_PADDING, duration: 0.9 });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <p className={styles.overlayTitle}>Rede de sensores — Rondônia</p>
        <p className={styles.overlayMeta}>
          {sensors.length} pontos monitorados · atualizado às {formatTime(lastUpdate)}
        </p>
        <div className={styles.baseSwitch} role="group" aria-label="Base cartográfica">
          {BASE_LAYERS.map(({ id, label, title }) => (
            <button
              key={id}
              type="button"
              title={title}
              className={`${styles.baseButton} ${baseLayer === id ? styles.baseButtonActive : ''}`}
              aria-pressed={baseLayer === id}
              onClick={() => setBaseLayer(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className={styles.resetButton} onClick={resetView}>
          Reenquadrar Rondônia
        </button>
      </div>

      <MapContainer
        ref={mapRef}
        bounds={RONDONIA_BOUNDS}
        boundsOptions={BOUNDS_PADDING}
        scrollWheelZoom
        className={styles.map}
      >
        {baseLayer === 'osm' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
        )}

        <OfflineBaseLayer key={baseLayer} showMunicipios={baseLayer === 'vetorial'} />

        <MapFocus focus={focus} markerRefs={markerRefs} />

        {sensors.map((sensor) => (
          <Marker
            key={sensor.id}
            position={sensor.coords}
            icon={getMarkerIcon(sensor.status, sensor.id === selectedId)}
            ref={(instance) => {
              markerRefs.current[sensor.id] = instance;
            }}
            eventHandlers={{ click: () => onSelect(sensor.id) }}
          >
            {/* O padding superior evita que o popup abra sob o painel flutuante. */}
            <Popup
              autoPan
              autoPanPaddingTopLeft={[24, 130]}
              autoPanPaddingBottomRight={[24, 24]}
              closeButton={false}
            >
              <SensorPopup sensor={sensor} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
