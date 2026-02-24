import React, { useState } from "react"
import Card from "@/components/Card"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet"

export default function EvaluationDetail() {
  const { id } = useParams<{ id: string }>()
  const [nota, setNota] = useState(8)
  const [parecer, setParecer] = useState(
    "Projeto bem estruturado, metodologia adequada."
  )

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Avaliação do Projeto • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TÍTULO DA PÁGINA */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Avaliação do Projeto
          </h1>
          <p className="mt-2 text-sm text-neutral">
            Emissão de parecer e atribuição de nota para o projeto selecionado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            {/* AVALIAÇÃO */}
            <Card title={`Projeto ${id} — Avaliação`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parecer */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Parecer qualitativo
                  </label>
                  <textarea
                    className="
                      w-full min-h-[160px]
                      rounded-xl
                      border border-neutral-light
                      px-4 py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                    value={parecer}
                    onChange={(e) => setParecer(e.target.value)}
                  />
                </div>

                {/* Nota */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Nota (0–10)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className="
                      w-full
                      rounded-xl
                      border border-neutral-light
                      px-4 py-2
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                    value={nota}
                    onChange={(e) => setNota(+e.target.value)}
                  />

                  {/* AÇÕES */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      className="
                        px-5 py-2.5
                        rounded-lg
                        text-sm font-semibold
                        bg-accent
                        text-primary
                        hover:bg-accent-medium
                        transition-colors
                      "
                    >
                      Salvar
                    </button>

                    <button
                      className="
                        px-5 py-2.5
                        rounded-lg
                        text-sm font-semibold
                        bg-primary
                        text-white
                        hover:bg-primary-light
                        transition-colors
                      "
                    >
                      Enviar parecer
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* DOCUMENTO */}
            <Card title="Documento submetido (PDF)">
              <div className="h-48 rounded-xl bg-neutral-light flex items-center justify-center text-sm text-neutral">
                Pré-visualização do documento (simulada)
              </div>
            </Card>
          </div>

          {/* COLUNA LATERAL */}
          <div className="space-y-6">
            <Card title="Status da Avaliação">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  Em análise
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
