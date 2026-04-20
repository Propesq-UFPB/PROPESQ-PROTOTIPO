import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  FolderKanban,
  CalendarDays,
  UserRound,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Award,
} from "lucide-react"

type ReportStatus = "PENDENTE" | "EM_PREENCHIMENTO" | "REJEITADO" | "ENVIADO"

type ProjectOption = {
  id: string
  titulo: string
  edital: string
  orientador: string
  periodo: string
  prazoRelatorioFinal: string
}

type FinalReportData = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  periodo: string
  prazo: string
  status: ReportStatus
  observacao?: string
}

type FormData = {
  projetoId: string
  resumoExecucao: string
  objetivosAlcancados: string
  resultadosFinais: string
  produtosGerados: string
  contribuicoesFormacao: string
  dificuldadesLimitacoes: string
  conclusoes: string
  aceiteInformacoes: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const PROJECTS: ProjectOption[] = [
  {
    id: "proj_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    orientador: "Profa. Helena Costa",
    periodo: "2026.1",
    prazoRelatorioFinal: "10/12/2026",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    periodo: "2025.1",
    prazoRelatorioFinal: "05/12/2025",
  },
  {
    id: "proj_009",
    titulo: "Sistema Inteligente para Acompanhamento de Projetos de Extensão",
    edital: "PIBITI 2026",
    orientador: "Profa. Mariana Costa",
    periodo: "2026.1",
    prazoRelatorioFinal: "15/12/2026",
  },
]

const REPORTS: FinalReportData[] = [
  {
    id: "rel_002",
    titulo: "Relatório Final PIBITI 2026",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    orientador: "Profa. Helena Costa",
    periodo: "2026.1",
    prazo: "10/12/2026",
    status: "EM_PREENCHIMENTO",
  },
  {
    id: "rel_005",
    titulo: "Relatório Final PIBIC 2025",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    periodo: "2025.1",
    prazo: "05/12/2025",
    status: "REJEITADO",
    observacao:
      "Apresentar com maior clareza os resultados finais obtidos, os produtos gerados e as conclusões decorrentes da execução do projeto.",
  },
]

const INITIAL_FORM: FormData = {
  projetoId: "",
  resumoExecucao: "",
  objetivosAlcancados: "",
  resultadosFinais: "",
  produtosGerados: "",
  contribuicoesFormacao: "",
  dificuldadesLimitacoes: "",
  conclusoes: "",
  aceiteInformacoes: false,
}

function getStatusLabel(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "Pendente"
    case "EM_PREENCHIMENTO":
      return "Em preenchimento"
    case "REJEITADO":
      return "Rejeitado"
    case "ENVIADO":
      return "Enviado"
    default:
      return status
  }
}

function getStatusClasses(status: ReportStatus) {
  switch (status) {
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_PREENCHIMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "ENVIADO":
      return "border-success/30 bg-success/10 text-success"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.projetoId) {
    errors.projetoId = "Selecione o projeto relacionado ao relatório."
  }

  if (!data.resumoExecucao.trim()) {
    errors.resumoExecucao = "Informe o resumo da execução do projeto."
  } else if (data.resumoExecucao.trim().length < 30) {
    errors.resumoExecucao = "Descreva a execução com mais detalhes."
  }

  if (!data.objetivosAlcancados.trim()) {
    errors.objetivosAlcancados = "Informe os objetivos alcançados."
  } else if (data.objetivosAlcancados.trim().length < 30) {
    errors.objetivosAlcancados = "Descreva melhor os objetivos alcançados."
  }

  if (!data.resultadosFinais.trim()) {
    errors.resultadosFinais = "Informe os resultados finais."
  } else if (data.resultadosFinais.trim().length < 30) {
    errors.resultadosFinais = "Descreva melhor os resultados finais."
  }

  if (!data.produtosGerados.trim()) {
    errors.produtosGerados = "Informe os produtos gerados."
  } else if (data.produtosGerados.trim().length < 20) {
    errors.produtosGerados = "Descreva melhor os produtos gerados."
  }

  if (!data.contribuicoesFormacao.trim()) {
    errors.contribuicoesFormacao = "Informe as contribuições para sua formação."
  } else if (data.contribuicoesFormacao.trim().length < 20) {
    errors.contribuicoesFormacao = "Descreva melhor as contribuições acadêmicas."
  }

  if (!data.dificuldadesLimitacoes.trim()) {
    errors.dificuldadesLimitacoes = "Informe dificuldades e limitações."
  } else if (data.dificuldadesLimitacoes.trim().length < 15) {
    errors.dificuldadesLimitacoes = "Descreva melhor as dificuldades encontradas."
  }

  if (!data.conclusoes.trim()) {
    errors.conclusoes = "Informe as conclusões finais."
  } else if (data.conclusoes.trim().length < 30) {
    errors.conclusoes = "Descreva melhor as conclusões."
  }

  if (!data.aceiteInformacoes) {
    errors.aceiteInformacoes =
      "É necessário confirmar a veracidade das informações."
  }

  return errors
}

