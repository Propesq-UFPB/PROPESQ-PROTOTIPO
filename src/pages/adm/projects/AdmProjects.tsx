import React, { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Table from "@/components/Table"
import { projetos } from "@/mock/data"
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  MoreVertical,
  Eye,
  FileText,
  BadgeCheck,
  Trash2,
} from "lucide-react"

/* ================= IDENTIDADE DA PÁGINA ================= */

const PAGE_SECTION = "admProjects"
const PAGE_NAME = "AdmProjects"

/* ================= TIPOS ================= */

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
  codigo?: string
  dataCadastro?: string
  dataInicio?: string
  dataFim?: string
}

/* ================= UTIL ================= */

const statusClass = (status: string) => {
  const s = status?.toLowerCase?.() || ""
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (s.includes("pend") || s.includes("anál") || s.includes("analise")) {
    return "bg-amber-100 text-amber-800"
  }
  if (s.includes("reprov") || s.includes("indefer")) return "bg-red-100 text-red-800"
  return "bg-neutral-light text-neutral"
}

const truncate = (txt: string, n = 70) =>
  txt?.length > n ? `${txt.slice(0, n)}…` : txt || "—"

function normalize(s: string) {
  return (s || "").trim().toLowerCase()
}

function isSameDayOrAfter(a: string, b: string) {
  return a >= b
}

function isSameDayOrBefore(a: string, b: string) {
  return a <= b
}

function formatPeriod(p: Projeto) {
  const ini = (p.dataInicio || "").slice(0, 10)
  const fim = (p.dataFim || p.prazo || "").slice(0, 10)
  if (!ini && !fim) return "—"
  return `${ini || "—"} → ${fim || "—"}`
}

/* ================= UI AUX ================= */

function KebabActions({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; maxHeight: number }>({
    top: 0,
    left: 0,
    maxHeight: 320,
  })

  const menuRef = useRef<HTMLDivElement | null>(null)

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    const r = e.currentTarget.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const menuWidth = 224
    const gap = 8
    const margin = 12

    const spaceBelow = viewportHeight - r.bottom - margin
    const spaceAbove = r.top - margin

    const estimatedHeight = 260
    const shouldOpenUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow

    const top = shouldOpenUp
      ? Math.max(margin, r.top - estimatedHeight - gap)
      : Math.min(viewportHeight - estimatedHeight - margin, r.bottom + gap)

    const left = Math.min(
      viewportWidth - menuWidth - margin,
      Math.max(margin, r.right - menuWidth)
    )

    const maxHeight = shouldOpenUp
      ? Math.max(160, r.top - margin - gap)
      : Math.max(160, viewportHeight - r.bottom - margin - gap)

    setPos({ top, left, maxHeight })
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open || !menuRef.current) return

    const el = menuRef.current
    const rect = el.getBoundingClientRect()
    const margin = 12

    let nextTop = pos.top
    let nextLeft = pos.left

    if (rect.bottom > window.innerHeight - margin) {
      nextTop = Math.max(margin, window.innerHeight - rect.height - margin)
    }

    if (rect.top < margin) {
      nextTop = margin
    }

    if (rect.right > window.innerWidth - margin) {
      nextLeft = Math.max(margin, window.innerWidth - rect.width - margin)
    }

    if (rect.left < margin) {
      nextLeft = margin
    }

    if (nextTop !== pos.top || nextLeft !== pos.left) {
      setPos((prev) => ({ ...prev, top: nextTop, left: nextLeft }))
    }
  }, [open, pos.top, pos.left])

  useEffect(() => {
    if (!open) return

    const handleViewportChange = () => setOpen(false)

    window.addEventListener("resize", handleViewportChange)
    window.addEventListener("scroll", handleViewportChange, true)

    return () => {
      window.removeEventListener("resize", handleViewportChange)
      window.removeEventListener("scroll", handleViewportChange, true)
    }
  }, [open])

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
        "flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] leading-4",
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
          className="inline-flex h-7 items-center gap-1 rounded-lg border border-neutral-light px-2 text-[11px] font-semibold text-primary hover:bg-neutral-light/60"
          title="Detalhes"
        >
          <Eye size={13} />
          Detalhes
        </Link>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="grid h-7 w-7 place-items-center rounded-lg border border-neutral-light hover:bg-neutral-light/60"
        aria-label="Mais ações"
        aria-expanded={open}
      >
        <MoreVertical size={14} className="text-neutral/70" />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-[60] cursor-default"
            onClick={close}
            aria-hidden="true"
          />

          <div
            ref={menuRef}
            className="fixed z-[70] w-56 rounded-xl border border-neutral-light bg-white shadow-card"
            style={{
              top: pos.top,
              left: pos.left,
              maxHeight: pos.maxHeight,
            }}
          >
            <div className="border-b border-neutral-light px-3 py-2 text-[11px] text-neutral/70">
              Ações do projeto
            </div>

            <div className="max-h-full overflow-y-auto p-1">
              <Item
                to={`/adm/projetos/${id}`}
                label="Detalhes"
                icon={<Eye size={14} />}
              />

              <div className="my-1 h-px bg-neutral-light" />

              <Item
                to="/adm/monitoring/report-validation"
                label="Relatórios"
                icon={<FileText size={14} />}
              />
              <Item
                to="/adm/monitoring/AdmCertificates"
                label="Emitir declaração"
                icon={<BadgeCheck size={14} />}
              />

              <div className="my-1 h-px bg-neutral-light" />

              <Item
                to={`/adm/projetos/${id}/remover`}
                label="Remover"
                icon={<Trash2 size={14} />}
                danger
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ================= COMPONENTE PRINCIPAL ================= */

