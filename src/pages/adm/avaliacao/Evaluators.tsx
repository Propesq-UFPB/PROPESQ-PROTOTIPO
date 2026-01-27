import React, { useMemo, useState } from "react"
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Send,
  Bell,
  Mail,
  UserX,
  Check,
  AlertTriangle,
  AlertCircle,
  Info,
  ClipboardList,
  Filter,
  BadgeCheck,
  X,
} from "lucide-react"

type Area = { id: string; label: string; source: "CNPq" | "CNAE" }

type Evaluator = {
  id: string
  name: string
  email: string
  type: "INTERNO" | "EXTERNO"
  areas: Area[]
  active: boolean
}

type Project = {
  id: string
  title: string
  proponent: string
  members: string[] // nomes (placeholder)
  areaHint: string
}

type Assignment = {
  id: string
  projectId: string
  evaluatorId: string
  blind: boolean
  status: "PENDING" | "SUBMITTED"
  dueAt?: string
  lastReminderAt?: string
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function chip(text: string) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-light bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral">
      {text}
    </span>
  )
}

function containsName(list: string[], name: string) {
  const n = name.trim().toLowerCase()
  return list.some((x) => x.trim().toLowerCase() === n)
}

function Section({
  title,
  icon,
  children,
  right,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-neutral-light bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-col md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-neutral-light/60">{icon}</span>
          <h2 className="text-sm font-semibold text-primary">{title}</h2>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  )
}

