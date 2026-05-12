import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  History,
  Info,
  Notebook,
  Send,
  UserRound,
  Users,
  XCircle,
} from "lucide-react"

type ProjectStatus =
  | "Rascunho"
  | "Enviado"
  | "Em avaliação"
  | "Aprovado"
  | "Necessita ajustes"
  | "Reprovado"

type WorkPlanStatus =
  | "Pendente"
  | "Aprovado"
  | "Em avaliação"
  | "Necessita ajustes"
  | "Reprovado"

type WorkPlan = {
  id: number
  title: string
  modality: "Bolsista" | "Voluntário" | "Bolsista ou Voluntário"
  vacancies: number
  workload: number
  status: WorkPlanStatus
  summary: string
  activities: string
  studentProfile: string
  expectedResults: string
  indicatedStudents: {
    id: number
    name: string
    course: string
    type: "Bolsista" | "Voluntário"
  }[]
}

type HistoryItem = {
  id: number
  date: string
  title: string
  description: string
  status: "success" | "info" | "warning" | "danger" | "neutral"
}

type Project = {
  id: number
  title: string
  edital: string
  area: string
  subarea: string
  unidade: string
  linhaPesquisa: string
  ano: string
  status: ProjectStatus
  coordinator: string
  startDate: string
  endDate: string
  updatedAt: string
  keywords: string[]
  summary: string
  justification: string
  objectives: string
  methodology: string
  expectedResults: string
  schedule: string
  references: string
  workPlans: WorkPlan[]
  history: HistoryItem[]
}

