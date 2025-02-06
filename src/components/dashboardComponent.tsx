import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const DashboardCompnent = () => {
  return (
    <>
      <View className="flex-1  bg-light">
        <Text className="text-2xl">Dashboard Page</Text>
      </View>
      <StatusBar style="auto" />
    </>
  );
};

export default DashboardCompnent;
