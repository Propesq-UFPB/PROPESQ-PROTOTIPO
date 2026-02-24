import React from "react"
import Card from "@/components/Card"
import { projetos } from "@/mock/data"
import { Helmet } from "react-helmet"

export default function PlanForm() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Cadastro de Plano de Trabalho • PROPESQ</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* TÍTULO DA PÁGINA */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-primary">
            Cadastro de Plano de Trabalho
          </h1>
          <p className="mt-2 text-sm text-neutral">
            Preencha as informações abaixo para submeter o plano de trabalho
            vinculado a um projeto de pesquisa.
          </p>
        </div>

        <form className="space-y-8">
          {/* Projeto */}
          <div>
            <label className="block text-base font-semibold text-primary mb-2">
              Projeto vinculado
            </label>
            <select
              className="
                w-full
                rounded-xl
                border border-neutral-light
                px-4 py-3
                text-base
                focus:outline-none
                focus:ring-2
                focus:ring-primary-lighter/40
              "
            >
              {projetos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Metas */}
          <div>
            <label className="block text-base font-semibold text-primary mb-2">
              Metas
            </label>
            <textarea
              className="
                w-full min-h-[140px]
                rounded-xl
                border border-neutral-light
                px-4 py-3
                text-base
                focus:outline-none
                focus:ring-2
                focus:ring-primary-lighter/40
              "
              placeholder="Descreva as metas do plano de trabalho"
            />
          </div>

          {/* Cronograma */}
          <div>
            <label className="block text-base font-semibold text-primary mb-2">
              Cronograma
            </label>
            <textarea
              className="
                w-full min-h-[140px]
                rounded-xl
                border border-neutral-light
                px-4 py-3
                text-base
                focus:outline-none
                focus:ring-2
                focus:ring-primary-lighter/40
              "
              placeholder="Detalhe o cronograma das atividades"
            />
          </div>

          {/* Metodologia */}
          <div>
            <label className="block text-base font-semibold text-primary mb-2">
              Metodologia
            </label>
            <textarea
              className="
                w-full min-h-[140px]
                rounded-xl
                border border-neutral-light
                px-4 py-3
                text-base
                focus:outline-none
                focus:ring-2
                focus:ring-primary-lighter/40
              "
              placeholder="Explique a metodologia a ser utilizada"
            />
          </div>

          {/* Upload PDF */}
          <div>
            <label className="block text-base font-semibold text-primary mb-2">
              Plano em PDF
            </label>
            <input
              type="file"
              className="
                w-full
                rounded-xl
                border border-neutral-light
                px-4 py-3
                text-base
                file:mr-4
                file:rounded-lg
                file:border-0
                file:bg-neutral-light
                file:px-4
                file:py-2
                file:text-sm
                file:font-semibold
                file:text-primary
                hover:file:bg-primary/10
              "
            />
          </div>

          {/* AÇÃO */}
          <div className="pt-4">
            <button
              type="submit"
              className="
                w-full
                px-6 py-3
                rounded-xl
                text-base font-semibold
                bg-primary
                text-white
                hover:bg-primary-light
                transition-colors
                focus:outline-none
                focus:ring-2
                focus:ring-primary-lighter/50
              "
            >
              Enviar para aprovação
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
