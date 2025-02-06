import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  Text,
  View,
  Image,
  Button,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { authStore } from "../store/authStore";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

const SelectRoleComponent = () => {
  const router = useRouter();
  const { getUserRoles, getTokenLocalStorage, getUserFromLocalStorage } =
    authStore();
  const [userData, setUserData] = useState<any>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("Select Role");
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => {
    setVisible(!visible);
  };
  const closeMenu = () => setVisible(false);

  // Fetch roles when username is available
  const getRoles = (userName: string) => {
    const payload = { username: userName };
    getUserRoles(payload).then((res: any) => {
      setUserRoles(res.data);
    });
  };

  const handleSelectedRole = async () => {
    if (!selectedRole) {
      Alert.alert("Alert", "Please Select Role");
      return;
    }

    console.log("--Selected role : ", selectedRole + " - " + selectedRoleName);

    const userDetails = userRoles.find(
      (user: any) => user.profileId === selectedRole
    );

    if (!userDetails) {
      Alert.alert("Alert", "Selected role is not found");
      return;
    }

    console.log("--Selected role User Details : ", userDetails);

    AsyncStorage.setItem("user", JSON.stringify(userDetails));
    let roleData = {
      roleId: selectedRole,
      roleName: selectedRoleName,
    };
    AsyncStorage.setItem("selectedRole", JSON.stringify(roleData));
    router.push("/dashboard");
  };

  // Fetch user on mount
  useEffect(() => {
    getUserFromLocalStorage().then((data: any) => {
      const user = JSON.parse(data);
      console.log("select-role-user", user);
      setUserData(user);
      getRoles(user.username ? user.username : user.userName);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <ImageBackground
          source={require("./../assets/images/login.jpg")}
          className="flex-1 bg-fixed bg-cover"
        >
          {/* Logo */}
          <View className="absolute top-10 left-0 right-5 flex items-center justify-center py-3">
            <Image
              style={{ width: 300, height: 100 }}
              source={require("./../assets/images/star-logo.png")}
            />
          </View>

          {/* Role Selection Card */}
          <View className="flex-1 p-2 justify-center">
            <View className="bg-white p-4 w-auto rounded-lg shadow-md">
              <Text className="text-2xl font-bold text-center text-slate-700">
                Role Selection
              </Text>

              <View className="pt-3 px-4">
                {/* Select Role Component */}
                <View className="select w-full border-b-2 border-slate-700 p-2 rounded-lg">
                  <Pressable
                    className="flex flex-row items-center justify-between"
                    onPress={toggleMenu}
                  >
                    {/* Placeholder */}
                    <Text className="text-gray-600">{selectedRoleName}</Text>
                    <AntDesign name="caretdown" size={14} color="black" />
                  </Pressable>
                </View>

                {/* Dropdown */}
                <View className=" max-h-40">
                  {visible && (
                    <ScrollView className="mt-3 bg-white">
                      {userRoles.map((role: any) => (
                        <View className="w-full p-1" key={role.profileId}>
                          <Text
                            className="hover:bg-blue-400 bg-gray-200 p-2"
                            onPress={() => {
                              setSelectedRole(role.profileId);
                              setSelectedRoleName(role.profileDescription);
                              closeMenu();
                            }}
                          >
                            {role.profileDescription}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex flex-row items-center justify-evenly pt-5 ">
                <Pressable
                  className="w-5/12 p-3 rounded bg-blue-600"
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Text className="text-center text-white font-semibold">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  className="w-5/12 p-3 rounded bg-green-700"
                  onPress={handleSelectedRole}
                >
                  <Text className="text-center text-white font-semibold">
                    Submit
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* <Button
              title="Clear Storage"
              onPress={async () => {
                await AsyncStorage.clear();
                Alert.alert(
                  "Storage Cleared",
                  "AsyncStorage has been cleared."
                );
                router.push("/");
              }}
            /> */}
          </View>

          <StatusBar style="auto" />
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SelectRoleComponent;
