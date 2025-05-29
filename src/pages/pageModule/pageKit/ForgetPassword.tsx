
import {useContext,useEffect,useState} from 'react';
import LoginForm from '../../../compoents/LoginForm';

function SmsAuthentication() {


  const [loginValue,setLoginValue] = useState<string>('login')


        const changeToRegister = (value:string) =>{
            // setLoginValue(value)
            return
        }

    return(
        <section className="flex flex-col items-center justify-center w-96 bg-white p-10 rounded-md shadow-none">
        <div className="py-5 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">등록한 전화번호를 입력해 주세요</h1>
        </div>
        <div className="bg-white py-5 px-10 rounded-md shadow-none w-96">
          <LoginForm changeToRegister={changeToRegister} requestType={'forgetPassword'} />
        </div>
      </section>
    )
    }
    
export default SmsAuthentication;