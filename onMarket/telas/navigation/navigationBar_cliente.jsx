import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MenuInferiorCliente({ navigation, currentScreen }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(currentScreen || 'Inicio');

  // ÍCONES PNG
  const iconeInicio = require("../../imgs/home.png");
  const iconeEvento = require("../../imgs/evento.png");
  const iconePerfil = require("../../imgs/person.png");

  // APENAS AS DUAS ROTAS QUE VOCÊ PEDIU
  const menuItems = [
    { name: 'Início', icon: iconeInicio, route: 'Inicio' },
    { name: 'Eventos', icon: iconeEvento, route: 'EventoMembro' },
    { name: 'Perfil', icon: iconePerfil, route: 'Perfil' },
  
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

          <Text
            style={[
              estilos.textoItem,
              { color: selected === item.route ? "#FFFFFF" : "#A5A5A5" },
            ]}
          >
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

  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    opacity: 0.7,
  },

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
