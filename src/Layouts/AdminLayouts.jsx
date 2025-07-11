import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkUser } from '../Redux/Auth/Action.js'; // Import the Redux action to check user authentication

const AdminLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Dispatch the action to check if the user is authenticated
    dispatch(checkUser());

    // Redirect to the login page if the user is not an admin or not logged in
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [dispatch, user, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminLayout;
