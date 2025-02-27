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
import { register } from "../utils/api";

const RegisterScreen = ({ navigation }: any) => {
  // State untuk menyimpan input username & password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fungsi untuk menangani Register
  const handleRegister = async () => {
    try {
      await register(username, password);
      Alert.alert("Register Success");
      navigation.replace("Login"); // Pindah ke halaman Login setelah Register berhasil
    } catch (error: any) {
      Alert.alert("Register Failed", error?.message || "Something went wrong");
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

      {/* Tombol Register & Register */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonCreate} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonRegister} 
          onPress={() => navigation.navigate("Login")} // Navigasi ke RegisterScreen
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Style untuk tampilan RegisterScreen
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
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    gap: 10,
    marginTop: 15,
  },
  buttonCreate: {
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

export default RegisterScreen;
