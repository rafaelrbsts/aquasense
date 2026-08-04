import { useCallback, useEffect, useRef, useState } from 'react';

/** Compensa a altura do header fixo ao rolar até uma seção. */
const SCROLL_OFFSET = 76;

/** Linha de leitura: logo abaixo do header, onde a seção "começa" para o olho. */
const ACTIVE_LINE = 96;

/** Tempo máximo que a rolagem suave do menu segura o destaque no alvo. */
const SMOOTH_SCROLL_TIMEOUT = 900;

/**
 * Observa as seções da página única e devolve qual delas está em foco,
 * além da função usada pelo menu do header para navegar até cada uma.
 *
 * A posição é calculada direto do scroll, e não por IntersectionObserver: as
 * seções têm alturas muito desiguais — o mapa ocupa uma tela inteira e o
 * cabeçalho do dashboard tem poucas dezenas de pixels — e comparar razão de
 * interseção elegia a seção curta, que atinge 100% de visibilidade enquanto a
 * longa nunca passa de uma fração. Daí o destaque não acompanhar a tela.
 */
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  // Durante a rolagem suave o cálculo por posição apontaria cada seção
  // intermediária; o alvo do clique manda até a página chegar nele.
  const pendingTarget = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      if (sections.length === 0) return;

      // No fim da página a última seção pode nunca cruzar a linha de leitura,
      // se for mais curta que a viewport.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      const above = sections.filter((el) => el.getBoundingClientRect().top <= ACTIVE_LINE);
      const current = atBottom
        ? sections[sections.length - 1].id
        : (above[above.length - 1] ?? sections[0]).id;

      if (pendingTarget.current) {
        if (pendingTarget.current !== current) return;
        pendingTarget.current = null;
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    pendingTarget.current = id;
    setActiveSection(id);
    window.scrollTo({ top, behavior: 'smooth' });

    // Rede de segurança: se o alvo não for alcançável — última seção curta,
    // página no fim — o destaque voltaria a seguir a rolagem de qualquer forma.
    window.setTimeout(() => {
      if (pendingTarget.current === id) pendingTarget.current = null;
    }, SMOOTH_SCROLL_TIMEOUT);
  }, []);

  return { activeSection, scrollToSection };
}
