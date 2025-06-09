import React from 'react';

const Loading = () => {

    return(
    <div className="w-full flex justify-center">
      <span className={`w-6 h-6 border-2 border-customRealWhite border-b-transparent rounded-full inline-block box-border animate-spin`}></span>
    </div>
    )
};

export default Loading;