import { useState } from 'react';



export function useFormInput({initialValue}:any) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
