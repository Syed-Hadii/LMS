import React, { useEffect, useState } from "react";
import Role from "../Pages/Role";
import User from "../Pages/User";
const UserRoleManagement = () => {
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem("roles");
    return savedRoles ? JSON.parse(savedRoles) : [];
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("users", JSON.stringify(users));
  }, [roles, users]);

  const handleRolesChange = (updatedRoles) => {
    setRoles(updatedRoles);
  };

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div>
      <Role onRolesChange={handleRolesChange} roles={roles} />
      <User onAddUser={handleAddUser} roles={roles} users={users} />
    </div>
  );
};

export default UserRoleManagement;
