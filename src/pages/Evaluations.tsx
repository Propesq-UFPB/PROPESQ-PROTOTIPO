import React from "react"
import Card from "@/components/Card"
import Table from "@/components/Table"
import { projetos } from "@/mock/data"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

export default function Evaluations() {
  const atribuidos = projetos.filter((p) =>
    ["Em análise", "Enviado", "Rascunho"].includes(p.status)
  )

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Avaliação de Projetos • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TÍTULO DA PÁGINA */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Avaliação de Projetos
          </h1>
          <p className="mt-2 text-sm text-neutral">
            Projetos atribuídos para análise e emissão de parecer.
          </p>
        </div>

        <div>
          <Table
            data={atribuidos.map((p) => ({
              ...p,
              titulo: "Título oculto",
              orientador: "—",
              discente: "—",
            }))}
            cols={[
              {
                key: "id",
                header: "ID",
                render: (r: any) => (
                  <span className="font-mono text-sm">{r.id}</span>
                ),
              },
              {
                key: "titulo",
                header: "Projeto",
                render: () => (
                  <span className="text-sm text-neutral">
                    Título oculto
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (r: any) => (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {r.status}
                  </span>
                ),
              },
              { key: "area", header: "Área" },
              { key: "centro", header: "Centro" },
              {
                key: "id",
                header: "Ação",
                render: (r: any) => (
                  <Link
                    to={`/avaliacoes/${r.id}`}
                    className="
                      inline-flex items-center
                      px-4 py-2
                      rounded-lg
                      text-xs font-semibold
                      bg-accent
                      text-primary
                      hover:bg-accent-medium
                      transition-colors
                    "
                  >
                    Avaliar
                  </Link>
                ),
              },
            ]}
            striped
            stickyHeader
            dense="compact"
          />
        </div>
      </div>
    </div>
  )
}
