import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef,useState,useContext } from 'react';
import Button from '../../Button';
import { FaUserCircle } from "react-icons/fa";
import CustomValidaterInput from '../../CustomValidaterInput';
import { typeVaildation } from '../../../store/types';
import ModalLayer from '../ModalLayerType/ModalLayer';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../../store/modalSlice'

interface UsernameProps {
  handleUNsubmit?: (data: string) => void;
  isDark?:boolean;
}

function Username({ handleUNsubmit,isDark }: UsernameProps) {

    const fileRef = useRef<HTMLInputElement>(null);
    // const userInfo = todoCtx.userInfo

    const savedData:any = localStorage.getItem('userDataKey'); 


  
    const modalState = useSelector(modalSelector);
  
    // props를 콘솔에 출력 (선택사항)
    console.log("Modal Props:", modalState.props);

    type FileReadResult = string | ArrayBuffer | null;
    // type typeUserData = {
    //     username:string,
    //     id:string
    // }

    const [usernameValidate,setUsernameValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
    
    const [previewImage, setPreviewImage] = useState<FileReadResult>(null);

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

    // const handleUserName = async(e:React.FormEvent<HTMLFormElement>) =>{
    //     e.preventDefault();        

    //     let usernameRefValue = usernameRef.current!.value;
    //     const file = fileRef.current?.files?.[0];
    //     const formData = new FormData();
    //     const userId = JSON.parse(savedData);

    //     if (formData && file){
    //       formData.append('profileImg', file);
    //     }else{
    //       formData.append('profileImg', 'default');
    //     }
    //       formData.append('username', usernameRefValue);
    //       formData.append('id',userId)
        
    //       try{
    //         axiosPost(formData)
    //         usernameRefValue =  ""
    //         }
    //         catch{
    //           navigate('/')
    //         }
    //     }
        // const userId = todoCtx.userInfo._id;
    
    // const handleUsername =async(e:React.FormEvent<HTMLFormElement>)=> {
    //   e.preventDefault();

    //   const nickName = usernameRef.current!.value;

    //   instance.patch(`${todoCtx.serverUrl}/api/update/nickName`,
    //   {nickName:nickName},{ withCredentials: true })
    //   .then(res => {
    //     if(res.status===200){
    //       navigate('/');
    //     }
    //   })
    //   .catch(error => {
    //     console.log(`post response: test`, error);
    //   })
    // }

    // const axiosPost= async(data:any) =>{
    //     axios.post('https://firstdatebhyunwu-3f2a47c92258.herokuapp.com/user/register/usernameImg',data ,{ withCredentials: true })
    //       .then((res) => {
    //           if(res.status === 201){
    //               alert('need to use username!')
    //           }else if(res.status === 200){
    //             return handleUNsubmit!(res.data.result)
    //           }
    //       })
    //       .catch((err:Error) => {
    //         alert(err);
    //         navigate('/')
    //       });
    //   }

    return(

            <ModalLayer isDark={isDark} width={'w-100'} isCenterMessage={'프로파일을 완성하세요!'} isCloseButtonShow={false}>
            <div className='w-full my-3'>
              {/* <form  onSubmit={(e) => handleUserName(e)} encType='multipart/form-data'> */}
              <form>
                <div  className='w-full h-auto flex flex-col items-center'>
                <input className='hidden' id='imageFile' ref={fileRef} type="file" name="myFile" onChange={handleFileChange}/>
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
            </ModalLayer>
    );
    }
    
export default Username;