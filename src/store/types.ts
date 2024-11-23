

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
    status:number
    message: string;
    body: {
      accessToken: string;
      refreshToken: string;
      validateTime: string;
    };
    [key: string]: any;
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
  
  export interface NavButtonOption {
    isClose: boolean;
    isEdit: boolean;
    isDelete: boolean;
  }
  
  export interface ModalOptions {
    isDark?:boolean;
    width?: string;
    height?: string;
    isCenterMessage?: string;
    navButtonOption?: NavButtonOption;
    isFull?:boolean;
    children?: React.ReactNode;
  }

  export interface ModalInitial {
    isPotal?: boolean;
    isForce?: boolean;
    modal?: ModalOptions;  // optional로 `modal`을 포함
    [key: string]: any;    // 추가 속성을 허용
  }

  export interface ModalState {
    type: string | null;
    props: ModalInitial; // props의 타입을 필요에 따라 정의
  }

  export type ModalStates = ModalState[]; // 여러 모달을 위한 배열 타입
  
  export interface UserInfo {
    email:string;
    nickName:string|null;
    profilePicture:string|null;
  }
  
  
  export interface simpleUserInfo {
    message:string;
    body:UserInfo;
  }

  export interface usernameProfile {
    username: string; // 사용자 이름
    files: File[]; // 선택된 파일들
}

export interface fetchedUserInfo {
  email:string;
  nickName:string|null;
  profilePicture:string|null;
  backgroundPicture: null,
  location: null,
  description: null,
  followingNumber: number,
  followerNumber: number,
  brithDay:string| null

}

export type pageIndex = number;

export interface userPost {
  bno:number,
  nickName: string; // 닉네임 (문자열)
  profilePicture: string | null; // 프로필 사진 URL (문자열 또는 null)
  numberOfLike: number; // 좋아요 수 (숫자)
  numberOfComments: number; // 댓글 수 (숫자)
  contents: string; // 게시물 내용 (문자열)
  tags: string[]; // 태그 리스트 (문자열 배열)
  regData: string; // 등록 날짜 (문자열)
}