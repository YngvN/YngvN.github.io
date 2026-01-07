import { useEffect, useRef } from 'react';

type ScrollSnapMousewheelOptions = {
    containerRef: React.RefObject<HTMLElement | null>;
    snapSelector: string;
    onIndexChange?: (index: number) => void;
    wheelDeltaThreshold?: number;
    scrollSettleMs?: number;
    wheelCooldownMs?: number;
};

const useScrollSnapMousewheel = ({
    containerRef,
    snapSelector,
    onIndexChange,
    wheelDeltaThreshold = 50,
    scrollSettleMs = 450,
    wheelCooldownMs = 550,
}: ScrollSnapMousewheelOptions) => {
    const isScrollingRef = useRef(false);
    const lastWheelSnapRef = useRef(0);

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

            return currentIndex;
        };

        const updateIndex = () => {
            if (!onIndexChange) {
                return;
            }

            const snapTargets = getSnapTargets();
            if (snapTargets.length === 0) {
                return;
            }

            const currentIndex = getCurrentIndex(snapTargets, container.scrollTop);
            onIndexChange(currentIndex);
        };

        const isScrollWheel = (event: WheelEvent) => {
            if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
                return true;
            }

            return Math.abs(event.deltaY) > wheelDeltaThreshold;
        };

        const snapToNext = (direction: -1 | 1) => {
            if (isScrollingRef.current) {
                return;
            }

            const snapTargets = getSnapTargets();
            if (snapTargets.length === 0) {
                return;
            }

            const currentIndex = getCurrentIndex(snapTargets, container.scrollTop);
            const nextIndex = Math.min(Math.max(currentIndex + direction, 0), snapTargets.length - 1);
            const target = snapTargets[nextIndex];

            if (!target) {
                return;
            }

            isScrollingRef.current = true;
            container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });

            window.setTimeout(() => {
                isScrollingRef.current = false;
            }, scrollSettleMs);
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
        };

        const handleWheel = (event: WheelEvent) => {
            if (!container.contains(event.target as Node)) {
                return;
            }

            if (!isScrollWheel(event)) {
                return;
            }

            const now = window.performance.now();
            if (now - lastWheelSnapRef.current < wheelCooldownMs) {
                return;
            }

            lastWheelSnapRef.current = now;
            snapToNext(event.deltaY > 0 ? 1 : -1);
        };

        updateIndex();
        container.addEventListener('scroll', handleScroll);
        window.addEventListener('wheel', handleWheel, { passive: true, capture: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleWheel, { capture: true });
        };
    }, [containerRef, snapSelector, onIndexChange, wheelDeltaThreshold, scrollSettleMs, wheelCooldownMs]);
};

export default useScrollSnapMousewheel;
