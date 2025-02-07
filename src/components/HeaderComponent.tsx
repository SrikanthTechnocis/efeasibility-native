import { Button, Modal, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { universalStore } from "../store/universalStore";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const HeaderComponent = () => {
  const { headerName, fetchUniverseStore, setHeaderName } = universalStore();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    setModalVisible(true);
    // AsyncStorage.clear();
    // router.push("/");
  };

  const redirectToSelectRole = () => {
    router.push("/");
  };

  const logout = () => {
    setModalVisible(false);
    AsyncStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    fetchUniverseStore();
  }, []);

  return (
    <View className="w-full p-4  bg-[#104b41] flex flex-row justify-between items-center">
      <View>
        {/* <Feather name="menu" size={24} color="black" /> */}
        <Text className="text-2xl font-bold text-white">{headerName}</Text>
      </View>
      <View className="flex flex-row">
        {/* <Ionicons
          name="person-circle"
          size={24}
          color="black"
          className="mx-2"
          onPress={redirectToSelectRole}
        /> */}
        <MaterialIcons
          name="logout"
          size={24}
          color="white"
          className="mx-2"
          onPress={handleLogout}
        />
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-10/12 p-5 bg-white rounded items-center">
            <Text className="text-lg font-semibold">
              Are you sure you want to logout?
            </Text>
            <View className="flex flex-row gap-4 pt-4">
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color={"blue"}
              />
              <Button title="Yes, Logout" onPress={logout} color={"red"} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HeaderComponent;
