import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

/**
 * Abertura da página: a chamada institucional à esquerda e a maquete 3D da
 * instalação — poço, criadouro, tubulação e gateway — à direita.
 */
export default function Hero() {
  const stageRef = useRef(null);

  // A cena carrega em separado: o three.js pesa mais que todo o resto do
  // pacote e o dashboard não deve esperar por ele para aparecer.
  useEffect(() => {
    let stage = null;
    let cancelled = false;

    import('./aquaStage').then(({ createAquaStage }) => {
      if (cancelled || !stageRef.current) return;
      stage = createAquaStage(stageRef.current, { autorotate: true, floating: true });
    });

    return () => {
      cancelled = true;
      if (stage) stage.dispose();
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Trama de linhas que dá profundidade ao fundo, sem competir com a cena */}
      <div className={styles.rules} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Rede de sensores · Rondônia
          </span>
          <h1 className={styles.title} id="hero-title">
            Qualidade da água em tempo real
          </h1>
          <p className={styles.lead}>
            Sensores de pH e turbidez instalados em poços artesianos e criadouros de peixes de
            Rondônia. As leituras são transmitidas automaticamente para a plataforma, com alerta
            quando um parâmetro sai da faixa.
          </p>
        </div>

        <div className={styles.stageWrap}>
          <div
            className={styles.stage}
            ref={stageRef}
            role="img"
            aria-label="Maquete tridimensional de um poço artesiano e um criadouro de peixes com sondas de pH e turbidez, ligados a um gateway com painel solar e antena."
          />
          <span className={styles.hint}>Arraste para girar · role para aproximar</span>
        </div>
      </div>
    </section>
  );
}
