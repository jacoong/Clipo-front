

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

  