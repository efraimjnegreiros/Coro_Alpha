import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cores from '../style/cores';
import MenuInferiorADM from '../navigation/navigationBar_admin';
import BarraPesquisaADM from '../navigation/barraPesquisa_admin';

export default function InicioADM() {
  const navigation = useNavigation();
  const [membros, setMembros] = useState([]);
  const [busca, setBusca] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('');
  const [naipeEdit, setNaipeEdit] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    try {
      // Recupera o email salvo no AsyncStorage
      const usuarioJSON = await AsyncStorage.getItem('@usuario');
      const usuarioStorage = usuarioJSON ? JSON.parse(usuarioJSON) : null;

      if (!usuarioStorage || !usuarioStorage.email) {
        console.warn('Nenhum usuário logado encontrado.');
        setCarregando(false);
        return;
      }

      // Busca o usuário logado diretamente pelo email
      const responseUsuario = await axios.get(
        `http://localhost:3000/api/usuarios/email/${usuarioStorage.email}`
      );
      setUsuarioLogado(responseUsuario.data);

      // Busca todos os usuários
      const responseMembros = await axios.get('http://localhost:3000/api/usuarios');
      setMembros(responseMembros.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  }

  const membrosFiltrados = membros.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Abrir modal com usuário selecionado
  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
    setNomeEdit(usuario.nome);
    setTipoEdit(usuario.tipo);
    setNaipeEdit(usuario.naipe);
    setModalVisible(true);
  };

  const atualizarUsuario = async () => {
    try {
      await axios.put(`http://localhost:3000/api/usuarios/${usuarioSelecionado.id}`, {
        nome: nomeEdit,
        tipo: tipoEdit,
        naipe: naipeEdit,
      });
      Alert.alert('Sucesso', 'Usuário atualizado!');
      setModalVisible(false);
      carregarDados();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
    }
  };

  const deletarUsuario = async () => {
  if (!usuarioSelecionado || !usuarioSelecionado.id) {
    Alert.alert('Erro', 'Nenhum usuário selecionado para deletar.');
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/api/usuarios/${usuarioSelecionado.id}`);
    Alert.alert('Sucesso', 'Usuário deletado!');
    setModalVisible(false);
    setUsuarioSelecionado(null);
    carregarDados();
  } catch (error) {
    console.error(error);
    Alert.alert('Erro', 'Não foi possível deletar o usuário.');
  }
};


  return (
    <SafeAreaView style={estilos.container}>
      <BarraPesquisaADM busca={busca} setBusca={setBusca} />

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        {usuarioLogado && (
          <Text style={estilos.nomeUsuario}>Olá, {usuarioLogado.nome}!</Text>
        )}

        <Text style={estilos.tituloSecao}>Membros:</Text>

        {carregando ? (
          <Text>Carregando membros...</Text>
        ) : membrosFiltrados.length === 0 ? (
          <Text>Nenhum membro encontrado.</Text>
        ) : (
          <View style={estilos.listaMembros}>
            {membrosFiltrados.map((membro) => (
              <TouchableOpacity
                key={membro.id}
                style={estilos.itemMembro}
                onPress={() => abrirModal(membro)}
              >
                <Text style={estilos.nomeMembro}>{membro.nome}</Text>
                <Text style={estilos.emailMembro}>{membro.email}</Text>
                <Text style={estilos.emailMembro}>{membro.naipe}</Text>
                <Text style={estilos.emailMembro}>{membro.tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitulo}>Editar Usuário</Text>

            <TextInput
              style={estilos.modalInput}
              placeholder="Nome"
              value={nomeEdit}
              onChangeText={setNomeEdit}
            />
            <TextInput
              style={estilos.modalInput}
              placeholder="Tipo"
              value={tipoEdit}
              onChangeText={setTipoEdit}
            />
            <TextInput
              style={estilos.modalInput}
              placeholder="Naipe"
              value={naipeEdit}
              onChangeText={setNaipeEdit}
            />

            <View style={estilos.modalBotoes}>
              <TouchableOpacity style={estilos.botaoSalvar} onPress={atualizarUsuario}>
                <Text style={estilos.textoBotao}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={estilos.botaoDeletar} onPress={deletarUsuario}>
                <Text style={estilos.textoBotao}>Deletar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: cores.texto, textAlign: 'center' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Secundaria,
  },
  conteudo: {
    padding: 20,
    marginBottom: 100,
  },
  nomeUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: cores.texto,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: cores.texto,
  },
  listaMembros: {
    marginBottom: 20,
  },
  itemMembro: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: cores.cardProdutos,
    marginBottom: 10,
  },
  nomeMembro: {
    fontWeight: 'bold',
    fontSize: 14,
    color: cores.texto,
  },
  emailMembro: {
    fontSize: 12,
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: cores.Secundaria,
    borderRadius: 10,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: cores.texto,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: cores.texto,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoSalvar: {
    backgroundColor: cores.botaoEnviar,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  botaoDeletar: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  textoBotao: {
    color: cores.textoClaro,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
