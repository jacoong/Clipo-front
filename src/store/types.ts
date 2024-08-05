

export interface typeCheckBox {
    label:string;
    value:string;
  }
  
  
  export interface Category {
    categoryId: number;
    categoryColor: string;
    categoryName: string;
    isHover?:boolean;
    isChecked?:boolean;
  }


  export interface LoginType {
    email:string;
    password:string;
  }

  export interface SMS {
    phone:string
  }

  export interface SMSValidate {
    validateSMSCode:string
    email:string
    phone:string
  }

  export interface socialLogin {
    code:string;
    typeOfPlatform:string;
  }


  export interface LogInServerResponse {
    message: string;
    body: {
      accessToken: string;
      refreshToken: string;
      validateTime: string;
    };
  }

  export interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
  }


  export  interface typeVaildation {
    touched: boolean,
    error: boolean, 
    message: string,
    value:string
  }
  

  export interface ModalInitial {
    isPotal?: boolean;
    isForce?: boolean;
    [key: string]: any; // 나머지 모든 속성에 대해 any 타입 허용
  }

  export interface simpleUserInfo {
    message:string;
    body:{
      email:string;
      nickName:string|null;
      profilePicture:string|null;
    }
  }