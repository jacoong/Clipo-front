import axios from "axios";
import { PhoneNumberUtil } from 'google-libphonenumber';

interface typeofIsExistInDb  {
  input:string|number;
  type:string
}

export interface typeOfValidator {
  touched:boolean;
  error:boolean;
  message:string;
}

export const emailValidator = async(email:string,type?:string) => {
    if (!email) {
      return {touched:false,error:false,message:""};
    } 
    else if (!new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/).test(email)) {
      return {touched:true,error:true,message:"Incorrect email format"};
      
    }
    
    if(type){
      const isExisting = await isExistInDb({input:email,type:'email'})
      if(isExisting){
        return {touched:true,error:true,message:"Already existing Email"};
      }
    }


    return {touched:true,error:false,message:"Success!"};
  };


  export const emailCheckCodelValidator =(email:string) => {
    if (!email) {
   
      return {touched:false,error:false,message:""};
    } 
    else if (!new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/).test(email)) {
   
      return {touched:true,error:true,message:"Incorrect email format"};
      
    }
    return {touched:true,error:false,message:"Success!"};
  };


  export const isExistInDb = async(data:typeofIsExistInDb) => {
    const url = 'https://firstdatebhyunwu-3f2a47c92258.herokuapp.com/checkDb'
    return axios.post(url,data,{ withCredentials: true })
    .then(res =>{
      if(res.status === 200 && res){
       return  res.data.result
      }else{
      }

    })
    .catch(e=>{
        throw e
    })
  }
  
  export const prepasswordValidator = (prepassword:string) => {
    if (!prepassword) {
      return {touched:false,error:false,message:""};
    } else if (prepassword.length < 8) {
      return {touched:true,error:true,message:"Password must have a minimum 8 characters!!"};
    }
    return {touched:true,error:false,message:"Success"};
  };

  export const newPasswordValidator = (newPassword:string,prepassword:string) => {
    if (!prepassword) {
      return {touched:false,error:false,message:""};
    } else if (prepassword.length < 8) {
      return {touched:true,error:true,message:"Password must have a minimum 8 characters!!"};
    }
    else if (newPassword === prepassword) {
      return {touched:true,error:true,message:"New Password should't be same as old password"};
    }
    return {touched:true,error:false,message:"Success"};
  };

  export const passwordValidator = (password:string) => {
    if (!password) {
      return {touched:false,error:false,message:""};
    } else if (password.length < 8) {
      return {touched:true,error:true,message:"Password must have a minimum 8 characters"};
    }
    return {touched:true,error:false,message:"Success"};
  };
  
  export const confirmPasswordValidator = (password:string,confirmPassword:string) => {
    if (!confirmPassword) {
      return {touched:false,error:false,message:""};
    } 
    else if (confirmPassword !== password) {
      return {touched:true,error:true,message:"Passwords do not match"};
    }
    return {touched:true,error:false,message:"Success"};
  };


  export const userNameValidator = async(username:string) => {
    if (!username) {
      return {touched:false,error:false,message:""};
    } 
    else if (username.length < 2) {
      return {touched:true,error:true,message:"uesrname must have a minimum 8 characters"};
    }
    else if (!/^[a-zA-Z]+$/.test(username)) {
      return {touched: true,error: true,message: "Username must contain only English letters",
      };
    }

    // const isExisting = await isExistInDb({input:username,type:'username'})
    // if(isExisting){
    //   return {touched:true,error:true,message:"Already existing Username"};
    // }
    return {touched:true,error:false,message:"Success"};
  };

  export const encodedCheckCodeValidator = (encodedCheckCode:string) => {
    const digitRegex = /^\d+$/; // 숫자로만 이루어진 문자열을 확인하는 정규표현식
    
    if (!encodedCheckCode) {
      return {touched:false,error:false,message:""};
    } 
    else if (!digitRegex.test(encodedCheckCode)) { // 숫자로만 이루어진지 검사
      return { touched: true, error: true, message: "Only Number are allowed!" };
    }
    else if (encodedCheckCode.length < 4 || encodedCheckCode.length > 4) {
      return {touched:true,error:true,message:"Password must have a 4 digit!!"};
    }
    return {touched:true,error:false,message:"Success"};
  };

  export const categoryValidator = (category: string) => {
    const koreanRegex = /^[가-힣]+$/;
    const englishRegex = /^[a-zA-Z]+$/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const spaceRegex = /\s/;
  

    if (!category) {
      return { touched: false, error: false, message: "" };
    } else if (specialCharRegex.test(category)) {
      return { touched: true, error: true, message: "Special characters are not allowed" };
    } else if (spaceRegex.test(category)) {
      return { touched: true, error: true, message: "Spaces are not allowed" };
    } else if (koreanRegex.test(category) && category.length > 8) {
      return { touched: true, error: true, message: "Category name must have a maximum of 8 Korean characters" };
    } else if (englishRegex.test(category) && category.length > 16) {
      return { touched: true, error: true, message: "Category name must have a maximum of 16 English characters" };
    } else if (!koreanRegex.test(category) && !englishRegex.test(category)) {
      return { touched: true, error: true, message: "Category name must contain only Korean or English letters" };
    }
  
    return { touched: true, error: false, message: "Success" };
  };


const phoneUtil = PhoneNumberUtil.getInstance();


export const isPhoneValid = (phone: string) => {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phone);
    if (phoneUtil.isValidNumber(parsedNumber)) {
      return { touched: true, error: false, message: "The phone number is valid." };
    } else {
      return { touched: true, error: true, message: "The phone number is not valid." };
    }
  } catch (error) {
    return { touched: true, error: true, message: "An error occurred while parsing the phone number." };
  }
};


export const descriptionValidator = (description: string|null) => {
  return { touched: true, error: false, message: "Success" };
};


export const locationValidator = (location: string|null) => {
  return { touched: true, error: false, message: "Success" };
};


export const birthdayValidator = (location: string|null) => {
  return { touched: true, error: false, message: "Success" };
};
