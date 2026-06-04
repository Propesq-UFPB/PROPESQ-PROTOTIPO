import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
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
  SlidersHorizontal,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"

type ProjectStatus =
  | "SUBMETIDO"
  | "DISTRIBUIDO"
  | "PENDENTE"
  | "RECUSADO"
  | "INCOMPLETO"

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

type DraftAssignment = {
  id: number
  projectId: number
  evaluatorId: number
  score: number
  generatedBy: "AUTO"
}

type DistributionIssue = {
  projectId: number
  missing: number
  reason: string
}

type DistributionPreview = {
  draftAssignments: DraftAssignment[]
  issues: DistributionIssue[]
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
  {
    id: 5,
    code: "PVH-2026-005",
    title: "Sistemas inteligentes aplicados à análise de dados públicos",
    coordinator: "Dra. Juliana Freitas",
    unit: "CI",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Sistemas de Informação",
    especialidade: "Mineração de Dados",
    status: "PENDENTE",
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
    INCOMPLETO: "Incompleto",
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
    INCOMPLETO: "border-neutral/20 bg-neutral-light text-neutral",
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

function affinityScore(project: Project, evaluator: Evaluator) {
  let score = 0

  if (evaluator.grandeAreas.includes(project.grandeArea)) score += 1
  if (evaluator.areas.includes(project.area)) score += 2
  if (evaluator.subareas.includes(project.subarea)) score += 3

  return score
}

function activeAssignmentsByProject(projectId: number, assignments: Assignment[]) {
  return assignments.filter(
    (assignment) =>
      assignment.projectId === projectId && assignment.status !== "RECUSADO",
  )
}

function getProjectActiveCount(
  projectId: number,
  assignments: Assignment[],
  draftAssignments: DraftAssignment[],
) {
  const active = activeAssignmentsByProject(projectId, assignments).length
  const drafted = draftAssignments.filter(
    (assignment) => assignment.projectId === projectId,
  ).length

  return active + drafted
}

function getEvaluatorProjectedLoad(
  evaluatorId: number,
  evaluators: Evaluator[],
  draftAssignments: DraftAssignment[],
) {
  const evaluator = evaluators.find((item) => item.id === evaluatorId)

  if (!evaluator) return 0

  return (
    evaluator.currentAssignments +
    draftAssignments.filter((assignment) => assignment.evaluatorId === evaluatorId)
      .length
  )
}

function canEvaluateWithProjectedLoad({
  project,
  evaluator,
  evaluators,
  draftAssignments,
}: {
  project: Project
  evaluator: Evaluator
  evaluators: Evaluator[]
  draftAssignments: DraftAssignment[]
}) {
  const projectedLoad = getEvaluatorProjectedLoad(
    evaluator.id,
    evaluators,
    draftAssignments,
  )

  return (
    !evaluator.unavailable &&
    !hasConflict(project, evaluator) &&
    affinityScore(project, evaluator) > 0 &&
    projectedLoad < evaluator.maxAssignments
  )
}

function smartScore({
  project,
  evaluator,
  evaluators,
  draftAssignments,
}: {
  project: Project
  evaluator: Evaluator
  evaluators: Evaluator[]
  draftAssignments: DraftAssignment[]
}) {
  const affinity = affinityScore(project, evaluator)
  const projectedLoad = getEvaluatorProjectedLoad(
    evaluator.id,
    evaluators,
    draftAssignments,
  )

  const loadRatio = projectedLoad / evaluator.maxAssignments

  // Pontuação:
  // - afinidade pesa mais;
  // - avaliador com carga menor ganha prioridade;
  // - isso evita concentrar muitos projetos nos mesmos avaliadores.
  return affinity * 100 - loadRatio * 30
}

function buildSmartDistribution({
  projects,
  evaluators,
  assignments,
}: {
  projects: Project[]
  evaluators: Evaluator[]
  assignments: Assignment[]
}): DistributionPreview {
  const draftAssignments: DraftAssignment[] = []
  const issues: DistributionIssue[] = []

  const projectsToDistribute = projects
    .filter((project) => project.status !== "DISTRIBUIDO")
    .sort((a, b) => {
      const aCandidates = evaluators.filter((evaluator) => {
        return (
          !evaluator.unavailable &&
          !hasConflict(a, evaluator) &&
          affinityScore(a, evaluator) > 0
        )
      }).length

      const bCandidates = evaluators.filter((evaluator) => {
        return (
          !evaluator.unavailable &&
          !hasConflict(b, evaluator) &&
          affinityScore(b, evaluator) > 0
        )
      }).length

      // Distribui primeiro os projetos com menos avaliadores possíveis.
      // Isso reduz o risco de deixar os casos difíceis para o final.
      return aCandidates - bCandidates
    })

  projectsToDistribute.forEach((project) => {
    const activeAssignments = activeAssignmentsByProject(project.id, assignments)

    let missing = Math.max(
      MIN_EVALUATORS_PER_PROJECT - activeAssignments.length,
      0,
    )

    const alreadyAssignedIds = new Set([
      ...activeAssignments.map((assignment) => assignment.evaluatorId),
      ...draftAssignments
        .filter((assignment) => assignment.projectId === project.id)
        .map((assignment) => assignment.evaluatorId),
    ])

    while (missing > 0) {
      const candidates = evaluators
        .filter((evaluator) => {
          return (
            !alreadyAssignedIds.has(evaluator.id) &&
            canEvaluateWithProjectedLoad({
              project,
              evaluator,
              evaluators,
              draftAssignments,
            })
          )
        })
        .sort((a, b) => {
          return (
            smartScore({
              project,
              evaluator: b,
              evaluators,
              draftAssignments,
            }) -
            smartScore({
              project,
              evaluator: a,
              evaluators,
              draftAssignments,
            })
          )
        })

      const selected = candidates[0]

      if (!selected) {
        issues.push({
          projectId: project.id,
          missing,
          reason:
            "Não há avaliadores elegíveis suficientes com afinidade, sem conflito e com carga disponível.",
        })
        break
      }

      alreadyAssignedIds.add(selected.id)

      draftAssignments.push({
        id: Date.now() + draftAssignments.length + selected.id,
        projectId: project.id,
        evaluatorId: selected.id,
        score: affinityScore(project, selected),
        generatedBy: "AUTO",
      })

      missing -= 1
    }
  })

  return {
    draftAssignments,
    issues,
  }
}

function PageHeader({
  totalProjects,
  pendingProjects,
  distributedProjects,
  issueCount,
}: {
  totalProjects: number
  pendingProjects: number
  distributedProjects: number
  issueCount: number
}) {
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
              Distribuição inteligente
            </div>

            <h1 className="text-2xl font-bold text-neutral-dark">
              Distribuição de Projetos para Avaliação
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Em vez de distribuir projeto por projeto, gere uma prévia automática
              para todo o edital. O sistema prioriza afinidade, evita conflitos,
              controla a carga dos avaliadores e destaca apenas os casos que
              precisam de intervenção manual.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 lg:w-[620px]">
          <SummaryCard label="Projetos" value={totalProjects} icon={<GitBranch size={18} />} />
          <SummaryCard label="Pendentes" value={pendingProjects} icon={<Clock3 size={18} />} />
          <SummaryCard label="Distribuídos" value={distributedProjects} icon={<CheckCircle2 size={18} />} />
          <SummaryCard label="Ajustes" value={issueCount} icon={<AlertTriangle size={18} />} />
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
  value: number
  icon: ReactNode
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
  icon: ReactNode
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
  const [preview, setPreview] = useState<DistributionPreview | null>(null)

  const [search, setSearch] = useState("")
  const [areaFilter, setAreaFilter] = useState("TODAS")
  const [selectedIssueProjectId, setSelectedIssueProjectId] = useState<number | null>(
    null,
  )

  const availableAreas = useMemo(() => {
    return ["TODAS", ...Array.from(new Set(projects.map((project) => project.area)))]
  }, [projects])

  const pendingProjects = projects.filter(
    (project) => project.status !== "DISTRIBUIDO",
  )

  const distributedProjects = projects.filter(
    (project) => project.status === "DISTRIBUIDO",
  )

  const issueProjects = useMemo(() => {
    if (!preview) return []

    return preview.issues
      .map((issue) => {
        const project = projects.find((item) => item.id === issue.projectId)

        if (!project) return null

        return {
          issue,
          project,
        }
      })
      .filter(Boolean) as {
      issue: DistributionIssue
      project: Project
    }[]
  }, [preview, projects])

  const selectedIssueProject =
    projects.find((project) => project.id === selectedIssueProjectId) ??
    issueProjects[0]?.project ??
    null

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

  const previewByProject = useMemo(() => {
    const map = new Map<number, DraftAssignment[]>()

    preview?.draftAssignments.forEach((assignment) => {
      const current = map.get(assignment.projectId) ?? []
      map.set(assignment.projectId, [...current, assignment])
    })

    return map
  }, [preview])

  const totalDraftAssignments = preview?.draftAssignments.length ?? 0

  const projectsCompletedInPreview = useMemo(() => {
    if (!preview) return 0

    return pendingProjects.filter((project) => {
      const activeCount = getProjectActiveCount(
        project.id,
        assignments,
        preview.draftAssignments,
      )

      return activeCount >= MIN_EVALUATORS_PER_PROJECT
    }).length
  }, [preview, pendingProjects, assignments])

  const projectedEvaluatorLoads = useMemo(() => {
    return evaluators
      .map((evaluator) => {
        const added =
          preview?.draftAssignments.filter(
            (assignment) => assignment.evaluatorId === evaluator.id,
          ).length ?? 0

        return {
          evaluator,
          added,
          projected: evaluator.currentAssignments + added,
        }
      })
      .sort((a, b) => b.projected - a.projected)
  }, [evaluators, preview])

  function handleGenerateSmartPreview() {
    const nextPreview = buildSmartDistribution({
      projects,
      evaluators,
      assignments,
    })

    setPreview(nextPreview)

    if (nextPreview.issues.length > 0) {
      setSelectedIssueProjectId(nextPreview.issues[0].projectId)
    } else {
      setSelectedIssueProjectId(null)
    }
  }

  function handleConfirmPreview() {
    if (!preview) return

    const today = new Date().toISOString().slice(0, 10)

    const newAssignments: Assignment[] = preview.draftAssignments.map(
      (assignment, index) => ({
        id: Date.now() + index,
        projectId: assignment.projectId,
        evaluatorId: assignment.evaluatorId,
        status: "PENDENTE",
        sentAt: today,
      }),
    )

    setAssignments((current) => [...current, ...newAssignments])

    setEvaluators((current) =>
      current.map((evaluator) => {
        const added = preview.draftAssignments.filter(
          (assignment) => assignment.evaluatorId === evaluator.id,
        ).length

        return {
          ...evaluator,
          currentAssignments: evaluator.currentAssignments + added,
        }
      }),
    )

    setProjects((current) =>
      current.map((project) => {
        const activeCount = getProjectActiveCount(
          project.id,
          assignments,
          preview.draftAssignments,
        )

        if (activeCount >= MIN_EVALUATORS_PER_PROJECT) {
          return {
            ...project,
            status: "DISTRIBUIDO",
          }
        }

        if (preview.issues.some((issue) => issue.projectId === project.id)) {
          return {
            ...project,
            status: "INCOMPLETO",
          }
        }

        return project
      }),
    )

    setPreview(null)
    setSelectedIssueProjectId(null)
  }

  function handleClearPreview() {
    setPreview(null)
    setSelectedIssueProjectId(null)
  }

  function handleManualAddForIssue(evaluatorId: number) {
    if (!selectedIssueProject || !preview) return

    const evaluator = evaluators.find((item) => item.id === evaluatorId)

    if (!evaluator) return

    const activeIds = activeAssignmentsByProject(
      selectedIssueProject.id,
      assignments,
    ).map((assignment) => assignment.evaluatorId)

    const draftIds = preview.draftAssignments
      .filter((assignment) => assignment.projectId === selectedIssueProject.id)
      .map((assignment) => assignment.evaluatorId)

    const alreadyAssigned = [...activeIds, ...draftIds].includes(evaluator.id)

    if (alreadyAssigned) {
      const nextDraftAssignments = preview.draftAssignments.filter(
        (assignment) =>
          !(
            assignment.projectId === selectedIssueProject.id &&
            assignment.evaluatorId === evaluator.id
          ),
      )

      setPreview({
        draftAssignments: nextDraftAssignments,
        issues: preview.issues,
      })

      return
    }

    if (
      !canEvaluateWithProjectedLoad({
        project: selectedIssueProject,
        evaluator,
        evaluators,
        draftAssignments: preview.draftAssignments,
      })
    ) {
      return
    }

    const newDraftAssignment: DraftAssignment = {
      id: Date.now(),
      projectId: selectedIssueProject.id,
      evaluatorId: evaluator.id,
      score: affinityScore(selectedIssueProject, evaluator),
      generatedBy: "AUTO",
    }

    const nextDraftAssignments = [...preview.draftAssignments, newDraftAssignment]

    const activeCount = getProjectActiveCount(
      selectedIssueProject.id,
      assignments,
      nextDraftAssignments,
    )

    const nextIssues =
      activeCount >= MIN_EVALUATORS_PER_PROJECT
        ? preview.issues.filter(
            (issue) => issue.projectId !== selectedIssueProject.id,
          )
        : preview.issues

    setPreview({
      draftAssignments: nextDraftAssignments,
      issues: nextIssues,
    })

    if (nextIssues.length > 0) {
      setSelectedIssueProjectId(nextIssues[0].projectId)
    } else {
      setSelectedIssueProjectId(null)
    }
  }

  function handleResendDeclined(assignmentId: number) {
    const declinedAssignment = assignments.find(
      (assignment) => assignment.id === assignmentId,
    )

    const project = projects.find(
      (item) => item.id === declinedAssignment?.projectId,
    )

    if (!declinedAssignment || !project) return

    const alreadyAssignedIds = assignments
      .filter(
        (assignment) =>
          assignment.projectId === project.id && assignment.status !== "RECUSADO",
      )
      .map((assignment) => assignment.evaluatorId)

    const replacement = evaluators
      .filter((evaluator) => {
        return (
          !alreadyAssignedIds.includes(evaluator.id) &&
          evaluator.id !== declinedAssignment.evaluatorId &&
          !evaluator.unavailable &&
          !hasConflict(project, evaluator) &&
          affinityScore(project, evaluator) > 0 &&
          evaluator.currentAssignments < evaluator.maxAssignments
        )
      })
      .sort((a, b) => {
        const aLoad = a.currentAssignments / a.maxAssignments
        const bLoad = b.currentAssignments / b.maxAssignments

        return affinityScore(project, b) - affinityScore(project, a) || aLoad - bLoad
      })[0]

    if (!replacement) return

    const newAssignment: Assignment = {
      id: Date.now(),
      projectId: project.id,
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

  const manualCandidatesForIssue = useMemo(() => {
    if (!selectedIssueProject || !preview) return []

    const activeIds = activeAssignmentsByProject(
      selectedIssueProject.id,
      assignments,
    ).map((assignment) => assignment.evaluatorId)

    const draftIds = preview.draftAssignments
      .filter((assignment) => assignment.projectId === selectedIssueProject.id)
      .map((assignment) => assignment.evaluatorId)

    return evaluators
      .map((evaluator) => {
        const score = affinityScore(selectedIssueProject, evaluator)
        const projectedLoad = getEvaluatorProjectedLoad(
          evaluator.id,
          evaluators,
          preview.draftAssignments,
        )

        const alreadyAssigned = [...activeIds, ...draftIds].includes(evaluator.id)

        const blocked =
          !alreadyAssigned &&
          (!canEvaluateWithProjectedLoad({
            project: selectedIssueProject,
            evaluator,
            evaluators,
            draftAssignments: preview.draftAssignments,
          }) ||
            evaluator.unavailable)

        return {
          evaluator,
          score,
          projectedLoad,
          alreadyAssigned,
          blocked,
          conflict: hasConflict(selectedIssueProject, evaluator),
        }
      })
      .sort((a, b) => {
        return b.score - a.score || a.projectedLoad - b.projectedLoad
      })
  }, [selectedIssueProject, preview, assignments, evaluators])

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <PageHeader
            totalProjects={projects.length}
            pendingProjects={pendingProjects.length}
            distributedProjects={distributedProjects.length}
            issueCount={preview?.issues.length ?? 0}
          />

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionTitle
                icon={<Shuffle size={18} />}
                title="Distribuição em lote"
                subtitle="Gere uma prévia para todos os projetos pendentes antes de enviar os convites."
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSmartPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  <Shuffle size={16} />
                  Gerar prévia inteligente
                </button>

                <button
                  type="button"
                  disabled={!preview || totalDraftAssignments === 0}
                  onClick={handleConfirmPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:bg-neutral-light disabled:text-neutral/50"
                >
                  <Send size={16} />
                  Confirmar e enviar
                </button>

                <button
                  type="button"
                  disabled={!preview}
                  onClick={handleClearPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/15 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-dark transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:text-neutral/40"
                >
                  <RefreshCcw size={16} />
                  Limpar prévia
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <MetricCard
                label="Projetos analisados"
                value={pendingProjects.length}
                icon={<GitBranch size={18} />}
              />
              <MetricCard
                label="Atribuições sugeridas"
                value={totalDraftAssignments}
                icon={<UserCheck size={18} />}
              />
              <MetricCard
                label="Projetos completos"
                value={projectsCompletedInPreview}
                icon={<CheckCircle2 size={18} />}
              />
              <MetricCard
                label="Exigem ajuste"
                value={preview?.issues.length ?? 0}
                icon={<AlertTriangle size={18} />}
                warning={Boolean(preview && preview.issues.length > 0)}
              />
            </div>

            {preview ? (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <CircleAlert
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-700"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800">
                      Prévia gerada
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      Nenhum convite foi enviado ainda. Revise os projetos com
                      alerta, ajuste manualmente se necessário e depois clique em
                      “Confirmar e enviar”.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<BarChart3 size={18} />}
                  title="Carga projetada dos avaliadores"
                  subtitle="Ajuda a verificar se a distribuição ficou equilibrada."
                />

                <div className="space-y-3">
                  {projectedEvaluatorLoads.map(({ evaluator, added, projected }) => {
                    const percent = Math.min(
                      Math.round((projected / evaluator.maxAssignments) * 100),
                      100,
                    )

                    return (
                      <div
                        key={evaluator.id}
                        className="rounded-2xl border border-neutral/10 bg-white p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-dark">
                              {evaluator.name}
                            </h3>
                            <p className="mt-1 text-xs text-neutral">
                              {evaluator.unit} · {evaluator.email}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {added > 0 ? (
                              <SmallBadge className="bg-primary/10 text-primary">
                                +{added} na prévia
                              </SmallBadge>
                            ) : null}

                            {evaluator.unavailable ? (
                              <SmallBadge className="bg-neutral-light text-neutral">
                                Indisponível
                              </SmallBadge>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-1 flex justify-between text-xs text-neutral">
                            <span>
                              Carga: {projected}/{evaluator.maxAssignments}
                            </span>
                            <span>{percent}%</span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-neutral-light">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 100
                                  ? "bg-red-500"
                                  : percent >= 80
                                    ? "bg-amber-500"
                                    : "bg-primary"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<AlertTriangle size={18} />}
                  title="Fila de exceções"
                  subtitle="O gestor só precisa atuar nos casos que o algoritmo não conseguiu resolver."
                />

                {issueProjects.length > 0 ? (
                  <div className="space-y-3">
                    {issueProjects.map(({ issue, project }) => {
                      const isSelected = selectedIssueProject?.id === project.id

                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => setSelectedIssueProjectId(project.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-red-200 bg-red-50"
                              : "border-neutral/10 bg-white hover:border-red-200 hover:bg-red-50"
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

                            <SmallBadge className="bg-red-100 text-red-700">
                              Faltam {issue.missing}
                            </SmallBadge>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-red-700">
                            {issue.reason}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-neutral/20 bg-neutral-light/60 p-6 text-center">
                    <CheckCircle2 className="mx-auto text-emerald-600" size={28} />
                    <h3 className="mt-3 text-sm font-semibold text-neutral-dark">
                      Nenhuma exceção pendente
                    </h3>
                    <p className="mt-1 text-sm text-neutral">
                      Quando a prévia for gerada, os problemas aparecerão aqui.
                    </p>
                  </div>
                )}
              </div>

              {selectedIssueProject && preview ? (
                <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                  <SectionTitle
                    icon={<SlidersHorizontal size={18} />}
                    title="Ajuste manual da exceção"
                    subtitle="Use apenas quando a distribuição automática não encontrar avaliadores suficientes."
                  />

                  <div className="mb-4 rounded-2xl border border-neutral/10 bg-neutral-light/60 p-4">
                    <p className="text-xs font-semibold text-primary">
                      {selectedIssueProject.code}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
                      {selectedIssueProject.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral">
                      {selectedIssueProject.area} · {selectedIssueProject.subarea}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {manualCandidatesForIssue.map(
                      ({
                        evaluator,
                        score,
                        projectedLoad,
                        alreadyAssigned,
                        blocked,
                        conflict,
                      }) => (
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
                              disabled={blocked && !alreadyAssigned}
                              onClick={() => handleManualAddForIssue(evaluator.id)}
                              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                alreadyAssigned
                                  ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                  : blocked
                                    ? "cursor-not-allowed border border-neutral/10 bg-neutral-light text-neutral/50"
                                    : "border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                              }`}
                            >
                              {alreadyAssigned ? "Remover" : "Adicionar"}
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <SmallBadge>Afinidade: {score}/6</SmallBadge>

                            <SmallBadge>
                              Carga: {projectedLoad}/{evaluator.maxAssignments}
                            </SmallBadge>

                            {conflict ? (
                              <SmallBadge className="bg-red-50 text-red-700">
                                <ShieldAlert size={13} />
                                Conflito
                              </SmallBadge>
                            ) : null}

                            {projectedLoad >= evaluator.maxAssignments ? (
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
                      ),
                    )}
                  </div>
                </div>
              ) : null}

              <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<UserCheck size={18} />}
                  title="Distribuições existentes"
                  subtitle="Acompanhamento de aceite, recusa e redistribuição."
                />

                <div className="space-y-3">
                  {assignments.map((assignment) => {
                    const project = projects.find(
                      (item) => item.id === assignment.projectId,
                    )

                    const evaluator = evaluators.find(
                      (item) => item.id === assignment.evaluatorId,
                    )

                    if (!project || !evaluator) return null

                    return (
                      <div
                        key={assignment.id}
                        className="rounded-2xl border border-neutral/10 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-primary">
                              {project.code}
                            </p>
                            <h3 className="mt-1 text-sm font-semibold text-neutral-dark">
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
                            <strong>Justificativa:</strong> {assignment.reason}
                          </div>
                        ) : null}

                        {assignment.status === "RECUSADO" ? (
                          <button
                            type="button"
                            onClick={() => handleResendDeclined(assignment.id)}
                            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                          >
                            <RefreshCcw size={14} />
                            Redistribuir automaticamente
                          </button>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
            <div className="flex gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-700" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">
                  Regra operacional recomendada para produção
                </h3>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  O gestor não deve escolher avaliadores manualmente para todos os
                  projetos. A página deve gerar uma distribuição automática por
                  lote, permitir conferência por indicadores e exigir ação manual
                  somente em exceções: falta de avaliador, conflito de interesse,
                  sobrecarga, recusa ou ausência de afinidade suficiente.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  warning,
}: {
  label: string
  value: number
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        warning
          ? "border-amber-100 bg-amber-50 text-amber-800"
          : "border-neutral/10 bg-neutral-light/60 text-neutral-dark"
      }`}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-primary">
        {icon}
      </div>
      <p className="text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}

function SmallBadge({
  children,
  className = "bg-neutral-light text-neutral",
}: {
  children: ReactNode
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