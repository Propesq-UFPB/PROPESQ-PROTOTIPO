import React, { useState } from "react"
import Card from "@/components/Card"
import { Helmet } from "react-helmet"

export default function ProjectForm() {
  const [status, setStatus] = useState<"Rascunho" | "Enviado">("Rascunho")

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Cadastro de Projeto de Pesquisa • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* HEADER DA PÁGINA */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Cadastro de Projeto de Pesquisa
          </h1>
          <p className="mt-2 text-sm md:text-base text-neutral">
            Preencha as informações abaixo para cadastrar um novo projeto conforme o edital vigente
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              {/* TÍTULO */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Título do projeto
                </label>
                <input
                  id="titulo"
                  className="
                    w-full rounded-xl
                    border border-neutral-light
                    px-4 py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-lighter/40
                  "
                  placeholder="Informe o título do projeto"
                />
              </div>

              {/* RESUMO */}
              <div>
                <label
                  htmlFor="resumo"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Resumo
                </label>
                <textarea
                  id="resumo"
                  className="
                    w-full min-h-[140px]
                    rounded-xl
                    border border-neutral-light
                    px-4 py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary-lighter/40
                  "
                  placeholder="Breve resumo do projeto"
                />
              </div>

              {/* ÁREA / PALAVRAS-CHAVE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    Área do conhecimento (CNPq)
                  </label>
                  <input
                    id="area"
                    className="
                      w-full rounded-xl
                      border border-neutral-light
                      px-4 py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                    placeholder="Ex.: Computação / Inteligência Artificial"
                  />
                </div>

                <div>
                  <label
                    htmlFor="keywords"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    Palavras-chave
                  </label>
                  <input
                    id="keywords"
                    className="
                      w-full rounded-xl
                      border border-neutral-light
                      px-4 py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                    placeholder="IA; visão computacional; saúde"
                  />
                </div>
              </div>

              {/* OBJETIVOS / METODOLOGIA / RESULTADOS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="objetivos"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    Objetivos
                  </label>
                  <textarea
                    id="objetivos"
                    className="
                      w-full min-h-[130px]
                      rounded-xl
                      border border-neutral-light
                      px-4 py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="metodologia"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    Metodologia
                  </label>
                  <textarea
                    id="metodologia"
                    className="
                      w-full min-h-[130px]
                      rounded-xl
                      border border-neutral-light
                      px-4 py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="resultados"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    Resultados esperados
                  </label>
                  <textarea
                    id="resultados"
                    className="
                      w-full min-h-[130px]
                      rounded-xl
                      border border-neutral-light
                      px-4 py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary-lighter/40
                    "
                  />
                </div>
              </div>

              {/* UPLOAD */}
              <div>
                <label
                  htmlFor="arquivo"
                  className="block text-sm font-medium text-primary mb-1"
                >
                  Projeto completo (PDF)
                </label>
                <input
                  id="arquivo"
                  type="file"
                  className="
                    w-full rounded-xl
                    border border-neutral-light
                    px-4 py-3
                    text-sm
                    file:mr-4
                    file:rounded-lg
                    file:border-0
                    file:bg-neutral-light
                    file:px-4
                    file:py-2
                    file:text-xs
                    file:font-semibold
                    file:text-primary
                    hover:file:bg-primary/10
                  "
                />
              </div>

              {/* AÇÕES */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStatus("Rascunho")}
                  className="
                    px-6 py-3
                    rounded-xl
                    text-sm font-semibold
                    bg-accent
                    text-primary
                    hover:bg-accent-medium
                    transition-colors
                  "
                >
                  Salvar rascunho
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("Enviado")}
                  className="
                    px-6 py-3
                    rounded-xl
                    text-sm font-semibold
                    bg-primary
                    text-white
                    hover:bg-primary-light
                    transition-colors
                  "
                >
                  Submeter projeto
                </button>
              </div>
            </form>
          </div>

          {/* COLUNA LATERAL */}
          <aside className="space-y-6">
            {/* STATUS */}
            <Card title="Status do cadastro">
              <div className="flex justify-center">
                <span
                  className={`
                    px-6 py-2
                    rounded-full
                    text-sm font-semibold
                    ${
                      status === "Enviado"
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-light text-neutral"
                    }
                  `}
                >
                  {status}
                </span>
              </div>
            </Card>

            {/* ORIENTAÇÕES */}
            <Card title="Orientações importantes">
              <ul className="space-y-2 text-sm text-neutral">
                <li>• Utilize o template institucional do edital vigente.</li>
                <li>• O arquivo deve estar em PDF (máx. 10MB).</li>
                <li>• Todos os campos obrigatórios devem ser preenchidos.</li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
