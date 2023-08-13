import React, { useState } from "react";
import "./user.scss";
import userService from "../../services/user.service";
import UsersTable from "../../components/ui/UsersTable";

const Users = () => {
  const [users, setUsers] = useState();
  const fetchUsers = async () => {
    try {
      const content = await userService.fetchAll();
      console.log(content);
      setUsers(content);
    } catch (error) {
      console.log(error);
    };
  };
  return (
    <div className="users">
      <h1 className="page-title">Users</h1>
      <button onClick={fetchUsers}>Fetch Users</button>
      {users && <UsersTable
        users={users}
      />}
    </div>
  );
};

export default Users;
