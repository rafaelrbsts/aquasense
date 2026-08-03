import L from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import municipios from '../../data/rondoniaMunicipios.json';
import estado from '../../data/rondoniaEstado.json';

const IBGE_ATTRIBUTION = 'Malhas municipais: IBGE';

/** Limites do estado, usados para o enquadramento inicial do mapa. */
export const RONDONIA_BOUNDS = L.geoJSON(estado).getBounds();

const municipioStyle = {
  fillColor: '#f4f7f5',
  fillOpacity: 1,
  color: '#c9d5cf',
  weight: 0.8,
};

const estadoStyle = {
  fill: false,
  color: '#0f3d2e',
  weight: 1.6,
  opacity: 0.8,
};

/** Realce discreto ao passar o mouse sobre um município. */
function bindMunicipioInteractions(feature, layer) {
  layer.bindTooltip(feature.properties.name, { sticky: true, direction: 'top' });
  layer.on({
    mouseover: (event) => event.target.setStyle({ fillColor: '#e6efe9' }),
    mouseout: (event) => event.target.setStyle({ fillColor: municipioStyle.fillColor }),
    // Sem isto o navegador foca o <path> ao clicar: desenha o anel de foco
    // padrão sobre o mapa e rola a página até o elemento focado.
    mousedown: (event) => event.originalEvent.preventDefault(),
  });
}

/**
 * Base cartográfica vetorial de Rondônia servida a partir do próprio bundle.
 * Substitui os tiles quando não há internet — o caso de uso de apresentação.
 */
export default function OfflineBaseLayer({ showMunicipios = true }) {
  return (
    <>
      {showMunicipios && (
        <GeoJSON
          data={municipios}
          style={municipioStyle}
          onEachFeature={bindMunicipioInteractions}
          attribution={IBGE_ATTRIBUTION}
        />
      )}
      <GeoJSON data={estado} style={estadoStyle} interactive={false} />
    </>
  );
}
