import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  ClipboardList,
  FileCheck2,
  FileText,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Printer,
} from "lucide-react"

type ApplicationStatusType =
  | "ENVIADA"
  | "EM_TRIAGEM"
  | "EM_ANALISE"
  | "HOMOLOGADA"
  | "INDEFERIDA"
  | "RESULTADO_PUBLICADO"

type TimelineStepStatus = "DONE" | "CURRENT" | "PENDING" | "FAILED"

type TimelineStep = {
  titulo: string
  data: string
  status: TimelineStepStatus
  descricao?: string
}

type ApplicationStatusData = {
  id: string
  noticeId: string
  editalTitulo: string
  editalTipo: string
  unidade: string
  protocolo: string
  dataEnvio: string
  horaEnvio: string
  modalidade: string
  planoTitulo: string
  orientador: string
  status: ApplicationStatusType
  discente: string
  matricula: string
  observacao?: string
  timeline: TimelineStep[]
}

const APPLICATIONS: ApplicationStatusData[] = [
  {
    id: "inscricao_001",
    noticeId: "edital_001",
    editalTitulo: "Edital PIBIC 2026",
    editalTipo: "PIBIC",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000184",
    dataEnvio: "14/03/2026",
    horaEnvio: "09:42",
    modalidade: "Bolsista",
    planoTitulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    orientador: "Prof. André Silva",
    status: "EM_ANALISE",
    discente: "Mariana Martins",
    matricula: "20230012345",
    observacao:
      "Sua inscrição foi validada documentalmente e está em análise pela unidade responsável.",
    timeline: [
      {
        titulo: "Inscrição enviada",
        data: "14/03/2026 • 09:42",
        status: "DONE",
        descricao: "O sistema registrou sua candidatura com sucesso.",
      },
      {
        titulo: "Triagem documental",
        data: "14/03/2026 • 10:30",
        status: "DONE",
        descricao: "Os documentos obrigatórios foram conferidos.",
      },
      {
        titulo: "Análise da inscrição",
        data: "Em andamento",
        status: "CURRENT",
        descricao: "A equipe responsável avalia os dados e critérios do edital.",
      },
      {
        titulo: "Homologação",
        data: "Aguardando etapa anterior",
        status: "PENDING",
      },
      {
        titulo: "Resultado final",
        data: "Previsto no cronograma do edital",
        status: "PENDING",
      },
    ],
  },
  {
    id: "inscricao_002",
    noticeId: "edital_002",
    editalTitulo: "Edital PIBITI 2026",
    editalTipo: "PIBITI",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000133",
    dataEnvio: "18/02/2026",
    horaEnvio: "14:10",
    modalidade: "Voluntário",
    planoTitulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    orientador: "Profa. Helena Costa",
    status: "INDEFERIDA",
    discente: "Mariana Martins",
    matricula: "20230012345",
    observacao:
      "A inscrição foi indeferida devido à ausência de comprovação documental válida no prazo definido.",
    timeline: [
      {
        titulo: "Inscrição enviada",
        data: "18/02/2026 • 14:10",
        status: "DONE",
      },
      {
        titulo: "Triagem documental",
        data: "20/02/2026 • 11:15",
        status: "FAILED",
        descricao: "Foi identificada inconsistência no comprovante bancário enviado.",
      },
      {
        titulo: "Análise da inscrição",
        data: "Não iniciada",
        status: "PENDING",
      },
      {
        titulo: "Homologação",
        data: "Não realizada",
        status: "PENDING",
      },
      {
        titulo: "Resultado final",
        data: "Processo encerrado para esta inscrição",
        status: "PENDING",
      },
    ],
  },
]

function getApplicationStatusLabel(status: ApplicationStatusType) {
  switch (status) {
    case "ENVIADA":
      return "Enviada"
    case "EM_TRIAGEM":
      return "Em triagem"
    case "EM_ANALISE":
      return "Em análise"
    case "HOMOLOGADA":
      return "Homologada"
    case "INDEFERIDA":
      return "Indeferida"
    case "RESULTADO_PUBLICADO":
      return "Resultado publicado"
    default:
      return status
  }
}

