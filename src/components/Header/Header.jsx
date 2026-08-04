import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
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
          <span className={styles.mark}>
            <WaterDropOutlinedIcon sx={{ fontSize: 18 }} />
          </span>
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
