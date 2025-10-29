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
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import cores from '../style/cores';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MenuInferiorADM from '../navigation/navigationBar_admin';

export default function EnsaiosADM() {
  const navigation = useNavigation();
  const [ensaios, setEnsaios] = useState([]);
  const [buscaData, setBuscaData] = useState(''); // pesquisa por data
  const [carregando, setCarregando] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [ensaioSelecionado, setEnsaioSelecionado] = useState(null);

  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');
  const [grupo, setGrupo] = useState('todos');

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  useEffect(() => {
    carregarEnsaios();
  }, []);

  async function carregarEnsaios() {
    try {
      setCarregando(true);
      const resposta = await axios.get('http://localhost:3000/api/ensaios');
      setEnsaios(resposta.data);
    } catch (error) {
      console.error('Erro ao carregar ensaios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os ensaios.');
    } finally {
      setCarregando(false);
    }
  }

  const ensaiosFiltrados = ensaios.filter((e) =>
    e.data.includes(buscaData.split('/').reverse().join('-'))
  );

  function abrirModalCriar() {
    setDescricao('');
    setData('');
    setHora('');
    setLocal('');
    setGrupo('todos');
    setModoEdicao(false);
    setModalVisivel(true);
  }

  function abrirModalEditar(ensaio) {
    setEnsaioSelecionado(ensaio);
    setDescricao(ensaio.descricao);
    const [ano, mes, dia] = ensaio.data.split('-');
    setData(`${dia}/${mes}/${ano}`);
    setDataSelecionada(new Date(ensaio.data));
    setHora(ensaio.hora);
    setLocal(ensaio.local);
    setGrupo(ensaio.grupo);
    setModoEdicao(true);
    setModalVisivel(true);
  }

  async function salvarEnsaio() {
    if (!descricao || !data || !hora || !local) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const [dia, mes, ano] = data.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;

    try {
      if (modoEdicao) {
        await axios.put(`http://localhost:3000/api/ensaios/${ensaioSelecionado.id}`, {
          descricao,
          data: dataISO,
          hora,
          local,
          grupo,
        });
        Alert.alert('Sucesso', 'Ensaio atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:3000/api/ensaios', {
          descricao,
          data: dataISO,
          hora,
          local,
          grupo,
        });
        Alert.alert('Sucesso', 'Ensaio criado com sucesso!');
      }
      setModalVisivel(false);
      carregarEnsaios();
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
      Alert.alert('Erro', 'Não foi possível salvar o ensaio.');
    }
  }

  async function deletarEnsaio() {
  if (!ensaioSelecionado || !ensaioSelecionado.id) {
    Alert.alert('Erro', 'Nenhum ensaio selecionado para deletar.');
    return;
  }

  try {
    const id = ensaioSelecionado.id;
    await axios.delete(`http://localhost:3000/api/ensaios/${id}`);
    Alert.alert('Sucesso', 'Ensaio deletado!');
    setModalVisivel(false);
    setEnsaioSelecionado(null);
    carregarEnsaios();
  } catch (error) {
    console.error('Erro ao deletar ensaio:', error.response || error.message);
    Alert.alert('Erro', 'Não foi possível deletar o ensaio.');
  }
}


  const handleChangeData = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    } else if (cleaned.length > 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    }
    setData(cleaned);
  };

  function onChangeData(event, selectedDate) {
    const currentDate = selectedDate || dataSelecionada;
    setMostrarCalendario(Platform.OS === 'ios');
    setDataSelecionada(currentDate);

    const dia = String(currentDate.getDate()).padStart(2, '0');
    const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
    const ano = currentDate.getFullYear();
    setData(`${dia}/${mes}/${ano}`);
  }

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.tituloSecao}>Ensaios:</Text>

        {carregando ? (
          <Text>Carregando ensaios...</Text>
        ) : ensaiosFiltrados.length === 0 ? (
          <Text>Nenhum ensaio encontrado.</Text>
        ) : (
          <View style={estilos.lista}>
            {ensaiosFiltrados.map((ensaio) => (
              <TouchableOpacity
                key={ensaio.id}
                style={estilos.item}
                onPress={() => abrirModalEditar(ensaio)}
              >
                <Text style={estilos.nome}>{ensaio.descricao}</Text>
                <Text style={estilos.info}>
                  {ensaio.data} • {ensaio.hora} • {ensaio.local}
                </Text>
                <Text style={estilos.info}>Grupo: {ensaio.grupo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Barra de pesquisa por data embaixo */}
      <View style={estilos.caixaBusca}>
        <MaterialIcons name="search" size={24} color="gray" />
        <TextInput
          placeholder="Pesquise por data (DD/MM/AAAA)..."
          placeholderTextColor="#aaa"
          style={estilos.inputBusca}
          value={buscaData}
          onChangeText={setBuscaData}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* Botão flutuante */}
      <TouchableOpacity style={estilos.botaoFlutuante} onPress={abrirModalCriar}>
        <MaterialIcons name="add" size={30} color="#000" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={estilos.modalContainer}>
          <View style={estilos.modalConteudo}>
            <Text style={estilos.modalTitulo}>
              {modoEdicao ? 'Editar Ensaio' : 'Novo Ensaio'}
            </Text>

            <TextInput
              style={estilos.input}
              placeholder="Descrição"
              placeholderTextColor="#aaa"
              value={descricao}
              onChangeText={setDescricao}
            />

            {/* Data digitável */}
            <TextInput
              style={estilos.input}
              placeholder="Data (DD/MM/AAAA)"
              placeholderTextColor="#aaa"
              value={data}
              onChangeText={handleChangeData}
              keyboardType="numeric"
              maxLength={10}
            />

            {/* Botão abrir calendário */}
            <TouchableOpacity onPress={() => setMostrarCalendario(true)} style={{marginBottom:10}}>
              <MaterialIcons name="calendar-today" size={24} color="#000" />
            </TouchableOpacity>

            {mostrarCalendario && (
              <DateTimePicker
                value={dataSelecionada}
                mode="date"
                display="default"
                onChange={onChangeData}
              />
            )}

            <TextInput
              style={estilos.input}
              placeholder="Hora (HH:MM)"
              placeholderTextColor="#aaa"
              value={hora}
              onChangeText={setHora}
            />
            <TextInput
              style={estilos.input}
              placeholder="Local"
              placeholderTextColor="#aaa"
              value={local}
              onChangeText={setLocal}
            />

            <View style={estilos.pickerContainer}>
              <Picker selectedValue={grupo} onValueChange={(itemValue) => setGrupo(itemValue)}>
                <Picker.Item label="Todos" value="todos" />
                <Picker.Item label="Homens" value="homens" />
                <Picker.Item label="Mulheres" value="mulheres" />
              </Picker>
            </View>

            <View style={estilos.botoesModal}>
              {modoEdicao && (
                <TouchableOpacity
                  style={[estilos.botao, estilos.botaoExcluir]}
                  onPress={deletarEnsaio}
                >
                  <Text style={estilos.textoBotao}>Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[estilos.botao, estilos.botaoSalvar]}
                onPress={salvarEnsaio}
              >
                <Text style={estilos.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisivel(false)}
              style={estilos.botaoCancelar}
            >
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
  lista: { marginBottom: 20 },
  item: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: cores.cardProdutos,
    marginBottom: 10,
  },
  nome: { fontWeight: 'bold', fontSize: 15, color: cores.texto },
  info: { fontSize: 12, color: '#777' },
  caixaBusca: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  inputBusca: { flex: 1, marginLeft: 10, color: '#333' },
  botaoFlutuante: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: '#fff',
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalConteudo: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 10,
  },
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  botao: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  botaoSalvar: { backgroundColor: '#000' },
  botaoExcluir: { backgroundColor: '#d9534f' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  botaoCancelar: { marginTop: 10, alignItems: 'center' },
  textoCancelar: { color: '#555', textDecorationLine: 'underline' },
});
