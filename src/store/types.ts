

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