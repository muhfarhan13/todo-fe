import React, { useEffect, useState } from "react";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Image, View } from "react-native";
import { jwtDecode } from "jwt-decode";
import { Icon, IconButton } from "react-native-paper";

// Import halaman utama aplikasi
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import NoteScreen from "./src/screens/NoteScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Buat referensi navigasi
export const navigationRef = createNavigationContainerRef();
const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Fungsi untuk logout pengguna
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigationRef.current?.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  // Mengecek status login pengguna
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  // Mengecek apakah token sudah kadaluarsa
  const checkTokenExpiration = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        await AsyncStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  };

  // Jalankan pengecekan saat aplikasi dimuat
  useEffect(() => {
    checkLoginStatus();
    checkTokenExpiration();
  }, []);

  // Tampilkan indikator loading saat status login sedang dicek
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        {/* Halaman Login */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        {/* Halaman Register */}
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Halaman Home */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <Image
                source={require("./assets/icon.png")}
                style={{ width: 120, resizeMode: "contain" }}
              />
            ),
            headerRight: () => (
              <IconButton icon="logout" iconColor="#ffff" size={20} onPress={handleLogout} />
            ),
            headerStyle: { backgroundColor: "#120827" },
            headerTintColor: "white",
          }}
        />        

        {/* Halaman Note */}
        <Stack.Screen
          name="Note"
          component={NoteScreen}
          options={{
            headerTitle: "",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#7E64FF",
              elevation: 0, // Hilangkan shadow di Android
              shadowOpacity: 0, // Hilangkan shadow di iOS
              borderBottomWidth: 0, // Hilangkan border bawah
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
