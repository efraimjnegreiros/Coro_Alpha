import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MenuInferiorADM from '../navigation/navigationBar_admin';
import cores from '../style/cores';

export default function EventosADM() {
  const navigation = useNavigation();
  const [eventos, setEventos] = useState([]);
  const [buscaData, setBuscaData] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const [nomeEvento, setNomeEvento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [horaEvento, setHoraEvento] = useState('');
  const [horaSaida, setHoraSaida] = useState('');
  const [dataEvento, setDataEvento] = useState('');

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    try {
      setCarregando(true);
      const resp = await axios.get('https://coro-alpha.onrender.com/api/eventos');
      setEventos(resp.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os eventos.');
    } finally {
      setCarregando(false);
    }
  }

  // FILTRO POR DATA
  const eventosFiltrados = eventos.filter((e) =>
    e.dataEvento.includes(buscaData.split('/').reverse().join('-'))
  );

  function abrirModalCriar() {
    setNomeEvento('');
    setDescricao('');
    setLocal('');
    setHoraEvento('');
    setHoraSaida('');
    setDataEvento('');
    setModoEdicao(false);
    setModalVisivel(true);
  }

  function abrirModalEditar(evento) {
    setEventoSelecionado(evento);
    setNomeEvento(evento.nomeEvento);
    setDescricao(evento.descricao);
    setLocal(evento.local);

    setHoraEvento(evento.horaEvento);
    setHoraSaida(evento.horaSaidaIgreja);

    const [ano, mes, dia] = evento.dataEvento.split('-');
    setDataEvento(`${dia}/${mes}/${ano}`);
    setDataSelecionada(new Date(evento.dataEvento));

    setModoEdicao(true);
    setModalVisivel(true);
  }

  async function salvarEvento() {
    if (!nomeEvento || !descricao || !local || !horaEvento || !horaSaida || !dataEvento) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const [dia, mes, ano] = dataEvento.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;

    try {
      if (modoEdicao) {
        await axios.put(
          `https://coro-alpha.onrender.com/api/eventos/${eventoSelecionado.id}`,
          {
            nomeEvento,
            descricao,
            local,
            horaEvento,
            horaSaidaIgreja: horaSaida,
            dataEvento: dataISO,
          }
        );
        Alert.alert('Sucesso', 'Evento atualizado!');
      } else {
        await axios.post('https://coro-alpha.onrender.com/api/eventos', {
          nomeEvento,
          descricao,
          local,
          horaEvento,
          horaSaidaIgreja: horaSaida,
          dataEvento: dataISO,
        });
        Alert.alert('Sucesso', 'Evento criado!');
      }

      setModalVisivel(false);
      carregarEventos();
    } catch (error) {
      console.error(error.response || error.message);
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    }
  }

  async function deletarEvento() {
    try {
      await axios.delete(`https://coro-alpha.onrender.com/api/eventos/${eventoSelecionado.id}`);
      Alert.alert('Sucesso', 'Evento deletado!');
      setModalVisivel(false);
      carregarEventos();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível deletar o evento.');
    }
  }

  // Máscara da data
  const handleChangeData = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2 && cleaned.length <= 4)
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    else if (cleaned.length > 4)
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    setDataEvento(cleaned);
  };

  function onChangeData(event, selectedDate) {
    const currentDate = selectedDate || dataSelecionada;
    setMostrarCalendario(Platform.OS === 'ios');
    setDataSelecionada(currentDate);

    const dia = String(currentDate.getDate()).padStart(2, '0');
    const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
    const ano = currentDate.getFullYear();

    setDataEvento(`${dia}/${mes}/${ano}`);
  }

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <Text style={estilos.tituloSecao}>Eventos:</Text>

        {carregando ? (
          <Text>Carregando...</Text>
        ) : eventosFiltrados.length === 0 ? (
          <Text>Nenhum evento encontrado.</Text>
        ) : (
          <View style={estilos.lista}>
            {eventosFiltrados.map((evento) => (
              <TouchableOpacity
                key={evento.id}
                style={estilos.item}
                onPress={() => abrirModalEditar(evento)}
              >
                <Text style={estilos.nome}>{evento.nomeEvento}</Text>
                <Text style={estilos.info}>
                  {evento.dataEvento} • {evento.horaEvento}
                </Text>
                <Text style={estilos.info}>Local: {evento.local}</Text>
                <Text style={estilos.info}>Saída da igreja: {evento.horaSaidaIgreja}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* BUSCA */}
      <View style={estilos.caixaBusca}>
        <MaterialIcons name="search" size={24} color="gray" />
        <TextInput
          placeholder="Pesquise por data..."
          placeholderTextColor="#aaa"
          style={estilos.inputBusca}
          value={buscaData}
          onChangeText={setBuscaData}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* BOTÃO FLUTUANTE */}
      <TouchableOpacity style={estilos.botaoFlutuante} onPress={abrirModalCriar}>
        <Text style={{ fontSize: 32, color: '#000', marginTop: -2 }}>+</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={estilos.modalContainer}>
          <View style={estilos.modalConteudo}>
            <Text style={estilos.modalTitulo}>
              {modoEdicao ? 'Editar Evento' : 'Novo Evento'}
            </Text>

            <TextInput
              style={estilos.input}
              placeholder="Nome do evento"
              value={nomeEvento}
              onChangeText={setNomeEvento}
            />

            <TextInput
              style={estilos.input}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />

            <TextInput
              style={estilos.input}
              placeholder="Data (DD/MM/AAAA)"
              value={dataEvento}
              onChangeText={handleChangeData}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity
              onPress={() => setMostrarCalendario(true)}
              style={{ marginBottom: 10 }}
            >
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
              placeholder="Horário do evento (HH:MM)"
              value={horaEvento}
              onChangeText={setHoraEvento}
            />

            <TextInput
              style={estilos.input}
              placeholder="Horário de saída da igreja"
              value={horaSaida}
              onChangeText={setHoraSaida}
            />

            <TextInput
              style={estilos.input}
              placeholder="Local"
              value={local}
              onChangeText={setLocal}
            />

            {/* BOTÕES */}
            <View style={estilos.botoesModal}>
              {modoEdicao && (
                <TouchableOpacity
                  style={[estilos.botao, estilos.botaoExcluir]}
                  onPress={deletarEvento}
                >
                  <Text style={estilos.textoBotao}>Excluir</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[estilos.botao, estilos.botaoSalvar]}
                onPress={salvarEvento}
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
  botoesModal: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  botao: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  botaoSalvar: { backgroundColor: '#000' },
  botaoExcluir: { backgroundColor: '#d9534f' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  botaoCancelar: { marginTop: 10, alignItems: 'center' },
  textoCancelar: { color: '#555', textDecorationLine: 'underline' },
});
