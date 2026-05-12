import { FormEvent, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileSignature,
  FileText,
  FolderKanban,
  GraduationCap,
  History,
  Info,
  Notebook,
  Save,
  Send,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react"

type ReportType = "Parcial" | "Final"

type ReportStatus =
  | "Submetido"
  | "Em análise"
  | "Aprovado"
  | "Aprovado com ressalvas"
  | "Solicitar ajustes"
  | "Reprovado"

type ReviewDecision =
  | "Selecione o resultado"
  | "Aprovado"
  | "Aprovado com ressalvas"
  | "Solicitar ajustes"
  | "Reprovado"

type HistoryItem = {
  id: number
  date: string
  title: string
  description: string
  status: "success" | "info" | "warning" | "danger" | "neutral"
}

type ReportDetail = {
  id: number
  projectId: number
  planId: number
  projectTitle: string
  planTitle: string
  studentName: string
  studentRegistration: string
  studentCourse: string
  studentEmail: string
  edital: string
  ano: string
  area: string
  type: ReportType
  status: ReportStatus
  submittedAt: string
  deadline: string
  title: string
  summary: string
  activities: string
  results: string
  difficulties: string
  nextSteps: string
  fileName: string
  previousReview: string | null
  reviewer: string | null
  reviewedAt: string | null
  history: HistoryItem[]
}

const reportMock: ReportDetail = {
  id: 1,
  projectId: 1,
  planId: 1,
  projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
  planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
  studentName: "Ana Beatriz Santos",
  studentRegistration: "20230014567",
  studentCourse: "Ciência da Computação",
  studentEmail: "ana.beatriz@academico.ufpb.br",
  edital: "PIBIC 2026",
  ano: "2026",
  area: "Interação Humano-Computador",
  type: "Parcial",
  status: "Submetido",
  submittedAt: "08/05/2026",
  deadline: "15/05/2026",
  title: "Relatório parcial sobre prototipação de interfaces acessíveis",
  summary:
    "O relatório apresenta as atividades iniciais de levantamento de requisitos, análise de acessibilidade e construção dos primeiros protótipos de interface. A discente descreve o processo de análise de sistemas similares, identificação de requisitos de acessibilidade e elaboração de fluxos de navegação voltados a usuários surdos e ouvintes.",
  activities:
    "Foram realizadas revisão bibliográfica sobre acessibilidade digital, análise de diretrizes de usabilidade, levantamento de requisitos, criação de wireframes e desenvolvimento inicial de protótipos navegáveis para validação interna.",
  results:
    "Como resultados parciais, foram produzidos mapas de fluxo, telas preliminares, documentação dos requisitos e uma primeira versão de protótipo navegável para discussão com a equipe do projeto.",
  difficulties:
    "As principais dificuldades envolveram a adaptação das diretrizes de acessibilidade ao contexto específico da tradução em Libras e a priorização dos requisitos mais importantes para a primeira versão do protótipo.",
  nextSteps:
    "As próximas etapas incluem refinamento dos protótipos, realização de testes de usabilidade, coleta de feedbacks e consolidação dos resultados para o relatório final.",
  fileName: "relatorio_parcial_ana_beatriz.pdf",
  previousReview: null,
  reviewer: null,
  reviewedAt: null,
  history: [
    {
      id: 1,
      date: "08/05/2026",
      title: "Relatório submetido",
      description: "A discente submeteu o relatório parcial para análise do coordenador.",
      status: "info",
    },
    {
      id: 2,
      date: "01/05/2026",
      title: "Período de submissão aberto",
      description: "O prazo para envio do relatório parcial foi iniciado.",
      status: "neutral",
    },
    {
      id: 3,
      date: "10/05/2026",
      title: "Plano aprovado",
      description: "O plano de trabalho foi aprovado e vinculado à discente.",
      status: "success",
    },
  ],
}

const MAX_REVIEW_LENGTH = 1000

const textareaClassName =
  "min-h-[180px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

function getStatusClass(status: ReportStatus | ReviewDecision) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aprovado com ressalvas":
      return "border-teal-200 bg-teal-50 text-teal-700"
    case "Solicitar ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Em análise":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Submetido":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getStatusIcon(status: ReportStatus | ReviewDecision) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Aprovado com ressalvas":
      return <ClipboardCheck size={14} />
    case "Solicitar ajustes":
      return <AlertCircle size={14} />
    case "Em análise":
      return <ClipboardList size={14} />
    case "Submetido":
      return <FileText size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    default:
      return <Timer size={14} />
  }
}

