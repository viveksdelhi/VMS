import React, { useEffect, useState } from 'react';

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 3000; // Duration in ms for the animation
    const startTime = performance.now();

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const updateCounter = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // ensures progress never exceeds 1

      // Apply easing to progress for smooth slowdown at the end
      const easedProgress = easeOutExpo(progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(updateCounter); // Continue animation
      } else {
        setCount(target); // Ensure it ends at the target

        // Delay class addition to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById('counter');
          if (element) {
            element.classList.add('brake'); // Trigger brake animation
          }
        }, 0); // Delay execution to next event loop
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target]);

  return (
    <div
      id="counter"
      style={{
        fontSize: '1em',
        fontWeight: 'bold',
        color: '#4CAF50',
        transition: 'transform 0.1s ease-in-out',
        display: 'inline-block', // Needed for shaking effect
      }}
    >
      {count}
      <style>
        {`
          /* Brake animation */
          .brake {
            animation: brakeAnimation 1s ease-out forwards; 
          }

          @keyframes brakeAnimation {
            0% {
              transform: translateY(0);
            }
            70% {
              transform: translateY(-8px); /* Move forward */
            }
            85% {
              transform: translateY(-4px); /* Abrupt stop and slight rollback */
            }
            100% {
              transform: translateY(0); /* Reset to original position */
            }
          }
        `}
      </style>
    </div>
  );
};

export default Counter;
