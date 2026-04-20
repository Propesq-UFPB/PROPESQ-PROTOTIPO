// pagina não usada

import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  BadgeCheck,
  Link2,
  FolderKanban,
  UserRound,
  Building2,
  CalendarDays,
  FileText,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Circle,
  Eye,
  History,
} from "lucide-react"

type BondStatusType =
  | "VINCULADO"
  | "AGUARDANDO_INICIO"
  | "PENDENTE_DOCUMENTACAO"
  | "EM_ANALISE"
  | "FINALIZADO"
  | "DESVINCULADO"

type ParticipationType = "BOLSISTA" | "VOLUNTARIO"

type TimelineStepStatus = "DONE" | "CURRENT" | "PENDING" | "FAILED"

type BondTimelineStep = {
  titulo: string
  data: string
  status: TimelineStepStatus
  descricao?: string
}

type BondData = {
  id: string
  projetoId: string
  projetoTitulo: string
  area: string
  orientador: string
  unidade: string
  edital: string
  planoTitulo: string
  statusVinculo: BondStatusType
  statusProjeto: "ATIVO" | "EM_ACOMPANHAMENTO" | "ENCERRADO" | "PENDENTE_HOMOLOGACAO"
  participacao: ParticipationType
  inicio: string
  fim: string
  periodoAcademico: string
  observacao?: string
  pendencia?: string
  timeline: BondTimelineStep[]
}

const BONDS: BondData[] = [
  {
    id: "bond_001",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    area: "Sistemas de Informação",
    orientador: "Prof. André Silva",
    unidade: "Centro de Informática",
    edital: "PIBIC 2026",
    planoTitulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    statusVinculo: "VINCULADO",
    statusProjeto: "ATIVO",
    participacao: "BOLSISTA",
    inicio: "01/05/2026",
    fim: "31/12/2026",
    periodoAcademico: "2026.1",
    observacao:
      "O vínculo do discente foi homologado e está ativo para execução das atividades previstas no plano de trabalho.",
    timeline: [
      {
        titulo: "Inscrição aprovada",
        data: "30/04/2026",
        status: "DONE",
        descricao: "A candidatura foi classificada no edital correspondente.",
      },
      {
        titulo: "Documentação conferida",
        data: "02/05/2026",
        status: "DONE",
        descricao: "Os documentos obrigatórios foram aceitos pela unidade responsável.",
      },
      {
        titulo: "Vínculo homologado",
        data: "03/05/2026",
        status: "DONE",
        descricao: "O vínculo foi formalizado no sistema.",
      },
      {
        titulo: "Execução das atividades",
        data: "Em andamento",
        status: "CURRENT",
        descricao: "O discente está vinculado e apto a executar o plano de trabalho.",
      },
      {
        titulo: "Encerramento do vínculo",
        data: "Previsto para 31/12/2026",
        status: "PENDING",
      },
    ],
  },
  {
    id: "bond_002",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    area: "Inteligência Artificial",
    orientador: "Profa. Helena Costa",
    unidade: "Centro de Informática",
    edital: "PIBITI 2026",
    planoTitulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    statusVinculo: "PENDENTE_DOCUMENTACAO",
    statusProjeto: "EM_ACOMPANHAMENTO",
    participacao: "VOLUNTARIO",
    inicio: "10/05/2026",
    fim: "30/11/2026",
    periodoAcademico: "2026.1",
    observacao:
      "O vínculo ainda não foi concluído porque há documentos pendentes de validação.",
    pendencia:
      "Atualizar comprovante bancário e reenviar documentação complementar para conclusão da análise.",
    timeline: [
      {
        titulo: "Inscrição aprovada",
        data: "10/04/2026",
        status: "DONE",
      },
      {
        titulo: "Análise documental",
        data: "Em andamento",
        status: "CURRENT",
        descricao: "A equipe identificou inconsistência em parte da documentação enviada.",
      },
      {
        titulo: "Regularização de pendências",
        data: "Aguardando envio do discente",
        status: "FAILED",
        descricao: "É necessário corrigir os documentos para prosseguir.",
      },
      {
        titulo: "Homologação do vínculo",
        data: "Aguardando etapa anterior",
        status: "PENDING",
      },
      {
        titulo: "Início das atividades",
        data: "Aguardando homologação",
        status: "PENDING",
      },
    ],
  },
  {
    id: "bond_003",
    projetoId: "proj_003",
    projetoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    area: "Engenharia de Software",
    orientador: "Prof. Marcos Oliveira",
    unidade: "Centro de Informática",
    edital: "PROBEX 2025",
    planoTitulo: "Plano de Trabalho em Sistemas Web Acadêmicos",
    statusVinculo: "FINALIZADO",
    statusProjeto: "ENCERRADO",
    participacao: "VOLUNTARIO",
    inicio: "01/08/2025",
    fim: "20/12/2025",
    periodoAcademico: "2025.2",
    observacao:
      "O vínculo foi concluído com encerramento do projeto e registro histórico mantido no sistema.",
    timeline: [
      {
        titulo: "Inscrição aprovada",
        data: "20/07/2025",
        status: "DONE",
      },
      {
        titulo: "Vínculo homologado",
        data: "01/08/2025",
        status: "DONE",
      },
      {
        titulo: "Execução das atividades",
        data: "Agosto a dezembro de 2025",
        status: "DONE",
      },
      {
        titulo: "Encerramento do projeto",
        data: "20/12/2025",
        status: "DONE",
      },
      {
        titulo: "Vínculo finalizado",
        data: "20/12/2025",
        status: "DONE",
      },
    ],
  },
]

