import { FormEvent, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileSignature,
  FileText,
  FolderKanban,
  GraduationCap,
  History,
  Info,
  Notebook,
  Save,
  Send,
  Star,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react"

type EvaluationType = "Projeto" | "Plano de trabalho"

type EvaluationStatus =
  | "Pendente"
  | "Em avaliação"
  | "Aprovado"
  | "Aprovado com ajustes"
  | "Reprovado"

type EvaluationDecision =
  | "Selecione o resultado"
  | "Aprovado"
  | "Aprovado com ajustes"
  | "Reprovado"

type Criterion = {
  id: number
  label: string
  description: string
  score: string
}

type HistoryItem = {
  id: number
  date: string
  title: string
  description: string
  status: "success" | "info" | "warning" | "danger" | "neutral"
}

type EvaluationDetail = {
  id: number
  projectId: number
  title: string
  projectTitle: string
  type: EvaluationType
  edital: string
  ano: string
  area: string
  proponent: string
  submittedAt: string
  deadline: string
  status: EvaluationStatus
  reviewer: string | null
  previousScore: number | null
  summary: string
  objectives: string
  methodology: string
  expectedResults: string
  schedule: string
  references: string
  observations: string
  history: HistoryItem[]
}

const evaluationMock: EvaluationDetail = {
  id: 3,
  projectId: 2,
  title: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
  projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
  type: "Projeto",
  edital: "PIBITI 2026",
  ano: "2026",
  area: "Ciência de Dados",
  proponent: "Profa. Dra. Marina Costa",
  submittedAt: "07/05/2026",
  deadline: "18/05/2026",
  status: "Em avaliação",
  reviewer: "Coordenação de Pesquisa",
  previousScore: null,
  summary:
    "O projeto propõe o desenvolvimento de indicadores e painéis analíticos para acompanhamento de dados educacionais, apoiando a gestão acadêmica e a tomada de decisão com base em dados.",
  objectives:
    "Construir uma solução analítica para consolidar dados acadêmicos, gerar indicadores de acompanhamento e apoiar processos de monitoramento institucional.",
  methodology:
    "A metodologia contempla levantamento de requisitos, análise das fontes de dados, modelagem dos indicadores, construção de protótipos de painéis, validação com usuários e documentação dos resultados.",
  expectedResults:
    "Espera-se entregar um conjunto de indicadores, painéis de visualização, relatório técnico e documentação metodológica sobre o uso dos dados educacionais analisados.",
  schedule:
    "Mês 1-2: levantamento e revisão. Mês 3-5: tratamento e modelagem dos dados. Mês 6-8: desenvolvimento dos painéis. Mês 9-11: validação. Mês 12: relatório final.",
  references:
    "Trabalhos sobre learning analytics, ciência de dados educacionais, visualização de dados, governança de dados e apoio à decisão institucional.",
  observations:
    "A proposta apresenta boa aderência ao edital, mas requer análise detalhada da viabilidade técnica, clareza metodológica e coerência entre objetivos, atividades e entregas.",
  history: [
    {
      id: 1,
      date: "07/05/2026",
      title: "Avaliação iniciada",
      description: "O item foi marcado como em avaliação pela coordenação.",
      status: "info",
    },
    {
      id: 2,
      date: "07/05/2026",
      title: "Projeto submetido",
      description: "O coordenador enviou o projeto para avaliação.",
      status: "neutral",
    },
    {
      id: 3,
      date: "04/05/2026",
      title: "Rascunho finalizado",
      description: "A proposta foi concluída antes do envio.",
      status: "neutral",
    },
  ],
}

const initialCriteria: Criterion[] = [
  {
    id: 1,
    label: "Aderência ao edital",
    description: "Avalia se a proposta atende aos objetivos, regras e escopo do edital selecionado.",
    score: "",
  },
  {
    id: 2,
    label: "Relevância acadêmica e científica",
    description: "Considera a contribuição da proposta para pesquisa, inovação, formação discente ou impacto institucional.",
    score: "",
  },
  {
    id: 3,
    label: "Clareza dos objetivos",
    description: "Avalia se os objetivos estão bem definidos, coerentes e mensuráveis.",
    score: "",
  },
  {
    id: 4,
    label: "Consistência metodológica",
    description: "Analisa a adequação dos métodos, etapas, técnicas e procedimentos previstos.",
    score: "",
  },
  {
    id: 5,
    label: "Viabilidade de execução",
    description: "Considera cronograma, recursos, carga de trabalho, equipe e possibilidade de entrega.",
    score: "",
  },
  {
    id: 6,
    label: "Qualidade dos resultados esperados",
    description: "Avalia se as entregas previstas são relevantes, claras e compatíveis com o projeto.",
    score: "",
  },
]

function getStatusClass(status: EvaluationStatus | EvaluationDecision) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aprovado com ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Em avaliação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Pendente":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: EvaluationStatus | EvaluationDecision) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Aprovado com ajustes":
      return <AlertCircle size={14} />
    case "Em avaliação":
      return <ClipboardList size={14} />
    case "Pendente":
      return <Timer size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    default:
      return <ClipboardList size={14} />
  }
}

