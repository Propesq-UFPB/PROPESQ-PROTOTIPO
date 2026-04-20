import React, { useState } from "react"
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
  Hash,
  Globe,
  Tag,
  Layers,
  Target,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  BookMarked,
  GanttChartSquare,
  ScrollText,
} from "lucide-react"

type ProjectStatus =
  | "ATIVO"
  | "EM_ACOMPANHAMENTO"
  | "ENCERRADO"
  | "PENDENTE_HOMOLOGACAO"
  | "EM_EXECUCAO"

type BondStatus =
  | "VINCULADO"
  | "AGUARDANDO_INICIO"
  | "PENDENTE_DOCUMENTACAO"
  | "FINALIZADO"

type ParticipationType = "BOLSISTA" | "VOLUNTARIO"

type WorkPlan = {
  titulo: string
  tipoBolsa: string
}

type ScheduleItem = {
  atividade: string
  meses: string[]
}

type EditalHistoryItem = {
  edital: string
  cota: string
  periodo: string
}

type ProjectDetails = {
  id: string
  codigo: string
  titulo: string
  tituloEn: string
  tipo: string
  categoria: string
  statusProjeto: ProjectStatus
  unidade: string
  centro: string
  palavrasChave: string[]
  keywordsEn: string[]
  edital: string
  cota: string
  grandeArea: string
  area: string
  subarea: string
  especialidade: string
  resumo: string
  resumoEn: string
  introducao: string
  objetivoGeral: string
  objetivosEspecificos: string[]
  metodologia: string
  referencias: string[]
  atividades: string[]
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
  orientador: string
  statusVinculo: BondStatus
  participacao: ParticipationType
  periodo: string
  inicio: string
  fim: string
  planoTitulo: string
  editalHistorico: EditalHistoryItem[]
  planosDeTrabalho: WorkPlan[]
  cronograma: ScheduleItem[]
}

const SCHEDULE_MONTHS = [
  "Set/25",
  "Out/25",
  "Nov/25",
  "Dez/25",
  "Jan/26",
  "Fev/26",
  "Mar/26",
  "Abr/26",
  "Mai/26",
  "Jun/26",
  "Jul/26",
  "Ago/26",
]

