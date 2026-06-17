import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { auth } = useContext(AuthContext);

  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length && (!auth.role || !roles.includes(auth.role))) {
    // unauthorized — redirect to role home
    if (auth.role === 'donor') return <Navigate to="/dashboard/donor" replace />;
    if (auth.role === 'volunteer') return <Navigate to="/dashboard/volunteer" replace />;
    if (auth.role === 'organization') return <Navigate to="/dashboard/org" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
