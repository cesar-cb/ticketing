import { useState } from 'react';
import axios from 'axios';

export default ({
  method = 'get',
  body = {},
  url = '',
  onSuccess = () => {},
} = {}) => {
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState(null);

  const request = async e => {
    if (e) e.preventDefault();

    setErrors([]);
    setData(null);

    try {
      const { data } = await axios[method](url, body);

      onSuccess();

      setData(data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return { errors, data, request };
};
