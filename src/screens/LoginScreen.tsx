import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../utils/api";

const LoginScreen = ({ navigation }: any) => {
  // State untuk menyimpan input username & password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fungsi untuk menangani login
  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      await AsyncStorage.setItem("token", data.token);

      // Reset navigasi agar tidak bisa kembali ke halaman login
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error: any) {
      Alert.alert("Login Gagal", error?.message || "Terjadi Kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/icon.png")} style={styles.logo} />

      {/* Input Username */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Input Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Tombol Login & Register */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonRegister} 
          onPress={() => navigation.navigate("Register")} // Navigasi ke RegisterScreen
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Style untuk tampilan LoginScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#CCC2FE",
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    gap: 10,
    marginTop: 15,
  },
  buttonLogin: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#120827",
  },
  buttonRegister: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#7E64FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    fontSize: 17,
  },
});

export default LoginScreen;
