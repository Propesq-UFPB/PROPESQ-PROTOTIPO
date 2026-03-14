import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  FolderKanban,
  BadgeCheck,
  UserRound,
  Building2,
  CalendarDays,
  FileText,
  Link2,
  History,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  BookOpen,
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

type ProjectDetails = {
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
  planoTitulo: string
  resumo: string
  objetivoGeral: string
  atividades: string[]
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const PROJECTS: ProjectDetails[] = [
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
    inicio: "01/05/2026",
    fim: "31/12/2026",
    planoTitulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    resumo:
      "Projeto voltado ao desenvolvimento de uma plataforma digital para gestão de pesquisa, submissões, acompanhamento acadêmico e integração de fluxos institucionais.",
    objetivoGeral:
      "Desenvolver uma solução web para apoiar o gerenciamento de editais, inscrições, vínculos, relatórios e indicadores acadêmicos de pesquisa.",
    atividades: [
      "Levantamento e modelagem de requisitos do sistema.",
      "Desenvolvimento de interfaces e fluxos para perfis institucionais.",
      "Estruturação de dashboards e acompanhamento acadêmico.",
      "Apoio à validação funcional das páginas e módulos do sistema.",
    ],
    observacoes: [
      "O discente deve acompanhar periodicamente as demandas do orientador.",
      "As entregas parciais devem seguir o cronograma institucional.",
      "Os relatórios devem ser submetidos dentro dos prazos definidos no edital.",
    ],
    possuiPendencia: false,
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
    inicio: "10/05/2026",
    fim: "30/11/2026",
    planoTitulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    resumo:
      "Projeto com foco em modelos de IA para classificação, organização e análise de produção científica institucional.",
    objetivoGeral:
      "Aplicar técnicas de inteligência artificial no apoio à gestão e categorização de dados científicos produzidos em ambiente acadêmico.",
    atividades: [
      "Levantamento de bases e metadados científicos.",
      "Estudo de técnicas de classificação supervisionada.",
      "Preparação de dados e experimentação com modelos.",
      "Documentação dos resultados obtidos.",
    ],
    observacoes: [
      "A participação depende da regularização documental do discente.",
      "Atividades práticas só devem iniciar após validação do vínculo.",
    ],
    possuiPendencia: true,
    pendenciaTexto:
      "Atualizar comprovante bancário e validar documentação complementar.",
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
    inicio: "01/08/2025",
    fim: "20/12/2025",
    planoTitulo: "Plano de Trabalho em Sistemas Web Acadêmicos",
    resumo:
      "Projeto voltado à organização do fluxo de submissão de trabalhos acadêmicos e acompanhamento institucional do ENIC.",
    objetivoGeral:
      "Estruturar um ambiente web para apoiar a submissão, consulta e acompanhamento de trabalhos e eventos acadêmicos.",
    atividades: [
      "Mapeamento do fluxo de submissão de trabalhos.",
      "Desenvolvimento de protótipos de interface.",
      "Implementação de páginas de acompanhamento.",
      "Validação funcional com base em requisitos institucionais.",
    ],
    observacoes: [
      "Projeto encerrado com conclusão do plano de atividades.",
      "O histórico permanece disponível para consulta do discente.",
    ],
    possuiPendencia: false,
  },
]

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

export default function ProjectView() {
  const { id } = useParams()

  const project = PROJECTS.find((item) => item.id === id) ?? PROJECTS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{project.titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/projetos"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para meus projetos
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
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
                  {project.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                {project.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {project.resumo}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              <Link
                to={`/discente/projetos/${project.id}/vinculo`}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-primary px-4 py-3
                  text-sm font-semibold text-white
                  hover:opacity-90 transition
                "
              >
                <Link2 size={16} />
                Ver vínculo
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
            </div>
          </div>
        </header>

        {/* ALERTA DE PENDÊNCIA */}
        {project.possuiPendencia && project.pendenciaTexto && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {project.pendenciaTexto}
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
                  {project.orientador}
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
                  {project.unidade}
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
                <div className="text-sm text-neutral">Período</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {project.inicio} até {project.fim}
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
                  {project.edital}
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
                  <div className="text-neutral">Título do projeto</div>
                  <div className="mt-1 font-semibold text-primary">
                    {project.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Área</div>
                  <div className="mt-1 font-medium text-primary">
                    {project.area}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período acadêmico</div>
                  <div className="mt-1 font-medium text-primary">
                    {project.periodo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Plano de trabalho</div>
                  <div className="mt-1 font-semibold text-primary">
                    {project.planoTitulo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Objetivo geral</div>
                  <p className="mt-1 text-primary leading-6">
                    {project.objetivoGeral}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Atividades previstas
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {project.atividades.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-primary"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações do projeto
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {project.observacoes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    <ClipboardList size={16} className="mt-0.5 text-primary" />
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
                  Situação do discente
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral">Status do projeto</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getProjectStatusClasses(
                        project.statusProjeto
                      )}`}
                    >
                      <FolderKanban size={14} />
                      {getProjectStatusLabel(project.statusProjeto)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Status do vínculo</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getBondStatusClasses(
                        project.statusVinculo
                      )}`}
                    >
                      <BadgeCheck size={14} />
                      {getBondStatusLabel(project.statusVinculo)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Participação</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getParticipationClasses(
                        project.participacao
                      )}`}
                    >
                      <BadgeCheck size={14} />
                      {project.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
                    </span>
                  </div>
                </div>
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
                  to={`/discente/projetos/${project.id}/vinculo`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <Link2 size={16} />
                  Ver vínculo
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

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Recomendações
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3 text-sm text-neutral">
                <li className="flex items-start gap-3">
                  <BookOpen size={16} className="mt-0.5 text-primary" />
                  <span>Acompanhe as orientações do orientador ao longo do projeto.</span>
                </li>

                <li className="flex items-start gap-3">
                  <BookOpen size={16} className="mt-0.5 text-primary" />
                  <span>Verifique prazos de relatórios e atividades vinculadas ao edital.</span>
                </li>

                <li className="flex items-start gap-3">
                  <BookOpen size={16} className="mt-0.5 text-primary" />
                  <span>Mantenha sua documentação e vínculo sempre atualizados.</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}