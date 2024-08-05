import { instance, formInstance } from './axios_context';
import { LoginType, SMS, SMSValidate, socialLogin, usernameProfile } from './types';

class AuthService {
  static async login(userData: LoginType): Promise<any> {
    const response = await instance.post('api/auth/login', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async signUp(userData: LoginType): Promise<any> {
    const response = await instance.post('api/auth/signup', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async smsRequest(userData: SMS): Promise<any> {
    const response = await instance.post('api/auth/send/phone', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async forgetPassword(userData: any): Promise<any> {
    const response = await instance.post(`api/auth/recreatePassword/${userData}`, null, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async smsVerificate(userData: SMSValidate): Promise<any> {
    const response = await instance.post('api/auth/send/verification', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async updatePassword(userData: { newPassword: string; oldPassword: string }): Promise<any> {
    const response = await instance.post('api/update/password', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async socialLogin(userData: socialLogin): Promise<any> {
    const response = await instance.post('api/auth/socialLogin', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }
}

class UserService {
  static async getUserProfile(): Promise<any> {
    const response = await instance.get(`/api/get/user/information`, {
      headers: {
        'Content-Type':'application/json',
      },
    });
    return response.data;
  }

  static async createNicknameProfileImg(userData: FormData): Promise<any> {
    const response = await instance.post('/api/update/profileNickname', userData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response.data;
  }
}

export default { AuthService, UserService };
