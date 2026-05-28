import { Link, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Edit3,
  ExternalLink,
  FileText,
  FileUp,
  GraduationCap,
  History,
  Info,
  Notebook,
  Star,
  Tags,
  UserRound,
  Users,
  XCircle,
} from "lucide-react"

type ProjectStatus =
  | "Em elaboração"
  | "Submetido"
  | "Em avaliação"
  | "Aprovado"
  | "Reprovado"
  | "Cancelado"

type ProjectType = "Interno" | "Externo"

type HistoryItem = {
  id: number
  date: string
  title: string
  description: string
  status: "success" | "info" | "warning" | "danger" | "neutral"
}

type EvaluationGrade = {
  id: number
  evaluator: string
  role: string
  projectScore: number
  workPlanScore: number
  finalScore: number
  recommendation: "Aprovado" | "Reprovado" | "Aprovado com ressalvas"
  comment: string
  evaluatedAt: string
}

type ProjectMember = {
  id: number
  name: string
  role: string
  bond: string
  email: string
  lattes: string
}

type ODS = {
  id: number
  label: string
}

type ScheduleItem = {
  id: number
  period: string
  activity: string
}

type WorkPlan = {
  id: number
  title: string
  modality: "Bolsista" | "Voluntário" | "Bolsista ou Voluntário"
  vacancies: number
  workload: number
  status: "Pendente" | "Aprovado" | "Em avaliação" | "Necessita ajustes" | "Reprovado"
  studentProfile: string
  summary: string
  activities: string
  expectedResults: string
  references: string
}

type Project = {
  id: number
  type: ProjectType
  status: ProjectStatus
  isEditDeadlineOpen: boolean
  canRequestReconsideration: boolean
  evaluationPeriodClosed: boolean

  edital: string
  title: string
  titleEn: string
  keywords: string[]
  keywordsEn: string[]
  summary: string
  abstract: string
  introductionJustification: string
  objectives: string
  methodology: string
  references: string

  center: string
  unit: string
  area: string
  greatArea: string
  subarea: string
  specialty: string
  researchLine: string
  contactEmail: string
  startDate: string
  endDate: string
  submittedAt: string
  updatedAt: string

  ods: ODS[]
  schedule: ScheduleItem[]
  members: ProjectMember[]
  complementaryPdf: string
  externalApprovalProof: string

  internalData: {
    linkedToResearchGroup: "Sim" | "Não"
    researchGroup: string
    hasEthicsProtocol: "Sim" | "Não"
    ethicsCommittee: string
    ethicsProtocolNumber: string
  }

  externalData: {
    category: string
    subcategoryLevelOne: string
    subcategoryLevelTwo: string
    intellectualPropertyDefinition: string
    intellectualProductionTreatment: string
  }

  evaluationGrades: EvaluationGrade[]
  workPlans: WorkPlan[]
  history: HistoryItem[]
}

const SIGCHAMADOS_URL = "https://sigchamados.ufpb.br"

