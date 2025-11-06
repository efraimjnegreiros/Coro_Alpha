import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import cores from '../style/cores';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MenuInferiorADM from '../navigation/navigationBar_admin';
import BarraPesquisaADM from '../navigation/barraPesquisa_admin';

export default function InicioADM() {
  const navigation = useNavigation();
  const [membros, setMembros] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // Campos do modal
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('membro');
  const [naipe, setNaipe] = useState('homem');
  const [dataNascimento, setDataNascimento] = useState('');

  useEffect(() => {
    carregarMembros();
  }, []);

  async function carregarMembros() {
    try {
      setCarregando(true);
      const resposta = await axios.get('https://coro-alpha.onrender.com/api/usuarios');
      setMembros(resposta.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os membros.');
    } finally {
      setCarregando(false);
    }
  }

  const membrosFiltrados = membros.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirModalCriar() {
    setModoEdicao(false);
    setUsuarioSelecionado(null);
    setNome('');
    setTipo('membro');
    setNaipe('homem');
    setDataNascimento('');
    setModalVisivel(true);
  }

  function abrirModalEditar(usuario) {
    setModoEdicao(true);
    setUsuarioSelecionado(usuario);
    setNome(usuario.nome);
    setTipo(usuario.tipo);
    setNaipe(usuario.naipe);
    // Formata para DD/MM/AAAA
    const data = new Date(usuario.dataNascimento);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    setDataNascimento(`${dia}/${mes}/${ano}`);
    setModalVisivel(true);
  }

  function handleChangeData(text) {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    } else if (cleaned.length > 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    }
    setDataNascimento(cleaned);
  }

  async function salvarUsuario() {
    if (!nome || !tipo || !naipe || !dataNascimento) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Valida data
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(dataNascimento)) {
      Alert.alert('Erro', 'Data inválida. Use DD/MM/AAAA.');
      return;
    }

    const [dia, mes, ano] = dataNascimento.split('/');
    const dataISO = `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD

    const dados = {
      nome,
      tipo,
      naipe,
      dataNascimento: dataISO,
    };

    try {
      if (modoEdicao && usuarioSelecionado) {
        await axios.put(`https://coro-alpha.onrender.com/api/usuarios/${usuarioSelecionado.id}`, dados);
        Alert.alert('Sucesso', 'Usuário atualizado!');
      } else {
        await axios.post('https://coro-alpha.onrender.com/api/usuarios', dados);
        Alert.alert('Sucesso', 'Usuário criado!');
      }
      setModalVisivel(false);
      carregarMembros();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o usuário.');
    }
  }

  async function deletarUsuario() {
    if (!usuarioSelecionado) return;
    try {
      await axios.delete(`https://coro-alpha.onrender.com/api/usuarios/${usuarioSelecionado.id}`);
      Alert.alert('Sucesso', 'Usuário deletado!');
      setModalVisivel(false);
      carregarMembros();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível deletar o usuário.');
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      <BarraPesquisaADM busca={busca} setBusca={setBusca} />

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.tituloSecao}>Membros:</Text>

        {carregando ? (
          <Text>Carregando membros...</Text>
        ) : membrosFiltrados.length === 0 ? (
          <Text>Nenhum membro encontrado.</Text>
        ) : (
          <View style={estilos.listaMembros}>
            {membrosFiltrados.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={estilos.itemMembro}
                onPress={() => abrirModalEditar(m)}
              >
                <Text style={estilos.nomeMembro}>{m.nome}</Text>
                <Text style={estilos.infoMembro}>Tipo: {m.tipo}</Text>
                <Text style={estilos.infoMembro}>Naipe: {m.naipe}</Text>
                <Text style={estilos.infoMembro}>Nascimento: {m.dataNascimento}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botão flutuante */}
      <TouchableOpacity style={estilos.botaoFlutuante} onPress={abrirModalCriar}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={estilos.modalContainer}>
          <View style={estilos.modalConteudo}>
            <Text style={estilos.modalTitulo}>{modoEdicao ? 'Editar Membro' : 'Novo Membro'}</Text>

            <TextInput
              style={estilos.input}
              placeholder="Nome"
              placeholderTextColor="#aaa"
              value={nome}
              onChangeText={setNome}
            />

            <View style={estilos.pickerContainer}>
              <Picker selectedValue={tipo} onValueChange={setTipo}>
                <Picker.Item label="Membro" value="membro" />
                <Picker.Item label="Tesouraria" value="tesouraria" />
                <Picker.Item label="Líder" value="lider" />
                <Picker.Item label="Coordenador" value="coordenador" />
                <Picker.Item label="Líder de Eventos" value="lider de eventos" />
                <Picker.Item label="Secretaria" value="secretaria" />
              </Picker>
            </View>

            <View style={estilos.pickerContainer}>
  <Picker selectedValue={naipe} onValueChange={setNaipe}>
    <Picker.Item label="Homem" value="homem" />
    <Picker.Item label="Mulher" value="mulher" />
    <Picker.Item label="Baixo" value="baixo" />
    <Picker.Item label="Tenor" value="tenor" />
    <Picker.Item label="Contralto" value="contralto" />
    <Picker.Item label="Soprano" value="soprano" />
  </Picker>
</View>

            {/* Campo de Data com máscara DD/MM/AAAA */}
            <View style={estilos.inputContainer}>
              <MaterialIcons name="calendar-today" size={24} color={cores.texto} style={estilos.icon} />
              <TextInput
                placeholder="Data de nascimento (DD/MM/AAAA)"
                placeholderTextColor="#999"
                value={dataNascimento}
                onChangeText={handleChangeData}
                keyboardType="numeric"
                maxLength={10}
                style={estilos.input}
              />
            </View>

            <View style={estilos.botoesModal}>
              {modoEdicao && (
                <TouchableOpacity style={[estilos.botao, estilos.botaoExcluir]} onPress={deletarUsuario}>
                  <Text style={estilos.textoBotao}>Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[estilos.botao, estilos.botaoSalvar]} onPress={salvarUsuario}>
                <Text style={estilos.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setModalVisivel(false)} style={estilos.botaoCancelar}>
              <Text style={estilos.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.Secundaria },
  conteudo: { padding: 20, marginBottom: 100 },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: cores.texto },
  listaMembros: { marginBottom: 20 },
  itemMembro: { padding: 15, borderRadius: 10, backgroundColor: cores.cardProdutos, marginBottom: 10 },
  nomeMembro: { fontWeight: 'bold', fontSize: 14, color: cores.texto },
  infoMembro: { fontSize: 12, color: '#555' },

  botaoFlutuante: { 
    position: 'absolute', 
    right: 20, 
    bottom: 70, 
    backgroundColor: '#000', 
    width: 55, 
    height: 55, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 5 
  },

  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalConteudo: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#f1f1f1', borderRadius: 8, padding: 10, marginBottom: 10, color: '#333' },
  pickerContainer: { backgroundColor: '#f1f1f1', borderRadius: 8, marginBottom: 10 },
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  botao: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  botaoSalvar: { backgroundColor: '#000' },
  botaoExcluir: { backgroundColor: '#d9534f' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  botaoCancelar: { marginTop: 10, alignItems: 'center' },
  textoCancelar: { color: '#555', textDecorationLine: 'underline' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10 },
  icon: { marginRight: 10 }
});
