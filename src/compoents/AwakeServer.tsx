import React from 'react';
import { useMutation } from 'react-query';
import Services from '../store/ApiService';
import Loading from './Loading'; // 로딩 스피너 컴포넌트
import { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

// --- 아이콘 컴포넌트들 ---
const SuccessIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const PowerIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 112 0v5a1 1 0 11-2 0V5z" clipRule="evenodd" />
    </svg>
);


// --- 상태별 UI를 렌더링하는 내부 컴포넌트 ---
interface ButtonStateProps {
  icon?: React.ReactNode;
  text: string;
}
const ButtonState: React.FC<ButtonStateProps> = ({ icon, text }) => (
  <motion.div
    key={text} // key를 텍스트로 주어 내용이 바뀔 때마다 애니메이션이 트리거되도록 함
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2 }}
    className="flex items-center justify-center space-x-2 w-full"
  >
    {icon}
    <span>{text}</span>
  </motion.div>
);


// --- 메인 컴포넌트 ---
interface AwakeServerProps {
  isDark?: boolean;
  className?: string;
}

const AwakeServer: React.FC<AwakeServerProps> = ({ isDark = false, className = '' }) => {
  const wakeUpMutation = useMutation(
    () => Services.AuthService.wakeUp(),
    {
      // onSuccess, onError는 이전과 동일
    }
  );

  const handleWakeUp = () => {
    if (wakeUpMutation.isLoading) return;
    wakeUpMutation.mutate();
  };
  
  // 상태에 따라 버튼의 내용과 스타일 결정
  const { content, style } = React.useMemo(() => {
    const baseStyle = 'w-48 h-12 flex items-center justify-center rounded-lg font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
    const interactionStyle = wakeUpMutation.isLoading ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95';

    if (wakeUpMutation.isLoading) {
      return {
        content: <ButtonState icon={<Loading />} text="Waking Up..." />,
        style: `${baseStyle} bg-gray-500 ${interactionStyle}`,
      };
    }
    if (wakeUpMutation.isSuccess) {
      return {
        content: <ButtonState icon={<SuccessIcon />} text="Server is Online" />,
        style: `${baseStyle} bg-green-500 focus:ring-green-400 ${interactionStyle}`,
      };
    }
    if (wakeUpMutation.isError) {
      return {
        content: <ButtonState icon={<ErrorIcon />} text="Connection Failed" />,
        style: `${baseStyle} bg-red-500 focus:ring-red-400 ${interactionStyle}`,
      };
    }
    // 기본 상태
    return {
      content: <ButtonState icon={<PowerIcon />} text="Wake Up Server" />,
      style: `${baseStyle} ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-black'} focus:ring-gray-500 ${interactionStyle}`,
    };
  }, [wakeUpMutation.status, isDark]);


  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={handleWakeUp}
        disabled={wakeUpMutation.isLoading}
        className={style}
      >
        <AnimatePresence mode="wait">
          {content}
        </AnimatePresence>
      </button>
      <p className={`mt-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        서버가 잠들어 있어, 반드시 눌러주시기 바랍니다. (첫 응답은 다소 지연될 수 있습니다)
      </p>
    </div>
  );
};

export default AwakeServer;