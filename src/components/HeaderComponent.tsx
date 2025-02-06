import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const HeaderComponent = () => {
  return (
    <View className="w-full p-4  bg-light flex flex-row justify-between items-center">
      <View>
        <Feather name="menu" size={24} color="black" />
      </View>
      <View className="flex flex-row">
        <Ionicons
          name="person-circle"
          size={24}
          color="black"
          className="mx-2"
        />
        <MaterialIcons name="logout" size={24} color="black" className="mx-2" />
      </View>
    </View>
  );
};

export default HeaderComponent;
