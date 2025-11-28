import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import cores from './style/cores';
import axios from 'axios';

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDY22I3mtzHSalnDcd4RjqYr9PaRr8IeY8",
  authDomain: "coro-6e7d9.firebaseapp.com",
  projectId: "coro-6e7d9",
  storageBucket: "coro-6e7d9.appspot.com",
  messagingSenderId: "802765299837",
  appId: "1:802765299837:web:c568f313ae57d23a991114",
  measurementId: "G-1Q6Z9RRSDC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ÍCONES
const iconeNome = require("../imgs/contato1.png");
const iconeEmail = require("../imgs/email.png");
const iconeSenha = require("../imgs/cadeado.png");
const iconeTipo = require("../imgs/naipe.png");
const iconeNaipe = require("../imgs/naipe1.png");
const iconeCalendario = require("../imgs/calendario.png");

export default function CriarConta({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [tipo, setTipo] = useState('membro');
  const [naipe, setNaipe] = useState('homem');
  const [dataNascimento, setDataNascimento] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChangeData = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    } else if (cleaned.length > 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    }
    setDataNascimento(cleaned);
  };

  const validarCampos = () => {
    if (!nome || !email || !senha || !dataNascimento || !tipo || !naipe) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return false;
    }
    const regexEmail = /^\S+@\S+\.\S+$/;
    if (!regexEmail.test(email)) {
      Alert.alert('Erro', 'Email inválido.');
      return false;
    }
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(dataNascimento)) {
      Alert.alert('Erro', 'Data inválida. Use DD/MM/AAAA.');
      return false;
    }
    const [dia, mes, ano] = dataNascimento.split('/');
    const data = new Date(`${ano}-${mes}-${dia}`);
    if (data > new Date()) {
      Alert.alert('Erro', 'Data de nascimento não pode ser no futuro.');
      return false;
    }
    return true;
  };

  const criarConta = async () => {
    if (!validarCampos()) return;

    setCarregando(true);
    const API_URL = 'https://coro-alpha.onrender.com/api/usuarios';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      const [dia, mes, ano] = dataNascimento.split('/');
      const dataISO = `${ano}-${mes}-${dia}`;

      const payload = {
        uidFirebase: uid,
        nome,
        tipo,
        naipe,
        email,
        senha,
        dataNascimento: dataISO
      };

      const response = await axios.post(API_URL, payload);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Nome */}
      <View style={styles.inputContainer}>
        <Image source={iconeNome} style={styles.iconImg} />
        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Image source={iconeEmail} style={styles.iconImg} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* Senha */}
      <View style={styles.inputContainer}>
        <Image source={iconeSenha} style={styles.iconImg} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Text style={{ color: cores.texto }}>
            {mostrarSenha ? "Ocultar" : "Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tipo */}
      <View style={styles.inputContainer}>
        <Image source={iconeTipo} style={styles.iconImg} />
        <Picker
          selectedValue={tipo}
          style={styles.picker}
          onValueChange={(itemValue) => setTipo(itemValue)}>
          <Picker.Item label="Membro" value="membro" />
          <Picker.Item label="Tesouraria" value="tesouraria" />
          <Picker.Item label="Líder" value="lider" />
          <Picker.Item label="Coordenador" value="coordenador" />
          <Picker.Item label="Líder de eventos" value="lider de eventos" />
          <Picker.Item label="Secretaria" value="secretaria" />
        </Picker>
      </View>

      {/* Naipe */}
      <View style={styles.inputContainer}>
        <Image source={iconeNaipe} style={styles.iconImg} />
        <Picker
          selectedValue={naipe}
          style={styles.picker}
          onValueChange={(itemValue) => setNaipe(itemValue)}>
          <Picker.Item label="Homem" value="homem" />
          <Picker.Item label="Mulher" value="mulher" />
          <Picker.Item label="Baixo" value="baixo" />
          <Picker.Item label="Tenor" value="tenor" />
          <Picker.Item label="Contralto" value="contralto" />
          <Picker.Item label="Soprano" value="soprano" />
        </Picker>
      </View>

      {/* Data de nascimento */}
      <View style={styles.inputContainer}>
        <Image source={iconeCalendario} style={styles.iconImg} />
        <TextInput
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#999"
          value={dataNascimento}
          onChangeText={handleChangeData}
          keyboardType="numeric"
          maxLength={10}
          style={styles.input}
        />
      </View>

      {/* Botão salvar */}
      <TouchableOpacity
        style={[styles.botaoSalvar, carregando && { opacity: 0.6 }]}
        onPress={criarConta}
        disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Salvar</Text>
        )}
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.input,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 15,
  },
  iconImg: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: cores.texto,
  },
  picker: {
    flex: 1,
    color: cores.texto,
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEnviar,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: cores.textoClaro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
