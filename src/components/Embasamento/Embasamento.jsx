import PlumbingOutlinedIcon from '@mui/icons-material/PlumbingOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import styles from './Embasamento.module.css';

const iconSx = { fontSize: 16, color: 'var(--color-aqua-deep)' };

// Os números abaixo vêm das três fontes listadas ao fim da seção; ao atualizar
// um valor, confira também o ano-base citado no texto correspondente.
const FIGURES = [
  { value: '30,74%', label: 'População de Porto Velho atendida com água em 2024, a menor entre os 100 maiores municípios' },
  { value: '8,69%', label: 'Coleta de esgoto em Porto Velho em 2024' },
  { value: '4 de 6', label: 'Poços artesianos de um assentamento rural fora da norma de potabilidade' },
  { value: '55,4 mil t', label: 'Peixes de cultivo produzidos em Rondônia em 2025' },
];

// Porto Velho contra o "indicador médio" dos 100 maiores municípios (SINISA 2024),
// ambos em % e na mesma escala de 0 a 100.
const COMPARE = [
  { label: 'Atendimento de água', city: 30.74, avg: 93.55 },
  { label: 'Coleta de esgoto', city: 8.69, avg: 76.97 },
  { label: 'Tratamento do esgoto', city: 19.72, avg: 64.42 },
];

const WATER_SERIES = [
  { year: 2020, value: 32.87 },
  { year: 2021, value: 26.05 },
  { year: 2022, value: 41.79 },
  { year: 2023, value: 35.02 },
  { year: 2024, value: 30.74 },
];

const NURSERIES = [
  { name: 'Ariquemes', ha: 2857 },
  { name: 'Ji-Paraná', ha: 1155 },
  { name: 'Cujubim', ha: 1050 },
  { name: "Alta Floresta D'Oeste", ha: 963 },
  { name: 'Ouro Preto do Oeste', ha: 888 },
];

const pct = (value) => `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`;
const NURSERY_MAX = NURSERIES[0].ha;

