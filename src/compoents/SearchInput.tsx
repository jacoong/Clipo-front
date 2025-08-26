import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import SearchFilterType from '../pages/pageModule/MainPage/SearchMenu';
import { IoSearchOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { Border_color_Type,Bg_color_Type_3, Font_color_Type_1} from '../store/ColorAdjustion';

interface SearchInputProps {
  isDark:boolean;
  searchFilter:{filter: 'Hashtag' | 'Account'; value: string|null};
  detectValueAndFilter: (payload: { filter: 'Hashtag' | 'Account'; value: string }) => void;
  // searchFilter:SearchInputProps;
}

function SearchMenu({isDark,detectValueAndFilter,searchFilter}:SearchInputProps) {
    
    const [isInputFocus, setIsInputFocus] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [firstHashtag, setFirstHashtag] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setText(input);
      console.log(input)
  
      // 정규식으로 첫 번째 해시태그만 추출
      const match = input.match(/^#\S*/); // #로 시작하고 공백 전까지 전부 매칭


      let value = input;
      if (!match && input.startsWith('@')) {
        // 맨 앞에 있는 @만 제거
        value = input.replace(/^@/, '');
      }

      detectValueAndFilter(
        match
          ? { filter: 'Hashtag', value: match[0] }
          : { filter: 'Account', value: value }
      );
    };
  
    const submitChange = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  

      const value = searchFilter.value; // 검색어
  
      if (!value) return;
  
      if (searchFilter.filter === 'Hashtag') {
        navigate(`type/hashtag?value=${encodeURIComponent(value)}`);
      } else {
        navigate(`type/account?value=${encodeURIComponent(value)}`);
      }
    };



  
    return(
      <div className={`border-b ${Border_color_Type(isDark)} ${Bg_color_Type_3(isDark)} px-4 pt-4 pb-1`}>
      <form onSubmit={submitChange} className="flex w-full h-10 items-center">
        {!isInputFocus  ?
          <label
          htmlFor="searchInput"
          className='px-3 text-xl flex justify-center items-center h-full cursor-pointer'
        >
          <IoSearchOutline />
        </label>:
        null
        }
        <input
          id="searchInput"
          onFocus={() => setIsInputFocus(true)}
          onBlur={() => setIsInputFocus(false)}
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="해시태그를 포함한 텍스트를 입력하세요"
          className={`${Font_color_Type_1(isDark)} ${Bg_color_Type_3(isDark)} w-full h-full p-1 outline-none focus:outline-none`}
        />
        {!isInputFocus  ?
          null:
          <div onMouseDown={(e) => e.preventDefault()} className='px-3 flex justify-center items-center h-full'>
          <MdCancel onClick={()=>setText('')} className={`cursor-pointer border-none ${Border_color_Type(isDark)}`} />
          </div>
          }
      </form>
    </div>
    

    )
}
export default SearchMenu;