const PROJECTS: ProjectDetails[] = [
  {
    id: "proj_001",
    codigo: "PVL20220-2025",
    titulo:
      "Plataforma Inteligente para Visualização de Dados Aplicada à Gestão do PIBIC na UFPB",
    tituloEn:
      "Intelligent Platform for Data Visualization Applied to PIBIC Management at UFPB",
    tipo: "INTERNO (Projeto Novo)",
    categoria: "Pesquisa Científica",
    statusProjeto: "EM_EXECUCAO",
    unidade: "CI - DEPARTAMENTO DE INFORMÁTICA (11.01.34.01.01)",
    centro: "CENTRO DE INFORMÁTICA (CI) (11.00.64)",
    palavrasChave: ["visualização de dados", "IA", "gestão acadêmica"],
    keywordsEn: ["data visualization", "AI", "academic management"],
    edital:
      "2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq - SELEÇÃO DE PROJETOS DE INICIAÇÃO CIENTÍFICA",
    cota: "2025-2026 PIBIC-CNPQ-UFPB (01/09/2025 a 31/08/2026)",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Metodologia e Técnicas da Computação",
    especialidade: "Sistemas de Informação",
    resumo:
      "O Programa Institucional de Bolsas de Iniciação Científica (PIBIC) desempenha papel fundamental na formação acadêmica de estudantes de graduação na UFPB. No entanto, os dados relacionados à sua operacionalização estão dispersos em diferentes sistemas, dificultando a geração de indicadores consolidados e o planejamento estratégico. Este projeto propõe o desenvolvimento de uma plataforma digital integrada para centralizar, visualizar e analisar os dados do PIBIC por meio de dashboards interativos e técnicas de inteligência artificial.",
    resumoEn:
      "The Institutional Scientific Initiation Scholarship Program (PIBIC) plays a key role in the academic development of undergraduate students at UFPB. However, data related to its operation is scattered across various systems, hindering the generation of consolidated indicators and strategic planning. This project proposes the development of an integrated digital platform to centralize, visualize, and analyze PIBIC data through interactive dashboards and artificial intelligence techniques.",
    introducao:
      "A iniciação científica tem se consolidado como uma das mais importantes estratégias de formação acadêmica e científica no ensino superior brasileiro. Na Universidade Federal da Paraíba (UFPB), o Programa Institucional de Bolsas de Iniciação Científica (PIBIC) desempenha papel fundamental no incentivo à pesquisa entre estudantes de graduação. Dada sua relevância, é importante que a gestão desse programa seja conduzida com base em evidências e dados bem estruturados, permitindo maior eficiência, transparência e planejamento estratégico.",
    objetivoGeral:
      "Desenvolver uma plataforma inteligente de visualização e busca de dados do PIBIC-UFPB, integrando ferramentas de IA para apoio à sua gestão.",
    objetivosEspecificos: [
      "Levantar, estruturar e integrar os dados do PIBIC dos últimos anos.",
      "Desenvolver dashboards interativos com indicadores relevantes para a PROPESQ.",
      "Criar mecanismos de busca de informações sobre discentes, orientadores e projetos.",
      "Analisar os principais temas e áreas de pesquisa desenvolvidos na iniciação científica da UFPB.",
      "Identificar linhas de pesquisa com maior produtividade e concentração de bolsas, subsidiando estratégias institucionais de fortalecimento científico.",
      "Testar a plataforma com usuários da PROPESQ para avaliação e refinamento iterativo.",
    ],
    metodologia:
      "O desenvolvimento da plataforma será estruturado em quatro frentes técnicas articuladas entre si: (1) Engenharia e modelagem de dados — coleta e organização de dados históricos do PIBIC provenientes do SIGAA, SIGPRPG e outros registros institucionais; (2) Desenvolvimento front-end — interface interativa com tecnologias web recentes de visualização de dados, permitindo filtros por curso, unidade, vigência, orientador e tipo de bolsa; (3) Análise temática e mineração de textos — análise de resumos e títulos utilizando PLN e LLMs para identificar áreas, temas e linhas de pesquisa; (4) Avaliação e testes com usuários — testes de usabilidade com membros da PROPESQ e CGPAIC, aplicando a escala SUS e coleta de feedback qualitativo.",
    referencias: [
      "Çöpgeven, N. S., & Firat, M. (2022). Effects of Dashboard Usage on E-learning Interactions and Academic Achievement. Journal of Educators Online.",
      "Pei, B., Cheng, Y., et al. (2024). LearningViz: a dashboard for visualizing and closing learning performance gaps. Smart Learning Environments, 11, Article 56.",
      "Susnjak, T., Ramaswami, G. S., & Mathrani, A. (2022). Learning analytics dashboard: a tool for providing actionable insights to learners. International Journal of Educational Technology in Higher Education, 19, Article 12.",
      "Vieira, C., Parsons, P., & Byrd, V. (2018). Visual learning analytics of educational data: A systematic literature review. Computers & Education, 122, 119–135.",
      "Xia, M., Wei, H., Xu, M., Lo, L. Y. H., Wang, Y., & Zhang, R. (2019). Visual Analytics of Student Learning Behaviors on K-12 Mathematics E-learning Platforms. arXiv:1909.04749.",
    ],
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
    orientador: "Prof. André Silva",
    statusVinculo: "VINCULADO",
    participacao: "BOLSISTA",
    periodo: "2026.1",
    inicio: "01/09/2025",
    fim: "31/08/2026",
    planoTitulo: "Desenvolvimento da Interface Web e Dashboards Interativos",
    editalHistorico: [
      {
        edital:
          "2025/2026 - EDITAL 04/2025/PROPESQ - PIBIC/PIBIT/UFPB/CNPq - SELEÇÃO DE PROJETOS DE INICIAÇÃO CIENTÍFICA",
        cota: "2025-2026 PIBIC-CNPQ-UFPB",
        periodo: "01/09/2025 a 31/08/2026",
      },
    ],
    planosDeTrabalho: [
      { titulo: "Engenharia de Dados e Integração de Fontes", tipoBolsa: "A DEFINIR" },
      { titulo: "Avaliação com Usuários e Apoio à Gestão da Plataforma", tipoBolsa: "PIBIC-UFPB (IC)" },
      { titulo: "Desenvolvimento da Interface Web e Dashboards Interativos", tipoBolsa: "PIBIC-UFPB (IC)" },
      { titulo: "Análise Temática e Mapeamento de Áreas de Pesquisa", tipoBolsa: "PIBIC-UFPB (IC)" },
    ],
    cronograma: [
      {
        atividade: "Levantamento e coleta dos dados históricos do PIBIC; reuniões com CGPAIC para definição de requisitos",
        meses: ["Set/25", "Out/25", "Nov/25"],
      },
      {
        atividade: "Modelagem do banco de dados; início do desenvolvimento da interface web",
        meses: ["Dez/25", "Jan/26", "Fev/26"],
      },
      {
        atividade: "Implementação das análises temáticas e painéis com agregação por áreas e linhas",
        meses: ["Fev/26", "Mar/26", "Abr/26", "Mai/26"],
      },
      {
        atividade: "Testes com usuários, ajustes com base no feedback e entrega da plataforma",
        meses: ["Mai/26", "Jun/26", "Jul/26", "Ago/26"],
      },
      {
        atividade: "Redação de relatórios e publicações das principais contribuições científicas relacionadas com o projeto",
        meses: ["Set/25", "Out/25", "Nov/25", "Dez/25", "Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26", "Jul/26", "Ago/26"],
      },
    ],
  },
]

