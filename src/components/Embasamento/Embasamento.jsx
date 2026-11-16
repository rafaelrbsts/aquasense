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

const SOURCES = [
  {
    id: 1,
    title: 'Ranking do Saneamento 2026',
    author: 'Instituto Trata Brasil e GO Associados · 2026',
    use: 'Porto Velho em 99º entre os 100 maiores municípios (dados SINISA 2024): 30,74% de atendimento de água, 8,69% de coleta e 19,72% de tratamento do esgoto coletado.',
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
            No Ranking do Saneamento 2026, do Instituto Trata Brasil, Porto Velho ficou em 99º
            entre os 100 maiores municípios do país. Em 2024, apenas 30,74% da população era
            atendida com água, o menor índice do ranking, e só 8,69% do esgoto era coletado, dos
            quais 19,72% eram tratados <sup className={styles.cite}>[1]</sup>. Sem rede, o poço
            vira a alternativa mais comum, e com ele a responsabilidade de saber se a água está
            boa passa para o morador.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <WaterDropOutlinedIcon sx={iconSx} />
            Poços sem acompanhamento contínuo
          </h3>
          <p className={styles.text}>
            Um estudo publicado em 2025 analisou seis poços artesianos de dois assentamentos
            rurais de Presidente Médici, com coletas ao longo de seis meses. Quatro deles ficaram fora da Portaria nº
            888/2021 do Ministério da Saúde, em dureza, pH ou turbidez, e as irregularidades se
            repetiram em todo o período <sup className={styles.cite}>[2]</sup>. O pH variou de
            5,15 a 8,19, e a norma de potabilidade exige no mínimo 6,0. Em um dos poços, só a
            leitura de dezembro ficou na faixa adequada; nos meses seguintes o pH caiu. Uma coleta
            isolada teria mostrado um poço bom ou ruim conforme o mês, o que justifica medir de
            forma contínua. A amostra é pequena e de 2016–2017, então vale como indício do
            problema, não como retrato do estado.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <SetMealOutlinedIcon sx={iconSx} />
            Piscicultura em escala e sensível à água
          </h3>
          <p className={styles.text}>
            Rondônia produziu 55.380 toneladas de peixes de cultivo em 2025, quase tudo de
            espécies nativas. A produção recuou 2,67% sobre 2024, e a área de
            viveiros se concentra em poucos municípios, com Ariquemes (2.857 ha) e Ji-Paraná
            (1.155 ha) na frente <sup className={styles.cite}>[3]</sup>. Para os peixes, a faixa
            desejável de pH é de 6,5 a 9, e valores fora dela causam estresse e podem levar à
            morte. No mesmo estudo de Presidente Médici, nenhum dos seis poços foi considerado
            adequado para a atividade, porque em todos os meses ao menos um parâmetro estava
            fora do recomendado <sup className={styles.cite}>[2]</sup>.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>
            <WaterDropOutlinedIcon sx={iconSx} />
            O espaço para a AquaSense
          </h3>
          <p className={styles.text}>
            Os três pontos convergem nas duas grandezas que a plataforma mede: pH e turbidez,
            justamente as que apareceram fora da norma nos poços de Presidente Médici. Sensores
            de baixo custo instalados no próprio poço ou tanque, ligados por LoRaWAN onde não há
            internet, dão ao produtor e à comunidade um histórico de leituras e um alerta antes
            que a água comprometa o consumo ou o cultivo.
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
    </section>
  );
}
