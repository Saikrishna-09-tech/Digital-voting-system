import { useEffect, useState } from 'react';

export default function ElectionTimer({ endTime, onElectionEnd }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        onElectionEnd?.();
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onElectionEnd]);

  if (!timeLeft) return null;

  return (
    <div className="inline-flex items-center gap-2 text-sm font-semibold">
      <span className="text-indigo-400">⏱️</span>
      <span className={timeLeft === '00:00:00' ? 'text-red-400' : 'text-gray-400'}>
        {timeLeft}
      </span>
    </div>
  );
}
