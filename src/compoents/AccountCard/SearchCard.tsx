import React,{useEffect} from 'react';
import SearchAccount from './SearchAccount';
import SearchTag from './SearchTag';
import { UserInfo } from '../../store/types';

interface AccountUserInfo extends Omit<UserInfo, 'nickName'> {
  nickName: string; // null이 아님
}

const SearchCard = ({
  type,
  info,
  isDark,
}: {
  type: 'Account' | 'HashTag';
  info: any;
  isDark: boolean;
}) => {
  
  useEffect(()=>{
console.log(info, 'important');
  },[info])


  const infotagexample = ['#가','#가자','#과자']
//   return type === 'Account' ? (
  return type === 'Account' ? (
    info.length > 0 ? (
      <div className=''>
        {info.map((accountForm: AccountUserInfo, index: number) => (
          <div key={`accountInfo${index}`}>
            <SearchAccount isDark={isDark} itemInfo={accountForm} />
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400 px-3 py-2">검색 결과가 없습니다.</p>
    )
  ) : infotagexample.length > 0 ? (
    <div className=''>
      {infotagexample.map((tags: string, index: number) => (
        <div key={`tagInfo${index}`}>
          <SearchTag tagName={tags} isDark={isDark}/>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-400 px-3 py-2">태그 결과가 없습니다.</p>
  );
};

export default SearchCard;
