const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).length > 0;
};

const isValidEmail = (email) => {
  if (email === null || email === undefined) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
};

const isValidPassword = (password) => {
  if (password === null || password === undefined) return false;
  const str = String(password);
  if (str.length < 8) return false;
  if (!/[a-zA-Z]/.test(str)) return false;
  if (!/[0-9]/.test(str)) return false;
  return true;
};

export { isRequired, isValidEmail, isValidPassword };
