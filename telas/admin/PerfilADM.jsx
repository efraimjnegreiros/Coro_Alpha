import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MenuInferiorADM from '../navigation/navigationBar_admin';
import cores from '../style/cores';

export default function PerfilADM({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const carregarUsuario = async () => {
        try {
          const usuarioStr = await AsyncStorage.getItem('@usuario');
          if (usuarioStr) {
            const usuarioObj = JSON.parse(usuarioStr);
            setUsuario(usuarioObj);
          } else {
            navigation.replace('Login');
          }
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
        }
      };

      carregarUsuario();
    }, [])
  );

  const logout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@usuario');
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const editarConta = () => {
    navigation.navigate('EditarConta', { usuario });
  };

  const excluirConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`https://on-markett-2.onrender.com/api/users/${usuario.id}`);
              await AsyncStorage.removeItem('@usuario');
              Alert.alert('Conta excluída', 'Sua conta foi removida com sucesso.');
              navigation.replace('Login');
            } catch (error) {
              console.error('Erro ao excluir conta:', error);
              Alert.alert('Erro', 'Não foi possível excluir a conta.');
            }
          },
        },
      ]
    );
  };

  const tiposHumanos = {
    membro: 'Membro',
    tesouraria: 'Tesouraria',
    lider: 'Líder',
    coordenador: 'Coordenador',
    'lider de eventos': 'Líder de Eventos',
    secretaria: 'Secretaria'
  };

  const naipesHumanos = {
    homem: 'Homem',
    mulher: 'Mulher'
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.conteudoCentralizado}>
        <View style={styles.card}>
          <Text style={styles.nomeUsuario}>{usuario.nome}</Text>

          <View style={styles.secao}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.valor}>{usuario.email || '-'}</Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.label}>Tipo de Conta</Text>
            <Text style={styles.valor}>{tiposHumanos[usuario.tipo]}</Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.label}>Nascimento</Text>
            <Text style={styles.valor}>
              {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <View style={styles.secao}>
            <Text style={styles.label}>Naipe</Text>
            <Text style={styles.valor}>{naipesHumanos[usuario.naipe]}</Text>
          </View>

          <TouchableOpacity style={styles.botao} onPress={editarConta}>
            <Text style={styles.textoBotao}>Editar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, styles.botaoExcluir]} onPress={excluirConta}>
            <Text style={styles.textoBotao}>Excluir Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, styles.botaoSair]} onPress={logout}>
            <Text style={styles.textoBotao}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuInferior}>
        <MenuInferiorADM navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.Secundaria, paddingHorizontal: 20 },
  conteudoCentralizado: { flex: 1, justifyContent: 'center', paddingBottom: 80 },
  card: {
    backgroundColor: cores.cardProdutos,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  nomeUsuario: { fontSize: 22, fontWeight: 'bold', color: cores.texto },
  secao: { width: '100%', marginTop: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  label: { fontSize: 14, color: '#666' },
  valor: { fontSize: 16, fontWeight: '600', color: cores.texto, marginTop: 3 },
  botao: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: cores.botaoEditar,
    marginTop: 15,
    alignItems: 'center',
  },
  botaoExcluir: { backgroundColor: cores.botaoDeletar },
  botaoSair: { backgroundColor: cores.botaoSair },
  textoBotao: { color: cores.textoClaro, fontSize: 16, fontWeight: 'bold' },
  texto: { color: cores.texto, fontSize: 16, textAlign: 'center' },
  menuInferior: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
