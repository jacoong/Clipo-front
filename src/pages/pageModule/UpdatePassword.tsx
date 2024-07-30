
import {useContext,useEffect,useState} from 'react';
import MobileLogin from '../../compoents/MobileLogin';


function UpdatePassword() {

  const [loginValue,setLoginValue] = useState<string>('login')

      const handleSubmit = (value:string) =>{
            setLoginValue(value)
        }

    return(

                <section className="flex flex-col items-center justify-center w-96 bg-white p-10 rounded-md shadow-none">
                <div className="py-5 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">비밀번호 변경 페이지입니다.</h1> 
                </div>
                <div className="bg-white py-5 px-10 rounded-md shadow-none w-96">
                  <MobileLogin changeToRegister={handleSubmit} requestType={'updatePassword'} />
                </div>
              </section>
    )
    }
    
export default UpdatePassword;