const projectMock: Project = {
  id: 1,
  title: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
  edital: "PIBIC 2026",
  area: "Ciência da Computação",
  subarea: "Interação Humano-Computador",
  unidade: "CI",
  linhaPesquisa: "Tecnologias Assistivas e Sistemas Inteligentes",
  ano: "2026",
  status: "Aprovado",
  coordinator: "Prof. Dr. Carlos Henrique Almeida",
  startDate: "01/08/2026",
  endDate: "31/07/2027",
  updatedAt: "10/05/2026",
  keywords: ["Acessibilidade", "VLibras", "Tecnologia Assistiva", "Interface", "Inclusão Digital"],
  summary:
    "O projeto propõe o desenvolvimento e a avaliação de recursos digitais voltados à acessibilidade comunicacional, com foco em ferramentas integradas ao ecossistema VLibras. A proposta busca aprimorar a experiência de usuários surdos e ouvintes em ambientes digitais educacionais e institucionais.",
  justification:
    "A acessibilidade digital é um requisito essencial para ampliar a inclusão de pessoas surdas em serviços públicos, plataformas educacionais e sistemas institucionais. O projeto se justifica pela necessidade de investigar, propor e avaliar recursos que melhorem a mediação linguística e a interação entre usuários e sistemas digitais.",
  objectives:
    "Investigar, desenvolver e avaliar recursos computacionais voltados à acessibilidade digital, considerando aspectos de usabilidade, tradução automática, experiência do usuário e integração com plataformas existentes.",
  methodology:
    "A metodologia será organizada em etapas: levantamento bibliográfico, análise de requisitos, prototipação de interfaces, desenvolvimento incremental, testes com usuários, análise de resultados e documentação científica. Serão utilizados métodos qualitativos e quantitativos para avaliar a efetividade das soluções propostas.",
  expectedResults:
    "Espera-se obter protótipos funcionais, documentação técnica, relatórios de avaliação, produção científica e contribuições para o aprimoramento de ferramentas de acessibilidade digital.",
  schedule:
    "Mês 1-2: revisão bibliográfica e levantamento de requisitos. Mês 3-5: prototipação e desenvolvimento inicial. Mês 6-8: testes e ajustes. Mês 9-11: avaliação dos resultados. Mês 12: consolidação, relatório final e produção científica.",
  references:
    "BRASIL. Lei Brasileira de Inclusão da Pessoa com Deficiência. W3C. Web Content Accessibility Guidelines. NIELSEN, J. Usability Engineering. Trabalhos recentes sobre tecnologias assistivas, tradução automática e acessibilidade digital.",
  workPlans: [
    {
      id: 1,
      title: "Prototipação de interfaces acessíveis para ambientes educacionais",
      modality: "Bolsista",
      vacancies: 1,
      workload: 20,
      status: "Aprovado",
      summary:
        "Plano voltado à construção e avaliação de protótipos de interface com foco em acessibilidade, usabilidade e integração com recursos de tradução em Libras.",
      activities:
        "Levantamento de requisitos, criação de wireframes, desenvolvimento de protótipos navegáveis, testes de usabilidade, documentação dos resultados e apoio na elaboração de relatório parcial e final.",
      studentProfile:
        "Discente com interesse em desenvolvimento front-end, acessibilidade digital, UX/UI e tecnologias assistivas.",
      expectedResults:
        "Protótipos validados, relatório de avaliação de usabilidade e documentação de recomendações de design acessível.",
      indicatedStudents: [
        {
          id: 1,
          name: "Ana Beatriz Santos",
          course: "Ciência da Computação",
          type: "Bolsista",
        },
      ],
    },
    {
      id: 2,
      title: "Análise de dados de uso em ferramentas de acessibilidade",
      modality: "Voluntário",
      vacancies: 1,
      workload: 12,
      status: "Aprovado",
      summary:
        "Plano direcionado à análise de registros de uso e indicadores de interação em ferramentas digitais de acessibilidade.",
      activities:
        "Organização de dados, criação de indicadores, análise exploratória, geração de gráficos, interpretação dos resultados e apoio na escrita de relatórios técnicos.",
      studentProfile:
        "Discente com interesse em análise de dados, Python, visualização de dados e avaliação de sistemas.",
      expectedResults:
        "Painéis analíticos, indicadores de uso e relatório interpretativo sobre padrões de interação.",
      indicatedStudents: [],
    },
    {
      id: 3,
      title: "Documentação técnica e avaliação de recursos acessíveis",
      modality: "Bolsista ou Voluntário",
      vacancies: 1,
      workload: 16,
      status: "Em avaliação",
      summary:
        "Plano voltado à documentação de funcionalidades, acompanhamento de testes e análise qualitativa dos recursos desenvolvidos.",
      activities:
        "Elaboração de documentação, acompanhamento de testes, sistematização de feedbacks, revisão de materiais e apoio na consolidação dos relatórios.",
      studentProfile:
        "Discente com boa escrita, organização, interesse em pesquisa aplicada e acessibilidade.",
      expectedResults:
        "Documentação técnica estruturada, registros de avaliação e suporte à redação dos relatórios do projeto.",
      indicatedStudents: [],
    },
  ],
  history: [
    {
      id: 1,
      date: "10/05/2026",
      title: "Projeto aprovado",
      description: "O projeto foi aprovado para execução no edital PIBIC 2026.",
      status: "success",
    },
    {
      id: 2,
      date: "07/05/2026",
      title: "Avaliação concluída",
      description: "A avaliação do projeto e dos planos de trabalho foi registrada.",
      status: "info",
    },
    {
      id: 3,
      date: "03/05/2026",
      title: "Projeto enviado",
      description: "O projeto foi submetido pelo coordenador para avaliação.",
      status: "neutral",
    },
    {
      id: 4,
      date: "28/04/2026",
      title: "Rascunho criado",
      description: "O projeto foi iniciado no sistema.",
      status: "neutral",
    },
  ],
}

function getProjectStatusClass(status: ProjectStatus) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Em avaliação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Enviado":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Necessita ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    case "Rascunho":
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getWorkPlanStatusClass(status: WorkPlanStatus) {
  switch (status) {
    case "Aprovado":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Em avaliação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Necessita ajustes":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Reprovado":
      return "border-red-200 bg-red-50 text-red-700"
    case "Pendente":
    default:
      return "border-neutral/20 bg-neutral/10 text-neutral"
  }
}

