import React, {ReactNode,useState,useEffect} from 'react';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService'
import useModal from '../../../customHook/useModal';
import {typeVaildation} from '../../../store/types';
import { AxiosError } from 'axios';
import {useTheme} from '../../../customHook/useTheme';
import CustomValidaterInput from '../../CustomValidaterInput';
import { LuCamera } from "react-icons/lu";
import IconLink from '../../IconLink';
import Button from '../../Button';
interface profileImageType  {
  previewImage:any;
  imageFile:File | undefined
}



const EditProfile =({value}:any) => {
  const {backgroundPicture,brithDay,description,email,followerNumber,followingNumber,location,nickName,profilePicture} = value.fetchedUser;


    interface UsernameProps {
        handleUNsubmit?: (data: string) => void;
        isDark?:boolean;
      }
      
      const { AuthService, UserService } = Services;
          const savedData:any = localStorage.getItem('userDataKey'); 
          const {closeModal} = useModal();
          const { isDark } = useTheme();
      

          const [profileImageType,setProfileImageType] = useState<profileImageType>({previewImage:undefined,imageFile:undefined});
          const [backgroundImageType,setBackgroundImageType] = useState<profileImageType>({previewImage:undefined,imageFile:undefined});
      

          const [nickNameValue,setNickNameValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
          const [descriptionValue,setDescriptionValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
          const [locationValue,setLocationValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})



useEffect(()=>{
  if(value){
    setProfileImageType({previewImage:profilePicture,imageFile:undefined})
    setBackgroundImageType({previewImage:backgroundPicture,imageFile:undefined})
  }
},[value])





          const handleProfileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
            if(event.target.files){
              const profileImg = event.target.files[0];
              setProfileImageType({previewImage:URL.createObjectURL(profileImg),imageFile:profileImg})

              
            }
          };
          
          const handleBackgroundChange = (event:React.ChangeEvent<HTMLInputElement>) => {
            if(event.target.files){
              const profileImg = event.target.files[0];
              setBackgroundImageType({previewImage:URL.createObjectURL(profileImg),imageFile:profileImg})
            }
          };
      
        
          const updateUserProfile = useMutation<void, AxiosError<{ message: string }>,FormData>(UserService.userEditProfile, {
              onSuccess: () => {
                  console.log('이미지 업로드 성공');
                  closeModal();
              },
              onError: (error:AxiosError) => {
                  alert(error.response?.data || '이미지 업로드 실패');
              }
              });
              // const userId = todoCtx.userInfo._id;
          
          const submitProfileInfo =async(e:React.FormEvent<HTMLFormElement>)=> {
            e.preventDefault();
            
     
  
          const formData = new FormData();
      
          if(profileImageType.imageFile){
          formData.append(`profileImage`, profileImageType.imageFile); // 'files'는 서버에서 받을 필드 이름
          }
          if(backgroundImageType.imageFile){
          formData.append(`backgroundImage`, backgroundImageType.imageFile); // 'files'는 서버에서 받을 필드 이름
          }
          if(nickNameValue.touched){
          formData.append('nickName',nickNameValue.value);
          }
          if(descriptionValue.touched){
          formData.append('description',descriptionValue.value);
          }
          if(locationValue.touched){
          formData.append('location',locationValue.value);
          }
          updateUserProfile.mutate(formData)
          }



          const sendValidateValue = (type:string,validateResult:typeVaildation,inputValue:string) =>{
            if(type === 'Username'){
                const nickNameValidate = { ...validateResult, value: inputValue };
                console.log(nickNameValidate)
                setNickNameValue(nickNameValidate)
            }
            else if(type === 'Description'){
              const nickNameValidate = { ...validateResult, value: inputValue };
              setDescriptionValue(nickNameValidate)
            }
            else if(type === 'Location'){
            const nickNameValidate = { ...validateResult, value: inputValue };
            setLocationValue(nickNameValidate)
          }

        }


return(
    <form className="w-full h-116 overflow-auto flex flex-col" onSubmit={submitProfileInfo}>
    {/* <StateTitle isAuthenticated={userInfo.userData.isAuthenticated} state={userInfo?.userData.username!} isBack={true}></StateTitle> */}
    
    <div className="w-full h-[16rem] bg-customGray">
    <input className='hidden' id='backgroundFile'  type="file" name="myFile" onChange={handleBackgroundChange}/>
    <label className='flex justify-center items-center w-full h-full' htmlFor='backgroundFile' >
      <div className='cursor-pointer z-30 absolute bg-customGray opacity-65 rounded-full w-11 h-11 flex justify-center items-center' >
      <LuCamera className='opacity-100'/>
      </div>

      {
        backgroundImageType
        ? <img className="w-full h-full object-cover hover:opacity-85 transition-opacity duration-300" src={backgroundImageType.previewImage} />
        : <div className='w-full h-full bg-emerald-500'></div>
      }
        </label>
    </div>
  
    <div className="w-[92%] flex mx-auto flex-col">
  
      <div className="w-full h-[5rem] flex justify-between">
  
        <div className="w-[9rem] h-[9rem] relative -top-[4.5rem] flex items-center justify-center overflow-hidden border-4 border-white bg-white rounded-full">
        <input className='hidden' id='profileFile'  type="file" name="myFile" onChange={handleProfileChange}/>
        <label className='flex justify-center items-center w-full h-full' htmlFor='backgroundFile' >
      <div className='cursor-pointer z-30 absolute bg-customGray opacity-65 rounded-full w-11 h-11 flex justify-center items-center' >
      <LuCamera/>
      </div>
          {
          profileImageType
            ? <img className="w-full h-full object-cover hover:opacity-85 transition-opacity duration-300 " src={profileImageType.previewImage} />
            : <div className='w-full h-full bg-sky-500'></div>
          }
          </label>
        </div>
  
  
      </div>
  
      <div className="w-relative">
      <CustomValidaterInput initialValue={nickName} sendValidateValue={sendValidateValue} type={'Username'}></CustomValidaterInput>
      <CustomValidaterInput initialValue={description} sendValidateValue={sendValidateValue} type={'Description'}></CustomValidaterInput>
      <CustomValidaterInput initialValue={location} sendValidateValue={sendValidateValue} type={'Location'}></CustomValidaterInput>
      <CustomValidaterInput initialValue={brithDay} sendValidateValue={sendValidateValue} type={'Birthday'}></CustomValidaterInput>
    </div>
    </div>
    {
      !backgroundImageType.imageFile && !profileImageType.imageFile && !nickNameValue.touched && !descriptionValue.touched && !locationValue.touched?
      <Button width={'120px'} padding='12px' background_color={'b-gary'} disabled={true}>Submit</Button>
      :
      <Button width='120px' padding='12px'>Submit</Button>
    }
    </form>
);
}

export default EditProfile;