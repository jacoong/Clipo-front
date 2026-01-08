import React from 'react';
import { COLOR } from '../store/ThemeColor';

const Loading = () => {

    return(
    <div className="w-full flex justify-center">
      <span
        className="w-6 h-6 border-2 border-b-transparent rounded-full inline-block box-border animate-spin"
        style={{ borderColor: COLOR.themeColor, borderBottomColor: 'transparent' }}
      ></span>
    </div>
    )
};

export default Loading;
