const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 2000;
const DB_PATH = path.join(__dirname, "data", "db.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Funções de manipulação do "banco de dados"
const lerDB = () => {
  const dados = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(dados);
};

const salvarDB = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// ---------- API ----------
app.get("/api/evento", (req, res) => {
  try {
    res.json(lerDB().evento);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler dados do evento." });
  }
});

app.get("/api/lotes", (req, res) => {
  try {
    res.json(lerDB().lotes);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler dados dos lotes." });
  }
});

app.get("/api/local", (req, res) => {
  try {
    res.json(lerDB().local);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler dados do local." });
  }
});

app.get("/api/equipe", (req, res) => {
  try {
    res.json(lerDB().equipe);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler dados da equipe." });
  }
});

app.get("/api/trilhas", (req, res) => {
  try {
    const resumo = lerDB().trilhas.map(({ id, nome, icone, resumo }) => ({ id, nome, icone, resumo }));
    res.json(resumo);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler as trilhas." });
  }
});

app.get("/api/trilhas/:id", (req, res) => {
  try {
    const trilha = lerDB().trilhas.find((t) => t.id === req.params.id);
    if (!trilha) return res.status(404).json({ erro: "Trilha não encontrada" });
    res.json(trilha);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler a trilha." });
  }
});

app.get("/api/programacao", (req, res) => {
  try {
    const { dia, tipo } = req.query;
    let prog = lerDB().programacao;
    if (dia) prog = prog.filter((p) => p.dia === dia);
    if (tipo) prog = prog.filter((p) => p.tipo === tipo);
    res.json(prog);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler a programação." });
  }
});

// Inscrição (pagamento simulado)
app.post("/api/inscricoes", (req, res) => {
  try {
    const { nome, email, cpf, lote } = req.body;
    
    // Validação básica
    if (!nome || !email || !cpf || !lote) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const db = lerDB();
    const loteObj = db.lotes.find((l) => l.id === lote && l.ativo);
    
    if (!loteObj) {
      return res.status(400).json({ erro: "Lote inválido ou encerrado." });
    }

    const inscricao = {
      protocolo: "TCS-" + Date.now().toString(36).toUpperCase(),
      nome, 
      email, 
      cpf, 
      lote,
      valor: loteObj.preco,
      status: "PAGO (simulado)",
      data: new Date().toISOString()
    };
    
    db.inscricoes.push(inscricao);
    salvarDB(db); // Salva fisicamente no db.json
    
    res.status(201).json(inscricao);

  } catch (erro) {
    console.error("Erro na inscrição:", erro);
    res.status(500).json({ erro: "Erro interno ao processar a inscrição." });
  }
});

// Tratamento para qualquer rota /api/ que não exista (Erro 404)
app.use("/api", (req, res) => res.status(404).json({ erro: "Rota da API não encontrada" }));

// Inicia o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));