import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  FileText,
  FolderKanban,
  CalendarDays,
  BadgeCheck,
  Clock3,
  UserRound,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
} from "lucide-react"

type ReportType = "PARCIAL" | "FINAL" | "ENIC"
type ReportStatus =
  | "PENDENTE"
  | "EM_PREENCHIMENTO"
  | "ENVIADO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"
  | "ATRASADO"

type ReportDetails = {
  id: string
  titulo: string
  tipo: ReportType
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  periodo: string
  prazo: string
  status: ReportStatus
  atualizadoEm?: string
  dataEnvio?: string
  resumo: string
  objetivo: string
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const REPORTS: ReportDetails[] = [
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
    resumo:
      "Relatório parcial referente ao acompanhamento das atividades desenvolvidas no primeiro ciclo do projeto.",
    objetivo:
      "Registrar o andamento parcial da execução do projeto, descrevendo atividades realizadas, resultados preliminares e adequação ao plano de trabalho.",
    observacoes: [
      "Descreva apenas atividades efetivamente realizadas até o momento.",
      "Explique eventuais alterações no plano de trabalho original.",
      "Destaque resultados preliminares e dificuldades enfrentadas.",
    ],
    possuiPendencia: false,
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
    status: "EM_PREENCHIMENTO",
    atualizadoEm: "14/03/2026",
    resumo:
      "Relatório final com consolidação das atividades, resultados e contribuições do discente ao projeto.",
    objetivo:
      "Apresentar a consolidação da execução do projeto, resultados finais, produtos gerados e conclusões da participação discente.",
    observacoes: [
      "Consolide objetivos alcançados e resultados efetivos.",
      "Detalhe produtos gerados, contribuições acadêmicas e conclusões finais.",
      "Revise cuidadosamente antes do envio definitivo.",
    ],
    possuiPendencia: false,
  },
  {
    id: "rel_003",
    titulo: "Submissão ENIC 2026",
    tipo: "ENIC",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    periodo: "2026.1",
    prazo: "15/08/2026",
    status: "EM_ANALISE",
    atualizadoEm: "12/03/2026",
    dataEnvio: "12/03/2026",
    resumo:
      "Registro de submissão de trabalho vinculado ao evento acadêmico ENIC, associado ao projeto atual.",
    objetivo:
      "Formalizar a submissão do trabalho acadêmico produzido no contexto do projeto e acompanhar sua tramitação no evento.",
    observacoes: [
      "A submissão está em análise pela comissão responsável.",
      "Acompanhe eventuais solicitações de ajuste ou atualização.",
    ],
    possuiPendencia: false,
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
    resumo:
      "Relatório final com necessidade de correções após análise da equipe responsável.",
    objetivo:
      "Apresentar a versão final consolidada da execução do projeto, contendo resultados, produtos e conclusões.",
    observacoes: [
      "Revisar consistência entre resultados e conclusões.",
      "Detalhar melhor os produtos gerados e as contribuições do projeto.",
    ],
    possuiPendencia: true,
    pendenciaTexto:
      "O relatório precisa ser ajustado conforme observações do avaliador e reenviado dentro do prazo complementar.",
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

function getStatusLabel(status: ReportStatus) {
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

function getStatusClasses(status: ReportStatus) {
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

function getPrimaryAction(report: ReportDetails) {
  if (report.tipo === "PARCIAL") {
    return `/discente/relatorios/parcial/${report.id}`
  }

  if (report.tipo === "FINAL") {
    return `/discente/relatorios/final/${report.id}`
  }

  return `/discente/enic/${report.id}`
}

function getPrimaryActionLabel(report: ReportDetails) {
  if (
    report.status === "PENDENTE" ||
    report.status === "EM_PREENCHIMENTO" ||
    report.status === "REJEITADO" ||
    report.status === "ATRASADO"
  ) {
    return "Preencher / editar"
  }

  return "Visualizar envio"
}

export default function ReportView() {
  const { id } = useParams()

  const report = REPORTS.find((item) => item.id === id) ?? REPORTS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{report.titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
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
                {report.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {report.resumo}
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
                to={`/discente/relatorios/${report.id}/status`}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-primary
                  px-4 py-3 text-sm font-medium text-primary
                  hover:bg-primary/5 transition
                "
              >
                <BadgeCheck size={16} />
                Acompanhar status
              </Link>
            </div>
          </div>
        </header>

        {/* PENDÊNCIA */}
        {report.possuiPendencia && report.pendenciaTexto && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {report.pendenciaTexto}
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
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

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
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

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
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

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Clock3 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Última atualização</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {report.atualizadoEm || "-"}
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
                  Informações gerais
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
                  <div className="text-neutral">Status</div>
                  <div className="mt-1 font-medium text-primary">
                    {getStatusLabel(report.status)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.edital}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.periodo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Objetivo do relatório</div>
                  <p className="mt-1 text-primary leading-6">
                    {report.objetivo}
                  </p>
                </div>

                <div>
                  <div className="text-neutral">Data de envio</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.dataEnvio || "-"}
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

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Projeto vinculado
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Projeto</div>
                  <div className="mt-1 font-semibold text-primary">
                    {report.projetoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Orientador(a)</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.orientador}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital de origem</div>
                  <div className="mt-1 font-medium text-primary">
                    {report.edital}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações e orientações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {report.observacoes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    {report.status === "APROVADO" ? (
                      <CheckCircle2 size={16} className="mt-0.5 text-success" />
                    ) : (
                      <ClipboardList size={16} className="mt-0.5 text-primary" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
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
                    "O relatório ainda não foi iniciado e aguarda preenchimento pelo discente."}

                  {report.status === "EM_PREENCHIMENTO" &&
                    "O relatório está em elaboração e pode ser atualizado antes do envio."}

                  {report.status === "ENVIADO" &&
                    "O relatório foi enviado e aguarda movimentação do processo."}

                  {report.status === "EM_ANALISE" &&
                    "O relatório está em análise pela equipe ou orientador responsável."}

                  {report.status === "APROVADO" &&
                    "O relatório foi avaliado e aprovado com sucesso."}

                  {report.status === "REJEITADO" &&
                    "O relatório exige ajustes antes de nova submissão."}

                  {report.status === "ATRASADO" &&
                    "O prazo regular foi ultrapassado e o relatório segue pendente."}
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
                  to={`/discente/relatorios/${report.id}/status`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <BadgeCheck size={16} />
                  Acompanhar status
                </Link>

                <Link
                  to={`/discente/projetos/${report.projetoId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <Eye size={16} />
                  Ver projeto
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
          </div>
        </section>
      </div>
    </div>
  )
}