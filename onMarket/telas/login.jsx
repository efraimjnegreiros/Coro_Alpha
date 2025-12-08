import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import cores from "./style/cores";

const firebaseConfig = {
  apiKey: "AIzaSyDY22I3mtzHSalnDcd4RjqYr9PaRr8IeY8",
  authDomain: "coro-6e7d9.firebaseapp.com",
  projectId: "coro-6e7d9",
  storageBucket: "coro-6e7d9.appspot.com",
  messagingSenderId: "802765299837",
  appId: "1:802765299837:web:c568f313ae57d23a991114",
  measurementId: "G-1Q6Z9RRSDC",
};

const iconeEmail = require("../imgs/contato.png");
const iconeSenha = require("../imgs/senha.png");
const iconeSenhaOff = require("../imgs/naosenha.png");

initializeApp(firebaseConfig);
const auth = getAuth();

// CONFIGURAÇÃO GLOBAL DO HANDLER DAS NOTIFICAÇÕES
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ==========================================
// 🔥 Função que pede permissão e pega token
// ==========================================
async function getExpoToken() {
  try {
    // Permissão para notificações
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("❌ Permissão de notificação negada");
      return null;
    }

    // Gera o token do dispositivo
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("📱 EXPO TOKEN GERADO:", token);

    return token;

  } catch (e) {
    console.log("Erro ao gerar token:", e);
    return null;
  }
}

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 🔥 Função principal de login
  // ==========================================
  async function fazerLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 1 — Login Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("✔ Login Firebase OK");

      // 2 — Pegar token de notificação
      const expoToken = await getExpoToken();

      // 3 — Buscar usuário da API
      const response = await axios.get("https://coro-alpha.onrender.com/api/usuarios");
      const listaUsuarios = response.data;

      const user = listaUsuarios.find((u) => u.email === email);

      if (!user) {
        Alert.alert("Erro", "Usuário não encontrado na API.");
        return;
      }

      // 4 — Atualizar token no backend
      if (expoToken) {
        await axios.put(`https://coro-alpha.onrender.com/api/usuarios/${user.id}`, {
          expoPushToken: expoToken
        });

        console.log("✔ Token salvo no backend");
      }

      // 5 — Salvar usuário localmente
      await AsyncStorage.setItem(
        "@usuario",
        JSON.stringify({
          id: user.id,
          email: user.email,
          tipo: user.tipo,
          expo_token: expoToken || null,
        })
      );

      // 6 — Redirecionamento
      if (user.tipo === "membro") {
        navigation.navigate("Inicio");
      } else {
        navigation.navigate("InicioADM");
      }

    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Erro desconhecido ao realizar login.";

      Alert.alert("Erro", msg);
      console.log("ERRO LOGIN:", error);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../image/coroAlpha.png")}
        style={{ width: 200, height: 200, marginTop: 20 }}
      />

      {/* EMAIL */}
      <View style={styles.inputContainer}>
        <Image source={iconeEmail} style={styles.iconeLocal} />
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

      {/* SENHA */}
      <View style={styles.inputContainer}>
        <Image source={iconeSenha} style={styles.iconeLocal} />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Image
            source={mostrarSenha ? iconeSenha : iconeSenhaOff}
            style={[styles.iconeLocal, { marginLeft: 5 }]}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("RecuperacaoSenha")}
      >
        <Text style={styles.recuperarSenha}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao_1, loading && { opacity: 0.7 }]}
        onPress={fazerLogin}
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

// ==========================================
// STYLES
// ==========================================
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
  iconeLocal: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: cores.texto,
    fontSize: 16,
  },
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
  recuperarSenha: {
    color: cores.texto,
    marginBottom: 10,
    textAlign: "center",
  },
});
