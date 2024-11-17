import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef,useState,useContext } from 'react';
import Button from '../../Button';
import { FaUserCircle } from "react-icons/fa";
import CustomValidaterInput from '../../CustomValidaterInput';
import { typeVaildation,usernameProfile } from '../../../store/types';
import ModalLayer from '../ModalLayerType/ModalLayer';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../../store/modalSlice'
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService'
import useModal from '../../../customHook/useModal';
interface UsernameProps {
  handleUNsubmit?: (data: string) => void;
  isDark?:boolean;
}

const { AuthService, UserService } = Services;

function Username({ handleUNsubmit,isDark }: UsernameProps) {

    const savedData:any = localStorage.getItem('userDataKey'); 
    const modalState = useSelector(modalSelector);
    const {closeModal} = useModal();
  
    // props를 콘솔에 출력 (선택사항)
    console.log("Modal Props:", modalState);
    type FileReadResult = string | ArrayBuffer | null;

    const [usernameValidate,setUsernameValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
    const [previewImage, setPreviewImage] = useState<FileReadResult>(null);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);

    const validateUsername = (type:string,validateResult:typeVaildation,inputValue:string) =>{
        if(type === 'userName'){
            const userNameValidate = { ...validateResult, value: inputValue };
            setUsernameValidate(userNameValidate)
        }else{
            console.log('error')
            return
        }
    }

    const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      // 선택된 파일 처리 로직
      setImageFiles(event.target.files);
      const selectedFile = event.target.files?.[0];

      if (selectedFile) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          // 읽기가 완료되면 img의 src 속성에 data URL을 설정
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }

    }

  

    const createNicknameProfileImg = useMutation<void, AxiosError<{ message: string }>,FormData>(UserService.createNicknameProfileImg, {
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
      
    const username = usernameValidate.value; // 사용자 이름
    console.log(username,imageFiles)
    const formData = new FormData();

    // 파일을 FormData에 추가
    if (imageFiles && imageFiles.length > 0) {
        const filesArray = Array.from(imageFiles);
        filesArray.forEach((file:File,index) => {
            formData.append(`files`, file); // 'files'는 서버에서 받을 필드 이름
        });
    }

    // 사용자 이름을 FormData에 추가
    formData.append('username', username); // 'username'은 서버에서 받을 필드 이름

    for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
      createNicknameProfileImg.mutate(formData)
    }


    return(

          
            <div className='w-full my-3'>
              <form  onSubmit={(e) => submitProfileInfo(e)} encType='multipart/form-data'>
              {/* <form> */}
                <div  className='w-full h-auto flex flex-col items-center'>
                <input className='hidden' id='imageFile'  type="file" name="myFile" onChange={handleFileChange}/>
                  <div className='w-36 h-36'>
                    <label className='block w-full h-full cursor-pointer' htmlFor='imageFile' >
                      {previewImage ?
                        <img className='object-cover w-full h-full border-customGray rounded-full' src={String(previewImage)} alt='Selected'/>
                        :
                        <FaUserCircle className={`block w-full h-full transition duration-500 ${isDark? 'text-customgray':'text-customGray'} hover:text-customBlue`}></FaUserCircle>
                      } 
                    </label>
                  </div>
                </div>

                <CustomValidaterInput type='userName' sendValidateValue={validateUsername}></CustomValidaterInput>
    
          

                {usernameValidate.touched && !usernameValidate.error 
                ?
                <Button width={'large'}  color={'white'} type="submit">Send</Button>
                : 
                <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                } 

                {/* <FlashMessage handleOnclick={handleOnclick}/> */}
                {/* <Button width={'large'}type="submit">Send</Button>
                <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button> */}
              </form>
            </div>
    );
    }
    
export default Username;