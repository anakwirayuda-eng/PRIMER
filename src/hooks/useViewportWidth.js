import { useEffect, useState } from 'react';

export default function useViewportWidth(fallbackWidth = 1440) {
    const [viewportWidth, setViewportWidth] = useState(() => {
        if (typeof window === 'undefined') return fallbackWidth;
        return window.innerWidth;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return viewportWidth;
}
