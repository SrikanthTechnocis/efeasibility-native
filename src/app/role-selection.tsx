import SelectRoleComponent from "../components/SelectRoleComponent";
import AuthGuard from "../guards/AuthGuard";

const RoleSelection = () => {
  return (
    <AuthGuard>
      <SelectRoleComponent />
    </AuthGuard>
  );
};

export default RoleSelection;
