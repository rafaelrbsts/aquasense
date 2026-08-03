import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import WaterOutlinedIcon from '@mui/icons-material/WaterOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import styles from './Stats.module.css';

function StatCard({ icon, iconClass, label, value, hint }) {
  return (
    <div className={styles.card}>
      <span className={`${styles.icon} ${iconClass ?? ''}`}>{icon}</span>
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </div>
  );
}

export default function Stats({ stats }) {
  const iconSx = { fontSize: 19 };

  return (
    <div className={styles.grid}>
      <StatCard
        icon={<SensorsOutlinedIcon sx={iconSx} />}
        label="Total de sensores"
        value={stats.total}
        hint="Rede ativa em Rondônia"
      />
      <StatCard
        icon={<WaterOutlinedIcon sx={iconSx} />}
        iconClass={styles.iconBlue}
        label="Sensores em poços"
        value={stats.pocos}
        hint="Poços artesianos monitorados"
      />
      <StatCard
        icon={<SetMealOutlinedIcon sx={iconSx} />}
        iconClass={styles.iconBlue}
        label="Sensores em criadouros"
        value={stats.criadouros}
        hint="Tanques e viveiros de peixes"
      />
      <StatCard
        icon={<WarningAmberOutlinedIcon sx={iconSx} />}
        iconClass={stats.criticos > 0 ? styles.iconCritical : styles.iconAlert}
        label="Alertas ativos"
        value={stats.alertas}
        hint={`${stats.criticos} em estado crítico`}
      />
    </div>
  );
}
