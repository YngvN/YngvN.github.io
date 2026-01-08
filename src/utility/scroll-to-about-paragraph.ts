import type { RefObject } from 'react';

const scrollToAboutParagraph = (containerRef: RefObject<HTMLElement | null>, targetIndex: number) => {
    const container = containerRef.current;
    if (!container) {
        return;
    }

    const sections = Array.from(container.querySelectorAll<HTMLElement>('.about-snap'));
    if (sections.length === 0) {
        return;
    }

    const safeIndex = ((targetIndex % sections.length) + sections.length) % sections.length;
    sections[safeIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default scrollToAboutParagraph;
