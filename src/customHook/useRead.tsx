import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import Services from '../store/ApiService';

const { SocialService } = Services;

export function useReadNnoMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, number>(
    (nno) => SocialService.isReadNno(nno),
    {
      onMutate: async (nno) => {
        await queryClient.cancelQueries('isReadNumber');

        const previous = queryClient.getQueryData<{ body: number }>('isReadNumber');

        // 낙관적 업데이트: unread count -1
        if (previous) {
          queryClient.setQueryData('isReadNumber', {
            ...previous,
            body: Math.max(previous.body - 1, 0), // 음수 방지
          });
        }

        return { previous };
      },

    //   onError: (error, nno, context) => {
    //     if (context?.previous) {
    //       queryClient.setQueryData('isReadNumber', context.previous); // 롤백
    //     }
    //   },

      onSettled: () => {
        queryClient.invalidateQueries('isReadNumber'); // 실제 값으로 동기화
      },
    }
  );
}

