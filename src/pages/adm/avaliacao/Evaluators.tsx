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
  BookOpen,
  ChevronDown,
  RefreshCcw,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number; statusLabel: string }

type Area = { id: string; label: string; source: "CNPq" | "CNAE" }

type EvaluatorRole = "INTERNO" | "EXTERNO" | "VOLUNTARIO" | "PROPESQ"

type Evaluator = {
  id: string
  name: string
  email: string
  type: "INTERNO" | "EXTERNO"
  roles: EvaluatorRole[] // <- para checkbox (interno/externo/voluntario/propesq)
  areas: Area[]
  active: boolean
}

type Project = {
  id: string // codigo
  title: string
  proponent: string
  members: string[] // nomes (placeholder)
  areaHint: string
}

type Assignment = {
  id: string
  callId: string
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

function ToggleBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="text-neutral">{label}</span>
    </label>
  )
}

export default function Evaluators() {
  // ===== Mock: editais =====
  const [calls] = useState<Call[]>([
    { id: "c1", title: "PIBIC - Pesquisa", baseYear: 2025, statusLabel: "Em configuração" },
    { id: "c2", title: "PROBEX - Extensão", baseYear: 2024, statusLabel: "Encerrado" },
  ])
  const [selectedCallId, setSelectedCallId] = useState<string>(calls[0]?.id ?? "")

  // ===== Mock: áreas =====
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
      roles: ["INTERNO", "PROPESQ"],
      areas: [availableAreas[0], availableAreas[2]],
      active: true,
    },
    {
      id: "e2",
      name: "Prof. Bruno Lima",
      email: "bruno.lima@externo.org",
      type: "EXTERNO",
      roles: ["EXTERNO"],
      areas: [availableAreas[1]],
      active: true,
    },
    {
      id: "e3",
      name: "Profa. Carla Mendes",
      email: "carla.mendes@ufpb.br",
      type: "INTERNO",
      roles: ["INTERNO", "VOLUNTARIO"],
      areas: [availableAreas[4]],
      active: false,
    },
  ])

  // ===== Projetos =====
  const [projects] = useState<Project[]>([
    {
      id: "P001",
      title: "Detecção de presença com TinyML",
      proponent: "Profa. Ana Souza",
      members: ["Discente João", "Discente Maria"],
      areaHint: "CNPq: Inteligência Artificial",
    },
    {
      id: "P002",
      title: "Otimização de energia em datacenters",
      proponent: "Prof. Diego Ramos",
      members: ["Profa. Carla Mendes", "Discente Luiza"],
      areaHint: "CNPq: Ciência de Dados",
    },
    {
      id: "P003",
      title: "Ambientes virtuais para ensino médio",
      proponent: "Profa. Elisa Nunes",
      members: ["Discente Pedro"],
      areaHint: "CNAE: Educação",
    },
  ])

  // ===== Distribuições =====
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "a1", callId: "c1", projectId: "P002", evaluatorId: "e2", blind: true, status: "PENDING", dueAt: "" },
    { id: "a2", callId: "c1", projectId: "P003", evaluatorId: "e1", blind: true, status: "SUBMITTED", dueAt: "" },
  ])

  // ===== Distribuir automaticamente =====
  const [autoRole, setAutoRole] = useState<Record<EvaluatorRole, boolean>>({
    INTERNO: true,
    EXTERNO: true,
    VOLUNTARIO: false,
    PROPESQ: false,
  })
  const [autoFilterProjects, setAutoFilterProjects] = useState("")
  const [autoBlind, setAutoBlind] = useState(true)
  const [autoDueAt, setAutoDueAt] = useState("")

  // ===== Consultoria especial =====
  const [specialStart, setSpecialStart] = useState("")
  const [specialEnd, setSpecialEnd] = useState("")

  // ===== Distribuir manualmente =====
  const [manualConsultorQ, setManualConsultorQ] = useState("")
  const [manualScope, setManualScope] = useState<"ALL" | "ONLY_INTERNAL" | "ONLY_EXTERNAL">("ALL")
  const [manualEvaluatorId, setManualEvaluatorId] = useState<string>(evaluators[0]?.id ?? "")
  const [manualProjectCodes, setManualProjectCodes] = useState<string>("P001\nP002")
  const [manualBlind, setManualBlind] = useState(true)
  const [manualDueAt, setManualDueAt] = useState("")

  // ===== Notificar pendências =====
  const [notifyRole, setNotifyRole] = useState<Record<EvaluatorRole, boolean>>({
    INTERNO: true,
    EXTERNO: true,
    VOLUNTARIO: true,
    PROPESQ: true,
  })
  const [mailSubject, setMailSubject] = useState("Pendências de avaliação — {edital}")
  const [mailBody, setMailBody] = useState(
    `Prezado(a) {consultor},

Solicitamos sua atenção para as pendências de avaliação no edital {edital}.

Projetos pendentes:
{projetos}

Acesso ao sistema: {acesso}
Senha: {senha}

Atenciosamente,
PROPESQ`
  )

  // ===== Helpers =====
  const getEvaluator = (id: string) => evaluators.find((e) => e.id === id) ?? null
  const getProject = (id: string) => projects.find((p) => p.id === id) ?? null
  const selectedCall = calls.find((c) => c.id === selectedCallId) ?? null

  const eligibleEvaluatorsByAuto = useMemo(() => {
    const enabledRoles = (Object.keys(autoRole) as EvaluatorRole[]).filter((r) => autoRole[r])
    return evaluators.filter((e) => e.active && e.roles.some((r) => enabledRoles.includes(r)))
  }, [evaluators, autoRole])

  const autoProjectsFiltered = useMemo(() => {
    const q = autoFilterProjects.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => {
      return (
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.proponent.toLowerCase().includes(q) ||
        p.areaHint.toLowerCase().includes(q)
      )
    })
  }, [projects, autoFilterProjects])

  const conflict = (projectId: string, evaluatorId: string) => {
    const proj = getProject(projectId)
    const ev = getEvaluator(evaluatorId)
    if (!proj || !ev) return true
    if (proj.proponent.trim().toLowerCase() === ev.name.trim().toLowerCase()) return true
    if (containsName(proj.members, ev.name)) return true
    return false
  }

  const pendingAssignments = useMemo(
    () => assignments.filter((a) => a.callId === selectedCallId && a.status === "PENDING"),
    [assignments, selectedCallId]
  )

  // ===== Ações =====
  function distributeAutomatically() {
    if (!selectedCallId) return
    if (eligibleEvaluatorsByAuto.length === 0) {
      alert("Nenhum consultor/avaliador elegível com os filtros selecionados.")
      return
    }

    // Exemplo: 1 avaliador por projeto (random), ignorando duplicidade por simplicidade
    const news: Assignment[] = []

    autoProjectsFiltered.forEach((p) => {
      // não duplicar se já existe distribuição desse projeto nesse edital
      const already = assignments.some((a) => a.callId === selectedCallId && a.projectId === p.id)
      if (already) return

      const candidates = eligibleEvaluatorsByAuto.filter((e) => !conflict(p.id, e.id))
      if (candidates.length === 0) return

      const pick = candidates[Math.floor(Math.random() * candidates.length)]
      news.push({
        id: uid("as"),
        callId: selectedCallId,
        projectId: p.id,
        evaluatorId: pick.id,
        blind: autoBlind,
        status: "PENDING",
        dueAt: autoDueAt,
        lastReminderAt: "",
      })
    })

    if (news.length === 0) {
      alert("Nada para distribuir (ou todos os projetos já possuem distribuição/conflito).")
      return
    }

    setAssignments((prev) => [...prev, ...news])
    alert(`Distribuição automática concluída: ${news.length} atribuições criadas.`)
  }

  function notifySpecialConsultancy() {
    // Placeholder: aqui você ligaria no backend/rotina do SIGAA para "consultoria especial"
    alert(
      `Consultoria especial (externos) registrada.\nEdital: ${selectedCall?.title ?? "—"}\nPeríodo: ${specialStart || "—"} até ${
        specialEnd || "—"
      }\nNotificação: placeholder.`
    )
  }

  function distributeManuallyByCodes() {
    if (!selectedCallId) return
    const ev = getEvaluator(manualEvaluatorId)
    if (!ev || !ev.active) {
      alert("Selecione um consultor/avaliador ativo.")
      return
    }

    const codes = manualProjectCodes
      .split(/\r?\n|,/g)
      .map((x) => x.trim())
      .filter(Boolean)

    if (codes.length === 0) {
      alert("Informe ao menos um código de projeto.")
      return
    }

    const created: Assignment[] = []

    for (const code of codes) {
      const proj = getProject(code)
      if (!proj) continue

      if (conflict(proj.id, ev.id)) continue

      const exists = assignments.some(
        (a) => a.callId === selectedCallId && a.projectId === proj.id && a.evaluatorId === ev.id
      )
      if (exists) continue

      created.push({
        id: uid("as"),
        callId: selectedCallId,
        projectId: proj.id,
        evaluatorId: ev.id,
        blind: manualBlind,
        status: "PENDING",
        dueAt: manualDueAt,
        lastReminderAt: "",
      })
    }

    if (created.length === 0) {
      alert("Nenhuma atribuição criada (códigos inválidos, duplicados ou conflito de interesse).")
      return
    }

    setAssignments((prev) => [...prev, ...created])
    alert(`Distribuição manual concluída: ${created.length} atribuições criadas.`)
  }

  function sendPendingNotifications() {
    const enabledRoles = (Object.keys(notifyRole) as EvaluatorRole[]).filter((r) => notifyRole[r])

    // consultores com pendência no edital selecionado, respeitando grupo
    const evaluatorIds = new Set(
      pendingAssignments
        .map((a) => a.evaluatorId)
        .filter((eid) => {
          const e = getEvaluator(eid)
          return !!e && e.active && e.roles.some((r) => enabledRoles.includes(r))
        })
    )

    if (evaluatorIds.size === 0) {
      alert("Nenhum consultor encontrado com pendências para os filtros selecionados.")
      return
    }

    // Placeholder: aqui enviaria e-mails em lote
    alert(`Notificações enviadas (placeholder) para ${evaluatorIds.size} consultor(es).`)
  }

  // ===== Filtros p/ manual =====
  const manualEligibleEvaluators = useMemo(() => {
    const q = manualConsultorQ.trim().toLowerCase()

    return evaluators
      .filter((e) => {
        if (manualScope === "ONLY_INTERNAL" && e.type !== "INTERNO") return false
        if (manualScope === "ONLY_EXTERNAL" && e.type !== "EXTERNO") return false
        if (!q) return true
        return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      })
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name))
  }, [evaluators, manualConsultorQ, manualScope])

  // ===== Prévia de notificação =====
  const notifyPreview = useMemo(() => {
    const enabledRoles = (Object.keys(notifyRole) as EvaluatorRole[]).filter((r) => notifyRole[r])
    const map = new Map<string, { evaluator: Evaluator; projects: Project[] }>()

    pendingAssignments.forEach((a) => {
      const e = getEvaluator(a.evaluatorId)
      const p = getProject(a.projectId)
      if (!e || !p) return
      if (!e.active) return
      if (!e.roles.some((r) => enabledRoles.includes(r))) return

      if (!map.has(e.id)) map.set(e.id, { evaluator: e, projects: [] })
      map.get(e.id)!.projects.push(p)
    })

    return Array.from(map.values()).sort((x, y) => x.evaluator.name.localeCompare(y.evaluator.name))
  }, [pendingAssignments, notifyRole, evaluators])

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Distribuição de Avaliações</h1>
        <p className="text-sm text-neutral">
          Distribuição automática, consultoria especial, distribuição manual e notificação de pendências.
        </p>
      </header>

      {/* ===== Contexto do edital (vertical, como você pediu) ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">Edital em configuração</h2>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">Selecionar edital</span>
            <div className="relative">
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
              <select
                value={selectedCallId}
                onChange={(e) => setSelectedCallId(e.target.value)}
                className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                {calls
                  .slice()
                  .sort((a, b) => b.baseYear - a.baseYear)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} • {c.baseYear} • {c.statusLabel}
                    </option>
                  ))}
              </select>
            </div>
          </label>

          <div className="text-xs text-neutral flex items-start gap-2">
            <Info size={14} className="mt-0.5" />
            <p>
              As distribuições e notificações abaixo são aplicadas ao edital selecionado.
            </p>
          </div>
        </div>
      </section>

      {/* ===== DISTRIBUIR AUTOMATICAMENTE ===== */}
      <Section
        title="Distribuir automaticamente"
        icon={<RefreshCcw size={18} />}
        right={
          <button
            type="button"
            onClick={distributeAutomatically}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
          >
            <Send size={16} />
            Distribuir
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
              <Filter size={16} /> Filtros de consultores
            </p>

            <div className="flex flex-col gap-2">
              <ToggleBox
                checked={autoRole.INTERNO}
                onChange={() => setAutoRole((p) => ({ ...p, INTERNO: !p.INTERNO }))}
                label="Avaliador interno"
              />
              <ToggleBox
                checked={autoRole.EXTERNO}
                onChange={() => setAutoRole((p) => ({ ...p, EXTERNO: !p.EXTERNO }))}
                label="Avaliador externo"
              />
              <ToggleBox
                checked={autoRole.VOLUNTARIO}
                onChange={() => setAutoRole((p) => ({ ...p, VOLUNTARIO: !p.VOLUNTARIO }))}
                label="Voluntário"
              />
              <ToggleBox
                checked={autoRole.PROPESQ}
                onChange={() => setAutoRole((p) => ({ ...p, PROPESQ: !p.PROPESQ }))}
                label="PROPESQ"
              />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-light bg-white p-4 space-y-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Filtrar projetos</span>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  value={autoFilterProjects}
                  onChange={(e) => setAutoFilterProjects(e.target.value)}
                  className="w-full pl-9 border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Código, título, proponente ou área…"
                />
              </div>
            </label>

            <div className="flex flex-col gap-2">
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">Distribuição cega?</span>
                <select
                  value={autoBlind ? "YES" : "NO"}
                  onChange={(e) => setAutoBlind(e.target.value === "YES")}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="YES">Sim</option>
                  <option value="NO">Não</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">Prazo (opcional)</span>
                <input
                  type="date"
                  value={autoDueAt}
                  onChange={(e) => setAutoDueAt(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <div className="text-xs text-neutral flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5" />
              <p>
                Regra crítica: bloqueia conflito (avaliador = proponente ou membro).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-neutral">
                  <th className="py-2 pr-3">Código</th>
                  <th className="py-2 pr-3">Projeto</th>
                  <th className="py-2 pr-3">Área</th>
                </tr>
              </thead>
              <tbody>
                {autoProjectsFiltered.map((p) => (
                  <tr key={p.id} className="border-t border-neutral-light">
                    <td className="py-3 pr-3 font-semibold text-primary">{p.id}</td>
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-primary">{p.title}</p>
                      <p className="text-xs text-neutral">{p.proponent}</p>
                    </td>
                    <td className="py-3 pr-3">{chip(p.areaHint)}</td>
                  </tr>
                ))}
                {autoProjectsFiltered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-neutral">
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ===== CONSULTORIA ESPECIAL (EXTERNOS) ===== */}
      <Section
        title="Distribuir automaticamente para consultores especiais (avaliadores externos)"
        icon={<ShieldCheck size={18} />}
        right={
          <button
            type="button"
            onClick={notifySpecialConsultancy}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
          >
            <Mail size={16} />
            Gerenciar / Notificar
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
            <ClipboardList size={16} /> Gerenciar consultoria especial (avaliador externo)
            <br />
            <span className="text-red-500">EM DESENVOLVIMENTO</span>
          </p>


            <div className="flex flex-col gap-3">
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">Período da consultoria — início</span>
                <input
                  type="date"
                  value={specialStart}
                  onChange={(e) => setSpecialStart(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">Período da consultoria — fim</span>
                <input
                  type="date"
                  value={specialEnd}
                  onChange={(e) => setSpecialEnd(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            {/* Info
                 conectar o fluxo do SIGAA para consultoria externa (externos) e notificações.
              */}
          </div>

          <div className="rounded-xl border border-neutral-light bg-white p-4">
            <p className="text-xs text-neutral mb-2">Externos ativos</p>
            <div className="flex flex-wrap gap-2">
              {evaluators
                .filter((e) => e.active && e.type === "EXTERNO")
                .map((e) => chip(`${e.name} • ${e.email}`))}
              {evaluators.filter((e) => e.active && e.type === "EXTERNO").length === 0 && (
                <p className="text-sm text-neutral">Nenhum externo ativo.</p>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== DISTRIBUIR MANUALMENTE ===== */}
      <Section
        title="Distribuir manualmente"
        icon={<Users size={18} />}
        right={
          <button
            type="button"
            onClick={distributeManuallyByCodes}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
          >
            <Send size={16} />
            Distribuir
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 space-y-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Consultor (busca)</span>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  value={manualConsultorQ}
                  onChange={(e) => setManualConsultorQ(e.target.value)}
                  className="w-full pl-9 border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Nome ou e-mail…"
                />
              </div>
            </label>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral">Filtro (tipo)</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="manualScope"
                  checked={manualScope === "ALL"}
                  onChange={() => setManualScope("ALL")}
                />
                <span className="text-neutral">Todos</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="manualScope"
                  checked={manualScope === "ONLY_INTERNAL"}
                  onChange={() => setManualScope("ONLY_INTERNAL")}
                />
                <span className="text-neutral">Somente internos</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="manualScope"
                  checked={manualScope === "ONLY_EXTERNAL"}
                  onChange={() => setManualScope("ONLY_EXTERNAL")}
                />
                <span className="text-neutral">Somente externos</span>
              </label>
            </div>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Selecionar consultor</span>
              <select
                value={manualEvaluatorId}
                onChange={(e) => setManualEvaluatorId(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                {manualEligibleEvaluators.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} {e.active ? "" : "(inativo)"} • {e.type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-neutral-light bg-white p-4 space-y-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Lista de projetos a distribuir (código)</span>
              <textarea
                value={manualProjectCodes}
                onChange={(e) => setManualProjectCodes(e.target.value)}
                rows={4}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 font-mono text-xs"
                placeholder={`Ex:\nP001\nP002\nP010`}
              />
              <p className="text-[11px] text-neutral mt-1">
                Aceita códigos por linha ou separados por vírgula.
              </p>
            </label>

            <div className="flex flex-col gap-3">
              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">Cega?</span>
                <select
                  value={manualBlind ? "YES" : "NO"}
                  onChange={(e) => setManualBlind(e.target.value === "YES")}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="YES">Sim</option>
                  <option value="NO">Não</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-xs text-neutral mb-1">Prazo (opcional)</span>
                <input
                  type="date"
                  value={manualDueAt}
                  onChange={(e) => setManualDueAt(e.target.value)}
                  className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== NOTIFICAR CONSULTORES (pendências) ===== */}
      <Section
        title="Notificar consultores (que possuem avaliações pendentes)"
        icon={<Bell size={18} />}
        right={
          <button
            type="button"
            onClick={sendPendingNotifications}
            disabled={notifyPreview.length === 0}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
              ${notifyPreview.length === 0 ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
            `}
          >
            <Mail size={16} />
            Notificar
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
              <Filter size={16} /> Grupo de consultores
            </p>

            <div className="flex flex-col gap-2">
              <ToggleBox
                checked={notifyRole.EXTERNO}
                onChange={() => setNotifyRole((p) => ({ ...p, EXTERNO: !p.EXTERNO }))}
                label="Externo"
              />
              <ToggleBox
                checked={notifyRole.INTERNO}
                onChange={() => setNotifyRole((p) => ({ ...p, INTERNO: !p.INTERNO }))}
                label="Interno"
              />
              <ToggleBox
                checked={notifyRole.VOLUNTARIO}
                onChange={() => setNotifyRole((p) => ({ ...p, VOLUNTARIO: !p.VOLUNTARIO }))}
                label="Voluntário"
              />
              <ToggleBox
                checked={notifyRole.PROPESQ}
                onChange={() => setNotifyRole((p) => ({ ...p, PROPESQ: !p.PROPESQ }))}
                label="PROPESQ"
              />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-light bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
              <Mail size={16} /> Modelo de e-mail
            </p>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Assunto</span>
              <input
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Corpo</span>
              <textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                rows={9}
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
              <div className="mt-2 text-xs text-neutral">
                Placeholders: {chip("{consultor}")} {chip("{edital}")} {chip("{projetos}")} {chip("{acesso}")}{" "}
                {chip("{senha}")}
              </div>
            </label>
          </div>

          <div className="rounded-xl border border-neutral-light bg-white p-4">
            <p className="text-xs text-neutral mb-2">
              Prévia — consultores com pendências no edital selecionado ({notifyPreview.length})
            </p>

            <div className="space-y-3">
              {notifyPreview.map(({ evaluator, projects }) => (
                <div key={evaluator.id} className="rounded-lg border border-neutral-light p-3">
                  <p className="text-sm font-semibold text-primary">
                    {evaluator.name} <span className="text-xs text-neutral">({evaluator.email})</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {evaluator.roles.map((r) => chip(r))}
                  </div>
                  <div className="mt-3 text-xs text-neutral">
                    Pendências ({projects.length}):{" "}
                    <span className="font-mono">
                      {projects.map((p) => p.id).join(", ")}
                    </span>
                  </div>
                </div>
              ))}

              {notifyPreview.length === 0 && (
                <div className="py-6 text-center text-neutral">
                  Nenhum consultor com pendências para os filtros selecionados.
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-neutral">
              <AlertCircle size={14} className="mt-0.5" />
              <p>
                No backend, gere senha individual, personalize {`{projetos}`} e registre auditoria (quem/quando).
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
