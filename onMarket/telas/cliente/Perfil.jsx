import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
  Modal,
  TextInput,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import cores from "../style/cores";
import { useFocusEffect } from "@react-navigation/native";
import MenuInferiorCliente from "../navigation/navigationBar_cliente";

// ========= FIREBASE =========
import { initializeApp } from "firebase/app";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDY22I3mtzHSalnDcd4RjqYr9PaRr8IeY8",
  authDomain: "coro-6e7d9.firebaseapp.com",
  projectId: "coro-6e7d9",
  storageBucket: "coro-6e7d9.appspot.com",
  messagingSenderId: "802765299837",
  appId: "1:802765299837:web:c568f313ae57d23a991114",
  measurementId: "G-1Q6Z9RRSDC",
};

// Inicializar Firebase corretamente
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ========= ÍCONES =========
const iconeNome = require("../../imgs/contato1.png");
const iconeEmail = require("../../imgs/email.png");
const iconeSenha = require("../../imgs/cadeado.png");
const iconeCalendario = require("../../imgs/calendario.png");
const iconeSenhaOff = require("../../imgs/naosenha.png");


export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  // MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [senhaEdit, setSenhaEdit] = useState("");
  const [dataNascimentoEdit, setDataNascimentoEdit] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  // =============================
  // BUSCAR DADOS NA API COM ID
  // =============================
  const carregarUsuario = async () => {
    try {
      const usuarioStr = await AsyncStorage.getItem("@usuario");

      if (!usuarioStr) {
        navigation.replace("Login");
        return;
      }

      const usuarioLocal = JSON.parse(usuarioStr);

      const response = await axios.get(
        `https://coro-alpha.onrender.com/api/usuarios/${usuarioLocal.id}`
      );

      setUsuario(response.data);

      await AsyncStorage.setItem("@usuario", JSON.stringify(response.data));

    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarUsuario();
    }, [])
  );

  // =============================
  // ABRIR MODAL COM DADOS
  // =============================
  const abrirModal = () => {
    setNomeEdit(usuario.nome || "");
    setEmailEdit(usuario.email || "");
    setSenhaEdit(usuario.senha || "");
    setDataNascimentoEdit(usuario.dataNascimento || "");
    setMostrarSenha(false);
    setModalVisible(true);
  };

  // =============================
  // SALVAR DADOS EDITADOS
  // =============================
  const salvarEdicao = async () => {
    try {
      if (!nomeEdit.trim()) return Alert.alert("Erro", "Nome é obrigatório.");
      if (!dataNascimentoEdit.trim())
        return Alert.alert("Erro", "A data de nascimento é obrigatória.");

      // Atualizar Firebase (email + senha)
      if (auth.currentUser) {
        if (emailEdit !== usuario.email) {
          await updateEmail(auth.currentUser, emailEdit);
        }

        if (senhaEdit !== usuario.senha) {
          await updatePassword(auth.currentUser, senhaEdit);
        }
      }

      const payload = {
        nome: nomeEdit,
        email: emailEdit,
        senha: senhaEdit,
        dataNascimento: dataNascimentoEdit,
      };

      const response = await axios.put(
        `https://coro-alpha.onrender.com/api/usuarios/${usuario.id}`,
        payload
      );

      await AsyncStorage.setItem("@usuario", JSON.stringify(response.data));
      setUsuario(response.data);

      Alert.alert("Sucesso", "Dados atualizados!");
      setModalVisible(false);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", error.response?.data?.message || error.message);
    }
  };

  // =============================
  // LOGOUT
  // =============================
  const logout = async () => {
    await AsyncStorage.removeItem("@usuario");
    navigation.replace("Login");
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Carregando...</Text>
      </View>
    );
  }

  // ================================================================
  // ========================== TELA ================================
  // ================================================================

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.card}>
          <Text style={styles.titulo}>Perfil do Usuário</Text>

          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.valor}>{usuario.nome}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.valor}>{usuario.email}</Text>

          <Text style={styles.label}>Senha:</Text>
          <Text style={styles.valor}>********</Text>

          <Text style={styles.label}>Data de nascimento:</Text>
          <Text style={styles.valor}>{usuario.dataNascimento}</Text>

          <TouchableOpacity style={styles.botaoEditar} onPress={abrirModal}>
            <Text style={styles.textoBotao}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoSair} onPress={logout}>
            <Text style={styles.textoBotao}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <MenuInferiorCliente navigation={navigation} />

      {/* ====================== MODAL ======================== */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Editar Dados</Text>

            {/* Nome */}
            <View style={styles.modalInputContainer}>
              <Image source={iconeNome} style={styles.modalIcon} />
              <TextInput
                value={nomeEdit}
                onChangeText={setNomeEdit}
                placeholder="Nome"
                style={styles.modalInput}
              />
            </View>

            {/* Email */}
            <View style={styles.modalInputContainer}>
              <Image source={iconeEmail} style={styles.modalIcon} />
              <TextInput
                value={emailEdit}
                onChangeText={setEmailEdit}
                placeholder="Email"
                style={styles.modalInput}
              />
            </View>

            {/* Senha */}
            <View style={styles.modalInputContainer}>
              <Image source={iconeSenha} style={styles.modalIcon} />

              <TextInput
                value={senhaEdit}
                onChangeText={setSenhaEdit}
                placeholder="Senha"
                secureTextEntry={!mostrarSenha}
                style={[styles.modalInput, { flex: 1 }]}
              />

              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Image
                  source={iconeSenhaOff}
                  style={{ width: 26, height: 26, marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>

            {/* Data nascimento */}
            <View style={styles.modalInputContainer}>
              <Image source={iconeCalendario} style={styles.modalIcon} />
              <TextInput
                value={dataNascimentoEdit}
                onChangeText={setDataNascimentoEdit}
                placeholder="AAAA-MM-DD"
                style={styles.modalInput}
              />
            </View>

            <TouchableOpacity style={styles.modalSalvar} onPress={salvarEdicao}>
              <Text style={styles.modalBtnText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ============================= ESTILOS =============================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  card: {
    backgroundColor: cores.cardProdutos,
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: cores.texto,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: cores.texto,
  },
  valor: {
    fontSize: 18,
    color: cores.texto,
  },
  botaoEditar: {
    backgroundColor: cores.botaoEditar,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  botaoSair: {
    backgroundColor: cores.botaoSair,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
  },
  modalSalvar: {
    backgroundColor: cores.botaoEnviar,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalCancelar: {
    backgroundColor: cores.botaoSair,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
