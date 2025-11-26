import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MenuInferiorADM({ navigation, currentScreen }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(currentScreen || 'InicioADM');

  // ÍCONES PNG
  const iconeEnsaios = require("../../imgs/ensaio.png");
  const iconeMembros = require("../../imgs/home.png");
  const iconeRegistrar = require("../../imgs/how-to-reg.png");
  const iconePerfil = require("../../imgs/person.png");

  const menuItems = [
    { name: 'Ensaios', icon: iconeEnsaios, route: 'EnsaiosADM' },
    { name: 'Membros', icon: iconeMembros, route: 'InicioADM' },
    { name: 'Registrar Presença', icon: iconeRegistrar, route: 'RelatorioPresencasADM' },
    { name: 'Perfil', icon: iconePerfil, route: 'PerfilADM' },
  ];

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
          {/* FUNDO BRANCO DO ÍCONE */}
          <View style={[
            estilos.iconContainer, 
            selected === item.route && estilos.iconAtivo
          ]}>
            <Image
              source={item.icon}
              style={estilos.iconImg}
              resizeMode="contain"
            />
          </View>

          <Text style={[
            estilos.textoItem,
            { color: selected === item.route ? "#FFFFFF" : "#A5A5A5" }
          ]}>
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
    backgroundColor: '#2F7F6E',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // FUNDO BRANCO DOS ÍCONES
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    opacity: 0.7
  },

  // QUANDO ÍCONE ESTÁ ATIVO
  iconAtivo: {
    opacity: 1,
  },

  iconImg: {
    width: 24,
    height: 24,
  },

  textoItem: {
    fontSize: 10,
    textAlign: 'center',
  },
});
