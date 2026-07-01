import { Routes, Route } from 'react-router';
import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { MoviePage } from './pages/MoviePage.jsx';
import { FavoritesPage } from './pages/FavoritesPage.jsx';
import './App.scss';

export const App = () => {
  return (
    <ErrorBoundary>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/movies/:id" element={<MoviePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};
