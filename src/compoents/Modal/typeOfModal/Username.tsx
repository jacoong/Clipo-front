import React from 'react';
import { useState,useEffect } from 'react';
import Button from '../../Button';
import { FaUserCircle } from "react-icons/fa";
import CustomValidaterInput from '../../CustomValidaterInput';
import { typeVaildation } from '../../../store/types';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService'
import { useNavigate } from 'react-router-dom';
import useModal from '../../../customHook/useModal';
import Loading from '../../Loading';
import useMediaQuery from '../../../customHook/useMediaQuery';
interface UsernameProps {
  handleUNsubmit?: (data: string) => void;
  isDark?:boolean;
  isFullScreen?: boolean;
}

interface profileImageType  {
  previewImage:any;
  imageFile:File | undefined
}

const { AuthService, UserService } = Services;

function Username({ isDark, isFullScreen }: UsernameProps) {
    const {closeModal} = useModal();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
  
    // props를 콘솔에 출력 (선택사항)

    type FileReadResult = string | ArrayBuffer | null;

    const [usernameValidate,setUsernameValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
    const [profileImageType,setProfileImageType] = useState<profileImageType>({previewImage:undefined,imageFile:undefined});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const validateUsername = (type:string,validateResult:typeVaildation,inputValue:string) =>{
        if(type === 'Username'){
            const userNameValidate = { ...validateResult, value: inputValue };
            setUsernameValidate(userNameValidate)
        }else{
            console.log('error')
            return
        }
    }

    const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      // 선택된 파일 처리 로직
      console.log(event.target.files,'s')
      if(event.target.files){
        console.log(event.target.files)
        const profileImg = event.target.files[0];
        console.log(profileImg,  'previewImage',URL.createObjectURL(profileImg),'imageFile',profileImg)
        setProfileImageType({
          previewImage:URL.createObjectURL(profileImg),imageFile:profileImg}
        )
      }
    }

  

    const createNicknameProfileImg = useMutation<void, AxiosError<{ message: string }>,FormData>(UserService.createNicknameProfileImg, {
        onSuccess: () => {
            console.log('이미지 업로드 성공');
            setErrorMessage(null); // 성공 시 에러 메시지 초기화
            closeModal()
            navigate('/main')
            // navigate('/main')
        },
        onError: (error:AxiosError) => {
          console.log(error);
          const errorMsg = (error.response?.data as any)?.message || '닉네임 설정에 실패했습니다. 다시 시도해주세요.';
          setErrorMessage(errorMsg);
        }
        });
        // const userId = todoCtx.userInfo._id;
    
    const submitProfileInfo =(e:React.FormEvent<HTMLFormElement>)=> {
      e.preventDefault();
      setErrorMessage(null); // 폼 제출 시 에러 메시지 초기화
      
    const username = usernameValidate.value; // 사용자 이름
    console.log(username,profileImageType.imageFile)
    const formData = new FormData();

    if(profileImageType.imageFile){
      formData.append(`files`, profileImageType.imageFile); // 'files'는 서버에서 받을 필드 이름
    }

    formData.append('nickName', username); // 'username'은 서버에서 받을 필드 이름

    createNicknameProfileImg.mutate(formData)

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    }


    useEffect(()=>{
      console.log('profileImageType',profileImageType)
    },[])

    // 에러 메시지 3초 후 자동 제거
    useEffect(() => {
      if (errorMessage) {
        const timer = setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }, [errorMessage]);

    const cardBackground = isDark
      ? 'bg-[#121212] border border-white/10'
      : 'bg-white border border-gray-100 shadow-lg';
    const helperTextColor = isDark ? 'text-gray-300' : 'text-gray-600';

    const formCard = (
      <div className={`h-full w-full rounded-3xl ${cardBackground} px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-6`}>
        <div className='flex flex-col items-center gap-3 text-center'>
          <h2 className='text-xl font-semibold'>프로필 설정</h2>
          <p className={`text-sm ${helperTextColor}`}>
            프로필 이미지를 등록하고 닉네임을 선택해 주세요. 나중에 프로필 설정에서 언제든 변경할 수 있어요.
          </p>
        </div>
        <div className='w-full flex flex-col items-center gap-4'>
          <input className='hidden' id='imageFile' type="file" name="myFile" onChange={handleFileChange} accept='image/*'/>
          <label
            className={`relative group cursor-pointer rounded-full overflow-hidden w-32 h-32 sm:w-36 sm:h-36 ring-4 ${isDark ? 'ring-white/10' : 'ring-gray-100'} transition-all duration-300 hover:ring-customBlue/80`}
            htmlFor='imageFile'
          >
            {profileImageType.previewImage ? (
              <img className='object-cover w-full h-full' src={profileImageType.previewImage} alt='Selected'/>
            ) : (
              <div className='w-full h-full flex flex-col items-center justify-center gap-0 bg-gradient-to-br from-customBlue/10 via-transparent to-transparent'>
                <FaUserCircle className={`w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300 ${isDark ? 'text-gray-400' : 'text-gray-300'} group-hover:text-customBlue`} />
              </div>
            )}
          </label>
        </div>

        <div className='w-full flex flex-col gap-2'>
          <span className={`text-sm font-medium ${helperTextColor}`}>닉네임</span>
          <CustomValidaterInput type='Username' sendValidateValue={validateUsername}></CustomValidaterInput>
        </div>
      </div>
    );

    const renderError = (extraClass = '') => (
      errorMessage ? (
        <div className={`text-center text-red-500 text-sm font-medium ${extraClass}`}>
          {errorMessage}
        </div>
      ) : null
    );

    const renderActions = (extraClass = '') => (
      <div className={`w-full flex flex-col gap-3 ${extraClass}`}>
        {usernameValidate.touched && !usernameValidate.error 
          ? (
            <Button 
              width={'large'}  
              color={'white'} 
              type="submit"
              isLoading={createNicknameProfileImg.isLoading}
            >
              {createNicknameProfileImg.isLoading ? <Loading /> : '저장하기'}
            </Button>
          ) : (
            <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">저장하기</Button>
          )
        }
        <p className={`text-center text-xs ${helperTextColor}`}>
          이 닉네임은 클리포 전체에서 사용됩니다. 2~12자 사이의 고유한 닉네임을 입력해 주세요.
        </p>
      </div>
    );

    if (isFullScreen) {
      return (
        <div className={`min-h-screen w-full flex flex-col ${isDark ? 'bg-customLightBlack' : 'bg-customRealWhite'}`}>
          <form
            onSubmit={(e) => submitProfileInfo(e)}
            encType='multipart/form-data'
            className='flex flex-col flex-1 w-full max-w-xl mx-auto px-6 pt-12 pb-10'
          >
            <div className='flex-1 overflow-y-auto space-y-6'>
              {formCard}
              {renderError('')}
            </div>
            {renderActions('pt-6')}
          </form>
        </div>
      );
    }

    return(
      <div className='w-full px-4 py-4 sm:px-6 sm:py-6'>
        <form
          onSubmit={(e) => submitProfileInfo(e)}
          encType='multipart/form-data'
          className={`w-full max-w-xl mx-auto ${isMobile ? 'space-y-6' : 'space-y-8'}`}
        >
          {formCard}
          {renderError('')}
          {renderActions('')}
        </form>
      </div>
    );
    }
    
export default Username;
