import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import cores from "./style/cores";

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDY22I3mtzHSalnDcd4RjqYr9PaRr8IeY8",
  authDomain: "coro-6e7d9.firebaseapp.com",
  projectId: "coro-6e7d9",
  storageBucket: "coro-6e7d9.appspot.com",
  messagingSenderId: "802765299837",
  appId: "1:802765299837:web:c568f313ae57d23a991114",
  measurementId: "G-1Q6Z9RRSDC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login() {
  if (!email || !senha) {
    Alert.alert("Erro", "Preencha todos os campos.");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Login no Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log("Login Firebase OK");

    // 2️⃣ Buscar dados do usuário na API pelo email
    const response = await axios.get(`http://localhost:3000/api/usuarios?email=${email}`);
    const user = response.data;

    if (!user) {
      throw new Error("Usuário não encontrado na API");
    }

    // Salvar localmente
  await AsyncStorage.setItem('@usuario', JSON.stringify({ email, senha }));

    // 3️⃣ Redirecionar conforme tipo
    if (user.tipo === "membro") {
      navigation.navigate("Inicio");
    } else {
      navigation.navigate("InicioADM");
    }

  } catch (error) {
    const mensagem = error?.response?.data?.message || error.message || "Erro ao realizar login.";
    Alert.alert("Erro", mensagem);
    console.error("Erro no login:", mensagem);
  } finally {
    setLoading(false);
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../image/coroAlpha.png")}
        style={{ width: 200, height: 200, marginTop: 20 }}
      />

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <MaterialIcons
            name={mostrarSenha ? "visibility" : "visibility-off"}
            size={24}
            color={cores.texto}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("RecuperacaoSenha")}>
        <Text style={styles.recuperarSenha}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao_1, loading && { opacity: 0.7 }]}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={cores.Secundaria} />
        ) : (
          <Text style={styles.textoClaro}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao_2}
        onPress={() => navigation.navigate("CadastroUsuario")}
      >
        <Text style={styles.texto}>Cadastre-se</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "100%",
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: cores.texto, fontSize: 16 },
  botao_1: {
    backgroundColor: cores.botaoEnviar,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  botao_2: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  texto: { color: cores.texto, fontWeight: "bold", fontSize: 20 },
  textoClaro: { color: cores.Secundaria, fontWeight: "bold", fontSize: 20 },
  recuperarSenha: { color: cores.texto, marginBottom: 10, textAlign: "center" },
});
