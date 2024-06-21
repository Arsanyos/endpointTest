import { useEffect, useState } from 'react';

export function useIsVisible(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    console.log(ref.current);
    if (ref.current == null || ref.current == undefined) return false;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => {
      console.log(observer);
      if (observer) observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
