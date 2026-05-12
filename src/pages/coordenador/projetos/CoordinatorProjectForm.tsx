import { FormEvent, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  Info,
  Notebook,
  Plus,
  Save,
  Send,
  Trash2,
  UserRound,
} from "lucide-react"

type WorkPlanModality = "Bolsista" | "Voluntário" | "Bolsista ou Voluntário"

type WorkPlan = {
  id: number
  title: string
  modality: WorkPlanModality
  vacancies: string
  workload: string
  summary: string
  activities: string
  studentProfile: string
  expectedResults: string
}

type ProjectFormData = {
  edital: string
  title: string
  area: string
  subarea: string
  unidade: string
  linhaPesquisa: string
  startDate: string
  endDate: string
  keywords: string
  summary: string
  justification: string
  objectives: string
  methodology: string
  expectedResults: string
  schedule: string
  references: string
}

const editalOptions = [
  "Selecione o edital",
  "PIBIC 2026",
  "PIBITI 2026",
  "PIVIC 2026",
  "PIBIC 2025",
  "PIBITI 2025",
]

const areaOptions = [
  "Selecione a área",
  "Ciência da Computação",
  "Ciência de Dados",
  "Inteligência Artificial",
  "Engenharia de Software",
  "Processamento de Sinais",
  "Educação",
  "Linguística",
  "Saúde",
]

const unidadeOptions = [
  "Selecione a unidade",
  "CI",
  "CT",
  "CCEN",
  "CCHLA",
  "CE",
  "CCS",
]

const modalityOptions: WorkPlanModality[] = [
  "Bolsista",
  "Voluntário",
  "Bolsista ou Voluntário",
]

const initialProjectData: ProjectFormData = {
  edital: "Selecione o edital",
  title: "",
  area: "Selecione a área",
  subarea: "",
  unidade: "Selecione a unidade",
  linhaPesquisa: "",
  startDate: "",
  endDate: "",
  keywords: "",
  summary: "",
  justification: "",
  objectives: "",
  methodology: "",
  expectedResults: "",
  schedule: "",
  references: "",
}

const createEmptyWorkPlan = (id: number): WorkPlan => ({
  id,
  title: "",
  modality: "Bolsista ou Voluntário",
  vacancies: "1",
  workload: "20",
  summary: "",
  activities: "",
  studentProfile: "",
  expectedResults: "",
})

const inputClassName =
  "w-full rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const textareaClassName =
  "min-h-[120px] w-full resize-y rounded-xl border border-neutral/30 bg-white px-3 py-2.5 text-sm leading-6 text-primary outline-none transition placeholder:text-neutral/70 focus:border-primary focus:ring-2 focus:ring-primary/10"

const labelClassName = "mb-1.5 block text-sm font-medium text-primary"

