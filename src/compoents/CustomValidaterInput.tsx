import {useEffect,useState} from 'react';
import { COLOR } from '../store/ThemeColor';
import TextField from '@mui/material/TextField';
import { typeOfValidator,emailValidator,passwordValidator,newPasswordValidator,emailCheckCodelValidator,confirmPasswordValidator,encodedCheckCodeValidator,userNameValidator } from '../store/validator';
function CustomValidaterInput({type,sendValidateValue,passwordConfirm}:any) {

  const [validateResult,setValidateResult] = useState<typeOfValidator>({touched: false, error: false, message: ''})




    const handleValidator = async(event: React.ChangeEvent<HTMLInputElement>) =>{
      if(type === 'email'){
        const result = await(emailValidator(event.target.value))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'password'){
        const result = (passwordValidator(event.target.value))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'userName'){
        const result = await(userNameValidator(event.target.value))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'confirmPassword'){
        const result = (confirmPasswordValidator(event.target.value,passwordConfirm))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'newPassword'){
        const result = (newPasswordValidator(event.target.value,passwordConfirm))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'encodedCheckCode'){
        const result = (encodedCheckCodeValidator(event.target.value))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'SMS Code'){
        const result = (encodedCheckCodeValidator(event.target.value))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
      else if(type === 'Email Code'){
        const result = (encodedCheckCodeValidator(event.target.value))
        sendValidateValue(type,result,event.target.value);
        setValidateResult(result)
      }
    }

    const transferCapitalLeter = (placeholer:string) => {
      return placeholer.charAt(0).toUpperCase() + type.slice(1);
    }

    const isShowedPassword = (type === 'password' || type === 'confirmPassword' || type === 'newPassword' ? true : false)

    return(
      <div className='my-4'>
          <TextField
          error={validateResult.error ? true : false}
          fullWidth
          sx={
            {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: validateResult.touched
                ? validateResult.error
                  ? COLOR.customRed // Use COLOR.customRed for error
                  : COLOR.customBlue // Use COLOR.themeColor for no error
                : COLOR.customGray, // Use COLOR.hoverLightGray for default
              borderWidth: '2px', // 기본 테두리 두께 설
              },
              '&:hover fieldset': {
                borderColor: validateResult.touched
                ? validateResult.error
                  ? COLOR.customRed // Use COLOR.customRed for error
                  : COLOR.customBlue // Use COLOR.themeColor for no error
                : COLOR.customGray, // Use COLOR.hoverLightGray for default
              borderWidth: '2px', // 기본 테두리 두께 설
              },
              '&.Mui-focused fieldset': {
                borderColor: validateResult.touched
                ? validateResult.error
                  ? COLOR.customRed // Use COLOR.customRed for error
                  : COLOR.customBlue // Use COLOR.themeColor for no error
                : COLOR.customGray, // Use COLOR.hoverLightGray for default
              borderWidth: '2px', // 기본 테두리 두께 설// 포커스 시 테두리 두께 설정
              },
              '& input': {
                color: validateResult.touched
                ? validateResult.error
                  ? COLOR.customRed // Use COLOR.customRed for error
                  : COLOR.customBlue // Use COLOR.themeColor for no error
                : COLOR.customGray, //
              },
            },
            '& .MuiInputLabel-root': {
              color: validateResult.touched
              ? validateResult.error
                ? COLOR.customRed // Use COLOR.customRed for error
                : COLOR.customBlue // Use COLOR.themeColor for no error
              : COLOR.customGray, // 
              '&.Mui-focused': {
                color: validateResult.touched
                ? validateResult.error
                  ? COLOR.customRed // Use COLOR.customRed for error
                  : COLOR.customBlue // Use COLOR.themeColor for no error
                : COLOR.customGray, // Use COLOR.hoverLightGray for default
            },
            },
            '& .MuiFormHelperText-root': {
              color: validateResult.touched
      ? validateResult.error
        ? COLOR.customRed // Use COLOR.customRed for error
        : COLOR.customBlue // Use COLOR.themeColor for no error
      : COLOR.customGray, // Use C
            },
          }
        }
          id={`outlined-${type}`}
          label={transferCapitalLeter(type)}
          type={isShowedPassword?'password':'text'}
          onChange={(value: React.ChangeEvent<HTMLInputElement>)=>{handleValidator(value)}}
          helperText={validateResult.message?validateResult.message:' '}
        />
      </div>
    )
}

export default CustomValidaterInput;