import { useQuery } from "react-query";
import Services from "../store/ApiService";
import { AxiosError } from "axios";

const { SocialService } = Services;

type Kind = 'reply' | 'nest';

type NormalizedParams = {
  parentId: number; // board id or parent reply id
  childId: number;  // reply id or nested reply id
  kind?: Kind;      // default 'reply'
};

export const usePageParams = (params?: NormalizedParams) => {
  const query = useQuery(
    params
      ? ['pageNumber', params.kind ?? 'reply', params.parentId, params.childId]
      : ['pageNumber', 'idle'],
    () => {
      if (!params) {
        console.log('yeah')
        return Promise.resolve({ pageNumber: 0 });
      }
      const kind: Kind = params.kind ?? 'reply';
      if (kind === 'reply') {
        return SocialService.fetchReplyPageNumber(params.parentId, params.childId);
      }
      return SocialService.fetchNestRePageNumber(params.parentId, params.childId);
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (data: any) => {
        // noop: selection handles normalization
      },
      onError: (error: AxiosError) => {
        console.error(
          'Error fetching page number:',
          (error.response as any)?.data || 'Failed to fetch page number'
        );
      },
      select: (res: any) => {
        const d = res?.data ?? res;
        if (typeof d === 'number') return d as number;
        if (d?.pageNumber != null) return d.pageNumber as number;
        if (d?.body?.pageNumber != null) return d.body.pageNumber as number;
        if (res?.pageNumber != null) return res.pageNumber as number;
        return 0;
      }
    }
  );

  return {
    pageNumber: (query.data as number | undefined) ?? 0,
    ...query,
  };
};