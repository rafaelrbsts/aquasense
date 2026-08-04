# AquaSense

Plataforma web (MVP) de monitoramento remoto da qualidade da água por sensores IoT de **pH** e
**turbidez**, instalados em **poços artesianos** e **criadouros de peixes** de **Rondônia**.

Startup fictícia amazônica — projeto acadêmico.

**Demonstração:** https://aquasensero.vercel.app

## Como executar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
npm run preview  # serve o build
```

## Deploy

O projeto é um site estático — o build gera `dist/` sem necessidade de servidor.

Hospedado na **Vercel** em https://aquasensero.vercel.app, com deploy automático a cada push
na `main`. O framework Vite é detectado automaticamente:

| Configuração      | Valor           |
| ----------------- | --------------- |
| Framework Preset  | Vite            |
| Build Command     | `npm run build` |
| Output Directory  | `dist`          |
| Install Command   | `npm install`   |


## Apresentação offline

**A aplicação funciona 100% sem internet.** Depois de `npm install`, nenhum recurso externo é
solicitado pelo navegador:

- **Mapa** — base cartográfica vetorial de Rondônia (contorno estadual + 52 municípios) embarcada
  no bundle a partir das malhas do IBGE, renderizada pelo Leaflet como GeoJSON. É a base padrão.
- **Fonte** — Inter auto-hospedada via `@fontsource/inter`, sem Google Fonts.
- **Ícones** — SVGs do Material UI compilados no bundle.
- **Dados** — simulação local, sem chamada de API.

O seletor no canto do mapa alterna entre **Vetorial** (offline) e **OSM** (tiles do
OpenStreetMap/CARTO, apenas com internet). Deixe em *Vetorial* para apresentar.

## Stack

| Camada    | Tecnologia                     |
| --------- | ------------------------------ |
| Build     | Vite                           |
| UI        | React 19 + Material UI (ícones e tema) |
| Mapa      | React Leaflet + Leaflet        |
| Geodados  | Malhas municipais do IBGE (GeoJSON local) |
| Fonte     | @fontsource/inter (auto-hospedada) |
| Estilo    | CSS Modules (sem Tailwind / Bootstrap) |

Nenhuma biblioteca de dashboard pronta é utilizada: indicadores, painel, legenda e diagrama
de arquitetura são componentes próprios.

## Estrutura

```
src/
├── components/
│   ├── About/          Problema, solução e benefícios
│   ├── Architecture/   Alterna entre duas vistas da arquitetura:
│   │   ├── Architecture.jsx      Fluxo IoT em 8 blocos (vista "Fluxo")
│   │   ├── HardwareDiagram.jsx   Vista "Diagrama": pontos, guias e detalhe
│   │   ├── HardwareScene.jsx     Corpos da cena isométrica
│   │   └── hardwareModel.js      Geometria 3D, fios e textos dos 12 pontos
│   ├── Footer/
│   ├── Header/         Logo e menu de navegação
│   ├── Legend/         Cores de status + faixas de pH e turbidez
│   ├── Map/            SensorMap, OfflineBaseLayer, SensorPopup, markerIcons
│   ├── SensorCard/     SensorCard + SensorPanel (painel lateral)
│   └── Stats/          Quatro indicadores superiores
├── data/
│   ├── mockSensors.js          Base fictícia de 10 sensores
│   ├── rondoniaEstado.json     Contorno de RO (IBGE)
│   └── rondoniaMunicipios.json Malha dos 52 municípios (IBGE)
├── hooks/
│   ├── useSensorSimulation.js  Ciclo de leituras + indicadores
│   └── useActiveSection.js     Menu ativo e rolagem entre seções
├── services/sensorSimulator.js Simulação da telemetria (5 s)
├── utils/waterQuality.js       Faixas de pH e turbidez + status consolidado
├── styles/global.css           Tokens da paleta e reset
├── theme.js                    Tema Material UI
├── App.jsx
└── main.jsx
```

## Regras de negócio

O status **nunca é armazenado**: é sempre derivado das leituras por `getSensorStatus(sensor)`
em `src/utils/waterQuality.js`, que devolve **o pior entre pH e turbidez**. Um poço com pH
perfeito e turbidez acima do limite de potabilidade fica vermelho.

### pH

| Tipo                | Ideal 🟢  | Atenção 🟡              | Crítico 🔴            |
| ------------------- | --------- | ----------------------- | --------------------- |
| Poço artesiano      | 6,5 – 8,5 | 6,0 – 6,4 e 8,6 – 9,0   | < 6,0 ou > 9,0        |
| Criadouro de peixes | 6,5 – 7,5 | 6,0 – 6,4 e 7,6 – 8,0   | < 6,0 ou > 8,0        |

### Turbidez (NTU)

| Tipo                | Ideal 🟢 | Atenção 🟡 | Crítico 🔴          |
| ------------------- | -------- | ---------- | ------------------- |
| Poço artesiano      | ≤ 5      | 5,1 – 10   | > 10                |
| Criadouro de peixes | 25 – 80  | —          | < 25 ou > 80        |

O 5 NTU do poço é o limite de potabilidade da **Portaria GM/MS 888/2021**, e a faixa é
unilateral: em água de consumo, quanto mais limpa, melhor.

Em criadouro a faixa é **bilateral**, e a borda de baixo não é um detalhe — água limpa demais
tem pouca produtividade primária e favorece a planta aquática, do mesmo modo que turbidez alta
demais bloqueia a luz. Como não há banda de tolerância, a turbidez de criadouro nunca fica em
"atenção": só ideal ou crítica.

## Simulação

`services/sensorSimulator.js` substitui, no MVP, o consumo da API REST. A cada **5 segundos**
aplica um passeio aleatório sobre pH, temperatura e turbidez de cada sensor, dentro de limites
plausíveis. A turbidez usa limites **por tipo** — um poço vive na casa de poucos NTU e um tanque
opera uma ordem de grandeza acima. O hook `useSensorSimulation` recalcula status, indicadores e
horário da última leitura — mapa, painel, popups e cores acompanham automaticamente.

## Interações

- Clique em um **card do painel**: o mapa centraliza no sensor (`flyTo`) e abre o popup.
- Clique em um **marcador**: seleciona o sensor e destaca o card correspondente.
- "Reenquadrar Rondônia" volta o mapa à visão do estado inteiro.
- Passar o mouse sobre um município (base vetorial) mostra o nome.
- Filtro por tipo (Todos / Poços / Criadouros): recorta ao mesmo tempo a lista lateral e os
  marcadores do mapa.
- Menu do header navega entre as seções da página única.
- Sensor em estado crítico: o card pisca discretamente e o marcador pulsa.
- Seção **Arquitetura IoT**: o par de botões alterna entre a vista **Fluxo** (as 8 etapas) e a
  vista **Diagrama** (o nó de campo em projeção isométrica). No diagrama, passar o mouse sobre um
  ponto acende o caminho do sinal a montante; clicar fixa a descrição da conexão abaixo da cena.
