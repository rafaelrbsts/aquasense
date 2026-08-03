import { useCallback, useEffect, useState } from 'react';

/** Compensa a altura do header fixo ao rolar até uma seção. */
const SCROLL_OFFSET = 76;

/**
 * Observa as seções da página única e devolve qual delas está em foco,
 * além da função usada pelo menu do header para navegar até cada uma.
 */
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: [0.1, 0.4] },
    );

    sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(id);
  }, []);

  return { activeSection, scrollToSection };
}
