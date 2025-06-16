import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../services/authService';
import { PATHS } from '../constants/paths';

const UserRoute = ({ children }) => {
    const user = getUser();

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;

    return children;
};

export default UserRoute;
