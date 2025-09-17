import 'react-international-phone/style.css';
import { typeOfValidator,isPhoneValid } from '../store/validator';
import {useEffect,useState} from 'react';
import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChanges: (phone: typeOfValidator) => void;
  isDark?: boolean;
}
const PhoneInput: React.FC<MUIPhoneProps> = ({
  value,
  onChanges,
  isDark = false,
  ...restProps
}) => {




  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'kr',
      value,
      countries: defaultCountries,
      onChange: (data) => {
        sendPhoneNumber(data.phone);
      },
    });



    const [validateResult,setValidateResult] = useState<typeOfValidator>({touched: false, error: false, message: ''})


    const sendPhoneNumber = (value:string) => {
        const isPhoneValidate = isPhoneValid(value)
        const smsValidate = { ...isPhoneValidate, value: value };
        setValidateResult(smsValidate);
      }

      useEffect(()=>{
        onChanges(validateResult)
      },[validateResult])



  return (
    <div className="flex h-28">
        <TextField
      error={validateResult.error ? true: false}
      helperText={validateResult.error ? validateResult.message : ''}
      FormHelperTextProps={{
        sx: {
          color: validateResult.error ? '#A435F0' : 'inherit',
        },
      }}
      style ={{width:'100%', border:'1px inherit',color:'inherit'}} 
      autoFocus={true}
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      sx={{
        '& .MuiInputLabel-root': {
          color: '#A435F0',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#A435F0',
        },
        '& .MuiInputLabel-root.MuiFormLabel-filled': {
          color: '#A435F0',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: isDark ? '#A435F0' : '#A435F0',
          },
          '&:hover fieldset': {
            borderColor: isDark ? '#A435F0' : '#A435F0',
          },
          '&.Mui-focused fieldset': {
            borderColor: isDark ? '#A435F0' : '#A435F0',
          },
        },
        '& .MuiInputBase-input': {
          color: '#A435F0',
        },
        '& .MuiInputBase-input::placeholder': {
          color: '#A435F0',
          opacity: 0.7,
        },
      }}
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                  color: '#ffffff',
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => (
                <FlagImage iso2={value} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage
                      iso2={country.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Typography marginRight="8px" sx={{ color: '#A435F0' }}>{country.name}</Typography>
                    <Typography sx={{ color: '#A435F0' }}>+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
    </div>

  );
};


export default PhoneInput;