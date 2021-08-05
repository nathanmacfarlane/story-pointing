import { useEffect, useState } from 'react';

export const Countdown = () => {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      // setSeconds('BOOOOM!');
    }
  });

  return <h1 style={{ color: 'white' }}>{seconds}s</h1>;
};
