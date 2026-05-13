import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Eye,
  Filter,
  Info,
  Notebook,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  XCircle,
} from "lucide-react"

type IndicationStatus =
  | "Pendente de indicação"
  | "Discente indicado"
  | "Aguardando validação"
  | "Indicação aprovada"
  | "Indicação recusada"

type Modality = "Bolsista" | "Voluntário" | "Bolsista ou Voluntário"

type Student = {
  id: number
  name: string
  registration: string
  course: string
  semester: string
  cra: string
  email: string
}

type BankData = {
  bankName: string
  agency: string
  account: string
}

type IndicationPlan = {
  id: number
  projectId: number
  projectTitle: string
  planTitle: string
  edital: string
  ano: string
  area: string
  modality: Modality
  vacancies: number
  workload: number
  status: IndicationStatus
  approvedAt: string
  indicatedStudent: Student | null
  indicationType: "Bolsista" | "Voluntário" | null
  bankData: BankData | null
}

const students: Student[] = [
  {
    id: 1,
    name: "Ana Beatriz Santos",
    registration: "20230014567",
    course: "Ciência da Computação",
    semester: "5º período",
    cra: "8.7",
    email: "ana.beatriz@academico.ufpb.br",
  },
  {
    id: 2,
    name: "João Victor Almeida",
    registration: "20220017890",
    course: "Ciência de Dados e Inteligência Artificial",
    semester: "6º período",
    cra: "8.4",
    email: "joao.victor@academico.ufpb.br",
  },
  {
    id: 3,
    name: "Mariana Costa Lima",
    registration: "20210011223",
    course: "Engenharia de Computação",
    semester: "7º período",
    cra: "9.1",
    email: "mariana.lima@academico.ufpb.br",
  },
  {
    id: 4,
    name: "Pedro Henrique Silva",
    registration: "20240015678",
    course: "Ciência da Computação",
    semester: "3º período",
    cra: "7.9",
    email: "pedro.silva@academico.ufpb.br",
  },
]

const initialPlans: IndicationPlan[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Prototipação de interfaces acessíveis para ambientes educacionais",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Interação Humano-Computador",
    modality: "Bolsista",
    vacancies: 1,
    workload: 20,
    status: "Indicação aprovada",
    approvedAt: "10/05/2026",
    indicatedStudent: students[0],
    indicationType: "Bolsista",
    bankData: {
      bankName: "Banco do Brasil",
      agency: "1234-5",
      account: "98765-4",
    },
  },
  {
    id: 2,
    projectId: 1,
    projectTitle: "Desenvolvimento de Recursos de Acessibilidade Digital com VLibras",
    planTitle: "Análise de dados de uso em ferramentas de acessibilidade",
    edital: "PIBIC 2026",
    ano: "2026",
    area: "Ciência de Dados",
    modality: "Voluntário",
    vacancies: 1,
    workload: 12,
    status: "Pendente de indicação",
    approvedAt: "10/05/2026",
    indicatedStudent: null,
    indicationType: null,
    bankData: null,
  },
  {
    id: 3,
    projectId: 2,
    projectTitle: "Análise de Dados Educacionais para Monitoramento de Indicadores Acadêmicos",
    planTitle: "Construção de painel analítico para acompanhamento acadêmico",
    edital: "PIBITI 2026",
    ano: "2026",
    area: "Ciência de Dados",
    modality: "Bolsista ou Voluntário",
    vacancies: 1,
    workload: 20,
    status: "Aguardando validação",
    approvedAt: "09/05/2026",
    indicatedStudent: students[1],
    indicationType: "Bolsista",
    bankData: {
      bankName: "Caixa Econômica Federal",
      agency: "0021",
      account: "45678-9",
    },
  },
  {
    id: 4,
    projectId: 3,
    projectTitle: "Modelos Inteligentes para Apoio à Gestão de Projetos de Pesquisa",
    planTitle: "Implementação de módulo inteligente para triagem de propostas",
    edital: "PIBIC 2025",
    ano: "2025",
    area: "Inteligência Artificial",
    modality: "Bolsista",
    vacancies: 1,
    workload: 20,
    status: "Indicação recusada",
    approvedAt: "30/04/2026",
    indicatedStudent: students[2],
    indicationType: "Bolsista",
    bankData: {
      bankName: "Banco do Brasil",
      agency: "3344-1",
      account: "10203-6",
    },
  },
  {
    id: 5,
    projectId: 4,
    projectTitle: "Reconhecimento de Padrões em Sinais Multimodais Aplicados à Acessibilidade",
    planTitle: "Extração e análise de características em sinais multimodais",
    edital: "PIBITI 2025",
    ano: "2025",
    area: "Processamento de Sinais",
    modality: "Voluntário",
    vacancies: 1,
    workload: 16,
    status: "Discente indicado",
    approvedAt: "28/04/2026",
    indicatedStudent: students[3],
    indicationType: "Voluntário",
    bankData: {
      bankName: "Nubank",
      agency: "0001",
      account: "778899-0",
    },
  },
]

