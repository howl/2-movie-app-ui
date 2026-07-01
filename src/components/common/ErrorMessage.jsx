export const ErrorMessage = ({ message, type = 'error' }) => {
  return (
    <div className={`error-message ${type}`} role="alert">
      {message}
    </div>
  );
};