export default function CoordinatorProjectForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialFocus = searchParams.get("tipo") === "plano" ? "planos" : "projeto"

  const [formData, setFormData] = useState<ProjectFormData>(initialProjectData)
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([createEmptyWorkPlan(1)])
  const [lastAction, setLastAction] = useState<"draft" | "submit" | null>(null)

  const totalVacancies = useMemo(() => {
    return workPlans.reduce((acc, plan) => {
      const value = Number(plan.vacancies)
      return acc + (Number.isNaN(value) ? 0 : value)
    }, 0)
  }, [workPlans])

  const filledRequiredFields = useMemo(() => {
    const requiredProjectFields = [
      formData.edital !== "Selecione o edital",
      formData.title.trim().length > 0,
      formData.area !== "Selecione a área",
      formData.unidade !== "Selecione a unidade",
      formData.summary.trim().length > 0,
      formData.objectives.trim().length > 0,
      formData.methodology.trim().length > 0,
    ]

    const hasValidWorkPlan = workPlans.some(
      (plan) =>
        plan.title.trim().length > 0 &&
        plan.summary.trim().length > 0 &&
        plan.activities.trim().length > 0
    )

    return {
      completed: requiredProjectFields.filter(Boolean).length + (hasValidWorkPlan ? 1 : 0),
      total: requiredProjectFields.length + 1,
      hasValidWorkPlan,
      isReadyToSubmit:
        requiredProjectFields.every(Boolean) && hasValidWorkPlan && workPlans.length > 0,
    }
  }, [formData, workPlans])

  function updateProjectField(field: keyof ProjectFormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateWorkPlan(id: number, field: keyof WorkPlan, value: string) {
    setWorkPlans((current) =>
      current.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              [field]: value,
            }
          : plan
      )
    )
  }

  function addWorkPlan() {
    setWorkPlans((current) => {
      const nextId = current.length > 0 ? Math.max(...current.map((plan) => plan.id)) + 1 : 1
      return [...current, createEmptyWorkPlan(nextId)]
    })
  }

  function removeWorkPlan(id: number) {
    setWorkPlans((current) => {
      if (current.length === 1) {
        return current
      }

      return current.filter((plan) => plan.id !== id)
    })
  }

  function handleSaveDraft() {
    setLastAction("draft")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLastAction("submit")

    if (!filledRequiredFields.isReadyToSubmit) {
      return
    }

    navigate("/coordenador/projetos")
  }

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
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FolderKanban size={14} />
              Cadastro de projeto
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary">
              Cadastrar projeto e plano de trabalho
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral">
              Preencha os dados do projeto de pesquisa e cadastre os planos de trabalho que serão vinculados ao
              edital selecionado. O projeto pode ser salvo como rascunho ou enviado para avaliação.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/30 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
              Progresso do cadastro
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold text-primary">
                {filledRequiredFields.completed}
              </span>
              <span className="pb-1 text-sm text-neutral">
                de {filledRequiredFields.total} etapas essenciais
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral/10">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${(filledRequiredFields.completed / filledRequiredFields.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* ALERTA DE AÇÃO */}
        {lastAction === "draft" && (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
            <div className="flex gap-3">
              <Info size={18} className="mt-0.5 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Rascunho salvo no protótipo
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Em uma versão integrada ao backend, esse botão salvaria o projeto sem encaminhá-lo para avaliação.
                </p>
              </div>
            </div>
          </section>
        )}

        {lastAction === "submit" && !filledRequiredFields.isReadyToSubmit && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex gap-3">
              <Info size={18} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Existem campos obrigatórios pendentes
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-700">
                  Preencha edital, título, área, unidade, resumo, objetivos, metodologia e pelo menos um plano de
                  trabalho válido antes de enviar para avaliação.
                </p>
              </div>
            </div>
          </section>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* RESUMO DO CADASTRO */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Projeto
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {formData.title.trim() ? "Em preenchimento" : "Não iniciado"}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-neutral">
                Dados gerais, área, resumo, objetivos e metodologia.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Planos vinculados
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {workPlans.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <Notebook size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-neutral">
                {totalVacancies} vaga(s) prevista(s) nos planos cadastrados.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                    Situação
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    Rascunho
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <ClipboardList size={20} />
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-neutral">
                O envio para avaliação só será liberado após preencher os dados essenciais.
              </p>
            </div>
          </section>

          {/* DADOS DO EDITAL */}
          <section
            id="projeto"
            className={`rounded-2xl border bg-white p-6 ${
              initialFocus === "projeto" ? "border-primary/30" : "border-neutral/30"
            }`}
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-primary">
                  Dados do edital e identificação
                </h2>
                <p className="mt-1 text-sm leading-6 text-neutral">
                  Informe o edital, a área de conhecimento e os dados básicos do projeto.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <label className={labelClassName}>
                  Edital <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.edital}
                  onChange={(event) => updateProjectField("edital", event.target.value)}
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
                  Área <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.area}
                  onChange={(event) => updateProjectField("area", event.target.value)}
                  className={inputClassName}
                >
                  {areaOptions.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>
                  Unidade <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.unidade}
                  onChange={(event) => updateProjectField("unidade", event.target.value)}
                  className={inputClassName}
                >
                  {unidadeOptions.map((unidade) => (
                    <option key={unidade} value={unidade}>
                      {unidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className={labelClassName}>
                  Título do projeto <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => updateProjectField("title", event.target.value)}
                  placeholder="Informe o título completo do projeto"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Subárea
                </label>

                <input
                  type="text"
                  value={formData.subarea}
                  onChange={(event) => updateProjectField("subarea", event.target.value)}
                  placeholder="Ex.: Aprendizado de Máquina"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Linha de pesquisa
                </label>

                <input
                  type="text"
                  value={formData.linhaPesquisa}
                  onChange={(event) => updateProjectField("linhaPesquisa", event.target.value)}
                  placeholder="Ex.: Sistemas inteligentes aplicados"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Palavras-chave
                </label>

                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(event) => updateProjectField("keywords", event.target.value)}
                  placeholder="Separe por vírgula"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Data de início
                </label>

                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(event) => updateProjectField("startDate", event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Data de término
                </label>

                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(event) => updateProjectField("endDate", event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="flex items-end">
                <div className="flex w-full items-center gap-2 rounded-xl border border-neutral/20 bg-neutral/5 px-4 py-3 text-sm text-neutral">
                  <CalendarDays size={16} />
                  Período usado para acompanhamento do cronograma.
                </div>
              </div>
            </div>
          </section>

          {/* DESCRIÇÃO DO PROJETO */}
          <section className="rounded-2xl border border-neutral/30 bg-white p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-primary">
                  Descrição do projeto
                </h2>
                <p className="mt-1 text-sm leading-6 text-neutral">
                  Detalhe a proposta do projeto para que ela possa ser avaliada posteriormente.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <label className={labelClassName}>
                  Resumo <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={formData.summary}
                  onChange={(event) => updateProjectField("summary", event.target.value)}
                  placeholder="Apresente uma visão geral do projeto, problema, proposta e relevância."
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Justificativa
                </label>

                <textarea
                  value={formData.justification}
                  onChange={(event) => updateProjectField("justification", event.target.value)}
                  placeholder="Explique a importância científica, tecnológica, social ou institucional da proposta."
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Objetivos <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={formData.objectives}
                  onChange={(event) => updateProjectField("objectives", event.target.value)}
                  placeholder="Informe o objetivo geral e os objetivos específicos."
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Metodologia <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={formData.methodology}
                  onChange={(event) => updateProjectField("methodology", event.target.value)}
                  placeholder="Descreva os procedimentos metodológicos, etapas, técnicas e materiais."
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Resultados esperados
                </label>

                <textarea
                  value={formData.expectedResults}
                  onChange={(event) => updateProjectField("expectedResults", event.target.value)}
                  placeholder="Descreva os resultados científicos, tecnológicos ou acadêmicos esperados."
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Cronograma
                </label>

                <textarea
                  value={formData.schedule}
                  onChange={(event) => updateProjectField("schedule", event.target.value)}
                  placeholder="Ex.: Mês 1-2 revisão bibliográfica; Mês 3-5 desenvolvimento; Mês 6 avaliação..."
                  className={textareaClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Referências
                </label>

                <textarea
                  value={formData.references}
                  onChange={(event) => updateProjectField("references", event.target.value)}
                  placeholder="Informe as principais referências utilizadas na elaboração do projeto."
                  className={textareaClassName}
                />
              </div>
            </div>
          </section>

          {/* PLANOS DE TRABALHO */}
          <section
            id="planos"
            className={`rounded-2xl border bg-white p-6 ${
              initialFocus === "planos" ? "border-primary/30" : "border-neutral/30"
            }`}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <Notebook size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-primary">
                    Planos de trabalho vinculados
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral">
                    Cadastre um ou mais planos que serão associados ao projeto. Cada plano poderá receber indicação de
                    discente depois da aprovação.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addWorkPlan}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <Plus size={16} />
                Adicionar plano
              </button>
            </div>

            <div className="space-y-5">
              {workPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-neutral/20 bg-neutral/5 p-5"
                >
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Plano de trabalho {index + 1}
                      </p>
                      <p className="mt-1 text-xs text-neutral">
                        Defina as atividades e o perfil esperado do discente.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeWorkPlan(plan.id)}
                      disabled={workPlans.length === 1}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-sm font-medium text-neutral transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      Remover
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-4">
                      <label className={labelClassName}>
                        Título do plano <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={plan.title}
                        onChange={(event) => updateWorkPlan(plan.id, "title", event.target.value)}
                        placeholder="Ex.: Desenvolvimento de módulo de análise de dados"
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Modalidade
                      </label>

                      <select
                        value={plan.modality}
                        onChange={(event) =>
                          updateWorkPlan(plan.id, "modality", event.target.value as WorkPlanModality)
                        }
                        className={inputClassName}
                      >
                        {modalityOptions.map((modality) => (
                          <option key={modality} value={modality}>
                            {modality}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Vagas
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={plan.vacancies}
                        onChange={(event) => updateWorkPlan(plan.id, "vacancies", event.target.value)}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Carga horária semanal
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={plan.workload}
                        onChange={(event) => updateWorkPlan(plan.id, "workload", event.target.value)}
                        className={inputClassName}
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="flex w-full items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-3 text-sm text-neutral">
                        <UserRound size={16} />
                        Indicação após aprovação
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className={labelClassName}>
                        Resumo do plano <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={plan.summary}
                        onChange={(event) => updateWorkPlan(plan.id, "summary", event.target.value)}
                        placeholder="Explique o foco do plano de trabalho."
                        className={textareaClassName}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className={labelClassName}>
                        Atividades previstas <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={plan.activities}
                        onChange={(event) => updateWorkPlan(plan.id, "activities", event.target.value)}
                        placeholder="Liste as principais atividades que serão executadas pelo discente."
                        className={textareaClassName}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className={labelClassName}>
                        Perfil esperado do discente
                      </label>

                      <textarea
                        value={plan.studentProfile}
                        onChange={(event) => updateWorkPlan(plan.id, "studentProfile", event.target.value)}
                        placeholder="Ex.: conhecimento básico em programação, interesse em pesquisa, disponibilidade..."
                        className={textareaClassName}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className={labelClassName}>
                        Resultados esperados do plano
                      </label>

                      <textarea
                        value={plan.expectedResults}
                        onChange={(event) => updateWorkPlan(plan.id, "expectedResults", event.target.value)}
                        placeholder="Informe entregas, produtos, relatórios, experimentos ou contribuições esperadas."
                        className={textareaClassName}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AÇÕES */}
          <section className="sticky bottom-0 z-10 -mx-6 border-t border-neutral/20 bg-[#F3F4F6]/95 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-neutral/30 bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Cadastro de projeto e planos
                </p>
                <p className="mt-1 text-xs text-neutral">
                  Salve como rascunho para continuar depois ou envie para avaliação quando estiver completo.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                >
                  <Save size={16} />
                  Salvar rascunho
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <Send size={16} />
                  Enviar para avaliação
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  )
}

function ChecklistItem({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-neutral/20 bg-neutral/5 text-neutral"
      }`}
    >
      <CheckCircle2
        size={16}
        className={checked ? "text-emerald-600" : "text-neutral/50"}
      />
      <span className="font-medium">{text}</span>
    </div>
  )
}