function getProjectStatusIcon(status: ProjectStatus) {
  switch (status) {
    case "Aprovado":
      return <CheckCircle2 size={14} />
    case "Reprovado":
      return <XCircle size={14} />
    case "Em avaliação":
      return <ClipboardList size={14} />
    case "Enviado":
      return <Send size={14} />
    case "Necessita ajustes":
      return <FileText size={14} />
    case "Rascunho":
    default:
      return <Notebook size={14} />
  }
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

export default function CoordinatorProjectView() {
  const { id } = useParams()

  const project = projectMock

  const totalPlans = project.workPlans.length
  const approvedPlans = project.workPlans.filter((plan) => plan.status === "Aprovado").length
  const totalVacancies = project.workPlans.reduce((acc, plan) => acc + plan.vacancies, 0)
  const indicatedStudents = project.workPlans.reduce(
    (acc, plan) => acc + plan.indicatedStudents.length,
    0
  )

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* BOTÃO DE VOLTAR */}
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        {/* HEADER DA PÁGINA */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <FolderKanban size={14} />
                  Projeto #{id ?? project.id}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getProjectStatusClass(
                    project.status
                  )}`}
                >
                  {getProjectStatusIcon(project.status)}
                  {project.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-primary">
                {project.title}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                {project.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral">
                <span className="inline-flex items-center gap-2">
                  <GraduationCap size={16} />
                  {project.area}
                </span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span>{project.unidade}</span>

                <span className="h-1 w-1 rounded-full bg-neutral/40" />

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Atualizado em {project.updatedAt}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              {(project.status === "Rascunho" || project.status === "Necessita ajustes") && (
                <Link
                  to={`/coordenador/projetos/novo?edit=${project.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  <Edit3 size={16} />
                  Editar projeto
                </Link>
              )}

              {(project.status === "Rascunho" || project.status === "Necessita ajustes") && (
                <Link
                  to={`/coordenador/projetos/${project.id}?acao=enviar`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <Send size={16} />
                  Enviar para avaliação
                </Link>
              )}

              <Link
                to={`/coordenador/indicacoes?projeto=${project.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/10"
              >
                <Users size={16} />
                Indicar discentes
              </Link>
            </div>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Planos vinculados
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {totalPlans}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Notebook size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              {approvedPlans} plano(s) aprovado(s)
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Vagas previstas
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {totalVacancies}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <UserRound size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Somatório das vagas dos planos
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Discentes indicados
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {indicatedStudents}/{totalVacancies}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Users size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Indicações já realizadas
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Edital
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {project.ano}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardCheck size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              {project.edital}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* DADOS DO PROJETO */}
            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Info size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-primary">
                    Dados do projeto
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral">
                    Informações gerais vinculadas ao edital e à unidade acadêmica.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem label="Edital" value={project.edital} />
                <InfoItem label="Ano" value={project.ano} />
                <InfoItem label="Coordenador" value={project.coordinator} />
                <InfoItem label="Unidade" value={project.unidade} />
                <InfoItem label="Área" value={project.area} />
                <InfoItem label="Subárea" value={project.subarea} />
                <InfoItem label="Linha de pesquisa" value={project.linhaPesquisa} />
                <InfoItem label="Período" value={`${project.startDate} até ${project.endDate}`} />
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-primary">
                  Palavras-chave
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-medium text-neutral"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* DESCRIÇÃO */}
            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-primary">
                    Descrição da proposta
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral">
                    Conteúdo submetido pelo coordenador para avaliação do projeto.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <TextBlock title="Resumo" text={project.summary} />
                <TextBlock title="Justificativa" text={project.justification} />
                <TextBlock title="Objetivos" text={project.objectives} />
                <TextBlock title="Metodologia" text={project.methodology} />
                <TextBlock title="Resultados esperados" text={project.expectedResults} />
                <TextBlock title="Cronograma" text={project.schedule} />
                <TextBlock title="Referências" text={project.references} />
              </div>
            </section>

            {/* PLANOS */}
            <section className="rounded-2xl border border-neutral/30 bg-white">
              <div className="flex flex-col gap-3 border-b border-neutral/20 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-primary">
                    Planos de trabalho vinculados
                  </h2>
                  <p className="mt-1 text-sm text-neutral">
                    Planos cadastrados dentro deste projeto para indicação de discentes.
                  </p>
                </div>

                <Link
                  to={`/coordenador/projetos/novo?tipo=plano&projeto=${project.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  <Notebook size={16} />
                  Adicionar plano
                </Link>
              </div>

              <div className="divide-y divide-neutral/10">
                {project.workPlans.map((plan, index) => (
                  <article key={plan.id} className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral/5 px-3 py-1 text-xs font-semibold text-neutral">
                            Plano {index + 1}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getWorkPlanStatusClass(
                              plan.status
                            )}`}
                          >
                            <CheckCircle2 size={14} />
                            {plan.status}
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-semibold text-primary">
                          {plan.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-neutral">
                          {plan.summary}
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                          <MiniInfo label="Modalidade" value={plan.modality} />
                          <MiniInfo label="Vagas" value={`${plan.vacancies}`} />
                          <MiniInfo label="Carga semanal" value={`${plan.workload}h`} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <Link
                          to={`/coordenador/projetos/${project.id}?plano=${plan.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                        >
                          <Eye size={16} />
                          Ver plano
                        </Link>

                        {plan.status === "Aprovado" && (
                          <Link
                            to={`/coordenador/indicacoes?projeto=${project.id}&plano=${plan.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/10"
                          >
                            <Users size={16} />
                            Indicar
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <TextBlock title="Atividades previstas" text={plan.activities} compact />
                      <TextBlock title="Perfil esperado do discente" text={plan.studentProfile} compact />
                      <TextBlock title="Resultados esperados" text={plan.expectedResults} compact />

                      <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                        <p className="text-sm font-semibold text-primary">
                          Discentes indicados
                        </p>

                        {plan.indicatedStudents.length > 0 ? (
                          <div className="mt-3 space-y-3">
                            {plan.indicatedStudents.map((student) => (
                              <div
                                key={student.id}
                                className="rounded-xl border border-neutral/20 bg-white p-3"
                              >
                                <p className="text-sm font-semibold text-primary">
                                  {student.name}
                                </p>
                                <p className="mt-1 text-xs text-neutral">
                                  {student.course} • {student.type}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-2 text-sm leading-6 text-neutral">
                            Nenhum discente indicado para este plano até o momento.
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* LATERAL */}
          <aside className="space-y-6">
            {/* AÇÕES RÁPIDAS */}
            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <h2 className="text-base font-semibold text-primary">
                Ações rápidas
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral">
                Acesse as próximas etapas relacionadas ao projeto.
              </p>

              <div className="mt-5 space-y-2">

                <Link
                  to={`/coordenador/indicacoes?projeto=${project.id}`}
                  className="flex items-center justify-between rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <Users size={16} />
                    Indicar discentes
                  </span>
                  <Eye size={15} />
                </Link>

                <Link
                  to={`/coordenador/relatorios?projeto=${project.id}`}
                  className="flex items-center justify-between rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText size={16} />
                    Relatórios
                  </span>
                  <Eye size={15} />
                </Link>
              </div>
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
                    Movimentações registradas para este projeto.
                  </p>
                </div>
              </div>

              <div className="relative space-y-5">
                {project.history.map((item, index) => (
                  <div key={item.id} className="relative flex gap-3">
                    {index !== project.history.length - 1 && (
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
          </aside>
        </section>
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

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-white p-3">
      <p className="text-xs font-medium text-neutral">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-primary">
        {value}
      </p>
    </div>
  )
}

function TextBlock({
  title,
  text,
  compact = false,
}: {
  title: string
  text: string
  compact?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-neutral/20 bg-neutral/5 ${
        compact ? "p-4" : "p-5"
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