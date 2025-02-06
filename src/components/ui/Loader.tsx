import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loader = () => {
  return (
    <View className="flex-1 flex items-center justify-center">
      <ActivityIndicator color={"#83103e"} size={"large"} />
    </View>
  );
};

export default Loader;
