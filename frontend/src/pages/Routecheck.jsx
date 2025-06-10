import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RouteCheck = () => {
  const token = Cookies.get('token');

  return token ? <Navigate to="/" /> : <Navigate to="/auth" />;
};

export default RouteCheck;
