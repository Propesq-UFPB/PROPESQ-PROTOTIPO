import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Filter,
  GitBranch,
  RefreshCcw,
  Search,
  Send,
  ShieldAlert,
  Shuffle,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

type ProjectStatus = "SUBMETIDO" | "DISTRIBUIDO" | "PENDENTE" | "RECUSADO"
type AssignmentStatus = "PENDENTE" | "ACEITO" | "RECUSADO"

type Project = {
  id: number
  code: string
  title: string
  coordinator: string
  unit: string
  grandeArea: string
  area: string
  subarea: string
  especialidade: string
  status: ProjectStatus
}

type Evaluator = {
  id: number
  name: string
  unit: string
  email: string
  grandeAreas: string[]
  areas: string[]
  subareas: string[]
  maxAssignments: number
  currentAssignments: number
  unavailable?: boolean
}

type Assignment = {
  id: number
  projectId: number
  evaluatorId: number
  status: AssignmentStatus
  reason?: string
  sentAt: string
}

const MIN_EVALUATORS_PER_PROJECT = 2

const projectsMock: Project[] = [
  {
    id: 1,
    code: "PVH-2026-001",
    title: "Aplicação de IA para análise de acessibilidade em ambientes digitais",
    coordinator: "Dra. Ana Beatriz Lima",
    unit: "CI",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Inteligência Artificial",
    especialidade: "Processamento de Linguagem Natural",
    status: "PENDENTE",
  },
  {
    id: 2,
    code: "PVH-2026-002",
    title: "Monitoramento inteligente de dados acadêmicos em programas institucionais",
    coordinator: "Dr. Carlos Henrique Souza",
    unit: "CT",
    grandeArea: "Engenharias",
    area: "Engenharia de Produção",
    subarea: "Pesquisa Operacional",
    especialidade: "Sistemas de Apoio à Decisão",
    status: "DISTRIBUIDO",
  },
  {
    id: 3,
    code: "PVH-2026-003",
    title: "Métodos computacionais aplicados à análise de sinais biomédicos",
    coordinator: "Dra. Mariana Costa",
    unit: "CCS",
    grandeArea: "Ciências da Saúde",
    area: "Medicina",
    subarea: "Engenharia Biomédica",
    especialidade: "Processamento de Sinais",
    status: "SUBMETIDO",
  },
  {
    id: 4,
    code: "PVH-2026-004",
    title: "Modelagem de indicadores para acompanhamento da produção científica",
    coordinator: "Dr. Roberto Menezes",
    unit: "CCHLA",
    grandeArea: "Ciências Humanas",
    area: "Educação",
    subarea: "Políticas Educacionais",
    especialidade: "Avaliação Institucional",
    status: "RECUSADO",
  },
]

const evaluatorsMock: Evaluator[] = [
  {
    id: 1,
    name: "Prof. João Martins",
    unit: "CI",
    email: "joao.martins@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra"],
    areas: ["Ciência da Computação"],
    subareas: ["Inteligência Artificial", "Sistemas de Computação"],
    maxAssignments: 4,
    currentAssignments: 2,
  },
  {
    id: 2,
    name: "Profa. Helena Duarte",
    unit: "CT",
    email: "helena.duarte@ufpb.br",
    grandeAreas: ["Engenharias", "Ciências Exatas e da Terra"],
    areas: ["Engenharia de Produção", "Ciência da Computação"],
    subareas: ["Pesquisa Operacional", "Inteligência Artificial"],
    maxAssignments: 3,
    currentAssignments: 1,
  },
  {
    id: 3,
    name: "Prof. Miguel Andrade",
    unit: "CCS",
    email: "miguel.andrade@ufpb.br",
    grandeAreas: ["Ciências da Saúde"],
    areas: ["Medicina"],
    subareas: ["Engenharia Biomédica", "Saúde Coletiva"],
    maxAssignments: 3,
    currentAssignments: 3,
  },
  {
    id: 4,
    name: "Profa. Clara Nogueira",
    unit: "CCHLA",
    email: "clara.nogueira@ufpb.br",
    grandeAreas: ["Ciências Humanas"],
    areas: ["Educação"],
    subareas: ["Políticas Educacionais", "Avaliação Institucional"],
    maxAssignments: 5,
    currentAssignments: 2,
  },
  {
    id: 5,
    name: "Prof. Felipe Rocha",
    unit: "CEAR",
    email: "felipe.rocha@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra", "Engenharias"],
    areas: ["Ciência da Computação", "Engenharia Elétrica"],
    subareas: ["Inteligência Artificial", "Processamento de Sinais"],
    maxAssignments: 4,
    currentAssignments: 0,
  },
  {
    id: 6,
    name: "Profa. Renata Alves",
    unit: "CI",
    email: "renata.alves@ufpb.br",
    grandeAreas: ["Ciências Exatas e da Terra"],
    areas: ["Ciência da Computação"],
    subareas: ["Processamento de Linguagem Natural", "Inteligência Artificial"],
    maxAssignments: 2,
    currentAssignments: 1,
    unavailable: true,
  },
]

