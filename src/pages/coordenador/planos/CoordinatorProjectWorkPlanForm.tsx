// src/pages/coordenador/planos/CoordinatorProjectWorkPlanForm.tsx

import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  FileText,
  Filter,
  Hash,
  ListChecks,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Tags,
  Trash2,
} from "lucide-react"

/* ================= TIPOS ================= */

type Project = {
  id: string
  codigo: string
  titulo: string
  edital: string
  coordenador: string
  unidade: string
  centro: string
  periodo: string
  status: string
  modalidadeBolsa: string
  totalPlanos: number
}

type CronogramaItem = {
  id: string
  mes: string
  atividade: string
}

type WorkPlan = {
  id: string
  tipoBolsa: string
  direcionamento: string
  periodoIni: string
  periodoFim: string
  cota: string
  vinculacaoInstitucional: string
  areaConhecimento: string
  introducaoJustificativa: string
  objetivos: string
  metodologia: string
  cronogramaAtividades: CronogramaItem[]
  referencias: string
  resumoPlano: string
  palavrasChave: string
}

/* ================= OPTIONS ================= */

const tipoBolsaOptions = [
  "PIBIC",
  "PIBITI",
  "PIVIC",
  "PIBIC-AF",
  "PIBIC-EM",
  "Voluntário",
  "Outro",
]

const direcionamentos = [
  "Discente de graduação",
  "Discente de ensino médio",
  "Discente voluntário",
  "Bolsista institucional",
  "Outro",
]

const cotas = ["1", "2", "3", "4", "5", "Mais de 5"]

const vinculacoesInstitucionais = [
  "UFPB",
  "CNPq",
  "FAPESQ",
  "CAPES",
  "Instituição parceira",
  "Outra",
]

const areaConhecimentoOptions = [
  "Ciência da Computação",
  "Engenharias",
  "Saúde",
  "Humanas",
  "Linguística/Artes",
  "Outra",
]

const modalidadesBolsa = [
  "Todas",
  "PIBIC",
  "PIBITI",
  "PIVIC",
  "PIBIC-AF",
  "PIBIC-EM",
  "Voluntário",
]

const mesesCronograma = [
  "Mês 1",
  "Mês 2",
  "Mês 3",
  "Mês 4",
  "Mês 5",
  "Mês 6",
  "Mês 7",
  "Mês 8",
  "Mês 9",
  "Mês 10",
  "Mês 11",
  "Mês 12",
]

/* ================= MOCKS ================= */

const projectsMock: Project[] = [
  {
    id: "1",
    codigo: "PROPESQ-2026-001",
    titulo: "Sistema inteligente para acompanhamento de projetos de pesquisa",
    edital: "PIBIC 2026",
    coordenador: "Profa. Mariana Silva",
    unidade: "Departamento A",
    centro: "CCEN",
    periodo: "2026-08-01 → 2027-07-31",
    status: "SUBMETIDO",
    modalidadeBolsa: "PIBIC",
    totalPlanos: 1,
  },
  {
    id: "2",
    codigo: "PROPESQ-2026-014",
    titulo: "Aplicação de visão computacional em ambientes educacionais",
    edital: "PIBITI 2026",
    coordenador: "Prof. João Pereira",
    unidade: "Laboratório X",
    centro: "CT",
    periodo: "2026-08-01 → 2027-07-31",
    status: "SUBMETIDO",
    modalidadeBolsa: "PIBITI",
    totalPlanos: 2,
  },
  {
    id: "3",
    codigo: "PROPESQ-2026-027",
    titulo: "Estudo interdisciplinar sobre acessibilidade e tecnologia assistiva",
    edital: "PIVIC 2026",
    coordenador: "Profa. Ana Costa",
    unidade: "Programa Y",
    centro: "CCHLA",
    periodo: "2026-08-01 → 2027-07-31",
    status: "EM ANÁLISE",
    modalidadeBolsa: "PIVIC",
    totalPlanos: 1,
  },
]