const projectMock: Project = {
  id: 1,
  type: "Interno",
  status: "Aprovado",
  isEditDeadlineOpen: true,
  canRequestReconsideration: true,
  evaluationPeriodClosed: true,

  edital: "PIBIC 2026",
  title: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
  titleEn: "Development of Digital Accessibility Resources with VLibras",
  keywords: ["Acessibilidade", "VLibras", "Tecnologia Assistiva", "Inclusão Digital"],
  keywordsEn: ["Accessibility", "VLibras", "Assistive Technology", "Digital Inclusion"],
  summary:
    "O projeto propõe o desenvolvimento e a avaliação de recursos digitais voltados à acessibilidade comunicacional, com foco em ferramentas integradas ao ecossistema VLibras.",
  abstract:
    "This project proposes the development and evaluation of digital resources for communicational accessibility, focusing on tools integrated into the VLibras ecosystem.",
  introductionJustification:
    "A acessibilidade digital é essencial para ampliar a inclusão de pessoas surdas em serviços públicos, plataformas educacionais e sistemas institucionais. O projeto se justifica pela necessidade de investigar, propor e avaliar recursos que melhorem a mediação linguística e a interação entre usuários e sistemas digitais.",
  objectives:
    "Investigar, desenvolver e avaliar recursos computacionais voltados à acessibilidade digital, considerando aspectos de usabilidade, tradução automática, experiência do usuário e integração com plataformas existentes.",
  methodology:
    "A metodologia será organizada em etapas: levantamento bibliográfico, análise de requisitos, prototipação de interfaces, desenvolvimento incremental, testes com usuários, análise de resultados e documentação científica.",
  references:
    "BRASIL. Lei Brasileira de Inclusão da Pessoa com Deficiência. W3C. Web Content Accessibility Guidelines. NIELSEN, J. Usability Engineering. Trabalhos recentes sobre tecnologias assistivas, tradução automática e acessibilidade digital.",

  center: "CI",
  unit: "Centro de Informática",
  area: "Ciência da Computação",
  greatArea: "Ciências Exatas e da Terra",
  subarea: "Interação Humano-Computador",
  specialty: "Tecnologias Assistivas",
  researchLine: "Tecnologias Assistivas e Sistemas Inteligentes",
  contactEmail: "coordenador@ufpb.br",
  startDate: "01/08/2026",
  endDate: "31/07/2027",
  submittedAt: "10/05/2026",
  updatedAt: "20/05/2026",

  ods: [
    { id: 4, label: "Educação de qualidade" },
    { id: 9, label: "Indústria, inovação e infraestrutura" },
    { id: 10, label: "Redução das desigualdades" },
  ],

  schedule: [
    {
      id: 1,
      period: "Mês 1",
      activity: "Revisão bibliográfica e levantamento de requisitos.",
    },
    {
      id: 2,
      period: "Mês 2",
      activity: "Análise de soluções existentes e definição metodológica.",
    },
    {
      id: 3,
      period: "Mês 3",
      activity: "Prototipação inicial dos recursos de acessibilidade.",
    },
    {
      id: 4,
      period: "Mês 4",
      activity: "Implementação incremental e validação técnica.",
    },
    {
      id: 5,
      period: "Mês 5",
      activity: "Testes com usuários e coleta de feedback.",
    },
    {
      id: 6,
      period: "Mês 6",
      activity: "Consolidação dos resultados e elaboração de relatório.",
    },
  ],

  members: [
    {
      id: 1,
      name: "Prof. Dr. Carlos Henrique Almeida",
      role: "Coordenador",
      bond: "UFPB",
      email: "carlos.almeida@ufpb.br",
      lattes: "http://lattes.cnpq.br/0000000000000001",
    },
    {
      id: 2,
      name: "Dra. Mariana Ferreira",
      role: "Pesquisadora",
      bond: "LAVID/UFPB",
      email: "mariana.ferreira@ufpb.br",
      lattes: "http://lattes.cnpq.br/0000000000000002",
    },
    {
      id: 3,
      name: "Ana Beatriz Santos",
      role: "Discente",
      bond: "Graduação em Ciência de Dados e IA",
      email: "ana.santos@academico.ufpb.br",
      lattes: "http://lattes.cnpq.br/0000000000000003",
    },
  ],

  complementaryPdf: "projeto-complementar-vlibras.pdf",
  externalApprovalProof: "Não se aplica a projeto interno",

  internalData: {
    linkedToResearchGroup: "Sim",
    researchGroup: "Tecnologias Assistivas e Sistemas Inteligentes",
    hasEthicsProtocol: "Sim",
    ethicsCommittee: "CEP/UFPB",
    ethicsProtocolNumber: "1234567",
  },

  externalData: {
    category: "Não se aplica",
    subcategoryLevelOne: "Não se aplica",
    subcategoryLevelTwo: "Não se aplica",
    intellectualPropertyDefinition: "Não se aplica",
    intellectualProductionTreatment: "Não se aplica",
  },

  evaluationGrades: [
    {
      id: 1,
      evaluator: "Avaliador 01",
      role: "Consultor ad hoc",
      projectScore: 9.2,
      workPlanScore: 9.0,
      finalScore: 9.1,
      recommendation: "Aprovado",
      comment:
        "Projeto bem estruturado, com justificativa consistente, metodologia adequada e boa aderência aos objetivos do edital.",
      evaluatedAt: "18/05/2026",
    },
    {
      id: 2,
      evaluator: "Avaliador 02",
      role: "Comitê interno",
      projectScore: 8.8,
      workPlanScore: 8.6,
      finalScore: 8.7,
      recommendation: "Aprovado com ressalvas",
      comment:
        "A proposta apresenta relevância institucional. Recomenda-se maior detalhamento das métricas de avaliação no acompanhamento.",
      evaluatedAt: "19/05/2026",
    },
  ],

  workPlans: [
    {
      id: 1,
      title: "Prototipação de interfaces acessíveis para ambientes educacionais",
      modality: "Bolsista",
      vacancies: 1,
      workload: 20,
      status: "Aprovado",
      studentProfile:
        "Discente com interesse em desenvolvimento front-end, acessibilidade digital, UX/UI e tecnologias assistivas.",
      summary:
        "Plano voltado à construção e avaliação de protótipos de interface com foco em acessibilidade, usabilidade e integração com recursos de tradução em Libras.",
      activities:
        "Levantamento de requisitos, criação de wireframes, desenvolvimento de protótipos navegáveis, testes de usabilidade e documentação dos resultados.",
      expectedResults:
        "Protótipos validados, relatório de avaliação de usabilidade e recomendações de design acessível.",
      references:
        "NIELSEN, J. Usability Engineering. W3C. Web Content Accessibility Guidelines.",
    },
    {
      id: 2,
      title: "Avaliação de recursos de tradução automática em Libras",
      modality: "Voluntário",
      vacancies: 1,
      workload: 12,
      status: "Em avaliação",
      studentProfile:
        "Discente com interesse em processamento de linguagem natural, Libras, avaliação de sistemas e análise de dados.",
      summary:
        "Plano voltado à avaliação de recursos de tradução automática em Libras integrados a sistemas digitais.",
      activities:
        "Organização de cenários de teste, definição de critérios de avaliação, coleta de dados, análise dos resultados e apoio na redação técnica.",
      expectedResults:
        "Relatório comparativo sobre desempenho, limitações e oportunidades de melhoria dos recursos avaliados.",
      references:
        "Trabalhos recentes sobre tradução automática, Libras, tecnologias assistivas e avaliação de sistemas inteligentes.",
    },
  ],

  history: [
    {
      id: 1,
      date: "02/05/2026",
      title: "Projeto criado",
      description: "O coordenador iniciou o cadastro do projeto.",
      status: "neutral",
    },
    {
      id: 2,
      date: "10/05/2026",
      title: "Projeto submetido",
      description: "A proposta foi enviada para avaliação.",
      status: "info",
    },
    {
      id: 3,
      date: "15/05/2026",
      title: "Avaliação iniciada",
      description: "O projeto foi distribuído para avaliadores.",
      status: "warning",
    },
    {
      id: 4,
      date: "20/05/2026",
      title: "Projeto aprovado",
      description: "O projeto recebeu parecer favorável após avaliação.",
      status: "success",
    },
  ],
}

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

