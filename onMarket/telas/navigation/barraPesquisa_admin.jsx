import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import cores from '../style/cores';

export default function BarraPesquisaADM({ busca, setBusca }) {
  return (
    <View style={estilos.header}>
      <View style={estilos.caixaCabecalho}>
        <Avatar
          rounded
          size="large"
          source={require("../../image/coroAlpha.png")}
        />
        <View style={estilos.caixaBusca}>
          <TextInput
            placeholder="Pesquise aqui..."
            placeholderTextColor="#D1E2DE"
            style={estilos.input}
            value={busca}
            onChangeText={setBusca}
          />
          <MaterialIcons name="search" size={24} color="#D1E2DE" />
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  header: {
    backgroundColor: '#2F7F6E', // Mesmo verde do menu
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  caixaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caixaBusca: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3C9C89', // Verde mais claro para contraste
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF', // texto branco
    marginRight: 10,
  },
});
      