const editalOptions = ["Todos", "PIBIC 2026", "PIBITI 2026", "PIBIC 2025", "PIBITI 2025"]

const statusOptions: Array<IndicationStatus | "Todos"> = [
  "Todos",
  "Pendente de indicação",
  "Discente indicado",
  "Aguardando validação",
  "Indicação aprovada",
  "Indicação recusada",
]

const modalityOptions: Array<Modality | "Todos"> = [
  "Todos",
  "Bolsista",
  "Voluntário",
  "Bolsista ou Voluntário",
]

const yearOptions = ["Todos", "2026", "2025"]

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

function getStatusClass(status: IndicationStatus) {
  switch (status) {
    case "Indicação aprovada":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Aguardando validação":
      return "border-violet-200 bg-violet-50 text-violet-700"
    case "Discente indicado":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Indicação recusada":
      return "border-red-200 bg-red-50 text-red-700"
    case "Pendente de indicação":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

function getStatusIcon(status: IndicationStatus) {
  switch (status) {
    case "Indicação aprovada":
      return <CheckCircle2 size={14} />
    case "Aguardando validação":
      return <ClipboardList size={14} />
    case "Discente indicado":
      return <UserCheck size={14} />
    case "Indicação recusada":
      return <XCircle size={14} />
    case "Pendente de indicação":
    default:
      return <AlertCircle size={14} />
  }
}

function getModalityClass(modality: Modality) {
  switch (modality) {
    case "Bolsista":
      return "border-primary/20 bg-primary/5 text-primary"
    case "Voluntário":
      return "border-sky-200 bg-sky-50 text-sky-700"
    case "Bolsista ou Voluntário":
    default:
      return "border-violet-200 bg-violet-50 text-violet-700"
  }
}

export default function CoordinatorIndications() {
  const [plans, setPlans] = useState<IndicationPlan[]>(initialPlans)

  const [search, setSearch] = useState("")
  const [selectedEdital, setSelectedEdital] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState<IndicationStatus | "Todos">("Todos")
  const [selectedModality, setSelectedModality] = useState<Modality | "Todos">("Todos")
  const [selectedYear, setSelectedYear] = useState("Todos")

  const [activePlanId, setActivePlanId] = useState<number | null>(null)
  const [studentName, setStudentName] = useState("")
  const [studentRegistration, setStudentRegistration] = useState("")
  const [selectedIndicationType, setSelectedIndicationType] = useState<"Bolsista" | "Voluntário">("Bolsista")
  const [bankName, setBankName] = useState("")
  const [bankAgency, setBankAgency] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [lastAction, setLastAction] = useState<"saved" | "removed" | "invalid" | null>(null)

  const filteredPlans = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return plans.filter((plan) => {
      const matchesSearch =
        !normalizedSearch ||
        plan.planTitle.toLowerCase().includes(normalizedSearch) ||
        plan.projectTitle.toLowerCase().includes(normalizedSearch) ||
        plan.area.toLowerCase().includes(normalizedSearch) ||
        plan.edital.toLowerCase().includes(normalizedSearch) ||
        plan.indicatedStudent?.name.toLowerCase().includes(normalizedSearch) ||
        plan.indicatedStudent?.registration.toLowerCase().includes(normalizedSearch) ||
        plan.bankData?.bankName.toLowerCase().includes(normalizedSearch) ||
        plan.bankData?.agency.toLowerCase().includes(normalizedSearch) ||
        plan.bankData?.account.toLowerCase().includes(normalizedSearch)

      const matchesEdital = selectedEdital === "Todos" || plan.edital === selectedEdital
      const matchesStatus = selectedStatus === "Todos" || plan.status === selectedStatus
      const matchesModality = selectedModality === "Todos" || plan.modality === selectedModality
      const matchesYear = selectedYear === "Todos" || plan.ano === selectedYear

      return matchesSearch && matchesEdital && matchesStatus && matchesModality && matchesYear
    })
  }, [plans, search, selectedEdital, selectedStatus, selectedModality, selectedYear])

  const summary = useMemo(() => {
    const totalPlans = plans.length
    const pending = plans.filter((plan) => plan.status === "Pendente de indicação").length
    const indicated = plans.filter(
      (plan) =>
        plan.status === "Discente indicado" ||
        plan.status === "Aguardando validação" ||
        plan.status === "Indicação aprovada"
    ).length
    const approved = plans.filter((plan) => plan.status === "Indicação aprovada").length
    const refused = plans.filter((plan) => plan.status === "Indicação recusada").length
    const totalVacancies = plans.reduce((acc, plan) => acc + plan.vacancies, 0)

    return {
      totalPlans,
      pending,
      indicated,
      approved,
      refused,
      totalVacancies,
    }
  }, [plans])

  const activePlan = useMemo(() => {
    return plans.find((plan) => plan.id === activePlanId) ?? null
  }, [plans, activePlanId])

  function clearFilters() {
    setSearch("")
    setSelectedEdital("Todos")
    setSelectedStatus("Todos")
    setSelectedModality("Todos")
    setSelectedYear("Todos")
  }

  function openIndicationForm(plan: IndicationPlan) {
    setActivePlanId(plan.id)
    setStudentName(plan.indicatedStudent?.name ?? "")
    setStudentRegistration(plan.indicatedStudent?.registration ?? "")
    setSelectedIndicationType(plan.indicationType ?? (plan.modality === "Voluntário" ? "Voluntário" : "Bolsista"))
    setBankName(plan.bankData?.bankName ?? "")
    setBankAgency(plan.bankData?.agency ?? "")
    setBankAccount(plan.bankData?.account ?? "")
    setLastAction(null)
  }

  function closeIndicationForm() {
    setActivePlanId(null)
    setStudentName("")
    setStudentRegistration("")
    setSelectedIndicationType("Bolsista")
    setBankName("")
    setBankAgency("")
    setBankAccount("")
  }

  function saveIndication() {
    const hasRequiredFields =
      activePlan &&
      studentName.trim().length > 0 &&
      studentRegistration.trim().length > 0 &&
      bankName.trim().length > 0 &&
      bankAgency.trim().length > 0 &&
      bankAccount.trim().length > 0

    if (!hasRequiredFields || !activePlan) {
      setLastAction("invalid")
      return
    }

    const existingStudent = students.find(
      (student) =>
        student.registration === studentRegistration.trim() ||
        student.name.toLowerCase() === studentName.trim().toLowerCase()
    )

    const selectedStudent: Student = existingStudent
      ? {
          ...existingStudent,
          name: studentName.trim(),
          registration: studentRegistration.trim(),
        }
      : {
          id: Date.now(),
          name: studentName.trim(),
          registration: studentRegistration.trim(),
          course: "Não informado",
          semester: "Não informado",
          cra: "Não informado",
          email: "Não informado",
        }

    setPlans((current) =>
      current.map((plan) =>
        plan.id === activePlan.id
          ? {
              ...plan,
              indicatedStudent: selectedStudent,
              indicationType: selectedIndicationType,
              bankData: {
                bankName: bankName.trim(),
                agency: bankAgency.trim(),
                account: bankAccount.trim(),
              },
              status:
                plan.status === "Indicação aprovada"
                  ? "Indicação aprovada"
                  : "Discente indicado",
            }
          : plan
      )
    )

    setLastAction("saved")
    closeIndicationForm()
  }

  function removeIndication(planId: number) {
    setPlans((current) =>
      current.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              indicatedStudent: null,
              indicationType: null,
              bankData: null,
              status: "Pendente de indicação",
            }
          : plan
      )
    )

    setLastAction("removed")

    if (activePlanId === planId) {
      closeIndicationForm()
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* HEADER */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <UserPlus size={14} />
              Indicação de discentes
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Indicação de discentes aos planos aprovados
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Selecione os planos de trabalho aprovados, indique os discentes responsáveis e acompanhe a validação das
              indicações no edital correspondente.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Planos filtrados
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              {filteredPlans.length}
            </p>

            <p className="mt-1 text-xs text-neutral">
              de {plans.length} plano(s) aprovados
            </p>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Planos aprovados
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.totalPlans}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Notebook size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Disponíveis para indicação
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Pendentes
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.pending}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <AlertCircle size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Aguardando indicação
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Indicados
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.indicated}/{summary.totalVacancies}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Users size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              Indicações registradas
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Validadas
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {summary.approved}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral">
              {summary.refused} indicação(ões) recusada(s)
            </p>
          </div>
        </section>

        {/* ALERTAS */}
        {lastAction === "saved" && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="flex gap-3">
              <CheckCircle2 size={18} className="mt-0.5 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Indicação registrada no protótipo
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  Em uma versão integrada, a indicação e os dados bancários seriam salvos e encaminhados para validação.
                </p>
              </div>
            </div>
          </section>
        )}

        {lastAction === "removed" && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
            <div className="flex gap-3">
              <Info size={18} className="mt-0.5 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Indicação removida no protótipo
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-700">
                  O plano voltou para o estado de pendente de indicação.
                </p>
              </div>
            </div>
          </section>
        )}

        {lastAction === "invalid" && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex gap-3">
              <AlertCircle size={18} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Existem campos obrigatórios pendentes
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-700">
                  Informe o nome, a matrícula do discente e os dados bancários antes de confirmar.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FILTROS */}
        <section className="rounded-2xl border border-neutral/30 bg-white p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Filter size={16} />
                Busca e filtros
              </div>

              <p className="mt-1 text-xs text-neutral">
                Localize planos aprovados por edital, projeto, situação, modalidade, ano ou discente indicado.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className={labelClassName}>
                Buscar indicação
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Plano, projeto, área, matrícula ou discente..."
                  className="w-full rounded-xl border border-neutral/30 bg-white py-2.5 pl-10 pr-3 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className={labelClassName}>
                Edital
              </label>

              <select
                value={selectedEdital}
                onChange={(event) => setSelectedEdital(event.target.value)}
                className={inputClassName}
              >
                {editalOptions.map((edital) => (
                  <option key={edital} value={edital}>
                    {edital}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                Situação
              </label>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as IndicationStatus | "Todos")}
                className={inputClassName}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                Modalidade
              </label>

              <select
                value={selectedModality}
                onChange={(event) => setSelectedModality(event.target.value as Modality | "Todos")}
                className={inputClassName}
              >
                {modalityOptions.map((modality) => (
                  <option key={modality} value={modality}>
                    {modality}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div>
              <label className={labelClassName}>
                Ano
              </label>

              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className={inputClassName}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end lg:col-span-4">
              <div className="w-full rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
                <strong className="font-semibold text-primary">
                  {filteredPlans.length}
                </strong>{" "}
                plano(s) encontrado(s) conforme os filtros aplicados.
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          {/* LISTAGEM */}
          <div className="space-y-5">
            <section className="rounded-2xl border border-neutral/30 bg-white">
              <div className="flex flex-col gap-3 border-b border-neutral/20 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-primary">
                    Planos aprovados para indicação
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Indique discentes aos planos de trabalho aprovados nos editais.
                  </p>
                </div>

                <Link
                  to="/coordenador/projetos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  Ver projetos
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {filteredPlans.length > 0 ? (
                <div className="divide-y divide-neutral/10">
                  {filteredPlans.map((plan) => (
                    <article key={plan.id} className="p-6 transition hover:bg-neutral/5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                              <Notebook size={14} />
                              Plano aprovado
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                plan.status
                              )}`}
                            >
                              {getStatusIcon(plan.status)}
                              {plan.status}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getModalityClass(
                                plan.modality
                              )}`}
                            >
                              {plan.modality}
                            </span>
                          </div>

                          <h3 className="mt-3 text-base font-semibold leading-6 text-primary">
                            {plan.planTitle}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-neutral">
                            Projeto vinculado:{" "}
                            <span className="font-medium text-primary">
                              {plan.projectTitle}
                            </span>
                          </p>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                            <MiniInfo label="Edital" value={`${plan.edital} • ${plan.ano}`} />
                            <MiniInfo label="Área" value={plan.area} />
                            <MiniInfo label="Carga semanal" value={`${plan.workload}h`} />
                          </div>

                          <div className="mt-4 rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                            <p className="text-sm font-semibold text-primary">
                              Discente indicado
                            </p>

                            {plan.indicatedStudent ? (
                              <div className="mt-3 rounded-xl border border-neutral/20 bg-white p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div className="w-full">
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                      <MiniInfo label="Nome" value={plan.indicatedStudent.name} />
                                      <MiniInfo label="Matrícula" value={plan.indicatedStudent.registration} />
                                    </div>

                                    <p className="mt-3 text-xs leading-5 text-neutral">
                                      {plan.indicatedStudent.course} • {plan.indicatedStudent.semester} • CRA{" "}
                                      {plan.indicatedStudent.cra}
                                    </p>
                                  </div>

                                  {plan.indicationType && (
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                                      <UserCheck size={14} />
                                      {plan.indicationType}
                                    </span>
                                  )}
                                </div>

                                {plan.bankData && (
                                  <div className="mt-4 rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                                    <p className="text-sm font-semibold text-primary">
                                      Dados bancários
                                    </p>

                                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                                      <MiniInfo label="Banco" value={plan.bankData.bankName} />
                                      <MiniInfo label="Agência" value={plan.bankData.agency} />
                                      <MiniInfo label="Conta" value={plan.bankData.account} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm leading-6 text-neutral">
                                Nenhum discente indicado para este plano até o momento.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                          <Link
                            to={`/coordenador/projetos/${plan.projectId}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                          >
                            <Eye size={16} />
                            Ver projeto
                          </Link>

                          <button
                            type="button"
                            onClick={() => openIndicationForm(plan)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                          >
                            <UserPlus size={16} />
                            {plan.indicatedStudent ? "Alterar indicação" : "Indicar discente"}
                          </button>

                          {plan.indicatedStudent && plan.status !== "Indicação aprovada" && (
                            <button
                              type="button"
                              onClick={() => removeIndication(plan.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-red-200 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral/10 text-neutral">
                    <Search size={24} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-primary">
                    Nenhum plano encontrado
                  </h3>

                  <p className="mt-1 max-w-md text-sm leading-6 text-neutral">
                    Não encontramos planos aprovados com os filtros selecionados. Tente limpar os filtros ou alterar os
                    critérios de busca.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center justify-center rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* FORMULÁRIO LATERAL */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-neutral/30 bg-white p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserPlus size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-primary">
                    {activePlan ? "Registrar indicação" : "Selecione um plano"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-neutral">
                    {activePlan
                      ? "Informe o discente, o tipo de indicação e os dados bancários."
                      : "Clique em “Indicar discente” em um plano aprovado para abrir o formulário."}
                  </p>
                </div>
              </div>

              {activePlan ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                      Plano selecionado
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6 text-primary">
                      {activePlan.planTitle}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral">
                      {activePlan.edital} • {activePlan.modality}
                    </p>
                  </div>

                  <div>
                    <label className={labelClassName}>
                      Nome do discente <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={studentName}
                      onChange={(event) => setStudentName(event.target.value)}
                      placeholder="Informe o nome completo do discente"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>
                      Matrícula do discente <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={studentRegistration}
                      onChange={(event) => setStudentRegistration(event.target.value)}
                      placeholder="Informe a matrícula"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>
                      Tipo de indicação
                    </label>

                    <select
                      value={selectedIndicationType}
                      onChange={(event) =>
                        setSelectedIndicationType(event.target.value as "Bolsista" | "Voluntário")
                      }
                      className={inputClassName}
                    >
                      <option value="Bolsista" disabled={activePlan.modality === "Voluntário"}>
                        Bolsista
                      </option>
                      <option value="Voluntário" disabled={activePlan.modality === "Bolsista"}>
                        Voluntário
                      </option>
                    </select>
                  </div>

                  {(studentName || studentRegistration) && (
                    <SelectedStudentCard
                      name={studentName}
                      registration={studentRegistration}
                    />
                  )}

                  <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                    <p className="text-sm font-semibold text-primary">
                      Dados bancários
                    </p>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label className={labelClassName}>
                          Nome do banco <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          value={bankName}
                          onChange={(event) => setBankName(event.target.value)}
                          placeholder="Ex.: Banco do Brasil"
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className={labelClassName}>
                          Agência <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          value={bankAgency}
                          onChange={(event) => setBankAgency(event.target.value)}
                          placeholder="Ex.: 1234-5"
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className={labelClassName}>
                          Conta <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          value={bankAccount}
                          onChange={(event) => setBankAccount(event.target.value)}
                          placeholder="Ex.: 98765-4"
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={saveIndication}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                    >
                      <UserCheck size={16} />
                      Confirmar indicação
                    </button>

                    <button
                      type="button"
                      onClick={closeIndicationForm}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
                  <p className="text-sm leading-6 text-neutral">
                    A indicação só deve ser realizada para planos de trabalho aprovados. Selecione um plano para
                    preencher os dados do discente e os dados bancários.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-white p-3">
      <p className="text-xs font-medium text-neutral">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-5 text-primary">
        {value}
      </p>
    </div>
  )
}

function SelectedStudentCard({
  name,
  registration,
}: {
  name: string
  registration: string
}) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-neutral/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRound size={18} />
        </div>

        <div className="w-full">
          <p className="text-sm font-semibold text-primary">
            Dados do discente
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3">
            <MiniInfo label="Nome" value={name || "Não informado"} />
            <MiniInfo label="Matrícula" value={registration || "Não informado"} />
          </div>
        </div>
      </div>
    </div>
  )
}