const initialPlansByProject: Record<string, WorkPlan[]> = {
  "1": [
    {
      id: "plano-existente-1",
      tipoBolsa: "PIBIC",
      direcionamento: "Discente de graduação",
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      cota: "1",
      vinculacaoInstitucional: "UFPB",
      areaConhecimento: "Ciência da Computação",
      introducaoJustificativa:
        "Plano previamente cadastrado no fluxo inicial de submissão do projeto.",
      objetivos:
        "Acompanhar e executar atividades de pesquisa vinculadas ao projeto principal.",
      metodologia:
        "Execução orientada por reuniões periódicas, levantamento bibliográfico e desenvolvimento incremental.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-1",
          mes: "Mês 1",
          atividade: "Revisão bibliográfica e alinhamento metodológico.",
        },
        {
          id: "cronograma-existente-2",
          mes: "Mês 2",
          atividade: "Definição dos instrumentos e organização dos dados.",
        },
      ],
      referencias: "Referências cadastradas no plano inicial.",
      resumoPlano:
        "Plano inicial vinculado ao projeto no momento do cadastro obrigatório.",
      palavrasChave: "pesquisa, iniciação científica, acompanhamento",
    },
  ],
  "2": [
    {
      id: "plano-existente-2",
      tipoBolsa: "PIBITI",
      direcionamento: "Bolsista institucional",
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      cota: "1",
      vinculacaoInstitucional: "CNPq",
      areaConhecimento: "Engenharias",
      introducaoJustificativa: "Plano cadastrado no fluxo inicial.",
      objetivos: "Desenvolver e validar componentes tecnológicos do projeto.",
      metodologia: "Prototipação, testes e análise dos resultados.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-3",
          mes: "Mês 1",
          atividade: "Levantamento de requisitos e revisão técnica.",
        },
      ],
      referencias: "Referências técnicas do projeto.",
      resumoPlano: "Plano voltado à execução tecnológica do projeto.",
      palavrasChave: "inovação, protótipo, tecnologia",
    },
    {
      id: "plano-existente-3",
      tipoBolsa: "PIBITI",
      direcionamento: "Discente de graduação",
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      cota: "2",
      vinculacaoInstitucional: "UFPB",
      areaConhecimento: "Ciência da Computação",
      introducaoJustificativa: "Plano complementar já cadastrado.",
      objetivos: "Apoiar experimentos computacionais.",
      metodologia: "Implementação incremental e avaliação empírica.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-4",
          mes: "Mês 1",
          atividade: "Preparação do ambiente e bases de teste.",
        },
      ],
      referencias: "Referências complementares.",
      resumoPlano: "Plano complementar de desenvolvimento e avaliação.",
      palavrasChave: "visão computacional, avaliação, dados",
    },
  ],
  "3": [
    {
      id: "plano-existente-5",
      tipoBolsa: "PIVIC",
      direcionamento: "Discente voluntário",
      periodoIni: "2026-08-01",
      periodoFim: "2027-07-31",
      cota: "1",
      vinculacaoInstitucional: "UFPB",
      areaConhecimento: "Humanas",
      introducaoJustificativa: "Plano cadastrado no fluxo inicial.",
      objetivos: "Mapear demandas e propor melhorias de acessibilidade.",
      metodologia: "Levantamento bibliográfico, análise documental e entrevistas.",
      cronogramaAtividades: [
        {
          id: "cronograma-existente-6",
          mes: "Mês 1",
          atividade: "Revisão bibliográfica e definição de escopo.",
        },
      ],
      referencias: "Referências sobre acessibilidade e tecnologia assistiva.",
      resumoPlano: "Plano inicial para pesquisa sobre acessibilidade.",
      palavrasChave: "acessibilidade, tecnologia assistiva, inclusão",
    },
  ],
}

