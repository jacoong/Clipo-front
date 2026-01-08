import React, {ReactNode,useState,useEffect} from 'react';
import { useMutation,useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import Services from '../../../store/ApiService'
import useModal from '../../../customHook/useModal';
import {typeVaildation} from '../../../store/types';
import { AxiosError } from 'axios';
import {useTheme} from '../../../customHook/useTheme';
import useMediaQuery from '../../../customHook/useMediaQuery';
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



interface EditProfileProps {
  value: any;
  isFullScreen?: boolean;
}



const EditProfile =({value,isFullScreen = false}:EditProfileProps) => {
  console.log(value)
  const {backgroundPicture,brithDay,description,email,followerNumber,followingNumber,location,nickName,profilePicture} = value.profileInfo;


      
      const { AuthService, UserService } = Services;
          const savedData:any = localStorage.getItem('userDataKey'); 
          const {closeModal,openModal} = useModal();
          const { isDark } = useTheme();
          const queryClient = useQueryClient();
          const isMobile = useMediaQuery('(max-width: 767px)');
          const navigate = useNavigate();

          const [editProfileValue,setEditProfileValue] = useState<{
            profileImage: profileImageType;
            backgroundImage: profileImageType;
            nickName: typeVaildation;
            description: typeVaildation;
            location: typeVaildation;
            birthday: typeVaildation;
          }>({
            profileImage: {previewImage:undefined,imageFile:undefined},
            backgroundImage: {previewImage:undefined,imageFile:undefined},
            nickName: {touched: false, error: false, message: '',value:''},
            description: {touched: false, error: false, message: '',value:''},
            location: {touched: false, error: false, message: '',value:''},
            birthday: {touched: false, error: false, message: '',value:''},
          });

          const valueOfUsername =
            editProfileValue.nickName.touched === false && editProfileValue.nickName.value === ''
              ? nickName
              : editProfileValue.nickName.value;
useEffect(()=>{
  if(value){
    setEditProfileValue((prev) => ({
      ...prev,
      profileImage: {previewImage:profilePicture,imageFile:undefined},
      backgroundImage: {previewImage:backgroundPicture,imageFile:undefined},
    }))
  }
},[value])





          const handleProfileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
            if(event.target.files){
              const profileImg = event.target.files[0];
              console.log(profileImg,'profile')
              setEditProfileValue((prev) => ({
                ...prev,
                profileImage: {previewImage:URL.createObjectURL(profileImg),imageFile:profileImg},
              }))

              
            }
          };
          
          const handleBackgroundChange = (event:React.ChangeEvent<HTMLInputElement>) => {
            if(event.target.files){
              const profileImg = event.target.files[0];
              console.log(profileImg,'background')
              setEditProfileValue((prev) => ({
                ...prev,
                backgroundImage: {previewImage:URL.createObjectURL(profileImg),imageFile:profileImg},
              }))
            }
          };
      
        
          const {
            mutate:updateUserProfile,
            isLoading, 
            isSuccess,
            isError,
          } = useMutation<void, AxiosError<{ message: string }>,FormData>(UserService.userEditProfile, {
              onMutate:() =>{
              },
              onSuccess: () => {

                  console.log('updateUserProfile 성공');
                    // queryClient.invalidateQueries(['profileInfo',nickName]);
                  closeModal();
                  openModal({ type:'confirmRefresh', props: { value:{nickName:valueOfUsername},isPotal:false,isForce:true,modal:{width:'w-80',navButtonOption:{isClose:true}}} });
                  // navigate(`/main/@/${editProfileValue.nickName.value}`)
              },
              onError: (error:AxiosError) => {
                  alert(error.response?.data || 'updateUserProfile 실패');
              }
              });
              // const userId = todoCtx.userInfo._id;
          
          const submitProfileInfo =async(e:React.FormEvent<HTMLFormElement>)=> {
            e.preventDefault();
            

     
  
          const formData = new FormData();
      
          if(editProfileValue.profileImage.imageFile){
          formData.append(`profileImage`, editProfileValue.profileImage.imageFile); // 'files'는 서버에서 받을 필드 이름
          }
          if(editProfileValue.backgroundImage.imageFile){
          formData.append(`backgroundImage`, editProfileValue.backgroundImage.imageFile); // 'files'는 서버에서 받을 필드 이름
          }
          if(editProfileValue.nickName.touched){
          formData.append('nickName',editProfileValue.nickName.value);
          }
          if(editProfileValue.description.touched){
          formData.append('description',editProfileValue.description.value);
          }
          if(editProfileValue.location.touched){
          formData.append('location',editProfileValue.location.value);
          }
          if(editProfileValue.birthday.touched){
            formData.append('birthday',editProfileValue.birthday.value);
            }
          updateUserProfile(formData)
          }



          const sendValidateValue = (type:string,validateResult:typeVaildation,inputValue:string) =>{
            const valueValidate = { ...validateResult, value: inputValue };
            console.log(type)
            switch (type) {
              case 'Username':
                setEditProfileValue((prev) => ({ ...prev, nickName: valueValidate }));
                break;
              case 'Description':
                setEditProfileValue((prev) => ({ ...prev, description: valueValidate }));
                break;
              case 'Location':
                setEditProfileValue((prev) => ({ ...prev, location: valueValidate }));
                break;
              case 'Birthday':
                setEditProfileValue((prev) => ({ ...prev, birthday: valueValidate }));
                break;
              default:
                break;
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


const containerClass = `${isFullScreen ? 'w-full min-h-screen overflow-y-auto' : 'w-full h-auto overflow-auto'} flex flex-col`;

return(
    <form className={containerClass} onSubmit={submitProfileInfo}>
    {/* <StateTitle isAuthenticated={userInfo.userData.isAuthenticated} state={userInfo?.userData.username!} isBack={true}></StateTitle> */}
    
    <div className={`w-full ${isFullScreen?'h-[15rem]':'h-[10rem]'} flex-shrink-0 bg-customGray`}>
    <input className='hidden' id='backgroundFile'  type="file" name="myFile" onChange={handleBackgroundChange}/>
    <label className='flex justify-center items-center w-full h-full' htmlFor='backgroundFile' >
      <div className='cursor-pointer z-30 absolute bg-customGray opacity-65 rounded-full w-11 h-11 flex justify-center items-center' >
      <LuCamera className='opacity-100'/>
      </div>

      {
        editProfileValue.backgroundImage.previewImage?.startsWith("bg_default_")?
        <div className={`w-full h-full ${returnDefaultBackgroundColor(editProfileValue.backgroundImage.previewImage)}`}></div>
        : 
        // <div className={`w-full h-full bg-emerald-500`}/>
        <img className="w-full h-full object-cover hover:opacity-85 transition-opacity duration-300" src={editProfileValue.backgroundImage.previewImage} />
      }
        </label>
    </div>

    <div className="p-4 flex  flex-col flex-1">

      <div className={`w-full flex justify-between ${isFullScreen?'h-[3rem]':'h-[3rem]'} `}>

        <div className={`w-[7.5rem] h-[7.5rem] relative flex items-center justify-center overflow-hidden border-4 border-white bg-white rounded-full ${isMobile ? '-top-[4.5rem]' : '-top-[5.5rem]'}`}>
        <input className='hidden' id='profileFile'  type="file" name="myFile" onChange={handleProfileChange}/>
        <label className='flex justify-center items-center w-full h-full' htmlFor='profileFile' >
      <div className='cursor-pointer z-30 absolute bg-customGray opacity-65 rounded-full w-11 h-11 flex justify-center items-center' >
      <LuCamera/>
      </div>
          {
          editProfileValue.profileImage.previewImage?.startsWith("default_")
            ?  <FaUserCircle
            className={`w-full h-full object-cover hover:opacity-85 transition-opacity duration-300 ${returnDefaultProfileImg(editProfileValue.profileImage.previewImage)}`}
          />
            : <img className="w-full h-full object-cover hover:opacity-85 transition-opacity duration-300 " src={editProfileValue.profileImage.previewImage} />
        }
          </label>
        </div>
  
  
      </div>
  
      <div className="w-relative flex flex-col flex-1" >
      <CustomValidaterInput initialValue={nickName} sendValidateValue={sendValidateValue} type={'Username'} disabled={true}></CustomValidaterInput>
      <CustomValidaterInput initialValue={description} sendValidateValue={sendValidateValue} type={'Description'}></CustomValidaterInput>
      <CustomValidaterInput initialValue={location} sendValidateValue={sendValidateValue} type={'Location'}></CustomValidaterInput>
      <CustomValidaterInput initialValue={brithDay} sendValidateValue={sendValidateValue} type={'Birthday'}></CustomValidaterInput>
      <div className='my-auto flex justify-end'>
    {
      !editProfileValue.backgroundImage.imageFile &&
      !editProfileValue.profileImage.imageFile &&
      !editProfileValue.nickName.touched &&
      !editProfileValue.description.touched &&
      !editProfileValue.location.touched &&
      !editProfileValue.birthday.touched ?
      <Button width={'120px'} padding='10px' background_color={'b-gary'} disabled={true}>Submit</Button>
      :
      <Button isLoading={isLoading} width='120px' padding='10px'>Submit</Button>
    }
    </div>
    </div>
    </div>
  
    </form>
);
}

export default EditProfile;
