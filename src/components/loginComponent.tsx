import "./../../global.css";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import Input from "../components/ui/Input";
import { useState } from "react";
import { authStore } from "../store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const LoginComponent = () => {
  // Login Form State
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  // Hooks / Store
  const { login, getTokenLocalStorage } = authStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email) {
      setErrors({ ...errors, email: true });
      return;
    }
    if (!password) {
      setErrors({ ...errors, password: true });
      return;
    }
    if (!email || !password) {
      setErrors({ email: true, password: true });
      return;
    }
    setErrors({ email: false, password: false });
    try {
      const res = await login({ username: email, password });
      console.log("--Login Response : ", res);
      if (res) {
        AsyncStorage.setItem("appName", "efeasibility");
        AsyncStorage.setItem("basicauth", res.token);
        AsyncStorage.setItem("user", JSON.stringify(res));
        getTokenLocalStorage();
        router.push("/select-role");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log("--Error: ", error);
    }
  };
  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <ImageBackground
            source={require("./../assets/images/login.jpg")}
            className="flex-1 bg-fixed bg-cover"
          >
            <View className="absolute top-10 left-0 right-5 flex items-center justify-center py-3">
              <Image
                style={{ width: 300, height: 100 }}
                source={require("./../assets/images/star-logo.png")}
              />
            </View>
            <View className="flex-1 p-2 justify-center">
              <View className="bg-white p-2 w-auto">
                <View className="p-1">
                  <Text className="text-4xl font-bold text-center text-slate-700">
                    Login
                  </Text>
                </View>

                <View className="pt-3">
                  <Input
                    label="Email"
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    inputMode="email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors({ ...errors, email: false });
                    }}
                    error={errors.email}
                    errorText="Please enter a valid email"
                  />
                  <Input
                    label="Password"
                    placeholder="****"
                    keyboardType="default"
                    inputMode="text"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: false });
                    }}
                    secureTextEntry
                    error={errors.password}
                    errorText="Please enter a password"
                  />
                </View>

                <View>
                  <Pressable
                    className="m-2 rounded bg-slate-600 p-3 "
                    onPress={handleLogin}
                  >
                    <Text className="text-xl font-bold text-white text-center">
                      Login
                    </Text>
                  </Pressable>
                </View>
              </View>
              <StatusBar style="auto" />
            </View>
          </ImageBackground>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default LoginComponent;
