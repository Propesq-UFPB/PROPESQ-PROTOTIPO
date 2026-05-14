import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  FolderKanban,
  BadgeCheck,
  Clock3,
  UserRound,
  CalendarDays,
  Eye,
  AlertTriangle,
} from "lucide-react"

type ProjectStatus =
  | "ATIVO"
  | "EM_ACOMPANHAMENTO"
  | "ENCERRADO"
  | "PENDENTE_HOMOLOGACAO"

type BondStatus =
  | "VINCULADO"
  | "AGUARDANDO_INICIO"
  | "PENDENTE_DOCUMENTACAO"
  | "FINALIZADO"

type ParticipationType = "BOLSISTA" | "VOLUNTARIO"

type StudentProject = {
  id: string
  titulo: string
  area: string
  orientador: string
  unidade: string
  edital: string
  statusProjeto: ProjectStatus
  statusVinculo: BondStatus
  participacao: ParticipationType
  periodo: string
  inicio: string
  fim: string
  possuiPendencia: boolean
  pendenciaTexto?: string
  resumo: string
}

const PROJECTS: StudentProject[] = [
  {
    id: "proj_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    area: "Sistemas de Informação",
    orientador: "Prof. André Silva",
    unidade: "Centro de Informática",
    edital: "PIBIC 2026",
    statusProjeto: "ATIVO",
    statusVinculo: "VINCULADO",
    participacao: "BOLSISTA",
    periodo: "2026.1",
    inicio: "2026-05-01",
    fim: "2026-12-31",
    possuiPendencia: false,
    resumo:
      "Projeto voltado ao desenvolvimento de uma plataforma digital para gestão de pesquisa, submissões e acompanhamento acadêmico.",
  },
  {
    id: "proj_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    area: "Inteligência Artificial",
    orientador: "Profa. Helena Costa",
    unidade: "Centro de Informática",
    edital: "PIBITI 2026",
    statusProjeto: "EM_ACOMPANHAMENTO",
    statusVinculo: "PENDENTE_DOCUMENTACAO",
    participacao: "VOLUNTARIO",
    periodo: "2026.1",
    inicio: "2026-05-10",
    fim: "2026-11-30",
    possuiPendencia: true,
    pendenciaTexto:
      "Atualizar comprovante bancário e validar documentação complementar.",
    resumo:
      "Projeto com foco em modelos de IA para apoio à classificação e organização de dados científicos institucionais.",
  },
  {
    id: "proj_003",
    titulo: "Ambiente Web para Apoio à Submissão ENIC",
    area: "Engenharia de Software",
    orientador: "Prof. Marcos Oliveira",
    unidade: "Centro de Informática",
    edital: "PROBEX 2025",
    statusProjeto: "ENCERRADO",
    statusVinculo: "FINALIZADO",
    participacao: "VOLUNTARIO",
    periodo: "2025.2",
    inicio: "2025-08-01",
    fim: "2025-12-20",
    possuiPendencia: false,
    resumo:
      "Projeto voltado à organização do fluxo de submissão de trabalhos acadêmicos e acompanhamento institucional do ENIC.",
  },
  {
    id: "proj_004",
    titulo: "Painel Analítico para Indicadores de Iniciação Científica",
    area: "Ciência de Dados",
    orientador: "Prof. Ricardo Lima",
    unidade: "CCEN",
    edital: "PIBIC 2026",
    statusProjeto: "PENDENTE_HOMOLOGACAO",
    statusVinculo: "AGUARDANDO_INICIO",
    participacao: "BOLSISTA",
    periodo: "2026.1",
    inicio: "2026-05-15",
    fim: "2026-12-15",
    possuiPendencia: false,
    resumo:
      "Projeto para criação de dashboards e indicadores de monitoramento de bolsas, editais e relatórios acadêmicos.",
  },
]

function formatDateBr(date: string) {
  if (!date) return "—"

  const [year, month, day] = date.split("-")

  if (!year || !month || !day) return date

  return `${day}/${month}/${year}`
}

function getProjectStatusLabel(status: ProjectStatus) {
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

function getProjectStatusClasses(status: ProjectStatus) {
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

function getBondStatusLabel(status: BondStatus) {
  switch (status) {
    case "VINCULADO":
      return "Vinculado"
    case "AGUARDANDO_INICIO":
      return "Aguardando início"
    case "PENDENTE_DOCUMENTACAO":
      return "Pendente de documentação"
    case "FINALIZADO":
      return "Finalizado"
    default:
      return status
  }
}

function getBondStatusClasses(status: BondStatus) {
  switch (status) {
    case "VINCULADO":
      return "border-success/30 bg-success/10 text-success"
    case "AGUARDANDO_INICIO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "PENDENTE_DOCUMENTACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "FINALIZADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
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

export default function MyProjects() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Meus Projetos • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-5 space-y-5">

        <header className="rounded-2xl border border-neutral/20 bg-white px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">
            Meus Projetos
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
            Acompanhe seus vínculos, sua participação e a situação dos projetos
            em que você atua.
          </p>
        </header>

        <section className="w-full rounded-2xl border border-neutral/20 bg-white shadow-card">
          <div className="border-b border-neutral/20 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FolderKanban size={16} />
              Projetos vinculados ao discente
            </div>
          </div>

          {PROJECTS.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="text-base font-semibold text-primary">
                Nenhum projeto vinculado
              </div>

              <p className="mt-1 text-sm text-neutral">
                Quando houver projetos vinculados ao seu perfil, eles aparecerão
                nesta página.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral/20">
              {PROJECTS.map((project) => (
                <article key={project.id} className="w-full px-5 py-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-primary">
                            {project.titulo}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getProjectStatusClasses(
                              project.statusProjeto
                            )}`}
                          >
                            <FolderKanban size={14} />
                            {getProjectStatusLabel(project.statusProjeto)}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getBondStatusClasses(
                              project.statusVinculo
                            )}`}
                          >
                            <BadgeCheck size={14} />
                            {getBondStatusLabel(project.statusVinculo)}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getParticipationClasses(
                              project.participacao
                            )}`}
                          >
                            <BadgeCheck size={14} />
                            {project.participacao === "BOLSISTA"
                              ? "Bolsista"
                              : "Voluntário"}
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-neutral">
                          {project.resumo}
                        </p>
                      </div>

                      <div className="flex shrink-0">
                        <Link
                          to={`/discente/projetos/${project.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                        >
                          <Eye size={16} />
                          Visualizar
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <InfoBox
                        icon={<UserRound size={15} />}
                        label="Orientador(a)"
                        value={project.orientador}
                      />

                      <InfoBox
                        icon={<FolderKanban size={15} />}
                        label="Área"
                        value={project.area}
                      />

                      <InfoBox
                        icon={<CalendarDays size={15} />}
                        label="Período"
                        value={`${formatDateBr(project.inicio)} até ${formatDateBr(
                          project.fim
                        )}`}
                      />

                      <InfoBox
                        icon={<Clock3 size={15} />}
                        label="Edital"
                        value={project.edital}
                      />
                    </div>

                    {project.possuiPendencia && project.pendenciaTexto && (
                      <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-neutral">
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            size={16}
                            className="mt-0.5 shrink-0 text-warning"
                          />

                          <div>
                            <span className="font-semibold text-warning">
                              Pendência identificada:
                            </span>{" "}
                            {project.pendenciaTexto}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function InfoBox(props: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-neutral">
        {props.icon}
        {props.label}
      </div>

      <div className="mt-1 text-sm font-medium text-primary">
        {props.value}
      </div>
    </div>
  )
}