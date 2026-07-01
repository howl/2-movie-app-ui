import './Footer.scss';

export const Footer = () => {
  return (
    <footer className="footer">
      <p>Movie App &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

