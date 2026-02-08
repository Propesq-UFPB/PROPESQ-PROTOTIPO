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
  pesquisador?: string // coordenador (mock)
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

  // se existir no futuro
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
    // posiciona o menu alinhado à direita do botão
    setPos({
      top: r.bottom + 8,
      left: Math.max(12, r.right - 224), // 224 = w-56 (aprox)
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
    <div className="flex items-center justify-end gap-2">
      {/* Ações rápidas */}
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

      {/* Botão ⋮ */}
      <button
        type="button"
        onClick={toggle}
        className="h-8 w-8 rounded-lg border border-neutral-light hover:bg-neutral-light/60 grid place-items-center"
        aria-label="Mais ações"
        aria-expanded={open}
      >
        <MoreVertical size={16} className="text-neutral/70" />
      </button>

      {/* Menu FIXED (não corta por overflow) */}
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


/* ================= COMPONENT ================= */

export default function Projects() {
  const role = getCurrentRole()
  const isAdmin = role === "ADMINISTRADOR"

  const [advancedOpen, setAdvancedOpen] = useState(true)

  // -------- Busca rápida (sempre visível)
  const [q, setQ] = useState("")

  // -------- Busca avançada (somente os campos exigidos na Página 2)
  const [coordenador, setCoordenador] = useState("")
  const [tipo, setTipo] = useState<"" | "interno" | "externo">("")
  const [situacao, setSituacao] = useState("")
  const [periodoIni, setPeriodoIni] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")

  const centrosOpts = useMemo(() => {
    const set = new Set<string>()
    ;(projetos as Projeto[]).forEach((p) => p.centro && set.add(p.centro))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [])

  const tiposOpts: Array<{ value: "" | "interno" | "externo"; label: string }> = [
    { value: "", label: "Todos" },
    { value: "interno", label: "Interno" },
    { value: "externo", label: "Externo" },
  ]

  const situacoesOpts = useMemo(() => {
    const set = new Set<string>()
    ;(projetos as Projeto[]).forEach((p) => p.status && set.add(p.status))
    return ["", ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [])

  const filtered = useMemo(() => {
    const nq = normalize(q)
    const ncoord = normalize(coordenador)
    const nsit = normalize(situacao)

    return (projetos as Projeto[]).filter((p) => {
      const title = normalize(p.titulo)
      const coord = normalize(p.pesquisador || "")
      const st = normalize(p.status || "")
      const t = (p.tipo || "").toLowerCase()

      // Busca rápida: título OU coordenador OU id
      if (nq) {
        const hit = title.includes(nq) || coord.includes(nq) || String(p.id).toLowerCase().includes(nq)
        if (!hit) return false
      }

      // coordenador
      if (ncoord && !coord.includes(ncoord)) return false

      // tipo
      if (tipo && t !== tipo) return false

      // situação (status)
      if (nsit && !st.includes(nsit)) return false

      // período (usa prazo do mock; ideal é ter dataInicio/dataFim no futuro)
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
  }, [q, coordenador, tipo, situacao, periodoIni, periodoFim])

  const clearAll = () => {
    setQ("")
    setCoordenador("")
    setTipo("")
    setSituacao("")
    setPeriodoIni("")
    setPeriodoFim("")
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Projetos (ADM) • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Projetos</h1>
            <p className="text-sm mt-1 text-neutral">
              Hub de projetos: faça buscas e navegue para ações e páginas específicas. Nenhum formulário é aberto aqui.
            </p>
          </div>

          {/* CTA opcional (leva para subpágina de cadastro) */}
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

          {/* Campos avançados */}
          {advancedOpen && (
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Coordenador */}
                <div className="lg:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">Coordenador</label>
                  <input
                    value={coordenador}
                    onChange={(e) => setCoordenador(e.target.value)}
                    placeholder="Nome do coordenador…"
                    className="mt-2 w-full px-3 py-2.5 rounded-xl border border-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="mt-2 w-full px-3 py-2.5 rounded-xl border border-neutral-light text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {tiposOpts.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Situação */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-neutral/70">Situação</label>
                  <select
                    value={situacao}
                    onChange={(e) => setSituacao(e.target.value)}
                    className="mt-2 w-full px-3 py-2.5 rounded-xl border border-neutral-light text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {situacoesOpts.map((s) => (
                      <option key={s || "__all"} value={s}>
                        {s ? s : "Todas"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Período */}
                <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
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

              <div className="mt-5 text-xs text-neutral/70">
                Dica: clique em <span className="font-semibold text-neutral">⋯</span> na tabela para abrir ações do
                projeto. Nenhuma ação pesada é executada aqui.
              </div>
            </div>
          )}
        </div>

        {/* Resultado / Tabela */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-base text-neutral">Nenhum projeto encontrado.</div>
        ) : (
          <div className="space-y-3">
            {/* Header FORA do card */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <h2 className="text-sm font-semibold text-primary">
                Resultado / Tabela <span className="text-neutral/70">({filtered.length})</span>
              </h2>
              <p className="text-[11px] leading-4 text-neutral/60">Mostrando resultados conforme os filtros.</p>
            </div>

            {/* Card só com a tabela (overflow visível) */}
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
