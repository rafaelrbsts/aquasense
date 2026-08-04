import markUrl from '../../assets/aquasense-mark.png';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sensores', label: 'Sensores' },
  { id: 'arquitetura', label: 'Arquitetura IoT' },
  { id: 'sobre', label: 'Sobre' },
];

export default function Header({ activeSection, onNavigate }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {/* alt vazio: o nome da marca vem logo ao lado, no wordmark */}
          <img className={styles.mark} src={markUrl} alt="" width="32" height="32" />
          <span className={styles.wordmark}>
            <span className={styles.name}>AquaSense</span>
            <span className={styles.tagline}>Monitoramento Hídrico IoT</span>
          </span>
        </div>

        <nav className={styles.nav} aria-label="Seções da plataforma">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.navLink} ${activeSection === id ? styles.navLinkActive : ''}`}
              aria-current={activeSection === id ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
