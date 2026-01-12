# app_streamlit_presencas.py
import streamlit as st
import pandas as pd
import requests
import matplotlib.pyplot as plt

st.set_page_config(page_title="Controle de Presenças do Coro", layout="wide")

st.title("📊 Presenças do Coro")

# URLs da sua API
USUARIOS_URL = "https://coro-alpha.onrender.com/api/usuarios"
PRESENCAS_URL = "https://coro-alpha.onrender.com/api/presencas"

# 1️⃣ Buscar dados da API
usuarios = requests.get(USUARIOS_URL).json()
presencas = requests.get(PRESENCAS_URL).json()

# 2️⃣ Transformar em DataFrames
df_usuarios = pd.DataFrame(usuarios)
df_presencas = pd.DataFrame(presencas)

# Expandir os dados do usuário e do ensaio dentro das presenças
df_presencas["usuario_nome"] = df_presencas["Usuario"].apply(lambda x: x["nome"] if x else None)
df_presencas["ensaio_data"] = pd.to_datetime(df_presencas["Ensaio"].apply(lambda x: x["data"] if x else None))

# 3️⃣ Filtrar apenas membros
df_membros = df_usuarios[df_usuarios["tipo"] == "membro"]

# 4️⃣ Criar coluna de status simplificado: P = presença, F = ausência/falta_justificada
df_presencas["status_simples"] = df_presencas["status"].apply(lambda s: "P" if s=="presenca" else "F")

# 5️⃣ Ordenar por usuário e data
df_presencas = df_presencas.sort_values(by=["usuario_nome", "ensaio_data"])

# 6️⃣ Função para transformar sequência em blocos de texto
def blocos_sequencia_texto(seq):
    if not seq:
        return []
    resultado = []
    count = 1
    for i in range(1, len(seq)):
        if seq[i] == seq[i-1]:
            count += 1
        else:
            texto = f"{count} {'presença' if seq[i-1]=='P' else 'faltas'} consecutivas"
            resultado.append(texto)
            count = 1
    texto = f"{count} {'presença' if seq[-1]=='P' else 'faltas'} consecutivas"
    resultado.append(texto)
    return resultado

# 7️⃣ Criar sequência completa por usuário
sequencias = df_presencas.groupby("usuario_nome")["status_simples"].apply(lambda x: "".join(x)).reset_index()
sequencias["blocos"] = sequencias["status_simples"].apply(blocos_sequencia_texto)

# 8️⃣ Adicionar membros sem registros
sequencias = pd.merge(
    df_membros[["nome"]],
    sequencias,
    left_on="nome",
    right_on="usuario_nome",
    how="left"
)
sequencias["status_simples"] = sequencias["status_simples"].fillna("Sem registros")
sequencias["blocos"] = sequencias["blocos"].apply(lambda x: x if isinstance(x, list) else [])
sequencias["ultimo_consecutivo"] = sequencias["blocos"].apply(lambda x: x[-1] if x else "Sem registros")

# 9️⃣ Mostrar tabela
st.subheader("📋 Sequência de Presenças")
st.dataframe(sequencias[["nome","status_simples","blocos","ultimo_consecutivo"]])

# 1️⃣0️⃣ Seletor de membro para gráfico
membro_selecionado = st.selectbox("Escolha um membro para ver o gráfico de presenças:", sequencias["nome"].tolist())

if membro_selecionado:
    df_membro = df_presencas[df_presencas["usuario_nome"] == membro_selecionado].sort_values(by="ensaio_data")
    df_membro["valor"] = df_membro["status_simples"].apply(lambda x: 1 if x=="P" else 0)

    st.subheader(f"📈 Gráfico de Presenças: {membro_selecionado}")
    fig, ax = plt.subplots(figsize=(10,4))
    ax.plot(df_membro["ensaio_data"], df_membro["valor"], marker='o', linestyle='-', color='green')
    ax.set_ylim(-0.1, 1.1)
    ax.set_yticks([0,1])
    ax.set_yticklabels(["Falta", "Presença"])
    ax.set_xlabel("Data do Ensaio")
    ax.set_ylabel("Status")
    ax.grid(True)
    st.pyplot(fig)

st.markdown("---")
st.markdown("✅ Cada ponto no gráfico representa um ensaio. 1 = presença, 0 = falta.")
