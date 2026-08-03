import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>
          <strong>AquaSense</strong> · Monitoramento hídrico IoT · Porto Velho, Rondônia
        </p>
        <p className={styles.meta}>
          MVP acadêmico — dados fictícios gerados por simulação · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
