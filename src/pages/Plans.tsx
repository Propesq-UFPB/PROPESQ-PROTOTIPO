import React, { useMemo, useState } from "react"
import Card from "@/components/Card"
import Table from "@/components/Table"
import { planos, projetos } from "@/mock/data"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

type RoleType = "DISCENTE" | "COORDENADOR" | "ADMINISTRADOR"

function getCurrentRole(): RoleType {
  if (typeof window !== "undefined" && (window as any).__ROLE__) {
    return String((window as any).__ROLE__).toUpperCase() as RoleType
  }
  const fromLS =
    typeof window !== "undefined" && window.localStorage
      ? localStorage.getItem("role")
      : null
  const normalized = (fromLS || "DISCENTE").toUpperCase()
  return (["DISCENTE", "COORDENADOR", "ADMINISTRADOR"].includes(normalized)
    ? normalized
    : "DISCENTE") as RoleType
}

/* ===== STATUS ===== */

const statusClass = (status: string) => {
  const s = status.toLowerCase()
  if (s.includes("andamento")) return "bg-amber-100 text-amber-800"
  if (s.includes("finaliz")) return "bg-green-100 text-green-800"
  if (s.includes("aguard") || s.includes("resumo"))
    return "bg-neutral-light text-neutral"
  if (s.includes("aprov")) return "bg-emerald-100 text-emerald-800"
  if (s.includes("pend") || s.includes("anál") || s.includes("analise"))
    return "bg-amber-100 text-amber-800"
  if (s.includes("reprov") || s.includes("indefer"))
    return "bg-red-100 text-red-800"
  return "bg-neutral-light text-neutral"
}

const truncate = (txt: string, n = 80) =>
  txt?.length > n ? `${txt.slice(0, n)}…` : txt || "—"

function matchStatusFilter(statusProjeto: string, filtro: string): boolean {
  const s = statusProjeto.toLowerCase()
  switch (filtro) {
    case "andamento":
      return s.includes("andamento")
    case "finalizado":
      return s.includes("finaliz")
    case "aguardando":
      return s.includes("aguard") || s.includes("resumo")
    case "aprovado":
      return s.includes("aprov")
    default:
      return true
  }
}

export default function Plans() {
  const role = getCurrentRole()
  const canCreate = role === "COORDENADOR" || role === "ADMINISTRADOR"

  const baseData = useMemo(() => {
    return planos.map((pl) => {
      const projeto = projetos.find((p) => p.id === pl.projetoId)
      return {
        ...pl,
        codigo: pl.id,
        titulo: projeto?.titulo ?? "—",
        discente: "Aluno Exemplo",
        orientador: "Prof. Dr. Fulano de Tal",
        mobilidade: projeto?.area?.includes("Computação")
          ? "Remota"
          : "Presencial",
        statusProjeto: projeto?.status ?? "Em andamento",
      }
    })
  }, [])

  const [q, setQ] = useState("")
  const [status, setStatus] = useState<
    "all" | "andamento" | "finalizado" | "aguardando" | "aprovado"
  >("all")

  const filtered = useMemo(() => {
    return baseData.filter((d) => {
      const hitsText =
        d.codigo.toLowerCase().includes(q.toLowerCase()) ||
        d.titulo.toLowerCase().includes(q.toLowerCase()) ||
        d.discente.toLowerCase().includes(q.toLowerCase()) ||
        d.orientador.toLowerCase().includes(q.toLowerCase())

      const hitsStatus = matchStatusFilter(d.statusProjeto, status)

      return hitsText && hitsStatus
    })
  }, [baseData, q, status])

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Planos de Trabalho • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* HEADER / FILTROS */}
        <section className="mb-8 bg-white rounded-2xl border border-neutral-light p-6 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            {/* BUSCA */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por código, título ou participante…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border border-neutral-light
                  px-4 py-2.5
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-lighter/40
                "
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="
                  w-full
                  rounded-xl
                  border border-neutral-light
                  px-4 py-2.5
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-lighter/40
                "
              >
                <option value="all">Todos</option>
                <option value="andamento">Em andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="aguardando">Aguardando resumo</option>
                <option value="aprovado">Aprovado</option>
              </select>
            </div>

            {/* AÇÃO */}
            <div className="flex justify-end">
              {canCreate && (
                <Link
                  to="/novo-plano"
                  className="
                    px-5 py-2.5
                    rounded-xl
                    text-sm font-semibold
                    bg-accent
                    text-primary
                    hover:bg-accent-medium
                    transition-colors
                  "
                >
                  + Novo Plano
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* TABELA */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-xl font-semibold text-primary">
              Nenhum plano encontrado
            </div>
            <div className="mt-3 text-sm text-neutral">
              Ajuste os filtros ou tente outro termo de busca.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-light p-6 shadow-card">
            <Table
              data={filtered}
              cols={[
                {
                  key: "codigo",
                  header: "Código",
                  render: (r: any) => (
                    <span className="font-mono text-sm">{r.codigo}</span>
                  ),
                },
                {
                  key: "titulo",
                  header: "Título",
                  render: (r: any) => (
                    <span
                      className="text-sm font-semibold text-primary"
                      title={r.titulo}
                    >
                      {truncate(r.titulo, 60)}
                    </span>
                  ),
                },
                {
                  key: "discente",
                  header: "Discente",
                  render: (r: any) => (
                    <span className="text-sm">{r.discente}</span>
                  ),
                },
                {
                  key: "orientador",
                  header: "Orientador",
                  render: (r: any) => (
                    <span className="text-sm">{r.orientador}</span>
                  ),
                },
                {
                  key: "mobilidade",
                  header: "Mobilidade",
                  render: (r: any) => (
                    <span className="text-sm">{r.mobilidade}</span>
                  ),
                },
                {
                  key: "statusProjeto",
                  header: "Status",
                  render: (r: any) => (
                    <span
                      className={`
                        px-3 py-1
                        rounded-full
                        text-xs font-semibold
                        ${statusClass(r.statusProjeto)}
                      `}
                    >
                      {r.statusProjeto}
                    </span>
                  ),
                },
              ]}
              striped
              stickyHeader
            />
          </div>
        )}
      </div>
    </div>
  )
}
