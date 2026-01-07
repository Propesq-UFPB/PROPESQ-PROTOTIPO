// src/pages/Projects.tsx
import React, { useMemo, useState } from "react"
import Card from "@/components/Card"
import Table from "@/components/Table"
import { projetos } from "@/mock/data"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

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
  if (s.includes("reprov") || s.includes("indefer"))
    return "bg-red-100 text-red-800"
  return "bg-neutral-light text-neutral"
}

const truncate = (txt: string, n = 70) =>
  txt?.length > n ? `${txt.slice(0, n)}…` : txt || "—"

/* ================= COMPONENT ================= */

export default function Projects() {
  const role = getCurrentRole()
  const canCreate = role === "COORDENADOR" || role === "ADMINISTRADOR"

  /* ================= ESTADOS (TODOS) ================= */

  const [useTipo, setUseTipo] = useState(false)
  const [tipo, setTipo] = useState<"" | "interno" | "externo">("")

  const [useCodigo, setUseCodigo] = useState(false)
  const [codigo, setCodigo] = useState("")

  const [useAno, setUseAno] = useState(false)
  const [ano, setAno] = useState("")

  const [escopo, setEscopo] =
    useState<"todos" | "minha_unidade" | "somente_externos">("todos")

  const [usePesq, setUsePesq] = useState(false)
  const [pesquisador, setPesquisador] = useState("")

  const [useCentro, setUseCentro] = useState(false)
  const [centro, setCentro] = useState("")

  const [useUnidade, setUseUnidade] = useState(false)
  const [unidade, setUnidade] = useState("")

  const [useTitulo, setUseTitulo] = useState(false)
  const [titulo, setTitulo] = useState("")

  const [useObjetivos, setUseObjetivos] = useState(false)
  const [objetivos, setObjetivos] = useState("")

  const [useLinha, setUseLinha] = useState(false)
  const [linhaPesquisa, setLinhaPesquisa] = useState("")

  const [useAreaConhec, setUseAreaConhec] = useState(false)
  const [areaConhecimento, setAreaConhecimento] = useState("")

  const [useGrupo, setUseGrupo] = useState(false)
  const [grupoPesquisa, setGrupoPesquisa] = useState("")

  const [useAgencia, setUseAgencia] = useState(false)
  const [agencia, setAgencia] = useState("")

  const [useEdital, setUseEdital] = useState(false)
  const [edital, setEdital] = useState("")

  const [useSituacao, setUseSituacao] = useState(false)
  const [situacao, setSituacao] = useState("")

  const [useCategoria, setUseCategoria] = useState(false)
  const [categoria, setCategoria] = useState("")

  const [useRelatorioFinal, setUseRelatorioFinal] = useState(false)
  const [relatorioFinal, setRelatorioFinal] =
    useState<"" | "submetido" | "nao_submetido">("")

  const [gerarRelatorio, setGerarRelatorio] = useState(false)

  /* ================= OPÇÕES ================= */

  const centrosOpts = useMemo(() => {
    const set = new Set<string>()
    ;(projetos as Projeto[]).forEach(p => p.centro && set.add(p.centro))
    return Array.from(set)
  }, [])

  const areasConhecOpts = useMemo(() => {
    const set = new Set<string>()
    ;(projetos as Projeto[]).forEach(p => {
      if (p.areaConhecimento) set.add(p.areaConhecimento)
      if (p.area) set.add(p.area)
    })
    return Array.from(set)
  }, [])

  const gruposOpts = ["—", "GP I", "GP II", "GP III"]
  const agenciasOpts = ["—", "CNPq", "CAPES", "FINEP", "UFPB", "Outra"]
  const editaisOpts = ["—", "PIBIC 2023", "PIBIC 2024", "PIBITI 2024"]
  const situacoesOpts = ["—", "Em análise", "Aprovado", "Reprovado", "Indeferido", "Concluído"]
  const categoriasOpts = ["—", "Pesquisa", "Extensão", "Inovação", "Ensino"]

  /* ================= FILTRO (INALTERADO) ================= */

  const filtered = useMemo(() => {
    return (projetos as Projeto[]).filter(p => {
      const sv = (v?: string) => (v || "").toLowerCase()
      const has = <T extends keyof Projeto>(k: T) =>
        p[k] !== undefined && p[k] !== null

      if (useTipo && tipo && p.tipo !== tipo) return false
      if (useCodigo && codigo && !String(p.id).toLowerCase().includes(codigo.toLowerCase()))
        return false
      if (useAno && ano && !String(p.ano ?? "").includes(ano)) return false

      if (escopo === "somente_externos" && p.tipo !== "externo") return false
      if (escopo === "minha_unidade" && has("unidade") && !p.unidade) return false

      if (usePesq && pesquisador && !sv(p.pesquisador).includes(sv(pesquisador)))
        return false
      if (useCentro && centro && sv(p.centro) !== sv(centro)) return false
      if (useUnidade && unidade && !sv(p.unidade).includes(sv(unidade)))
        return false
      if (useTitulo && titulo && !sv(p.titulo).includes(sv(titulo)))
        return false
      if (useObjetivos && objetivos && !sv(p.objetivos).includes(sv(objetivos)))
        return false
      if (useLinha && linhaPesquisa && !sv(p.linhaPesquisa).includes(sv(linhaPesquisa)))
        return false
      if (
        useAreaConhec &&
        areaConhecimento &&
        sv(p.areaConhecimento || p.area) !== sv(areaConhecimento)
      )
        return false
      if (useGrupo && grupoPesquisa !== "—" && sv(p.grupoPesquisa) !== sv(grupoPesquisa))
        return false
      if (useAgencia && agencia !== "—" && sv(p.agencia) !== sv(agencia))
        return false
      if (useEdital && edital !== "—" && sv(p.edital) !== sv(edital))
        return false
      if (useSituacao && situacao !== "—" && !sv(p.status).includes(sv(situacao)))
        return false
      if (useCategoria && categoria !== "—" && sv(p.categoria) !== sv(categoria))
        return false
      if (useRelatorioFinal && relatorioFinal && p.relatorioFinal !== relatorioFinal)
        return false

      return true
    })
  }, [
    projetos,
    useTipo, tipo,
    useCodigo, codigo,
    useAno, ano,
    escopo,
    usePesq, pesquisador,
    useCentro, centro,
    useUnidade, unidade,
    useTitulo, titulo,
    useObjetivos, objetivos,
    useLinha, linhaPesquisa,
    useAreaConhec, areaConhecimento,
    useGrupo, grupoPesquisa,
    useAgencia, agencia,
    useEdital, edital,
    useSituacao, situacao,
    useCategoria, categoria,
    useRelatorioFinal, relatorioFinal
  ])

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Projetos • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10">
          {/* FILTROS */}
          <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card mb-12">
            <h2 className="text-lg font-bold text-primary mb-8">
              Critérios de Busca dos Projetos
            </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* TIPO */}
          <div className="flex flex-col gap-4 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={useTipo} onChange={e => setUseTipo(e.target.checked)} className="accent-primary" />
                Tipo do Projeto
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" disabled={!useTipo} checked={tipo === 'interno'} onChange={() => setTipo('interno')} />
                  Interno
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" disabled={!useTipo} checked={tipo === 'externo'} onChange={() => setTipo('externo')} />
                  Externo
                </label>
              </div>

              {useTipo && (
                <button type="button" onClick={() => setTipo('')} className="text-xs text-primary underline self-start">
                  Limpar seleção
                </button>
              )}
            </div>

            {/* CÓDIGO */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={useCodigo} onChange={e => setUseCodigo(e.target.checked)} className="accent-primary" />
                Código do Projeto
              </label>

              <input
                type="text"
                disabled={!useCodigo}
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="PPP0000-AAAA"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
              />

              <span className="text-xs text-neutral/70">
                Formato: PPPNNNN-AAAA
              </span>
            </div>

            {/* ANO */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={useAno} onChange={e => setUseAno(e.target.checked)} className="accent-primary" />
                Ano
              </label>

              <input
                type="number"
                disabled={!useAno}
                value={ano}
                onChange={e => setAno(e.target.value)}
                placeholder="AAAA"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
              />
            </div>

            {/* ESCOPO */}
            <div className="flex flex-col gap-4 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <span className="font-semibold text-primary">
                Escopo da Busca
              </span>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={escopo === 'todos'} onChange={() => setEscopo('todos')} />
                Todos da UFPB
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={escopo === 'minha_unidade'} onChange={() => setEscopo('minha_unidade')} />
                Somente da minha unidade
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={escopo === 'somente_externos'} onChange={() => setEscopo('somente_externos')} />
                Somente externos
              </label>
            </div>

            {/* PESQUISADOR */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={usePesq} onChange={e => setUsePesq(e.target.checked)} className="accent-primary" />
                Pesquisador
              </label>

              <input
                type="text"
                disabled={!usePesq}
                value={pesquisador}
                onChange={e => setPesquisador(e.target.value)}
                placeholder="Nome do pesquisador"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
              />
            </div>

            {/* CENTRO */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={useCentro} onChange={e => setUseCentro(e.target.checked)} className="accent-primary" />
                Centro / Unidade
              </label>

              <select
                disabled={!useCentro}
                value={centro}
                onChange={e => setCentro(e.target.value)}
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
              >
                <option value="">Selecione</option>
                {centrosOpts.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* TÍTULO */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={useTitulo} onChange={e => setUseTitulo(e.target.checked)} className="accent-primary" />
                Título do Projeto
              </label>

              <input
                type="text"
                disabled={!useTitulo}
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Título do projeto"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm disabled:bg-neutral/20"
              />
            </div>

            {/* RELATÓRIO FINAL */}
            <div className="flex flex-col gap-4 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <label className="flex items-center gap-3 font-semibold text-primary">
                <input type="checkbox" checked={useRelatorioFinal} onChange={e => setUseRelatorioFinal(e.target.checked)} className="accent-primary" />
                Relatório Final
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" disabled={!useRelatorioFinal} checked={relatorioFinal === 'submetido'} onChange={() => setRelatorioFinal('submetido')} />
                Submetido
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" disabled={!useRelatorioFinal} checked={relatorioFinal === 'nao_submetido'} onChange={() => setRelatorioFinal('nao_submetido')} />
                Não submetido
              </label>
            </div>

            {/* GERAR RELATÓRIO */}
            <div className="flex items-center gap-3 rounded-xl border border-neutral/20 p-5 bg-neutral-light/40">
              <input type="checkbox" checked={gerarRelatorio} onChange={e => setGerarRelatorio(e.target.checked)} className="accent-primary" />
              <span className="font-semibold text-primary">
                Gerar relatório
              </span>
            </div>

        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-base rounded-xl border border-neutral-light"
              >
                Limpar
              </button>
              <button className="px-6 py-3 text-base rounded-xl bg-primary text-white font-semibold">
                Buscar
              </button>
            </div>
          </div>

          {/* LISTAGEM */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-base text-neutral">
              Nenhum projeto encontrado.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-light p-8 shadow-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-primary">
                  Resultado da Busca
                </h2>

                {canCreate && (
                  <Link
                    to="/novo-projeto"
                    className="px-6 py-3 text-base rounded-xl bg-accent text-primary font-semibold"
                  >
                    + Novo Projeto
                  </Link>
                )}
              </div>

              <Table
                data={filtered}
                cols={[
                  { key: "id", header: "Código" },
                  {
                    key: "titulo",
                    header: "Título",
                    render: (r: any) => truncate(r.titulo),
                  },
                  { key: "centro", header: "Centro" },
                  { key: "area", header: "Área" },
                  {
                    key: "status",
                    header: "Situação",
                    render: (r: any) => (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    ),
                  },
                  { key: "prazo", header: "Prazo" },
                ]}
              />
            </div>
          )}
      </div>
  )
}
