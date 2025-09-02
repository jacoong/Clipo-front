import { useQuery } from "react-query";
import Services from "../store/ApiService";
import { AxiosError } from "axios";

const { SocialService } = Services;

export const useBoardInfo = (bno?: string) => {
    return useQuery(
      ['fetchDetailBoardInfo', Number(bno)], // 쿼리 키: 고유한 식별자
      () => SocialService.fetchedBoard(bno!), // API 호출 함수
      {
        enabled: !!bno, // `bno`가 존재할 때만 실행
        onSuccess: (data) => {
          console.log('fetchedBoardInfo:', data);
        },
        onError: (error: AxiosError) => {
          console.error('Error fetching board info:', error.response?.data || 'Failed to fetch board info');
        },
      }
    );
  };