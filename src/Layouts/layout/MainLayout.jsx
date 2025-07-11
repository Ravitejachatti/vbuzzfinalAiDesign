// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './footer';
import Header from './Header';

const MainLayout = () => {
  return (
    <>
      {/* Your layout components, like Header and Sidebar, go here */}
      
      {/* headher here */}
    <Header/>

      <Navbar/>

      {/* Render the nested routes */}
      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default MainLayout;
