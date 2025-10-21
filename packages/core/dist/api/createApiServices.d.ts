import type { AxiosInstance } from 'axios';
import { LoginType, SMS, SMSValidate, socialLogin, userPosts, fetchFollowType, fetchLikedUser } from '../types';
export interface ApiDependencies {
    instance: AxiosInstance;
    formInstance: AxiosInstance;
    request: AxiosInstance;
}
export declare function createApiServices({ instance, formInstance, request }: ApiDependencies): {
    AuthService: {
        new (): {};
        wakeUp(): Promise<any>;
        LoginNeo(account: any): Promise<any>;
        login(userData: LoginType): Promise<any>;
        signUp(userData: LoginType): Promise<any>;
        smsRequest(userData: SMS): Promise<any>;
        forgetPassword(userData: any): Promise<any>;
        smsVerificate(userData: SMSValidate): Promise<any>;
        updatePassword(userData: {
            newPassword: string;
            oldPassword: string;
        }): Promise<any>;
        socialLogin(userData: socialLogin): Promise<any>;
    };
    UserService: {
        new (): {};
        getUserProfile(): Promise<any>;
        createNicknameProfileImg(userData: FormData): Promise<any>;
        userEditProfile(userData: FormData): Promise<any>;
    };
    SocialService: {
        new (): {};
        fetchPosts(pageIndex: number): Promise<any>;
        fetchUserPosts(value: userPosts): Promise<any>;
        fetchedUserInfo(username: string): Promise<any>;
        createBoard(postData: FormData): Promise<any>;
        createReplyOrNestRe(postData: FormData): Promise<any>;
        folowUserAccount(userName: string): Promise<any>;
        unFolowUserAccount(userName: string): Promise<any>;
        boardlikeContents(idValue: number): Promise<any>;
        fetchFollowPost(pageIndex: number): Promise<any>;
        boardunlikeContents(idValue: number): Promise<any>;
        replylikeContents(idValue: number): Promise<any>;
        replyunlikeContents(idValue: number): Promise<any>;
        fetchedBoard(bno: string): Promise<any>;
        fetchedReplyDetail(rno: number): Promise<any>;
        fetchedReply(bno: number, pageIndex: number): Promise<any>;
        fetchedNestRe(rno: number, pageIndex: number): Promise<any>;
        fetchedFollowingFollower(value: fetchFollowType, page: number): Promise<any>;
        searchUserAccount(search: string, page: number): Promise<any>;
        searchHashTag(search: string, page: number): Promise<any>;
        deleteBoardRequest(bno: string): Promise<any>;
        deleteCommentRequest(rno: string): Promise<any>;
        modificateBoard(boardData: FormData): Promise<any>;
        modificateComment(commentData: FormData): Promise<any>;
        likedUserFetch(value: fetchLikedUser, pages: number): Promise<any>;
        fetchPostWithTags(value: string, pages: number): Promise<any>;
        isReadNno(nno: number): Promise<any>;
        isReadInitial(): Promise<any>;
        fetchActivity(pages: number): Promise<any>;
        fetchReplyPageNumber(bno: number, rno: number): Promise<any>;
        fetchNestRePageNumber(parentId: number, targetId: number): Promise<any>;
        bookmarkUserFetch(pages: number): Promise<any>;
        bookmarkAdd(bno: string): Promise<any>;
        bookmarkDelete(bno: string): Promise<any>;
    };
};
