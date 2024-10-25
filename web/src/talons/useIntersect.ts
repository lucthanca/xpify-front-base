import { useEffect } from 'react';

export const useIntersect = (options) => {
  const { selector } = options;

  const el = document.querySelector(selector);


  useEffect(() => {
    if (!el) {
      return;
    }
    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Ignore entry if intersecting in leave mode, or not intersecting in enter mode
        if (entry.isIntersecting === (value === 'leave')) return

        evaluate()

        modifiers.includes('once') && observer.disconnect()
      })
    }, options)

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);
  return {};
};