function getStatusClass(status: ProjectStatus | WorkPlan["status"]) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Submetido":
    case "Em avaliação":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Em elaboração":
    case "Pendente":
    case "Necessita ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Reprovado":
    case "Cancelado":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/5 text-neutral"
  }
}

function getStatusIcon(status: ProjectStatus | WorkPlan["status"]) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Reprovado":
    case "Cancelado":
      return <XCircle size={14} />
    case "Submetido":
    case "Em avaliação":
      return <ClipboardList size={14} />
    default:
      return <FileText size={14} />
  }
}

function getHistoryClass(status: HistoryItem["status"]) {
  switch (status) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "danger":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-neutral/20 bg-neutral/5 text-neutral"
  }
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-neutral/30 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral/20 px-6 py-4">
        {icon}

        <div>
          <h2 className="text-sm font-bold text-primary">{title}</h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  )
}

function InfoItem({
  label,
  value,
  preWrap,
}: {
  label: string
  value: string
  preWrap?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">
        {label}
      </p>

      <p
        className={cx(
          "mt-1 text-sm leading-6 text-neutral",
          preWrap && "whitespace-pre-wrap"
        )}
      >
        {value || "—"}
      </p>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: ProjectStatus | WorkPlan["status"]
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        getStatusClass(status)
      )}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  )
}

