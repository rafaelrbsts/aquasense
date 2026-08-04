import { useState } from 'react';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import MonitorOutlinedIcon from '@mui/icons-material/MonitorOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import DeveloperBoardOutlinedIcon from '@mui/icons-material/DeveloperBoardOutlined';
import HardwareDiagram from './HardwareDiagram';
import styles from './Architecture.module.css';

const iconSx = { fontSize: 16 };
const viewIconSx = { fontSize: 14 };

const BLOCKS = [
  {
    name: 'Sensores de pH e turbidez',
    icon: <ScienceOutlinedIcon sx={iconSx} />,
    description:
      'Eletrodo de pH e sensor óptico de turbidez submersos no poço ou tanque, com sonda de temperatura para compensação da leitura.',
  },
  {
    name: 'Microcontrolador ESP32',
    icon: <MemoryOutlinedIcon sx={iconSx} />,
    description:
      'Lê os dois canais analógicos, aplica a calibração de cada sonda e agrupa as leituras antes do envio.',
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
      'Aplica as faixas de pH e turbidez, gera alertas e dispara notificações aos responsáveis.',
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

const VIEWS = [
  {
    id: 'fluxo',
    label: 'Fluxo',
    icon: <AccountTreeOutlinedIcon sx={viewIconSx} />,
    subtitle:
      'Fluxo de dados de ponta a ponta. Cada leitura percorre oito etapas até chegar ao mapa, com transporte escolhido conforme a conectividade disponível na propriedade.',
  },
  {
    id: 'diagrama',
    label: 'Diagrama',
    icon: <DeveloperBoardOutlinedIcon sx={viewIconSx} />,
    subtitle:
      'Detalhe do nó instalado em campo. Passe o mouse sobre um ponto para ver o caminho do sinal e clique para ler a função de cada conexão.',
  },
];

const STACK = [
  { label: 'Camada física', value: 'Sondas de pH e turbidez + ESP32' },
  { label: 'Transporte', value: 'LoRaWAN 915 MHz / Wi-Fi' },
  { label: 'Backend', value: 'API REST + banco de série temporal' },
  { label: 'Frontend', value: 'React + Vite + Leaflet' },
];

export default function Architecture() {
  const [view, setView] = useState('fluxo');
  const current = VIEWS.find((item) => item.id === view);

  return (
    <section className={styles.section} id="arquitetura">
      <div className={styles.head}>
        <div className={styles.headText}>
          <p className={styles.eyebrow}>Arquitetura IoT</p>
          <h2 className={styles.title}>Do eletrodo em campo ao painel de monitoramento</h2>
          <p className={styles.subtitle}>{current.subtitle}</p>
        </div>

        <div className={styles.viewSwitch} role="group" aria-label="Modo de visualização">
          {VIEWS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={`${styles.viewButton} ${view === id ? styles.viewButtonActive : ''}`}
              aria-pressed={view === id}
              aria-controls="arquitetura-corpo"
              onClick={() => setView(id)}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* O wrapper envolve o .flow — nunca fica entre ele e os .block, senão os
          seletores `.flow > .block:nth-child(...)` que montam a serpentina e as
          setas param de casar. */}
      <div id="arquitetura-corpo">
        {view === 'fluxo' ? (
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
        ) : (
          <HardwareDiagram />
        )}
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
