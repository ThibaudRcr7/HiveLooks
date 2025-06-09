import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import Layout from './components/layouts/Layout';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import CreateLook from './pages/CreateLook';
import Discover from './pages/Discover';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import PresentationPage from './pages/PresentationPage';
import UIKitPage from './pages/UIKitPage';
import CreditsPage from './pages/CreditsPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/presentation" element={
              <ErrorBoundary>
                <PresentationPage />
              </ErrorBoundary>
            } />
            <Route path="/ui-kit" element={
              <ErrorBoundary>
                <UIKitPage />
              </ErrorBoundary>
            } />
            <Route path="/credits" element={
              <ErrorBoundary>
                <CreditsPage />
              </ErrorBoundary>
            } />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/creer-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/creer-look" element={<PrivateRoute><CreateLook /></PrivateRoute>} />
            <Route path="/discover" element={<Discover />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
