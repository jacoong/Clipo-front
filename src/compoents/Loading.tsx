import React, {ReactNode, useEffect} from 'react';
import style from './compoentsCss/Loading.module.css'

const Loading =({loading,data}:any) => {



return (
    loading?

    <div className={style.Loading__Container}>
        <span className={style.Loading__Container__loader}></span>
        {data}
    </div>:
    <></>
);
}



export default Loading;