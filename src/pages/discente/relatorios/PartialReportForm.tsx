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
} from "lucide-react"

type ReportStatus = "PENDENTE" | "EM_PREENCHIMENTO" | "REJEITADO" | "ENVIADO"

type ProjectOption = {
  id: string
  titulo: string
  edital: string
  orientador: string
  periodo: string
  prazoRelatorio: string
}

type PartialReportData = {
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
  atividadesRealizadas: string
  comparacaoPlanoExecutado: string
  outrasAtividades: string
  resultadosPreliminares: string
  dificuldadesEncontradas: string
  aceiteInformacoes: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const PROJECTS: ProjectOption[] = [
  {
    id: "proj_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    periodo: "2026.1",
    prazoRelatorio: "30/06/2026",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    periodo: "2025.1",
    prazoRelatorio: "20/06/2025",
  },
  {
    id: "proj_009",
    titulo: "Sistema Inteligente para Acompanhamento de Projetos de Extensão",
    edital: "PIBITI 2026",
    orientador: "Profa. Mariana Costa",
    periodo: "2026.1",
    prazoRelatorio: "10/07/2026",
  },
]

const REPORTS: PartialReportData[] = [
  {
    id: "rel_001",
    titulo: "Relatório Parcial PIBIC 2026",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    periodo: "2026.1",
    prazo: "30/06/2026",
    status: "PENDENTE",
  },
  {
    id: "rel_007",
    titulo: "Relatório Parcial PIBIC 2025",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    periodo: "2025.1",
    prazo: "20/06/2025",
    status: "REJEITADO",
    observacao:
      "Detalhar melhor as atividades efetivamente executadas e a diferença entre o plano original e o realizado.",
  },
]

const INITIAL_FORM: FormData = {
  projetoId: "",
  atividadesRealizadas: "",
  comparacaoPlanoExecutado: "",
  outrasAtividades: "",
  resultadosPreliminares: "",
  dificuldadesEncontradas: "",
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

  if (!data.atividadesRealizadas.trim()) {
    errors.atividadesRealizadas = "Informe as atividades realizadas."
  } else if (data.atividadesRealizadas.trim().length < 30) {
    errors.atividadesRealizadas = "Descreva as atividades com mais detalhes."
  }

  if (!data.comparacaoPlanoExecutado.trim()) {
    errors.comparacaoPlanoExecutado =
      "Explique a comparação entre o plano original e o executado."
  } else if (data.comparacaoPlanoExecutado.trim().length < 30) {
    errors.comparacaoPlanoExecutado = "Descreva melhor a comparação do plano."
  }

  if (!data.outrasAtividades.trim()) {
    errors.outrasAtividades = "Informe outras atividades complementares."
  } else if (data.outrasAtividades.trim().length < 15) {
    errors.outrasAtividades = "Descreva melhor as outras atividades."
  }

  if (!data.resultadosPreliminares.trim()) {
    errors.resultadosPreliminares = "Informe os resultados preliminares."
  } else if (data.resultadosPreliminares.trim().length < 30) {
    errors.resultadosPreliminares = "Descreva melhor os resultados preliminares."
  }

  if (!data.dificuldadesEncontradas.trim()) {
    errors.dificuldadesEncontradas = "Informe as dificuldades encontradas."
  } else if (data.dificuldadesEncontradas.trim().length < 15) {
    errors.dificuldadesEncontradas = "Descreva melhor as dificuldades encontradas."
  }

  if (!data.aceiteInformacoes) {
    errors.aceiteInformacoes =
      "É necessário confirmar a veracidade das informações."
  }

  return errors
}

export default function PartialReportForm() {
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
    ? `Relatório Parcial — ${selectedProject.edital}`
    : "Relatório Parcial"

  const progress = useMemo(() => {
    const fields = [
      form.projetoId,
      form.atividadesRealizadas,
      form.comparacaoPlanoExecutado,
      form.outrasAtividades,
      form.resultadosPreliminares,
      form.dificuldadesEncontradas,
    ]

    const filled = fields.filter((value) => value.trim().length > 0).length
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
      setSuccessMessage("Relatório parcial enviado com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Relatório Parcial • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        <header className="flex flex-col gap-3">
          {/* VOLTAR */}
          <div>
            <Link
              to="/discente/relatorios"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral hover:border-primary/30 hover:text-primary transition"
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
                  Relatório Parcial
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">{reportTitle}</h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Selecione o projeto e preencha o relatório parcial correspondente
                às atividades desenvolvidas no período.
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
                    Preenchimento do relatório
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
                          Prazo do relatório
                        </div>
                        <div className="mt-1 text-sm font-semibold text-primary">
                          {selectedProject.prazoRelatorio}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Atividades realizadas *
                    </label>
                    <textarea
                      value={form.atividadesRealizadas}
                      onChange={(e) =>
                        updateField("atividadesRealizadas", e.target.value)
                      }
                      rows={6}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Descreva as atividades efetivamente realizadas no projeto selecionado."
                    />
                    {errors.atividadesRealizadas && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.atividadesRealizadas}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Comparação entre plano original e executado *
                    </label>
                    <textarea
                      value={form.comparacaoPlanoExecutado}
                      onChange={(e) =>
                        updateField("comparacaoPlanoExecutado", e.target.value)
                      }
                      rows={6}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Explique se o plano do projeto foi seguido integralmente ou se houve ajustes."
                    />
                    {errors.comparacaoPlanoExecutado && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.comparacaoPlanoExecutado}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Outras atividades *
                    </label>
                    <textarea
                      value={form.outrasAtividades}
                      onChange={(e) =>
                        updateField("outrasAtividades", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Informe atividades complementares relacionadas ao projeto."
                    />
                    {errors.outrasAtividades && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.outrasAtividades}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resultados preliminares *
                    </label>
                    <textarea
                      value={form.resultadosPreliminares}
                      onChange={(e) =>
                        updateField("resultadosPreliminares", e.target.value)
                      }
                      rows={6}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Descreva os resultados preliminares obtidos no projeto."
                    />
                    {errors.resultadosPreliminares && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.resultadosPreliminares}
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
                  Selecione primeiro o projeto correto antes de preencher o relatório.
                </li>
                <li className="leading-6">
                  Descreva com objetividade o que foi realmente executado no período.
                </li>
                <li className="leading-6">
                  Diferencie claramente o plano original do que foi adaptado ou alterado.
                </li>
                <li className="leading-6">
                  Destaque resultados já obtidos, mesmo que ainda parciais.
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
                    {selectedProject?.prazoRelatorio ?? "—"}
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
                  <span>Revise o texto antes de enviar a versão final.</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>Salve o rascunho ao longo do preenchimento.</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>Garanta coerência entre projeto, atividades e resultados.</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}