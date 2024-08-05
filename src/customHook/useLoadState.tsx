import { useQuery } from 'react-query';
import Services from '../store/ApiService';

const { UserService } = Services;

export const getUserProfile = () => {
  return useQuery('userProfile', () => UserService.getUserProfile());
};
