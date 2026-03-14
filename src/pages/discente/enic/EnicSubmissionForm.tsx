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
  Presentation,
} from "lucide-react"

type EnicStatus = "RASCUNHO" | "PENDENTE" | "REJEITADO"

type EnicDraft = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  evento: string
  prazo: string
  status: EnicStatus
  observacao?: string
}

type FormData = {
  tituloTrabalho: string
  projetoId: string
  modalidade: string
  areaTematica: string
  resumo: string
  palavrasChave: string
  metodologia: string
  resultados: string
  conclusoes: string
  coautores: string
  aceiteInformacoes: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const DRAFTS: EnicDraft[] = [
  {
    id: "enic_001",
    titulo: "Submissão ENIC 2026",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    evento: "ENIC 2026",
    prazo: "15/08/2026",
    status: "RASCUNHO",
  },
  {
    id: "enic_005",
    titulo: "Submissão ENIC 2024",
    projetoId: "proj_005",
    projetoTitulo: "Repositório Digital para Produção Discente",
    edital: "PROBEX 2024",
    orientador: "Profa. Lúcia Fernandes",
    evento: "ENIC 2024",
    prazo: "12/08/2024",
    status: "REJEITADO",
    observacao:
      "A submissão anterior apresentou inconsistências na estrutura do texto e inadequação ao formato exigido pelo evento.",
  },
]

const AVAILABLE_PROJECTS = [
  {
    id: "proj_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
  },
  {
    id: "proj_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    orientador: "Profa. Helena Costa",
    edital: "PIBITI 2026",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    orientador: "Prof. Ricardo Lima",
    edital: "PIBIC 2025",
  },
]

const INITIAL_FORM: FormData = {
  tituloTrabalho: "",
  projetoId: "",
  modalidade: "",
  areaTematica: "",
  resumo: "",
  palavrasChave: "",
  metodologia: "",
  resultados: "",
  conclusoes: "",
  coautores: "",
  aceiteInformacoes: false,
}

function getStatusLabel(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho"
    case "PENDENTE":
      return "Pendente"
    case "REJEITADO":
      return "Rejeitado"
    default:
      return status
  }
}

function getStatusClasses(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.tituloTrabalho.trim()) {
    errors.tituloTrabalho = "Informe o título do trabalho."
  } else if (data.tituloTrabalho.trim().length < 10) {
    errors.tituloTrabalho = "Informe um título mais descritivo."
  }

  if (!data.projetoId.trim()) {
    errors.projetoId = "Selecione um projeto vinculado."
  }

  if (!data.modalidade.trim()) {
    errors.modalidade = "Selecione a modalidade."
  }

  if (!data.areaTematica.trim()) {
    errors.areaTematica = "Informe a área temática."
  }

  if (!data.resumo.trim()) {
    errors.resumo = "Informe o resumo do trabalho."
  } else if (data.resumo.trim().length < 50) {
    errors.resumo = "Descreva o resumo com mais detalhes."
  }

  if (!data.palavrasChave.trim()) {
    errors.palavrasChave = "Informe as palavras-chave."
  }

  if (!data.metodologia.trim()) {
    errors.metodologia = "Informe a metodologia."
  } else if (data.metodologia.trim().length < 30) {
    errors.metodologia = "Descreva a metodologia com mais detalhes."
  }

  if (!data.resultados.trim()) {
    errors.resultados = "Informe os principais resultados."
  } else if (data.resultados.trim().length < 30) {
    errors.resultados = "Descreva melhor os resultados."
  }

  if (!data.conclusoes.trim()) {
    errors.conclusoes = "Informe as conclusões."
  } else if (data.conclusoes.trim().length < 20) {
    errors.conclusoes = "Descreva melhor as conclusões."
  }

  if (!data.aceiteInformacoes) {
    errors.aceiteInformacoes =
      "É necessário confirmar a veracidade das informações."
  }

  return errors
}

