import React from "react";
import { useParams } from "react-router-dom";
import AddUserForm from "../../components/ui/addUserForm/AddUserForm";
import { useSelector } from "react-redux";
import { getUserById } from "../../store/users";
const EditUserPage = () => {
  const { id } = useParams();
  const user = useSelector(getUserById(id));

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