const assignmentsMock: Assignment[] = [
  {
    id: 1,
    projectId: 2,
    evaluatorId: 2,
    status: "ACEITO",
    sentAt: "2026-06-01",
  },
  {
    id: 2,
    projectId: 2,
    evaluatorId: 5,
    status: "PENDENTE",
    sentAt: "2026-06-01",
  },
  {
    id: 3,
    projectId: 4,
    evaluatorId: 4,
    status: "RECUSADO",
    reason: "Conflito de interesse declarado pelo avaliador.",
    sentAt: "2026-05-31",
  },
]

function statusLabel(status: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    SUBMETIDO: "Submetido",
    DISTRIBUIDO: "Distribuído",
    PENDENTE: "Pendente",
    RECUSADO: "Com recusa",
  }

  return map[status]
}

function assignmentStatusLabel(status: AssignmentStatus) {
  const map: Record<AssignmentStatus, string> = {
    PENDENTE: "Pendente",
    ACEITO: "Aceito",
    RECUSADO: "Recusado",
  }

  return map[status]
}

function statusClass(status: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    SUBMETIDO: "border-blue-200 bg-blue-50 text-blue-700",
    DISTRIBUIDO: "border-emerald-200 bg-emerald-50 text-emerald-700",
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-700",
    RECUSADO: "border-red-200 bg-red-50 text-red-700",
  }

  return map[status]
}

function assignmentStatusClass(status: AssignmentStatus) {
  const map: Record<AssignmentStatus, string> = {
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-700",
    ACEITO: "border-emerald-200 bg-emerald-50 text-emerald-700",
    RECUSADO: "border-red-200 bg-red-50 text-red-700",
  }

  return map[status]
}

function hasConflict(project: Project, evaluator: Evaluator) {
  return project.unit === evaluator.unit || project.coordinator === evaluator.name
}

function hasCapacity(evaluator: Evaluator) {
  return evaluator.currentAssignments < evaluator.maxAssignments && !evaluator.unavailable
}

function affinityScore(project: Project, evaluator: Evaluator) {
  let score = 0

  if (evaluator.grandeAreas.includes(project.grandeArea)) score += 1
  if (evaluator.areas.includes(project.area)) score += 2
  if (evaluator.subareas.includes(project.subarea)) score += 3

  return score
}

function canEvaluate(project: Project, evaluator: Evaluator) {
  return !hasConflict(project, evaluator) && hasCapacity(evaluator) && affinityScore(project, evaluator) > 0
}