function getProjectStatusLabel(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    ATIVO: "Ativo",
    EM_ACOMPANHAMENTO: "Em acompanhamento",
    ENCERRADO: "Encerrado",
    PENDENTE_HOMOLOGACAO: "Pendente de homologação",
    EM_EXECUCAO: "Em execução",
  }
  return labels[status] ?? status
}

function getProjectStatusClasses(status: ProjectStatus) {
  switch (status) {
    case "ATIVO":
    case "EM_EXECUCAO":
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
  const labels: Record<BondStatus, string> = {
    VINCULADO: "Vinculado",
    AGUARDANDO_INICIO: "Aguardando início",
    PENDENTE_DOCUMENTACAO: "Pendente de documentação",
    FINALIZADO: "Finalizado",
  }
  return labels[status] ?? status
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
  return type === "BOLSISTA"
    ? "border-primary/30 bg-primary/10 text-primary"
    : "border-neutral/30 bg-neutral/10 text-neutral"
}

function InfoRow({
  label,
  value,
  span2 = false,
}: {
  label: string
  value: React.ReactNode
  span2?: boolean
}) {
  return (
    <div className={span2 ? "md:col-span-2" : ""}>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
        {label}
      </div>
      <div className="text-sm leading-6 text-primary">{value}</div>
    </div>
  )
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
        </div>
      }
      className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm"
    >
      {children}
    </Card>
  )
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-neutral/20 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
            {label}
          </div>
          <div className="mt-1 text-[13px] font-semibold leading-5 text-primary">
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

function Collapsible({
  label,
  children,
  defaultOpen = false,
}: {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral/20 bg-neutral/5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-primary transition hover:bg-neutral/10"
      >
        <span>{label}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && <div className="border-t border-neutral/15 bg-white px-5 py-5">{children}</div>}
    </div>
  )
}