export default function FinalReportForm() {
  const { id } = useParams()

  const report = REPORTS.find((item) => item.id === id) ?? REPORTS[0]

  const [form, setForm] = useState<FormData>({
    ...INITIAL_FORM,
    projetoId: report?.projetoId ?? "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successType, setSuccessType] = useState<"save" | "submit" | "">("")

  const selectedProject = useMemo(() => {
    return PROJECTS.find((project) => project.id === form.projetoId) ?? null
  }, [form.projetoId])

  const currentStatus = report?.status ?? "PENDENTE"
  const currentObservation = report?.observacao ?? ""

  const reportTitle = selectedProject
    ? `Relatório Final — ${selectedProject.edital}`
    : "Relatório Final"

  const progress = useMemo(() => {
    const fields = [
      form.projetoId,
      form.resumoExecucao,
      form.objetivosAlcancados,
      form.resultadosFinais,
      form.produtosGerados,
      form.contribuicoesFormacao,
      form.dificuldadesLimitacoes,
      form.conclusoes,
    ]

    const filled = fields.filter((value) =>
      typeof value === "string" ? value.trim().length > 0 : value
    ).length

    return Math.round((filled / fields.length) * 100)
  }, [form])

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
    setSuccessMessage("")
    setSuccessType("")
  }

  function handleSave() {
    setSaving(true)

    setTimeout(() => {
      setSaving(false)
      setSuccessType("save")
      setSuccessMessage("Rascunho salvo com sucesso.")
    }, 700)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    setSuccessMessage("")
    setSuccessType("")

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSuccessType("submit")
      setSuccessMessage("Relatório final enviado com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Relatório Final • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/relatorios"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para relatórios
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    currentStatus
                  )}`}
                >
                  <FileText size={14} />
                  {getStatusLabel(currentStatus)}
                </span>

                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  Relatório Final
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">{reportTitle}</h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Selecione o projeto e consolide as informações finais da execução,
                apresentando resultados, produtos e conclusões referentes ao
                projeto escolhido.
              </p>
            </div>
          </div>
        </header>

        {currentObservation && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Observação da avaliação anterior:
                </span>{" "}
                {currentObservation}
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FolderKanban size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Projeto selecionado</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {selectedProject?.titulo ?? "Nenhum projeto selecionado"}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <UserRound size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Orientador(a)</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {selectedProject?.orientador ?? "—"}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Preenchimento do relatório final
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Projeto relacionado *
                    </label>
                    <select
                      value={form.projetoId}
                      onChange={(e) => updateField("projetoId", e.target.value)}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    >
                      <option value="">Selecione um projeto</option>
                      {PROJECTS.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.titulo}
                        </option>
                      ))}
                    </select>
                    {errors.projetoId && (
                      <p className="mt-1 text-xs text-danger">{errors.projetoId}</p>
                    )}
                  </div>

                  {selectedProject && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                          Edital
                        </div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {selectedProject.edital}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                          Período
                        </div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {selectedProject.periodo}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                          Orientador(a)
                        </div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {selectedProject.orientador}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral">
                          Prazo do relatório final
                        </div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {selectedProject.prazoRelatorioFinal}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resumo da execução do projeto *
                    </label>
                    <textarea
                      value={form.resumoExecucao}
                      onChange={(e) =>
                        updateField("resumoExecucao", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Apresente uma visão geral da execução do projeto selecionado ao longo do período."
                    />
                    {errors.resumoExecucao && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.resumoExecucao}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Objetivos alcançados *
                    </label>
                    <textarea
                      value={form.objetivosAlcancados}
                      onChange={(e) =>
                        updateField("objetivosAlcancados", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Explique quais objetivos previstos foram alcançados total ou parcialmente no projeto selecionado."
                    />
                    {errors.objetivosAlcancados && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.objetivosAlcancados}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resultados finais *
                    </label>
                    <textarea
                      value={form.resultadosFinais}
                      onChange={(e) =>
                        updateField("resultadosFinais", e.target.value)
                      }
                      rows={6}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Descreva os principais resultados obtidos, evidências geradas, implementações, análises ou impactos alcançados."
                    />
                    {errors.resultadosFinais && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.resultadosFinais}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Produtos gerados *
                    </label>
                    <textarea
                      value={form.produtosGerados}
                      onChange={(e) =>
                        updateField("produtosGerados", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Informe produtos resultantes do projeto, como relatórios, dashboards, protótipos, artigos, apresentações, materiais ou sistemas."
                    />
                    {errors.produtosGerados && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.produtosGerados}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Contribuições para a formação acadêmica *
                    </label>
                    <textarea
                      value={form.contribuicoesFormacao}
                      onChange={(e) =>
                        updateField("contribuicoesFormacao", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Explique como a participação no projeto contribuiu para sua formação técnica, científica, acadêmica ou profissional."
                    />
                    {errors.contribuicoesFormacao && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.contribuicoesFormacao}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Dificuldades e limitações *
                    </label>
                    <textarea
                      value={form.dificuldadesLimitacoes}
                      onChange={(e) =>
                        updateField("dificuldadesLimitacoes", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Informe dificuldades metodológicas, técnicas, institucionais ou operacionais que impactaram a execução do projeto."
                    />
                    {errors.dificuldadesLimitacoes && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.dificuldadesLimitacoes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Conclusões finais *
                    </label>
                    <textarea
                      value={form.conclusoes}
                      onChange={(e) =>
                        updateField("conclusoes", e.target.value)
                      }
                      rows={6}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Apresente as conclusões gerais do projeto e sua avaliação final sobre a experiência desenvolvida."
                    />
                    {errors.conclusoes && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.conclusoes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start gap-3 text-sm text-primary">
                      <input
                        type="checkbox"
                        checked={form.aceiteInformacoes}
                        onChange={(e) =>
                          updateField("aceiteInformacoes", e.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-neutral/40"
                      />
                      <span>
                        Declaro que as informações apresentadas neste relatório
                        final são verdadeiras e representam adequadamente minha
                        participação e os resultados do projeto selecionado.
                      </span>
                    </label>
                    {errors.aceiteInformacoes && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.aceiteInformacoes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {(successMessage || Object.keys(errors).length > 0) && (
                <div className="space-y-2">
                  {successMessage && (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                        successType === "submit"
                          ? "border border-success/30 bg-success/10 text-success"
                          : "border border-primary/30 bg-primary/10 text-primary"
                      }`}
                    >
                      {successMessage}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <Link
                  to="/discente/relatorios"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  Cancelar
                </Link>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || submitting}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition disabled:opacity-60
                  "
                >
                  <Save size={16} />
                  {saving ? "Salvando..." : "Salvar rascunho"}
                </button>

                <button
                  type="submit"
                  disabled={saving || submitting}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition disabled:opacity-60
                  "
                >
                  <Send size={16} />
                  {submitting ? "Enviando..." : "Enviar relatório"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Orientações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3 text-sm text-neutral">
                <li className="leading-6">
                  Selecione primeiro o projeto correto antes de concluir o relatório final.
                </li>
                <li className="leading-6">
                  Consolide as informações de forma objetiva, mas completa.
                </li>
                <li className="leading-6">
                  Destaque resultados efetivos e produtos concretos gerados no projeto.
                </li>
                <li className="leading-6">
                  Relacione a experiência à sua formação acadêmica e profissional.
                </li>
              </ul>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados do relatório
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Título</div>
                  <div className="mt-1 font-medium text-primary">{reportTitle}</div>
                </div>

                <div>
                  <div className="text-neutral">Projeto</div>
                  <div className="mt-1 font-medium text-primary">
                    {selectedProject?.titulo ?? "Não selecionado"}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-medium text-primary">
                    {selectedProject?.edital ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período</div>
                  <div className="mt-1 font-medium text-primary">
                    {selectedProject?.periodo ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Prazo final</div>
                  <div className="mt-1 font-medium text-primary">
                    {selectedProject?.prazoRelatorioFinal ?? "—"}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Recomendações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-3 text-sm text-neutral">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>Revise a consistência entre objetivos, resultados e conclusões.</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>Descreva produtos e entregas de forma clara e verificável.</span>
                </div>

                <div className="flex items-start gap-3">
                  <Award size={16} className="mt-0.5 text-primary" />
                  <span>Valorize as contribuições da experiência para sua formação.</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}