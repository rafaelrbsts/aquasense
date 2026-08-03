import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import MonitorOutlinedIcon from '@mui/icons-material/MonitorOutlined';
import styles from './Architecture.module.css';

const iconSx = { fontSize: 16 };

const BLOCKS = [
  {
    name: 'Sensor de pH',
    icon: <ScienceOutlinedIcon sx={iconSx} />,
    description:
      'Eletrodo submerso no poço ou tanque, com sonda de temperatura para compensação da leitura.',
  },
  {
    name: 'Microcontrolador ESP32',
    icon: <MemoryOutlinedIcon sx={iconSx} />,
    description:
      'Converte o sinal analógico, aplica calibração e agrupa as leituras antes do envio.',
  },
  {
    name: 'LoRaWAN / Wi-Fi',
    icon: <SettingsInputAntennaOutlinedIcon sx={iconSx} />,
    description:
      'LoRaWAN atende áreas rurais sem cobertura; Wi-Fi é usado quando há rede local disponível.',
  },
  {
    name: 'Gateway',
    icon: <RouterOutlinedIcon sx={iconSx} />,
    description:
      'Concentra os pacotes de vários sensores da região e os encaminha pela internet.',
  },
  {
    name: 'API REST',
    icon: <ApiOutlinedIcon sx={iconSx} />,
    description: 'Endpoint autenticado que valida, normaliza e persiste cada leitura recebida.',
    accent: true,
  },
  {
    name: 'Servidor',
    icon: <DnsOutlinedIcon sx={iconSx} />,
    description:
      'Aplica as regras de faixa de pH, gera alertas e dispara notificações aos responsáveis.',
    accent: true,
  },
  {
    name: 'Banco de Dados',
    icon: <StorageOutlinedIcon sx={iconSx} />,
    description:
      'Série temporal com o histórico das leituras, base para relatórios e análise de tendência.',
    accent: true,
  },
  {
    name: 'Dashboard Web',
    icon: <MonitorOutlinedIcon sx={iconSx} />,
    description:
      'Plataforma React com mapa, indicadores e alertas — a interface exibida nesta página.',
    accent: true,
  },
];

const STACK = [
  { label: 'Camada física', value: 'Sonda de pH + ESP32' },
  { label: 'Transporte', value: 'LoRaWAN 915 MHz / Wi-Fi' },
  { label: 'Backend', value: 'API REST + banco de série temporal' },
  { label: 'Frontend', value: 'React + Vite + Leaflet' },
];

export default function Architecture() {
  return (
    <section className={styles.section} id="arquitetura">
      <div className={styles.head}>
        <p className={styles.eyebrow}>Arquitetura IoT</p>
        <h2 className={styles.title}>Do eletrodo em campo ao painel de monitoramento</h2>
        <p className={styles.subtitle}>
          Fluxo de dados de ponta a ponta. Cada leitura percorre oito etapas até chegar ao mapa,
          com transporte escolhido conforme a conectividade disponível na propriedade.
        </p>
      </div>

      <div className={styles.flow}>
        {BLOCKS.map((block, index) => (
          <article key={block.name} className={styles.block}>
            <div className={styles.blockHead}>
              <span className={`${styles.icon} ${block.accent ? styles.iconBlue : ''}`}>
                {block.icon}
              </span>
              <h3 className={styles.name}>{block.name}</h3>
              <span className={styles.step}>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <p className={styles.description}>{block.description}</p>
          </article>
        ))}
      </div>

      <div className={styles.stackNote}>
        {STACK.map(({ label, value }) => (
          <p key={label} className={styles.stackItem}>
            {label}: <strong>{value}</strong>
          </p>
        ))}
      </div>
    </section>
  );
}
