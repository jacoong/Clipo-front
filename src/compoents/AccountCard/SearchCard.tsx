import React,{useEffect} from 'react';
import SearchAccount from './SearchAccount';
import SearchTag from './SearchTag';
import { UserInfo } from '../../store/types';
import AccountItem from './AccountItem';
import TransitionDiv from '../../compoents/TransitionDiv'
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
interface AccountUserInfo extends Omit<UserInfo, 'nickName'> {
  nickName: string; // null이 아님
}

const SearchCard = ({
  type,
  info,
  isDark,
}: {
  type:'Account'|'Hashtag'
  info: any;
  isDark: boolean;
}) => {
  
  useEffect(()=>{
console.log(info, 'important');
  },[info])

  
  const LinkToAccountForm = (userInfo: AccountUserInfo) => {
    const nickName = userInfo.nickName;
    return`/main/@/${nickName}`;
    }

  // const infotagexample = ['#가','#가자','#과자']
//   return type === 'Account' ? (
  return type === 'Account' ? (
    info.length > 0 ? (
      <div>
        {info.map((accountForm: AccountUserInfo, index: number) => (
          <TransitionDiv>
            <div className={`block border-b h-15`}>
           <Link to={LinkToAccountForm(accountForm)} key={`accountInfo${index}`} className={`block`}>
                <AccountItem itemInfo={accountForm} isDark={true}>
                    <SearchAccount isDark={isDark} itemInfo={accountForm} />
                </AccountItem>
          </Link>
          </div>
          </TransitionDiv>
        ))}
        </div>
    ) : (
      <p className="text-sm text-gray-400 px-3 py-2">검색 결과가 없습니다.</p>
    )
  ) : info.length > 0 ? (
    <div>
      {info.map((tags: string, index: number) => (
          <TransitionDiv>
        <div className={`block border-b h-15
       `} key={`tagInfo${index}`}>
          <SearchTag tagName={tags} isDark={isDark}/>
        </div>
          </TransitionDiv>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-400 px-3 py-2">태그 결과가 없습니다.</p>
  );
};

export default SearchCard;
