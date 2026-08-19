import { useCallback, useMemo, useRef, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Stats from './components/Stats/Stats';
import SensorMap from './components/Map/SensorMap';
import SensorPanel from './components/SensorCard/SensorPanel';
import Legend from './components/Legend/Legend';
import Architecture from './components/Architecture/Architecture';
import About from './components/About/About';
import Footer from './components/Footer/Footer';
import { useSensorSimulation } from './hooks/useSensorSimulation';
import { useActiveSection } from './hooks/useActiveSection';
import { mockSensors } from './data/mockSensors';
import { SENSOR_TYPE_ALL, filterSensorsByType, formatTime } from './utils/waterQuality';
import styles from './App.module.css';

const SECTION_IDS = ['dashboard', 'sensores', 'arquitetura', 'sobre'];

export default function App() {
  const { sensors, stats, lastUpdate } = useSensorSimulation(mockSensors);
  const { activeSection, scrollToSection } = useActiveSection(SECTION_IDS);

  const [selectedId, setSelectedId] = useState(null);
  // Filtro de tipo vive aqui porque recorta a lista lateral e os marcadores do
  // mapa ao mesmo tempo.
  const [typeFilter, setTypeFilter] = useState(SENSOR_TYPE_ALL);
  // O mapa só recentraliza quando este objeto muda de referência, o que
  // permite reenquadrar o mesmo sensor em cliques repetidos.
  const [focus, setFocus] = useState(null);
  const focusCounter = useRef(0);

  const visibleSensors = useMemo(
    () => filterSensorsByType(sensors, typeFilter),
    [sensors, typeFilter],
  );

  // Um sensor escondido pelo filtro não pode continuar destacado; derivar em
  // vez de sincronizar por efeito evita um render com o estado inconsistente.
  const visibleSelectedId = visibleSensors.some((sensor) => sensor.id === selectedId)
    ? selectedId
    : null;

  const handleCardSelect = useCallback((sensor) => {
    focusCounter.current += 1;
    setSelectedId(sensor.id);
    setFocus({ id: sensor.id, coords: sensor.coords, nonce: focusCounter.current });
  }, []);

  return (
    <div className={styles.page}>
      <Header activeSection={activeSection} onNavigate={scrollToSection} />

      <Hero />

      <main className={styles.main}>
        {/* O título e a descrição da plataforma agora abrem a página no herói;
            aqui fica só o rótulo da seção de indicadores. */}
        <div className={styles.pageHead} id="dashboard">
          <h2 className={styles.pageTitle}>Panorama da rede</h2>
          <p className={styles.liveTag}>
            <span className={styles.liveDot} aria-hidden="true" />
            Leituras ao vivo · {formatTime(lastUpdate)}
          </p>
        </div>

        <Stats stats={stats} />

        <div className={styles.workspace} id="sensores">
          <SensorMap
            sensors={visibleSensors}
            typeFilter={typeFilter}
            selectedId={visibleSelectedId}
            focus={focus}
            onSelect={setSelectedId}
            lastUpdate={lastUpdate}
          />
          <SensorPanel
            sensors={sensors}
            visibleSensors={visibleSensors}
            filter={typeFilter}
            onFilterChange={setTypeFilter}
            selectedId={visibleSelectedId}
            onSelect={handleCardSelect}
            lastUpdate={lastUpdate}
          />
        </div>

        <Legend />

        <div className={styles.sectionSpacer}>
          <Architecture />
        </div>

        <div className={styles.sectionSpacer}>
          <About />
        </div>
      </main>

      <Footer />
    </div>
  );
}
