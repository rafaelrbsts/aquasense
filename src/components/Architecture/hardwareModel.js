/**
 * Modelo do nó de campo AquaSense em projeção isométrica.
 *
 * Toda a geometria é escrita em coordenadas de mundo (x = largura, y = profundidade,
 * z = altura) e projetada por `iso`. Escrever coordenadas 2D na mão tornaria o desenho
 * impossível de ajustar depois.
 *
 * Convenção da projeção:
 *   x cresce  → direita-baixo      y cresce  → esquerda-baixo      z cresce → cima
 * As faces visíveis de qualquer caixa são o topo (z máximo), a face x+w e a face y+d.
 */

export const VIEW_W = 940;
export const VIEW_H = 560;

const OX = 555;
const OY = 211;
const K = 0.866; // cos 30° — isometria 2:1
const S = 1.12; // escala, ajustada para a cena preencher a faixa entre as colunas

export function iso(x, y, z = 0) {
  return [OX + (x - y) * K * S, OY + ((x + y) * 0.5 - z) * S];
}

const p = (x, y, z = 0) => iso(x, y, z).join(',');

/** Lista de pontos SVG a partir de vértices de mundo */
export const poly = (...pts) => pts.map(([x, y, z]) => p(x, y, z)).join(' ');

/* ---------------------------------------------------------------- corpos */

export const BODIES = {
  // Placa de desenvolvimento ESP32: módulo na ponta y baixo, USB na ponta y alto
  pcb: { x: 0, y: 0, z: 0, w: 84, d: 176, h: 5 },
  wroom: { x: 8, y: 14, z: 5, w: 68, d: 58, h: 4 },
  shield: { x: 12, y: 18, z: 9, w: 60, d: 40, h: 1.5 },
  rtc: { x: 20, y: 96, z: 5, w: 26, d: 18, h: 2.5 },
  usb: { x: 30, y: 176, z: 5, w: 24, d: 12, h: 6 },
  botao1: { x: 6, y: 154, z: 5, w: 12, d: 10, h: 3 },
  botao2: { x: 66, y: 154, z: 5, w: 12, d: 10, h: 3 },

  // Placa de condicionamento PH-4502C, acima e à esquerda
  phBoard: { x: -156, y: -44, z: 0, w: 74, d: 56, h: 4 },
  opamp: { x: -132, y: -28, z: 4, w: 24, d: 14, h: 2.5 },

  // Transceptor LoRa, abaixo e à direita
  loraMod: { x: 150, y: 96, z: 0, w: 68, d: 52, h: 4 },
};

/**
 * Volume d'água — desenhado DEPOIS das sondas e translúcido, para que a parte
 * submersa apareça por trás das faces. Uma lâmina plana não daria essa leitura:
 * em isometria a parte de baixo da sonda cai fora do losango.
 */
export const WATER = { x: -114, y: 146, z: -102, w: 114, d: 92, h: 44 };

/** Sondas, prismas estreitos que atravessam a superfície */
export const PROBES = {
  ph: { x: -106, y: 194, z: -100, w: 12, d: 12, h: 104, bulb: [-100, 200, -96] },
  temp: { x: -24, y: 174, z: -94, w: 9, d: 9, h: 98, tip: [-19.5, 178.5, -92] },
};

/**
 * Barras de pinos. Os quatro usados de cada lado ficam abaixo do módulo —
 * esquerda 3V3/GND/G34/G4, direita G5/G18/G19/G23. Os nomes não vão na
 * serigrafia: nesse tamanho ficariam ilegíveis, e os cartões já os informam.
 */
export const PIN_ROWS = [24, 40, 56, 72, 88, 104, 120, 136, 152];

/* ---------------------------------------------------------------- fios */

/**
 * Cada fio é uma polilinha em coordenadas de mundo. Fios de sinal sobem para
 * z 14–30 no trecho livre e descem para z ≈ 5 ao encostar num pino, para nunca
 * atravessarem visualmente um corpo.
 */
export const SEGMENTS = {
  'probe-board': [
    [-100, 200, 4],
    [-100, 200, 34],
    [-100, 46, 34],
    [-119, 20, 10],
  ],
  'board-adc': [
    [-82, -16, 4],
    [-70, -16, 24],
    [-70, 120, 24],
    [-4, 120, 24],
    [-4, 120, 5],
  ],
  'temp-gpio4': [
    [-20, 178, 4],
    [-20, 178, 30],
    [-20, 136, 30],
    [-4, 136, 30],
    [-4, 136, 5],
  ],
  'adc-cpu': [
    [2, 120, 5],
    [24, 116, 5],
    [24, 78, 5],
    [16, 72, 5],
  ],
  'temp-cpu': [
    [2, 136, 5],
    [34, 132, 5],
    [34, 82, 5],
    [26, 74, 5],
  ],
  'cpu-wifi': [
    [42, 20, 9],
    [42, 8, 26],
    [42, 0, 44],
  ],
  'cpu-spi': [
    [68, 60, 9],
    [78, 74, 5],
    [82, 88, 5],
  ],
  'spi-lora': [
    [89, 120, 4],
    [118, 110, 14],
    [150, 112, 6],
  ],
  'lora-ant': [
    [218, 122, 4],
    [240, 122, 14],
    [262, 122, 26],
  ],
  'usb-reg': [
    [42, 182, 8],
    [42, 164, 6],
    [36, 150, 5],
  ],
  'reg-3v3': [
    [36, 150, 5],
    [54, 146, 5],
    [54, 92, 5],
    [2, 88, 5],
  ],
  'v33-board': [
    [-4, 88, 5],
    [-28, 88, 20],
    [-28, -4, 20],
    [-82, -4, 5],
  ],
  gnd: [
    [-4, 104, 5],
    [-18, 104, 14],
    [-18, 6, 14],
    [-82, 6, 5],
  ],
};