export default function EnicSubmissionForm() {
  const { id } = useParams()

  const draft = DRAFTS.find((item) => item.id === id) ?? {
    id: "novo",
    titulo: "Nova Submissão ENIC",
    projetoId: "",
    projetoTitulo: "",
    edital: "-",
    orientador: "-",
    evento: "ENIC 2026",
    prazo: "15/08/2026",
    status: "RASCUNHO" as EnicStatus,
  }

  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successType, setSuccessType] = useState<"save" | "submit" | "">("")

  const selectedProject = useMemo(() => {
    return AVAILABLE_PROJECTS.find((project) => project.id === form.projetoId)
  }, [form.projetoId])

  const progress = useMemo(() => {
    const fields = [
      form.tituloTrabalho,
      form.projetoId,
      form.modalidade,
      form.areaTematica,
      form.resumo,
      form.palavrasChave,
      form.metodologia,
      form.resultados,
      form.conclusoes,
      form.coautores,
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
      setSuccessMessage("Rascunho da submissão salvo com sucesso.")
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
      setSuccessMessage("Submissão ENIC enviada com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Submissão ENIC • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/enic"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para submissões ENIC
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    draft.status
                  )}`}
                >
                  <FileText size={14} />
                  {getStatusLabel(draft.status)}
                </span>

                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {draft.evento}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                {draft.id === "novo" ? "Nova submissão ENIC" : draft.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Preencha os dados do trabalho acadêmico e realize a submissão vinculada ao projeto selecionado.
              </p>
            </div>
          </div>
        </header>

        {/* OBSERVAÇÃO */}
        {draft.observacao && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Observação da submissão anterior:
                </span>{" "}
                {draft.observacao}
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Presentation size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Evento</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {draft.evento}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Prazo</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {draft.prazo}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <ClipboardList size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Progresso</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {progress}%
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Status</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {getStatusLabel(draft.status)}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* FORM + LATERAL */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Dados da submissão
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Título do trabalho *
                    </label>
                    <input
                      type="text"
                      value={form.tituloTrabalho}
                      onChange={(e) =>
                        updateField("tituloTrabalho", e.target.value)
                      }
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                      placeholder="Digite o título do trabalho"
                    />
                    {errors.tituloTrabalho && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.tituloTrabalho}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Projeto vinculado *
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
                      {AVAILABLE_PROJECTS.map((project) => (
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
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
                      <div className="font-semibold text-primary">
                        Projeto selecionado
                      </div>
                      <div className="mt-2 space-y-1 text-neutral">
                        <p>
                          <span className="font-medium text-primary">Projeto:</span>{" "}
                          {selectedProject.titulo}
                        </p>
                        <p>
                          <span className="font-medium text-primary">Orientador(a):</span>{" "}
                          {selectedProject.orientador}
                        </p>
                        <p>
                          <span className="font-medium text-primary">Edital:</span>{" "}
                          {selectedProject.edital}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Modalidade *
                      </label>
                      <select
                        value={form.modalidade}
                        onChange={(e) => updateField("modalidade", e.target.value)}
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary
                        "
                      >
                        <option value="">Selecione</option>
                        <option value="RESUMO_SIMPLES">Resumo simples</option>
                        <option value="RESUMO_EXPANDIDO">Resumo expandido</option>
                        <option value="APRESENTACAO">Apresentação</option>
                      </select>
                      {errors.modalidade && (
                        <p className="mt-1 text-xs text-danger">{errors.modalidade}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-1.5">
                        Área temática *
                      </label>
                      <input
                        type="text"
                        value={form.areaTematica}
                        onChange={(e) =>
                          updateField("areaTematica", e.target.value)
                        }
                        className="
                          w-full rounded-xl border border-neutral/30 bg-white
                          px-4 py-3 text-sm text-primary outline-none
                          focus:border-primary
                        "
                        placeholder="Ex.: Ciência de Dados"
                      />
                      {errors.areaTematica && (
                        <p className="mt-1 text-xs text-danger">{errors.areaTematica}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resumo *
                    </label>
                    <textarea
                      value={form.resumo}
                      onChange={(e) => updateField("resumo", e.target.value)}
                      rows={6}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Apresente o contexto, objetivo e visão geral do trabalho."
                    />
                    {errors.resumo && (
                      <p className="mt-1 text-xs text-danger">{errors.resumo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Palavras-chave *
                    </label>
                    <input
                      type="text"
                      value={form.palavrasChave}
                      onChange={(e) =>
                        updateField("palavrasChave", e.target.value)
                      }
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                      placeholder="Ex.: ciência de dados, IA, pesquisa acadêmica"
                    />
                    {errors.palavrasChave && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.palavrasChave}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Metodologia *
                    </label>
                    <textarea
                      value={form.metodologia}
                      onChange={(e) =>
                        updateField("metodologia", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Descreva métodos, técnicas, etapas e procedimentos utilizados."
                    />
                    {errors.metodologia && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.metodologia}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Resultados *
                    </label>
                    <textarea
                      value={form.resultados}
                      onChange={(e) =>
                        updateField("resultados", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Descreva os principais resultados obtidos no trabalho."
                    />
                    {errors.resultados && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.resultados}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Conclusões *
                    </label>
                    <textarea
                      value={form.conclusoes}
                      onChange={(e) =>
                        updateField("conclusoes", e.target.value)
                      }
                      rows={5}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Apresente as conclusões principais do trabalho."
                    />
                    {errors.conclusoes && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.conclusoes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Coautores
                    </label>
                    <textarea
                      value={form.coautores}
                      onChange={(e) =>
                        updateField("coautores", e.target.value)
                      }
                      rows={3}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none
                      "
                      placeholder="Informe nomes de coautores, se houver."
                    />
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
                        Declaro que as informações da submissão são verdadeiras,
                        compatíveis com o projeto e atendem às exigências do evento.
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
                  to="/discente/enic"
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
                  {submitting ? "Enviando..." : "Submeter trabalho"}
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
                  Verifique se o título e o resumo refletem fielmente o trabalho desenvolvido.
                </li>
                <li className="leading-6">
                  Utilize linguagem objetiva e alinhada ao formato acadêmico.
                </li>
                <li className="leading-6">
                  Destaque metodologia, resultados e conclusões com clareza.
                </li>
                <li className="leading-6">
                  Revise antes de submeter a versão final ao evento.
                </li>
              </ul>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados da submissão
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Evento</div>
                  <div className="mt-1 font-medium text-primary">
                    {draft.evento}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Prazo final</div>
                  <div className="mt-1 font-medium text-primary">
                    {draft.prazo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status</div>
                  <div className="mt-1 font-medium text-primary">
                    {getStatusLabel(draft.status)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital vinculado</div>
                  <div className="mt-1 font-medium text-primary">
                    {selectedProject?.edital || draft.edital}
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
                  <span>Salve o rascunho ao longo do preenchimento.</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-success" />
                  <span>Revise coerência entre resumo, metodologia e resultados.</span>
                </div>

                <div className="flex items-start gap-3">
                  <FolderKanban size={16} className="mt-0.5 text-primary" />
                  <span>Garanta aderência do trabalho ao projeto vinculado.</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}