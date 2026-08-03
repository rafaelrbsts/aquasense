import styles from './Legend.module.css';

const ITEMS = [
  { color: 'var(--status-ideal)', name: 'Ideal', range: 'poço 6,5–8,5 · criadouro 6,5–7,5' },
  { color: 'var(--status-alerta)', name: 'Atenção', range: 'poço 6,0–9,0 · criadouro 6,0–8,0' },
  { color: 'var(--status-critico)', name: 'Crítico', range: 'fora das faixas toleradas' },
];

export default function Legend() {
  return (
    <div className={styles.legend}>
      <span className={styles.label}>Legenda</span>
      {ITEMS.map(({ color, name, range }) => (
        <span key={name} className={styles.item}>
          <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden="true" />
          <span className={styles.name}>{name}</span>
          <span className={styles.range}>{range}</span>
        </span>
      ))}
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.note}>Leituras simuladas a cada 5 segundos</span>
    </div>
  );
}
