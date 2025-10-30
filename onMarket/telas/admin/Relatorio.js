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
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // para gerar PDF
import MenuInferiorADM from '../navigation/navigationBar_admin';

export default function RelatorioADM({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('pessoas'); // para abas antigas
  const [tipoRelatorio, setTipoRelatorio] = useState('ensaio'); // 'ensaio' ou 'membro'
  const [membros, setMembros] = useState([]);
  const [ensaios, setEnsaios] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      const [resUsuarios, resEnsaios, resPresencas] = await Promise.all([
        axios.get('http://localhost:3000/api/usuarios'),
        axios.get('http://localhost:3000/api/ensaios'),
        axios.get('http://localhost:3000/api/presencas'),
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

  function gerarRelatorioPorEnsaio() {
    return ensaios.map(e => {
      const presencasDoEnsaio = presencas.filter(p => p.ensaioId === e.id);
      const presentes = presencasDoEnsaio.filter(p => p.status === 'presenca').length;
      const ausentes = presencasDoEnsaio.filter(p => p.status === 'ausencia').length;
      const justificadas = presencasDoEnsaio.filter(p => p.status === 'falta_justificada').length;
      return { ...e, presentes, ausentes, justificadas };
    });
  }

  function gerarRelatorioPorMembro() {
    return membros.map(m => {
      const historico = ensaios.map(e => {
        const registro = presencas.find(p => p.ensaioId === e.id && p.usuarioId === m.id);
        return {
          ensaio: e.tema,
          data: e.data,
          status: registro ? registro.status : 'ausencia',
        };
      });
      return { ...m, historico };
    });
  }

  async function gerarPDF() {
    let html = '<h1>Relatório de Presenças</h1>';
    if (tipoRelatorio === 'ensaio') {
      const rel = gerarRelatorioPorEnsaio();
      rel.forEach(r => {
        html += `<h3>${r.tema} - ${r.data}</h3>`;
        html += `<p>Presentes: ${r.presentes} | Ausentes: ${r.ausentes} | Justificadas: ${r.justificadas}</p>`;
      });
    } else {
      const rel = gerarRelatorioPorMembro();
      rel.forEach(m => {
        html += `<h3>${m.nome}</h3>`;
        m.historico.forEach(h => {
          html += `<p>${h.data} - ${h.ensaio}: ${h.status}</p>`;
        });
      });
    }

    try {
      const options = {
        html,
        fileName: `relatorio_presencas_${tipoRelatorio}`,
        directory: 'Documents',
      };
      const pdf = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF gerado', `Arquivo salvo em: ${pdf.filePath}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao gerar PDF.');
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={[estilos.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  const relatorio = tipoRelatorio === 'ensaio' ? gerarRelatorioPorEnsaio() : gerarRelatorioPorMembro();

  return (
    <SafeAreaView style={estilos.container}>
      {/* Seleção do tipo de relatório */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <TouchableOpacity
          style={[estilos.botaoTipo, tipoRelatorio === 'ensaio' && estilos.botaoAtivo]}
          onPress={() => setTipoRelatorio('ensaio')}
        >
          <Text style={estilos.textoBotaoTipo}>Por Ensaio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoTipo, tipoRelatorio === 'membro' && estilos.botaoAtivo]}
          onPress={() => setTipoRelatorio('membro')}
        >
          <Text style={estilos.textoBotaoTipo}>Por Membro</Text>
        </TouchableOpacity>
      </View>

      {/* Botão gerar PDF */}
      <TouchableOpacity style={estilos.botaoPDF} onPress={gerarPDF}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gerar PDF</Text>
      </TouchableOpacity>

      {/* Conteúdo */}
      <ScrollView style={estilos.conteudo}>
        {tipoRelatorio === 'ensaio' ? (
          relatorio.map(e => (
            <View key={e.id} style={estilos.cardEnsaio}>
              <Text style={estilos.nome}>{e.tema}</Text>
              <Text>Data: {e.data}</Text>
              <Text>Presentes: {e.presentes} | Ausentes: {e.ausentes} | Justificadas: {e.justificadas}</Text>
            </View>
          ))
        ) : (
          relatorio.map(m => (
            <View key={m.id} style={estilos.cardPessoa}>
              <Text style={estilos.nome}>{m.nome}</Text>
              {m.historico.map((h, i) => (
                <Text key={i}>{h.data} - {h.ensaio}: {h.status}</Text>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <MenuInferiorADM navigation={navigation} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  conteudo: { padding: 10 },
  cardPessoa: { backgroundColor: '#f9f9f9', padding: 10, marginVertical: 5, borderRadius: 10 },
  cardEnsaio: { backgroundColor: '#eef', padding: 10, marginVertical: 5, borderRadius: 10 },
  botaoTipo: { padding: 10, borderRadius: 5, backgroundColor: '#ccc' },
  botaoAtivo: { backgroundColor: '#007bff' },
  textoBotaoTipo: { color: '#fff', fontWeight: 'bold' },
  botaoPDF: {
    backgroundColor: '#28a745',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  nome: { fontWeight: 'bold', fontSize: 16 },
});