function PageHeader() {
  return (
    <section className="rounded-3xl border border-neutral/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Link
            to="/adm/avaliacao"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para Avaliação & Pontuação
          </Link>

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <GitBranch size={14} />
              Distribuição de avaliações
            </div>

            <h1 className="text-2xl font-bold text-neutral-dark">
              Distribuição de Projetos e Planos para Avaliação
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Tela operacional para atribuir projetos submetidos aos coordenadores
              avaliadores, garantindo no mínimo dois avaliadores por projeto,
              evitando conflitos de interesse e acompanhando aceite, recusa e
              redistribuição.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[460px]">
          <SummaryCard label="Projetos" value="4" icon={<GitBranch size={18} />} />
          <SummaryCard label="Pendentes" value="2" icon={<Clock3 size={18} />} />
          <SummaryCard label="Recusas" value="1" icon={<XCircle size={18} />} />
        </div>
      </div>
    </section>
  )
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-xs font-medium text-neutral">{label}</p>
      <p className="mt-1 text-xl font-bold text-neutral-dark">{value}</p>
    </div>
  )
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-neutral-dark">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default function AdminEvaluationDistribution() {
  const [projects, setProjects] = useState<Project[]>(projectsMock)
  const [evaluators, setEvaluators] = useState<Evaluator[]>(evaluatorsMock)
  const [assignments, setAssignments] = useState<Assignment[]>(assignmentsMock)

  const [selectedProjectId, setSelectedProjectId] = useState(projectsMock[0].id)
  const [search, setSearch] = useState("")
  const [areaFilter, setAreaFilter] = useState("TODAS")

  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  const availableAreas = useMemo(() => {
    return ["TODAS", ...Array.from(new Set(projects.map((project) => project.area)))]
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.code.toLowerCase().includes(search.toLowerCase()) ||
        project.coordinator.toLowerCase().includes(search.toLowerCase())

      const matchesArea = areaFilter === "TODAS" || project.area === areaFilter

      return matchesSearch && matchesArea
    })
  }, [projects, search, areaFilter])

  const selectedAssignments = useMemo(() => {
    if (!selectedProject) return []

    return assignments.filter(
      (assignment) => assignment.projectId === selectedProject.id,
    )
  }, [assignments, selectedProject])

  const selectedEvaluatorIds = selectedAssignments.map(
    (assignment) => assignment.evaluatorId,
  )

  const assignedEvaluators = selectedAssignments
    .map((assignment) => {
      const evaluator = evaluators.find((item) => item.id === assignment.evaluatorId)

      if (!evaluator) return null

      return {
        assignment,
        evaluator,
      }
    })
    .filter(Boolean) as {
    assignment: Assignment
    evaluator: Evaluator
  }[]

  const eligibleEvaluators = useMemo(() => {
    if (!selectedProject) return []

    return evaluators
      .map((evaluator) => ({
        ...evaluator,
        conflict: hasConflict(selectedProject, evaluator),
        capacityAvailable: hasCapacity(evaluator),
        score: affinityScore(selectedProject, evaluator),
        alreadyAssigned: selectedEvaluatorIds.includes(evaluator.id),
      }))
      .sort((a, b) => b.score - a.score)
  }, [evaluators, selectedProject, selectedEvaluatorIds])

  const acceptedCount = selectedAssignments.filter(
    (assignment) => assignment.status === "ACEITO",
  ).length

  const pendingCount = selectedAssignments.filter(
    (assignment) => assignment.status === "PENDENTE",
  ).length

  const declinedCount = selectedAssignments.filter(
    (assignment) => assignment.status === "RECUSADO",
  ).length

  function handleSelectProject(projectId: number) {
    setSelectedProjectId(projectId)
  }

  function handleAutoDistribution() {
    if (!selectedProject) return

    const alreadyAssigned = assignments.filter(
      (assignment) => assignment.projectId === selectedProject.id,
    )

    const activeAssigned = alreadyAssigned.filter(
      (assignment) => assignment.status !== "RECUSADO",
    )

    const missing = Math.max(
      MIN_EVALUATORS_PER_PROJECT - activeAssigned.length,
      0,
    )

    if (missing === 0) return

    const candidates = evaluators
      .filter((evaluator) => {
        const already = activeAssigned.some(
          (assignment) => assignment.evaluatorId === evaluator.id,
        )

        return !already && canEvaluate(selectedProject, evaluator)
      })
      .sort(
        (a, b) =>
          affinityScore(selectedProject, b) - affinityScore(selectedProject, a),
      )
      .slice(0, missing)

    if (candidates.length === 0) return

    const nextAssignments: Assignment[] = candidates.map((evaluator) => ({
      id: Date.now() + evaluator.id,
      projectId: selectedProject.id,
      evaluatorId: evaluator.id,
      status: "PENDENTE",
      sentAt: new Date().toISOString().slice(0, 10),
    }))

    setAssignments((current) => [...current, ...nextAssignments])

    setEvaluators((current) =>
      current.map((evaluator) => {
        const wasSelected = candidates.some((item) => item.id === evaluator.id)

        if (!wasSelected) return evaluator

        return {
          ...evaluator,
          currentAssignments: evaluator.currentAssignments + 1,
        }
      }),
    )

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              status: "DISTRIBUIDO",
            }
          : project,
      ),
    )
  }

  function handleManualToggle(evaluatorId: number) {
    if (!selectedProject) return

    const existing = assignments.find(
      (assignment) =>
        assignment.projectId === selectedProject.id &&
        assignment.evaluatorId === evaluatorId,
    )

    if (existing) {
      setAssignments((current) =>
        current.filter((assignment) => assignment.id !== existing.id),
      )

      setEvaluators((current) =>
        current.map((evaluator) =>
          evaluator.id === evaluatorId
            ? {
                ...evaluator,
                currentAssignments: Math.max(evaluator.currentAssignments - 1, 0),
              }
            : evaluator,
        ),
      )

      return
    }

    const evaluator = evaluators.find((item) => item.id === evaluatorId)

    if (!evaluator || !canEvaluate(selectedProject, evaluator)) return

    const newAssignment: Assignment = {
      id: Date.now(),
      projectId: selectedProject.id,
      evaluatorId,
      status: "PENDENTE",
      sentAt: new Date().toISOString().slice(0, 10),
    }

    setAssignments((current) => [...current, newAssignment])

    setEvaluators((current) =>
      current.map((item) =>
        item.id === evaluatorId
          ? {
              ...item,
              currentAssignments: item.currentAssignments + 1,
            }
          : item,
      ),
    )

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              status: "DISTRIBUIDO",
            }
          : project,
      ),
    )
  }

  function handleResendDeclined(assignmentId: number) {
    const declinedAssignment = assignments.find(
      (assignment) => assignment.id === assignmentId,
    )

    if (!declinedAssignment || !selectedProject) return

    const alreadyAssignedIds = assignments
      .filter(
        (assignment) =>
          assignment.projectId === selectedProject.id &&
          assignment.status !== "RECUSADO",
      )
      .map((assignment) => assignment.evaluatorId)

    const replacement = evaluators
      .filter((evaluator) => {
        return (
          !alreadyAssignedIds.includes(evaluator.id) &&
          evaluator.id !== declinedAssignment.evaluatorId &&
          canEvaluate(selectedProject, evaluator)
        )
      })
      .sort(
        (a, b) =>
          affinityScore(selectedProject, b) - affinityScore(selectedProject, a),
      )[0]

    if (!replacement) return

    const newAssignment: Assignment = {
      id: Date.now(),
      projectId: selectedProject.id,
      evaluatorId: replacement.id,
      status: "PENDENTE",
      sentAt: new Date().toISOString().slice(0, 10),
    }

    setAssignments((current) => [...current, newAssignment])

    setEvaluators((current) =>
      current.map((evaluator) =>
        evaluator.id === replacement.id
          ? {
              ...evaluator,
              currentAssignments: evaluator.currentAssignments + 1,
            }
          : evaluator,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <PageHeader />

          <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<Filter size={18} />}
                  title="Projetos submetidos"
                  subtitle="Selecione um projeto para visualizar os avaliadores elegíveis."
                />

                <div className="space-y-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar por código, título ou coordenador"
                      className="w-full rounded-xl border border-neutral/15 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-neutral/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <select
                    value={areaFilter}
                    onChange={(event) => setAreaFilter(event.target.value)}
                    className="w-full rounded-xl border border-neutral/15 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                  >
                    {availableAreas.map((area) => (
                      <option key={area} value={area}>
                        {area === "TODAS" ? "Todas as áreas" : area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 space-y-3">
                  {filteredProjects.map((project) => {
                    const projectAssignments = assignments.filter(
                      (assignment) => assignment.projectId === project.id,
                    )

                    const activeAssignments = projectAssignments.filter(
                      (assignment) => assignment.status !== "RECUSADO",
                    )

                    const isSelected = selectedProjectId === project.id

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => handleSelectProject(project.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-primary/30 bg-primary/5 shadow-sm"
                            : "border-neutral/10 bg-white hover:border-primary/20 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-primary">
                              {project.code}
                            </p>
                            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-neutral-dark">
                              {project.title}
                            </h3>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                              project.status,
                            )}`}
                          >
                            {statusLabel(project.status)}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-neutral">
                          <p>
                            <strong>Área:</strong> {project.area}
                          </p>
                          <p>
                            <strong>Unidade:</strong> {project.unit}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs">
                          {activeAssignments.length >= MIN_EVALUATORS_PER_PROJECT ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                              <CheckCircle2 size={13} />
                              {activeAssignments.length} avaliadores
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                              <AlertTriangle size={13} />
                              Faltam{" "}
                              {MIN_EVALUATORS_PER_PROJECT -
                                activeAssignments.length}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {selectedProject ? (
                <>
                  <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <SectionTitle
                        icon={<GitBranch size={18} />}
                        title="Projeto selecionado"
                        subtitle="Dados usados para encontrar avaliadores compatíveis."
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleAutoDistribution}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                        >
                          <Shuffle size={16} />
                          Distribuir automaticamente
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-dark transition hover:border-primary/30 hover:text-primary"
                        >
                          <Send size={16} />
                          Enviar convites
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <InfoItem label="Código" value={selectedProject.code} />
                      <InfoItem label="Coordenador" value={selectedProject.coordinator} />
                      <InfoItem label="Grande área" value={selectedProject.grandeArea} />
                      <InfoItem label="Área" value={selectedProject.area} />
                      <InfoItem label="Subárea" value={selectedProject.subarea} />
                      <InfoItem
                        label="Especialidade"
                        value={selectedProject.especialidade}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <DistributionIndicator
                        label="Aceites"
                        value={acceptedCount}
                        icon={<CheckCircle2 size={17} />}
                        className="bg-emerald-50 text-emerald-700"
                      />
                      <DistributionIndicator
                        label="Pendentes"
                        value={pendingCount}
                        icon={<Clock3 size={17} />}
                        className="bg-amber-50 text-amber-700"
                      />
                      <DistributionIndicator
                        label="Recusas"
                        value={declinedCount}
                        icon={<XCircle size={17} />}
                        className="bg-red-50 text-red-700"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                      <SectionTitle
                        icon={<Users size={18} />}
                        title="Avaliadores disponíveis"
                        subtitle="Atribuição manual com validação de conflito e limite."
                      />

                      <div className="space-y-3">
                        {eligibleEvaluators.map((evaluator) => {
                          const blocked =
                            evaluator.conflict ||
                            !evaluator.capacityAvailable ||
                            evaluator.score === 0

                          return (
                            <div
                              key={evaluator.id}
                              className="rounded-2xl border border-neutral/10 bg-white p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-sm font-semibold text-neutral-dark">
                                    {evaluator.name}
                                  </h3>
                                  <p className="mt-1 text-xs text-neutral">
                                    {evaluator.unit} · {evaluator.email}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={blocked && !evaluator.alreadyAssigned}
                                  onClick={() => handleManualToggle(evaluator.id)}
                                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    evaluator.alreadyAssigned
                                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                      : blocked
                                        ? "cursor-not-allowed border border-neutral/10 bg-neutral-light text-neutral/50"
                                        : "border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                                  }`}
                                >
                                  {evaluator.alreadyAssigned
                                    ? "Remover"
                                    : "Atribuir"}
                                </button>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <SmallBadge>
                                  Afinidade: {evaluator.score}/6
                                </SmallBadge>

                                <SmallBadge>
                                  Carga: {evaluator.currentAssignments}/
                                  {evaluator.maxAssignments}
                                </SmallBadge>

                                {evaluator.conflict ? (
                                  <SmallBadge className="bg-red-50 text-red-700">
                                    <ShieldAlert size={13} />
                                    Conflito
                                  </SmallBadge>
                                ) : null}

                                {!evaluator.capacityAvailable ? (
                                  <SmallBadge className="bg-amber-50 text-amber-700">
                                    <CircleAlert size={13} />
                                    Sem capacidade
                                  </SmallBadge>
                                ) : null}

                                {evaluator.unavailable ? (
                                  <SmallBadge className="bg-neutral-light text-neutral">
                                    Indisponível
                                  </SmallBadge>
                                ) : null}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                      <SectionTitle
                        icon={<UserCheck size={18} />}
                        title="Distribuição atual"
                        subtitle="Acompanhamento de aceite, recusa e redistribuição."
                      />

                      {assignedEvaluators.length > 0 ? (
                        <div className="space-y-3">
                          {assignedEvaluators.map(({ assignment, evaluator }) => (
                            <div
                              key={assignment.id}
                              className="rounded-2xl border border-neutral/10 bg-white p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-sm font-semibold text-neutral-dark">
                                    {evaluator.name}
                                  </h3>
                                  <p className="mt-1 text-xs text-neutral">
                                    Enviado em {assignment.sentAt}
                                  </p>
                                </div>

                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${assignmentStatusClass(
                                    assignment.status,
                                  )}`}
                                >
                                  {assignmentStatusLabel(assignment.status)}
                                </span>
                              </div>

                              {assignment.reason ? (
                                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700">
                                  <strong>Justificativa:</strong>{" "}
                                  {assignment.reason}
                                </div>
                              ) : null}

                              {assignment.status === "RECUSADO" ? (
                                <button
                                  type="button"
                                  onClick={() => handleResendDeclined(assignment.id)}
                                  className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                                >
                                  <RefreshCcw size={14} />
                                  Reenviar para novo avaliador
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-neutral/20 bg-neutral-light/60 p-6 text-center">
                          <Clock3 className="mx-auto text-neutral" size={28} />
                          <h3 className="mt-3 text-sm font-semibold text-neutral-dark">
                            Nenhuma distribuição realizada
                          </h3>
                          <p className="mt-1 text-sm text-neutral">
                            Use a distribuição automática ou atribua avaliadores
                            manualmente.
                          </p>
                        </div>
                      )}

                      <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <div className="flex gap-3">
                          <AlertTriangle
                            size={18}
                            className="mt-0.5 shrink-0 text-amber-700"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-amber-800">
                              Regra mínima
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-amber-800">
                              Cada projeto deve possuir pelo menos{" "}
                              {MIN_EVALUATORS_PER_PROJECT} avaliadores ativos.
                              Avaliadores com recusa justificada não contam para
                              esse mínimo.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
      <p className="text-xs font-medium text-neutral">{label}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-dark">{value}</p>
    </div>
  )
}

function DistributionIndicator({
  label,
  value,
  icon,
  className,
}: {
  label: string
  value: number
  icon: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}

function SmallBadge({
  children,
  className = "bg-neutral-light text-neutral",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  )
}