import {useEffect,useState} from 'react';
import { COLOR } from '../store/ThemeColor';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";

import { typeOfValidator,emailValidator,passwordValidator,newPasswordValidator,emailCheckCodelValidator,confirmPasswordValidator,encodedCheckCodeValidator,userNameValidator,descriptionValidator,locationValidator,birthdayValidator } from '../store/validator';
function CustomValidaterInput({initialValue,type,sendValidateValue,passwordConfirm}:any) {

  const [validateResult,setValidateResult] = useState<typeOfValidator>({touched: false, error: false, message: ''})
  const [showPassword, setShowPassword] = useState(false);
  const [initialVal, setInitialval] = useState<string|undefined>(undefined);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleValidator = async(event: React.ChangeEvent<HTMLInputElement>) =>{
      // if(initialVal){
      //   console.log('did it')
      //   setInitialval(undefined);
      // }
      const value = event.target.value
      if(type === 'email'){
        const result = await(emailValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
      }
      else if(type === 'password'){
        const result = (passwordValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'Username'){
        const result = await(userNameValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'confirmPassword'){
        const result = (confirmPasswordValidator(value,passwordConfirm))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'newPassword'){
        const result = (newPasswordValidator(value,passwordConfirm))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'encodedCheckCode'){
        const result = (encodedCheckCodeValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'SMS Code'){
        const result = (encodedCheckCodeValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'Email Code'){
        const result = (encodedCheckCodeValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'Description'){
        const result = (descriptionValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'Location'){
        const result = (locationValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
      else if(type === 'Birthday'){
        const result = (birthdayValidator(value))
        sendValidateValue(type,result,value);
        setValidateResult(result)
        setInitialval(value)
      }
    }
    const transferCapitalLeter = (placeholer:string) => {
      return placeholer.charAt(0).toUpperCase() + type.slice(1);
    }

    const isShowedPasswordOption = (type === 'confirmPassword' || type === 'password' ||type === 'newPassword' || type === 'SMS Code'? true : false);
    const isDescriptionOption = (type === 'Description'? true : false);


    useEffect(() => {
      if (initialValue) {
        setInitialval(initialValue)
      }
    }, [initialValue]);

    return(

        
      <div className='my-4'>
      <FormControl
      fullWidth
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: validateResult.touched
              ? validateResult.error
                ? COLOR.customRed // 에러 시 빨간색 테두리
                : COLOR.customBlue // 성공 시 파란색 테두리
              : COLOR.customGray, // 기본 상태에서는 회색 테두리
            borderWidth: '2px', // 테두리 두께
          },
          '&:hover fieldset': {
            borderColor: validateResult.touched
              ? validateResult.error
                ? COLOR.customRed // 에러 시 빨간색 테두리
                : COLOR.customBlue // 성공 시 파란색 테두리
              : COLOR.customGray, // 기본 상태에서는 회색 테두리
            borderWidth: '2px',
          },
          '&.Mui-focused fieldset': {
            borderColor: validateResult.touched
              ? validateResult.error
                ? COLOR.customRed // 에러 시 빨간색 테두리
                : COLOR.customBlue // 성공 시 파란색 테두리
              : COLOR.customGray, // 기본 상태에서는 회색 테두리
            borderWidth: '2px',
          },

          '& input, & textarea': { // 추가
      color: validateResult.touched
        ? validateResult.error
          ? COLOR.customRed
          : COLOR.customBlue
        : COLOR.customGray,
    },
        },
        '& .MuiInputLabel-root': {
          color: validateResult.touched
            ? validateResult.error
              ? COLOR.customRed // 에러 시 빨간 라벨
              : COLOR.customBlue // 성공 시 파란 라벨
            : COLOR.customGray, // 기본 상태에서는 회색 라벨
          '&.Mui-focused': {
            color: validateResult.touched
              ? validateResult.error
                ? COLOR.customRed // 에러 시 빨간 포커스 라벨
                : COLOR.customBlue // 성공 시 파란 포커스 라벨
              : COLOR.customGray, // 기본 상태에서는 회색 포커스 라벨
          },
        },
        '& .MuiFormHelperText-root': {
          color: validateResult.touched
            ? validateResult.error
              ? COLOR.customRed // 에러 시 빨간 도움말 텍스트
              : COLOR.customBlue // 성공 시 파란 도움말 텍스트
            : COLOR.customGray, // 기본 상태에서는 회색 도움말 텍스트
        },
      }}
      >
      <InputLabel 
      htmlFor="outlined-adornment-password">{transferCapitalLeter(type)}
      
      </InputLabel>
      <OutlinedInput
      value={initialVal}
      minRows={4}
      maxRows={4}
      multiline={isDescriptionOption}
      endAdornment={
        isShowedPasswordOption?
        <InputAdornment position="end">
          <IconButton
            aria-label={
              showPassword ? 'hide the password' : 'display the password'
            }
            onClick={handleClickShowPassword}
            edge="end"
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </IconButton>
        </InputAdornment>
        :null
      }
      


 
        error={validateResult.error ? true : false}
        onChange={(value: React.ChangeEvent<HTMLInputElement>)=>{handleValidator(value)}}
        id="outlined-adornment-password"
          type={isShowedPasswordOption ?showPassword ? 'text' : 'password' : 'text'} 
        label={transferCapitalLeter(type)}
      />
      <FormHelperText id="component-error-text">{validateResult.message?validateResult.message:''}</FormHelperText>
      </FormControl>
           {/* <TextField
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
          rows={isDescription?4:1}
          multiline // 추가
          label={transferCapitalLeter(type)}
          type={isShowedPasswordOption?'password':'text'}
          onChange={(value: React.ChangeEvent<HTMLInputElement>)=>{handleValidator(value)}}
          helperText={validateResult.message?validateResult.message:' '}
        /> */}
      </div>
    )
}

export default CustomValidaterInput;