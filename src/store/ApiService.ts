import { instance, formInstance,Axios } from './axios_context';
import { LoginType, SMS, SMSValidate, socialLogin, usernameProfile,pageIndex } from './types';
import AxiosMockAdapter from 'axios-mock-adapter';

const instanceMock = new AxiosMockAdapter(instance,{ delayResponse: 2000 });
const axiosMock = new AxiosMockAdapter(Axios,{ delayResponse: 1000 });
// axiosMock.onPost('api/auth/login').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//         body: {
//           accessToken: 'sefasefa',
//           refreshToken: 'sefasefa',
//           validateTime: '2024-11-15T12:00:00Z',
//         },
//     },
//   ];
// });

// // Mock response for the signup API
// axiosMock.onPost('api/auth/signup').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//       email: '327561@naver.com',
//       password: '12awdawdwa34',
//         message: 'Signup successful!',
//         body: {},
//     },
//   ];
// });

// axiosMock.onPost('api/auth/send/phone').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: 'SMS sending successful!',
//     },
//   ];
// });

// axiosMock.onPost('api/auth/send/verification').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: 'SMS verification successful!',
//     },
//   ];
// });

// axiosMock.onPost('api/auth/recreatePassword/+8201094711807').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "임시 비밀번호 발급",
//     body: null
//     },
//   ];
// });
  

// instanceMock.onGet('api/get/user/information').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "유저정보를 확인했습니다",
//     body: {
//     email:'327561@naver.com',
//     nickName:'nickN',
//     profilePicture:null,
//     // nickName:'hyunwu',
//     // profilePicture:'https://www.google.com/imgres?q=picture&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F036%2F324%2F708%2Fsmall_2x%2Fai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-photos%2Fpicture&docid=wska7sM6RxRdCM&tbnid=RwwbN3rxhf-iNM&vet=12ahUKEwip9sTPnN6JAxX5m68BHbvGNagQM3oECBUQAA..i&w=600&h=400&hcb=2&itg=1&ved=2ahUKEwip9sTPnN6JAxX5m68BHbvGNagQM3oECBUQAA',
// }
//     },
//   ];
// });


// instanceMock.onGet('api/board/randomBoard/0').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//   {
//     nickName: 'johnDoe',
//     profilePicture: 'https://example.com/profile1.jpg',
//     numberOfLike: 12,
//     numberOfComments: 5,
//     contents: 'Exploring the mountains!',
//     tags: ['hiking', 'adventure', 'travel'],
//     regData: '2024-11-15',
//   },
//   {
//     nickName: 'happySoul',
//     profilePicture: null,
//     numberOfLike: 20,
//     numberOfComments: 10,
//     contents: 'Enjoying coffee at the best cafe in town ☕',
//     tags: ['coffee', 'relax', 'morning'],
//     regData: '2024-11-14',
//   },
//   {
//     nickName: 'natureLover',
//     profilePicture: 'https://example.com/profile3.jpg',
//     numberOfLike: 50,
//     numberOfComments: 30,
//     contents: 'Nature is my therapy 🌿',
//     tags: ['nature', 'therapy', 'peace'],
//     regData: '2024-11-13',
//   },
//   {
//     nickName: 'chefMike',
//     profilePicture: null,
//     numberOfLike: 35,
//     numberOfComments: 12,
//     contents: 'My latest recipe: Creamy Mushroom Pasta 🍝',
//     tags: ['food', 'recipe', 'pasta'],
//     regData: '2024-11-12',
//   },
//   {
//     nickName: 'catLover123',
//     profilePicture: 'https://example.com/profile5.jpg',
//     numberOfLike: 100,
//     numberOfComments: 45,
//     contents: 'My cat Simba being adorable as always 😻',
//     tags: ['cat', 'cute', 'pet'],
//     regData: '2024-11-11',
//   },
//   {
//     nickName: 'travelerJo',
//     profilePicture: 'https://example.com/profile6.jpg',
//     numberOfLike: 78,
//     numberOfComments: 20,
//     contents: 'Throwback to my Bali vacation 🏝️',
//     tags: ['travel', 'bali', 'paradise'],
//     regData: '2024-11-10',
//   },
//   {
//     nickName: 'fitnessGuru',
//     profilePicture: null,
//     numberOfLike: 65,
//     numberOfComments: 18,
//     contents: 'Crushed my workout today 💪',
//     tags: ['fitness', 'gym', 'motivation'],
//     regData: '2024-11-09',
//   },
//     ]
//     },
//   ];
// });

