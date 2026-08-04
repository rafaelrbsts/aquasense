import styles from './Legend.module.css';

const STATUSES = [
  { color: 'var(--status-ideal)', name: 'Ideal' },
  { color: 'var(--status-alerta)', name: 'Atenção' },
  { color: 'var(--status-critico)', name: 'Crítico' },
];

/**
 * As faixas ficam numa linha própria porque agora são dois parâmetros: repetir
 * pH e turbidez dentro de cada status faria a tira transbordar.
 */
const PARAMETERS = [
  { name: 'pH', ranges: 'ideal — poço 6,5–8,5 · criadouro 6,5–7,5' },
  { name: 'Turbidez', ranges: 'ideal — poço ≤ 5 NTU · criadouro 25–80 NTU' },
];

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.statusRow}>
        <span className={styles.label}>Legenda</span>
        {STATUSES.map(({ color, name }) => (
          <span key={name} className={styles.item}>
            <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden="true" />
            <span className={styles.name}>{name}</span>
          </span>
        ))}
        <span className={styles.note}>Leituras simuladas a cada 5 segundos</span>
      </div>

      <div className={styles.rangeRow}>
        {PARAMETERS.map(({ name, ranges }) => (
          <span key={name} className={styles.param}>
            <span className={styles.paramName}>{name}</span>
            <span className={styles.range}>{ranges}</span>
          </span>
        ))}
        <span className={styles.note}>O status do sensor segue o pior dos dois</span>
      </div>
    </div>
  );
}
