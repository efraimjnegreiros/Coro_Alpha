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

export default function Inicio() {
  const navigation = useNavigation();

  const [busca, setBusca] = useState("");
  const [ensaios, setEnsaios] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [usuarioId, setUsuarioId] = useState(null);
  const [usuarioNome, setUsuarioNome] = useState("");

  const [filtroPassados, setFiltroPassados] = useState("todos");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const dados = await AsyncStorage.getItem("@usuario");
        if (dados) {
          const usuario = JSON.parse(dados);
          setUsuarioId(usuario.id);

          // 🔥 BUSCAR NOME REAL NA API USANDO O ID
          buscarNomeDoUsuario(usuario.id);
        }
      } catch (e) {
        console.log("Erro ao carregar usuário:", e);
      }
    }

    carregarUsuario();
    carregarEnsaios();
    carregarPresencas();
  }, []);

  // 🔥 FUNÇÃO PARA BUSCAR NOME REAL DO USUÁRIO NA API
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

  async function carregarEnsaios() {
    try {
      const r = await axios.get("https://coro-alpha.onrender.com/api/ensaios");
      setEnsaios(r.data);
    } catch (e) {
      console.log("Erro ao carregar ensaios", e);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarPresencas() {
    try {
      const r = await axios.get("https://coro-alpha.onrender.com/api/presencas");
      setPresencas(r.data);
    } catch (e) {
      console.log("Erro ao carregar presenças", e);
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

  // 🔎 FILTRO DE BUSCA
  const ensaiosFiltrados = ensaios.filter((e) => {
    const b = busca.toLowerCase();
    return (
      e.descricao.toLowerCase().includes(b) ||
      e.data.includes(b) ||
      (e.local ? e.local.toLowerCase().includes(b) : false)
    );
  });

  // 📅 FUTUROS E PASSADOS
  const futuros = ensaiosFiltrados.filter((e) => new Date(e.data) >= new Date());
  const passados = ensaiosFiltrados.filter((e) => new Date(e.data) < new Date());

  // 🎯 RESUMO DO USUÁRIO (CORRIGIDO)
  const totalPresencas = presencas.filter(
    (p) => p.usuarioId === usuarioId && p.status === "presenca"
  ).length;

  const totalAusencias = presencas.filter(
    (p) => p.usuarioId === usuarioId && p.status === "ausencia"
  ).length;

  const totalJustificadas = presencas.filter(
    (p) => p.usuarioId === usuarioId && p.status === "falta_justificada"
  ).length;

  // 🔎 FILTRO DE PASSADOS POR STATUS DO USUÁRIO
  const passadosFiltrados = passados.filter((e) => {
    const registro = presencas.find(
      (p) => p.ensaioId === e.id && p.usuarioId === usuarioId
    );

    if (filtroPassados === "todos") return true;
    if (!registro) return false;

    return registro.status === filtroPassados;
  });

  return (
    <SafeAreaView style={estilos.container}>
      {/* 🌟 CARD DE SAUDAÇÃO */}
      <View style={estilos.cardSaudacao}>
        <Text style={estilos.txtOla}>Olá,</Text>
        <Text style={estilos.txtNome}>{usuarioNome || "Carregando..."}!</Text>
      </View>

      {/* 🔍 BARRA DE PESQUISA */}
      <View style={estilos.barraPesquisa}>
        <MaterialIcons name="search" size={26} color="#777" />
        <TextInput
          placeholder="Buscar ensaio..."
          placeholderTextColor="#999"
          style={estilos.inputPesquisa}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* 📊 CARD DE RESUMO */}
      <View style={estilos.cardResumo}>
        <Text style={estilos.tituloResumo}>Resumo de Participação</Text>

        <View style={estilos.rowResumo}>
          <Text style={estilos.itemResumo}>✔ Presenças: {totalPresencas}</Text>
          <Text style={estilos.itemResumo}>❌ Ausências: {totalAusencias}</Text>
          <Text style={estilos.itemResumo}>🟡 Justificadas: {totalJustificadas}</Text>
        </View>
      </View>

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        
        {/* 📅 FUTUROS */}
        <Text style={estilos.tituloSecao}>Ensaios Futuros</Text>

        {carregando ? (
          <ActivityIndicator size={40} color="#000" />
        ) : futuros.length === 0 ? (
          <Text style={estilos.vazio}>Nenhum ensaio futuro encontrado.</Text>
        ) : (
          futuros.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={estilos.cardItem}
              onPress={() => navigation.navigate("DetalhesEnsaio", { ensaio: e })}
            >
              <Text style={estilos.tituloEnsaio}>{e.descricao}</Text>
              <Text style={estilos.dataEnsaio}>📅 {e.data} • ⏰ {e.hora}</Text>
              <Text style={estilos.localEnsaio}>📍 {e.local}</Text>
              <Text style={estilos.statusEnsaio}>Status: Agendado</Text>
            </TouchableOpacity>
          ))
        )}

        {/* 📚 PASSADOS */}
        <Text style={estilos.tituloSecao}>Ensaios Passados</Text>

        {/* 🔎 FILTRO */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {["todos", "presenca", "ausencia", "falta_justificada"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                estilos.filtroBotao,
                filtroPassados === f && estilos.filtroAtivo,
              ]}
              onPress={() => setFiltroPassados(f)}
            >
              <Text
                style={[
                  estilos.filtroTexto,
                  filtroPassados === f && estilos.filtroTextoAtivo,
                ]}
              >
                {f === "todos"
                  ? "Todos"
                  : f === "presenca"
                  ? "Presenças"
                  : f === "ausencia"
                  ? "Ausências"
                  : "Justificados"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {passadosFiltrados.length === 0 ? (
          <Text style={estilos.vazio}>Nenhum registro encontrado.</Text>
        ) : (
          passadosFiltrados.map((e) => {
            const registro = presencas.find(
              (p) => p.ensaioId === e.id && p.usuarioId === usuarioId
            );

            let statusTexto = "Sem registro";
            if (registro?.status === "presenca") statusTexto = "✔ Presença";
            if (registro?.status === "ausencia") statusTexto = "❌ Ausência";
            if (registro?.status === "falta_justificada")
              statusTexto = "🟡 Justificada";

            return (
              <TouchableOpacity
                key={e.id}
                style={estilos.cardItem}
                onPress={() => navigation.navigate("DetalhesEnsaio", { ensaio: e })}
              >
                <Text style={estilos.tituloEnsaio}>{e.descricao}</Text>
                <Text style={estilos.dataEnsaio}>📅 {e.data} • ⏰ {e.hora}</Text>
                <Text style={estilos.localEnsaio}>📍 {e.local}</Text>
                <Text style={estilos.statusEnsaio}>Seu status: {statusTexto}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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

  /* 🌟 CARD DE SAUDAÇÃO */
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

  dataEnsaio: {
    fontSize: 14,
    color: "#444",
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

  /* RESUMO */
  cardResumo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },

  tituloResumo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },

  rowResumo: {
    flexDirection: "column",
    gap: 4,
  },

  itemResumo: {
    fontSize: 14,
    color: "#000000ff",
  },

  /* FILTRO */
  filtroBotao: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  filtroAtivo: {
    backgroundColor: cores.Secundaria,
    borderColor: cores.Secundaria,
  },

  filtroTexto: {
    fontSize: 14,
    color: "#000",
  },

  filtroTextoAtivo: {
    color: "#fff",
    fontWeight: "bold",
  },
});
