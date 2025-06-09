import React, {ReactNode,useState,useEffect} from 'react';
import { useMutation,useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import Services from '../../../store/ApiService'
import useModal from '../../../customHook/useModal';
import {typeVaildation} from '../../../store/types';
import { AxiosError } from 'axios';
import {useTheme} from '../../../customHook/useTheme';
import CustomValidaterInput from '../../CustomValidaterInput';
import { LuCamera } from "react-icons/lu";
import IconLink from '../../IconLink';
import Button from '../../Button';
import { FaUserCircle } from "react-icons/fa";
import {returnDefaultBackgroundColor,returnDefaultProfileImg} from '../../../store/functionStore';

interface profileImageType  {
  previewImage:undefined|string;
  imageFile:File | undefined
}



const EditProfile =({value}:any) => {
  console.log(value)
  const {backgroundPicture,brithDay,description,email,followerNumber,followingNumber,location,nickName,profilePicture} = value.profileInfo;


      
      const { AuthService, UserService } = Services;
          const savedData:any = localStorage.getItem('userDataKey'); 
          const {closeModal,openModal} = useModal();
          const { isDark } = useTheme();
          const queryClient = useQueryClient();
          const navigate = useNavigate();

          const [profileImageType,setProfileImageType] = useState<profileImageType>({previewImage:undefined,imageFile:undefined});
          const [backgroundImageType,setBackgroundImageType] = useState<profileImageType>({previewImage:undefined,imageFile:undefined});
      

          const [nickNameValue,setNickNameValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
          const [descriptionValue,setDescriptionValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
          const [locationValue,setLocationValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
          const [birthdayValue,setBirthdayValue] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})


useEffect(()=>{
  if(value){
    setProfileImageType({previewImage:profilePicture,imageFile:undefined})
    setBackgroundImageType({previewImage:backgroundPicture,imageFile:undefined})
  }
},[value])





          const handleProfileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
            if(event.target.files){
              const profileImg = event.target.files[0];
              console.log(profileImg,'profile')
              setProfileImageType({previewImage:URL.createObjectURL(profileImg),imageFile:profileImg})

              
            }
          };
          
          const handleBackgroundChange = (event:React.ChangeEvent<HTMLInputElement>) => {
            if(event.target.files){
              const profileImg = event.target.files[0];
              console.log(profileImg,'background')
              setBackgroundImageType({previewImage:URL.createObjectURL(profileImg),imageFile:profileImg})
            }
          };
      
        
          const {
            mutate:updateUserProfile,
            isLoading, 
            isSuccess,
            isError,
          } = useMutation<void, AxiosError<{ message: string }>,FormData>(UserService.userEditProfile, {
              onMutate:() =>{
                if(nickNameValue.touched){
                  openModal({ type:'confirmRefresh', props: { isPotal:false,isForce:true,modal:{width:'w-80',navButtonOption:{isClose:true}}} });
                  return
                }
              },
              onSuccess: () => {
                  console.log('updateUserProfile 성공');
                    queryClient.invalidateQueries(['profileInfo',nickName]);
                    closeModal();
                  // navigate(`/main/@/${nickNameValue.value}`)
              },
              onError: (error:AxiosError) => {
                  alert(error.response?.data || 'updateUserProfile 실패');
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
          if(birthdayValue.touched){
            formData.append('birthday',birthdayValue.value);
            }
          updateUserProfile(formData)
          }



          const sendValidateValue = (type:string,validateResult:typeVaildation,inputValue:string) =>{
            const valueValidate = { ...validateResult, value: inputValue };
            console.log(type)
            if(type === 'Username'){
                setNickNameValue(valueValidate)
            }
            else if(type === 'Description'){

              setDescriptionValue(valueValidate)
            }
            else if(type === 'Location'){
  
            setLocationValue(valueValidate)
          }
          else if(type === 'Birthday'){

            setBirthdayValue(valueValidate)
          }

        }

//         const returnDefaultProfileImg = (value:string)=>{
//           const num = parseInt(value.replace("default_", ""), 10); 
//           switch (num) {
//             case 1:
//                 return "text-blue-500";
//                 break;
//             case 2:
//                 return "text-customGray";
//                 break;
//             case 3:
//                 return "text-hovercustomBlack";
//                 break;
//             case 4:
//               return "text-customBlue";
//                 break;
//             default:
//                return "text-customBlue";
//             }
//     }


//     const returnDefaultBackgroundColor = (value:string)=>{
//       const num = parseInt(value.replace("bg_default_", ""), 10); 
//       switch (num) {
//           case 1:
//               return "bg-blue-500";
//               break;
//           case 2:
//             return "bg-customGray";
//               break;
//           case 3:
//             return "bg-hovercustomBlack";
//               break;
//           case 4:
//             return "bg-customBlue";
//               break;
//           default:
//             return "bg-customBlue";
//           }
// }


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
        backgroundImageType.previewImage?.startsWith("bg_default_")?
        <div className={`w-full h-full ${returnDefaultBackgroundColor(backgroundImageType.previewImage)}`}></div>
        : 
        <div className={`w-full h-full bg-emerald-500`}/>
        // <img className="w-full h-full object-cover hover:opacity-85 transition-opacity duration-300" src={backgroundImageType.previewImage} />
      }
        </label>
    </div>
  
    <div className="w-[92%] flex mx-auto flex-col">
  
      <div className="w-full h-[5rem] flex justify-between">
  
        <div className="w-[9rem] h-[9rem] relative -top-[4.5rem] flex items-center justify-center overflow-hidden border-4 border-white bg-white rounded-full">
        <input className='hidden' id='profileFile'  type="file" name="myFile" onChange={handleProfileChange}/>
        <label className='flex justify-center items-center w-full h-full' htmlFor='profileFile' >
      <div className='cursor-pointer z-30 absolute bg-customGray opacity-65 rounded-full w-11 h-11 flex justify-center items-center' >
      <LuCamera/>
      </div>
          {
          profileImageType.previewImage?.startsWith("default_")
            ?  <FaUserCircle
            className={`w-full h-full object-cover hover:opacity-85 transition-opacity duration-300 ${returnDefaultProfileImg(profileImageType.previewImage)}`}
          />
            : <img className="w-full h-full object-cover hover:opacity-85 transition-opacity duration-300 " src={profileImageType.previewImage} />
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
      <Button width={'120px'} padding='10px' background_color={'b-gary'} disabled={true}>Submit</Button>
      :
      <Button isLoading={isLoading} width='120px' padding='10px'>Submit</Button>
    }
    </form>
);
}

export default EditProfile;