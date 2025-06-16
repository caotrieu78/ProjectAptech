import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            {/* Remove Bootstrap container to allow full-width sections like Slider */}
            <main className="flex-grow-1 p-0 m-0">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
