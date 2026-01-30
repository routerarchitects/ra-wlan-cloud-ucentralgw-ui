import React from 'react';
import { Route, Routes } from 'react-router-dom';
import lightLogo from 'assets/mango-cloud.png';
import { useAuth } from 'contexts/AuthProvider';

const Layout = React.lazy(() => import('layout'));
const Login = React.lazy(() => import('pages/LoginPage'));

const Router: React.FC = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {token !== '' ? (
        <Route path="/*" element={<Layout />} />
      ) : (
        <Route path="/*" element={<Login lightLogo={lightLogo} darkLogo={lightLogo} />} />
      )}
    </Routes>
  );
};

export default Router;
