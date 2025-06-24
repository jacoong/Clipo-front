import { useRef } from 'react';
import useThrottle from './useThrottle'
import {activityType,activityDetailTypeaa} from '../store/types'


interface NotificationData extends Pick<activityDetailTypeaa, 'type' | 'rno' | 'bno' | 'from' |'nestRe'> {}

const TIMEOUT = 5000;

const usePushNotification = () => {
  const notificationRef = useRef<Notification | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { throttle } = useThrottle();



  const setNotificationTimer = (timeout: number): void => {
    throttle(() => {
      if (notificationRef.current) {
        notificationRef.current.close();
        notificationRef.current = null;
      }
    }, timeout);
  };

  

  const getTargetUrlByType = (type: activityType,from:string,bno?:number,rno?: number,nestRe?:number) => {
    switch (type) {
      case 'reference':
      case 'follow':
        return `http://localhost:3000/main/@/${from}`;
      case 'like':
        if(nestRe){
          return `http://localhost:3000/main/@/post/${bno}/comment/${rno}/nestRe/${nestRe}`;
        }else if(rno){
          return `http://localhost:3000/main/@/post/${bno}/comment/${rno}`;
        }else{
          return `http://localhost:3000/main/@/post/${bno}`;
        }
      case 'board':
        return `http://localhost:3000/main/@/post/${bno}`;
      case 'reply':
        return `http://localhost:3000/main/@/post/${bno}/comment/${rno}`;
      default:
        return 'http://localhost:3000/main/';
    }
  };


  const setNotificationClickEvent = (notificationData:NotificationData) => {
    if (notificationRef.current) {
      notificationRef.current.onclick = (event) => {
        event.preventDefault();
        window.focus();

        const type = notificationData.type;
        const bno = notificationData.bno ?? undefined;
        const rno = notificationData.rno ?? undefined;
        const nestRe = notificationData.nestRe ?? undefined;
        const from = notificationData.from;

        const targetUrl = getTargetUrlByType(type,from,bno,rno,nestRe);
        window.location.href = targetUrl;

        notificationRef.current?.close();
      };
    }
  };

  const renderWIthinCondition = (type:any,rno:any)=>{
    switch (type) {
        case 'board':
          return `님이 새 게시물을 올렸습니다:`;
        case 'reply':
          return `님이 게시글에 댓글을 남겼습니다`;
        case 'like':
            if(rno !== null){
                return `님이 회원님의 게시물을 좋아합니다.`;
            }else{
                return  `님이 회원님의 댓글을 좋아합니다.`;
            }
        case 'reference':
            if(rno !== null){
                return `님이 회원님을 게시글에서 언급했습니다.`;
            }else{
                return  `님이 회원님을 댓글에서 언급했습니다.`;
            }
        case 'follow':
          return `님이 회원님을 팔로우하기 시작했습니다.`;
        case 'longtime':
          return `님이 오랜만에 게시글을 올렸습니다.`;
        default:
          return '';
      }
}


//   const setNotificationTimer = (timeout: number) => {
//     timerRef.current = setTimeout(() => {
//       timerRef.current = null;
//       notificationRef.current?.close();
//       notificationRef.current = null;
//     }, timeout);
//   };

  const fireNotificationWithTimeout = (
    options: NotificationOptions & { data?: NotificationData } = {} // data promise = type, id
  ) => {
    if (Notification.permission !== 'granted'){
        console.log('permission granted!')
        return;
    }

    const notificationData = options.data;
    const dynamicBody =
    notificationData?.from && notificationData?.type
      ? `${notificationData.from}${renderWIthinCondition(notificationData.type, notificationData.rno)}`
      : '새 알림이 도착했습니다.';

      const newOption: NotificationOptions & { data?: NotificationData } = {
        badge: '/logo3.png',
        icon: '/logo3.png',
        body: dynamicBody, // ✅ 동적으로 생성된 메시지
        ...options,
      };

    if (!notificationRef.current) {
      setNotificationTimer(TIMEOUT);
      notificationRef.current = new Notification('Clipo Service',newOption);
      const notificationData = newOption?.data;
      if(notificationData){
        setNotificationClickEvent(notificationData);
      }
    }
    console.log('sef',notificationRef.current)
  };

  return { fireNotificationWithTimeout };
};

export default usePushNotification;
