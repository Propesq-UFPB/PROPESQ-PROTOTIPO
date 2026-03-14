import React from "react"
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  ArrowLeft,
  ClipboardList,
  FolderKanban,
  UserRound,
  BadgeCheck,
  CalendarDays,
  Eye,
  CheckCircle2,
  Clock3,
  BookOpen,
  Target,
  Sparkles,
} from "lucide-react"

type PlanStatus = "DISPONIVEL" | "EM_SELECAO" | "ENCERRADO"
type PlanArea =
  | "CIENCIA_DADOS"
  | "INTELIGENCIA_ARTIFICIAL"
  | "SISTEMAS_INFORMACAO"
  | "ENGENHARIA_SOFTWARE"
  | "EXTENSAO"

type PlanDetails = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  orientador: string
  edital: string
  area: PlanArea
  status: PlanStatus
  periodo: string
  vigencia: string
  resumo: string
  objetivoGeral: string
  perfilEsperado: string
  atividadesPrevistas: string[]
  requisitos: string[]
  resultadosEsperados: string[]
  palavrasChave: string[]
}

const PLANS: PlanDetails[] = [
  {
    id: "plan_001",
    titulo: "Plano de Trabalho em Ciência de Dados Aplicada",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
    area: "CIENCIA_DADOS",
    status: "DISPONIVEL",
    periodo: "2026.1",
    vigencia: "01/05/2026 a 31/12/2026",
    resumo:
      "Plano voltado ao apoio na modelagem de dados, estruturação de indicadores e desenvolvimento de fluxos analíticos para a plataforma acadêmica.",
    objetivoGeral:
      "Apoiar a estruturação analítica da plataforma acadêmica por meio de modelagem de dados, construção de indicadores e organização de informações para apoio à gestão institucional.",
    perfilEsperado:
      "Discente com interesse em dados, organização de informação, análise exploratória, indicadores acadêmicos e uso de ferramentas digitais.",
    atividadesPrevistas: [
      "Mapear dados relevantes para acompanhamento acadêmico.",
      "Estruturar indicadores vinculados a editais, projetos e relatórios.",
      "Apoiar a organização de dashboards e visões gerenciais.",
      "Contribuir com documentação funcional e lógica do módulo analítico.",
    ],
    requisitos: [
      "Interesse em ciência de dados e análise de informações.",
      "Capacidade de organização e documentação.",
      "Disponibilidade compatível com o plano.",
      "Compromisso com atividades orientadas pelo projeto.",
    ],
    resultadosEsperados: [
      "Estrutura inicial de indicadores acadêmicos.",
      "Apoio à organização de dados do sistema.",
      "Contribuição para dashboards institucionais.",
    ],
    palavrasChave: ["dados", "dashboards", "indicadores"],
  },
  {
    id: "plan_002",
    titulo: "Plano de Trabalho em Inteligência Artificial para Educação",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    orientador: "Profa. Helena Costa",
    edital: "PIBITI 2026",
    area: "INTELIGENCIA_ARTIFICIAL",
    status: "EM_SELECAO",
    periodo: "2026.1",
    vigencia: "10/05/2026 a 30/11/2026",
    resumo:
      "Plano focado em preparação de dados, classificação automatizada e apoio à análise de produção científica institucional.",
    objetivoGeral:
      "Explorar técnicas de inteligência artificial para classificação e organização de dados científicos produzidos em ambiente acadêmico.",
    perfilEsperado:
      "Discente com interesse em inteligência artificial, classificação de dados, modelagem experimental e análise aplicada.",
    atividadesPrevistas: [
      "Preparar bases de dados e atributos relevantes.",
      "Apoiar testes com abordagens de classificação.",
      "Documentar resultados e comportamento dos modelos.",
      "Contribuir com análises comparativas e interpretação dos achados.",
    ],
    requisitos: [
      "Interesse em IA aplicada.",
      "Noções básicas de dados e análise computacional.",
      "Disponibilidade para atividades orientadas.",
      "Compromisso com documentação dos experimentos.",
    ],
    resultadosEsperados: [
      "Bases de apoio organizadas para experimentação.",
      "Relatos comparativos de desempenho inicial.",
      "Contribuições para estruturação metodológica do projeto.",
    ],
    palavrasChave: ["IA", "classificação", "metadados"],
  },
  {
    id: "plan_003",
    titulo: "Plano de Trabalho em Sistemas Digitais para Gestão Acadêmica",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    orientador: "Prof. André Silva",
    edital: "PIBIC 2026",
    area: "SISTEMAS_INFORMACAO",
    status: "DISPONIVEL",
    periodo: "2026.1",
    vigencia: "01/05/2026 a 31/12/2026",
    resumo:
      "Plano destinado ao desenvolvimento de interfaces, fluxos do sistema e organização funcional de módulos acadêmicos.",
    objetivoGeral:
      "Contribuir com a definição e construção de módulos digitais voltados à gestão acadêmica de pesquisa, inscrições, relatórios e acompanhamento discente.",
    perfilEsperado:
      "Discente com interesse em sistemas de informação, organização de fluxos, experiência do usuário e construção de interfaces.",
    atividadesPrevistas: [
      "Mapear jornadas do usuário no sistema.",
      "Organizar estruturas de páginas e módulos.",
      "Apoiar o desenho de componentes e fluxos de navegação.",
      "Validar coerência entre requisitos e telas implementadas.",
    ],
    requisitos: [
      "Interesse em sistemas de informação.",
      "Capacidade de documentação e organização funcional.",
      "Afinidade com modelagem de interfaces.",
      "Disponibilidade para reuniões e alinhamentos.",
    ],
    resultadosEsperados: [
      "Fluxos melhor estruturados para o módulo discente.",
      "Apoio à coerência funcional do sistema.",
      "Contribuição para melhoria de usabilidade.",
    ],
    palavrasChave: ["sistemas", "frontend", "requisitos"],
  },
  {
    id: "plan_004",
    titulo: "Plano de Trabalho em Engenharia de Software Acadêmica",
    projetoId: "proj_003",
    projetoTitulo: "Ambiente Web para Apoio à Submissão ENIC",
    orientador: "Prof. Marcos Oliveira",
    edital: "PROBEX 2025",
    area: "ENGENHARIA_SOFTWARE",
    status: "ENCERRADO",
    periodo: "2025.2",
    vigencia: "01/08/2025 a 20/12/2025",
    resumo:
      "Plano com foco em prototipação, construção de páginas e suporte ao fluxo de submissões e acompanhamento do ENIC.",
    objetivoGeral:
      "Desenvolver soluções web de apoio ao fluxo de submissões acadêmicas e acompanhamento institucional do ENIC.",
    perfilEsperado:
      "Discente com interesse em engenharia de software, modelagem de sistemas e construção de interfaces acadêmicas.",
    atividadesPrevistas: [
      "Prototipar telas e fluxos de submissão.",
      "Apoiar construção de páginas do sistema.",
      "Documentar comportamento funcional das rotas.",
      "Contribuir para testes e validação de uso.",
    ],
    requisitos: [
      "Interesse em engenharia de software.",
      "Boa organização e clareza documental.",
      "Disponibilidade para desenvolvimento incremental.",
    ],
    resultadosEsperados: [
      "Páginas prototipadas para submissão.",
      "Melhoria do fluxo de acompanhamento do ENIC.",
      "Documentação funcional consolidada.",
    ],
    palavrasChave: ["engenharia de software", "protótipos", "fluxo web"],
  },
]

