// src/pages/Projects.tsx
import React, { useMemo, useState } from "react"
import Table from "@/components/Table"
import { projetos } from "@/mock/data"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  MoreVertical,
  Eye,
  Pencil,
  Printer,
  Send,
  BadgeCheck,
  Trash2,
} from "lucide-react"

/* ================= TIPOS ================= */

type RoleType = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"

type Projeto = {
  id: string | number
  titulo: string
  centro: string
  area: string
  status: string
  prazo: string
  tipo?: "interno" | "externo"
  ano?: number | string
  pesquisador?: string
  unidade?: string
  objetivos?: string
  linhaPesquisa?: string
  areaConhecimento?: string
  grupoPesquisa?: string
  agencia?: string
  edital?: string
  situacao?: string
  categoria?: string
  relatorioFinal?: "submetido" | "nao_submetido"

  // extras (se existir no futuro)
  codigo?: string // equivalente ao "code" da página 1
  dataCadastro?: string
  dataInicio?: string
  dataFim?: string
}

/* ================= UTIL ================= */

function getCurrentRole(): RoleType {
  if (typeof window !== "undefined" && (window as any).__ROLE__) {
    return String((window as any).__ROLE__).toUpperCase() as RoleType
  }
  const fromLS = typeof window !== "undefined" ? localStorage.getItem("role") : null
  const normalized = (fromLS || "DISCENTE").toUpperCase()
  return ["DISCENTE", "COORDENADOR", "ADMINISTRADOR"].includes(normalized)
    ? (normalized as RoleType)
    : "DISCENTE"
}

const statusClass = (status: string) => {
  const s = status?.toLowerCase?.() || ""
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (s.includes("pend") || s.includes("anál") || s.includes("analise"))
    return "bg-amber-100 text-amber-800"
  if (s.includes("reprov") || s.includes("indefer")) return "bg-red-100 text-red-800"
  return "bg-neutral-light text-neutral"
}

const truncate = (txt: string, n = 70) => (txt?.length > n ? `${txt.slice(0, n)}…` : txt || "—")

function normalize(s: string) {
  return (s || "").trim().toLowerCase()
}

function isSameDayOrAfter(a: string, b: string) {
  // a >= b (YYYY-MM-DD)
  return a >= b
}
function isSameDayOrBefore(a: string, b: string) {
  // a <= b (YYYY-MM-DD)
  return a <= b
}

/* ================= UI AUX ================= */

