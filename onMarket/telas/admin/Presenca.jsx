// src/screens/RelatorioPresencasADM.js
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import cores from '../style/cores';
import MenuInferiorADM from '../navigation/navigationBar_admin';

export default function RelatorioPresencasADM({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('pessoas');
  const [membros, setMembros] = useState([]);
  const [ensaios, setEnsaios] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [ensaioSelecionado, setEnsaioSelecionado] = useState(null);
  const [presencasDoEnsaio, setPresencasDoEnsaio] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      const [resUsuarios, resEnsaios, resPresencas] = await Promise.all([
        axios.get('https://coro-alpha.onrender.com/api/usuarios'),
        axios.get('https://coro-alpha.onrender.com/api/ensaios'),
        axios.get('https://coro-alpha.onrender.com/api/presencas'),
      ]);
      setMembros(resUsuarios.data);
      setEnsaios(resEnsaios.data);
      setPresencas(resPresencas.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }

  function contarPresencas(usuarioId) {
    const usuarioPresencas = presencas.filter(p => p.usuarioId === usuarioId);
    const pres = usuarioPresencas.filter(p => p.status === 'presenca').length;
    const falt = usuarioPresencas.filter(p => p.status === 'ausencia').length;
    const just = usuarioPresencas.filter(p => p.status === 'falta_justificada').length;
    return { pres, falt, just };
  }

  async function abrirModalEnsaio(ensaio) {
    setEnsaioSelecionado(ensaio);
    try {
      const res = await axios.get(`https://coro-alpha.onrender.com/api/presencas/ensaio/${ensaio.id}`);
      const lista = membros.map(m => {
        const registro = res.data.find(r => r.usuarioId === m.id);
        return {
          ...m,
          status: registro ? registro.status : 'ausencia',
          presencaId: registro ? registro.id : null,
        };
      });
      setPresencasDoEnsaio(lista);
      setModalVisivel(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar presenças do ensaio.');
    }
  }

  async function salvarPresenca(usuarioId, status) {
    try {
      await axios.post(`https://coro-alpha.onrender.com/api/presencas`, {
        usuarioId,
        ensaioId: ensaioSelecionado.id,
        status,
      });
      setPresencasDoEnsaio(prev =>
        prev.map(u => (u.id === usuarioId ? { ...u, status } : u))
      );
      Alert.alert('Presença salva', `Status "${status}" registrado com sucesso!`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar presença.');
    }
  }

  function alterarStatus(usuarioId, novoStatus) {
    setPresencasDoEnsaio(prev =>
      prev.map(u => (u.id === usuarioId ? { ...u, status: novoStatus } : u))
    );
  }

  if (carregando) {
    return (
      <SafeAreaView style={[estilos.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2F7F6E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      {/* Abas */}
      <View style={estilos.abas}>
        <TouchableOpacity
          style={[estilos.aba, abaAtiva === 'pessoas' && estilos.abaAtiva]}
          onPress={() => setAbaAtiva('pessoas')}
        >
          <Text style={estilos.textoAba}>PESSOAS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.aba, abaAtiva === 'chamadas' && estilos.abaAtiva]}
          onPress={() => setAbaAtiva('chamadas')}
        >
          <Text style={estilos.textoAba}>CHAMADAS</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <ScrollView style={estilos.conteudo}>
        {abaAtiva === 'pessoas' ? (
          membros.map((m, i) => {
            const cont = contarPresencas(m.id);
            return (
              <View key={m.id} style={estilos.cardPessoa}>
                <Text style={estilos.nome}>{i + 1}. {m.nome}</Text>
                <Text>Presenças: {cont.pres}</Text>
                <Text>Faltas: {cont.falt}</Text>
                <Text>Justificadas: {cont.just}</Text>
              </View>
            );
          })
        ) : (
          <>
            <Text style={estilos.tituloSecao}>Lista de Ensaios</Text>
            {ensaios.map(e => {
              const presencasDoEnsaio = presencas.filter(p => p.ensaioId === e.id);
              const presentes = presencasDoEnsaio.filter(p => p.status === 'presenca').length;
              const ausentes = presencasDoEnsaio.filter(p => p.status === 'ausencia').length;
              const justificadas = presencasDoEnsaio.filter(p => p.status === 'falta_justificada').length;

              return (
                <TouchableOpacity
                  key={e.id}
                  style={estilos.cardEnsaio}
                  onPress={() => abrirModalEnsaio(e)}
                >
                  <Text style={estilos.tituloEnsaio}>{e.tema}</Text>
                  <Text>Data: {e.data}</Text>
                  <Text>Presentes: {presentes} | Ausentes: {ausentes} | Justificadas: {justificadas}</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Modal de presença */}
      <Modal visible={modalVisivel} animationType="slide">
        <SafeAreaView style={estilos.modalContainer}>
          <Text style={estilos.tituloModal}>
            {ensaioSelecionado ? `Ensaio: ${ensaioSelecionado.tema}` : ''}
          </Text>

          <ScrollView style={{ flex: 1 }}>
            {presencasDoEnsaio.map(u => (
              <View key={u.id} style={estilos.cardPresenca}>
                <Text style={{ flex: 1 }}>{u.nome}</Text>
                <TouchableOpacity
                  style={[
                    estilos.botaoStatus,
                    u.status === 'presenca' && { backgroundColor: '#28a745' },
                  ]}
                  onPress={() => alterarStatus(u.id, 'presenca')}
                >
                  <Text style={estilos.textoBotao}>P</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    estilos.botaoStatus,
                    u.status === 'ausencia' && { backgroundColor: '#dc3545' },
                  ]}
                  onPress={() => alterarStatus(u.id, 'ausencia')}
                >
                  <Text style={estilos.textoBotao}>F</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    estilos.botaoStatus,
                    u.status === 'falta_justificada' && { backgroundColor: '#ffc107' },
                  ]}
                  onPress={() => alterarStatus(u.id, 'falta_justificada')}
                >
                  <Text style={estilos.textoBotao}>J</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilos.botaoSalvar}
                  onPress={() => salvarPresenca(u.id, u.status)}
                >
                  <Text style={estilos.textoSalvar}>Salvar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={estilos.botaoFechar}
            onPress={() => setModalVisivel(false)}
          >
            <Text style={{ color: '#fff' }}>Fechar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  abas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2F7F6E',
    borderBottomWidth: 2,
    borderBottomColor: '#3C9C89',
  },
  aba: { flex: 1, padding: 10, alignItems: 'center' },
  abaAtiva: { backgroundColor: '#3C9C89' },
  textoAba: { color: '#fff', fontWeight: 'bold' },
  conteudo: { padding: 10 },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F7F6E',
    textAlign: 'center',
    marginVertical: 10,
  },
  cardPessoa: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2F7F6E',
  },
  cardEnsaio: {
    backgroundColor: '#EAF6F3',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2F7F6E',
  },
  tituloEnsaio: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F7F6E',
    marginBottom: 5,
  },
  modalContainer: { flex: 1, padding: 20 },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2F7F6E',
  },
  cardPresenca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  botaoStatus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  botaoSalvar: {
    backgroundColor: '#2F7F6E',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textoSalvar: { color: '#fff', fontWeight: 'bold' },
  botaoFechar: {
    backgroundColor: '#2F7F6E',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
});