export default function AdmProjects() {
  const [advancedOpen, setAdvancedOpen] = useState(true)

  // Busca rápida
  const [q, setQ] = useState("")

  // Filtros
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
  const [relatorioFinal, setRelatorioFinal] =
    useState<"submetido" | "nao_submetido">("nao_submetido")

  // Ativadores
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

    const areaConhecimentoOpts = sort(
      rows.map((p) => (p.areaConhecimento || "").trim()).filter(Boolean)
    )
    const grupoPesquisaOpts = sort(
      rows.map((p) => (p.grupoPesquisa || "").trim()).filter(Boolean)
    )
    const agenciaOpts = sort(rows.map((p) => (p.agencia || "").trim()).filter(Boolean))
    const editalOpts = sort(rows.map((p) => (p.edital || "").trim()).filter(Boolean))
    const situacaoOpts = sort(
      rows.map((p) => (p.situacao || p.status || "").trim()).filter(Boolean)
    )
    const categoriaOpts = sort(
      rows.map((p) => (p.categoria || "").trim()).filter(Boolean)
    )

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
      const sit = normalize(p.situacao || p.status || "")
      const t = (p.tipo || "").toLowerCase()

      if (nq) {
        const codeBase = normalize(String(p.id)) + " " + normalize(p.codigo || "")
        const hit = title.includes(nq) || coord.includes(nq) || codeBase.includes(nq)
        if (!hit) return false
      }

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

      if (useLinhaPesquisa && !normalize(p.linhaPesquisa || "").includes(nLinha)) {
        return false
      }

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
        const rf = (p.relatorioFinal || "nao_submetido").toLowerCase() as
          | "submetido"
          | "nao_submetido"
        if (rf !== relatorioFinal) return false
      }

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
    <div
      className="min-h-screen bg-neutral-light"
      data-section={PAGE_SECTION}
      data-page={PAGE_NAME}
    >
      <Helmet>
        <title>Projetos • Administração • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Projetos</h1>
            <p className="mt-1 text-sm text-neutral">
              Painel administrativo para busca, acompanhamento e acesso às ações dos
              projetos.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/adm/projetos/novo"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Cadastrar projeto
            </Link>
          </div>
        </div>

        {/* Busca */}
        <div className="rounded-2xl border border-neutral-light bg-white shadow-card">
          <div className="flex flex-col gap-3 border-b border-neutral-light p-4 md:flex-row md:items-center md:gap-4 md:p-5">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por título, coordenador ou código…"
                className="w-full rounded-xl border border-neutral-light py-2 pl-8 pr-3 text-[13px] leading-5 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-[13px] font-semibold text-primary hover:bg-neutral-light/50"
              >
                <SlidersHorizontal size={15} />
                Busca avançada
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-[13px] font-semibold text-neutral hover:bg-neutral-light/50"
              >
                <X size={15} />
                Limpar
              </button>
            </div>
          </div>

          {advancedOpen && (
            <div className="space-y-4 p-4 md:p-5">
              <div className="text-xs text-neutral/70">
                Marque a caixa à esquerda para <span className="font-semibold">ativar</span>{" "}
                cada filtro.
              </div>

              <div className="grid gap-3">
                <Row
                  checked={useTipo}
                  onCheck={setUseTipo}
                  label="Tipo:"
                  field={
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="tipoP1"
                          checked={tipoP1 === "interno"}
                          onChange={() => setTipoP1("interno")}
                        />
                        Interno
                      </label>
                      <label className="flex items-center gap-2 text-[13px]">
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
                      className="w-48 rounded-sm border border-border px-2 py-1.5 text-[13px]"
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
                      className="w-24 rounded-sm border border-border px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-2xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-2xl rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-3xl rounded-sm border border-border px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-md rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-2xl rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-2xl rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-3xl rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-md rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      className="w-full max-w-md rounded-sm border border-border bg-white px-2 py-1.5 text-[13px]"
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
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="rf"
                          checked={relatorioFinal === "submetido"}
                          onChange={() => setRelatorioFinal("submetido")}
                        />
                        Submetido
                      </label>
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="rf"
                          checked={relatorioFinal === "nao_submetido"}
                          onChange={() => setRelatorioFinal("nao_submetido")}
                        />
                        Não submetido
                      </label>
                    </div>
                  }
                />

                <div className="border-t border-neutral-light/70 pt-2" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
                      Período (início)
                    </label>
                    <div className="relative mt-2">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                      />
                      <input
                        type="date"
                        value={periodoIni}
                        onChange={(e) => setPeriodoIni(e.target.value)}
                        className="w-full rounded-xl border border-neutral-light py-2 pl-8 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
                      Período (fim)
                    </label>
                    <div className="relative mt-2">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                      />
                      <input
                        type="date"
                        value={periodoFim}
                        onChange={(e) => setPeriodoFim(e.target.value)}
                        className="w-full rounded-xl border border-neutral-light py-2 pl-8 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-neutral/70">
                Clique em <span className="font-semibold text-neutral">⋯</span> na tabela
                para abrir as ações do projeto.
              </div>
            </div>
          )}
        </div>

        {/* Resultado / Tabela */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral">
            Nenhum projeto encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <h2 className="text-sm font-semibold text-primary">
                Resultado / Tabela{" "}
                <span className="text-neutral/70">({filtered.length})</span>
              </h2>
              <p className="text-[11px] leading-4 text-neutral/60">
                Mostrando resultados conforme os filtros aplicados.
              </p>
            </div>

            <div className="overflow-visible rounded-2xl border border-neutral-light bg-white p-4 shadow-card md:p-5">
              <div className="text-[12px] leading-4">
                <Table
                  data={filtered}
                  cols={
                    [
                      {
                        key: "titulo",
                        header: "Título / Coordenador",
                        render: (r: Projeto) => (
                          <div className="flex flex-col gap-0.5">
                            <Link
                              to={`/adm/projetos/${r.id}`}
                              className="text-[12px] font-semibold leading-4 text-primary hover:underline"
                            >
                              {truncate(r.titulo, 60)}
                            </Link>
                            <span className="text-[11px] leading-4 text-neutral/70">
                              {r.pesquisador ? `Coord.: ${r.pesquisador}` : "Coord.: —"}
                            </span>
                          </div>
                        ),
                      },
                      {
                        key: "tipo",
                        header: "Tipo",
                        render: (r: Projeto) => (
                          <span className="text-[12px] capitalize leading-4">
                            {r.tipo || "—"}
                          </span>
                        ),
                      },
                      {
                        key: "status",
                        header: "Situação",
                        render: (r: Projeto) => (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ${statusClass(
                              r.status
                            )}`}
                          >
                            {r.status || "—"}
                          </span>
                        ),
                      },
                      {
                        key: "pesquisador",
                        header: "Coordenador",
                        render: (r: Projeto) => (
                          <span className="text-[12px] leading-4">
                            {r.pesquisador || "—"}
                          </span>
                        ),
                      },
                      {
                        key: "__periodo" as keyof Projeto,
                        header: "Período",
                        render: (r: Projeto) => (
                          <span className="text-[12px] leading-4">{formatPeriod(r)}</span>
                        ),
                      },
                      {
                        key: "__acoes" as keyof Projeto,
                        header: "Ações",
                        render: (r: Projeto) => <KebabActions id={r.id} />,
                      },
                    ] as any
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ================= UI: ROW ================= */

function Row(props: {
  checked: boolean
  onCheck: (v: boolean) => void
  label: string
  field: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[18px_180px_1fr] items-center gap-3">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onCheck(e.target.checked)}
      />
      <div className="text-[13px] leading-4">{props.label}</div>
      <div>{props.field}</div>
    </div>
  )
}