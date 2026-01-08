import { useMemo } from 'react';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService';
import useModal from '../../../customHook/useModal';
import ConfirmPopUp from '../ConfirmPopUp';
import { ConfirmPopupListValue } from '../../../store/types';
import { useFlashMessage } from '../../../customHook/useFlashMessage';

type AdditionalOptionType = 'disableShowNumberOfLike' | 'ableComment';

interface ConfirmAdditionalOptionModalProps {
  isDark: boolean;
  value: {
    optionType: AdditionalOptionType;
    boardInfo: {
      bno?: number;
      isLikeVisable?: boolean;
      isReplyAllowed?: boolean;
    };
  };
}

const { SocialService } = Services;

const ConfirmAdditionalOptionModal = ({ value, isDark }: ConfirmAdditionalOptionModalProps) => {
  const { closeModal } = useModal();
  const { showFlashMessage } = useFlashMessage();
  const { optionType, boardInfo } = value ?? {};

  const modificateBoard = useMutation<any, AxiosError<{ message: string }>, FormData>(
    SocialService.modificateBoard,
    {
      onMutate: () => {
        closeModal();
        showFlashMessage({ typeOfFlashMessage: 'brand', title: 'Processing', subTitle: '옵션 변경중...' });
      },
      onSuccess: () => {
        showFlashMessage({ typeOfFlashMessage: 'success', title: 'Success', subTitle: '옵션 변경 완료' });
        closeModal();
      },
      onError: () => {
        showFlashMessage({ typeOfFlashMessage: 'error', title: 'Error', subTitle: '옵션 변경 실패' });
        alert('modificateBoard 오류발생');
      },
    },
  );

  const copy = useMemo(() => {
    const isLikeVisible = Boolean(boardInfo?.isLikeVisable);
    const isReplyAllowed = Boolean(boardInfo?.isReplyAllowed);

    if (optionType === 'disableShowNumberOfLike') {
      return {
        title: isLikeVisible ? '좋아요 수 표시를 숨기시겠어요?' : '좋아요 수 표시를 다시 켤까요?',
        text: isLikeVisible
          ? '게시글의 좋아요 수가 숨겨집니다.'
          : '게시글의 좋아요 수가 다시 표시됩니다.',
        actionText: isLikeVisible ? '숨기기' : '표시하기',
      };
    }

    return {
      title: isReplyAllowed ? '댓글을 닫을까요?' : '댓글을 다시 열까요?',
      text: isReplyAllowed
        ? '이 게시글의 댓글 작성이 제한됩니다.'
        : '이 게시글에서 댓글을 다시 받을 수 있어요.',
      actionText: isReplyAllowed ? '닫기' : '열기',
    };
  }, [optionType, boardInfo?.isLikeVisable, boardInfo?.isReplyAllowed]);

  const handleSubmit = () => {
    const targetBno = boardInfo?.bno;
    if (!targetBno) {
      closeModal();
      return;
    }

    const formData = new FormData();
    if (optionType === 'disableShowNumberOfLike') {
      const isShowNumberOfLike = !boardInfo?.isLikeVisable;
      formData.append('isLikeVisible', String(isShowNumberOfLike));
    } else {
      const isAbleComment = !boardInfo?.isReplyAllowed;
      formData.append('isReplyAllowed', String(isAbleComment));
    }
    formData.append('bno', String(targetBno));
    modificateBoard.mutate(formData);
  };

  const handleListAction = (type: string) => {
    if (type === 'confirm') {
      handleSubmit();
    } else {
      closeModal();
    }
  };

  const ValueOfConfirmPopup: ConfirmPopupListValue[] = [
    { text: copy.actionText, type: 'confirm' },
    { text: '취소하기', type: 'normal' },
  ];

  return (
    <ConfirmPopUp
      anchorClick={handleListAction}
      isDark={isDark}
      list={ValueOfConfirmPopup}
      title={copy.title}
      text={copy.text}
    />
  );
};

export default ConfirmAdditionalOptionModal;
