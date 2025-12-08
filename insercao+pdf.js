// import axios from "axios";
// import admin from "firebase-admin";
// import PDFDocument from "pdfkit";
// import { writeFileSync } from "fs";

// // ====== CONFIGURAR FIREBASE ADMIN DIRETAMENTE NO CÓDIGO ======
// const serviceAccount = {
//   "type": "service_account",
//   "project_id": "coro-6e7d9",
//   "private_key_id": "eda3fc43336dd5ecc11d4ae844fd69805e933664",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDH1cqdN4HCFqya\n45sKP6aqQ3eLeRDxzAj1ahKDmGlyFe7IfWTNaeqYws/kNPuquPBKCfikmSabuGmV\nPMYqKMj/ZnKvl77GmtKudQhu9pjJ/GN2D9EsSifrLzNHZXtQijP41sGfxEZ0+lLO\nTxf3kSIrPVjkZqFvnPzNiiP4wsA/FTAqeUkfHSRU1ezxjBTKBjf0ty0DWerDmRkB\nMCxKVWdl+e4R6zIyIt2IBB/x36zYCDvXHg3GPnp5OyhezB+tHuzbW9S2dBCWVUJM\n2wZ8Gjx0X8GeZmUawZU+lh6KcMdPW75DDaLsx/GbcvwYmP1wZz2O1iGqES4AlmM5\nikQdX8g/AgMBAAECggEADYRflSzZARjpifyVUyclDeVMY8nHpKNpg7guEmqvz0C+\nix84P1DHxpd+2m/fChhCYK+1+uRFIUljEu4udVGW7veuEESSafq0/4n5DRBvG1KQ\nI79EJdvKQXVK4axyn+sJQu674CO1pFn+WegttdhCWGxo4+IxT0xuKTUL49rAiEO3\nAUTWHsIe6IN8FnO6YqvQdBqq1BhP8SRzN863hX84UqXhw705DwoOA/I65gtZ3zTZ\nAEFn+89wMc0MEcY7hssoBJw3q6pNCSNi89PzvP/nPcpeEd36e4wf6nW4WIGiSD8J\ndDG5sOxa5RxdrHvPunFLsnp1WdGyaNgY5GQsP1K2KQKBgQDtKDC8hBy5f1mPVJVq\nT8YhVeewjky2YpJHxnScVEOEuppdx8m+ZnXtZhEOiwbN1PgW39yiIXrNyTi63qJ8\n47ootkSl8+vmSIXTzKFfOUkqnbDHhFk2/dDru8tKtf6iaW8ACz0PlddrKQ0nmQ3o\nTU/D6g90EHIr1xDUkl279lxcQwKBgQDXtnfwPtIfQxH1NQbJhfY4dz7jJe1/mWyq\nSruZ4bMSjPxT2TuRAFX3HsJWR7TIdTDRdIv10uGWjlP59K6dIDVOwVhOlhEplen9\npcRy0/W5568ohKceM6hzE++RHfYN68v1hyave8fSpfPJ8FsyV99kotyEWfqzPwhf\nj0Mh6JbiVQKBgQCuB3wcGmZpyQYTo+IxLXEbLUrjyMiKXjMx8HPJ9BvH3pdAkkd9\nLPsExo1luqe3i7yyLHxfjWnscOjsWEuskgAduAMQNLq7NiTek58nnYYPe8Ap6Pj+\n3areEeTQYlUFIZGO2rBoK3D09h7tG+eUvIb4IV5NsXPWr+9tzipysAp+uQKBgBie\nwuGwydq3lP0fqD6oA4o+UfcrBQhjQnvNO8w8bmvXm5UWXi4Wk7k40YV3ebLHbWL6\nol7UStscM4l729IjMvJiLuoJRrwwWByTJvDUMF+fieZd/ZT84GUCCX3OpZ7BIu5L\nFqdAwXXRaxnJTR9Z2C1sSS7x9iMvNo1xlH/yRAZhAoGBANtYBl8cvdKlkxiczZ4o\nz1EIUHneryxVVlgN+aK57jyotwdKezP0X+ELw786UvteyOQCrqLdyAnqhdYic7+P\n97PEHigizH4gRtcdLDOl0ReUfwhqFMndn6277Mo+CSVja0KAB9IX6vPRfdqOi9cL\ntQy02fZAMo4z+xX93QsAZdeh\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-fbsvc@coro-6e7d9.iam.gserviceaccount.com",
//   "client_id": "107232446424109475112",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40coro-6e7d9.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// // ============================================================

