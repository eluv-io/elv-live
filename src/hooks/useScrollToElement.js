import {useEffect, useRef, useState} from "react";

const useScrollToElement = (ref) => {
  const [isInStickyZone, setIsInStickyZone] = useState(false);
  const lastScrollY = useRef(0);
  const hasSnapped = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;
          const isInView = entry.isIntersecting && entry.intersectionRatio > 0.1;

          setIsInStickyZone(isInView);

          if(
            entry.isIntersecting &&
            isScrollingDown
          ) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            const middle = viewportHeight / 2;

            const topMagnetZone = {
              start: middle - 100,
              end: middle + 100
            };

            let shouldSnap = false;
            let scrollTarget = "start";

            if (rect.top >= topMagnetZone.start && rect.top <= topMagnetZone.end) {
              shouldSnap = true;
              scrollTarget = "start";
            }

            if(shouldSnap && !hasSnapped.current) {
              hasSnapped.current = true;
              setTimeout(() => {
                entry.target.scrollIntoView({
                  behavior: "smooth",
                  block: scrollTarget
                });
              }, 100);
            }
          }

          if(!entry.isIntersecting || entry.intersectionRatio < 0.05) {
            hasSnapped.current = false;
          }

          lastScrollY.current = currentScrollY;
        });
      },
      {
        threshold: [0.05, 0.1, 0.3, 0.7],
        rootMargin: "0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return { isInStickyZone };
};

export default useScrollToElement;
