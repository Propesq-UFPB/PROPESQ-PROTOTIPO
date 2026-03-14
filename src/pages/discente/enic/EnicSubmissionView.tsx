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
  Presentation,
  BookOpen,
} from "lucide-react"

type EnicStatus =
  | "RASCUNHO"
  | "PENDENTE"
  | "SUBMETIDO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REJEITADO"

type EnicSubmissionDetails = {
  id: string
  titulo: string
  projetoId: string
  projetoTitulo: string
  edital: string
  orientador: string
  evento: string
  modalidade: string
  areaTematica: string
  prazo: string
  status: EnicStatus
  atualizadoEm?: string
  dataSubmissao?: string
  resumo: string
  metodologia: string
  resultados: string
  conclusoes: string
  palavrasChave: string[]
  coautores: string[]
  observacoes: string[]
  possuiPendencia: boolean
  pendenciaTexto?: string
}

const SUBMISSIONS: EnicSubmissionDetails[] = [
  {
    id: "enic_001",
    titulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    projetoId: "proj_001",
    projetoTitulo: "Plataforma Digital para Gestão de Pesquisa Acadêmica",
    edital: "PIBIC 2026",
    orientador: "Prof. André Silva",
    evento: "ENIC 2026",
    modalidade: "Resumo expandido",
    areaTematica: "Sistemas de Informação",
    prazo: "15/08/2026",
    status: "RASCUNHO",
    atualizadoEm: "14/03/2026",
    resumo:
      "Este trabalho apresenta o desenvolvimento de uma plataforma digital para apoiar a gestão de pesquisa acadêmica, incluindo fluxos de inscrição, acompanhamento de projetos, relatórios e indicadores institucionais.",
    metodologia:
      "A metodologia adotada envolveu levantamento de requisitos, modelagem de fluxos, prototipação de interfaces e estruturação incremental das telas e módulos do sistema.",
    resultados:
      "Foram estruturadas páginas e fluxos para os módulos de perfil, editais, projetos, relatórios e submissões acadêmicas, com foco na experiência do discente e na organização institucional.",
    conclusoes:
      "Os resultados demonstram a viabilidade de uma solução digital integrada para apoiar a gestão acadêmica de pesquisa, com potencial para ampliar a rastreabilidade e a eficiência dos processos.",
    palavrasChave: ["plataforma digital", "pesquisa acadêmica", "gestão institucional"],
    coautores: ["Prof. André Silva"],
    observacoes: [
      "A submissão ainda está em rascunho e pode ser editada livremente.",
      "Revise a estrutura do resumo antes da submissão final.",
    ],
    possuiPendencia: false,
  },
  {
    id: "enic_002",
    titulo: "IA Aplicada à Classificação de Produção Científica",
    projetoId: "proj_002",
    projetoTitulo: "IA Aplicada à Classificação de Produção Científica",
    edital: "PIBITI 2026",
    orientador: "Profa. Helena Costa",
    evento: "ENIC 2026",
    modalidade: "Resumo simples",
    areaTematica: "Inteligência Artificial",
    prazo: "15/08/2026",
    status: "SUBMETIDO",
    atualizadoEm: "10/03/2026",
    dataSubmissao: "10/03/2026",
    resumo:
      "O trabalho investiga o uso de técnicas de inteligência artificial para classificação e organização de produção científica institucional.",
    metodologia:
      "Foram utilizadas etapas de coleta de dados, preparação de atributos, avaliação de metadados e análise de abordagens de classificação automatizada.",
    resultados:
      "Os resultados iniciais indicam potencial de apoio à organização de bases científicas e à melhoria de processos institucionais de catalogação.",
    conclusoes:
      "A abordagem proposta mostra-se promissora para apoiar a classificação de dados científicos em ambientes acadêmicos.",
    palavrasChave: ["IA", "classificação", "produção científica"],
    coautores: ["Profa. Helena Costa"],
    observacoes: [
      "A submissão foi registrada com sucesso no evento.",
      "O trabalho aguarda movimentação da comissão do ENIC.",
    ],
    possuiPendencia: false,
  },
  {
    id: "enic_005",
    titulo: "Repositório Digital para Produção Discente",
    projetoId: "proj_005",
    projetoTitulo: "Repositório Digital para Produção Discente",
    edital: "PROBEX 2024",
    orientador: "Profa. Lúcia Fernandes",
    evento: "ENIC 2024",
    modalidade: "Resumo expandido",
    areaTematica: "Biblioteconomia Digital",
    prazo: "12/08/2024",
    status: "REJEITADO",
    atualizadoEm: "18/08/2024",
    dataSubmissao: "12/08/2024",
    resumo:
      "O trabalho propõe a organização de produção discente em um repositório digital institucional de acesso estruturado.",
    metodologia:
      "Foram analisados modelos de organização de acervo digital, taxonomias de conteúdo e necessidades de representação da produção acadêmica.",
    resultados:
      "O trabalho avançou na modelagem inicial do repositório, porém a submissão apresentou inadequações formais em relação ao evento.",
    conclusoes:
      "Embora o tema seja relevante, a submissão precisaria de melhor adequação textual e formal para aceitação no evento.",
    palavrasChave: ["repositório digital", "produção discente", "acervo acadêmico"],
    coautores: ["Profa. Lúcia Fernandes"],
    observacoes: [
      "A comissão apontou inconsistências no texto submetido.",
      "É recomendável revisar estrutura, clareza e aderência ao formato exigido.",
    ],
    possuiPendencia: true,
    pendenciaTexto:
      "A submissão foi devolvida por inconsistências no texto e ausência de adequação ao formato exigido.",
  },
]

