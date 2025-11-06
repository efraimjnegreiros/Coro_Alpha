import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MenuInferiorADM({ navigation, currentScreen }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(currentScreen || 'InicioADM');

  // Ícones e rotas do menu
  const menuItems = [
    { name: 'Ensaios', icon: 'library-music', route: 'EnsaiosADM' },
    { name: 'Membros', icon: 'badge', route: 'InicioADM' },
    { name: 'Eventos', icon: 'event', route: 'RelatorioPresencasADM' },
    { name: 'Registrar Presença', icon: 'how-to-reg', route: 'RelatorioPresencasADM' },
    { name: 'Tesouraria', icon: 'account-balance-wallet', route: 'RelatorioADM' },
    { name: 'Perfil', icon: 'person', route: 'PerfilADM' },
  ];

  const corIcone = '#A5A5A5';
  const corIconeAtivo = '#FFFFFF';
  const corTexto = '#A5A5A5';
  const corTextoAtivo = '#FFFFFF';

  return (
    <View style={[estilos.menu, { paddingBottom: insets.bottom || 10 }]}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          onPress={() => {
            setSelected(item.route);
            navigation.navigate(item.route);
          }}
          style={estilos.item}
        >
          <MaterialIcons
            name={item.icon}
            size={28}
            color={selected === item.route ? corIconeAtivo : corIcone}
          />
          <Text style={[estilos.textoItem, { color: selected === item.route ? corTextoAtivo : corTexto }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2F7F6E', // Verde da logo
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoItem: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
