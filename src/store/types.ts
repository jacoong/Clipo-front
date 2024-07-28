

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