function Bar({ name, value, display, max = 100, tone }) {
  return (
    <div className={styles.barRow}>
      <span className={styles.barName}>{name}</span>
      <div className={styles.track}>
        <div className={`${styles.bar} ${tone}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className={styles.barValue}>{display}</span>
    </div>
  );
}

const SOURCES = [
  {
    id: 1,
    title: 'Ranking do Saneamento 2026',
    author: 'Instituto Trata Brasil e GO Associados · 2026',
    use: 'Porto Velho em 99º entre os 100 maiores municípios (dados SINISA 2024): 30,74% de atendimento de água, 8,69% de coleta e 19,72% de tratamento do esgoto, contra médias de 93,55%, 76,97% e 64,42% nas 100 maiores cidades, e a série de 2020 a 2024.',
    href: 'https://tratabrasil.org.br/wp-content/uploads/2026/03/Estudo-da-GO-Associados-Ranking-do-Saneamento-de-2026.pdf',
  },
  {
    id: 2,
    title:
      'Análise físico-química da água de poços artesianos dos Assentamentos Chico Mendes 1 e 2, Presidente Médici, RO',
    author: 'Cabeça et al. · Revista Nativa Americana de Ciências, Tecnologia & Inovação, v. 8, n. 1, 2025',
    use: 'Seis poços monitorados de dezembro de 2016 a maio de 2017: quatro fora da Portaria nº 888/2021 e nenhum adequado à piscicultura.',
    href: 'https://jiparana.emnuvens.com.br/riacti/article/view/1818',
  },
  {
    id: 3,
    title: 'Produção de peixes em Rondônia ultrapassa 55 mil toneladas',
    author: 'O Presente Rural, com dados do Anuário Peixe BR da Piscicultura 2026 · 10/03/2026',
    use: '55.380 t em 2025, queda de 2,67% sobre 2024, com 99,78% de espécies nativas.',
    href: 'https://opresenterural.com.br/producao-de-peixes-em-rondonia-ultrapassa-55-mil-toneladas/',
  },
];

// Rodapé de cada gráfico: leva direto ao documento de onde os valores saíram.
function ChartSource({ id, label }) {
  const source = SOURCES.find((item) => item.id === id);
  return (
    <p className={styles.chartSource}>
      Fonte:{' '}
      <a href={source.href} target="_blank" rel="noopener noreferrer">
        {label}
        <OpenInNewOutlinedIcon sx={{ fontSize: 12 }} aria-hidden="true" />
      </a>
    </p>
  );
}

export default function Embasamento() {
  return (
    <section className={styles.section} id="embasamento">
      <div className={styles.card}>
        <p className={styles.eyebrow}>Embasamento</p>
        <h2 className={styles.title}>Por que monitorar a água em Rondônia</h2>
        <p className={styles.lead}>
          A AquaSense nasce de uma combinação local: a rede de água e esgoto está longe de ser
          universal, a qualidade da água de poço pode mudar de um mês para o outro, e o estado
          tem uma piscicultura que só funciona com água dentro de faixas estreitas de pH.
        </p>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <PlumbingOutlinedIcon sx={iconSx} />
            Saneamento abaixo do mínimo
          </h3>
          <p className={styles.text}>
            No Ranking do Saneamento 2026, Porto Velho ficou em 99º entre os 100 maiores
            municípios. Em 2024, só 30,74% da população tinha água encanada e 8,69% do esgoto era
            coletado <sup className={styles.cite}>[1]</sup>. Sem rede, o poço vira a alternativa.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <WaterDropOutlinedIcon sx={iconSx} />
            Poços sem acompanhamento contínuo
          </h3>
          <p className={styles.text}>
            Em seis poços de Presidente Médici, quatro ficaram fora da norma de potabilidade, com
            pH de 5,15 a 8,19 (mínimo de 6,0) <sup className={styles.cite}>[2]</sup>. Num deles, só
            a leitura de dezembro foi adequada, o que pede medição contínua. A amostra é pequena,
            de 2016–2017.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <SetMealOutlinedIcon sx={iconSx} />
            Piscicultura em escala e sensível à água
          </h3>
          <p className={styles.text}>
            Rondônia produziu 55.380 t de peixes de cultivo em 2025 <sup className={styles.cite}>[3]</sup>.
            O pH ideal para os peixes vai de 6,5 a 9, e nenhum dos seis poços do estudo de
            Presidente Médici serviu para a atividade <sup className={styles.cite}>[2]</sup>.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <WaterDropOutlinedIcon sx={iconSx} />
            O espaço para a AquaSense
          </h3>
          <p className={styles.text}>
            Os três pontos convergem em pH e turbidez, as grandezas que a plataforma mede.
            Sensores de baixo custo no poço ou tanque dão histórico e alerta antes que a água
            comprometa o consumo ou o cultivo.
          </p>
        </div>
      </div>

      <div className={styles.side}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>Em números</p>
          <h2 className={styles.title}>O cenário em quatro dados</h2>
          <div className={styles.figures}>
            {FIGURES.map(({ value, label }) => (
              <div key={value}>
                <p className={styles.figureValue}>{value}</p>
                <p className={styles.figureLabel}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.eyebrow}>Fontes</p>
          <h2 className={styles.title}>Onde estão os dados</h2>
          <ol className={styles.sources}>
            {SOURCES.map(({ id, title, author, use, href }) => (
              <li key={id} className={styles.source}>
                <span className={styles.sourceNumber}>{id}</span>
                <div>
                  <a
                    className={styles.sourceLink}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {title}
                    <OpenInNewOutlinedIcon sx={{ fontSize: 13 }} aria-hidden="true" />
                  </a>
                  <p className={styles.sourceMeta}>{author}</p>
                  <p className={styles.sourceUse}>{use}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={`${styles.card} ${styles.chartsCard}`}>
        <p className={styles.eyebrow}>Em gráficos</p>
        <h2 className={styles.title}>A distância para o resto do país e a escala da piscicultura</h2>

        <div className={styles.charts}>
          <div>
            <h3 className={styles.chartTitle}>
              Porto Velho × média das 100 maiores cidades <sup className={styles.cite}>[1]</sup>
            </h3>
            <p className={styles.chartSub}>Indicadores de 2024, em %</p>
            {COMPARE.map(({ label, city, avg }) => (
              <div key={label} className={styles.pair}>
                <p className={styles.pairLabel}>{label}</p>
                <Bar name="Porto Velho" value={city} display={pct(city)} tone={styles.toneCity} />
                <Bar name="Média" value={avg} display={pct(avg)} tone={styles.toneAvg} />
              </div>
            ))}
            <ChartSource id={1} label="Trata Brasil, Ranking do Saneamento 2026" />
          </div>

          <div>
            <h3 className={styles.chartTitle}>
              Porto Velho: população atendida com água <sup className={styles.cite}>[1]</sup>
            </h3>
            <p className={styles.chartSub}>Em %, de 2020 a 2024, escala de 0 a 100</p>
            <div className={styles.columns}>
              {WATER_SERIES.map(({ year, value }) => (
                <div key={year} className={styles.column}>
                  <span className={styles.columnValue}>{pct(value)}</span>
                  <div className={styles.columnTrack}>
                    <div
                      className={`${styles.columnBar} ${year === 2024 ? styles.toneCity : styles.toneMuted}`}
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <span className={styles.columnYear}>{year}</span>
                </div>
              ))}
            </div>
            <ChartSource id={1} label="Trata Brasil, Ranking do Saneamento 2026" />
          </div>

          <div>
            <h3 className={styles.chartTitle}>
              Maiores áreas de viveiros escavados <sup className={styles.cite}>[3]</sup>
            </h3>
            <p className={styles.chartSub}>Hectares por município de Rondônia</p>
            <div className={styles.nurseries}>
              {NURSERIES.map(({ name, ha }) => (
                <Bar
                  key={name}
                  name={name}
                  value={ha}
                  max={NURSERY_MAX}
                  display={`${ha.toLocaleString('pt-BR')} ha`}
                  tone={styles.toneCity}
                />
              ))}
            </div>
            <ChartSource id={3} label="O Presente Rural, Anuário Peixe BR 2026" />
          </div>
        </div>
      </div>
    </section>
  );
}
