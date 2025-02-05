import React from "react";
import SelectRoleComponent from "../components/SelectRoleComponent";
import AuthGuard from "../guards/AuthGuard";

const IndexPage = () => {
  return (
    <AuthGuard>
      <SelectRoleComponent />
    </AuthGuard>
  );
};

export default IndexPage;
