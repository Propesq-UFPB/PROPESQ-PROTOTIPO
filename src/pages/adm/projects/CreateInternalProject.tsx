// src/pages/adm/projects/CreateInternalProject.tsx
import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

type YesNo = "SIM" | "NAO"
type OdsLine = { id: string; ods: string }

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export default function CreateInternalProject() {
  // ===== Opções (mock) =====
  const unidadesOpts = useMemo(() => ["—", "CCEN", "CCHLA", "CT", "CCS", "Outra"], [])
  const centrosOpts = useMemo(() => ["—", "Centro A", "Centro B", "Centro C"], [])
  const editaisOpts = useMemo(() => ["—", "PIBIC 2024", "PIBITI 2024", "Edital Interno 2025"], [])

  const odsOpts = useMemo(
    () => [
      "ODS 1 — Erradicação da pobreza",
      "ODS 2 — Fome zero",
      "ODS 3 — Saúde e bem-estar",
      "ODS 4 — Educação de qualidade",
      "ODS 5 — Igualdade de gênero",
      "ODS 6 — Água potável e saneamento",
      "ODS 7 — Energia limpa e acessível",
      "ODS 8 — Trabalho decente e crescimento econômico",
      "ODS 9 — Indústria, inovação e infraestrutura",
      "ODS 10 — Redução das desigualdades",
      "ODS 11 — Cidades e comunidades sustentáveis",
      "ODS 12 — Consumo e produção responsáveis",
      "ODS 13 — Ação contra a mudança global do clima",
      "ODS 14 — Vida na água",
      "ODS 15 — Vida terrestre",
      "ODS 16 — Paz, justiça e instituições eficazes",
      "ODS 17 — Parcerias e meios de implementação",
    ],
    []
  )

  const grandeAreaOpts = useMemo(
    () => ["—", "Exatas", "Humanas", "Saúde", "Engenharias", "Sociais Aplicadas"],
    []
  )
  const areaOpts = useMemo(
    () => ["—", "Ciência da Computação", "Matemática", "Administração", "Direito", "Biologia"],
    []
  )
  const subareaOpts = useMemo(() => ["—", "Visão Computacional", "IA", "Redes", "Sistemas", "Bioinformática"], [])
  const especialidadeOpts = useMemo(() => ["—", "Aprendizado Profundo", "TinyML", "Otimização", "Processamento de Imagens"], [])

  const gruposPesquisaOpts = useMemo(() => ["—", "GP I", "GP II", "GP III"], [])
  const linhasPesquisaOpts = useMemo(() => ["—", "Linha A", "Linha B", "Linha C"], [])

  // ===== State do Form =====
  const [titulo, setTitulo] = useState("")
  const [title, setTitle] = useState("")
  const [unidade, setUnidade] = useState("—")
  const [centro, setCentro] = useState("—")
  const [edital, setEdital] = useState("—")
  const [palavrasChave, setPalavrasChave] = useState("")
  const [keywords, setKeywords] = useState("")
  const [email, setEmail] = useState("")

  // ODS (linhas adicionáveis)
  const [odsLines, setOdsLines] = useState<OdsLine[]>([{ id: uid("ods"), ods: "" }])

  // Área de conhecimento
  const [grandeArea, setGrandeArea] = useState("—")
  const [area, setArea] = useState("—")
  const [subarea, setSubarea] = useState("—")
  const [especialidade, setEspecialidade] = useState("—")

  // Grupo e linhas
  const [vinculadoGrupo, setVinculadoGrupo] = useState<YesNo>("NAO")
  const [grupoPesquisa, setGrupoPesquisa] = useState("—")
  const [linhaPesquisa, setLinhaPesquisa] = useState("—")

  // Comitê de ética
  const [temComiteEtica, setTemComiteEtica] = useState<YesNo>("NAO")
  const [numProtocolo, setNumProtocolo] = useState("")

  // ===== Handlers =====
  function addOdsLine() {
    setOdsLines(prev => [...prev, { id: uid("ods"), ods: "" }])
  }
  function updateOdsLine(id: string, ods: string) {
    setOdsLines(prev => prev.map(l => (l.id === id ? { ...l, ods } : l)))
  }
  function removeOdsLine(id: string) {
    setOdsLines(prev => (prev.length <= 1 ? prev : prev.filter(l => l.id !== id)))
  }

  function resetForm() {
    setTitulo("")
    setTitle("")
    setUnidade("—")
    setCentro("—")
    setEdital("—")
    setPalavrasChave("")
    setKeywords("")
    setEmail("")
    setOdsLines([{ id: uid("ods"), ods: "" }])
    setGrandeArea("—")
    setArea("—")
    setSubarea("—")
    setEspecialidade("—")
    setVinculadoGrupo("NAO")
    setGrupoPesquisa("—")
    setLinhaPesquisa("—")
    setTemComiteEtica("NAO")
    setNumProtocolo("")
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      tipoProjeto: "interno",
      titulo,
      title,
      unidade,
      centro,
      edital,
      palavrasChave,
      keywords,
      email,
      ods: odsLines.map(l => l.ods).filter(Boolean),
      areaConhecimento: { grandeArea, area, subarea, especialidade },
      grupo: {
        vinculadoGrupo,
        grupoPesquisa: vinculadoGrupo === "SIM" ? grupoPesquisa : null,
        linhaPesquisa: vinculadoGrupo === "SIM" ? linhaPesquisa : null,
      },
      comiteEtica: {
        temComiteEtica,
        numProtocolo: temComiteEtica === "SIM" ? numProtocolo : null,
      },
    }

    // eslint-disable-next-line no-console
    console.log("CreateInternalProject payload:", payload)
    alert("Projeto interno (UI) pronto para integração. Veja o payload no console.")
  }

  const requiredOk =
    titulo.trim() &&
    title.trim() &&
    unidade !== "—" &&
    centro !== "—" &&
    edital !== "—" &&
    palavrasChave.trim() &&
    keywords.trim() &&
    email.trim() &&
    grandeArea !== "—" &&
    area !== "—" &&
    subarea !== "—" &&
    especialidade !== "—" &&
    (vinculadoGrupo === "NAO" || (grupoPesquisa !== "—" && linhaPesquisa !== "—")) &&
    (temComiteEtica === "NAO" || numProtocolo.trim())

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Cadastrar Projeto Interno • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Cadastrar Projeto Interno</h1>
            <p className="text-sm text-neutral">
              Preencha os dados iniciais do projeto. Campos com <span className="text-red-600">*</span> são obrigatórios.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/adm/projetos"
              className="px-4 py-2 rounded-xl border border-neutral-light font-semibold text-primary hover:bg-neutral-light/60"
            >
              Voltar
            </Link>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Card: Dados iniciais */}
          <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card">
            <h2 className="text-lg font-bold text-primary mb-6">Informe os Dados Iniciais do Projeto</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo fixo */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">Tipo do Projeto</label>
                <input
                  value="Interno"
                  disabled
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
                />
              </div>

              <div />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Título <span className="text-red-600">*</span>
                </label>
                <input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Título do projeto (PT)"
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Project title (EN)"
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Unidade <span className="text-red-600">*</span>
                </label>
                <select
                  value={unidade}
                  onChange={e => setUnidade(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {unidadesOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Centro <span className="text-red-600">*</span>
                </label>
                <select
                  value={centro}
                  onChange={e => setCentro(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {centrosOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Edital de Pesquisa <span className="text-red-600">*</span>
                </label>
                <select
                  value={edital}
                  onChange={e => setEdital(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {editaisOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  E-mail <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="coordenador@ufpb.br"
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Palavras-Chave <span className="text-red-600">*</span>
                </label>
                <input
                  value={palavrasChave}
                  onChange={e => setPalavrasChave(e.target.value)}
                  placeholder="Ex.: visão computacional; energia; ..."
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                />
                <span className="text-xs text-neutral/70">Sugestão: separe por “;”.</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Keywords <span className="text-red-600">*</span>
                </label>
                <input
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="Ex.: computer vision; energy; ..."
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                />
                <span className="text-xs text-neutral/70">Suggestion: separate with “;”.</span>
              </div>
            </div>
          </div>

          {/* Card: ODS */}
          <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-primary">Objetivos do Desenvolvimento Sustentável</h2>
                <p className="text-sm text-neutral">Selecione um ou mais ODS vinculados ao projeto.</p>
              </div>

              <button
                type="button"
                onClick={addOdsLine}
                className="px-4 py-2 rounded-xl bg-accent text-primary font-semibold"
              >
                + Adicionar Linha
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {odsLines.map((l, idx) => (
                <div
                  key={l.id}
                  className="flex flex-col md:flex-row gap-3 md:items-center rounded-xl border border-neutral/20 p-4 bg-neutral-light/40"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-primary">ODS (seleção)</label>
                    <select
                      value={l.ods}
                      onChange={e => updateOdsLine(l.id, e.target.value)}
                      className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                    >
                      <option value="">Selecione</option>
                      {odsOpts.map(o => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => removeOdsLine(l.id)}
                      disabled={odsLines.length <= 1}
                      className="px-4 py-2 rounded-xl border border-neutral-light text-primary font-semibold disabled:opacity-50"
                      title={odsLines.length <= 1 ? "Mantenha pelo menos 1 linha" : "Remover linha"}
                    >
                      Remover
                    </button>
                    <span className="text-xs text-neutral/60 self-center w-10 text-right">#{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Área de conhecimento */}
          <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card">
            <h2 className="text-lg font-bold text-primary mb-6">Área de Conhecimento</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Grande Área <span className="text-red-600">*</span>
                </label>
                <select
                  value={grandeArea}
                  onChange={e => setGrandeArea(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {grandeAreaOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Área <span className="text-red-600">*</span>
                </label>
                <select
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {areaOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Subárea <span className="text-red-600">*</span>
                </label>
                <select
                  value={subarea}
                  onChange={e => setSubarea(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {subareaOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Especialidade <span className="text-red-600">*</span>
                </label>
                <select
                  value={especialidade}
                  onChange={e => setEspecialidade(e.target.value)}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm"
                >
                  {especialidadeOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card: Grupo e linhas */}
          <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card">
            <h2 className="text-lg font-bold text-primary mb-2">Grupo e Linhas de Pesquisa</h2>
            <p className="text-sm text-neutral mb-6">
              Este projeto está vinculado a algum grupo de pesquisa?
            </p>

            <div className="flex flex-wrap gap-6 items-center mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={vinculadoGrupo === "SIM"} onChange={() => setVinculadoGrupo("SIM")} />
                Sim
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={vinculadoGrupo === "NAO"} onChange={() => setVinculadoGrupo("NAO")} />
                Não
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Grupo de Pesquisa {vinculadoGrupo === "SIM" && <span className="text-red-600">*</span>}
                </label>
                <select
                  value={grupoPesquisa}
                  onChange={e => setGrupoPesquisa(e.target.value)}
                  disabled={vinculadoGrupo !== "SIM"}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
                >
                  {gruposPesquisaOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Linha de Pesquisa {vinculadoGrupo === "SIM" && <span className="text-red-600">*</span>}
                </label>
                <select
                  value={linhaPesquisa}
                  onChange={e => setLinhaPesquisa(e.target.value)}
                  disabled={vinculadoGrupo !== "SIM"}
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
                >
                  {linhasPesquisaOpts.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card: Comitê de Ética */}
          <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card">
            <h2 className="text-lg font-bold text-primary mb-2">Comitê de Ética</h2>
            <p className="text-sm text-neutral mb-6">
              Possui protocolo de pesquisa em Comitê de Ética?
            </p>

            <div className="flex flex-wrap gap-6 items-center mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={temComiteEtica === "SIM"} onChange={() => setTemComiteEtica("SIM")} />
                Sim
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={temComiteEtica === "NAO"} onChange={() => setTemComiteEtica("NAO")} />
                Não
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-primary">
                  Nº do Protocolo {temComiteEtica === "SIM" && <span className="text-red-600">*</span>}
                </label>
                <input
                  value={numProtocolo}
                  onChange={e => setNumProtocolo(e.target.value)}
                  disabled={temComiteEtica !== "SIM"}
                  placeholder="Ex.: 0000000.0000.0000"
                  className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
                />
                <span className="text-xs text-neutral/70">Obrigatório apenas se você marcou “Sim”.</span>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col md:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 text-base rounded-xl border border-neutral-light font-semibold text-primary hover:bg-neutral-light/60"
            >
              Limpar
            </button>

            <button
              type="submit"
              disabled={!requiredOk}
              className="px-6 py-3 text-base rounded-xl bg-primary text-white font-semibold disabled:opacity-60"
            >
              Salvar Projeto Interno
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
