import { useState, useEffect } from 'react';

const useElementOnScreen = (options, targetRef) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            // Update state to true if the video is currently crossing the screen threshold
            setIsVisible(entry.isIntersecting);
        }, options);

        const currentRef = targetRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        // Cleanup function to unobserve when the component unmounts
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [targetRef, options]);

    return isVisible;
};

export default useElementOnScreen;