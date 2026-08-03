import { useCallback, useRef, useState } from 'react';
import Header from './components/Header/Header';
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
import { formatTime } from './utils/phStatus';
import styles from './App.module.css';

const SECTION_IDS = ['dashboard', 'sensores', 'arquitetura', 'sobre'];

export default function App() {
  const { sensors, stats, lastUpdate } = useSensorSimulation(mockSensors);
  const { activeSection, scrollToSection } = useActiveSection(SECTION_IDS);

  const [selectedId, setSelectedId] = useState(null);
  // O mapa só recentraliza quando este objeto muda de referência, o que
  // permite reenquadrar o mesmo sensor em cliques repetidos.
  const [focus, setFocus] = useState(null);
  const focusCounter = useRef(0);

  const handleCardSelect = useCallback((sensor) => {
    focusCounter.current += 1;
    setSelectedId(sensor.id);
    setFocus({ id: sensor.id, coords: sensor.coords, nonce: focusCounter.current });
  }, []);

  return (
    <div className={styles.page}>
      <Header activeSection={activeSection} onNavigate={scrollToSection} />

      <main className={styles.main}>
        <div className={styles.pageHead} id="dashboard">
          <div>
            <h1 className={styles.pageTitle}>Qualidade da água em tempo real</h1>
            <p className={styles.pageSubtitle}>
              Rede de sensores de pH instalada em poços artesianos e criadouros de peixes de
              Rondônia, com leituras transmitidas automaticamente para a plataforma.
            </p>
          </div>
          <p className={styles.liveTag}>
            <span className={styles.liveDot} aria-hidden="true" />
            Leituras ao vivo · {formatTime(lastUpdate)}
          </p>
        </div>

        <Stats stats={stats} />

        <div className={styles.workspace} id="sensores">
          <SensorMap
            sensors={sensors}
            selectedId={selectedId}
            focus={focus}
            onSelect={setSelectedId}
            lastUpdate={lastUpdate}
          />
          <SensorPanel
            sensors={sensors}
            selectedId={selectedId}
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
