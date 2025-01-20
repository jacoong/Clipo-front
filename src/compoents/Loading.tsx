import React from 'react';

const Loading = () => {

    return(
    <div className="w-full flex justify-center">
      <span className={`w-8 h-8 border-4 border-customBlue border-b-transparent rounded-full inline-block box-border animate-spin`}></span>
    </div>
    )
};

export default Loading;