const DEFAULT_COLORS = ['#7dd3fc', '#fca5a5', '#facc15', '#a7f3d0', '#c4b5fd', '#fdba74'];

type HoverEffectOptions = {
    radius?: number;
    maxScale?: number;
    colors?: string[];
};

type PixelCenter = {
    el: HTMLElement;
    x: number;
    y: number;
};

function canHover() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function randomColor(colors: string[]) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getCenter(rect: DOMRect) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function setupPixelHoverEffect(container: HTMLElement, options: HoverEffectOptions = {}) {
    if (!canHover()) return () => undefined;

    const radius = options.radius ?? 72;
    const maxScale = options.maxScale ?? 1.18;
    const colors = options.colors ?? DEFAULT_COLORS;

    const pixels = Array.from(container.querySelectorAll<HTMLElement>('.inner-square'));
    let centers: PixelCenter[] = [];
    let rafId: number | null = null;
    let hovering = false;
    let mouseX = 0;
    let mouseY = 0;
    let bounds: DOMRect | null = null;

    const computeCenters = () => {
        bounds = container.getBoundingClientRect();
        centers = pixels.map((el) => {
            const rect = el.getBoundingClientRect();
            const center = getCenter(rect);
            return { el, x: center.x, y: center.y };
        });
    };

    const clearHover = (el: HTMLElement) => {
        if (el.dataset.hoverActive !== 'true') return;
        delete el.dataset.hoverActive;
        delete el.dataset.hoverColor;
        const wasHidden = el.dataset.hoverWasHidden === 'true';
        delete el.dataset.hoverWasHidden;
        el.style.removeProperty('--pixel-hover-scale');
        el.style.removeProperty('background-color');
        el.style.removeProperty('box-shadow');
        if (wasHidden) {
            el.style.opacity = '0';
        }
    };

    const applyHover = (el: HTMLElement, scale: number) => {
        if (el.classList.contains('pixel')) return;
        if (el.hasAttribute('data-music-player-program')) return;
        if (el.dataset.hoverActive !== 'true') {
            const computed = window.getComputedStyle(el);
            const isHidden = computed.display === 'none' || computed.opacity === '0';
            el.dataset.hoverWasHidden = isHidden ? 'true' : 'false';
            el.dataset.hoverActive = 'true';
            el.dataset.hoverColor = randomColor(colors);
        }
        const color = el.dataset.hoverColor ?? randomColor(colors);
        el.style.opacity = '1';
        el.style.setProperty('--pixel-hover-scale', scale.toFixed(3));
        el.style.backgroundColor = color;
        el.style.boxShadow = `0 6px 14px ${color}55`;
    };

    const update = () => {
        rafId = null;
        if (!hovering) {
            centers.forEach(({ el }) => clearHover(el));
            return;
        }

        centers.forEach(({ el, x, y }) => {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius) {
                clearHover(el);
                return;
            }
            const intensity = 1 - dist / radius;
            const scale = 1 + intensity * (maxScale - 1);
            applyHover(el, scale);
        });
    };

    const scheduleUpdate = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(update);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (!bounds) {
            bounds = container.getBoundingClientRect();
        }
        const isInside =
            event.clientX >= bounds.left &&
            event.clientX <= bounds.right &&
            event.clientY >= bounds.top &&
            event.clientY <= bounds.bottom;

        if (isInside && !hovering) {
            hovering = true;
            computeCenters();
        } else if (!isInside && hovering) {
            hovering = false;
        }

        if (!hovering) {
            scheduleUpdate();
            return;
        }

        mouseX = event.clientX;
        mouseY = event.clientY;
        scheduleUpdate();
    };

    const onResize = () => {
        if (!hovering) return;
        computeCenters();
        scheduleUpdate();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', onResize);
        centers.forEach(({ el }) => clearHover(el));
    };
}
