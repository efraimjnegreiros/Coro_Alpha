import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../style/cores";
import MenuInferiorCliente from "../navigation/navigationBar_cliente";

export default function EventoMembro() {
  const navigation = useNavigation();

  const [busca, setBusca] = useState("");
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [usuarioId, setUsuarioId] = useState(null);
  const [usuarioNome, setUsuarioNome] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const dados = await AsyncStorage.getItem("@usuario");
        if (dados) {
          const usuario = JSON.parse(dados);
          setUsuarioId(usuario.id);
          buscarNomeDoUsuario(usuario.id);
        }
      } catch (e) {
        console.log("Erro ao carregar usuário:", e);
      }
    }

    carregarUsuario();
    carregarEventos();
  }, []);

  async function buscarNomeDoUsuario(id) {
    try {
      const r = await axios.get("https://coro-alpha.onrender.com/api/usuarios");
      const usuarios = r.data;
      const encontrado = usuarios.find((u) => u.id === id);
      if (encontrado) setUsuarioNome(encontrado.nome);
    } catch (e) {
      console.log("Erro ao buscar nome do usuário:", e);
    }
  }

  async function carregarEventos() {
    try {
      const r = await axios.get("https://coro-alpha.onrender.com/api/eventos");
      setEventos(r.data);
    } catch (e) {
      console.log("Erro ao carregar eventos", e);
    } finally {
      setCarregando(false);
    }
  }

  if (usuarioId === null) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size={40} color="#000" />
        <Text style={{ marginTop: 10 }}>Carregando usuário...</Text>
      </View>
    );
  }

  const eventosFiltrados = eventos.filter((e) => {
    const b = busca.toLowerCase();
    return (
      (e.nomeEvento && e.nomeEvento.toLowerCase().includes(b)) ||
      (e.descricao && e.descricao.toLowerCase().includes(b)) ||
      (e.local && e.local.toLowerCase().includes(b)) ||
      e.dataEvento.includes(b)
    );
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const futuros = eventosFiltrados
    .filter((e) => new Date(e.dataEvento) >= hoje)
    .sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento));

  const passados = eventosFiltrados
    .filter((e) => new Date(e.dataEvento) < hoje)
    .sort((a, b) => new Date(b.dataEvento) - new Date(a.dataEvento));

  return (
    <SafeAreaView style={estilos.container}>

      <View style={estilos.cardSaudacao}>
        <Text style={estilos.txtOla}>Olá,</Text>
        <Text style={estilos.txtNome}>{usuarioNome || "Carregando..."}!</Text>
      </View>

      <View style={estilos.barraPesquisa}>
        <MaterialIcons name="search" size={26} color="#777" />
        <TextInput
          placeholder="Buscar evento..."
          placeholderTextColor="#999"
          style={estilos.inputPesquisa}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        
        <Text style={estilos.tituloSecao}>Eventos Futuros</Text>

        {carregando ? (
          <ActivityIndicator size={40} color="#000" />
        ) : futuros.length === 0 ? (
          <Text style={estilos.vazio}>Nenhum evento futuro encontrado.</Text>
        ) : (
          futuros.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={estilos.cardItem}
              onPress={() => navigation.navigate("DetalhesEvento", { evento: e })}
            >
              <Text style={estilos.tituloEnsaio}>{e.nomeEvento}</Text>

              {/* ⭐ NOVO ESTILO DESTACADO ⭐ */}
              <Text style={estilos.dataHoraDestaque}>
                📅 {e.dataEvento.split("-").reverse().join("/")} • ⏰ {e.horaEvento}
              </Text>

              <Text style={estilos.localEnsaio}>📍 {e.local}</Text>

              <Text style={estilos.statusEnsaio}>Status: Agendado</Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={estilos.tituloSecao}>Eventos Passados</Text>

        {passados.length === 0 ? (
          <Text style={estilos.vazio}>Nenhum evento passado encontrado.</Text>
        ) : (
          passados.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={estilos.cardItem}
              onPress={() => navigation.navigate("DetalhesEvento", { evento: e })}
            >
              <Text style={estilos.tituloEnsaio}>{e.nomeEvento}</Text>

              {/* ⭐ NOVO ESTILO DESTACADO ⭐ */}
              <Text style={estilos.dataHoraDestaque}>
                📅 {e.dataEvento.split("-").reverse().join("/")} • ⏰ {e.horaEvento}
              </Text>

              <Text style={estilos.localEnsaio}>📍 {e.local}</Text>

              <Text style={estilos.statusEnsaio}>Evento encerrado</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <MenuInferiorCliente navigation={navigation} currentScreen="EventoMembro" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.Primaria,
    paddingHorizontal: 15,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  cardSaudacao: {
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    elevation: 2,
  },
  txtOla: {
    fontSize: 16,
    color: "#555",
  },
  txtNome: {
    fontSize: 22,
    marginTop: 2,
    fontWeight: "bold",
    color: "#000",
  },

  barraPesquisa: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
    elevation: 2,
  },

  inputPesquisa: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 15,
  },

  conteudo: {
    marginTop: 10,
    marginBottom: 30,
  },

  vazio: {
    color: "#333",
    fontSize: 15,
    marginVertical: 10,
    fontStyle: "italic",
  },

  tituloSecao: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.texto,
    marginTop: 15,
    marginBottom: 10,
  },

  cardItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    elevation: 3,
  },

  tituloEnsaio: {
    fontSize: 17,
    fontWeight: "bold",
    color: cores.texto,
  },

  /* ⭐ NOVO ESTILO ⭐ */
  dataHoraDestaque: {
    fontSize: 14,
    fontWeight: "bold",
    color: cores.Secundaria,
    marginTop: 3,
  },

  localEnsaio: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },

  statusEnsaio: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
});
