import streamlit as st
import pandas as pd
import requests
import matplotlib.pyplot as plt

# ===============================
# CONFIG STREAMLIT
# ===============================
st.set_page_config(
    page_title="Dashboard do Coro",
    layout="wide"
)

st.title("🎶 Dashboard de Presenças do Coro")

# ===============================
# URLs DA API
# ===============================
PRESENCAS_URL = "https://coro-alpha.onrender.com/api/presencas"
USUARIOS_URL = "https://coro-alpha.onrender.com/api/usuarios"

# ===============================
# LOAD DATA
# ===============================
@st.cache_data
def carregar_dados():
    presencas = requests.get(PRESENCAS_URL).json()
    usuarios = requests.get(USUARIOS_URL).json()
    return presencas, usuarios

presencas, usuarios = carregar_dados()

df = pd.json_normalize(presencas)

# ===============================
# TRATAMENTO
# ===============================
df["data"] = pd.to_datetime(df["Ensaio.data"])
df["mes"] = df["data"].dt.to_period("M").astype(str)
df["dia_semana"] = df["data"].dt.day_name()
df["hora"] = df["Ensaio.hora"].str[:2].astype(int)
df["presente"] = df["status"] == "presenca"

plt.rcParams["figure.figsize"] = (10, 4)

# FUNÇÃO PADRÃO DE GRÁFICO
def grafico(titulo):
    st.subheader(titulo)
    st.pyplot(plt.gcf())
    plt.clf()
    st.divider()

# ===============================
# 1️⃣ Evolução da presença
# ===============================
df.groupby("data")["presente"].sum().plot(marker="o")
grafico("1️⃣ Evolução da Presença por Ensaio")

# ===============================
# 2️⃣ Taxa de presença por ensaio
# ===============================
(df.groupby("data")["presente"].mean() * 100).plot(marker="o")
grafico("2️⃣ Taxa de Presença por Ensaio (%)")

# ===============================
# 3️⃣ Presença média mensal
# ===============================
(df.groupby("mes")["presente"].mean() * 100).plot(marker="o")
grafico("3️⃣ Presença Média Mensal (%)")

# ===============================
# 4️⃣ Presença individual (seletor)
# ===============================
st.subheader("4️⃣ Presença Individual por Membro")
membro = st.selectbox(
    "Escolha um membro",
    sorted(df["Usuario.nome"].dropna().unique())
)

df[df["Usuario.nome"] == membro].set_index("data")["presente"].astype(int).plot(marker="o")
st.pyplot(plt.gcf())
plt.clf()
st.divider()

# ===============================
# 5️⃣ Top 10 presenças
# ===============================
df.groupby("Usuario.nome")["presente"].sum().sort_values(ascending=False).head(10).plot(kind="barh")
grafico("5️⃣ Top 10 – Presenças Totais")

# ===============================
# 6️⃣ Top 10 ausências
# ===============================
df.groupby("Usuario.nome")["presente"].apply(lambda x: (~x).sum()).sort_values(ascending=False).head(10).plot(kind="barh")
grafico("6️⃣ Top 10 – Ausências")

# ===============================
# 7️⃣ Presença x ausência por ensaio
# ===============================
df.pivot_table(
    index="data",
    columns="status",
    values="usuarioId",
    aggfunc="count"
).plot(stacked=True)
grafico("7️⃣ Presença x Ausência por Ensaio")

# ===============================
# 8️⃣ Presença por dia da semana
# ===============================
df.groupby("dia_semana")["presente"].mean().plot(kind="bar")
grafico("8️⃣ Presença Média por Dia da Semana")

# ===============================
# 9️⃣ Presença por horário
# ===============================
df.groupby("hora")["presente"].mean().plot(kind="bar")
grafico("9️⃣ Presença Média por Horário")

# ===============================
# 🔟 Ranking de assiduidade
# ===============================
(df.groupby("Usuario.nome")["presente"].mean() * 100).sort_values(ascending=False).head(10).plot(kind="barh")
grafico("🔟 Ranking de Assiduidade (%)")

# ===============================
# 1️⃣1️⃣ Presença por tipo de ensaio
# ===============================
df.groupby("Ensaio.descricao")["presente"].mean().plot(kind="bar")
grafico("1️⃣1️⃣ Presença por Tipo de Ensaio")

# ===============================
# 1️⃣2️⃣ Esperado x Presença real
# ===============================
df.groupby("data")["usuarioId"].count().plot(label="Esperado")
df.groupby("data")["presente"].sum().plot(label="Presentes")
plt.legend()
grafico("1️⃣2️⃣ Esperado x Presença Real")

# ===============================
# 1️⃣3️⃣ Alerta – menor frequência
# ===============================
df.groupby("Usuario.nome")["presente"].mean().sort_values().head(10).plot(kind="barh")
grafico("1️⃣3️⃣ Alerta – Menor Frequência Média")

# ===============================
# 1️⃣4️⃣ Frequência de ausências
# ===============================
df[df["status"] == "ausencia"].groupby("Usuario.nome").size().sort_values().head(10).plot(kind="barh")
grafico("1️⃣4️⃣ Frequência de Ausências")

# ===============================
# 1️⃣5️⃣ Mural de fidelidade
# ===============================
fidelidade = df.groupby("Usuario.nome")["presente"].mean()
fidelidade[fidelidade == 1].plot(kind="bar")
grafico("1️⃣5️⃣ Mural de Fidelidade (100% Presença)")
