import ActivityAccountItem from '../../../compoents/AccountCard/ActivityAccountItem';
import ActivityDetail from '../../../compoents/AccountCard/ActivityDetail';
import { activityDetailType,activityType } from '../../../store/types';
import {useTheme} from '../../../customHook/useTheme';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import {useContext,useEffect,useState,ReactNode, act} from 'react';
import TransitionDiv from '../../../compoents/TransitionDiv';
import { Border_color_Type } from '../../../store/ColorAdjustion';
import { useUpdateisRead } from '../../../customHook/useUpdateisRead';

interface Props {
    activityValues: activityDetailType[];
  }


const ActivityItemMap = ({ activityValues }: Props) => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const {handleUseUpdatedisRead} = useUpdateisRead();

    // 여기에다가 종합 함수 하나  생성, 함수 하나 더 생성
    // 
    const updateReadInfo = (activity: activityDetailType) =>{
      handleNavigate(activity);
      handleUseUpdatedisRead(activity.nno)
    }

    const handleNavigate = (activity: activityDetailType) => {
        const path = LinkToActivity(activity);
        navigate(path, { state: { isBack: true } });
      };
    
      const LinkToActivity = (activity: activityDetailType) => {
        const rno = activity.rno;
        const bno = activity.bno;
        const parentRe = activity.parentRe;
        const type = activity.type;
        switch (type) {
            case 'reply':
            case 'reference':
            case 'longtime':
                if(parentRe !== null){
                  return `/main/@/${activity.from}/post/${activity.bno}/comment/${activity.parentRe}/nestRe/${activity.rno}`;
                }else if(rno !== null){
                  return `/main/@/${activity.from}/post/${activity.bno}/comment/${activity.rno}`;
                }else{
                  return `/main/@/${activity.from}/post/${activity.bno}`;
                }
            case 'follow':
            case 'like':
                return`/main/@/${activity.from}`;
            default:
                return '/main/activity'
        }
    
      };

      
    return (
      <div>
        {activityValues.map((activity, id) => (
          <TransitionDiv isDark={isDark}>
          <div
            key={`activityMain-${id}`} // ✅ key는 최상위 div에 줘야 함
            onClick={() => updateReadInfo(activity)}
            className={`block border-b ${Border_color_Type(isDark)}`}
          >
            <ActivityAccountItem itemInfo={activity} isDark={true}>
              <ActivityDetail
                activity={activity}
                isDark={isDark}
              />
            </ActivityAccountItem>
          </div>
          </TransitionDiv>
        ))}
      </div>
    );
  };
  
  export default ActivityItemMap;