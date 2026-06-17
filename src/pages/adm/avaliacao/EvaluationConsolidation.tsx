/// não to usando
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Clock3,
  GitBranch,
  RefreshCcw,
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
  | "PENDENTE"
  | "DISTRIBUIDO"
  | "INCOMPLETO"
  | "RECUSADO"

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
    code: "PIBIC-2026-001",
    title: "Uso de Inteligência Artificial para Apoio à Acessibilidade",
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
    code: "PIBIC-2026-014",
    title: "Análise de Dados Aplicada ao Monitoramento Institucional",
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
    code: "PIBIC-2026-027",
    title: "Métodos Computacionais Aplicados à Análise de Sinais Biomédicos",
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
    code: "PIBIC-2026-033",
    title: "Modelagem de Indicadores para Acompanhamento Científico",
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
    code: "PIBIC-2026-041",
    title: "Sistemas Inteligentes Aplicados à Análise de Dados Públicos",
    coordinator: "Dra. Juliana Freitas",
    unit: "CI",
    grandeArea: "Ciências Exatas e da Terra",
    area: "Ciência da Computação",
    subarea: "Sistemas de Informação",
    especialidade: "Mineração de Dados",
    status: "PENDENTE",
  },
  {
    id: 6,
    code: "PIBIC-2026-052",
    title: "Estratégias Pedagógicas em Ambientes Digitais de Aprendizagem",
    coordinator: "Dra. Paula Nascimento",
    unit: "CE",
    grandeArea: "Ciências Humanas",
    area: "Educação",
    subarea: "Tecnologia Educacional",
    especialidade: "Ensino Híbrido",
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
    subareas: ["Inteligência Artificial", "Sistemas de Informação"],
    maxAssignments: 6,
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
    maxAssignments: 5,
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
    maxAssignments: 4,
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
    maxAssignments: 5,
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
    maxAssignments: 3,
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

function getEvaluatorProjectedLoad(
  evaluatorId: number,
  evaluators: Evaluator[],
  draftAssignments: DraftAssignment[],
) {
  const evaluator = evaluators.find((item) => item.id === evaluatorId)

  if (!evaluator) return 0

  return (
    evaluator.currentAssignments +
    draftAssignments.filter((item) => item.evaluatorId === evaluatorId).length
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
      const aCandidates = evaluators.filter(
        (evaluator) =>
          !evaluator.unavailable &&
          !hasConflict(a, evaluator) &&
          affinityScore(a, evaluator) > 0,
      ).length

      const bCandidates = evaluators.filter(
        (evaluator) =>
          !evaluator.unavailable &&
          !hasConflict(b, evaluator) &&
          affinityScore(b, evaluator) > 0,
      ).length

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
      })

      missing -= 1
    }
  })

  return {
    draftAssignments,
    issues,
  }
}

