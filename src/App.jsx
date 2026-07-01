import { Routes } from 'react-router';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import './App.scss';

export const App = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Routes>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
