import { useState } from 'react';

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [execute] = useState(() => {
    return async (serviceFn, ...args) => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const result = await serviceFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    };
  });

  return { data, loading, error, execute };
};
