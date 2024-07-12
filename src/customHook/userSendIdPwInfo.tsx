import { useRef } from 'react';

export function useSendIdPwInfo() {
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);

    const handleInputSubmit = (e:React.FormEvent<HTMLFormElement>,type:string, callback: Function) => {
        e.preventDefault();
        let emailRefValue = emailRef.current!.value;
        let passwordRefValue = passwordRef.current!.value;

        if (passwordRefValue.trim().length === 0 && emailRefValue.trim().length === 0){
            console.log('throw an error!');
            
        } else {
            console.log('throw an error!');
            callback(type,{email:emailRefValue,password:passwordRefValue});
        }
    };

    return { handleInputSubmit, passwordRef, emailRef, passwordConfirmRef };
}

export function useRecreatepassword() {
    const emailRef = useRef<HTMLInputElement>(null);

    const handleInput = (e:React.FormEvent<HTMLFormElement>,callback: Function) => {
        e.preventDefault();
        // let emailRefValue = null
        const emailvalue = emailRef;
        console.log(emailvalue,'222edewdw');

        // if (emailRefValue.trim().length === 0){
        //     console.log('throw an error!');
        // } else {
        //     callback();
        // }
    };

    return { handleInput };
}
