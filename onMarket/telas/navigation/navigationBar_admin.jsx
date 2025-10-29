import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import cores from '../style/cores'; // Ajuste o caminho se necessário

export default function MenuInferiorADM({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[estilos.menu, { paddingBottom: insets.bottom || 10 }]}>
      <TouchableOpacity onPress={() => navigation.navigate('EnsaiosADM')}>
        <MaterialIcons name="library-music" size={28} color={cores.Secundaria} />
        <Text style={estilos.textoItem}>Ensaios</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('InicioADM')}>
        <MaterialIcons name="badge" size={28} color={cores.Secundaria} />
        <Text style={estilos.textoItem}>Membros</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Eventos')}>
        <MaterialIcons name="event" size={28} color={cores.Secundaria} />
        <Text style={estilos.textoItem}>Eventos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Tesouraria')}>
        <MaterialIcons name="account-balance-wallet" size={28} color={cores.Secundaria} />
        <Text style={estilos.textoItem}>Tesouraria</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('PerfilADM')}>
        <MaterialIcons name="person" size={28} color={cores.Secundaria} />
        <Text style={estilos.textoItem}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: cores.Principal,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textoItem: {
    color: cores.Secundaria,
    fontSize: 10,
    textAlign: 'center',
  },
});