/** Fios de sinal (verde) vs. alimentação (âmbar) vs. terra (cinza) */
export const WIRE_TONE = {
  'probe-board': 'signal',
  'board-adc': 'signal',
  'temp-gpio4': 'signal',
  'adc-cpu': 'signal',
  'temp-cpu': 'signal',
  'cpu-wifi': 'signal',
  'cpu-spi': 'signal',
  'spi-lora': 'signal',
  'lora-ant': 'signal',
  'usb-reg': 'power',
  'reg-3v3': 'power',
  'v33-board': 'power',
  gnd: 'ground',
};

/* ---------------------------------------------------------------- callouts */

const CHAIN_ADC = ['probe-board', 'board-adc', 'adc-cpu'];
const CHAIN_TEMP = ['temp-gpio4', 'temp-cpu'];
const CHAIN_POWER = ['usb-reg', 'reg-3v3', 'v33-board'];

const BOX_W = 186;
const BOX_H = 68;
const LEFT_X = 6;
const RIGHT_X = 748;
// Seis faixas por coluna. Cada ponto ocupa a faixa correspondente à altura da
// sua âncora na tela, para as guias não se cruzarem.
const ROW = [8, 98, 188, 278, 368, 458];

/**
 * `flow` é a cadeia a montante: passar o mouse no rádio LoRa acende o caminho
 * inteiro do dado, do eletrodo até a antena.
 */
