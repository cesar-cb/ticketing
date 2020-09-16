import { useState } from 'react';
import axios from 'axios';

const useRequest = ({
  method = 'get',
  body = {},
  url = '',
  onSuccess = () => {},
} = {}) => {
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState(null);

  const request = async ({ event, body: additionalBody = {} }) => {
    if (event) event.preventDefault();

    setErrors([]);
    setData(null);

    try {
      const { data } = await axios[method](url, { ...body, ...additionalBody });

      onSuccess(data);

      setData(data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return { errors, data, request };
};

export default useRequest;
