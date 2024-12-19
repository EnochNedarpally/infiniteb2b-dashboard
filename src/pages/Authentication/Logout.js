import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { logoutUser } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../Components/Common/withRouter";
import { createSelector } from "reselect";

const Logout = (props) => {
  const authUserData = JSON.parse(sessionStorage.getItem("authUser"));
  const dispatch = useDispatch();
  const [endURL, setEndURL] = useState("/admin/login")

  const logoutData = createSelector(
    (state) => state.Login,
    (isUserLogout) => isUserLogout.isUserLogout
  );
  const isUserLogout = useSelector(logoutData);
  useEffect(() => {
    if (authUserData?.data?.role) {
      setEndURL(getURL(authUserData.data.role))
    }
  }, [authUserData])
  const getURL = (role) => {
    if (role == "SUPERADMIN ") return "/admin/login"
    if (role == "vendor") return "/vendor/login"
    else return "/user/login"
  }

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (isUserLogout) {
    return <Navigate to={endURL} />;
  }

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};


export default withRouter(Logout);