// async function atualizarUsuarios() {
//   try {
//     // 1️⃣ Buscar usuários da API
//     const response = await axios.get("https://coro-alpha.onrender.com/api/usuarios");
//     const usuarios = response.data;

//     // Filtrar apenas membros
//     const membros = usuarios.filter(u => u.tipo === "membro");

//     console.log(`🔍 Total de membros: ${membros.length}`);

//     const credenciaisGeradas = [];

//     for (const user of membros) {
//       // Criar email único (adiciona ID se necessário)
//       let emailPadrao = user.email;
//       if (!emailPadrao) {
//         emailPadrao = (
//           user.nome
//             .normalize("NFD")
//             .replace(/[\u0300-\u036f]/g, "")
//             .replace(/\s+/g, "")
//             .toLowerCase() +
//           user.id +
//           "@gmail.com"
//         );
//       }

//       // Senha
//       let senhaPadrao = user.senha;
//       if (!senhaPadrao) {
//         senhaPadrao = user.dataNascimento.replace(/-/g, "");
//       }

//       // Atualizar API apenas se não tiver email/senha
//       if (!user.email || !user.senha) {
//         try {
//           await axios.put(`https://coro-alpha.onrender.com/api/usuarios/${user.id}`, {
//             email: emailPadrao,
//             senha: senhaPadrao,
//           });
//           console.log(`✔️ API atualizada para ${user.nome}`);
//         } catch (err) {
//           console.log(`⚠️ Erro ao atualizar API ${user.nome}:`, err.response?.data || err.message);
//         }

//         // Criar/Atualizar no Firebase
//         try {
//           await admin.auth().createUser({
//             uid: String(user.id),
//             email: emailPadrao,
//             password: senhaPadrao,
//             displayName: user.nome,
//           });
//           console.log(`🔥 Firebase: Usuário criado ${user.nome}`);
//         } catch (err) {
//           if (err.errorInfo?.code === "auth/uid-already-exists") {
//             await admin.auth().updateUser(String(user.id), {
//               email: emailPadrao,
//               password: senhaPadrao,
//               displayName: user.nome,
//             });
//             console.log(`🔥 Firebase: Usuário atualizado ${user.nome}`);
//           } else {
//             console.log(`⚠️ Erro Firebase ${user.nome}:`, err.message);
//           }
//         }
//       }

//       credenciaisGeradas.push({ nome: user.nome, email: emailPadrao, senha: senhaPadrao });
//     }

//     // ✅ Gerar PDF com todos os membros
//     const doc = new PDFDocument();
//     const pdfPath = "./credenciais_membros.pdf";
//     const stream = doc.pipe(writeFileSync(pdfPath, doc));

//     doc.fontSize(18).text("Credenciais de Usuários Membros", { align: "center" });
//     doc.moveDown();

//     credenciaisGeradas.forEach((u, i) => {
//       doc.fontSize(12).text(`${i + 1}. Nome: ${u.nome}`);
//       doc.text(`   Email: ${u.email}`);
//       doc.text(`   Senha: ${u.senha}`);
//       doc.moveDown(0.5);
//     });

//     doc.end();
//     console.log(`\n🎉 PDF gerado: ${pdfPath}`);

//     console.log("\n🎉 Processo concluído!");
//   } catch (error) {
//     console.error("❌ Erro:", error.message);
//   }
// }

// atualizarUsuarios();

import axios from "axios";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

async function gerarPdfMembros() {
  try {
    // 1️⃣ Buscar todos os usuários da API
    const response = await axios.get("https://coro-alpha.onrender.com/api/usuarios");
    const usuarios = response.data;

    // 2️⃣ Filtrar apenas membros
    const membros = usuarios.filter(u => u.tipo === "membro");

    console.log(`🔍 Total de membros: ${membros.length}`);

    // 3️⃣ Criar PDF
    const pdfPath = "./membros_credenciais.pdf";
    const doc = new PDFDocument();
    const stream = createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(18).text("Credenciais de Membros", { align: "center" });
    doc.moveDown();

    membros.forEach((u, i) => {
      doc.fontSize(12).text(`${i + 1}. Nome: ${u.nome}`);
      doc.text(`   Email: ${u.email || "não cadastrado"}`);
      doc.text(`   Senha: ${u.senha || "não cadastrada"}`);
      doc.moveDown(0.5);
    });

    doc.end();

    await new Promise(resolve => stream.on("finish", resolve));

    console.log(`🎉 PDF gerado com sucesso: ${pdfPath}`);
  } catch (error) {
    console.error("❌ Erro ao gerar PDF:", error.message);
  }
}

gerarPdfMembros();
