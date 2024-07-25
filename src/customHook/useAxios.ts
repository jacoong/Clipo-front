import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import qs from "qs";

type AxiosProps = {
  method: "get" | "post" | "put" | "delete";
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
};

type UseAxiosExecutionReturn<T> = [
  {
    response: T | undefined;
    error: string | null;
    loading: boolean;
  },
  (data?:any) => void
];


const SERVERURL = process.env.REACT_APP_SERVER_URL as string;

const useAxios = <T>({
  method,
  url,
  data,
  config,
}: AxiosProps): UseAxiosExecutionReturn<T> => {
  // const [response, setResponse] = useState<T | undefined>();
  const [response, setResponse] = useState<any | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execution = (data?: any) => {
    console.log('did it')
    setLoading(true);
    setError(null);

    if (method === "get" || method === "delete") {
      axios[method](`${SERVERURL}${url}`, config)
        .then((res) => {
          setResponse(res.data);
        })
        .catch((err: AxiosError) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });



      


    } else {
      console.log(SERVERURL)
      axios[method](`${SERVERURL}${url}`, qs.stringify(data), config)
        .then((res) => {
          setResponse(res.data);
        })
        .catch((err: AxiosError) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };


  // useEffect(()=>{
  //   execution()
  // },[])

  return [{ response, error, loading }, execution];
};

export default useAxios;