const emptyWorkPlan: WorkPlan = {
  id: "",
  tipoBolsa: "",
  direcionamento: "",
  periodoIni: "",
  periodoFim: "",
  cota: "",
  vinculacaoInstitucional: "",
  areaConhecimento: "",
  introducaoJustificativa: "",
  objetivos: "",
  metodologia: "",
  cronogramaAtividades: [],
  referencias: "",
  resumoPlano: "",
  palavrasChave: "",
}

/* ================= UTIL/UI ================= */

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ")
}

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const selectClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function createEmptyDraft() {
  return {
    ...emptyWorkPlan,
    id: createId("plano"),
  }
}

function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-neutral">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {children}

      {hint && <p className="text-[11px] text-neutral">{hint}</p>}
    </div>
  )
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

function Info({
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
      <p className="text-[11px] font-bold uppercase text-neutral">{label}</p>

      <p
        className={cx(
          "text-sm text-neutral",
          preWrap && "whitespace-pre-wrap"
        )}
      >
        {value || "—"}
      </p>
    </div>
  )
}

/* ================= PÁGINA ================= */

export default function CoordinatorProjectWorkPlanForm() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [plansByProject, setPlansByProject] = useState<Record<string, WorkPlan[]>>(
    initialPlansByProject
  )
  const [draft, setDraft] = useState<WorkPlan>(createEmptyDraft())
  const [cronogramaMes, setCronogramaMes] = useState("")
  const [cronogramaAtividade, setCronogramaAtividade] = useState("")

  const [filters, setFilters] = useState({
    codigo: "",
    nome: "",
    modalidadeBolsa: "Todas",
  })

  const selectedProject = useMemo(() => {
    return projectsMock.find((project) => project.id === selectedProjectId) || null
  }, [selectedProjectId])

  const existingPlans = selectedProject
    ? plansByProject[selectedProject.id] || []
    : []

  const filteredProjects = useMemo(() => {
    const codigo = filters.codigo.trim().toLowerCase()
    const nome = filters.nome.trim().toLowerCase()
    const modalidadeBolsa = filters.modalidadeBolsa

    return projectsMock.filter((project) => {
      const matchCodigo = codigo
        ? project.codigo.toLowerCase().includes(codigo)
        : true

      const matchNome = nome
        ? project.titulo.toLowerCase().includes(nome)
        : true

      const matchModalidade =
        modalidadeBolsa === "Todas"
          ? true
          : project.modalidadeBolsa === modalidadeBolsa

      return matchCodigo && matchNome && matchModalidade
    })
  }, [filters])

  const canAddCronogramaItem = Boolean(
    cronogramaMes.trim() && cronogramaAtividade.trim()
  )

  const canSavePlan = useMemo(() => {
    return Boolean(
      selectedProject &&
        draft.tipoBolsa.trim() &&
        draft.direcionamento.trim() &&
        draft.periodoIni &&
        draft.periodoFim &&
        draft.cota.trim() &&
        draft.vinculacaoInstitucional.trim() &&
        draft.areaConhecimento.trim() &&
        draft.introducaoJustificativa.trim() &&
        draft.objetivos.trim() &&
        draft.metodologia.trim() &&
        draft.cronogramaAtividades.length > 0 &&
        draft.referencias.trim() &&
        draft.resumoPlano.trim() &&
        draft.palavrasChave.trim()
    )
  }, [draft, selectedProject])

  function resetDraft() {
    setDraft(createEmptyDraft())
    setCronogramaMes("")
    setCronogramaAtividade("")
    setSaved(false)
  }

  function clearFilters() {
    setFilters({
      codigo: "",
      nome: "",
      modalidadeBolsa: "Todas",
    })
  }

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId)
    resetDraft()
  }

  function duplicateLastPlan() {
    const lastPlan = existingPlans[existingPlans.length - 1]
    if (!lastPlan) return

    setDraft({
      ...lastPlan,
      id: createId("plano"),
      cronogramaAtividades: lastPlan.cronogramaAtividades.map((item) => ({
        ...item,
        id: createId("cronograma"),
      })),
    })

    setSaved(false)
  }

  function addCronogramaItem() {
    if (!canAddCronogramaItem) return

    setDraft((current) => ({
      ...current,
      cronogramaAtividades: [
        ...current.cronogramaAtividades,
        {
          id: createId("cronograma"),
          mes: cronogramaMes,
          atividade: cronogramaAtividade,
        },
      ],
    }))

    setCronogramaMes("")
    setCronogramaAtividade("")
    setSaved(false)
  }

  function removeCronogramaItem(cronogramaId: string) {
    setDraft((current) => ({
      ...current,
      cronogramaAtividades: current.cronogramaAtividades.filter(
        (item) => item.id !== cronogramaId
      ),
    }))

    setSaved(false)
  }

  function updateCronogramaItem(
    cronogramaId: string,
    field: keyof Pick<CronogramaItem, "mes" | "atividade">,
    value: string
  ) {
    setDraft((current) => ({
      ...current,
      cronogramaAtividades: current.cronogramaAtividades.map((item) =>
        item.id === cronogramaId ? { ...item, [field]: value } : item
      ),
    }))

    setSaved(false)
  }

  function applyCronogramaTemplate(totalMeses: 6 | 12) {
    const baseActivities = [
      "Revisão bibliográfica e alinhamento metodológico.",
      "Definição dos instrumentos, bases e materiais de pesquisa.",
      "Coleta, organização ou preparação dos dados.",
      "Execução dos experimentos, análises ou desenvolvimento.",
      "Validação dos resultados e ajustes metodológicos.",
      "Redação de relatório, sistematização e divulgação dos resultados.",
    ]

    const template = Array.from({ length: totalMeses }, (_, index) => ({
      id: createId("cronograma"),
      mes: `Mês ${index + 1}`,
      atividade:
        totalMeses === 6
          ? baseActivities[index]
          : baseActivities[
              Math.min(Math.floor(index / 2), baseActivities.length - 1)
            ],
    }))

    setDraft((current) => ({
      ...current,
      cronogramaAtividades: template,
    }))

    setSaved(false)
  }

  async function savePlan() {
    if (!selectedProject || !canSavePlan) return

    setSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))

      setPlansByProject((current) => ({
        ...current,
        [selectedProject.id]: [
          ...(current[selectedProject.id] || []),
          {
            ...draft,
            id: draft.id || createId("plano"),
          },
        ],
      }))

      setSaved(true)
      setDraft(createEmptyDraft())
      setCronogramaMes("")
      setCronogramaAtividade("")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Voltar para projetos
          </Link>
        </div>

        <section className="flex flex-col gap-4 rounded-3xl border border-neutral/30 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <BookOpen size={14} />
              Planos de trabalho
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Adicionar plano de trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Busque e selecione um projeto já cadastrado para vincular um novo
              plano de trabalho. Esta página é independente no menu e não depende
              de id na rota.
            </p>
          </div>

          <div className="flex w-fit flex-col gap-2 rounded-2xl border border-neutral/20 bg-neutral/5 px-4 py-3">
            <span className="text-[11px] font-bold uppercase text-neutral">
              Projeto selecionado
            </span>

            <span className="text-sm font-bold text-primary">
              {selectedProject ? selectedProject.codigo : "Nenhum"}
            </span>
          </div>
        </section>

        <Card
          title="Selecionar projeto"
          subtitle="Use os filtros básicos para localizar o projeto que receberá o novo plano."
          icon={<Search size={18} className="text-primary" />}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr_240px_auto]">
            <Field label="Código do projeto">
              <input
                value={filters.codigo}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    codigo: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Ex.: PROPESQ-2026-001"
              />
            </Field>

            <Field label="Nome do projeto">
              <input
                value={filters.nome}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                className={inputClassName}
                placeholder="Digite parte do título"
              />
            </Field>

            <Field label="Modalidade da Bolsa">
              <select
                value={filters.modalidadeBolsa}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    modalidadeBolsa: event.target.value,
                  }))
                }
                className={selectClassName}
              >
                {modalidadesBolsa.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
              >
                <Filter size={16} />
                Limpar
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral/20">
            <div className="grid grid-cols-12 gap-3 border-b border-neutral/20 bg-neutral/5 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-neutral">
              <span className="col-span-3">Código</span>
              <span className="col-span-4">Projeto</span>
              <span className="col-span-2">Modalidade</span>
              <span className="col-span-2">Planos</span>
              <span className="col-span-1 text-right">Ação</span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm font-semibold text-primary">
                  Nenhum projeto encontrado.
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Ajuste os filtros para localizar o projeto desejado.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral/20">
                {filteredProjects.map((project) => {
                  const selected = project.id === selectedProjectId
                  const totalPlanos = plansByProject[project.id]?.length || project.totalPlanos

                  return (
                    <div
                      key={project.id}
                      className={cx(
                        "grid grid-cols-12 gap-3 px-4 py-4 text-sm transition",
                        selected ? "bg-primary/5" : "bg-white hover:bg-neutral/5"
                      )}
                    >
                      <div className="col-span-3">
                        <p className="font-bold text-primary">{project.codigo}</p>
                        <p className="mt-1 text-xs text-neutral">{project.edital}</p>
                      </div>

                      <div className="col-span-4">
                        <p className="font-semibold text-primary">{project.titulo}</p>
                        <p className="mt-1 text-xs text-neutral">
                          {project.centro} • {project.unidade}
                        </p>
                      </div>

                      <div className="col-span-2 flex items-start">
                        <span className="inline-flex rounded-full border border-neutral/20 bg-white px-2.5 py-1 text-xs font-bold text-neutral">
                          {project.modalidadeBolsa}
                        </span>
                      </div>

                      <div className="col-span-2 text-neutral">
                        <p className="font-semibold text-primary">{totalPlanos}</p>
                        <p className="mt-1 text-xs">já vinculado(s)</p>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => selectProject(project.id)}
                          className={cx(
                            "inline-flex h-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition",
                            selected
                              ? "bg-primary text-white"
                              : "border border-neutral/20 bg-white text-primary hover:border-primary/30"
                          )}
                        >
                          {selected ? <Check size={14} /> : <Plus size={14} />}
                          {selected ? "Selecionado" : "Selecionar"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>

        {selectedProject ? (
          <>
            <Card
              title="Projeto selecionado"
              subtitle="O novo plano será vinculado ao projeto abaixo."
              icon={<FileText size={18} className="text-primary" />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Info label="Título" value={selectedProject.titulo} />
                </div>

                <Info label="Código" value={selectedProject.codigo} />
                <Info label="Status" value={selectedProject.status} />
                <Info label="Edital" value={selectedProject.edital} />
                <Info label="Modalidade da Bolsa" value={selectedProject.modalidadeBolsa} />
                <Info label="Coordenador" value={selectedProject.coordenador} />
                <Info label="Período" value={selectedProject.periodo} />
                <Info label="Centro" value={selectedProject.centro} />
                <Info label="Unidade" value={selectedProject.unidade} />
              </div>
            </Card>

            <Card
              title="Planos já vinculados"
              subtitle="O projeto já possui pelo menos 1 plano obrigatório cadastrado no fluxo inicial."
              icon={<ListChecks size={18} className="text-primary" />}
            >
              <div className="space-y-3">
                {existingPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="rounded-xl border border-neutral/20 bg-white p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-bold text-primary">
                          Plano de trabalho {index + 1}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral">
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                            <BookOpen size={12} />
                            {plan.tipoBolsa}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                            <CalendarDays size={12} />
                            {plan.periodoIni} → {plan.periodoFim}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral/10 px-2 py-1">
                            <Hash size={12} />
                            Cota: {plan.cota}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral">
                          {plan.resumoPlano}
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        <Check size={13} />
                        Vinculado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Novo plano de trabalho"
              subtitle="Preencha os dados abaixo para adicionar um novo plano ao projeto selecionado."
              icon={<Plus size={18} className="text-primary" />}
            >
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-primary">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-bold">
                    Este cadastro é complementar.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral">
                    O plano será vinculado ao projeto {selectedProject.codigo}. Para
                    mudar o vínculo, selecione outro projeto na lista acima.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-neutral/20 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Dados do plano
                  </h3>

                  <p className="mt-1 text-xs text-neutral">
                    Os campos marcados com asterisco são obrigatórios.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={duplicateLastPlan}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                  >
                    <Copy size={14} />
                    Duplicar último
                  </button>

                  <button
                    type="button"
                    onClick={resetDraft}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                  >
                    <RefreshCcw size={14} />
                    Limpar
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Tipo de Bolsa" required>
                  <select
                    value={draft.tipoBolsa}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        tipoBolsa: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {tipoBolsaOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Direcionamento" required>
                  <select
                    value={draft.direcionamento}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        direcionamento: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {direcionamentos.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Período" required hint="Defina início e fim do plano.">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="date"
                      value={draft.periodoIni}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          periodoIni: event.target.value,
                        }))
                      }
                      className={inputClassName}
                    />

                    <input
                      type="date"
                      value={draft.periodoFim}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          periodoFim: event.target.value,
                        }))
                      }
                      className={inputClassName}
                    />
                  </div>
                </Field>

                <Field label="Cota" required>
                  <select
                    value={draft.cota}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        cota: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {cotas.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Vinculação institucional" required>
                  <select
                    value={draft.vinculacaoInstitucional}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        vinculacaoInstitucional: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {vinculacoesInstitucionais.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Área de conhecimento" required>
                  <select
                    value={draft.areaConhecimento}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        areaConhecimento: event.target.value,
                      }))
                    }
                    className={selectClassName}
                  >
                    <option value="">Selecione</option>
                    {areaConhecimentoOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Introdução e justificativa" required>
                    <textarea
                      value={draft.introducaoJustificativa}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          introducaoJustificativa: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Apresente o contexto do plano e a justificativa da atividade."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Objetivos" required>
                    <textarea
                      value={draft.objetivos}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          objetivos: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Informe os objetivos gerais e específicos do plano."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Metodologia" required>
                    <textarea
                      value={draft.metodologia}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          metodologia: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Descreva os procedimentos, métodos e etapas de execução."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Cronograma de atividades"
                    required
                    hint="Adicione pelo menos uma atividade. Você pode usar os modelos rápidos e editar o mês ou o texto de cada atividade antes de salvar."
                  >
                    <div className="rounded-2xl border border-neutral/20 p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => applyCronogramaTemplate(6)}
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                        >
                          <CalendarDays size={14} />
                          Modelo 6 meses
                        </button>

                        <button
                          type="button"
                          onClick={() => applyCronogramaTemplate(12)}
                          className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
                        >
                          <CalendarDays size={14} />
                          Modelo 12 meses
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr_auto]">
                        <select
                          value={cronogramaMes}
                          onChange={(event) =>
                            setCronogramaMes(event.target.value)
                          }
                          className={selectClassName}
                        >
                          <option value="">Mês</option>
                          {mesesCronograma.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>

                        <input
                          value={cronogramaAtividade}
                          onChange={(event) =>
                            setCronogramaAtividade(event.target.value)
                          }
                          className={inputClassName}
                          placeholder="Descreva a atividade desse mês"
                        />

                        <button
                          type="button"
                          onClick={addCronogramaItem}
                          disabled={!canAddCronogramaItem}
                          className={cx(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                            canAddCronogramaItem
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "cursor-not-allowed bg-neutral/10 text-neutral"
                          )}
                        >
                          <Plus size={16} />
                          Adicionar
                        </button>
                      </div>

                      <div className="mt-4 space-y-2">
                        {draft.cronogramaAtividades.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-neutral/30 bg-neutral/5 p-4 text-center">
                            <p className="text-sm font-semibold text-primary">
                              Nenhuma atividade adicionada.
                            </p>

                            <p className="mt-1 text-xs text-neutral">
                              Selecione um mês, descreva a atividade e clique em adicionar.
                            </p>
                          </div>
                        ) : (
                          draft.cronogramaAtividades.map((item, index) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-1 gap-3 rounded-xl border border-neutral/20 bg-white p-3 md:grid-cols-[160px_1fr_auto] md:items-start"
                            >
                              <Field label={`Item ${index + 1}`}>
                                <select
                                  value={item.mes}
                                  onChange={(event) =>
                                    updateCronogramaItem(
                                      item.id,
                                      "mes",
                                      event.target.value
                                    )
                                  }
                                  className={selectClassName}
                                >
                                  {mesesCronograma.map((mes) => (
                                    <option key={mes} value={mes}>
                                      {mes}
                                    </option>
                                  ))}
                                </select>
                              </Field>

                              <Field label="Atividade do cronograma">
                                <textarea
                                  value={item.atividade}
                                  onChange={(event) =>
                                    updateCronogramaItem(
                                      item.id,
                                      "atividade",
                                      event.target.value
                                    )
                                  }
                                  className="min-h-[88px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  placeholder="Edite o texto sugerido pelo modelo"
                                />
                              </Field>

                              <div className="flex md:pt-6">
                                <button
                                  type="button"
                                  onClick={() => removeCronogramaItem(item.id)}
                                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                >
                                  <Trash2 size={14} />
                                  Remover
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Referências" required>
                    <textarea
                      value={draft.referencias}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          referencias: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Informe as referências bibliográficas do plano."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Resumo do plano" required>
                    <textarea
                      value={draft.resumoPlano}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          resumoPlano: event.target.value,
                        }))
                      }
                      className={textareaClassName}
                      placeholder="Resumo objetivo do plano de trabalho."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Palavras-chave"
                    required
                    hint="Separe por vírgula ou ponto e vírgula."
                  >
                    <input
                      value={draft.palavrasChave}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          palavrasChave: event.target.value,
                        }))
                      }
                      className={inputClassName}
                      placeholder="ex.: IA, educação, acessibilidade"
                    />
                  </Field>
                </div>
              </div>

              {saved && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-bold text-green-800">
                    Plano adicionado com sucesso!
                  </p>

                  <p className="mt-1 text-xs text-green-800/80">
                    O novo plano foi vinculado ao projeto selecionado.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={resetDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  Limpar formulário
                </button>

                <button
                  type="button"
                  onClick={savePlan}
                  disabled={saving || !canSavePlan}
                  className={cx(
                    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                    saving || !canSavePlan
                      ? "cursor-not-allowed bg-neutral/10 text-neutral"
                      : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  <Save size={16} />
                  {saving ? "Salvando..." : "Adicionar plano ao projeto"}
                </button>
              </div>
            </Card>
          </>
        ) : (
          <Card
            title="Nenhum projeto selecionado"
            subtitle="Selecione um projeto na lista acima para liberar o formulário de cadastro do plano."
            icon={<AlertCircle size={18} className="text-primary" />}
          >
            <div className="rounded-2xl border border-dashed border-neutral/30 bg-neutral/5 p-6 text-center">
              <p className="text-sm font-semibold text-primary">
                O formulário de plano de trabalho será exibido após a seleção do projeto.
              </p>

              <p className="mt-1 text-xs text-neutral">
                A vinculação do novo plano será feita com base no projeto selecionado nesta página.
              </p>
            </div>
          </Card>
        )}

        <div className="flex justify-center pt-2">
          <Link
            to="/coordenador/projetos"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-neutral/5"
          >
            Voltar para lista de projetos
          </Link>
        </div>
      </div>
    </main>
  )
}
