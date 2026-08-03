import { BODIES, PIN_ROWS, PROBES, WATER, iso, poly } from './hardwareModel';
import styles from './HardwareDiagram.module.css';

/** Caixa isométrica: topo + as duas faces voltadas para o observador */
function IsoBox({ x, y, z, w, d, h, tone = 'board' }) {
  return (
    <g className={styles[tone]}>
      <polygon
        className={styles.faceTop}
        points={poly([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])}
      />
      <polygon
        className={styles.faceRight}
        points={poly([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])}
      />
      <polygon
        className={styles.faceLeft}
        points={poly([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])}
      />
    </g>
  );
}

/** Arcos concêntricos de emissão de rádio */
function RadioWaves({ at, dir = 'up' }) {
  const [cx, cy] = iso(...at);
  const flip = dir === 'up' ? -1 : 1;
  return (
    <g className={styles.waves}>
      {[14, 24, 34].map((r, i) => (
        <path
          key={r}
          d={`M${cx - r} ${cy} A${r} ${r * 0.72} 0 0 ${dir === 'up' ? 1 : 0} ${cx + r} ${cy}`}
          transform={flip === 1 ? `translate(0 0)` : undefined}
          style={{ opacity: 0.4 - i * 0.11 }}
        />
      ))}
    </g>
  );
}

export default function HardwareScene() {
  const { pcb, wroom, shield, rtc, usb, botao1, botao2, phBoard, opamp, loraMod } = BODIES;

  return (
    <g aria-hidden="true">
      {/* Sombra projetada da placa principal */}
      <polygon
        className={styles.shadow}
        points={poly(
          [pcb.x - 6, pcb.y - 6, -1],
          [pcb.x + pcb.w + 10, pcb.y - 6, -1],
          [pcb.x + pcb.w + 10, pcb.y + pcb.d + 10, -1],
          [pcb.x - 6, pcb.y + pcb.d + 10, -1]
        )}
      />

      {/* Sondas — antes da água, para que o volume translúcido cubra a parte submersa */}
      <IsoBox {...PROBES.ph} tone="glassBody" />
      <circle
        className={styles.bulb}
        cx={iso(...PROBES.ph.bulb)[0]}
        cy={iso(...PROBES.ph.bulb)[1]}
        r="10"
      />
      <IsoBox {...PROBES.temp} tone="steel" />
      <circle
        className={styles.tip}
        cx={iso(...PROBES.temp.tip)[0]}
        cy={iso(...PROBES.temp.tip)[1]}
        r="5.5"
      />

      {/* Placa de condicionamento */}
      <IsoBox {...phBoard} tone="board" />
      <IsoBox {...opamp} tone="chip" />
      {[
        [-146, -20],
        [-146, -2],
      ].map(([tx, ty]) => (
        <circle
          key={ty}
          className={styles.trimpot}
          cx={iso(tx, ty, 4)[0]}
          cy={iso(tx, ty, 4)[1]}
          r="7"
        />
      ))}
      <circle className={styles.bnc} cx={iso(-119, 12, 4)[0]} cy={iso(-119, 12, 4)[1]} r="8" />

      {/* Placa principal */}
      <IsoBox {...pcb} tone="board" />

      {/* Barras de pinos */}
      {PIN_ROWS.map((y) => (
        <IsoBox key={`l${y}`} x={-5} y={y - 3} z={2} w={5} d={6} h={3} tone="pin" />
      ))}
      {PIN_ROWS.map((y) => (
        <IsoBox key={`r${y}`} x={pcb.w} y={y - 3} z={2} w={5} d={6} h={3} tone="pin" />
      ))}

      {/* Módulo, blindagem e antena em meandro */}
      <IsoBox {...wroom} tone="module" />
      <IsoBox {...shield} tone="shield" />
      <polyline
        className={styles.meander}
        points={poly(
          ...Array.from({ length: 10 }, (_, i) => [16 + i * 6, i % 2 === 0 ? 62 : 70, 9])
        )}
      />
      <text className={styles.silkLight} x={iso(20, 34, 10.5)[0]} y={iso(20, 34, 10.5)[1]}>
        ESP32-WROOM-32
      </text>

      {/* Bloco RTC, LED e botões */}
      <IsoBox {...rtc} tone="chip" />
      <text className={styles.silkLight} x={iso(24, 122, 5)[0]} y={iso(24, 122, 5)[1]}>
        RTC
      </text>
      <circle className={styles.led} cx={iso(64, 148, 5)[0]} cy={iso(64, 148, 5)[1]} r="3.5" />
      <IsoBox {...botao1} tone="chip" />
      <IsoBox {...botao2} tone="chip" />

      {/* Conector USB-C */}
      <IsoBox {...usb} tone="metal" />

      {/* Volume d'água, sobre as sondas */}
      <IsoBox {...WATER} tone="tank" />
      <text
        className={styles.waterLabel}
        x={iso(-40, 240, -102)[0]}
        y={iso(-40, 240, -102)[1] + 32}
      >
        Água do poço ou tanque
      </text>

      {/* Transceptor LoRa e antena */}
      <IsoBox {...loraMod} tone="board" />
      <polyline
        className={styles.antenna}
        points={poly([218, 122, 4], [248, 122, 14], [278, 122, 30])}
      />
      <circle className={styles.antennaTip} cx={iso(278, 122, 30)[0]} cy={iso(278, 122, 30)[1]} r="4" />

      {/* Emissões de rádio */}
      <RadioWaves at={[42, 0, 30]} />
      <RadioWaves at={[278, 122, 34]} />
    </g>
  );
}
