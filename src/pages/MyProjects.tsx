import React, { useMemo } from "react"
import Card from "@/components/Card"
import Table from "@/components/Table"
import { projetos } from "@/mock/data"
import { useAuth } from "@/context/AuthContext"
import { Helmet } from "react-helmet"

const statusClass = (status: string) => {
  const s = status?.toLowerCase?.() || ""
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (
    s.includes("pend") ||
    s.includes("anál") ||
    s.includes("analise") ||
    s.includes("em análise")
  )
    return "bg-amber-100 text-amber-800"
  if (s.includes("reprov") || s.includes("indefer"))
    return "bg-red-100 text-red-800"
  return "bg-neutral-light text-neutral"
}

const truncate = (txt: string, n = 80) =>
  txt?.length > n ? `${txt.slice(0, n)}…` : txt || "—"

export default function MyProjects() {
  const { user } = useAuth()
  const role = user?.role?.toUpperCase?.() || ""

  const filtered = useMemo(() => {
    return projetos.map((p) => {
      let funcao = "—"
      let ch = "—"
      let inicio = "—"
      let fim = "—"

      if (role === "COORDENADOR") {
        funcao = "Coordenador"
        ch = "40h"
        inicio = "2025-03-01"
        fim = "2025-12-31"
      } else if (role === "DISCENTE") {
        funcao = p.bolsistas > 0 ? "Bolsista" : "Voluntário"
        ch = p.bolsistas > 0 ? "20h" : "10h"
        inicio = "2025-04-01"
        fim = "2025-11-30"
      }

      return { ...p, funcao, ch, inicio, fim }
    })
  }, [role])

  const titulo =
    role === "COORDENADOR"
      ? "Projetos que Coordeno"
      : "Projetos em que Participo"

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TÍTULO DA PÁGINA */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-primary">
            {titulo}
          </h1>
          <p className="mt-2 text-sm text-neutral">
            Acompanhe os projetos de pesquisa vinculados ao seu perfil na PROPESQ.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-xl font-semibold text-primary">
              Nenhum projeto encontrado
            </div>
            <div className="mt-3 text-sm text-neutral">
              Você ainda não participa de nenhum projeto.
            </div>
          </div>
        ) : (
          <div className="bg-white">
            <Table
              data={filtered}
              cols={[
                {
                  key: "id",
                  header: "Código",
                  render: (r: any) => (
                    <span className="font-mono text-sm">
                      {r.id}
                    </span>
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
                  key: "funcao",
                  header: "Função",
                  render: (r: any) => (
                    <span className="text-sm">
                      {r.funcao}
                    </span>
                  ),
                },
                {
                  key: "ch",
                  header: "CH",
                  render: (r: any) => (
                    <span className="text-sm">
                      {r.ch}
                    </span>
                  ),
                },
                {
                  key: "inicio",
                  header: "Início",
                  render: (r: any) => (
                    <span className="text-sm">
                      {r.inicio}
                    </span>
                  ),
                },
                {
                  key: "fim",
                  header: "Fim",
                  render: (r: any) => (
                    <span className="text-sm">
                      {r.fim}
                    </span>
                  ),
                },
                {
                  key: "status",
                  header: "Situação",
                  render: (r: any) => (
                    <span
                      className={`
                        px-3 py-1
                        rounded-full
                        text-xs font-semibold
                        ${statusClass(r.status)}
                      `}
                    >
                      {r.status}
                    </span>
                  ),
                },
                {
                  key: "prazo",
                  header: "Prazo",
                  render: (r: any) => (
                    <span className="text-sm">
                      {r.prazo}
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
