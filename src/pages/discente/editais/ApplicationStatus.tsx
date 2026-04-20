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
  UserCheck,
  Trophy,
} from "lucide-react"

type ApplicationStatusType =
  | "ENVIADA"
  | "EM_TRIAGEM"
  | "EM_ANALISE"
  | "HOMOLOGADA"
  | "INDEFERIDA"
  | "RESULTADO_PUBLICADO"

type TimelineStepStatus = "DONE" | "CURRENT" | "PENDING" | "FAILED"

type FinalResultType =
  | "APROVADO_COM_BOLSA"
  | "APROVADO_VOLUNTARIO"
  | "LISTA_DE_ESPERA"
  | "NAO_APROVADO"

type TimelineStep = {
  titulo: string
  data: string
  status: TimelineStepStatus
  descricao?: string
}

type FinalResultData = {
  situacao: FinalResultType
  posicaoClassificacao?: number
  mensagem?: string
}

type ApplicationDetailsData = {
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
  cpf: string
  email: string
  resumo?: string
  observacao?: string
  timeline: TimelineStep[]
  resultadoFinal?: FinalResultData
}

const APPLICATIONS: ApplicationDetailsData[] = [
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
    cpf: "123.456.789-00",
    email: "mariana@academico.ufpb.br",
    resumo:
      "Inscrição realizada para participação em processo seletivo vinculado ao edital PIBIC 2026.",
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
    cpf: "123.456.789-00",
    email: "mariana@academico.ufpb.br",
    resumo:
      "Inscrição registrada para participação em processo seletivo vinculado ao edital PIBITI 2026.",
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
  {
    id: "inscricao_003",
    noticeId: "edital_003",
    editalTitulo: "Edital PIBIC-AF 2026",
    editalTipo: "PIBIC-AF",
    unidade: "PROPESQ / UFPB",
    protocolo: "PROP-2026-000211",
    dataEnvio: "05/03/2026",
    horaEnvio: "16:05",
    modalidade: "Bolsista",
    planoTitulo: "Plano de Trabalho em Modelagem Preditiva para Dados Educacionais",
    orientador: "Prof. Carlos Henrique",
    status: "RESULTADO_PUBLICADO",
    discente: "Mariana Martins",
    matricula: "20230012345",
    cpf: "123.456.789-00",
    email: "mariana@academico.ufpb.br",
    resumo:
      "Inscrição submetida em edital de iniciação científica com acompanhamento concluído e resultado publicado.",
    observacao:
      "O resultado final desta inscrição já está disponível para consulta abaixo.",
    timeline: [
      {
        titulo: "Inscrição enviada",
        data: "05/03/2026 • 16:05",
        status: "DONE",
      },
      {
        titulo: "Triagem documental",
        data: "06/03/2026 • 09:20",
        status: "DONE",
      },
      {
        titulo: "Análise da inscrição",
        data: "10/03/2026 • 15:10",
        status: "DONE",
      },
      {
        titulo: "Homologação",
        data: "14/03/2026 • 11:00",
        status: "DONE",
      },
      {
        titulo: "Resultado final",
        data: "20/03/2026 • 08:00",
        status: "DONE",
        descricao: "Resultado disponibilizado para consulta no sistema.",
      },
    ],
    resultadoFinal: {
      situacao: "APROVADO_COM_BOLSA",
      posicaoClassificacao: 3,
      mensagem:
        "Sua inscrição foi aprovada com bolsa, conforme publicação oficial do resultado final.",
    },
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

function getFinalResultLabel(result?: FinalResultData) {
  if (!result) return "-"

  switch (result.situacao) {
    case "APROVADO_COM_BOLSA":
      return "Aprovado com bolsa"
    case "APROVADO_VOLUNTARIO":
      return "Aprovado voluntário"
    case "LISTA_DE_ESPERA":
      return "Lista de espera"
    case "NAO_APROVADO":
      return "Não aprovado"
    default:
      return result.situacao
  }
}

function getFinalResultClasses(result?: FinalResultData) {
  if (!result) return "border-neutral/30 bg-neutral/10 text-neutral"

  switch (result.situacao) {
    case "APROVADO_COM_BOLSA":
    case "APROVADO_VOLUNTARIO":
      return "border-success/30 bg-success/10 text-success"
    case "LISTA_DE_ESPERA":
      return "border-warning/30 bg-warning/10 text-warning"
    case "NAO_APROVADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getStatusSummary(status: ApplicationStatusType) {
  switch (status) {
    case "ENVIADA":
      return "Sua inscrição foi registrada com sucesso e aguarda as primeiras verificações."
    case "EM_TRIAGEM":
      return "Sua inscrição está em triagem documental pela equipe responsável."
    case "EM_ANALISE":
      return "Sua inscrição está em processamento e análise pelas equipes responsáveis."
    case "HOMOLOGADA":
      return "Sua inscrição foi homologada com sucesso e segue no fluxo do edital."
    case "INDEFERIDA":
      return "Sua inscrição foi indeferida. Consulte as observações do processo para mais detalhes."
    case "RESULTADO_PUBLICADO":
      return "O resultado final vinculado à sua inscrição já está disponível nesta página."
    default:
      return ""
  }
}

export default function ApplicationStatus() {
  const { id } = useParams()

  const application = APPLICATIONS.find((item) => item.id === id) ?? APPLICATIONS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Detalhes da Inscrição • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/editais"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
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
                Detalhes da inscrição
              </h1>

              <p className="max-w-4xl text-base leading-7 text-neutral">
                Consulte o comprovante da inscrição, acompanhe o andamento do processo
                e visualize o resultado final quando disponível.
              </p>
            </div>

            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl border border-primary
                px-4 py-3 text-sm font-medium text-primary
                transition hover:bg-primary/5
              "
            >
              <Printer size={16} />
              Imprimir comprovante
            </button>
          </div>
        </header>

        <Card
          title=""
          className="rounded-2xl border border-success/30 bg-white p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="mt-0.5 text-success" />

              <div>
                <div className="text-base font-semibold text-success">
                  Inscrição registrada com sucesso
                </div>
                <p className="mt-1 text-sm leading-6 text-neutral">
                  Sua inscrição foi registrada no sistema e recebeu um número de
                  protocolo para acompanhamento.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div className="text-xs font-medium text-neutral">Protocolo</div>
              <div className="mt-1 text-base font-bold text-primary">
                {application.protocolo}
              </div>
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title=""
            className="rounded-2xl border border-neutral/30 bg-white p-6"
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
            className="rounded-2xl border border-neutral/30 bg-white p-6"
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
            className="rounded-2xl border border-neutral/30 bg-white p-6"
          >
            <div className="flex items-start gap-3">
              <UserCheck size={20} className="text-primary" />
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
            className="rounded-2xl border border-neutral/30 bg-white p-6"
          >
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Situação atual</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {getApplicationStatusLabel(application.status)}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
          {/*  <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Linha do tempo da inscrição
                </h2>
              }
              className="rounded-2xl border border-neutral/30 bg-white p-8"
            >
              <div className="space-y-5">
                {application.timeline.map((step, index) => (
                  <div key={`${step.titulo}-${index}`} className="flex gap-4">
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

                      <div className="mt-1 text-sm text-neutral">{step.data}</div>

                      {step.descricao && (
                        <p className="mt-2 text-sm leading-6 text-neutral">
                          {step.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>*/}

            {application.resultadoFinal && (
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Resultado final
                  </h2>
                }
                className="rounded-2xl border border-neutral/30 bg-white p-8"
              >
                <div className="space-y-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="text-sm text-neutral">Situação final</div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getFinalResultClasses(
                          application.resultadoFinal
                        )}`}
                      >
                        <Trophy size={16} />
                        {getFinalResultLabel(application.resultadoFinal)}
                      </span>
                    </div>

                    {typeof application.resultadoFinal.posicaoClassificacao === "number" && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                        <div className="text-xs font-medium text-neutral">
                          Posição na classificação
                        </div>
                        <div className="mt-1 text-base font-bold text-primary">
                          {application.resultadoFinal.posicaoClassificacao}º lugar
                        </div>
                      </div>
                    )}
                  </div>

                  {application.resultadoFinal.mensagem && (
                    <div className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-4 text-sm leading-6 text-neutral">
                      {application.resultadoFinal.mensagem}
                    </div>
                  )}
                </div>
              </Card> 
            )}

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Dados da inscrição
                </h2>
              }
              className="rounded-2xl border border-neutral/30 bg-white p-8"
            >
              <div className="grid grid-cols-1 gap-5 text-sm md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="text-neutral">Edital</div>
                  <div className="mt-1 font-semibold text-primary">
                    {application.editalTitulo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Plano de trabalho selecionado</div>
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
                  <div className="text-neutral">Matrícula</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.matricula}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">CPF</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.cpf}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">E-mail</div>
                  <div className="mt-1 font-medium text-primary">
                    {application.email}
                  </div>
                </div>

                {application.resumo && (
                  <div className="md:col-span-2">
                    <div className="text-neutral">Resumo</div>
                    <p className="mt-1 leading-6 text-primary">{application.resumo}</p>
                  </div>
                )}
              </div>
            </Card>

            {application.observacao && (
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Observação do processo
                  </h2>
                }
                className="rounded-2xl border border-neutral/30 bg-white p-8"
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
              className="rounded-2xl border border-neutral/30 bg-white p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getApplicationStatusClasses(
                    application.status
                  )}`}
                >
                  <FileCheck2 size={14} />
                  {getApplicationStatusLabel(application.status)}
                </span>

                <p className="leading-6 text-neutral">
                  {getStatusSummary(application.status)}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Ações rápidas
                </h2>
              }
              className="rounded-2xl border border-neutral/30 bg-white p-8"
            >
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    transition hover:bg-primary/5
                  "
                >
                  <Printer size={16} />
                  Imprimir comprovante
                </button>

                <Link
                  to={`/discente/editais/${application.noticeId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    transition hover:bg-primary/5
                  "
                >
                  <FileText size={16} />
                  Ver edital
                </Link>

                <Link
                  to="/discente/editais"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-neutral/30
                    px-4 py-3 text-sm font-medium text-neutral
                    transition hover:bg-neutral/5
                  "
                >
                  <ArrowLeft size={16} />
                  Voltar para editais
                </Link>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Recomendações
                </h2>
              }
              className="rounded-2xl border border-neutral/30 bg-white p-8"
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