import { View } from "react-native";
import AuthGuard from "../../guards/AuthGuard";
import { Slot } from "expo-router";
import HeaderComponent from "../../components/HeaderComponent";
import { universalStore } from "../../store/universalStore";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import DashboardCompnent from "../../components/dashboardComponent";

const DashboardLayout = () => {
  const Drawer = createDrawerNavigator();
  const { drawerOpen } = universalStore();
  const [active, setActive] = useState("first");
  return (
    <>
      <AuthGuard>
        <HeaderComponent />
        <View className="flex-1 flex-row">
          <Slot />
        </View>
      </AuthGuard>
    </>
  );
};

export default DashboardLayout;
