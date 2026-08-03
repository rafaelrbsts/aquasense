import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import styles from './About.module.css';

const BENEFITS = [
  {
    name: 'Monitoramento remoto',
    text: 'Acompanhamento contínuo de poços e tanques distantes, sem deslocamento até o ponto.',
  },
  {
    name: 'Redução de perdas',
    text: 'Desvios de pH detectados a tempo de corrigir a água antes da mortalidade dos peixes.',
  },
  {
    name: 'Maior segurança da água',
    text: 'Histórico de leituras que apoia laudos e o acompanhamento da potabilidade.',
  },
  {
    name: 'Baixo custo',
    text: 'Hardware baseado em ESP32 e rede LoRaWAN compartilhada entre propriedades vizinhas.',
  },
  {
    name: 'Escalabilidade',
    text: 'Um gateway atende dezenas de sensores; novos pontos entram sem mudança de infraestrutura.',
  },
];

const FIGURES = [
  { value: '5 s', label: 'Intervalo entre leituras no MVP' },
  { value: '10 km', label: 'Alcance típico do enlace LoRaWAN em área rural' },
  { value: '24/7', label: 'Operação contínua com alerta automático' },
];

export default function About() {
  return (
    <section className={styles.section} id="sobre">
      <div className={styles.card}>
        <p className={styles.eyebrow}>Sobre a solução</p>
        <h2 className={styles.title}>Água monitorada onde o monitoramento não chega</h2>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <ReportProblemOutlinedIcon sx={{ fontSize: 16, color: 'var(--status-alerta)' }} />
            Problema
          </h3>
          <p className={styles.text}>
            Em diversas comunidades amazônicas e propriedades rurais, o abastecimento depende de
            poços artesianos. Além disso, Rondônia é um dos maiores produtores de peixe cultivado do
            Brasil. Alterações no pH da água podem comprometer tanto a potabilidade quanto a saúde
            dos peixes.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <LightbulbOutlinedIcon sx={{ fontSize: 16, color: 'var(--color-green-amazon)' }} />
            Solução
          </h3>
          <p className={styles.text}>
            A AquaSense monitora continuamente o pH da água por sensores IoT, enviando leituras
            automaticamente para uma plataforma web que permite identificar rapidamente situações
            críticas e agir preventivamente.
          </p>
        </div>

        <div className={styles.figures}>
          {FIGURES.map(({ value, label }) => (
            <div key={label}>
              <p className={styles.figureValue}>{value}</p>
              <p className={styles.figureLabel}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.eyebrow}>Benefícios</p>
        <h2 className={styles.title}>O que a plataforma entrega</h2>
        <ul className={styles.benefits}>
          {BENEFITS.map(({ name, text }) => (
            <li key={name} className={styles.benefit}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 17 }} className={styles.benefitIcon} />
              <div>
                <p className={styles.benefitName}>{name}</p>
                <p className={styles.benefitText}>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
