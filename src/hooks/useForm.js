import { useState, useCallback } from 'react';

export const useForm = (initialValues, validators) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    if (validators && validators[name]) {
      return validators[name](value);
    }
    return null;
  }, [validators]);

  const handleChange = useCallback((e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    if (!name) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[name] = error;
      } else {
        delete next[name];
      }
      return next;
    });
  }, [validateField]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    if (!validators) return true;
    for (const name of Object.keys(validators)) {
      const error = validators[name](values[name]);
      if (error) {
        newErrors[name] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validators, values]);

  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      if (validateAll()) {
        await onSubmit();
      }
    };
  }, [validateAll]);

  return { values, errors, handleChange, handleBlur, handleSubmit, setErrors };
};