function getTypeClass(type: EvaluationType) {
  if (type === "Projeto") {
    return "border-primary/20 bg-primary/5 text-primary"
  }

  return "border-sky-200 bg-sky-50 text-sky-700"
}

function getTypeIcon(type: EvaluationType) {
  if (type === "Projeto") {
    return <FolderKanban size={14} />
  }

  return <Notebook size={14} />
}

function getHistoryDotClass(status: HistoryItem["status"]) {
  switch (status) {
    case "success":
      return "bg-emerald-500"
    case "info":
      return "bg-blue-500"
    case "warning":
      return "bg-amber-500"
    case "danger":
      return "bg-red-500"
    case "neutral":
    default:
      return "bg-neutral/50"
  }
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[150px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

export default function CoordinatorEvaluationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const evaluation = evaluationMock

  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria)
  const [decision, setDecision] = useState<EvaluationDecision>("Selecione o resultado")
  const [generalOpinion, setGeneralOpinion] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [lastAction, setLastAction] = useState<"draft" | "submit" | null>(null)

  const calculatedScore = useMemo(() => {
    const validScores = criteria
      .map((criterion) => Number(criterion.score))
      .filter((score) => !Number.isNaN(score) && score >= 0)

    if (validScores.length === 0) {
      return null
    }

    const total = validScores.reduce((acc, score) => acc + score, 0)
    return total / validScores.length
  }, [criteria])

  const completedCriteria = useMemo(() => {
    return criteria.filter((criterion) => criterion.score !== "").length
  }, [criteria])

  const isReadyToSubmit = useMemo(() => {
    const allCriteriaFilled = criteria.every((criterion) => criterion.score !== "")
    const hasDecision = decision !== "Selecione o resultado"
    const hasOpinion = generalOpinion.trim().length > 0

    return allCriteriaFilled && hasDecision && hasOpinion
  }, [criteria, decision, generalOpinion])

  function updateCriterionScore(id: number, value: string) {
    const numericValue = Number(value)

    if (value !== "" && (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 10)) {
      return
    }

    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === id
          ? {
              ...criterion,
              score: value,
            }
          : criterion
      )
    )
  }

  function handleSaveDraft() {
    setLastAction("draft")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLastAction("submit")

    if (!isReadyToSubmit) {
      return
    }

    navigate("/coordenador/avaliacoes")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* BOTÃO DE VOLTAR */}
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/avaliacoes"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para avaliações
          </Link>
        </div>

        {/* HEADER */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <FileSignature size={14} />
                  Avaliação #{id ?? evaluation.id}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClass(
                    evaluation.type
                  )}`}
                >
                  {getTypeIcon(evaluation.type)}
                  {evaluation.type}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                    evaluation.status
                  )}`}
                >
                  {getStatusIcon(evaluation.status)}
                  {evaluation.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-primary">
                {evaluation.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                Registre o parecer técnico e o resultado da avaliação para o item submetido.
              </p>

              {evaluation.type === "Plano de trabalho" && (
                <p className="mt-2 text-sm leading-6 text-neutral">
                  Projeto vinculado:{" "}
                  <span className="font-semibold text-primary">
                    {evaluation.projectTitle}
                  </span>
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral">
                <span className="inline-flex items-center gap-2">
                  <GraduationCap size={16} />
                  {evaluation.area}
                </span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span>{evaluation.edital}</span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Prazo: {evaluation.deadline}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-neutral/5 px-5 py-4 lg:min-w-[220px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                Nota calculada
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">
                  {calculatedScore !== null ? calculatedScore.toFixed(1) : "--"}
                </span>
                <span className="pb-1 text-sm text-neutral">
                  / 10
                </span>
              </div>

              <p className="mt-2 text-xs text-neutral">
                {completedCriteria} de {criteria.length} critério(s) preenchido(s)
              </p>
            </div>
          </div>
        </section>

        {/* ALERTAS */}
        {lastAction === "draft" && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
            <div className="flex gap-3">
              <Info size={18} className="mt-0.5 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Rascunho de avaliação salvo no protótipo
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Em uma versão integrada, essa ação salvaria a avaliação sem publicar o resultado final.
                </p>
              </div>
            </div>
          </section>
        )}

        {lastAction === "submit" && !isReadyToSubmit && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex gap-3">
              <AlertCircle size={18} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Existem campos obrigatórios pendentes
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-700">
                  Preencha todos os critérios de pontuação, selecione o resultado final e informe o parecer geral antes
                  de concluir a avaliação.
                </p>
              </div>
            </div>
          </section>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INDICADORES */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Edital
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {evaluation.edital}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ClipboardCheck size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                Ano {evaluation.ano}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Proponente
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    Coordenador
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <UserRound size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                {evaluation.proponent}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Submissão
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {evaluation.submittedAt}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <CalendarDays size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                Prazo final em {evaluation.deadline}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Resultado
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {decision === "Selecione o resultado" ? "Pendente" : decision}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Star size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                Definido ao concluir avaliação
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {/* CONTEÚDO AVALIADO */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      Conteúdo submetido
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Revise as informações da proposta antes de registrar a pontuação e o parecer.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <TextBlock title="Resumo" text={evaluation.summary} />
                  <TextBlock title="Objetivos" text={evaluation.objectives} />
                  <TextBlock title="Metodologia" text={evaluation.methodology} />
                  <TextBlock title="Resultados esperados" text={evaluation.expectedResults} />
                  <TextBlock title="Cronograma" text={evaluation.schedule} />
                  <TextBlock title="Referências" text={evaluation.references} />
                  <TextBlock title="Observações da submissão" text={evaluation.observations} />
                </div>
              </section>

              {/* CRITÉRIOS */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <ClipboardList size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      Critérios de avaliação
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Atribua uma nota de 0 a 10 para cada critério. A nota final será calculada automaticamente pela
                      média simples.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="rounded-2xl border border-neutral/20 bg-neutral/5 p-5"
                    >
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_140px] lg:items-start">
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {criterion.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-neutral">
                            {criterion.description}
                          </p>
                        </div>

                        <div>
                          <label className={labelClassName}>
                            Nota
                          </label>

                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={criterion.score}
                            onChange={(event) =>
                              updateCriterionScore(criterion.id, event.target.value)
                            }
                            placeholder="0 a 10"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* PARECER */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <FileSignature size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      Parecer técnico
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Registre a justificativa da avaliação e, se necessário, recomendações de ajuste para o coordenador.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClassName}>
                      Resultado final <span className="text-red-500">*</span>
                    </label>

                    <select
                      value={decision}
                      onChange={(event) => setDecision(event.target.value as EvaluationDecision)}
                      className={inputClassName}
                    >
                      <option value="Selecione o resultado">
                        Selecione o resultado
                      </option>
                      <option value="Aprovado">
                        Aprovado
                      </option>
                      <option value="Aprovado com ajustes">
                        Aprovado com ajustes
                      </option>
                      <option value="Reprovado">
                        Reprovado
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClassName}>
                      Parecer geral <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      value={generalOpinion}
                      onChange={(event) => setGeneralOpinion(event.target.value)}
                      placeholder="Descreva a análise geral da proposta, destacando pontos fortes, fragilidades e justificativa da decisão."
                      className={textareaClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>
                      Recomendações ou ajustes solicitados
                    </label>

                    <textarea
                      value={recommendations}
                      onChange={(event) => setRecommendations(event.target.value)}
                      placeholder="Informe ajustes necessários, recomendações metodológicas, correções no plano ou observações adicionais."
                      className={textareaClassName}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* LATERAL */}
            <aside className="space-y-6">
              {/* RESUMO DA AVALIAÇÃO */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <h2 className="text-base font-semibold text-primary">
                  Resumo da avaliação
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral">
                  Confira os dados calculados antes de concluir.
                </p>

                <div className="mt-5 space-y-3">
                  <SummaryItem label="Tipo" value={evaluation.type} />
                  <SummaryItem label="Critérios preenchidos" value={`${completedCriteria}/${criteria.length}`} />
                  <SummaryItem
                    label="Nota final"
                    value={calculatedScore !== null ? calculatedScore.toFixed(1) : "Não calculada"}
                  />
                  <SummaryItem label="Resultado" value={decision} />
                </div>

                {decision !== "Selecione o resultado" && (
                  <div
                    className={`mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                      decision
                    )}`}
                  >
                    {getStatusIcon(decision)}
                    {decision}
                  </div>
                )}
              </section>

              {/* HISTÓRICO */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <History size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      Histórico
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Movimentações da avaliação.
                    </p>
                  </div>
                </div>

                <div className="relative space-y-5">
                  {evaluation.history.map((item, index) => (
                    <div key={item.id} className="relative flex gap-3">
                      {index !== evaluation.history.length - 1 && (
                        <span className="absolute left-[7px] top-5 h-full w-px bg-neutral/20" />
                      )}

                      <span
                        className={`relative mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${getHistoryDotClass(
                          item.status
                        )}`}
                      />

                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs font-medium text-neutral">
                          {item.date}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-neutral">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* INFORMAÇÃO */}
              <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <div className="flex gap-3">
                  <Info size={18} className="mt-0.5 shrink-0 text-blue-700" />

                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Regra do fluxo
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-700">
                      Apenas projetos e planos aprovados poderão seguir para a etapa de indicação de discentes.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </section>

          {/* AÇÕES */}
          <section className="sticky bottom-0 z-10 -mx-6 border-t border-neutral/20 bg-[#F3F4F6]/95 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-neutral/30 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Parecer da avaliação
                </p>
                <p className="mt-1 text-xs text-neutral">
                  Salve como rascunho ou conclua a avaliação para registrar o resultado final.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  <Save size={16} />
                  Salvar rascunho
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <Send size={16} />
                  Concluir avaliação
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  )
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-5">
      <p className="text-sm font-semibold text-primary">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-neutral">
        {text}
      </p>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-6 text-primary">
        {value}
      </p>
    </div>
  )
}

function ChecklistItem({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-neutral/20 bg-neutral/5 text-neutral"
      }`}
    >
      <CheckCircle2
        size={16}
        className={checked ? "text-emerald-600" : "text-neutral/50"}
      />

      <span className="font-medium">
        {text}
      </span>
    </div>
  )
}