import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../store/usersSlice";
import { useSelector } from "react-redux";
import "./userProfilePage.scss";
import Button from "@mui/material/Button";
import { getCurrentUser } from "../../store/authSlice";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(getCurrentUser());
  const isAdmin = currentUser && currentUser.role === "admin";

  const { id } = useParams();
  const user = useSelector(getUserById(id));
  const keysToDisplay = ["Name", "Email", "Role"];
  return (
    <div className="user-profile-page">
      <h1>User Info</h1>
      {user && keysToDisplay.map(key =>
        <div key={key} className="user-profile-row">
          <div className="user-profile-row-key">{key}</div>
          <div className="user-profile-row-value">{user[key.toLowerCase()]}</div>
        </div>)
      }
      {isAdmin &&
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
