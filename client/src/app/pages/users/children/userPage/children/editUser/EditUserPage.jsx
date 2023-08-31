import React from "react";
import { Navigate, useParams } from "react-router-dom";
import AddUserForm from "../../../../../../components/ui/addUserForm/AddUserForm";
import { useSelector } from "react-redux";
import { getUserById } from "../../../../../../store/usersSlice";
import { getCurrentUser } from "../../../../../../store/authSlice";
import { useToaster } from "../../../../../../hooks/useToaster";
const EditUserPage = () => {
  const { id } = useParams();
  const { toast } = useToaster();
  const user = useSelector(getUserById(id));
  const currentUser = useSelector(getCurrentUser());
  const isAdmin = currentUser && currentUser.role === "admin";
  const canEdit = isAdmin;

  const isUserOwnProfile = user._id === currentUser._id;

  if (!canEdit && !isUserOwnProfile) {
    toast.error("Cannot edit this user!");
    return <Navigate to={`/users/${id}`} />;
  };

  return (
    <div>
      <h1 style={{ marginBottom: "3rem" }}>Edit User</h1>
      <AddUserForm
        mode="edit"
        userData={user}
      />
    </div>
  );
};

export default EditUserPage;