function getStatusLabel(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "Disponível"
    case "EM_SELECAO":
      return "Em seleção"
    case "ENCERRADO":
      return "Encerrado"
    default:
      return status
  }
}

function getStatusClasses(status: PlanStatus) {
  switch (status) {
    case "DISPONIVEL":
      return "border-success/30 bg-success/10 text-success"
    case "EM_SELECAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENCERRADO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function getAreaLabel(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "Ciência de Dados"
    case "INTELIGENCIA_ARTIFICIAL":
      return "Inteligência Artificial"
    case "SISTEMAS_INFORMACAO":
      return "Sistemas de Informação"
    case "ENGENHARIA_SOFTWARE":
      return "Engenharia de Software"
    case "EXTENSAO":
      return "Extensão"
    default:
      return area
  }
}

function getAreaClasses(area: PlanArea) {
  switch (area) {
    case "CIENCIA_DADOS":
      return "border-primary/30 bg-primary/10 text-primary"
    case "INTELIGENCIA_ARTIFICIAL":
      return "border-success/30 bg-success/10 text-success"
    case "SISTEMAS_INFORMACAO":
      return "border-warning/30 bg-warning/10 text-warning"
    case "ENGENHARIA_SOFTWARE":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EXTENSAO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

export default function PlanView() {
  const { id } = useParams()

  const plan = PLANS.find((item) => item.id === id) ?? PLANS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{plan.titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/planos"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para planos
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getAreaClasses(
                    plan.area
                  )}`}
                >
                  <BookOpen size={14} />
                  {getAreaLabel(plan.area)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    plan.status
                  )}`}
                >
                  {plan.status === "DISPONIVEL" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock3 size={14} />
                  )}
                  {getStatusLabel(plan.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                {plan.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                {plan.resumo}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              {plan.status !== "ENCERRADO" && (
                <Link
                  to={`/discente/planos/${plan.id}/interesse`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <ClipboardList size={16} />
                  Demonstrar interesse
                </Link>
              )}

              <Link
                to={`/discente/projetos/${plan.projetoId}`}
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
            </div>
          </div>
        </header>

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FolderKanban size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Projeto</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {plan.projetoTitulo}
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
                  {plan.orientador}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Edital</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {plan.edital}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Vigência</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {plan.vigencia}
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
                  <div className="text-neutral">Título do plano</div>
                  <div className="mt-1 font-semibold text-primary">
                    {plan.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Área</div>
                  <div className="mt-1 font-medium text-primary">
                    {getAreaLabel(plan.area)}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Período acadêmico</div>
                  <div className="mt-1 font-medium text-primary">
                    {plan.periodo}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Objetivo geral</div>
                  <p className="mt-1 text-primary leading-6">
                    {plan.objetivoGeral}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Perfil esperado</div>
                  <p className="mt-1 text-primary leading-6">
                    {plan.perfilEsperado}
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
                {plan.atividadesPrevistas.map((item, index) => (
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
                  Requisitos
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {plan.requisitos.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    <Target size={16} className="mt-0.5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Resultados esperados
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {plan.resultadosEsperados.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    <Sparkles size={16} className="mt-0.5 text-primary" />
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
                  Situação do plano
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    plan.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(plan.status)}
                </span>

                <p className="text-neutral leading-6">
                  {plan.status === "DISPONIVEL" &&
                    "O plano está disponível para manifestação de interesse pelo discente."}

                  {plan.status === "EM_SELECAO" &&
                    "O plano está em processo de seleção e pode estar com vagas ou análise em andamento."}

                  {plan.status === "ENCERRADO" &&
                    "O período de seleção deste plano já foi encerrado."}
                </p>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Palavras-chave
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="flex flex-wrap gap-2">
                {plan.palavrasChave.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {keyword}
                  </span>
                ))}
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
                {plan.status !== "ENCERRADO" && (
                  <Link
                    to={`/discente/planos/${plan.id}/interesse`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition
                    "
                  >
                    <ClipboardList size={16} />
                    Demonstrar interesse
                  </Link>
                )}

                <Link
                  to={`/discente/projetos/${plan.projetoId}`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl border border-primary
                    px-4 py-3 text-sm font-medium text-primary
                    hover:bg-primary/5 transition
                  "
                >
                  <FolderKanban size={16} />
                  Ver projeto
                </Link>

                <Link
                  to="/discente/planos"
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