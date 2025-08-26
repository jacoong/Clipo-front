import {useContext,useEffect,useState,ReactNode, act} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal';
import useNavInfo from '../../../customHook/useNavInfo';
import {useTheme} from '../../../customHook/useTheme';
import {userPost} from '../../../store/types';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import SearchInput from '../../../compoents/SearchInput';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }

import { activityDetailTypeaa,activityType } from '../../../store/types';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import ActivityItemMap from './ActivityItemMap'


const SSE_URL = 'example.url' // sse url

// const DUMMYDATA:activityDetailTypeaa[] = [
//   {
//     "type": "follow" ,
//     "from": "sefe",
//     "bno": 5,
//     "rno": null,
//     "nestRe":null,
//     "isFollowing": false,
//     "createdAt": "2025-04-19T15:00:00Z",
//     "userProfileImage":"default_2"
//     ,"boardOneImage":null,
//     "isRead":false
//   },
//   {
//     "type": "like",
//     "from": "sefe",
//     "bno": 11,
//     "rno": null,
//     "nestRe":null,
//     "isFollowing": true,
//     "createdAt": "2025-04-19T14:50:00Z",
//       "userProfileImage":"default_2"
//       ,"boardOneImage":null,
//       "isRead":false
//   },
//   {
//     "type": "like",
//     "from": "sefe",
//     "bno": 2,
//     "rno": 33,
//     "nestRe":null,
//     "isFollowing": false,
//     "createdAt": "2025-04-19T14:45:00Z",
//     "userProfileImage":"default_2",
//     "boardOneImage":null,    "isRead":false
//   },
//   {
//     "type": "reply",
//     "from": "sefe",
//     "bno": 10,
//     "rno": 31,
//     "nestRe":null,
//     "isFollowing": true,
//     "createdAt": "2025-04-19T14:40:00Z",
//     "userProfileImage":"default_2",
//     "boardOneImage":"https://clipo-bucket-123123.s3.ap-northeast-2.amazonaws.com/73911bfe-3873-4ec0-b6d5-185ab6ee6361.PNG",
//     "isRead":false
//   },
//   {
//       "type": "reference",
//       "from": "sef",
//       "bno": 6,
//       "rno": null,
//       "nestRe":null,
//       "isFollowing": true,
//       "createdAt": "2025-04-19T14:40:00Z",
//   "userProfileImage":"default_2",
//       "boardOneImage":"https://clipo-bucket-123123.s3.ap-northeast-2.amazonaws.com/5ef3c5e4-36fd-46ea-a136-3ff20658b0af.jpeg",
//       "isRead":false
//     },
//     {
//       "type": "reference",
//       "from": "sefe",
//       "bno": 11,
//       "rno": 14,
//       "nestRe":null,
//       "isFollowing": true,
//       "createdAt": "2025-04-19T15:40:00Z",
//   "userProfileImage":"default_2"
//       ,"boardOneImage":null,
//       "isRead":false
//     },
//     {
//       "type": "reference",
//       "from": "sefe",
//       "bno": 144,
//       "rno": 3,
//       "nestRe":27,
//       "isFollowing": true,
//       "createdAt": "2025-04-19T15:45:00Z",
//   "userProfileImage":"default_2"
//       ,"boardOneImage":null,
//       "isRead":false
//     },
//   {
//     "type": "reply",
//     "from": "sefe",
//     "bno": 202,
//     "rno": 77,
//     "nestRe":null,
//     "isFollowing": false,
//     "createdAt": "2025-04-19T14:38:00Z",
//     "userProfileImage":"default_2"
//     ,"boardOneImage":null,
//     "isRead":false
//   },
//   {
//     "type": "longtime",
//     "from": "sefe",
//     "bno": 305,
//     "rno": null,
//     "nestRe":null,
//     "isFollowing": true,
//     "createdAt": "2025-04-19T14:30:00Z",
//     "userProfileImage":"default_2"
//     ,"boardOneImage":null,
//     "isRead":false
//   }
// ] 

const ActivityMain =()=>{



    

  // useEffect(() => {



    
    return(
        <div>
          {/* <ActivityItemMap activityValues={DUMMYDATA}></ActivityItemMap> */}
          <PageNationStandard typeOfFilter='Activity'></PageNationStandard>
      </div>
    )
}

export default ActivityMain;