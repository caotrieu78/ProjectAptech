import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../services/authService';
import { PATHS } from '../constants/paths';

const GuestRoute = ({ children }) => {
    const user = getUser();

    if (user) {
        if (user.RoleID === 1) return <Navigate to={PATHS.DASHBOARD} replace />;
        return <Navigate to={PATHS.HOME} replace />;
    }

    return children;
};

export default GuestRoute;
