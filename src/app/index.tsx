import React from "react";
import SelectRoleComponent from "../components/SelectRoleComponent";
import AuthGuard from "../guards/AuthGuard";
import DashboardCompnent from "../components/dashboardComponent";

const IndexPage = () => {
  return (
    <AuthGuard>
      <SelectRoleComponent />
    </AuthGuard>
  );
};

export default IndexPage;
