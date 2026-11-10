const API = (rota) => fetch("/api" + rota).then((r) => {
  if (!r.ok) throw new Error("Erro " + r.status);
  return r.json();
});

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function montarLayout() {
  const links = [
    ["index.html", "Início"], ["inscricoes.html", "Inscrições"], ["trilhas.html", "Trilhas"],
    ["local.html", "Local"], ["programacao.html", "Programação"], ["quem-somos.html", "Quem Somos"]
  ];
  const atual = location.pathname.split("/").pop() || "index.html";
  document.body.insertAdjacentHTML("afterbegin", `
    <header class="topo">
      <a href="index.html" class="logo">&lt;Tech &amp; Code/&gt;</a>
      <button class="menu-btn" onclick="document.querySelector('nav').classList.toggle('aberto')">☰</button>
      <nav>${links.map(([h, t]) => `<a href="${h}" class="${atual === h ? "ativo" : ""}">${t}</a>`).join("")}</nav>
    </header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer>© 2026 Tech &amp; Code Summit · Projeto acadêmico de Desenvolvimento Web</footer>`);
}
document.addEventListener("DOMContentLoaded", montarLayout);