function getTypeClass(type: ReportType) {
  if (type === "Parcial") {
    return "border-sky-200 bg-sky-50 text-sky-700"
  }

  return "border-primary/20 bg-primary/5 text-primary"
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

export default function CoordinatorReportReview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const report = reportMock

  const [decision, setDecision] = useState<ReviewDecision>("Selecione o resultado")
  const [reviewText, setReviewText] = useState(report.previousReview ?? "")
  const [lastAction, setLastAction] = useState<"draft" | "submit" | null>(null)

  const remainingCharacters = MAX_REVIEW_LENGTH - reviewText.length

  const isReviewLimitClose = remainingCharacters <= 150
  const isReviewLimitExceeded = remainingCharacters < 0

  const isReadyToSubmit = useMemo(() => {
    return (
      decision !== "Selecione o resultado" &&
      reviewText.trim().length > 0 &&
      reviewText.length <= MAX_REVIEW_LENGTH
    )
  }, [decision, reviewText])

  function handleReviewChange(value: string) {
    if (value.length <= MAX_REVIEW_LENGTH) {
      setReviewText(value)
    }
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

    navigate("/coordenador/relatorios")
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* BOTÃO DE VOLTAR */}
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/relatorios"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para relatórios
          </Link>
        </div>

        {/* HEADER */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <FileSignature size={14} />
                  Parecer do relatório #{id ?? report.id}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClass(
                    report.type
                  )}`}
                >
                  <FileText size={14} />
                  Relatório {report.type}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                    report.status
                  )}`}
                >
                  {getStatusIcon(report.status)}
                  {report.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-primary">
                {report.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                Leia o resumo submetido pelo discente e emita um parecer de até 1000 caracteres para registrar a análise
                do relatório.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral">
                <span className="inline-flex items-center gap-2">
                  <UserRound size={16} />
                  {report.studentName}
                </span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span className="inline-flex items-center gap-2">
                  <GraduationCap size={16} />
                  {report.studentCourse}
                </span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Enviado em {report.submittedAt}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-neutral/5 px-5 py-4 lg:min-w-[230px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                Caracteres do parecer
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span
                  className={`text-3xl font-bold ${
                    isReviewLimitClose ? "text-amber-700" : "text-primary"
                  }`}
                >
                  {reviewText.length}
                </span>

                <span className="pb-1 text-sm text-neutral">
                  / {MAX_REVIEW_LENGTH}
                </span>
              </div>

              <p
                className={`mt-2 text-xs ${
                  isReviewLimitClose ? "text-amber-700" : "text-neutral"
                }`}
              >
                {remainingCharacters} caractere(s) restante(s)
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
                  Rascunho de parecer salvo no protótipo
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Em uma versão integrada, essa ação salvaria o parecer sem publicar o resultado para o discente.
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
                  Escreva um texto com até 1000 caracteres antes de concluir.
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
                    {report.edital}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ClipboardCheck size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                Ano {report.ano}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Discente
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {report.studentRegistration}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <UserRound size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                {report.studentName}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Submissão
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {report.submittedAt}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <CalendarDays size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                Prazo final em {report.deadline}
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
                  <FileSignature size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs text-neutral">
                Definido ao concluir parecer
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {/* DADOS DO RELATÓRIO */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      Relatório submetido
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Informações enviadas pelo discente no relatório {report.type.toLowerCase()}.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem label="Projeto" value={report.projectTitle} />
                  <InfoItem label="Plano de trabalho" value={report.planTitle} />
                  <InfoItem label="Área" value={report.area} />
                  <InfoItem label="Arquivo enviado" value={report.fileName} />
                </div>
              </section>

              {/* CONTEÚDO */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Notebook size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-primary">
                      Resumo e conteúdo do discente
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Leia o conteúdo submetido para embasar o parecer.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <TextBlock title="Resumo submetido" text={report.summary} highlight />
                  <TextBlock title="Atividades desenvolvidas" text={report.activities} />
                  <TextBlock title="Resultados alcançados" text={report.results} />
                  <TextBlock title="Dificuldades encontradas" text={report.difficulties} />
                  <TextBlock title="Próximas etapas" text={report.nextSteps} />
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
                      Parecer do coordenador
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-neutral">
                      Escreva um parecer objetivo com até 1000 caracteres.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">

                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-primary">
                        Parecer textual <span className="text-red-500">*</span>
                      </label>

                      <span
                        className={`text-xs font-medium ${
                          isReviewLimitClose ? "text-amber-700" : "text-neutral"
                        }`}
                      >
                        {reviewText.length}/{MAX_REVIEW_LENGTH}
                      </span>
                    </div>

                    <textarea
                      value={reviewText}
                      onChange={(event) => handleReviewChange(event.target.value)}
                      maxLength={MAX_REVIEW_LENGTH}
                      placeholder="Escreva o parecer do coordenador sobre o relatório submetido. Ex.: qualidade das atividades descritas, coerência dos resultados, pendências, recomendações e decisão final."
                      className={textareaClassName}
                    />

                    <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p
                        className={`text-xs ${
                          isReviewLimitClose ? "text-amber-700" : "text-neutral"
                        }`}
                      >
                        Restam {remainingCharacters} caractere(s).
                      </p>

                      {isReviewLimitExceeded && (
                        <p className="text-xs font-medium text-red-600">
                          O parecer ultrapassou o limite permitido.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* LATERAL */}
            <aside className="space-y-6">
              {/* RESUMO */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <h2 className="text-base font-semibold text-primary">
                  Resumo do parecer
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral">
                  Confira os dados antes de concluir.
                </p>

                <div className="mt-5 space-y-3">
                  <SummaryItem label="Tipo de relatório" value={report.type} />
                  <SummaryItem label="Situação atual" value={report.status} />
                  <SummaryItem label="Resultado selecionado" value={decision} />
                  <SummaryItem label="Caracteres do parecer" value={`${reviewText.length}/${MAX_REVIEW_LENGTH}`} />
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
                      Movimentações do relatório.
                    </p>
                  </div>
                </div>

                <div className="relative space-y-5">
                  {report.history.map((item, index) => (
                    <div key={item.id} className="relative flex gap-3">
                      {index !== report.history.length - 1 && (
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

              {/* LINKS */}
              <section className="rounded-2xl border border-neutral/30 bg-white p-6">
                <h2 className="text-base font-semibold text-primary">
                  Acessos relacionados
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral">
                  Consulte as informações vinculadas ao relatório.
                </p>

                <div className="mt-5 space-y-2">
                  <Link
                    to={`/coordenador/projetos/${report.projectId}`}
                    className="flex items-center justify-between rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FolderKanban size={16} />
                      Ver projeto
                    </span>
                  </Link>

                  <Link
                    to="/coordenador/indicacoes"
                    className="flex items-center justify-between rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <GraduationCap size={16} />
                      Ver indicações
                    </span>
                  </Link>
                </div>
              </section>
            </aside>
          </section>

          {/* AÇÕES */}
          <section className="sticky bottom-0 z-10 -mx-6 border-t border-neutral/20 bg-[#F3F4F6]/95 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-neutral/30 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Parecer do relatório
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Salve como rascunho ou conclua o parecer para registrar o resultado da análise.
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
                  Concluir parecer
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium leading-6 text-primary">
        {value}
      </p>
    </div>
  )
}

function TextBlock({
  title,
  text,
  highlight = false,
}: {
  title: string
  text: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-primary/20 bg-primary/5"
          : "border-neutral/20 bg-neutral/5"
      }`}
    >
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