export default function Evaluators() {
  // ===== Mock: áreas (CNPq/CNAE) =====
  const [availableAreas] = useState<Area[]>([
    { id: "cnpq_ai", label: "CNPq: Inteligência Artificial", source: "CNPq" },
    { id: "cnpq_cv", label: "CNPq: Visão Computacional", source: "CNPq" },
    { id: "cnpq_ds", label: "CNPq: Ciência de Dados", source: "CNPq" },
    { id: "cnae_it", label: "CNAE: Tecnologia da Informação", source: "CNAE" },
    { id: "cnae_ed", label: "CNAE: Educação", source: "CNAE" },
  ])

  // ===== Banco de avaliadores =====
  const [evaluators, setEvaluators] = useState<Evaluator[]>([
    {
      id: "e1",
      name: "Profa. Ana Souza",
      email: "ana.souza@ufpb.br",
      type: "INTERNO",
      areas: [availableAreas[0], availableAreas[2]],
      active: true,
    },
    {
      id: "e2",
      name: "Prof. Bruno Lima",
      email: "bruno.lima@externo.org",
      type: "EXTERNO",
      areas: [availableAreas[1]],
      active: true,
    },
    {
      id: "e3",
      name: "Profa. Carla Mendes",
      email: "carla.mendes@ufpb.br",
      type: "INTERNO",
      areas: [availableAreas[4]],
      active: false,
    },
  ])

  // ===== Projetos (placeholder para distribuição) =====
  const [projects] = useState<Project[]>([
    {
      id: "p1",
      title: "Detecção de presença com TinyML",
      proponent: "Profa. Ana Souza",
      members: ["Discente João", "Discente Maria"],
      areaHint: "CNPq: Inteligência Artificial",
    },
    {
      id: "p2",
      title: "Otimização de energia em datacenters",
      proponent: "Prof. Diego Ramos",
      members: ["Profa. Carla Mendes", "Discente Luiza"],
      areaHint: "CNPq: Ciência de Dados",
    },
    {
      id: "p3",
      title: "Ambientes virtuais para ensino médio",
      proponent: "Profa. Elisa Nunes",
      members: ["Discente Pedro"],
      areaHint: "CNAE: Educação",
    },
  ])

  // ===== Distribuição (ad-hoc) =====
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "a1", projectId: "p2", evaluatorId: "e2", blind: true, status: "PENDING", dueAt: "" },
    { id: "a2", projectId: "p3", evaluatorId: "e1", blind: true, status: "SUBMITTED", dueAt: "" },
  ])

  // ===== UI: filtros =====
  const [q, setQ] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ALL" | Evaluator["type"]>("ALL")
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")
  const [areaFilter, setAreaFilter] = useState<string>("ALL")

  // ===== UI: cadastro rápido (modal simples inline) =====
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newType, setNewType] = useState<Evaluator["type"]>("INTERNO")
  const [newAreas, setNewAreas] = useState<string[]>([])

  // ===== UI: distribuição ad-hoc =====
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? "")
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<string>(evaluators[0]?.id ?? "")
  const [blind, setBlind] = useState(true)
  const [dueAt, setDueAt] = useState<string>("")

  // ===== Derived =====
  const filteredEvaluators = useMemo(() => {
    const nq = q.trim().toLowerCase()
    return evaluators
      .filter((e) => {
        if (typeFilter !== "ALL" && e.type !== typeFilter) return false
        if (activeFilter === "ACTIVE" && !e.active) return false
        if (activeFilter === "INACTIVE" && e.active) return false
        if (areaFilter !== "ALL" && !e.areas.some((a) => a.id === areaFilter)) return false
        if (!nq) return true
        return (
          e.name.toLowerCase().includes(nq) ||
          e.email.toLowerCase().includes(nq) ||
          e.areas.some((a) => a.label.toLowerCase().includes(nq))
        )
      })
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name))
  }, [evaluators, q, typeFilter, activeFilter, areaFilter])

  const pendingAssignments = useMemo(() => assignments.filter((a) => a.status === "PENDING"), [assignments])

  const getEvaluator = (id: string) => evaluators.find((e) => e.id === id) ?? null
  const getProject = (id: string) => projects.find((p) => p.id === id) ?? null

  const conflictReason = useMemo(() => {
    const proj = getProject(selectedProjectId)
    const ev = getEvaluator(selectedEvaluatorId)
    if (!proj || !ev) return ""

    // Regra: não julgar projeto próprio ou onde seja membro
    if (proj.proponent.trim().toLowerCase() === ev.name.trim().toLowerCase()) return "Conflito: avaliador é o proponente do projeto."
    if (containsName(proj.members, ev.name)) return "Conflito: avaliador consta como membro do projeto."
    return ""
  }, [selectedProjectId, selectedEvaluatorId, evaluators])

  const canAssign = !conflictReason && !!selectedProjectId && !!selectedEvaluatorId && (getEvaluator(selectedEvaluatorId)?.active ?? false)

  // ===== Actions =====
  function toggleEvaluatorActive(id: string) {
    setEvaluators((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)))
  }

  function removeEvaluator(id: string) {
    // Em produção, bloquear se tiver distribuições ativas, etc.
    setEvaluators((prev) => prev.filter((e) => e.id !== id))
    setAssignments((prev) => prev.filter((a) => a.evaluatorId !== id))
  }

  function startCreate() {
    setCreating(true)
    setNewName("")
    setNewEmail("")
    setNewType("INTERNO")
    setNewAreas([])
  }

  function createEvaluator() {
    const name = newName.trim()
    const email = newEmail.trim().toLowerCase()
    if (!name || !email) return

    const areas = availableAreas.filter((a) => newAreas.includes(a.id))
    setEvaluators((prev) => [
      ...prev,
      { id: uid("ev"), name, email, type: newType, areas, active: true },
    ])
    setCreating(false)
  }

  function assignAdHoc() {
    if (!canAssign) return
    const proj = getProject(selectedProjectId)!
    const ev = getEvaluator(selectedEvaluatorId)!

    // evitar duplicidade simples (mesmo par projeto+avaliador)
    const exists = assignments.some((a) => a.projectId === proj.id && a.evaluatorId === ev.id)
    if (exists) {
      alert("Este avaliador já foi atribuído a este projeto.")
      return
    }

    setAssignments((prev) => [
      ...prev,
      { id: uid("as"), projectId: proj.id, evaluatorId: ev.id, blind, status: "PENDING", dueAt, lastReminderAt: "" },
    ])
  }

  function markSubmitted(assignmentId: string) {
    setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? { ...a, status: "SUBMITTED" } : a)))
  }

  function sendReminder(assignmentId: string) {
    // TODO: integrar e-mail via sistema
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, lastReminderAt: new Date().toISOString() } : a))
    )
    alert("Lembrete enviado (placeholder).")
  }

  function bulkReminder() {
    // TODO: enviar e-mail em lote
    setAssignments((prev) =>
      prev.map((a) => (a.status === "PENDING" ? { ...a, lastReminderAt: new Date().toISOString() } : a))
    )
    alert("Lembretes enviados (placeholder).")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Gestão de Avaliadores & Distribuição (Ad-Hoc)</h1>
        <p className="text-sm text-neutral">
          Distribua projetos de forma cega e monitore pendências de parecer.
        </p>
      </header>

      {/* ===== Banco de avaliadores =====
      <Section
        title="Banco de Avaliadores"
        icon={<Users size={18} />}
        right={
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
          >
            <Plus size={16} />
            Novo avaliador
          </button>
        }
      >
        {/* filtros *}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <label className="md:col-span-5 text-sm">
            <span className="block text-xs text-neutral mb-1">Buscar</span>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-9 border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Nome, e-mail ou área (CNPq/CNAE)"
              />
            </div>
          </label>

          <label className="md:col-span-3 text-sm">
            <span className="block text-xs text-neutral mb-1">Tipo</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Todos</option>
              <option value="INTERNO">Interno</option>
              <option value="EXTERNO">Externo</option>
            </select>
          </label>

          <label className="md:col-span-2 text-sm">
            <span className="block text-xs text-neutral mb-1">Status</span>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
            </select>
          </label>

          <label className="md:col-span-2 text-sm">
            <span className="block text-xs text-neutral mb-1">Área</span>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Todas</option>
              {availableAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* lista *}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral">
                <th className="py-2 pr-3">Avaliador</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Áreas (CNPq/CNAE)</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluators.map((e) => (
                <tr key={e.id} className="border-t border-neutral-light">
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-primary">{e.name}</p>
                    <p className="text-xs text-neutral">{e.email}</p>
                  </td>
                  <td className="py-3 pr-3">
                    {e.type === "INTERNO" ? chip("Interno") : chip("Externo")}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-2">
                      {e.areas.length ? e.areas.map((a) => chip(a.label)) : chip("Sem área")}
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${
                        e.active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-neutral-50 text-neutral border-neutral-light"
                      }`}
                    >
                      {e.active ? <Check size={14} /> : <X size={14} />}
                      {e.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => toggleEvaluatorActive(e.id)}
                        className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                      >
                        {e.active ? "Desativar" : "Ativar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEvaluator(e.id)}
                        className="p-2 rounded-lg hover:bg-red-50 border border-red-200 text-red-600"
                        aria-label="Remover"
                        title="Remover avaliador"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEvaluators.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral">
                    Nenhum avaliador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* modal inline *}
        {creating && (
          <div className="mt-5 rounded-xl border border-neutral-light bg-neutral-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
                <BadgeCheck size={16} /> Novo avaliador
              </p>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-white"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="text-sm md:col-span-1">
                <span className="block text-xs text-neutral mb-1">Nome</span>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex.: Profa. Joana Silva"
                />
              </label>

              <label className="text-sm md:col-span-1">
                <span className="block text-xs text-neutral mb-1">E-mail</span>
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="ex.: joana@ufpb.br"
                />
              </label>

              <label className="text-sm md:col-span-1">
                <span className="block text-xs text-neutral mb-1">Tipo</span>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="INTERNO">Interno</option>
                  <option value="EXTERNO">Externo</option>
                </select>
              </label>

              <label className="text-sm md:col-span-3">
                <span className="block text-xs text-neutral mb-1">Áreas de atuação (CNPq/CNAE)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableAreas.map((a) => {
                    const checked = newAreas.includes(a.id)
                    return (
                      <label key={a.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setNewAreas((prev) =>
                              checked ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                            )
                          }
                        />
                        <span className="text-neutral">{a.label}</span>
                      </label>
                    )
                  })}
                </div>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={createEvaluator}
                disabled={!newName.trim() || !newEmail.trim()}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${!newName.trim() || !newEmail.trim() ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
                `}
              >
                <Plus size={16} />
                Cadastrar
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 text-xs text-neutral">
          <Info size={14} className="mt-0.5" />
          <p>
            Recomendação: importar/validar áreas por tabela oficial (CNPq/CNAE) e manter auditoria de alterações.
          </p>
        </div>
      </Section> */}

      {/* ===== Distribuição cega (ad-hoc) ===== */}
      <Section
        title="Distribuição Cega (Ad-Hoc)"
        icon={<ShieldCheck size={18} />}
        right={
          <button
            type="button"
            onClick={assignAdHoc}
            disabled={!canAssign}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
              ${!canAssign ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
            `}
          >
            <Send size={16} />
            Atribuir
          </button>
        }
      >
        <p className="text-sm text-neutral mb-4">
          Distribua projetos para avaliadores. O sistema impede conflitos: o avaliador não pode julgar projeto próprio
          ou onde seja membro.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <label className="md:col-span-5 text-sm">
            <span className="block text-xs text-neutral mb-1">Projeto</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} • {p.areaHint}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-4 text-sm">
            <span className="block text-xs text-neutral mb-1">Avaliador</span>
            <select
              value={selectedEvaluatorId}
              onChange={(e) => setSelectedEvaluatorId(e.target.value)}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              {evaluators
                .slice()
                .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name))
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} {e.active ? "" : "(inativo)"} • {e.type}
                  </option>
                ))}
            </select>
          </label>

          <label className="md:col-span-2 text-sm">
            <span className="block text-xs text-neutral mb-1">Cega?</span>
            <select
              value={blind ? "YES" : "NO"}
              onChange={(e) => setBlind(e.target.value === "YES")}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="YES">Sim</option>
              <option value="NO">Não</option>
            </select>
          </label>

          <label className="md:col-span-1 text-sm">
            <span className="block text-xs text-neutral mb-1">Prazo</span>
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        {conflictReason && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-red-700" />
              <div>
                <p className="text-sm font-semibold text-red-900">Distribuição bloqueada</p>
                <p className="text-sm text-red-900/90 mt-1">{conflictReason}</p>
              </div>
            </div>
          </div>
        )}

        {!conflictReason && !(getEvaluator(selectedEvaluatorId)?.active ?? true) && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Avaliador inativo</p>
                <p className="text-sm text-amber-900/90 mt-1">
                  Ative o avaliador no banco para permitir atribuição.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Futuro: sugerir avaliadores por aderência de área (CNPq/CNAE), limitar carga por avaliador e registrar
            trilha de auditoria.
          </p>
        </div>
      </Section>

      {/* ===== Monitor de Pendências ===== */}
      <Section
        title="Monitor de Pendências"
        icon={<Bell size={18} />}
        right={
          <button
            type="button"
            onClick={bulkReminder}
            disabled={pendingAssignments.length === 0}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
              ${pendingAssignments.length === 0 ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
            `}
          >
            <Mail size={16} />
            Lembrar todos
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl border border-neutral-light bg-white p-5">
            <p className="text-xs text-neutral">Pendências</p>
            <p className="text-2xl font-bold text-primary mt-2">{pendingAssignments.length}</p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-white p-5">
            <p className="text-xs text-neutral">Pareceres enviados</p>
            <p className="text-2xl font-bold text-primary mt-2">
              {assignments.filter((a) => a.status === "SUBMITTED").length}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-light bg-white p-5">
            <p className="text-xs text-neutral">Distribuições totais</p>
            <p className="text-2xl font-bold text-primary mt-2">{assignments.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral">
                <th className="py-2 pr-3">Projeto</th>
                <th className="py-2 pr-3">Avaliador</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Prazo</th>
                <th className="py-2 pr-3">Último lembrete</th>
                <th className="py-2 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {assignments
                .slice()
                .sort((a, b) => (a.status === b.status ? 0 : a.status === "PENDING" ? -1 : 1))
                .map((a) => {
                  const p = getProject(a.projectId)
                  const e = getEvaluator(a.evaluatorId)
                  return (
                    <tr key={a.id} className="border-t border-neutral-light">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-primary">{p?.title ?? "—"}</p>
                        <p className="text-xs text-neutral">{p?.areaHint ?? ""}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-primary">{e?.name ?? "—"}</p>
                        <p className="text-xs text-neutral">{e?.email ?? ""}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${
                            a.status === "PENDING"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {a.status === "PENDING" ? <AlertTriangle size={14} /> : <Check size={14} />}
                          {a.status === "PENDING" ? "Pendente" : "Enviado"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-sm text-neutral">{a.dueAt || "—"}</td>
                      <td className="py-3 pr-3 text-sm text-neutral">
                        {a.lastReminderAt ? new Date(a.lastReminderAt).toLocaleString() : "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => sendReminder(a.id)}
                            disabled={a.status !== "PENDING"}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border
                              ${
                                a.status !== "PENDING"
                                  ? "border-neutral-light text-neutral/40 bg-neutral-50 cursor-not-allowed"
                                  : "border-neutral-light hover:bg-neutral-50 text-neutral"
                              }
                            `}
                          >
                            <Mail size={16} />
                            Lembrar
                          </button>

                          <button
                            type="button"
                            onClick={() => markSubmitted(a.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-green-200 bg-green-50 text-green-700 hover:opacity-95"
                          >
                            <Check size={16} />
                            Marcar enviado
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

              {assignments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral">
                    Nenhuma distribuição realizada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-neutral">
          <AlertCircle size={14} className="mt-0.5" />
          <p>
            Regra crítica: o sistema deve bloquear conflito de interesse (avaliador = proponente ou membro). Ideal:
            validar por ID (não por nome) e registrar auditoria (quem/quando/motivo) para lembretes.
          </p>
        </div>
      </Section>
    </div>
  )
}
