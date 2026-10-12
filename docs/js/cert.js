/* Local certificate catalogue and accessible live filtering. */
const certificates = [
  { title: "Estruturas de Dados e Análise de Algoritmos", category: "Graduação — UNISUL", file: "Certificado (1).pdf" },
  { title: "Ambientes Computacionais e Conectividade", category: "Graduação — UNISUL", file: "Certificado (2).pdf" },
  { title: "Teoria da Computação e Compiladores", category: "Graduação — UNISUL", file: "Certificado-drive-2.pdf" },
  { title: "Ciência da Computação de Harvard no Brasil — Fundação Estudar", category: "Programação", file: "Certificado - Douglas Ramos Charqueiro-CS50 Havard.pdf" },
  { title: "Iniciação Científica — PIBIC/CNPq (UFSM)", category: "Pesquisa", file: "Certificado IC.pdf" },
  { title: "Técnico em Eletrotécnica — UFSM/CTISM", category: "Formação técnica", file: "Certificado Técnico em eletrotecnica.pdf" },
  { title: "Minicurso Introdução à Web — PET/CC (UFSM)", category: "Minicurso", file: "Certificado.pdf" },
  { title: "Oficina de ABNT para Trabalhos Acadêmicos", category: "Normas técnicas", file: "Certificado_ABNT_Douglas Ramos Charuqueiro.pdf" },
  { title: "Por dentro da Segurança Cibernética — SENAI", category: "Segurança cibernética", file: "Por_dentro_da_Segurança_Cibernética-Certificado_2956845.pdf" },
  { title: "Programação Básica em HTML — RECODE", category: "Desenvolvimento web", file: "Programação_Básica_em_HTML-Certificado_de_Conclusão_5372.pdf" }
];

const grid = document.getElementById("certificate-grid");
const search = document.getElementById("certificate-search");
const count = document.getElementById("certificate-count");
const emptyState = document.getElementById("empty-state");

function renderCertificates(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = certificates.filter(({ title, category, file }) =>
    `${title} ${category} ${file}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
  );

  grid.replaceChildren(...filtered.map(({ title, category, file }) => {
    const card = document.createElement("article");
    card.className = "certificate-card";
    const tag = document.createElement("span");
    tag.className = "certificate-type";
    tag.textContent = category;
    const heading = document.createElement("h3");
    heading.textContent = title;
    const fileLabel = document.createElement("p");
    fileLabel.textContent = file;
    const actions = document.createElement("div");
    actions.className = "certificate-actions";

    const open = document.createElement("a");
    open.href = `assets/pdf/drive-certificates/${encodeURIComponent(file)}`;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.textContent = "Visualizar";
    open.setAttribute("aria-label", `Visualizar ${title} em nova aba`);

    const download = document.createElement("a");
    download.href = open.href;
    download.download = file;
    download.textContent = "Baixar PDF";
    download.setAttribute("aria-label", `Baixar ${title}`);

    actions.append(open, download);
    card.append(tag, heading, fileLabel, actions);
    return card;
  }));
  count.textContent = `${filtered.length} de ${certificates.length} documentos`;
  emptyState.hidden = filtered.length !== 0;
}

search.addEventListener("input", () => renderCertificates(search.value));
renderCertificates();
