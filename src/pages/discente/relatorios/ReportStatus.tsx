import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  FolderKanban,
  CalendarDays,
  Clock3,
  UserRound,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ClipboardList,
  Pencil,
  Eye,
} from "lucide-react"

type ReportType = "PARCIAL" | "FINAL" | "ENIC"
type ReportStatusType =
  | "PENDENTE"
  | "EM_PREENCHIMENTO"
  | "ENVIADO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"
  | "ATRASADO"

type TimelineStepStatus = "DONE" | "CURRENT" | "PENDING" | "FAILED"

type TimelineStep = {
  titulo: string
  data: string
  status: TimelineStepStatus
  descricao?: string
}

type ReportStatusData = {
  id: string
  titulo: string
  tipo: ReportType
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  periodo: string
  prazo: string
  status: ReportStatusType
  atualizadoEm?: string
  dataEnvio?: string
  observacao?: string
  pendencia?: string
  timeline: TimelineStep[]
}

const REPORTS: ReportStatusData[] = [
  {
    id: "rel_001",
    titulo: "Relatório Parcial PIBIC 2026",
    tipo: "PARCIAL",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    periodo: "2026.1",
    prazo: "30/06/2026",
    status: "PENDENTE",
    atualizadoEm: "14/03/2026",
    observacao:
      "O relatório ainda não foi submetido. O discente deve preencher e enviar dentro do prazo estabelecido.",
    timeline: [
      {
        titulo: "Relatório disponibilizado",
        data: "01/06/2026",
        status: "DONE",
        descricao: "O relatório foi aberto no sistema para preenchimento.",
      },
      {
        titulo: "Preenchimento pelo discente",
        data: "Aguardando início",
        status: "CURRENT",
        descricao: "O relatório ainda não foi iniciado.",
      },
      {
        titulo: "Envio do relatório",
        data: "Prazo até 30/06/2026",
        status: "PENDING",
      },
      {
        titulo: "Análise",
        data: "Aguardando envio",
        status: "PENDING",
      },
    ],
  },
  {
    id: "rel_002",
    titulo: "Relatório Final PIBITI 2026",
    tipo: "FINAL",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    orientador: "Profa. Helena Costa",
    periodo: "2026.1",
    prazo: "10/12/2026",
    status: "EM_ANALISE",
    atualizadoEm: "14/03/2026",
    dataEnvio: "13/03/2026",
    observacao:
      "O relatório foi submetido e está em análise pela equipe responsável.",
    timeline: [
      {
        titulo: "Relatório disponibilizado",
        data: "01/12/2026",
        status: "DONE",
      },
      {
        titulo: "Preenchimento pelo discente",
        data: "01/12/2026 a 13/03/2026",
        status: "DONE",
      },
      {
        titulo: "Envio realizado",
        data: "13/03/2026",
        status: "DONE",
        descricao: "A submissão foi registrada com sucesso no sistema.",
      },
      {
        titulo: "Análise do relatório",
        data: "Em andamento",
        status: "CURRENT",
        descricao: "O conteúdo está em avaliação pela equipe/orientador.",
      },
      {
        titulo: "Resultado final",
        data: "Aguardando conclusão da análise",
        status: "PENDING",
      },
    ],
  },
  {
    id: "rel_005",
    titulo: "Relatório Final PIBIC 2025",
    tipo: "FINAL",
    projetoId: "proj_004",
    projetoTitulo: "Painel Analítico para Indicadores de Iniciação Científica",
    edital: "PIBIC 2025",
    orientador: "Prof. Ricardo Lima",
    periodo: "2025.1",
    prazo: "05/12/2025",
    status: "REJEITADO",
    atualizadoEm: "07/12/2025",
    dataEnvio: "05/12/2025",
    observacao:
      "O relatório foi analisado e devolvido para ajustes complementares.",
    pendencia:
      "Detalhar melhor os resultados finais, os produtos gerados e as conclusões decorrentes da execução do projeto.",
    timeline: [
      {
        titulo: "Relatório disponibilizado",
        data: "20/11/2025",
        status: "DONE",
      },
      {
        titulo: "Preenchimento pelo discente",
        data: "20/11/2025 a 05/12/2025",
        status: "DONE",
      },
      {
        titulo: "Envio realizado",
        data: "05/12/2025",
        status: "DONE",
      },
      {
        titulo: "Análise do relatório",
        data: "06/12/2025",
        status: "DONE",
      },
      {
        titulo: "Relatório rejeitado para ajustes",
        data: "07/12/2025",
        status: "FAILED",
        descricao: "Foi necessário solicitar complementações antes de nova submissão.",
      },
      {
        titulo: "Reenvio pelo discente",
        data: "Aguardando nova submissão",
        status: "CURRENT",
      },
    ],
  },
]

