import type { ReactNode } from 'react';
export interface typeCheckBox {
    label: string;
    value: string;
}
export interface Category {
    categoryId: number;
    categoryColor: string;
    categoryName: string;
    isHover?: boolean;
    isChecked?: boolean;
}
export interface LoginType {
    email: string;
    password: string;
}
export interface SMS {
    phone: string;
}
export interface SMSValidate {
    validateSMSCode: string;
    email: string;
    phone: string;
}
export interface socialLogin {
    code: string;
    typeOfPlatform: string;
}
export interface LogInServerResponse {
    status: number;
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
    setTheme: (value: 'white' | 'dark' | 'auto') => void;
}
export interface typeVaildation {
    touched: boolean;
    error: boolean;
    message: string;
    value: string;
}
export interface NavButtonOption {
    isClose?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
}
export interface ModalOptions {
    width?: string;
    isDark?: boolean;
    height?: string;
    isCenterMessage?: string;
    navButtonOption?: NavButtonOption;
    isFull?: boolean;
    children?: ReactNode;
    isConfirmClosed?: boolean;
}
export interface ModalInitial {
    isConfirmClosed?: boolean;
    isForce?: boolean;
    isTransParentBackground?: boolean;
    isDark?: boolean;
    isModalLayer?: boolean;
    potalSpot?: any;
    modal?: ModalOptions;
    value?: any;
    [key: string]: any;
}
export interface ModalState {
    type: string | null;
    props: ModalInitial;
}
export type ModalStates = ModalState[];
export interface UserInfo {
    email?: string;
    nickName: string;
    profilePicture: string;
    isFollowing?: boolean;
    username?: string;
}
export interface simpleUserInfo {
    message: string;
    body: UserInfo;
}
export interface usernameProfile {
    username: string;
    files: File[];
}
export interface fetchedUserInfo {
    email: string;
    nickName: string;
    profilePicture: string;
    backgroundPicture: null;
    location: null;
    description: null;
    followingNumber: number;
    followerNumber: number;
    brithDay: string | null;
    isFollowing: boolean;
}
export type pageIndex = number;
export interface userPost {
    typeOfPost: 'board' | 'reply' | 'nestRe';
    parentRno?: number;
    bno?: number;
    rno?: number;
    boardImages?: string[];
    commentImage?: string;
    nickName: string;
    profilePicture: string;
    numberOfLike: number;
    numberOfComments: number;
    contents: string;
    tags: string[];
    mentions: string[];
    regData: string;
    isLike: boolean;
    isFollowing: boolean;
    isLikeVisible: boolean;
    isReplyAllowed: boolean;
    isBookmarked?: boolean;
    isBookmark?: boolean;
    isBookMarked?: boolean;
}
export type typeOfFilter = 'Post' | 'Replies' | 'Likes';
export interface userPosts {
    username?: string | null;
    typeOfFilter: typeOfFilter;
    pages: number;
}
export interface fetchFollowType {
    username: string | undefined;
    typeOfFilter: 'Following' | 'Follower';
}
export interface fetchLikedUser {
    username: string | undefined;
    bno: number | undefined;
}
export interface navInfoType {
    type: string;
    titleValue: string;
    subTitleValue?: string | null;
    value?: any | null;
}
export interface flashMessageValue {
    typeOfFlashMessage: 'success' | 'caution' | 'error' | 'brand';
    title: string;
    subTitle?: any;
}
export interface flashMessageType {
    flashMessageValue: flashMessageValue | null;
}
export type activityType = 'reply' | 'board' | 'like' | 'longtime' | 'reference' | 'follow' | 'mention';
export interface activityDetailType {
    from: string;
    nno: number;
    bno: number | null;
    rno: number | null;
    parentRe: number | null;
    type: activityType;
    userProfileImage: string;
    isFollowing: boolean;
    createdAt: string;
    boardOneImage: string | null;
    isRead: boolean;
}
export interface activityDetailTypeaa {
    from: string;
    nno: number;
    bno: number | null;
    rno: number | null;
    nestRe: number | null;
    type: activityType;
    userProfileImage: string;
    isFollowing: boolean;
    createdAt: string;
    boardOneImage: string | null;
    isRead: boolean;
}
export interface ConfirmPopupListValue {
    text: string;
    type: buttonType;
}
export type buttonType = 'delete' | 'confirm' | 'normal' | 'logout';
