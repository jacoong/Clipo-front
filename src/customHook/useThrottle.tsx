import { useRef } from 'react';

type UseThrottle = {
  /**
   * throttle: 지정한 delay(ms) 동안 한 번만 callback을 실행합니다.
   * @param callback  실행할 함수
   * @param delay     지연 시간 (ms)
   */
  throttle: (callback: () => void, delay: number) => void;
};

const useThrottle = (): UseThrottle => {
  // 브라우저 setTimeout은 number 반환
  const timerRef = useRef<number | null>(null);

  const throttle = (callback: () => void, delay: number): void => {
    if (!timerRef.current) {
      timerRef.current = window.setTimeout(() => {
        callback();
        timerRef.current = null;
      }, delay);
    }
  };

  return { throttle };
};

export default useThrottle;
