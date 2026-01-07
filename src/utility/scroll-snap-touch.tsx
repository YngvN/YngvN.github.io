import { useEffect, useRef } from 'react';

type ScrollSnapOptions = {
    containerRef: React.RefObject<HTMLElement | null>;
    snapSelector: string;
    onIndexChange?: (index: number) => void;
    snapDelay?: number;
    minSnapDistance?: number;
    scrollSettleMs?: number;
};

const useScrollSnapTouch = ({
    containerRef,
    snapSelector,
    onIndexChange,
    snapDelay = 160,
    minSnapDistance = 2,
    scrollSettleMs = 450,
}: ScrollSnapOptions) => {
    const isScrollingRef = useRef(false);
    const wheelTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const getSnapTargets = () =>
            Array.from(container.querySelectorAll<HTMLElement>(snapSelector));

        const getCurrentIndex = (snapTargets: HTMLElement[], scrollTop: number) => {
            let currentIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            snapTargets.forEach((target, index) => {
                const distance = Math.abs(target.offsetTop - scrollTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    currentIndex = index;
                }
            });

            return { currentIndex, closestDistance };
        };

        const updateIndex = () => {
            if (!onIndexChange) {
                return;
            }

            const snapTargets = getSnapTargets();
            if (snapTargets.length === 0) {
                return;
            }

            const { currentIndex } = getCurrentIndex(snapTargets, container.scrollTop);
            onIndexChange(currentIndex);
        };

        const snapToClosest = (direction?: -1 | 1) => {
            if (isScrollingRef.current) {
                return;
            }

            const snapTargets = getSnapTargets();
            if (snapTargets.length === 0) {
                return;
            }

            const scrollTop = container.scrollTop;
            const { currentIndex, closestDistance } = getCurrentIndex(snapTargets, scrollTop);
            let target = snapTargets[currentIndex];

            if (direction) {
                const nextIndex = Math.min(Math.max(currentIndex + direction, 0), snapTargets.length - 1);
                target = snapTargets[nextIndex];
            } else if (closestDistance < minSnapDistance) {
                return;
            }

            isScrollingRef.current = true;
            container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });

            window.setTimeout(() => {
                isScrollingRef.current = false;
            }, scrollSettleMs);
        };

        const scheduleSnap = () => {
            if (wheelTimeoutRef.current) {
                window.clearTimeout(wheelTimeoutRef.current);
            }

            if (!isScrollingRef.current) {
                wheelTimeoutRef.current = window.setTimeout(() => {
                    snapToClosest();
                }, snapDelay);
            }
        };

        let isTicking = false;
        const handleScroll = () => {
            if (isTicking) {
                return;
            }

            isTicking = true;
            window.requestAnimationFrame(() => {
                updateIndex();
                isTicking = false;
            });

            scheduleSnap();
        };

        updateIndex();
        container.addEventListener('scroll', handleScroll);
        const handleScrollEnd = () => {
            snapToClosest();
        };

        container.addEventListener('scrollend', handleScrollEnd);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('scrollend', handleScrollEnd);
            if (wheelTimeoutRef.current) {
                window.clearTimeout(wheelTimeoutRef.current);
            }
        };
    }, [
        containerRef,
        snapSelector,
        onIndexChange,
        snapDelay,
        minSnapDistance,
        scrollSettleMs,
    ]);
};

export default useScrollSnapTouch;