// instanceMock.onGet('api/board/randomBoard/1').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         nickName: 'adventureAddict',
//         profilePicture: 'https://example.com/profile15.jpg',
//         numberOfLike: 45,
//         numberOfComments: 12,
//         contents: 'Ziplining through the forest canopy 🌲',
//         tags: ['adventure', 'zipline', 'forest'],
//         regData: '2024-11-01',
//       },
//       {
//         nickName: 'bakingQueen',
//         profilePicture: null,
//         numberOfLike: 60,
//         numberOfComments: 20,
//         contents: 'Freshly baked cookies for the family 🍪',
//         tags: ['baking', 'cookies', 'home'],
//         regData: '2024-10-31',
//       },
//       {
//         nickName: 'beachBum',
//         profilePicture: 'https://example.com/profile17.jpg',
//         numberOfLike: 85,
//         numberOfComments: 30,
//         contents: 'Beach vibes all day 🌊',
//         tags: ['beach', 'summer', 'relaxation'],
//         regData: '2024-10-30',
//       },
//       {
//         nickName: 'gamerPro',
//         profilePicture: 'https://example.com/profile18.jpg',
//         numberOfLike: 90,
//         numberOfComments: 35,
//         contents: 'Reached top rank in my favorite game 🎮',
//         tags: ['gaming', 'victory', 'pro'],
//         regData: '2024-10-29',
//       },
//       {
//         nickName: 'foodieJoy',
//         profilePicture: null,
//         numberOfLike: 47,
//         numberOfComments: 14,
//         contents: 'Discovered the best ramen spot 🍜',
//         tags: ['food', 'ramen', 'yummy'],
//         regData: '2024-10-28',
//       },
//       {
//         nickName: 'petParent',
//         profilePicture: 'https://example.com/profile20.jpg',
//         numberOfLike: 120,
//         numberOfComments: 50,
//         contents: 'My dog’s first birthday party 🎉',
//         tags: ['pets', 'dogs', 'celebration'],
//         regData: '2024-10-27',
//       },
//       {
//         nickName: 'wanderlustKing',
//         profilePicture: 'https://example.com/profile21.jpg',
//         numberOfLike: 67,
//         numberOfComments: 20,
//         contents: 'Exploring the hidden corners of the city 🏙️',
//         tags: ['wanderlust', 'city', 'exploration'],
//         regData: '2024-10-26',
//       },
//     ]
//     },
//   ];
// });
// instanceMock.onGet('api/board/randomBoard/2').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body: [
//       {
//         nickName: 'bookWorm',
//         profilePicture: 'https://example.com/profile8.jpg',
//         numberOfLike: 25,
//         numberOfComments: 7,
//         contents: 'Just finished reading "The Great Gatsby" 📚',
//         tags: ['books', 'reading', 'literature'],
//         regData: '2024-11-08',
//       },
//       {
//         nickName: 'photoArt',
//         profilePicture: 'https://example.com/profile9.jpg',
//         numberOfLike: 90,
//         numberOfComments: 32,
//         contents: 'Captured this beautiful sunset today 🌅',
//         tags: ['photography', 'sunset', 'art'],
//         regData: '2024-11-07',
//       },
//       {
//         nickName: 'techieTim',
//         profilePicture: null,
//         numberOfLike: 15,
//         numberOfComments: 5,
//         contents: 'Excited about the new AI advancements 🤖',
//         tags: ['tech', 'AI', 'future'],
//         regData: '2024-11-06',
//       },
//       {
//         nickName: 'cityExplorer',
//         profilePicture: 'https://example.com/profile11.jpg',
//         numberOfLike: 40,
//         numberOfComments: 15,
//         contents: 'Discovered a hidden gem in downtown 🌇',
//         tags: ['citylife', 'exploration', 'hidden'],
//         regData: '2024-11-05',
//       },
//       {
//         nickName: 'musicManiac',
//         profilePicture: 'https://example.com/profile12.jpg',
//         numberOfLike: 53,
//         numberOfComments: 19,
//         contents: 'Can’t stop listening to this new track 🎵',
//         tags: ['music', 'song', 'playlist'],
//         regData: '2024-11-04',
//       },
//       {
//         nickName: 'carEnthusiast',
//         profilePicture: null,
//         numberOfLike: 88,
//         numberOfComments: 25,
//         contents: 'Dream car goals 🚗',
//         tags: ['cars', 'luxury', 'speed'],
//         regData: '2024-11-03',
//       },
//       {
//         nickName: 'artistSoul',
//         profilePicture: 'https://example.com/profile14.jpg',
//         numberOfLike: 72,
//         numberOfComments: 28,
//         contents: 'Finished this painting after a week 🎨',
//         tags: ['art', 'painting', 'creative'],
//         regData: '2024-11-02',
//       },
//     ]
//   },
//   ]
//   });
//   instanceMock.onGet('api/board/randomBoard/3').reply((config) => {
//   console.log('config',config.data);
//   return [
//     200,
//     {
//     message: "메인페이지 조회 완료",
//     body:[
//       {
//         nickName: 'skyWatcher',
//         profilePicture: null,
//         numberOfLike: 32,
//         numberOfComments: 10,
//         contents: 'Caught a meteor shower last night 🌠',
//         tags: ['astronomy', 'sky', 'night'],
//         regData: '2024-10-25',
//       },
//       {
//         nickName: 'flowerFanatic',
//         profilePicture: 'https://example.com/profile23.jpg',
//         numberOfLike: 29,
//         numberOfComments: 9,
//         contents: 'My garden is blooming beautifully 🌷',
//         tags: ['garden', 'flowers', 'nature'],
//         regData: '2024-10-24',
//       },
//       {
//         nickName: 'urbanRunner',
//         profilePicture: 'https://example.com/profile24.jpg',
//         numberOfLike: 58,
//         numberOfComments: 18,
//         contents: 'Morning runs are the best 🏃‍♂️',
//         tags: ['running', 'health', 'city'],
//         regData: '2024-10-23',
//       },
//       {
//         nickName: 'kitchenKing',
//         profilePicture: 'https://example.com/profile25.jpg',
//         numberOfLike: 40,
//         numberOfComments: 12,
//         contents: 'Cooking is an art 🥘',
//         tags: ['cooking', 'recipe', 'kitchen'],
//         regData: '2024-10-22',
//       },
//   ]
// },
// ]
// });




class AuthService {
  static async login(userData: LoginType): Promise<any> {
    const response = await Axios.post('api/auth/login', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response;
  }

  static async signUp(userData: LoginType): Promise<any> {
    const response = await Axios.post('api/auth/signup', userData, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async smsRequest(userData: SMS): Promise<any> {
    const response = await Axios.post('api/auth/send/phone', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  static async forgetPassword(userData: any): Promise<any> {
    const response = await Axios.post(`api/auth/recreatePassword/${userData}`, null, {
      headers: {
        'Content-Type':  'application/json',
      },
    });
    return response.data;
  }

  static async smsVerificate(userData: SMSValidate): Promise<any> {
    const response = await Axios.post('api/auth/send/verification', userData, {
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

class SocialService {
  static async fetchPosts(pageIndex: pageIndex): Promise<any> {
    console.log(pageIndex);
    const response = await instance.get(`/api/board/randomBoard/${pageIndex}`, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      },
    });
    return response;
  }
}

export default { AuthService, UserService,SocialService };
