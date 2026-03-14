import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  ClipboardList,
  FolderKanban,
  UserRound,
  BadgeCheck,
  CalendarDays,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Clock3,
} from "lucide-react"

type PlanStatus = "DISPONIVEL" | "EM_SELECAO" | "ENCERRADO"
type PlanArea =
  | "CIENCIA_DADOS"
  | "INTELIGENCIA_ARTIFICIAL"
  | "SISTEMAS_INFORMACAO"
  | "ENGENHARIA_SOFTWARE"
  | "EXTENSAO"

type PlanSummary = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  orientador: string
  edital: string
  area: PlanArea
  status: PlanStatus
  periodo: string
  vigencia: string
  resumo: string
}

type FormData = {
  motivacao: string
  experiencias: string
  competencias: string
  disponibilidade: string
  observacoes: string
  aceiteInformacoes: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

const PLANS: PlanSummary[] = [
  {
    id: "plan_001",
    titulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
    area: "CIENCIA_DADOS",
    status: "DISPONIVEL",
    periodo: "2026.1",
    vigencia: "01/05/2026 a 31/12/2026",
    resumo:
      "Plano voltado ao apoio na modelagem de dados, estruturação de indicadores e desenvolvimento de fluxos analíticos para a plataforma acadêmica.",
  },
  {
    id: "plan_002",
    titulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    orientador: "Profa. Helena Costa",
    edital: "PIBITI 2026",
    area: "INTELIGENCIA_ARTIFICIAL",
    status: "EM_SELECAO",
    periodo: "2026.1",
    vigencia: "10/05/2026 a 30/11/2026",
    resumo:
      "Plano focado em preparação de dados, classificação automatizada e apoio à análise de produção científica institucional.",
  },
  {
    id: "plan_004",
    titulo: "Plano de Trabalho em Engenharia de Software Acadêmica",
    projetoId: "proj_003",
    projetoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    orientador: "Prof. Marcos Oliveira",
    edital: "PROBEX 2025",
    area: "ENGENHARIA_SOFTWARE",
    status: "ENCERRADO",
    periodo: "2025.2",
    vigencia: "01/08/2025 a 20/12/2025",
    resumo:
      "Plano com foco em prototipação, construção de páginas e suporte ao fluxo de submissões e acompanhamento do ENIC.",
  },
]

const INITIAL_FORM: FormData = {
  motivacao: "",
  experiencias: "",
  competencias: "",
  disponibilidade: "",
  observacoes: "",
  aceiteInformacoes: false,
}

function getStatusLabel(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível"
    case "EM_SELECAO":
      return "Em seleção"
    case "ENCERRADO":
      return "Encerrado"
    default:
      return status
  }
}

function getStatusClasses(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "border-success/30 bg-success/10 text-success"
    case "EM_SELECAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getAreaLabel(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "Ciência de Dados"
    case "INTELIGENCIA_ARTIFICIAL":
      return "Inteligência Artificial"
    case "SISTEMAS_INFORMACAO":
      return "Sistemas de Informação"
    case "ENGENHARIA_SOFTWARE":
      return "Engenharia de Software"
    case "EXTENSAO":
      return "Extensão"
    default:
      return area
  }
}

function getAreaClasses(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "border-primary/30 bg-primary/10 text-primary"
    case "INTELIGENCIA_ARTIFICIAL":
      return "border-success/30 bg-success/10 text-success"
    case "SISTEMAS_INFORMACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENGENHARIA_SOFTWARE":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EXTENSAO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.motivacao.trim()) {
    errors.motivacao = "Informe sua motivação."
  } else if (data.motivacao.trim().length < 30) {
    errors.motivacao = "Descreva sua motivação com mais detalhes."
  }

  if (!data.experiencias.trim()) {
    errors.experiencias = "Informe suas experiências relevantes."
  } else if (data.experiencias.trim().length < 20) {
    errors.experiencias = "Descreva melhor suas experiências."
  }

  if (!data.competencias.trim()) {
    errors.competencias = "Informe suas competências."
  } else if (data.competencias.trim().length < 15) {
    errors.competencias = "Descreva melhor suas competências."
  }

  if (!data.disponibilidade.trim()) {
    errors.disponibilidade = "Informe sua disponibilidade."
  } else if (data.disponibilidade.trim().length < 10) {
    errors.disponibilidade = "Descreva melhor sua disponibilidade."
  }

  if (!data.aceiteInformacoes) {
    errors.aceiteInformacoes =
      "É necessário confirmar a veracidade das informações."
  }

  return errors
}

