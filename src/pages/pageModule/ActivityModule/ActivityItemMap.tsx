import ActivityAccountItem from '../../../compoents/AccountCard/ActivityAccountItem';
import ActivityDetail from '../../../compoents/AccountCard/ActivityDetail';
import { activityDetailType,activityType } from '../../../store/types';
import {useTheme} from '../../../customHook/useTheme';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import {useContext,useEffect,useState,ReactNode, act} from 'react';

interface Props {
    activityValues: activityDetailType[];
  }


const ActivityItemMap = ({ activityValues }: Props) => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const handleNavigate = (activity: activityDetailType) => {
        const path = LinkToActivity(activity);
        navigate(path, { state: { isBack: true } });
      };
    
      const LinkToActivity = (activity: activityDetailType) => {
        const rno = activity.rno;
        const bno = activity.bno;
        const nestRe = activity.nestRe;
        const type = activity.type;
        switch (type) {
            case 'reply':
            case 'reference':
            case 'longtime':
                if(nestRe !== null){
                  return `/main/@/${activity.from}/post/${activity.bno}/comment/${activity.rno}/nestRe/${activity.nestRe}`;
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
          <div
            key={`activityMain-${id}`} // ✅ key는 최상위 div에 줘야 함
            onClick={() => handleNavigate(activity)}
            className={`block border-b ${isDark ? 'border-customLightGray' : 'border-customGray'}`}
          >
            <ActivityAccountItem itemInfo={activity} isDark={true}>
              <ActivityDetail
                activity={activity}
                isDark={isDark}
              />
            </ActivityAccountItem>
          </div>
        ))}
      </div>
    );
  };
  
  export default ActivityItemMap;