function KebabActions({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    setPos({
      top: r.bottom + 8,
      left: Math.max(12, r.right - 224),
    })
    setOpen((v) => !v)
  }

  const close = () => setOpen(false)

  const Item = ({
    to,
    label,
    icon,
    danger,
  }: {
    to: string
    label: string
    icon: React.ReactNode
    danger?: boolean
  }) => (
    <Link
      to={to}
      onClick={close}
      className={[
        "flex items-center gap-2 px-3 py-2 rounded-lg",
        "text-[12px] leading-4",
        danger ? "text-red-700 hover:bg-red-50" : "text-primary hover:bg-neutral-light/60",
      ].join(" ")}
    >
      <span className={danger ? "text-red-700" : "text-neutral/70"}>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )

  return (
    <div className="flex items-center justify-end gap-2 bg-white">
      <div className="hidden lg:flex items-center gap-1">
        <Link
          to={`/adm/projetos/${id}`}
          className="h-8 px-2 rounded-lg border border-neutral-light text-[12px] font-semibold text-primary hover:bg-neutral-light/60 inline-flex items-center gap-1"
          title="Visualizar"
        >
          <Eye size={14} />
          Ver
        </Link>

        <Link
          to={`/adm/projetos/${id}/editar`}
          className="h-8 px-2 rounded-lg border border-neutral-light text-[12px] font-semibold text-primary hover:bg-neutral-light/60 inline-flex items-center gap-1"
          title="Editar"
        >
          <Pencil size={14} />
          Editar
        </Link>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="h-8 w-8 rounded-lg border border-neutral-light hover:bg-neutral-light/60 grid place-items-center"
        aria-label="Mais ações"
        aria-expanded={open}
      >
        <MoreVertical size={16} className="text-neutral/70" />
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-[60] cursor-default" onClick={close} aria-hidden="true" />
          <div
            className="fixed z-[70] w-56 rounded-xl border border-neutral-light bg-white shadow-card overflow-hidden"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="px-3 py-2 text-[11px] text-neutral/70 border-b border-neutral-light">
              Ações do projeto
            </div>

            <div className="p-1">
              <Item to={`/adm/projetos/${id}`} label="Visualizar" icon={<Eye size={14} />} />
              <Item to={`/adm/projetos/${id}/editar`} label="Editar" icon={<Pencil size={14} />} />

              <div className="h-px bg-neutral-light my-1" />

              <Item to={`/adm/projetos/${id}/imprimir`} label="Imprimir" icon={<Printer size={14} />} />
              <Item to={`/adm/projetos/${id}/relatorio-anual`} label="Enviar relatório" icon={<Send size={14} />} />
              <Item to={`/adm/projetos/${id}/declaracao`} label="Emitir declaração" icon={<BadgeCheck size={14} />} />

              <div className="h-px bg-neutral-light my-1" />

              <Item to={`/adm/projetos/${id}/remover`} label="Remover" icon={<Trash2 size={14} />} danger />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ================= COMPONENT ================= */

export default function Projects() {
  const role = getCurrentRole()
  const isAdmin = role === "ADMINISTRADOR"

  const [advancedOpen, setAdvancedOpen] = useState(true)

  // -------- Busca rápida
  const [q, setQ] = useState("")


  // FILTROS DA PÁGINA 1 
  // valores
  const [tipoP1, setTipoP1] = useState<"interno" | "externo">("externo")
  const [codigo, setCodigo] = useState("")
  const [ano, setAno] = useState("")
  const [pesquisador, setPesquisador] = useState("")
  const [centroUnidade, setCentroUnidade] = useState("")
  const [titulo, setTitulo] = useState("")
  const [objetivos, setObjetivos] = useState("")
  const [linhaPesquisa, setLinhaPesquisa] = useState("")
  const [areaConhecimento, setAreaConhecimento] = useState("")
  const [grupoPesquisa, setGrupoPesquisa] = useState("")
  const [agenciaFinanciadora, setAgenciaFinanciadora] = useState("")
  const [edital, setEdital] = useState("")
  const [situacaoProjeto, setSituacaoProjeto] = useState("")
  const [categoriaProjeto, setCategoriaProjeto] = useState("")
  const [relatorioFinal, setRelatorioFinal] = useState<"submetido" | "nao_submetido">("nao_submetido")

  // ativadores
  const [useTipo, setUseTipo] = useState(false)
  const [useCodigo, setUseCodigo] = useState(false)
  const [useAno, setUseAno] = useState(false)
  const [usePesquisador, setUsePesquisador] = useState(false)
  const [useCentroUnidade, setUseCentroUnidade] = useState(false)
  const [useTitulo, setUseTitulo] = useState(false)
  const [useObjetivos, setUseObjetivos] = useState(false)
  const [useLinhaPesquisa, setUseLinhaPesquisa] = useState(false)
  const [useAreaConhecimento, setUseAreaConhecimento] = useState(false)
  const [useGrupoPesquisa, setUseGrupoPesquisa] = useState(false)
  const [useAgencia, setUseAgencia] = useState(false)
  const [useEdital, setUseEdital] = useState(false)
  const [useSituacao, setUseSituacao] = useState(false)
  const [useCategoria, setUseCategoria] = useState(false)
  const [useRelatorioFinal, setUseRelatorioFinal] = useState(false)
  const [periodoIni, setPeriodoIni] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")

  const opts = useMemo(() => {
    const rows = projetos as Projeto[]

    const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)))
    const sort = (arr: string[]) => uniq(arr).sort((a, b) => a.localeCompare(b))

    const centroUnidadeOpts = sort(
      rows.map((p) => (p.centro || p.unidade || "").trim()).filter(Boolean)
    )

    const areaConhecimentoOpts = sort(rows.map((p) => (p.areaConhecimento || "").trim()).filter(Boolean))
    const grupoPesquisaOpts = sort(rows.map((p) => (p.grupoPesquisa || "").trim()).filter(Boolean))
    const agenciaOpts = sort(rows.map((p) => (p.agencia || "").trim()).filter(Boolean))
    const editalOpts = sort(rows.map((p) => (p.edital || "").trim()).filter(Boolean))
    const situacaoOpts = sort(rows.map((p) => (p.situacao || p.status || "").trim()).filter(Boolean))
    const categoriaOpts = sort(rows.map((p) => (p.categoria || "").trim()).filter(Boolean))

    return {
      centroUnidadeOpts,
      areaConhecimentoOpts,
      grupoPesquisaOpts,
      agenciaOpts,
      editalOpts,
      situacaoOpts,
      categoriaOpts,
    }
  }, [])

  // FILTRAGEM 
  const filtered = useMemo(() => {
    const nq = normalize(q)

    const nCodigo = normalize(codigo)
    const nAno = normalize(ano)
    const nPesq = normalize(pesquisador)
    const nCentro = normalize(centroUnidade)
    const nTitulo = normalize(titulo)
    const nObj = normalize(objetivos)
    const nLinha = normalize(linhaPesquisa)
    const nArea = normalize(areaConhecimento)
    const nGrupo = normalize(grupoPesquisa)
    const nAg = normalize(agenciaFinanciadora)
    const nEdital = normalize(edital)
    const nSit = normalize(situacaoProjeto)
    const nCat = normalize(categoriaProjeto)

    return (projetos as Projeto[]).filter((p) => {
      const title = normalize(p.titulo)
      const coord = normalize(p.pesquisador || "")
      const st = normalize(p.status || "")
      const sit = normalize(p.situacao || p.status || "")
      const t = (p.tipo || "").toLowerCase()

      // Busca rápida (título OU coordenador OU código/id)
      if (nq) {
        const codeBase = normalize(String(p.id)) + " " + normalize(p.codigo || "")
        const hit = title.includes(nq) || coord.includes(nq) || codeBase.includes(nq)
        if (!hit) return false
      }

      // ===== filtros ativáveis =====
      if (useTipo && t !== tipoP1) return false

      if (useCodigo) {
        const codeBase = normalize(String(p.id)) + " " + normalize(p.codigo || "")
        if (!codeBase.includes(nCodigo)) return false
      }

      if (useAno) {
        const a = normalize(String(p.ano ?? ""))
        if (!a || a !== nAno) return false
      }

      if (usePesquisador && !coord.includes(nPesq)) return false

      if (useCentroUnidade) {
        const cu = normalize((p.centro || p.unidade || "").trim())
        if (!cu.includes(nCentro)) return false
      }

      if (useTitulo && !title.includes(nTitulo)) return false

      if (useObjetivos && !normalize(p.objetivos || "").includes(nObj)) return false

      if (useLinhaPesquisa && !normalize(p.linhaPesquisa || "").includes(nLinha)) return false

      if (useAreaConhecimento) {
        if (normalize(p.areaConhecimento || "") !== nArea) return false
      }

      if (useGrupoPesquisa) {
        if (normalize(p.grupoPesquisa || "") !== nGrupo) return false
      }

      if (useAgencia) {
        if (normalize(p.agencia || "") !== nAg) return false
      }

      if (useEdital) {
        if (!normalize(p.edital || "").includes(nEdital)) return false
      }

      if (useSituacao) {
        if (nSit && !sit.includes(nSit)) return false
      }

      if (useCategoria) {
        if (normalize(p.categoria || "") !== nCat) return false
      }

      if (useRelatorioFinal) {
        const rf = (p.relatorioFinal || "nao_submetido").toLowerCase() as "submetido" | "nao_submetido"
        if (rf !== relatorioFinal) return false
      }

      // ===== período =====
      const start = (p.dataInicio || "").slice(0, 10)
      const end = (p.dataFim || p.prazo || "").slice(0, 10)

      if (periodoIni) {
        const base = start || end
        if (base && !isSameDayOrAfter(base, periodoIni)) return false
        if (!base) return false
      }

      if (periodoFim) {
        const base = end || start
        if (base && !isSameDayOrBefore(base, periodoFim)) return false
        if (!base) return false
      }

      return true
    })
  }, [
    q,
    tipoP1,
    codigo,
    ano,
    pesquisador,
    centroUnidade,
    titulo,
    objetivos,
    linhaPesquisa,
    areaConhecimento,
    grupoPesquisa,
    agenciaFinanciadora,
    edital,
    situacaoProjeto,
    categoriaProjeto,
    relatorioFinal,
    useTipo,
    useCodigo,
    useAno,
    usePesquisador,
    useCentroUnidade,
    useTitulo,
    useObjetivos,
    useLinhaPesquisa,
    useAreaConhecimento,
    useGrupoPesquisa,
    useAgencia,
    useEdital,
    useSituacao,
    useCategoria,
    useRelatorioFinal,
    // período
    periodoIni,
    periodoFim,
  ])

  const clearAll = () => {
    setQ("")

    setTipoP1("externo")
    setCodigo("")
    setAno("")
    setPesquisador("")
    setCentroUnidade("")
    setTitulo("")
    setObjetivos("")
    setLinhaPesquisa("")
    setAreaConhecimento("")
    setGrupoPesquisa("")
    setAgenciaFinanciadora("")
    setEdital("")
    setSituacaoProjeto("")
    setCategoriaProjeto("")
    setRelatorioFinal("nao_submetido")

    setUseTipo(false)
    setUseCodigo(false)
    setUseAno(false)
    setUsePesquisador(false)
    setUseCentroUnidade(false)
    setUseTitulo(false)
    setUseObjetivos(false)
    setUseLinhaPesquisa(false)
    setUseAreaConhecimento(false)
    setUseGrupoPesquisa(false)
    setUseAgencia(false)
    setUseEdital(false)
    setUseSituacao(false)
    setUseCategoria(false)
    setUseRelatorioFinal(false)

    setPeriodoIni("")
    setPeriodoFim("")
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Projetos (ADM) • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Projetos</h1>
            <p className="text-sm mt-1 text-neutral">
              Hub de projetos: faça buscas e navegue para ações e páginas específicas.
            </p>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <Link
                to="/adm/projetos/novo"
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-95"
              >
                Cadastrar projeto
              </Link>
            </div>
          )}
        </div>

        {/* Busca (rápida + avançada) */}
        <div className="rounded-2xl border border-neutral-light bg-white shadow-card">
          {/* Barra topo */}
          <div className="p-5 md:p-6 border-b border-neutral-light flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por título, coordenador ou código…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light/50"
              >
                <SlidersHorizontal size={16} />
                Busca avançada
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light/50"
              >
                <X size={16} />
                Limpar
              </button>
            </div>
          </div>

          {/* Campos avançados (AGORA com todos filtros da Página 1) */}
          {advancedOpen && (
            <div className="p-5 md:p-6 space-y-4">
              <div className="text-xs text-neutral/70">
                Marque a caixinha à esquerda para <span className="font-semibold">ativar</span> cada filtro (padrão SIGAA).
              </div>

              <div className="grid gap-3">
                <Row
                  checked={useTipo}
                  onCheck={setUseTipo}
                  label="Tipo:"
                  field={
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="tipoP1"
                          checked={tipoP1 === "interno"}
                          onChange={() => setTipoP1("interno")}
                        />
                        Interno
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="tipoP1"
                          checked={tipoP1 === "externo"}
                          onChange={() => setTipoP1("externo")}
                        />
                        Externo
                      </label>
                    </div>
                  }
                />

                <Row
                  checked={useCodigo}
                  onCheck={setUseCodigo}
                  label="Código:"
                  field={
                    <input
                      className="w-48 rounded-sm border border-border px-2 py-1 text-sm"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      placeholder="ID ou código…"
                    />
                  }
                />

                <Row
                  checked={useAno}
                  onCheck={setUseAno}
                  label="Ano:"
                  field={
                    <input
                      className="w-24 rounded-sm border border-border px-2 py-1 text-sm"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      placeholder="Ex.: 2025"
                    />
                  }
                />

                <Row
                  checked={usePesquisador}
                  onCheck={setUsePesquisador}
                  label="Pesquisador:"
                  field={
                    <input
                      className="w-full max-w-2xl rounded-sm border border-border px-2 py-1 text-sm"
                      value={pesquisador}
                      onChange={(e) => setPesquisador(e.target.value)}
                      placeholder="Nome do coordenador/pesquisador…"
                    />
                  }
                />

                <Row
                  checked={useCentroUnidade}
                  onCheck={setUseCentroUnidade}
                  label="Centro/Unidade:"
                  field={
                    <select
                      className="w-full max-w-2xl rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={centroUnidade}
                      onChange={(e) => setCentroUnidade(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.centroUnidadeOpts.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useTitulo}
                  onCheck={setUseTitulo}
                  label="Título:"
                  field={
                    <input
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1 text-sm"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  }
                />

                <Row
                  checked={useObjetivos}
                  onCheck={setUseObjetivos}
                  label="Objetivos:"
                  field={
                    <input
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1 text-sm"
                      value={objetivos}
                      onChange={(e) => setObjetivos(e.target.value)}
                    />
                  }
                />

                <Row
                  checked={useLinhaPesquisa}
                  onCheck={setUseLinhaPesquisa}
                  label="Linha de Pesquisa:"
                  field={
                    <input
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1 text-sm"
                      value={linhaPesquisa}
                      onChange={(e) => setLinhaPesquisa(e.target.value)}
                    />
                  }
                />

                <Row
                  checked={useAreaConhecimento}
                  onCheck={setUseAreaConhecimento}
                  label="Área do Conhecimento:"
                  field={
                    <select
                      className="w-full max-w-md rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={areaConhecimento}
                      onChange={(e) => setAreaConhecimento(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.areaConhecimentoOpts.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useGrupoPesquisa}
                  onCheck={setUseGrupoPesquisa}
                  label="Grupo de Pesquisa:"
                  field={
                    <select
                      className="w-full max-w-2xl rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={grupoPesquisa}
                      onChange={(e) => setGrupoPesquisa(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.grupoPesquisaOpts.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useAgencia}
                  onCheck={setUseAgencia}
                  label="Agência Financiadora:"
                  field={
                    <select
                      className="w-full max-w-2xl rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={agenciaFinanciadora}
                      onChange={(e) => setAgenciaFinanciadora(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.agenciaOpts.map((ag) => (
                        <option key={ag} value={ag}>
                          {ag}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useEdital}
                  onCheck={setUseEdital}
                  label="Edital:"
                  field={
                    <select
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={edital}
                      onChange={(e) => setEdital(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.editalOpts.map((ed) => (
                        <option key={ed} value={ed}>
                          {ed}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useSituacao}
                  onCheck={setUseSituacao}
                  label="Situação do Projeto:"
                  field={
                    <select
                      className="w-full max-w-md rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={situacaoProjeto}
                      onChange={(e) => setSituacaoProjeto(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.situacaoOpts.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useCategoria}
                  onCheck={setUseCategoria}
                  label="Categoria do Projeto:"
                  field={
                    <select
                      className="w-full max-w-md rounded-sm border border-border px-2 py-1 text-sm bg-white"
                      value={categoriaProjeto}
                      onChange={(e) => setCategoriaProjeto(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.categoriaOpts.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useRelatorioFinal}
                  onCheck={setUseRelatorioFinal}
                  label="Relatório Final:"
                  field={
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="rf"
                          checked={relatorioFinal === "submetido"}
                          onChange={() => setRelatorioFinal("submetido")}
                        />
                        Submetido
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="rf"
                          checked={relatorioFinal === "nao_submetido"}
                          onChange={() => setRelatorioFinal("nao_submetido")}
                        />
                        Não Submetido
                      </label>
                    </div>
                  }
                />

                {/* Período*/}
                <div className="pt-2 border-t border-neutral-light/70" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">
                      Período (início)
                    </label>
                    <div className="mt-2 relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60" />
                      <input
                        type="date"
                        value={periodoIni}
                        onChange={(e) => setPeriodoIni(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">Período (fim)</label>
                    <div className="mt-2 relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60" />
                      <input
                        type="date"
                        value={periodoFim}
                        onChange={(e) => setPeriodoFim(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-neutral/70">
                Clique em <span className="font-semibold text-neutral">⋯</span> na tabela para abrir ações do
                projeto.
              </div>
            </div>
          )}
        </div>

        {/* Resultado / Tabela */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-base text-neutral">Nenhum projeto encontrado.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <h2 className="text-sm font-semibold text-primary">
                Resultado / Tabela <span className="text-neutral/70">({filtered.length})</span>
              </h2>
              <p className="text-[11px] leading-4 text-neutral/60">Mostrando resultados conforme os filtros.</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-light p-5 md:p-6 shadow-card overflow-visible">
              <Table
                data={filtered}
                cols={
                  isAdmin
                    ? ([
                        {
                          key: "titulo",
                          header: "Título / Coordenador",
                          render: (r: Projeto) => (
                            <div className="flex flex-col">
                              <span className="font-semibold text-primary">{truncate(r.titulo, 60)}</span>
                              <span className="text-xs text-neutral/70">
                                {r.pesquisador ? `Coord.: ${r.pesquisador}` : "Coord.: —"}
                              </span>
                            </div>
                          ),
                        },
                        {
                          key: "tipo",
                          header: "Tipo",
                          render: (r: Projeto) => <span className="text-sm capitalize">{r.tipo || "—"}</span>,
                        },
                        {
                          key: "status",
                          header: "Situação",
                          render: (r: Projeto) => (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass(r.status)}`}>
                              {r.status || "—"}
                            </span>
                          ),
                        },
                        {
                          key: "pesquisador",
                          header: "Coordenador",
                          render: (r: Projeto) => <span className="text-sm">{r.pesquisador || "—"}</span>,
                        },
                        {
                          key: "__periodo" as keyof Projeto,
                          header: "Período",
                          render: (r: Projeto) => {
                            const ini = (r.dataInicio || "").slice(0, 10)
                            const fim = (r.dataFim || r.prazo || "").slice(0, 10)
                            if (!ini && !fim) return <span className="text-sm">—</span>
                            return (
                              <span className="text-sm">
                                {ini ? ini : "—"} → {fim ? fim : "—"}
                              </span>
                            )
                          },
                        },
                        {
                          key: "__acoes" as keyof Projeto,
                          header: "Ações",
                          render: (r: Projeto) => <KebabActions id={r.id} />,
                        },
                      ] as any)
                    : ([
                        { key: "id", header: "Código" },
                        { key: "titulo", header: "Título", render: (r: any) => truncate(r.titulo) },
                        { key: "centro", header: "Centro" },
                        { key: "area", header: "Área" },
                        {
                          key: "status",
                          header: "Situação",
                          render: (r: any) => (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass(r.status)}`}>
                              {r.status}
                            </span>
                          ),
                        },
                        { key: "prazo", header: "Prazo" },
                      ] as any)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* =================== UI: Row (SIGAA-style) =================== */

function Row(props: {
  checked: boolean
  onCheck: (v: boolean) => void
  label: string
  field: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[18px_180px_1fr] items-center gap-3">
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onCheck(e.target.checked)} />
      <div className="text-sm">{props.label}</div>
      <div>{props.field}</div>
    </div>
  )
}