function getStatusLabel(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho"
    case "PENDENTE":
      return "Pendente"
    case "SUBMETIDO":
      return "Submetido"
    case "EM_ANALISE":
      return "Em análise"
    case "APROVADO":
      return "Aprovado"
    case "REJEITADO":
      return "Rejeitado"
    default:
      return status
  }
}

function getStatusClasses(status: EnicStatus) {
  switch (status) {
    case "RASCUNHO":
      return "border-neutral/30 bg-neutral/10 text-neutral"
    case "PENDENTE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "SUBMETIDO":
      return "border-primary/30 bg-primary/10 text-primary"
    case "EM_ANALISE":
      return "border-warning/30 bg-warning/10 text-warning"
    case "APROVADO":
      return "border-success/30 bg-success/10 text-success"
    case "REJEITADO":
      return "border-danger/30 bg-danger/10 text-danger"
    default:
      return "border-neutral/30 bg-neutral/10 text-neutral"
  }
}

function canEdit(status: EnicStatus) {
  return status === "RASCUNHO" || status === "PENDENTE" || status === "REJEITADO"
}

export default function EnicSubmissionView() {
  const { id } = useParams()

  const submission = SUBMISSIONS.find((item) => item.id === id) ?? SUBMISSIONS[0]

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{submission.titulo} • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header className="flex flex-col gap-3">
          <div>
            <Link
              to="/discente/enic"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Voltar para submissões ENIC
            </Link>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Presentation size={14} />
                  {submission.modalidade}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    submission.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(submission.status)}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-primary">
                {submission.titulo}
              </h1>

              <p className="text-base text-neutral leading-7 max-w-4xl">
                Visualize os detalhes da submissão vinculada ao ENIC, incluindo conteúdo acadêmico, situação atual e observações do processo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:min-w-[220px]">
              {canEdit(submission.status) && (
                <Link
                  to={`/discente/enic/${submission.id}/editar`}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-primary px-4 py-3
                    text-sm font-semibold text-white
                    hover:opacity-90 transition
                  "
                >
                  <Pencil size={16} />
                  Editar submissão
                </Link>
              )}

              <Link
                to={`/discente/enic/${submission.id}/status`}
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
        {submission.possuiPendencia && submission.pendenciaTexto && (
          <div className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4 text-sm text-neutral">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
              <div>
                <span className="font-semibold text-warning">
                  Pendência identificada:
                </span>{" "}
                {submission.pendenciaTexto}
              </div>
            </div>
          </div>
        )}

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <FolderKanban size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Projeto</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.projetoTitulo}
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
                  {submission.orientador}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CalendarDays size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Prazo</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.prazo}
                </div>
              </div>
            </div>
          </Card>

          <Card title="" className="bg-white border border-neutral/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Clock3 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Data da submissão</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {submission.dataSubmissao || "-"}
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
                  <div className="text-neutral">Título do trabalho</div>
                  <div className="mt-1 font-semibold text-primary">
                    {submission.titulo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Evento</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.evento}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Modalidade</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.modalidade}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Área temática</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.areaTematica}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Edital vinculado</div>
                  <div className="mt-1 font-medium text-primary">
                    {submission.edital}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-neutral">Resumo</div>
                  <p className="mt-1 text-primary leading-6">
                    {submission.resumo}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Conteúdo acadêmico
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <div className="space-y-5 text-sm">
                <div>
                  <div className="text-neutral">Metodologia</div>
                  <p className="mt-1 text-primary leading-6">
                    {submission.metodologia}
                  </p>
                </div>

                <div>
                  <div className="text-neutral">Resultados</div>
                  <p className="mt-1 text-primary leading-6">
                    {submission.resultados}
                  </p>
                </div>

                <div>
                  <div className="text-neutral">Conclusões</div>
                  <p className="mt-1 text-primary leading-6">
                    {submission.conclusoes}
                  </p>
                </div>
              </div>
            </Card>

            <Card
              title={
                <h2 className="text-sm font-semibold text-primary">
                  Observações da submissão
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3">
                {submission.observacoes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-neutral"
                  >
                    {submission.status === "APROVADO" ? (
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
                    submission.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {getStatusLabel(submission.status)}
                </span>

                <p className="text-neutral leading-6">
                  {submission.status === "RASCUNHO" &&
                    "A submissão ainda está em elaboração e pode ser ajustada antes do envio."}

                  {submission.status === "PENDENTE" &&
                    "A submissão possui pendências e precisa ser revisada antes da conclusão."}

                  {submission.status === "SUBMETIDO" &&
                    "O trabalho foi submetido e aguarda movimentação do processo no evento."}

                  {submission.status === "EM_ANALISE" &&
                    "O conteúdo está em análise pela comissão do evento."}

                  {submission.status === "APROVADO" &&
                    "O trabalho foi aprovado no ENIC."}

                  {submission.status === "REJEITADO" &&
                    "A submissão foi rejeitada e requer ajustes para eventual nova versão."}
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
                {submission.palavrasChave.map((keyword) => (
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
                  Coautoria
                </h2>
              }
              className="bg-white border border-neutral/30 rounded-2xl p-8"
            >
              <ul className="space-y-3 text-sm text-neutral">
                {submission.coautores.length === 0 ? (
                  <li>Nenhum coautor informado.</li>
                ) : (
                  submission.coautores.map((author) => (
                    <li key={author} className="flex items-start gap-3">
                      <BookOpen size={16} className="mt-0.5 text-primary" />
                      <span>{author}</span>
                    </li>
                  ))
                )}
              </ul>
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
                {canEdit(submission.status) && (
                  <Link
                    to={`/discente/enic/${submission.id}/editar`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition
                    "
                  >
                    <Pencil size={16} />
                    Editar submissão
                  </Link>
                )}

                <Link
                  to={`/discente/enic/${submission.id}/status`}
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
                  to={`/discente/projetos/${submission.projetoId}`}
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
                  to="/discente/enic"
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