function getBondStatusLabel(status: BondStatusType) {
  switch (status) {
    case "VINCULADO":
      return "Vinculado"
    case "AGUARDANDO_INICIO":
      return "Aguardando início"
    case "PENDENTE_DOCUMENTACAO":
      return "Pendente de documentação"
    case "EM_ANALISE":
      return "Em análise"
    case "FINALIZADO":
      return "Finalizado"
    case "DESVINCULADO":
      return "Desvinculado"
    default:
      return status
  }
}

function getBondStatusClasses(status: BondStatusType) {
  switch (status) {
    case "VINCULADO":
      return "border-success/30 bg-success/10 text-success"
    case "AGUARDANDO_INICIO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE_DOCUMENTACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "FINALIZADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "DESVINCULADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getProjectStatusLabel(
  status: BondData["statusProjeto"]
) {
  switch (status) {
    case "ATIVO":
      return "Ativo"
    case "EM_ACOMPANHAMENTO":
      return "Em acompanhamento"
    case "ENCERRADO":
      return "Encerrado"
    case "PENDENTE_HOMOLOGACAO":
      return "Pendente de homologação"
    default:
      return status
  }
}

function getProjectStatusClasses(
  status: BondData["statusProjeto"]
) {
  switch (status) {
    case "ATIVO":
      return "border-success/30 bg-success/10 text-success"
    case "EM_ACOMPANHAMENTO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE_HOMOLOGACAO":
      return "border-primary/30 bg-primary/10 text-primary"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getParticipationClasses(type: ParticipationType) {
  if (type === "BOLSISTA") {
    return "border-primary/30 bg-primary/10 text-primary"
  }

  return "border-neutral/30 bg-neutral/10 text-neutral"
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

export default function BondStatus() {
  const { id } = useParams()

  const bond =
    BONDS.find((item) => item.projetoId === id || item.id === id) ?? BONDS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Situação do Vínculo • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to={`/discente/projetos/${bond.projetoId}`}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para o projeto
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getBondStatusClasses(
                    bond.statusVinculo
                  )}`}
                >
                  <Link2 size={14} />
                  {getBondStatusLabel(bond.statusVinculo)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getProjectStatusClasses(
                    bond.statusProjeto
                  )}`}
                >
                  <FolderKanban size={14} />
                  {getProjectStatusLabel(bond.statusProjeto)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getParticipationClasses(
                    bond.participacao
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {bond.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                Situação do vínculo
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Acompanhe o estado do seu vínculo com o projeto, as etapas já concluídas e eventuais pendências.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              <Link
                to={`/discente/projetos/${bond.projetoId}`}
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
                to="/discente/historico"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-primary px-4 py-3
                  text-sm font-semibold text-white
                  hover:opacity-90 transition
                "
              >
                <History size={16} />
                Ver histórico
              </Link>
            </div>
          </div>
        </header>

        {/* ALERTA DE PENDÊNCIA */}
        {bond.pendencia && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {bond.pendencia}
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
              <UserRound size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Orientador(a)</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {bond.orientador}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Building2 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Unidade</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {bond.unidade}
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
                <div className="text-sm text-neutral">Período do vínculo</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {bond.inicio} até {bond.fim}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Edital</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {bond.edital}
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
                  Dados do vínculo
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="md:col-span-2">
                  <div className="text-neutral">Projeto</div>
                  <div className="mt-1 font-semibold text-primary">
                    {bond.projetoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Área</div>
                  <div className="mt-1 font-medium text-primary">
                    {bond.area}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período acadêmico</div>
                  <div className="mt-1 font-medium text-primary">
                    {bond.periodoAcademico}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Plano de trabalho</div>
                  <div className="mt-1 font-semibold text-primary">
                    {bond.planoTitulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status do vínculo</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getBondStatusClasses(
                        bond.statusVinculo
                      )}`}
                    >
                      <Link2 size={14} />
                      {getBondStatusLabel(bond.statusVinculo)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Participação</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getParticipationClasses(
                        bond.participacao
                      )}`}
                    >
                      <BadgeCheck size={14} />
                      {bond.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Linha do tempo do vínculo
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5">
                {bond.timeline.map((step, index) => (
                  <div key={`${step.titulo}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      {index < bond.timeline.length - 1 && (
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

            {bond.observacao && (
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Observação do vínculo
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div
                  className={`
                    rounded-xl px-4 py-4 text-sm leading-6
                    ${
                      bond.statusVinculo === "PENDENTE_DOCUMENTACAO" ||
                      bond.statusVinculo === "DESVINCULADO"
                        ? "border border-warning/20 bg-warning/5 text-neutral"
                        : "border border-primary/20 bg-primary/5 text-neutral"
                    }
                  `}
                >
                  {bond.observacao}
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
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getBondStatusClasses(
                    bond.statusVinculo
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getBondStatusLabel(bond.statusVinculo)}
                </span>

                <p className="text-neutral leading-6">
                  {bond.statusVinculo === "VINCULADO" &&
                    "Seu vínculo está ativo e você pode executar normalmente as atividades do plano de trabalho."}

                  {bond.statusVinculo === "AGUARDANDO_INICIO" &&
                    "Seu vínculo foi registrado e aguarda o início formal das atividades."}

                  {bond.statusVinculo === "PENDENTE_DOCUMENTACAO" &&
                    "Seu vínculo depende da regularização documental para conclusão da análise."}

                  {bond.statusVinculo === "EM_ANALISE" &&
                    "O vínculo está em análise pela equipe responsável."}

                  {bond.statusVinculo === "FINALIZADO" &&
                    "Seu vínculo foi concluído e permanece disponível no histórico."}

                  {bond.statusVinculo === "DESVINCULADO" &&
                    "O vínculo foi encerrado antes da conclusão prevista."}
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
                  to={`/discente/projetos/${bond.projetoId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <Eye size={16} />
                  Ver projeto
                </Link>

                <Link
                  to="/discente/historico"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <History size={16} />
                  Ver histórico
                </Link>

                <Link
                  to="/discente/projetos"
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