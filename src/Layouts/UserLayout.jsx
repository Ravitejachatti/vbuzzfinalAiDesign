import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './layout/MainLayout';
import Header from './layout/Header';
import Navbar from './layout/Navbar';
import Footer from './layout/footer';

const UserLayout = () => {
  // Use optional chaining to safely access 'user' property
  // const user = useSelector((state) => state?.Auth?.user);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  return (
    <>

      <Header />

      <Navbar />

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
