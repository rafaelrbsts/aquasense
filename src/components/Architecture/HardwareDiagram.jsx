import { useState } from 'react';
import HardwareScene from './HardwareScene';
import {
  POINTS,
  SEGMENTS,
  VIEW_H,
  VIEW_W,
  WIRE_TONE,
  iso,
  leaderPath,
  poly,
} from './hardwareModel';
import styles from './HardwareDiagram.module.css';

// Espelha `animation: flow <duração>` em .pulse (HardwareDiagram.module.css).
const PULSE_DURATION = 1.9;

/**
 * Defasagem de cada segmento da cadeia. O atraso é negativo para a animação já
 * começar em regime — um atraso positivo deixaria um vão no primeiro ciclo — e
 * é derivado do tamanho da cadeia para o pulso percorrer o caminho exatamente
 * uma vez por ciclo, independentemente de quantos segmentos ela tenha.
 */
function pulseDelay(order, total) {
  return `${-(PULSE_DURATION * (total - order)) / total}s`;
}

export default function HardwareDiagram() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Hover realça e acende o fluxo; o clique é que fixa o texto do detalhe, para
  // o parágrafo não piscar enquanto o mouse atravessa o diagrama.
  const activeId = hoveredId ?? selectedId;
  const active = POINTS.find((pt) => pt.id === activeId) ?? null;
  const selected = POINTS.find((pt) => pt.id === selectedId) ?? null;
  const lit = new Set(active?.flow ?? []);

  return (
    <div className={styles.wrap}>
      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className={styles.svg}
          aria-labelledby="hw-t hw-d"
        >
          <title id="hw-t">Esquema tridimensional do nó de campo AquaSense</title>
          <desc id="hw-d">
            Eletrodo de pH, sensor óptico de turbidez e sonda de temperatura submersos, ligados a
            uma placa de condicionamento e ao ESP32, que transmite por Wi-Fi ou LoRa. Treze pontos
            de conexão anotados, cada um selecionável.
          </desc>

          <HardwareScene />

          {/* Fios: base sempre visível, pulso só no caminho aceso */}
          <g aria-hidden="true">
            {Object.entries(SEGMENTS).map(([id, pts]) => {
              const isLit = lit.has(id);
              const order = active ? active.flow.indexOf(id) : -1;
              const cls = [
                styles.wire,
                styles[WIRE_TONE[id]],
                isLit ? styles.wireLit : active ? styles.wireDim : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <g key={id} className={cls}>
                  <polyline className={styles.wireBase} points={poly(...pts)} />
                  {isLit && (
                    <polyline
                      className={styles.pulse}
                      points={poly(...pts)}
                      pathLength="1"
                      style={{ animationDelay: pulseDelay(order, active.flow.length) }}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Pontos de conexão */}
          {POINTS.map((pt) => {
            const [ax, ay] = iso(...pt.anchor);
            const cls = [
              styles.point,
              activeId === pt.id ? styles.pointActive : '',
              selectedId === pt.id ? styles.pointSelected : '',
            ]
              .filter(Boolean)
              .join(' ');
            const d = leaderPath([ax, ay], pt.box, pt.align);

            return (
              <g key={pt.id} className={cls}>
                {/* Traço claro por baixo mantém a guia legível ao cruzar um corpo */}
                <path className={styles.leaderHalo} d={d} aria-hidden="true" />
                <path className={styles.leader} d={d} aria-hidden="true" />
                <circle
                  className={styles.dotHit}
                  cx={ax}
                  cy={ay}
                  r="14"
                  aria-hidden="true"
                  onClick={() => setSelectedId(pt.id)}
                  onMouseEnter={() => setHoveredId(pt.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
                <circle className={styles.dot} cx={ax} cy={ay} r="4" aria-hidden="true" />
                <foreignObject
                  x={pt.box[0]}
                  y={pt.box[1]}
                  width={pt.box[2]}
                  height={pt.box[3]}
                >
                  <div className={styles.slot}>
                    <button
                      type="button"
                      className={styles.calloutCard}
                      data-align={pt.align}
                      aria-pressed={selectedId === pt.id}
                      onClick={() => setSelectedId(pt.id)}
                      onMouseEnter={() => setHoveredId(pt.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(pt.id)}
                      onBlur={() => setHoveredId(null)}
                    >
                      <span className={styles.calloutLabel}>{pt.label}</span>
                      <span className={styles.calloutPin}>{pt.pin}</span>
                    </button>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* A região live fica sempre montada e só a caixa entra e sai, senão o
            leitor de tela não anuncia a primeira seleção. */}
        <div role="status">
          {selected && (
            <div className={styles.detail}>
              <p className={styles.detailPin}>{selected.pin}</p>
              <h4 className={styles.detailTitle}>{selected.label}</h4>
              <p className={styles.detailText}>{selected.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Abaixo de 720px os rótulos colidiriam: a mesma lista vira cartões */}
      <ul className={styles.pointList}>
        {POINTS.map((pt) => (
          <li key={pt.id} className={styles.pointItem}>
            <p className={styles.itemPin}>{pt.pin}</p>
            <h4 className={styles.itemTitle}>{pt.label}</h4>
            <p className={styles.itemText}>{pt.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