export default function InterestForm() {
  const { id } = useParams()

  const plan = PLANS.find((item) => item.id === id) ?? PLANS[0]

  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successType, setSuccessType] = useState<"save" | "submit" | "">("")

  const isClosed = plan.status === "ENCERRADO"

  const progress = useMemo(() => {
    const fields = [
      form.motivacao,
      form.experiencias,
      form.competencias,
      form.disponibilidade,
      form.observacoes,
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
    if (isClosed) return

    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSuccessType("save")
      setSuccessMessage("Manifestação salva como rascunho.")
    }, 700)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isClosed) return

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    setSuccessMessage("")
    setSuccessType("")

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccessType("submit")
      setSuccessMessage("Interesse enviado com sucesso.")
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Manifestação de Interesse • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to={`/discente/planos/${plan.id}`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para o plano
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getAreaClasses(
                  plan.area
                )}`}
              >
                <BookOpen size={14} />
                {getAreaLabel(plan.area)}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  plan.status
                )}`}
              >
                {plan.status === "DISPONIVEL" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Clock3 size={14} />
                )}
                {getStatusLabel(plan.status)}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-primary">
              Manifestação de interesse
            </h1>

            <p className="text-base text-neutral leading-7 max-w-4xl">
              Preencha as informações abaixo para demonstrar interesse no plano de trabalho selecionado.
            </p>
          </div>
        </header>

        {isClosed && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Plano encerrado:
                </span>{" "}
                este plano não está mais aceitando manifestações de interesse.
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <ClipboardList size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Plano</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {plan.titulo}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FolderKanban size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Projeto</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {plan.projetoTitulo}
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
                  {plan.orientador}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Progresso</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {progress}%
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
                    Formulário de interesse
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Motivação para participar *
                    </label>
                    <textarea
                      value={form.motivacao}
                      onChange={(e) => updateField("motivacao", e.target.value)}
                      rows={6}
                      disabled={isClosed}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none disabled:opacity-60
                      "
                      placeholder="Explique por que você deseja participar deste plano e como ele se conecta aos seus interesses acadêmicos."
                    />
                    {errors.motivacao && (
                      <p className="mt-1 text-xs text-danger">{errors.motivacao}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Experiências relevantes *
                    </label>
                    <textarea
                      value={form.experiencias}
                      onChange={(e) => updateField("experiencias", e.target.value)}
                      rows={5}
                      disabled={isClosed}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none disabled:opacity-60
                      "
                      placeholder="Descreva experiências acadêmicas, projetos, disciplinas ou atividades relacionadas."
                    />
                    {errors.experiencias && (
                      <p className="mt-1 text-xs text-danger">{errors.experiencias}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Competências e habilidades *
                    </label>
                    <textarea
                      value={form.competencias}
                      onChange={(e) => updateField("competencias", e.target.value)}
                      rows={4}
                      disabled={isClosed}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none disabled:opacity-60
                      "
                      placeholder="Informe competências que podem contribuir com o desenvolvimento do plano."
                    />
                    {errors.competencias && (
                      <p className="mt-1 text-xs text-danger">{errors.competencias}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Disponibilidade *
                    </label>
                    <textarea
                      value={form.disponibilidade}
                      onChange={(e) => updateField("disponibilidade", e.target.value)}
                      rows={4}
                      disabled={isClosed}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none disabled:opacity-60
                      "
                      placeholder="Descreva sua disponibilidade semanal, horários e condições de acompanhamento."
                    />
                    {errors.disponibilidade && (
                      <p className="mt-1 text-xs text-danger">{errors.disponibilidade}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Observações adicionais
                    </label>
                    <textarea
                      value={form.observacoes}
                      onChange={(e) => updateField("observacoes", e.target.value)}
                      rows={4}
                      disabled={isClosed}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary resize-none disabled:opacity-60
                      "
                      placeholder="Adicione observações complementares, caso necessário."
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
                        disabled={isClosed}
                        className="mt-1 h-4 w-4 rounded border-neutral/40"
                      />
                      <span>
                        Declaro que as informações prestadas são verdadeiras e refletem meu interesse real neste plano de trabalho.
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

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <Link
                  to={`/discente/planos/${plan.id}`}
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
                  disabled={saving || submitting || isClosed}
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
                  disabled={saving || submitting || isClosed}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition disabled:opacity-60
                  "
                >
                  <Send size={16} />
                  {submitting ? "Enviando..." : "Enviar interesse"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados do plano
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Plano</div>
                  <div className="mt-1 font-medium text-primary">
                    {plan.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Projeto</div>
                  <div className="mt-1 font-medium text-primary">
                    {plan.projetoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-medium text-primary">
                    {plan.edital}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período</div>
                  <div className="mt-1 font-medium text-primary">
                    {plan.periodo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Vigência</div>
                  <div className="mt-1 font-medium text-primary">
                    {plan.vigencia}
                  </div>
                </div>
              </div>
            </Card>

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
                  Relacione sua motivação ao tema e aos objetivos do plano.
                </li>
                <li className="leading-6">
                  Destaque experiências acadêmicas e competências relevantes.
                </li>
                <li className="leading-6">
                  Informe sua disponibilidade de forma realista e objetiva.
                </li>
                <li className="leading-6">
                  Revise o texto antes de enviar a manifestação definitiva.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}