export const POINTS = [
  {
    id: 'placa-ph',
    label: 'Placa de condicionamento',
    pin: 'PH-4502C',
    anchor: [-119, -16, 4],
    box: [LEFT_X, ROW[0], BOX_W, BOX_H],
    align: 'end',
    flow: ['probe-board', 'board-adc'],
    description:
      'Amplificador de instrumentação que converte o sinal de altíssima impedância do eletrodo em uma tensão de 0 a 3,3 V legível pelo ESP32. Os dois trimpots ajustam deslocamento e ponto de alarme durante a calibração com as soluções tampão de pH 4,00 e 6,86.',
  },
  {
    id: 'v33',
    label: 'Alimentação 3,3 V',
    pin: '3V3',
    anchor: [0, 88, 5],
    box: [LEFT_X, ROW[1], BOX_W, BOX_H],
    align: 'end',
    flow: CHAIN_POWER,
    description:
      'O regulador da placa alimenta o módulo de condicionamento em 3,3 V. Manter sensor e microcontrolador na mesma tensão evita erro de escala: o conversor do ESP32 usa a própria alimentação como referência de fundo de escala.',
  },
  {
    id: 'gnd',
    label: 'Terra comum',
    pin: 'GND',
    anchor: [0, 104, 5],
    box: [LEFT_X, ROW[2], BOX_W, BOX_H],
    align: 'end',
    flow: ['gnd'],
    description:
      'Referência de 0 V compartilhada entre a placa de condicionamento, a sonda de temperatura e o ESP32. Sem terra único a leitura do eletrodo flutua; em campo o GND também recebe a malha de blindagem do cabo.',
  },
  {
    id: 'adc',
    label: 'Entrada analógica',
    pin: 'GPIO 34 · ADC1_CH6',
    anchor: [0, 120, 5],
    box: [LEFT_X, ROW[3], BOX_W, BOX_H],
    align: 'end',
    flow: CHAIN_ADC,
    description:
      'A saída da placa entra no GPIO 34, pino somente de leitura ligado ao ADC1. O ADC2 fica indisponível enquanto o Wi-Fi está ativo, então a medição de pH usa obrigatoriamente o ADC1. O firmware tira a média de 64 amostras antes de aplicar a curva de calibração.',
  },
  {
    id: 'sonda-ph',
    label: 'Eletrodo de pH',
    pin: 'Sonda combinada · BNC',
    anchor: [-100, 200, -30],
    box: [LEFT_X, ROW[4], BOX_W, BOX_H],
    align: 'end',
    flow: ['probe-board'],
    description:
      'Eletrodo de vidro combinado, submerso no poço ou no tanque. Gera cerca de 59 mV por unidade de pH a 25 °C, com impedância altíssima — por isso o sinal passa antes pela placa de condicionamento. O conector BNC mantém o cabo blindado até a caixa.',
  },
  {
    id: 'temperatura',
    label: 'Sonda de temperatura',
    pin: 'DS18B20 · GPIO 4',
    anchor: [-20, 178, -30],
    box: [LEFT_X, ROW[5], BOX_W, BOX_H],
    align: 'end',
    flow: CHAIN_TEMP,
    description:
      'Sonda digital em aço inox mergulhada ao lado do eletrodo, no barramento OneWire do GPIO 4 com pull-up de 4,7 kΩ. Entra na compensação da leitura: 10 °C de variação na água deslocam o pH medido em cerca de 0,1 unidade.',
  },
  {
    id: 'antena-wifi',
    label: 'Rádio Wi-Fi 2,4 GHz',
    pin: 'Antena impressa no módulo',
    anchor: [42, 0, 44],
    box: [RIGHT_X, ROW[0], BOX_W, BOX_H],
    align: 'start',
    flow: [...CHAIN_ADC, 'cpu-wifi'],
    description:
      'Antena em meandro gravada na própria placa do módulo, em 2,4 GHz. Onde a propriedade tem rede local o nó publica direto na API; o rádio só liga no instante do envio, porque é ele que consome quase toda a energia do ciclo.',
  },
  {
    id: 'cpu',
    label: 'Microcontrolador',
    pin: 'ESP32-WROOM-32 · 2×240 MHz',
    anchor: [42, 44, 10.5],
    box: [RIGHT_X, ROW[1], BOX_W, BOX_H],
    align: 'start',
    flow: [...CHAIN_ADC, ...CHAIN_TEMP],
    description:
      'Dois núcleos de 240 MHz, 520 KB de RAM e 4 MB de flash. Um núcleo cuida da leitura e da calibração, o outro da pilha de rede. É aqui que a média das amostras, a compensação por temperatura e o pacote enviado à API são montados.',
  },
  {
    id: 'rtc',
    label: 'Deep sleep e RTC',
    pin: 'Domínio RTC · ULP',
    anchor: [33, 105, 7.5],
    box: [RIGHT_X, ROW[2], BOX_W, BOX_H],
    align: 'start',
    flow: ['usb-reg', 'reg-3v3'],
    description:
      'Entre uma leitura e outra o ESP32 entra em deep sleep e consome poucos microampères; só o domínio RTC segue ativo para contar o tempo até o próximo despertar. É esse ciclo que permite manter o nó em campo com bateria e um painel solar pequeno.',
  },
  {
    id: 'spi',
    label: 'Barramento do rádio',
    pin: 'SPI · GPIO 5/18/19/23',
    anchor: [89, 112, 5],
    box: [RIGHT_X, ROW[3], BOX_W, BOX_H],
    align: 'start',
    flow: [...CHAIN_ADC, 'cpu-spi'],
    description:
      'Quatro linhas SPI ligam o ESP32 ao transceptor — NSS no GPIO 5, clock no 18, MISO no 19, MOSI no 23 — mais um pino de interrupção que avisa quando o pacote saiu. O ESP32 monta o quadro LoRaWAN e o SX1276 cuida da modulação.',
  },
  {
    id: 'usb',
    label: 'Energia e gravação',
    pin: 'USB-C · 5 V',
    anchor: [42, 182, 11],
    box: [RIGHT_X, ROW[4], BOX_W, BOX_H],
    align: 'start',
    flow: CHAIN_POWER,
    description:
      'Entrada de 5 V que passa pelo regulador de 3,3 V e alimenta todo o nó. O mesmo conector expõe a serial usada para gravar o firmware e acompanhar o log durante a calibração; em campo ele dá lugar à bateria com painel solar.',
  },
  {
    id: 'lora',
    label: 'Rádio LoRa 915 MHz',
    pin: 'RFM95W · SX1276',
    anchor: [184, 122, 4],
    box: [RIGHT_X, ROW[5], BOX_W, BOX_H],
    align: 'start',
    flow: [...CHAIN_ADC, 'cpu-spi', 'spi-lora', 'lora-ant'],
    description:
      'Transceptor na faixa de 915 MHz usada no Brasil, com antena de meia onda. Com fator de espalhamento alto o enlace chega a cerca de 10 km em área rural aberta, o suficiente para alcançar o gateway sem depender de cobertura celular.',
  },
];

/**
 * Linha-guia: diagonal curta da âncora até um cotovelo, depois trecho reto até
 * a borda do cartão. Calculada a partir da caixa para sobreviver a ajustes de
 * geometria sem reescrever caminhos na mão.
 */
export function leaderPath([ax, ay], box, align) {
  const [bx, by, bw, bh] = box;
  const ty = by + bh / 2;
  const tx = align === 'end' ? bx + bw - 6 : bx + 6;
  const elbow = align === 'end' ? tx + 34 : tx - 34;
  return `M${ax} ${ay} L${elbow} ${ty} H${tx}`;
}