function ScheduleGrid({ items }: { items: ScheduleItem[] }) {
  const years = ["2025", "2026"]
  const monthsPerYear: Record<string, string[]> = {
    "2025": ["Set/25", "Out/25", "Nov/25", "Dez/25"],
    "2026": ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26", "Jul/26", "Ago/26"],
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full border-collapse text-xs">
        <thead>
          <tr>
            <th
              className="w-56 border border-neutral/20 bg-primary/5 px-3 py-2 text-left font-semibold text-primary"
              rowSpan={2}
            >
              Atividade
            </th>
            {years.map((y) => (
              <th
                key={y}
                colSpan={monthsPerYear[y].length}
                className="border border-neutral/20 bg-primary/5 px-2 py-2 text-center font-semibold text-primary"
              >
                {y}
              </th>
            ))}
          </tr>
          <tr>
            {SCHEDULE_MONTHS.map((m) => (
              <th
                key={m}
                className="whitespace-nowrap border border-neutral/20 bg-neutral/5 px-1 py-1.5 text-center font-medium text-neutral"
              >
                {m.split("/")[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-neutral/5"}>
              <td className="border border-neutral/20 px-3 py-3 leading-5 text-primary">
                {item.atividade}
              </td>
              {SCHEDULE_MONTHS.map((m) => (
                <td key={m} className="border border-neutral/20 p-0">
                  {item.meses.includes(m) && (
                    <div className="min-h-[34px] w-full bg-primary/20" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ProjectView() {
  const { id } = useParams()
  const project = PROJECTS.find((item) => item.id === id) ?? PROJECTS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{project.titulo} • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <header className="overflow-hidden rounded-[28px] border border-neutral/20 bg-white shadow-sm">
          <div className="border-b border-neutral/15 px-6 py-4">
            <Link
              to="/discente/projetos"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para meus projetos
            </Link>
          </div>

          <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.6fr_340px]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getProjectStatusClasses(project.statusProjeto)}`}
                >
                  <FolderKanban size={14} />
                  {getProjectStatusLabel(project.statusProjeto)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getBondStatusClasses(project.statusVinculo)}`}
                >
                  <BadgeCheck size={14} />
                  {getBondStatusLabel(project.statusVinculo)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getParticipationClasses(project.participacao)}`}
                >
                  <BadgeCheck size={14} />
                  {project.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
                </span>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1 text-xs font-mono text-neutral">
                  <Hash size={12} />
                  {project.codigo}
                </p>

                <h1 className="max-w-4xl text-2xl font-bold leading-tight text-primary md:text-[30px]">
                  {project.titulo}
                </h1>

                {project.tituloEn && (
                  <p className="mt-2 max-w-4xl text-sm italic leading-6 text-neutral">
                    <Globe size={13} className="mr-1 inline" />
                    {project.tituloEn}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric
                  icon={<UserRound size={18} />}
                  label="Orientador(a)"
                  value={project.orientador}
                />
                <SummaryMetric
                  icon={<Building2 size={18} />}
                  label="Unidade"
                  value={project.unidade}
                />
                <SummaryMetric
                  icon={<CalendarDays size={18} />}
                  label="Período"
                  value={`${project.inicio} até ${project.fim}`}
                />
                <SummaryMetric
                  icon={<FileText size={18} />}
                  label="Tipo / Categoria"
                  value={`${project.tipo} — ${project.categoria}`}
                />
              </div>
            </div>

            <aside className="flex h-full flex-col gap-4 rounded-3xl border border-primary/10 bg-primary/[0.03] p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                  Plano de trabalho
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-primary">
                  {project.planoTitulo}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                  Período acadêmico
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">{project.periodo}</p>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-2">
                <Link
                  to={`/discente/projetos/${project.id}/vinculo`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Link2 size={16} />
                  Ver vínculo
                </Link>

                <Link
                  to="/discente/historico"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  <History size={16} />
                  Ver histórico
                </Link>
              </div>
            </aside>
          </div>
        </header>

        {project.possuiPendencia && project.pendenciaTexto && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral shadow-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">Pendência identificada:</span>{" "}
                {project.pendenciaTexto}
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <SectionCard icon={<FolderKanban size={16} />} title="Dados do Projeto de Pesquisa">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoRow label="Código" value={project.codigo} />
                <InfoRow
                  label="Situação"
                  value={
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${getProjectStatusClasses(project.statusProjeto)}`}
                    >
                      {getProjectStatusLabel(project.statusProjeto)}
                    </span>
                  }
                />
                <InfoRow label="Título do Projeto" value={project.titulo} span2 />
                <InfoRow
                  label="Title (EN)"
                  value={<span className="italic">{project.tituloEn}</span>}
                  span2
                />
                <InfoRow label="Tipo" value={project.tipo} />
                <InfoRow label="Categoria" value={project.categoria} />
                <InfoRow label="Unidade" value={project.unidade} span2 />
                <InfoRow label="Centro" value={project.centro} span2 />
                <InfoRow
                  label="Palavras-chave"
                  value={
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.palavrasChave.map((k) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          <Tag size={10} />
                          {k}
                        </span>
                      ))}
                    </div>
                  }
                  span2
                />
                <InfoRow
                  label="Keywords"
                  value={
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.keywordsEn.map((k) => (
                        <span
                          key={k}
                          className="inline-flex rounded-full border border-neutral/30 bg-neutral/5 px-2.5 py-1 text-xs font-medium text-neutral"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  }
                  span2
                />
                <InfoRow label="Edital" value={project.edital} span2 />
                <InfoRow label="Cota" value={project.cota} span2 />
              </div>
            </SectionCard>

            <SectionCard icon={<History size={16} />} title="Histórico de Editais / Cotas">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary/5">
                      <th className="rounded-tl-xl border border-neutral/20 px-4 py-3 text-left font-semibold text-primary">
                        Edital
                      </th>
                      <th className="border border-neutral/20 px-4 py-3 text-left font-semibold text-primary">
                        Cota
                      </th>
                      <th className="rounded-tr-xl border border-neutral/20 px-4 py-3 text-left font-semibold text-primary">
                        Período da Cota
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.editalHistorico.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-neutral/5"}>
                        <td className="border border-neutral/20 px-4 py-3 text-primary">
                          {row.edital}
                        </td>
                        <td className="border border-neutral/20 px-4 py-3 text-primary">
                          {row.cota}
                        </td>
                        <td className="border border-neutral/20 px-4 py-3 text-primary">
                          {row.periodo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard icon={<Layers size={16} />} title="Área de Conhecimento">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoRow label="Grande Área" value={project.grandeArea} />
                <InfoRow label="Área" value={project.area} />
                <InfoRow label="Subárea" value={project.subarea} />
                <InfoRow label="Especialidade" value={project.especialidade} />
              </div>
            </SectionCard>

            <SectionCard icon={<ScrollText size={16} />} title="Corpo do Projeto">
              <div className="space-y-4">
                <Collapsible label="Resumo (PT)" defaultOpen>
                  <p className="text-sm leading-7 text-primary">{project.resumo}</p>
                </Collapsible>

                <Collapsible label="Abstract (EN)">
                  <p className="text-sm italic leading-7 text-primary">{project.resumoEn}</p>
                </Collapsible>

                <Collapsible label="Introdução / Justificativa">
                  <p className="text-sm leading-7 text-primary">{project.introducao}</p>
                </Collapsible>
              </div>
            </SectionCard>

            <SectionCard icon={<Target size={16} />} title="Objetivos">
              <div className="space-y-5 text-sm">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Objetivo Geral
                  </p>
                  <p className="leading-6 text-primary">{project.objetivoGeral}</p>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Objetivos Específicos
                  </p>
                  <ul className="space-y-2">
                    {project.objetivosEspecificos.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-primary">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={<FlaskConical size={16} />} title="Metodologia">
              <p className="text-sm leading-7 text-primary">{project.metodologia}</p>
            </SectionCard>

            <SectionCard icon={<BookMarked size={16} />} title="Referências">
              <ul className="space-y-3">
                {project.referencias.map((ref, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-neutral">
                    <BookOpen size={14} className="mt-0.5 shrink-0 text-primary/60" />
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard icon={<GanttChartSquare size={16} />} title="Cronograma de Atividades">
              <ScheduleGrid items={project.cronograma} />
            </SectionCard>

            <SectionCard icon={<ClipboardList size={16} />} title="Planos de Trabalho">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary/5">
                      <th className="border border-neutral/20 px-4 py-3 text-left font-semibold text-primary">
                        Título
                      </th>
                      <th className="border border-neutral/20 px-4 py-3 text-left font-semibold text-primary">
                        Tipo da Bolsa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.planosDeTrabalho.map((p, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-neutral/5"}>
                        <td className="border border-neutral/20 px-4 py-3 text-primary">
                          {p.titulo}
                        </td>
                        <td className="border border-neutral/20 px-4 py-3 text-primary">
                          {p.tipoBolsa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard icon={<CheckCircle2 size={16} />} title="Atividades Previstas">
              <ul className="space-y-3">
                {project.atividades.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-primary">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard icon={<ClipboardList size={16} />} title="Observações do Projeto">
              <ul className="space-y-3">
                {project.observacoes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-neutral">
                    <ClipboardList size={15} className="mt-0.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </main>

          <aside >
            <SectionCard icon={<BadgeCheck size={16} />} title="Situação do Discente">
              <div className="space-y-4 text-sm">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Status do projeto
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getProjectStatusClasses(project.statusProjeto)}`}
                  >
                    <FolderKanban size={13} />
                    {getProjectStatusLabel(project.statusProjeto)}
                  </span>
                </div>

                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Status do vínculo
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getBondStatusClasses(project.statusVinculo)}`}
                  >
                    <BadgeCheck size={13} />
                    {getBondStatusLabel(project.statusVinculo)}
                  </span>
                </div>

                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Participação
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getParticipationClasses(project.participacao)}`}
                  >
                    <BadgeCheck size={13} />
                    {project.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
                  </span>
                </div>

                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Plano de Trabalho
                  </div>
                  <p className="font-medium leading-6 text-primary">{project.planoTitulo}</p>
                </div>

                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral/70">
                    Período acadêmico
                  </div>
                  <p className="font-medium text-primary">{project.periodo}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={<Link2 size={16} />} title="Ações Rápidas">
              <div className="flex flex-col gap-3">
                <Link
                  to={`/discente/projetos/${project.id}/vinculo`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Link2 size={16} />
                  Ver vínculo
                </Link>

                <Link
                  to="/discente/historico"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  <History size={16} />
                  Ver histórico
                </Link>

                <Link
                  to="/discente/projetos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/30 px-4 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
                >
                  <ArrowLeft size={16} />
                  Voltar à lista
                </Link>
              </div>
            </SectionCard>

            <SectionCard icon={<BookOpen size={16} />} title="Recomendações">
              <ul className="space-y-3 text-sm text-neutral">
                <li className="flex items-start gap-3">
                  <BookOpen size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>Acompanhe as orientações do orientador ao longo do projeto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>Verifique prazos de relatórios e atividades vinculadas ao edital.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>Mantenha sua documentação e vínculo sempre atualizados.</span>
                </li>
              </ul>
            </SectionCard>
          </aside>
        </section>
      </div>
    </div>
  )
}