import { useEffect } from 'react';
import './RainEffect.css';

const RainEffect = () => {
  useEffect(() => {
    const makeItRain = () => {
      const rainElements = document.querySelectorAll('.rain');
      rainElements.forEach((el) => {
        if (el) {
          el.innerHTML = '';
        }
      });

      let increment = 0;
      let drops = '';
      let backDrops = '';

      while (increment < 100) {
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
        increment += randoFiver;
        drops += `<div class="drop" style="left: ${increment}%; bottom: ${
          randoFiver + randoFiver - 1 + 100
        }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"><div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div><div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div></div>`;
        backDrops += `<div class="drop" style="right: ${increment}%; bottom: ${
          randoFiver + randoFiver - 1 + 100
        }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"><div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div><div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div></div>`;
      }

      const frontRow = document.querySelector('.rain.front-row');
      const backRow = document.querySelector('.rain.back-row');

      if (frontRow) frontRow.insertAdjacentHTML('beforeend', drops);
      if (backRow) backRow.insertAdjacentHTML('beforeend', backDrops);
    };

    makeItRain();
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '200px',
        overflow: 'hidden',
      }}
    >
      <div className="rain front-row"></div>
      <div className="rain back-row"></div>
    </div>
  );
};

export default RainEffect;