function getTypeLabel(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "Parcial"
    case "FINAL":
      return "Final"
    case "ENIC":
      return "ENIC"
    default:
      return type
  }
}

function getTypeClasses(type: ReportType) {
  switch (type) {
    case "PARCIAL":
      return "border-primary/30 bg-primary/10 text-primary"
    case "FINAL":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "ENIC":
      return "border-success/30 bg-success/10 text-success"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusLabel(status: ReportStatusType) {
  switch (status) {
    case "PENDENTE":
      return "Pendente"
    case "EM_PREENCHIMENTO":
      return "Em preenchimento"
    case "ENVIADO":
      return "Enviado"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    case "REJEITADO":
      return "Rejeitado"
    case "ATRASADO":
      return "Atrasado"
    default:
      return status
  }
}

function getStatusClasses(status: ReportStatusType) {
  switch (status) {
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_PREENCHIMENTO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "ENVIADO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    case "ATRASADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStepIcon(status: TimelineStepStatus) {
  switch (status) {
    case "DONE":
      return <CheckCircle2 size={18} className="text-success" />
    case "CURRENT":
      return <Clock3 size={18} className="text-warning" />
    case "FAILED":
      return <AlertTriangle size={18} className="text-danger" />
    default:
      return <Circle size={18} className="text-neutral" />
  }
}

function getStepTitleClass(status: TimelineStepStatus) {
  switch (status) {
    case "DONE":
      return "text-primary"
    case "CURRENT":
      return "text-warning"
    case "FAILED":
      return "text-danger"
    default:
      return "text-neutral"
  }
}

function getPrimaryAction(report: ReportStatusData) {
  if (report.tipo === "PARCIAL") {
    return `/discente/relatorios/parcial/${report.id}`
  }

  if (report.tipo === "FINAL") {
    return `/discente/relatorios/final/${report.id}`
  }

  return `/discente/enic/${report.id}`
}

function getPrimaryActionLabel(report: ReportStatusData) {
  if (
    report.status === "PENDENTE" ||
    report.status === "EM_PREENCHIMENTO" ||
    report.status === "REJEITADO" ||
    report.status === "ATRASADO"
  ) {
    return "Editar relatório"
  }

  return "Ver conteúdo"
}

export default function ReportStatus() {
  const { id } = useParams()

  const report = REPORTS.find((item) => item.id === id) ?? REPORTS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Status do Relatório • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to={`/discente/relatorios/${report.id}`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para detalhes do relatório
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getTypeClasses(
                    report.tipo
                  )}`}
                >
                  <FileText size={14} />
                  {getTypeLabel(report.tipo)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    report.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(report.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Acompanhamento do relatório
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Consulte a situação atual do relatório, as etapas do processo e eventuais observações da análise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              <Link
                to={getPrimaryAction(report)}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-primary px-4 py-3
                  text-sm font-semibold text-white
                  hover:opacity-90 transition
                "
              >
                <Pencil size={16} />
                {getPrimaryActionLabel(report)}
              </Link>

              <Link
                to={`/discente/relatorios/${report.id}`}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-primary
                  px-4 py-3 text-sm font-medium text-primary
                  hover:bg-primary/5 transition
                "
              >
                <Eye size={16} />
                Ver detalhes
              </Link>
            </div>
          </div>
        </header>

        {/* PENDÊNCIA */}
        {report.pendencia && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {report.pendencia}
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FolderKanban size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Projeto</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {report.projetoTitulo}
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
                  {report.orientador}
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
                  {report.prazo}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Clock3 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Data de envio</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {report.dataEnvio || "-"}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* CONTEÚDO */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Linha do tempo do relatório
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5">
                {report.timeline.map((step, index) => (
                  <div
                    key={`${step.titulo}-${index}`}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      {index < report.timeline.length - 1 && (
                        <div className="mt-2 h-full min-h-[32px] w-px bg-neutral/20" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className={`text-sm font-semibold ${getStepTitleClass(step.status)}`}>
                        {step.titulo}
                      </div>

                      <div className="mt-1 text-sm text-neutral">
                        {step.data}
                      </div>

                      {step.descricao && (
                        <p className="mt-2 text-sm text-neutral leading-6">
                          {step.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Informações do processo
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Título do relatório</div>
                  <div className="mt-1 font-semibold text-primary">
                    {report.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Tipo</div>
                  <div className="mt-1 font-medium text-primary">
                    {getTypeLabel(report.tipo)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status atual</div>
                  <div className="mt-1 font-medium text-primary">
                    {getStatusLabel(report.status)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.periodo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Última atualização</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.atualizadoEm || "-"}
                  </div>
                </div>
              </div>
            </Card>

            {report.observacao && (
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Observação do processo
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div
                  className={`
                    rounded-xl px-4 py-4 text-sm leading-6
                    ${
                      report.status === "REJEITADO" || report.status === "ATRASADO"
                        ? "border border-warning/20 bg-warning/5 text-neutral"
                        : "border border-primary/20 bg-primary/5 text-neutral"
                    }
                  `}
                >
                  {report.observacao}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resumo da situação
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    report.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(report.status)}
                </span>

                <p className="text-neutral leading-6">
                  {report.status === "PENDENTE" &&
                    "O relatório está disponível, mas ainda não foi iniciado pelo discente."}

                  {report.status === "EM_PREENCHIMENTO" &&
                    "O relatório está em elaboração e ainda pode ser atualizado."}

                  {report.status === "ENVIADO" &&
                    "O relatório foi submetido e aguarda andamento do processo."}

                  {report.status === "EM_ANALISE" &&
                    "O relatório está sendo avaliado pela equipe responsável."}

                  {report.status === "APROVADO" &&
                    "O relatório foi aprovado e teve seu processo concluído com sucesso."}

                  {report.status === "REJEITADO" &&
                    "O relatório precisa de ajustes antes de nova submissão."}

                  {report.status === "ATRASADO" &&
                    "O prazo previsto foi ultrapassado e ainda há pendência de envio."}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Ações rápidas
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="flex flex-col gap-3">
                <Link
                  to={getPrimaryAction(report)}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <Pencil size={16} />
                  {getPrimaryActionLabel(report)}
                </Link>

                <Link
                  to={`/discente/relatorios/${report.id}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <Eye size={16} />
                  Ver detalhes
                </Link>

                <Link
                  to="/discente/relatorios"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    hover:bg-neutral/5 transition
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar à lista
                </Link>
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
              <ul className="space-y-3 text-sm text-neutral">
                <li className="leading-6">
                  Acompanhe regularmente esta página para verificar atualizações no processo.
                </li>
                <li className="leading-6">
                  Em caso de rejeição, revise as observações antes de reenviar.
                </li>
                <li className="leading-6">
                  Mantenha coerência entre o conteúdo preenchido e o andamento real do projeto.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}