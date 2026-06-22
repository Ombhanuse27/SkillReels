import { useState, useEffect } from 'react';

const useElementOnScreen = (options, targetRef) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!targetRef || !targetRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, options);

        const currentRef = targetRef.current;
        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
        
    // Stringify options to prevent infinite React re-renders if passed inline
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetRef, JSON.stringify(options)]); 

    return isVisible;
};

export default useElementOnScreen;