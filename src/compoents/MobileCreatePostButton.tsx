import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import useModal from '../customHook/useModal';
import { useTheme } from '../customHook/useTheme';

interface MobileCreatePostButtonProps {
  isDark?: boolean;
}

const MobileCreatePostButton = ({ isDark: isDarkProp }: MobileCreatePostButtonProps) => {
  const { isDark } = useTheme();
  const theme = isDarkProp ?? isDark;
  const { openModal } = useModal();
  const loginUserInfo = useSelector((state: RootState) => state.loginUserInfo);

  const baseStyle = 'text-white cursor-pointer duration-300 hover:scale-105 transition-all rounded-lg px-4 py-3 flex items-center justify-center';
  const themeStyle = theme
    ? 'bg-customborderLightGray hover:bg-themeColor'
    : 'bg-customborderDarkGray hover:bg-themeColor';

  const openPost = () => {
    const postInfoForm = {
      email: loginUserInfo?.email,
      nickName: loginUserInfo?.nickName,
      profilePicture: loginUserInfo?.profilePicture,
    };
    openModal({
      type: 'createPost',
      props: {
        isConfirmClosed: true,
        isModalLayer: true,
        isForce: false,
        isDark: theme,
        value: { postInfo: postInfoForm, mode: 'create' },
        modal: {
          isCenterMessage: '새로운 스레드',
          width: 'w-116',
          height: 'h-64',
          navButtonOption: { isClose: true },
        },
      },
    });
  };

  return (
    <div className={`${themeStyle} ${baseStyle}`} onClick={openPost}>
      <FaPlus className='text-xl' />
    </div>
  );
};

export default MobileCreatePostButton;
