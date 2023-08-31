import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../../../../../store/usersSlice";
import { useSelector } from "react-redux";
import "./userProfilePage.scss";
import Button from "@mui/material/Button";
import { getCurrentUser } from "../../../../../../store/authSlice";

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(getUserById(id));
  const currentUser = useSelector(getCurrentUser());
  const isAdmin = currentUser && currentUser.role === "admin";
  const isManager = currentUser && currentUser.role === "manager";
  const canView = isAdmin || isManager;
  const isUserOwnProfile = user._id === currentUser._id;
  const keysToDisplay = ["Name", "Email", "Role"];
  if (!canView && !isUserOwnProfile) return <Navigate to="/" />;

  return (
    <div className="user-profile-page">
      <h1>User Info</h1>
      {user && keysToDisplay.map(key =>
        <div key={key} className="user-profile-row">
          <div className="user-profile-row-key">{key}</div>
          <div className="user-profile-row-value">{user[key.toLowerCase()]}</div>
        </div>)
      }
      {(isAdmin || isUserOwnProfile) &&
        <Button
          style={{ marginTop: "1rem" }}
          variant="contained"
          onClick={() => navigate("edit")}
        >Edit</Button>
      }
    </div>
  );
};

export default UserProfilePage;
