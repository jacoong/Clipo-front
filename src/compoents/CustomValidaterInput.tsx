import {useEffect,useState} from 'react';
import style from '../compoents/compoentsCss/MobileLogin.module.css'
import { useFormInput } from '../customHook/useFormInput';

import { typeOfValidator,emailValidator,passwordValidator,newPasswordValidator,emailCheckCodelValidator,confirmPasswordValidator,encodedCheckCodeValidator,userNameValidator } from '../store/validator';
function CustomValidaterInput({type,sendValidateValue,passwordConfirm}:any) {

  const [validateResult,setValidateResult] = useState<typeOfValidator>({touched: false, error: false, message: ''})
    const formInput = useFormInput('');

    useEffect(()=>{
      handleValidator(type);
    },[formInput.value])



    const handleValidator = async(type:string) =>{
      if(type === 'email'){
        const result = await(emailValidator(formInput.value))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
      else if(type === 'password'){
        const result = (passwordValidator(formInput.value))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
      else if(type === 'confirmPassword'){
        const result = (confirmPasswordValidator(formInput.value,passwordConfirm))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
      else if(type === 'newPassword'){
        const result = (newPasswordValidator(formInput.value,passwordConfirm))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
      else if(type === 'encodedCheckCode'){
        const result = (encodedCheckCodeValidator(formInput.value))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
      else if(type === 'SMS Code'){
        const result = (encodedCheckCodeValidator(formInput.value))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
      else if(type === 'Email Code'){
        const result = (encodedCheckCodeValidator(formInput.value))
        sendValidateValue(type,result,formInput.value);
        setValidateResult(result)
      }
    }

    const transferCapitalLeter = (placeholer:string) => {
      return placeholer.charAt(0).toUpperCase() + type.slice(1);
    }

    const isShowedPassword = (type === 'password' || type === 'confirmPassword' || type === 'newPassword' ? true : false)

    return(
        <div className={`${style.userbox}
        ${validateResult.touched
          ? (validateResult.error ? style.error : style.success)
          : style.initial}`
        }
      >
        <input {... formInput} type={isShowedPassword ? 'password' :'text'} id={type} name="" required={true} />
        <label htmlFor={type}>{transferCapitalLeter(type)}</label>
        <div className={style.userbox__vaildateMsg}>
          <p>{validateResult.message}</p>
        </div>
      </div>
    )
}

export default CustomValidaterInput;