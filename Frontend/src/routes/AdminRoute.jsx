import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../services/authService';
import { PATHS } from '../constants/paths';

const AdminRoute = ({ children }) => {
    const user = getUser();

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;
    if (user.RoleID !== 1) return <Navigate to={PATHS.HOME} replace />;

    return children;
};

export default AdminRoute;