export default function CoordinatorProjectView() {
  const { id } = useParams()
  const project = projectMock

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/coordenador/projetos"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>

          <div className="flex flex-wrap gap-2">
            {project.isEditDeadlineOpen ? (
              <Link
                to={`/coordenador/projetos/${id ?? project.id}/editar`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <Edit3 size={16} />
                Editar projeto
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-neutral/10 px-4 py-2.5 text-sm font-semibold text-neutral"
              >
                <Edit3 size={16} />
                Edição encerrada
              </button>
            )}

            <a
              href={SIGCHAMADOS_URL}
              target="_blank"
              rel="noreferrer"
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                project.canRequestReconsideration
                  ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  : "pointer-events-none cursor-not-allowed border-neutral/20 bg-neutral/10 text-neutral"
              )}
            >
              <ExternalLink size={16} />
              Solicitar reconsideração
            </a>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <Ban size={16} />
              Cancelar
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-neutral/30 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <FileText size={14} />
                Projeto #{project.id}
              </div>

              <h1 className="mt-3 max-w-4xl text-2xl font-bold tracking-tight text-primary">
                {project.title}
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral">
                {project.titleEn}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={project.status} />

                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                  <CalendarDays size={14} />
                  Submetido em {project.submittedAt}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                  <Info size={14} />
                  {project.type}
                </span>
              </div>
            </div>

            <div className="grid min-w-[260px] grid-cols-2 gap-3 rounded-2xl border border-neutral/20 bg-neutral/5 p-4">
              <InfoItem label="Edital" value={project.edital} />
              <InfoItem label="Atualizado em" value={project.updatedAt} />
              <InfoItem label="Início" value={project.startDate} />
              <InfoItem label="Fim" value={project.endDate} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card
              title="Campos preenchidos do projeto"
              subtitle="Dados gerais, campos do Anexo II e informações acadêmicas."
              icon={<ClipboardCheck size={18} className="text-primary" />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoItem label="Tipo" value={project.type} />
                <InfoItem label="E-mail de contato" value={project.contactEmail} />
                <InfoItem label="Centro" value={project.center} />
                <InfoItem label="Unidade" value={project.unit} />
                <InfoItem label="Grande área" value={project.greatArea} />
                <InfoItem label="Área" value={project.area} />
                <InfoItem label="Subárea" value={project.subarea} />
                <InfoItem label="Especialidade" value={project.specialty} />
                <InfoItem label="Linha de pesquisa" value={project.researchLine} />

                <div className="md:col-span-2">
                  <InfoItem label="Título" value={project.title} />
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Title" value={project.titleEn} />
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-neutral">
                    <Tags size={14} />
                    Palavras-chave
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-neutral">
                    <Tags size={14} />
                    Keywords
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.keywordsEn.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Descrição resumida" value={project.summary} preWrap />
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Abstract" value={project.abstract} preWrap />
                </div>

                <div className="md:col-span-2">
                  <InfoItem
                    label="Introdução / justificativa"
                    value={project.introductionJustification}
                    preWrap
                  />
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Objetivos" value={project.objectives} preWrap />
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Metodologia" value={project.methodology} preWrap />
                </div>

                <div className="md:col-span-2">
                  <InfoItem label="Referências" value={project.references} preWrap />
                </div>
              </div>
            </Card>

            <Card
              title="ODS e cronograma"
              subtitle="Objetivos do Desenvolvimento Sustentável e planejamento de execução."
              icon={<GraduationCap size={18} className="text-primary" />}
            >
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-neutral">
                  ODS vinculados
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.ods.map((ods) => (
                    <span
                      key={ods.id}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[11px] text-white">
                        {ods.id}
                      </span>
                      {ods.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">
                  Cronograma
                </p>

                {project.schedule.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-neutral/20 bg-neutral/5 p-4"
                  >
                    <p className="text-sm font-bold text-primary">{item.period}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral">
                      {item.activity}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Membros do projeto"
              subtitle="Equipe vinculada ao projeto."
              icon={<Users size={18} className="text-primary" />}
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-neutral/20 bg-neutral/5 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-primary">
                          {member.name}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-neutral">
                          {member.role} • {member.bond}
                        </p>

                        <p className="mt-2 text-sm text-neutral">
                          {member.email}
                        </p>

                        <p className="mt-1 break-all text-xs text-neutral">
                          Lattes: {member.lattes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Planos de trabalho vinculados"
              subtitle="Planos cadastrados e vinculados ao projeto."
              icon={<Notebook size={18} className="text-primary" />}
            >
              <div className="space-y-4">
                {project.workPlans.map((plan) => (
                  <article
                    key={plan.id}
                    className="rounded-2xl border border-neutral/20 bg-white p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-base font-bold text-primary">
                          {plan.title}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                            {plan.modality}
                          </span>

                          <span className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                            {plan.vacancies} vaga(s)
                          </span>

                          <span className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                            {plan.workload}h semanais
                          </span>

                          <StatusBadge status={plan.status} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InfoItem label="Perfil do discente" value={plan.studentProfile} />
                      <InfoItem label="Resumo" value={plan.summary} preWrap />

                      <div className="md:col-span-2">
                        <InfoItem label="Atividades" value={plan.activities} preWrap />
                      </div>

                      <div className="md:col-span-2">
                        <InfoItem
                          label="Resultados esperados"
                          value={plan.expectedResults}
                          preWrap
                        />
                      </div>

                      <div className="md:col-span-2">
                        <InfoItem label="Referências" value={plan.references} preWrap />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card
              title="Notas dos avaliadores"
              subtitle="Disponíveis apenas após o encerramento do período de avaliação."
              icon={<Star size={18} className="text-primary" />}
            >
              {project.evaluationPeriodClosed ? (
                <div className="space-y-4">
                  {project.evaluationGrades.map((grade) => (
                    <article
                      key={grade.id}
                      className="rounded-2xl border border-neutral/20 bg-neutral/5 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-bold text-primary">
                            {grade.evaluator}
                          </p>

                          <p className="mt-1 text-xs text-neutral">
                            {grade.role} • Avaliado em {grade.evaluatedAt}
                          </p>
                        </div>

                        <span
                          className={cx(
                            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold",
                            grade.recommendation === "Aprovado"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : grade.recommendation === "Reprovado"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                          )}
                        >
                          {grade.recommendation}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-neutral/20 bg-white p-4">
                          <p className="text-[11px] font-bold uppercase text-neutral">
                            Nota do projeto
                          </p>

                          <p className="mt-1 text-xl font-bold text-primary">
                            {grade.projectScore.toFixed(1)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-white p-4">
                          <p className="text-[11px] font-bold uppercase text-neutral">
                            Nota do plano
                          </p>

                          <p className="mt-1 text-xl font-bold text-primary">
                            {grade.workPlanScore.toFixed(1)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-neutral/20 bg-white p-4">
                          <p className="text-[11px] font-bold uppercase text-neutral">
                            Nota final
                          </p>

                          <p className="mt-1 text-xl font-bold text-primary">
                            {grade.finalScore.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <InfoItem label="Comentário" value={grade.comment} preWrap />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />

                  <div>
                    <p className="text-sm font-bold">
                      Notas ainda indisponíveis
                    </p>

                    <p className="mt-1 text-xs leading-5">
                      As notas dos avaliadores serão exibidas após o encerramento
                      do período de avaliação.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title="Status atual"
              subtitle="Situação mais recente do projeto."
              icon={<Info size={18} className="text-primary" />}
            >
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-neutral">
                    Status
                  </p>

                  <StatusBadge status={project.status} />
                </div>

                <InfoItem label="Submissão" value={project.submittedAt} />
                <InfoItem label="Última atualização" value={project.updatedAt} />

                <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                  <p className="text-xs font-bold text-primary">
                    Prazo de edição
                  </p>

                  <p className="mt-1 text-sm text-neutral">
                    {project.isEditDeadlineOpen
                      ? "Aberto para edição"
                      : "Encerrado para edição"}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              title="Arquivos"
              subtitle="Documentos vinculados ao projeto."
              icon={<FileUp size={18} className="text-primary" />}
            >
              <div className="space-y-4">
                <InfoItem
                  label="PDF complementar"
                  value={project.complementaryPdf}
                />

                <InfoItem
                  label="Comprovante externo"
                  value={project.externalApprovalProof}
                />
              </div>
            </Card>

            <Card
              title="Dados específicos"
              subtitle={
                project.type === "Interno"
                  ? "Informações do projeto interno."
                  : "Informações do projeto externo."
              }
              icon={<ClipboardCheck size={18} className="text-primary" />}
            >
              {project.type === "Interno" ? (
                <div className="space-y-4">
                  <InfoItem
                    label="Vinculado a grupo?"
                    value={project.internalData.linkedToResearchGroup}
                  />

                  <InfoItem
                    label="Grupo de pesquisa"
                    value={project.internalData.researchGroup}
                  />

                  <InfoItem
                    label="Possui protocolo de ética?"
                    value={project.internalData.hasEthicsProtocol}
                  />

                  <InfoItem
                    label="Comitê de ética"
                    value={project.internalData.ethicsCommittee}
                  />

                  <InfoItem
                    label="Nº do protocolo"
                    value={project.internalData.ethicsProtocolNumber}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <InfoItem
                    label="Categoria"
                    value={project.externalData.category}
                  />

                  <InfoItem
                    label="Subcategoria Nível I"
                    value={project.externalData.subcategoryLevelOne}
                  />

                  <InfoItem
                    label="Subcategoria Nível II"
                    value={project.externalData.subcategoryLevelTwo}
                  />

                  <InfoItem
                    label="Definição de PI"
                    value={project.externalData.intellectualPropertyDefinition}
                  />

                  <InfoItem
                    label="Tratamento da produção intelectual"
                    value={project.externalData.intellectualProductionTreatment}
                    preWrap
                  />
                </div>
              )}
            </Card>
          </aside>
        </section>
      </div>
    </main>
  )
}