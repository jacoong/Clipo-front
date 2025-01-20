import { useDispatch, useSelector } from "react-redux";
import { insertFlashMessage, clearFlashMessage as clearFlashMessageAction } from "../store/FlashMessageSlice";
import { flashMessageValue,flashMessageType } from "../store/types";
import { RootState } from "../store/index";

export const useFlashMessage = () => {
  const flashMessage = useSelector((state:RootState ) => state.flashMessageSlice);
  const dispatch = useDispatch();

  const showFlashMessage = (message: flashMessageValue) => {
    dispatch(insertFlashMessage(message));
  };

  const clearFlashMessage = () => {
    dispatch(clearFlashMessageAction());
  };

  return {
    flashMessage,
    showFlashMessage,
    clearFlashMessage
  };
};