export default function AdminEvaluationDistribution() {
  const [projects, setProjects] = useState<Project[]>(projectsMock)
  const [evaluators, setEvaluators] = useState<Evaluator[]>(evaluatorsMock)
  const [assignments, setAssignments] = useState<Assignment[]>(assignmentsMock)
  const [preview, setPreview] = useState<DistributionPreview | null>(null)
  const [selectedIssueProjectId, setSelectedIssueProjectId] = useState<number | null>(
    null,
  )

  const pendingProjects = projects.filter(
    (project) => project.status !== "DISTRIBUIDO",
  )

  const distributedProjects = projects.filter(
    (project) => project.status === "DISTRIBUIDO",
  )

  const declinedAssignments = assignments.filter(
    (assignment) => assignment.status === "RECUSADO",
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

  const areaSummary = useMemo(() => {
    const grouped = new Map<
      string,
      {
        area: string
        total: number
        pending: number
        distributed: number
        issues: number
        draftAssignments: number
      }
    >()

    projects.forEach((project) => {
      const current =
        grouped.get(project.area) ??
        {
          area: project.area,
          total: 0,
          pending: 0,
          distributed: 0,
          issues: 0,
          draftAssignments: 0,
        }

      current.total += 1

      if (project.status === "DISTRIBUIDO") {
        current.distributed += 1
      } else {
        current.pending += 1
      }

      grouped.set(project.area, current)
    })

    preview?.issues.forEach((issue) => {
      const project = projects.find((item) => item.id === issue.projectId)

      if (!project) return

      const current = grouped.get(project.area)

      if (current) current.issues += 1
    })

    preview?.draftAssignments.forEach((assignment) => {
      const project = projects.find((item) => item.id === assignment.projectId)

      if (!project) return

      const current = grouped.get(project.area)

      if (current) current.draftAssignments += 1
    })

    return Array.from(grouped.values()).sort((a, b) =>
      a.area.localeCompare(b.area),
    )
  }, [projects, preview])

  const projectsCompletedInPreview = useMemo(() => {
    if (!preview) return 0

    return pendingProjects.filter((project) => {
      const activeCount = activeAssignmentsByProject(
        project.id,
        assignments,
      ).length

      const draftCount = preview.draftAssignments.filter(
        (item) => item.projectId === project.id,
      ).length

      return activeCount + draftCount >= MIN_EVALUATORS_PER_PROJECT
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
      .sort((a, b) => b.score - a.score || a.projectedLoad - b.projectedLoad)
  }, [selectedIssueProject, preview, assignments, evaluators])

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

  function handleClearPreview() {
    setPreview(null)
    setSelectedIssueProjectId(null)
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
        const activeCount = activeAssignmentsByProject(
          project.id,
          assignments,
        ).length

        const draftCount = preview.draftAssignments.filter(
          (assignment) => assignment.projectId === project.id,
        ).length

        const hasEnoughEvaluators =
          activeCount + draftCount >= MIN_EVALUATORS_PER_PROJECT

        if (hasEnoughEvaluators) {
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

  function handleManualToggleForIssue(evaluatorId: number) {
    if (!selectedIssueProject || !preview) return

    const existing = preview.draftAssignments.find(
      (assignment) =>
        assignment.projectId === selectedIssueProject.id &&
        assignment.evaluatorId === evaluatorId,
    )

    if (existing) {
      const nextDraftAssignments = preview.draftAssignments.filter(
        (assignment) => assignment.id !== existing.id,
      )

      setPreview({
        ...preview,
        draftAssignments: nextDraftAssignments,
      })

      return
    }

    const evaluator = evaluators.find((item) => item.id === evaluatorId)

    if (!evaluator) return

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

    const nextDraftAssignments = [
      ...preview.draftAssignments,
      {
        id: Date.now(),
        projectId: selectedIssueProject.id,
        evaluatorId,
        score: affinityScore(selectedIssueProject, evaluator),
      },
    ]

    const activeCount = activeAssignmentsByProject(
      selectedIssueProject.id,
      assignments,
    ).length

    const draftCount = nextDraftAssignments.filter(
      (assignment) => assignment.projectId === selectedIssueProject.id,
    ).length

    const nextIssues =
      activeCount + draftCount >= MIN_EVALUATORS_PER_PROJECT
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

    if (!declinedAssignment) return

    const project = projects.find(
      (item) => item.id === declinedAssignment.projectId,
    )

    if (!project) return

    const alreadyAssignedIds = assignments
      .filter(
        (assignment) =>
          assignment.projectId === project.id &&
          assignment.status !== "RECUSADO",
      )
      .map((assignment) => assignment.evaluatorId)

    const replacement = evaluators
      .filter((evaluator) => {
        return (
          !alreadyAssignedIds.includes(evaluator.id) &&
          evaluator.id !== declinedAssignment.evaluatorId &&
          canEvaluateWithProjectedLoad({
            project,
            evaluator,
            evaluators,
            draftAssignments: [],
          })
        )
      })
      .sort((a, b) => {
        return (
          affinityScore(project, b) -
            affinityScore(project, a) ||
          a.currentAssignments / a.maxAssignments -
            b.currentAssignments / b.maxAssignments
        )
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

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <Link
                  to="/adm/avaliacao/avaliadores"
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral transition hover:text-primary"
                >
                  <ArrowLeft size={16} />
                  Voltar para Avaliadores
                </Link>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    <GitBranch size={14} />
                    Distribuição em lote
                  </div>

                  <h1 className="text-2xl font-bold text-neutral-dark">
                    Distribuição de Projtos para Avaliação
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
                    A distribuição é gerada
                    em lote, os resultados são agregados por área e apenas as
                    exceções exigem ação manual.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4 lg:w-[620px]">
                <SummaryCard
                  label="Projetos"
                  value={projects.length}
                  icon={<GitBranch size={18} />}
                />
                <SummaryCard
                  label="Pendentes"
                  value={pendingProjects.length}
                  icon={<Clock3 size={18} />}
                />
                <SummaryCard
                  label="Distribuídos"
                  value={distributedProjects.length}
                  icon={<CheckCircle2 size={18} />}
                />
                <SummaryCard
                  label="Recusas"
                  value={declinedAssignments.length}
                  icon={<XCircle size={18} />}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <SectionTitle
                icon={<Shuffle size={18} />}
                title="Ação principal"
                subtitle="Gere uma prévia automática para todos os projetos pendentes e revise somente os casos com problema."
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
                  disabled={!preview || preview.draftAssignments.length === 0}
                  onClick={handleConfirmPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-neutral/10 disabled:bg-neutral-light disabled:text-neutral/50"
                >
                  <Send size={16} />
                  Confirmar e enviar convites
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
                value={preview?.draftAssignments.length ?? 0}
                icon={<UserCheck size={18} />}
              />

              <MetricCard
                label="Projetos completos na prévia"
                value={projectsCompletedInPreview}
                icon={<CheckCircle2 size={18} />}
              />

              <MetricCard
                label="Exceções"
                value={preview?.issues.length ?? 0}
                icon={<AlertTriangle size={18} />}
                warning={Boolean(preview && preview.issues.length > 0)}
              />
            </div>

            {preview ? (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <CircleAlert size={18} className="mt-0.5 shrink-0 text-blue-700" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800">
                      Prévia gerada
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      Nenhum convite foi enviado ainda. Revise os indicadores,
                      corrija as exceções e confirme o envio apenas quando a
                      distribuição estiver adequada.
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
                  title="Resumo agregado por área"
                  subtitle="Substitui a listagem de todos os projetos. O gestor acompanha a distribuição por agrupamento."
                />

                <div className="overflow-hidden rounded-2xl border border-neutral/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-light/70 text-xs uppercase text-neutral">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Área</th>
                        <th className="px-4 py-3 font-semibold">Total</th>
                        <th className="px-4 py-3 font-semibold">Pendentes</th>
                        <th className="px-4 py-3 font-semibold">Distribuídos</th>
                        <th className="px-4 py-3 font-semibold">Sugestões</th>
                        <th className="px-4 py-3 font-semibold">Exceções</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral/10">
                      {areaSummary.map((item) => (
                        <tr key={item.area} className="bg-white">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-neutral-dark">
                              {item.area}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-neutral">{item.total}</td>
                          <td className="px-4 py-4 text-neutral">{item.pending}</td>
                          <td className="px-4 py-4 text-neutral">
                            {item.distributed}
                          </td>

                          <td className="px-4 py-4">
                            <SmallBadge className="bg-primary/10 text-primary">
                              +{item.draftAssignments}
                            </SmallBadge>
                          </td>

                          <td className="px-4 py-4">
                            {item.issues > 0 ? (
                              <SmallBadge className="bg-red-50 text-red-700">
                                {item.issues} ajuste(s)
                              </SmallBadge>
                            ) : (
                              <SmallBadge className="bg-emerald-50 text-emerald-700">
                                Sem pendência
                              </SmallBadge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                <SectionTitle
                  icon={<Users size={18} />}
                  title="Carga projetada dos avaliadores"
                  subtitle="Mostra se a distribuição está equilibrada antes do envio."
                />

                <div className="grid gap-3 md:grid-cols-2">
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
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-dark">
                              {evaluator.name}
                            </h3>
                            <p className="mt-1 text-xs text-neutral">
                              {evaluator.unit} · {evaluator.email}
                            </p>
                          </div>

                          {added > 0 ? (
                            <SmallBadge className="bg-primary/10 text-primary">
                              +{added}
                            </SmallBadge>
                          ) : null}
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
                  subtitle="Aqui aparecem apenas os projetos que exigem intervenção manual."
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
                              <p className="mt-1 text-xs text-neutral">
                                {project.area} · {project.subarea}
                              </p>
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
                      Após gerar a prévia, os problemas de distribuição aparecerão
                      aqui.
                    </p>
                  </div>
                )}
              </div>

              {selectedIssueProject && preview ? (
                <div className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm">
                  <SectionTitle
                    icon={<SlidersHorizontal size={18} />}
                    title="Ajuste manual da exceção"
                    subtitle="Atribua avaliadores somente para o projeto problemático selecionado."
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
                              onClick={() =>
                                handleManualToggleForIssue(evaluator.id)
                              }
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
                  icon={<RefreshCcw size={18} />}
                  title="Recusas e redistribuição"
                  subtitle="A tela mostra somente recusas, pois são os casos que exigem ação."
                />

                {declinedAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {declinedAssignments.map((assignment) => {
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
                          className="rounded-2xl border border-red-100 bg-red-50 p-4"
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
                                Recusa registrada em {assignment.sentAt}
                              </p>
                            </div>

                            <SmallBadge className="bg-red-100 text-red-700">
                              Recusado
                            </SmallBadge>
                          </div>

                          {assignment.reason ? (
                            <p className="mt-3 text-xs leading-5 text-red-700">
                              <strong>Justificativa:</strong> {assignment.reason}
                            </p>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => handleResendDeclined(assignment.id)}
                            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"
                          >
                            <RefreshCcw size={14} />
                            Redistribuir automaticamente
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-neutral/20 bg-neutral-light/60 p-6 text-center">
                    <CheckCircle2 className="mx-auto text-emerald-600" size={28} />
                    <h3 className="mt-3 text-sm font-semibold text-neutral-dark">
                      Nenhuma recusa pendente
                    </h3>
                    <p className="mt-1 text-sm text-neutral">
                      Quando houver recusa justificada, ela aparecerá aqui para
                      redistribuição.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
            <div className="flex gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-700" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">
                  Ajuste feito para produção
                </h3>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  A tela não exibe mais todos os projetos como cards. Para um
                  edital com centenas de submissões, o fluxo correto é: gerar
                  distribuição em lote, analisar indicadores agregados por área,
                  revisar carga dos avaliadores e corrigir apenas exceções.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
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