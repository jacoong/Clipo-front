import { instance } from './axios_context';
import { LoginType, SMS, SMSValidate } from './types';

class UserService {
  static async login(userData: LoginType): Promise<any> {
    const response = await instance.post('api/auth/login', userData);
    return response.data;
  }

  static async signUp(userData: LoginType): Promise<any> {
    const response = await instance.post('api/auth/signup', userData);
    return response.data;
  }

  static async smsRequest(userData: SMS): Promise<any> {
    const response = await instance.post('api/auth/send/phone', userData);
    return response.data;
  }

  static async smsVerificate(userData: SMSValidate): Promise<any> {
    const response = await instance.post('api/auth/send/verification', userData);
    return response.data;
  }

  static async updatePassword(userData: { newPassword: string; oldPassword: string }): Promise<any> {
    const response = await instance.post('api/update/password', userData);
    return response.data;
  }
}

export default UserService;
