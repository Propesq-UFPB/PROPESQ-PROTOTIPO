import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import {
  Search,
  FolderKanban,
  BadgeCheck,
  Clock3,
  UserRound,
  CalendarDays,
  Eye,
  AlertTriangle,
  SlidersHorizontal,
  X,
  Calendar,
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
    pendenciaTexto: "Atualizar comprovante bancário e validar documentação complementar.",
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

function normalize(s: string) {
  return (s || "").trim().toLowerCase()
}

function isSameDayOrAfter(a: string, b: string) {
  return a >= b
}

function isSameDayOrBefore(a: string, b: string) {
  return a <= b
}

function formatDateBr(date: string) {
  if (!date) return "—"
  const [y, m, d] = date.split("-")
  if (!y || !m || !d) return date
  return `${d}/${m}/${y}`
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
  const [advancedOpen, setAdvancedOpen] = useState(true)

  const [q, setQ] = useState("")

  const [titulo, setTitulo] = useState("")
  const [area, setArea] = useState("")
  const [orientador, setOrientador] = useState("")
  const [unidade, setUnidade] = useState("")
  const [edital, setEdital] = useState("")
  const [statusProjeto, setStatusProjeto] = useState<ProjectStatus>("ATIVO")
  const [statusVinculo, setStatusVinculo] = useState<BondStatus>("VINCULADO")
  const [participacao, setParticipacao] = useState<ParticipationType>("BOLSISTA")
  const [pendencia, setPendencia] = useState<"com_pendencia" | "sem_pendencia">(
    "com_pendencia"
  )

  const [useTitulo, setUseTitulo] = useState(false)
  const [useArea, setUseArea] = useState(false)
  const [useOrientador, setUseOrientador] = useState(false)
  const [useUnidade, setUseUnidade] = useState(false)
  const [useEdital, setUseEdital] = useState(false)
  const [useStatusProjeto, setUseStatusProjeto] = useState(false)
  const [useStatusVinculo, setUseStatusVinculo] = useState(false)
  const [useParticipacao, setUseParticipacao] = useState(false)
  const [usePendencia, setUsePendencia] = useState(false)

  const [periodoIni, setPeriodoIni] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")

  const opts = useMemo(() => {
    const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)))
    const sort = (arr: string[]) => uniq(arr).sort((a, b) => a.localeCompare(b))

    return {
      areaOpts: sort(PROJECTS.map((p) => p.area)),
      unidadeOpts: sort(PROJECTS.map((p) => p.unidade)),
      editalOpts: sort(PROJECTS.map((p) => p.edital)),
      orientadorOpts: sort(PROJECTS.map((p) => p.orientador)),
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const nq = normalize(q)
    const nTitulo = normalize(titulo)
    const nArea = normalize(area)
    const nOrientador = normalize(orientador)
    const nUnidade = normalize(unidade)
    const nEdital = normalize(edital)

    return PROJECTS.filter((item) => {
      if (nq) {
        const hit =
          normalize(item.titulo).includes(nq) ||
          normalize(item.area).includes(nq) ||
          normalize(item.orientador).includes(nq) ||
          normalize(item.unidade).includes(nq) ||
          normalize(item.edital).includes(nq) ||
          normalize(item.id).includes(nq)

        if (!hit) return false
      }

      if (useTitulo && !normalize(item.titulo).includes(nTitulo)) return false
      if (useArea && normalize(item.area) !== nArea) return false
      if (useOrientador && !normalize(item.orientador).includes(nOrientador)) return false
      if (useUnidade && normalize(item.unidade) !== nUnidade) return false
      if (useEdital && !normalize(item.edital).includes(nEdital)) return false
      if (useStatusProjeto && item.statusProjeto !== statusProjeto) return false
      if (useStatusVinculo && item.statusVinculo !== statusVinculo) return false
      if (useParticipacao && item.participacao !== participacao) return false

      if (usePendencia) {
        const hasPending = item.possuiPendencia
        if (pendencia === "com_pendencia" && !hasPending) return false
        if (pendencia === "sem_pendencia" && hasPending) return false
      }

      if (periodoIni) {
        const base = item.inicio || item.fim
        if (base && !isSameDayOrAfter(base, periodoIni)) return false
        if (!base) return false
      }

      if (periodoFim) {
        const base = item.fim || item.inicio
        if (base && !isSameDayOrBefore(base, periodoFim)) return false
        if (!base) return false
      }

      return true
    })
  }, [
    q,
    titulo,
    area,
    orientador,
    unidade,
    edital,
    statusProjeto,
    statusVinculo,
    participacao,
    pendencia,
    useTitulo,
    useArea,
    useOrientador,
    useUnidade,
    useEdital,
    useStatusProjeto,
    useStatusVinculo,
    useParticipacao,
    usePendencia,
    periodoIni,
    periodoFim,
  ])

  const clearAll = () => {
    setQ("")
    setTitulo("")
    setArea("")
    setOrientador("")
    setUnidade("")
    setEdital("")
    setStatusProjeto("ATIVO")
    setStatusVinculo("VINCULADO")
    setParticipacao("BOLSISTA")
    setPendencia("com_pendencia")

    setUseTitulo(false)
    setUseArea(false)
    setUseOrientador(false)
    setUseUnidade(false)
    setUseEdital(false)
    setUseStatusProjeto(false)
    setUseStatusVinculo(false)
    setUseParticipacao(false)
    setUsePendencia(false)

    setPeriodoIni("")
    setPeriodoFim("")
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Meus Projetos • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-5 space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-primary">Meus Projetos</h1>
          <p className="mt-1 text-base text-neutral">
            Acompanhe seus vínculos, sua participação e a situação dos projetos em que você atua.
          </p>
        </header>

        <section className="w-full rounded-2xl border border-neutral/20 bg-white shadow-card">
          <div className="flex flex-col gap-3 border-b border-neutral/20 p-4 md:flex-row md:items-center md:gap-4 md:p-5">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por título, orientador, área, unidade ou edital…"
                className="w-full rounded-xl border border-neutral/20 py-2 pl-8 pr-3 text-[13px] leading-5 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 px-3 py-2 text-[13px] font-semibold text-primary transition hover:bg-neutral-light/50"
              >
                <SlidersHorizontal size={15} />
                Busca avançada
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 px-3 py-2 text-[13px] font-semibold text-neutral transition hover:bg-neutral-light/50"
              >
                <X size={15} />
                Limpar
              </button>
            </div>
          </div>

          {advancedOpen && (
            <div className="space-y-4 p-4 md:p-5">
              <div className="text-xs text-neutral/70">
                Marque a caixa à esquerda para <span className="font-semibold">ativar</span> cada filtro.
              </div>

              <div className="grid gap-3">
                <Row
                  checked={useTitulo}
                  onCheck={setUseTitulo}
                  label="Título:"
                  field={
                    <input
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título do projeto…"
                    />
                  }
                />

                <Row
                  checked={useArea}
                  onCheck={setUseArea}
                  label="Área:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.areaOpts.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useOrientador}
                  onCheck={setUseOrientador}
                  label="Orientador(a):"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={orientador}
                      onChange={(e) => setOrientador(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.orientadorOpts.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useUnidade}
                  onCheck={setUseUnidade}
                  label="Centro/Unidade:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={unidade}
                      onChange={(e) => setUnidade(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.unidadeOpts.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useEdital}
                  onCheck={setUseEdital}
                  label="Edital:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={edital}
                      onChange={(e) => setEdital(e.target.value)}
                    >
                      <option value="">— Selecione —</option>
                      {opts.editalOpts.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  }
                />

                <Row
                  checked={useStatusProjeto}
                  onCheck={setUseStatusProjeto}
                  label="Situação do Projeto:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={statusProjeto}
                      onChange={(e) => setStatusProjeto(e.target.value as ProjectStatus)}
                    >
                      <option value="ATIVO">Ativo</option>
                      <option value="EM_ACOMPANHAMENTO">Em acompanhamento</option>
                      <option value="PENDENTE_HOMOLOGACAO">Pendente de homologação</option>
                      <option value="ENCERRADO">Encerrado</option>
                    </select>
                  }
                />

                <Row
                  checked={useStatusVinculo}
                  onCheck={setUseStatusVinculo}
                  label="Status do vínculo:"
                  field={
                    <select
                      className="w-full rounded-xl border border-neutral/20 bg-white px-3 py-2 text-[13px]"
                      value={statusVinculo}
                      onChange={(e) => setStatusVinculo(e.target.value as BondStatus)}
                    >
                      <option value="VINCULADO">Vinculado</option>
                      <option value="AGUARDANDO_INICIO">Aguardando início</option>
                      <option value="PENDENTE_DOCUMENTACAO">Pendente de documentação</option>
                      <option value="FINALIZADO">Finalizado</option>
                    </select>
                  }
                />

                <Row
                  checked={useParticipacao}
                  onCheck={setUseParticipacao}
                  label="Participação:"
                  field={
                    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-neutral/20 bg-white px-3 py-2">
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="participacao"
                          checked={participacao === "BOLSISTA"}
                          onChange={() => setParticipacao("BOLSISTA")}
                        />
                        Bolsista
                      </label>
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="participacao"
                          checked={participacao === "VOLUNTARIO"}
                          onChange={() => setParticipacao("VOLUNTARIO")}
                        />
                        Voluntário
                      </label>
                    </div>
                  }
                />

                <Row
                  checked={usePendencia}
                  onCheck={setUsePendencia}
                  label="Pendência:"
                  field={
                    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-neutral/20 bg-white px-3 py-2">
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="pendencia"
                          checked={pendencia === "com_pendencia"}
                          onChange={() => setPendencia("com_pendencia")}
                        />
                        Com pendência
                      </label>
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="pendencia"
                          checked={pendencia === "sem_pendencia"}
                          onChange={() => setPendencia("sem_pendencia")}
                        />
                        Sem pendência
                      </label>
                    </div>
                  }
                />

                <div className="border-t border-neutral/20 pt-2" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
                      Período (início)
                    </label>
                    <div className="relative mt-2">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                      />
                      <input
                        type="date"
                        value={periodoIni}
                        onChange={(e) => setPeriodoIni(e.target.value)}
                        className="w-full rounded-xl border border-neutral/20 py-2 pl-8 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
                      Período (fim)
                    </label>
                    <div className="relative mt-2">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/60"
                      />
                      <input
                        type="date"
                        value={periodoFim}
                        onChange={(e) => setPeriodoFim(e.target.value)}
                        className="w-full rounded-xl border border-neutral/20 py-2 pl-8 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="w-full rounded-2xl border border-neutral/20 bg-white shadow-card">
          {filteredProjects.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="text-base font-semibold text-primary">
                Nenhum projeto encontrado
              </div>
              <p className="mt-1 text-sm text-neutral">
                Ajuste os filtros para visualizar outros resultados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral/20">
              {filteredProjects.map((project) => (
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
                            {project.participacao === "BOLSISTA" ? "Bolsista" : "Voluntário"}
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
                        value={`${formatDateBr(project.inicio)} até ${formatDateBr(project.fim)}`}
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

function Row(props: {
  checked: boolean
  onCheck: (v: boolean) => void
  label: string
  field: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[18px_220px_minmax(0,1fr)]">
      <div className="pt-2">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onCheck(e.target.checked)}
        />
      </div>

      <div className="pt-2 text-[13px] leading-4 text-primary">
        {props.label}
      </div>

      <div className="min-w-0">{props.field}</div>
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
      <div className="flex items-center gap-2 text-neutral">
        {props.icon}
        {props.label}
      </div>
      <div className="mt-1 font-medium text-primary">{props.value}</div>
    </div>
  )
}