function getApplicationStatusClasses(status: ApplicationStatusType) {
  switch (status) {
    case "ENVIADA":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_TRIAGEM":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "HOMOLOGADA":
      return "border-success/30 bg-success/10 text-success"
    case "INDEFERIDA":
      return "border-danger/30 bg-danger/10 text-danger"
    case "RESULTADO_PUBLICADO":
      return "border-primary/30 bg-primary/10 text-primary"
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

export default function ApplicationStatus() {
  const { id } = useParams()

  const application = APPLICATIONS.find((item) => item.id === id) ?? APPLICATIONS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Status da Inscrição • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/editais"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para editais
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {application.editalTipo}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getApplicationStatusClasses(
                    application.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getApplicationStatusLabel(application.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Acompanhamento da inscrição
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Acompanhe o andamento da sua inscrição, as etapas já concluídas e a situação atual no processo seletivo.
              </p>
            </div>

            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl border border-primary
                px-4 py-3 text-sm font-medium text-primary
                hover:bg-primary/5 transition
              "
            >
              <Printer size={16} />
              Imprimir status
            </button>
          </div>
        </header>

        {/* DESTAQUE */}
        <Card
          title=""
          className="bg-white border border-neutral/30 rounded-2xl p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="text-sm text-neutral">Situação atual da inscrição</div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getApplicationStatusClasses(
                    application.status
                  )}`}
                >
                  <FileCheck2 size={16} />
                  {getApplicationStatusLabel(application.status)}
                </span>

                <span className="text-sm text-neutral">
                  Protocolo: <span className="font-semibold text-primary">{application.protocolo}</span>
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div className="text-xs font-medium text-neutral">Edital</div>
              <div className="mt-1 text-sm font-semibold text-primary">
                {application.editalTitulo}
              </div>
            </div>
          </div>
        </Card>

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Data do envio</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {application.dataEnvio}
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
                <div className="text-sm text-neutral">Hora do envio</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {application.horaEnvio}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <ClipboardList size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Modalidade</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {application.modalidade}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Matrícula</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {application.matricula}
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
                  Linha do tempo da inscrição
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5">
                {application.timeline.map((step, index) => (
                  <div
                    key={`${step.titulo}-${index}`}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      {index < application.timeline.length - 1 && (
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
                  Dados da inscrição
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-semibold text-primary">
                    {application.editalTitulo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Plano de trabalho</div>
                  <div className="mt-1 font-semibold text-primary">
                    {application.planoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Orientador(a)</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.orientador}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Unidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.unidade}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Discente</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.discente}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Protocolo</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.protocolo}
                  </div>
                </div>
              </div>
            </Card>

            {application.observacao && (
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
                      application.status === "INDEFERIDA"
                        ? "border border-danger/20 bg-danger/5 text-danger"
                        : "border border-warning/20 bg-warning/5 text-neutral"
                    }
                  `}
                >
                  {application.observacao}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resumo do andamento
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getApplicationStatusClasses(
                    application.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getApplicationStatusLabel(application.status)}
                </span>

                <p className="text-neutral leading-6">
                  {application.status === "ENVIADA" &&
                    "Sua inscrição foi registrada e aguarda as primeiras verificações."}

                  {(application.status === "EM_TRIAGEM" || application.status === "EM_ANALISE") &&
                    "Sua inscrição está em processamento e análise pelas equipes responsáveis."}

                  {application.status === "HOMOLOGADA" &&
                    "Sua inscrição foi homologada com sucesso."}

                  {application.status === "INDEFERIDA" &&
                    "Sua inscrição foi indeferida. Consulte as observações e acompanhe o edital para mais informações."}

                  {application.status === "RESULTADO_PUBLICADO" &&
                    "O resultado vinculado à sua inscrição já está disponível para consulta."}
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
                  to={`/discente/inscricoes/${application.id}/comprovante`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <FileText size={16} />
                  Ver comprovante
                </Link>

                <Link
                  to={`/discente/editais/${application.noticeId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <ClipboardList size={16} />
                  Ver edital
                </Link>

                <Link
                  to={`/discente/inscricoes/${application.id}/resultado`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <BadgeCheck size={16} />
                  Ver resultado
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
                  Confira se seus documentos continuam válidos e atualizados no sistema.
                </li>
                <li className="leading-6">
                  Guarde o número de protocolo para referência futura.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}