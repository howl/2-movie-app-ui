import { useState } from 'react';

export const useForm = (initialValues, validators) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (validators && validators[name]) {
      return validators[name](value);
    }
    return null;
  };

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    if (!name) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
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
  };

  const validateAll = () => {
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
  };

  const handleSubmit = (onSubmit) => {
    return async (e) => {
      e.preventDefault();
      if (validateAll()) {
        await onSubmit();
      }
    };
  };

  return { values, errors, handleChange, handleBlur, handleSubmit, setErrors };
};
