import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal';
import useNavInfo from '../../../customHook/useNavInfo';
import {useTheme} from '../../../customHook/useTheme';
import {userPost} from '../../../store/types';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import SearchInput from '../../../compoents/SearchInput';
import TypeOfValuesPosts from '../pageKit/TypeOfValuesPosts';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }
import AccountItem from '../../../compoents/AccountCard/AccountItem';
import ActivityDetail from '../../../compoents/AccountCard/ActivityDetail';
import { activityDetailType,activityType } from '../../../store/types';

const DUMMYDATA:activityDetailType[] = [
    {
      "type": "follow" ,
      "nickName": "sef",
      "bno": null,
      "rno": null,
      "isFollowing": false,
      "createdAt": "2025-04-19T15:00:00Z",
      "profilePicture":"default_1"
      ,"postPicture":null
    },
    {
      "type": "like",
      "nickName": "sef",
      "bno": 101,
      "rno": null,
      "isFollowing": true,
      "createdAt": "2025-04-19T14:50:00Z",
        "profilePicture":"default_1"
        ,"postPicture":null
    },
    {
      "type": "like",
      "nickName": "sef",
      "bno": 101,
      "rno": 33,
      "isFollowing": false,
      "createdAt": "2025-04-19T14:45:00Z",
      "profilePicture":"default_1",
      "postPicture":null
    },
    {
      "type": "reply",
      "nickName": "sef",
      "bno": 202,
      "rno": null,
      "isFollowing": true,
      "createdAt": "2025-04-19T14:40:00Z",
      "profilePicture":"default_1",
      "postPicture":null
    },
    {
        "type": "reference",
        "nickName": "sef",
        "bno": 202,
        "rno": null,
        "isFollowing": true,
        "createdAt": "2025-04-19T14:40:00Z",
        "profilePicture":"default_1",
        "postPicture":"https://clipo-bucket-123123.s3.ap-northeast-2.amazonaws.com/5ef3c5e4-36fd-46ea-a136-3ff20658b0af.jpeg"
      },
      {
        "type": "reference",
        "nickName": "sef",
        "bno": 202,
        "rno": 14,
        "isFollowing": true,
        "createdAt": "2025-04-19T15:40:00Z",
        "profilePicture":"default_1"
        ,"postPicture":null
      },
    {
      "type": "reply",
      "nickName": "sef",
      "bno": 202,
      "rno": 77,
      "isFollowing": false,
      "createdAt": "2025-04-19T14:38:00Z",
      "profilePicture":"default_1"
      ,"postPicture":null
    },
    {
      "type": "longtime",
      "nickName": "sef",
      "bno": 305,
      "rno": null,
      "isFollowing": true,
      "createdAt": "2025-04-19T14:30:00Z",
      "profilePicture":"default_1"
      ,"postPicture":null
    }
  ] 
  


const ActivityMain =()=>{

    return(
        <div className='px-3'>
        {DUMMYDATA.map((activity,id) => (
        <AccountItem itemInfo={activity} isDark={true}>
             <ActivityDetail
            key={`$activityMain${id}`}            // 각 아이템의 고유 id
            activity={activity}           // activityDetail에 넘길 데이터
            isDark={true}                 // 다크모드 여부
          />
        </AccountItem>
        ))}
      </div>
    )
}

export default ActivityMain;