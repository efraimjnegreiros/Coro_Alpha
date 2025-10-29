import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
    const API_URL = 'http://localhost:3000/api/usuarios'; // Substitua pelo seu endpoint

    try {
      // 1️⃣ Criar usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;
      console.log('Usuário Firebase criado:', uid);

      // 2️⃣ Criar usuário na API
      const [dia, mes, ano] = dataNascimento.split('/');
      const dataISO = `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD

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
      console.log('Resposta da API:', response.data);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro no cadastro:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', error.response?.data?.message || error.message || 'Erro ao cadastrar usuário.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nome */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color={cores.texto} style={styles.icon} />
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
        <MaterialIcons name="email" size={24} color={cores.texto} style={styles.icon} />
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
        <MaterialIcons name="lock" size={24} color={cores.texto} style={styles.icon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <MaterialIcons
            name={mostrarSenha ? 'visibility' : 'visibility-off'}
            size={24}
            color={cores.texto}
          />
        </TouchableOpacity>
      </View>

      {/* Tipo */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="group" size={24} color={cores.texto} style={styles.icon} />
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
        <MaterialIcons name="wc" size={24} color={cores.texto} style={styles.icon} />
        <Picker
          selectedValue={naipe}
          style={styles.picker}
          onValueChange={(itemValue) => setNaipe(itemValue)}>
          <Picker.Item label="Homem" value="homem" />
          <Picker.Item label="Mulher" value="mulher" />
        </Picker>
      </View>

      {/* Data de Nascimento */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="calendar-today" size={24} color={cores.texto} style={styles.icon} />
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

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[styles.botaoSalvar, carregando && { opacity: 0.6 }]}
        onPress={criarConta}
        disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>Salvar</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.Secundaria, justifyContent: 'center', paddingHorizontal: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.input, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, width: '100%', marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: cores.texto },
  picker: { flex: 1, color: cores.texto },
  botaoSalvar: { backgroundColor: cores.botaoEnviar, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: cores.textoClaro, fontSize: 18, fontWeight: 'bold' },
});
