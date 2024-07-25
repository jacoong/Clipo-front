import React, {ReactNode, useEffect} from 'react';
import style from './compoentsCss/Loading.module.css'

const LocalLogin =({status,data}:any) => {


    useEffect(()=>{
        console.log(status,'status')
    },[status])

return (
    status === 'loading'?
    <div className={style.Loading__Container}>
        <span className={style.Loading__Container__loader}></span>
        {data}
    </div>
    :
    null
);
}



export default LocalLogin;