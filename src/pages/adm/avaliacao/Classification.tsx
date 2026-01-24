import React, { useMemo, useState } from "react"
import {
  GraduationCap,
  Settings,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  ChevronDown,
  Info,
  Save,
  AlertTriangle,
  Check,
  RotateCcw,
  Play,
  ClipboardList,
  Eye,
  ArrowDownUp,
  RefreshCcw,
  Mail,
  UserCheck,
} from "lucide-react"

type Call = { id: string; title: string; baseYear: number }

type ProjectRow = {
  id: string
  title: string
  proponent: string
  projectScore: number // nota do projeto (avaliação)
  ipiScore: number // índice de produtividade (já calculado em Pontuação & IPI)
  finalScore?: number // calculado
  status: "SUBMITTED" | "EVALUATED" | "RANKED" | "AWARDED"
  requestedReview?: boolean
  reviewsPending?: number
  notesCount?: number
}

type Appeal = {
  id: string
  projectId: string
  reason: string
  status: "OPEN" | "IN_REVIEW" | "RESOLVED"
  contestedScore?: number
  ignoreContestedInRanking: boolean
  newEvaluatorAssigned?: boolean
  createdAt: string
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

function toNumberOrNull(v: string) {
  const n = Number(String(v).replace(",", "."))
  return Number.isFinite(n) ? n : null
}

function clamp01(n: number) {
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export default function Classification() {
  // ===== Edital selecionado =====
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026 },
    { id: "call_2026_02", title: "Edital Inovação 02/2026", baseYear: 2026 },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025 },
  ])
  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")
  const selectedCall = useMemo(() => calls.find((c) => c.id === selectedCallId) ?? null, [calls, selectedCallId])

  // ===== Dados por edital (mock) =====
  const [projectsByCall, setProjectsByCall] = useState<Record<string, ProjectRow[]>>({
    call_2026_01: [
      {
        id: "p1",
        title: "Detecção de presença com TinyML",
        proponent: "Profa. Ana Souza",
        projectScore: 8.2,
        ipiScore: 72,
        status: "EVALUATED",
        requestedReview: true,
        reviewsPending: 1,
        notesCount: 3,
      },
      {
        id: "p2",
        title: "Otimização de energia em datacenters",
        proponent: "Prof. Diego Ramos",
        projectScore: 9.1,
        ipiScore: 55,
        status: "EVALUATED",
        requestedReview: false,
        reviewsPending: 0,
        notesCount: 2,
      },
      {
        id: "p3",
        title: "Ambientes virtuais para ensino médio",
        proponent: "Profa. Elisa Nunes",
        projectScore: 7.4,
        ipiScore: 68,
        status: "EVALUATED",
        requestedReview: false,
        reviewsPending: 0,
        notesCount: 1,
      },
    ],
    call_2026_02: [
      {
        id: "p4",
        title: "Detecção de fraudes em editais",
        proponent: "Prof. Bruno Lima",
        projectScore: 8.6,
        ipiScore: 61,
        status: "EVALUATED",
        requestedReview: false,
        reviewsPending: 0,
        notesCount: 0,
      },
    ],
    call_2025_03: [
      {
        id: "p5",
        title: "Robótica educacional em escolas públicas",
        proponent: "Profa. Carla Mendes",
        projectScore: 8.0,
        ipiScore: 49,
        status: "EVALUATED",
        requestedReview: false,
        reviewsPending: 0,
        notesCount: 1,
      },
    ],
  })

  const [appealsByCall, setAppealsByCall] = useState<Record<string, Appeal[]>>({
    call_2026_01: [
      {
        id: "ap1",
        projectId: "p1",
        reason: "Contestação de nota: divergência entre pareceres.",
        status: "OPEN",
        contestedScore: 8.2,
        ignoreContestedInRanking: false,
        newEvaluatorAssigned: false,
        createdAt: "2026-01-20T12:00:00Z",
      },
    ],
    call_2026_02: [],
    call_2025_03: [],
  })

  // ===== Config por edital =====
  const [autoCalcByCall, setAutoCalcByCall] = useState<Record<string, boolean>>({
    call_2026_01: true,
    call_2026_02: true,
    call_2025_03: false,
  })

  const [formulaByCall, setFormulaByCall] = useState<Record<string, { projectWeight: string; ipiWeight: string; expression: string }>>({
    call_2026_01: { projectWeight: "0.7", ipiWeight: "0.3", expression: "" },
    call_2026_02: { projectWeight: "0.6", ipiWeight: "0.4", expression: "" },
    call_2025_03: { projectWeight: "0.8", ipiWeight: "0.2", expression: "" },
  })

  const [quotaByCall, setQuotaByCall] = useState<Record<string, { order: "DESC" | "ASC"; limitPerResearcher: string; totalQuotas: string }>>({
    call_2026_01: { order: "DESC", limitPerResearcher: "1", totalQuotas: "2" },
    call_2026_02: { order: "DESC", limitPerResearcher: "1", totalQuotas: "1" },
    call_2025_03: { order: "DESC", limitPerResearcher: "1", totalQuotas: "1" },
  })

  const [dirty, setDirty] = useState(false)

  const autoCalc = autoCalcByCall[selectedCallId] ?? true
  const formula = formulaByCall[selectedCallId] ?? { projectWeight: "0.7", ipiWeight: "0.3", expression: "" }
  const quota = quotaByCall[selectedCallId] ?? { order: "DESC", limitPerResearcher: "1", totalQuotas: "0" }

  const projects = projectsByCall[selectedCallId] ?? []
  const appeals = appealsByCall[selectedCallId] ?? []

  // ===== Validações =====
  const formulaError = useMemo(() => {
    const pw = toNumberOrNull(formula.projectWeight)
    const iw = toNumberOrNull(formula.ipiWeight)
    if (pw === null || iw === null) return "Pesos devem ser números."
    if (pw < 0 || iw < 0) return "Pesos devem ser ≥ 0."
    const sum = pw + iw
    if (Math.abs(sum - 1) > 0.001) return "A soma dos pesos deve ser 1.0."
    return ""
  }, [formula.projectWeight, formula.ipiWeight])

  const quotaError = useMemo(() => {
    const l = quota.limitPerResearcher.trim()
    const t = quota.totalQuotas.trim()
    if (!l || !t) return "Informe limite por pesquisador e total de cotas."
    const ln = toNumberOrNull(l)
    const tn = toNumberOrNull(t)
    if (ln === null || tn === null) return "Limite/Total devem ser números."
    if (ln < 0 || tn < 0) return "Limite/Total devem ser ≥ 0."
    return ""
  }, [quota.limitPerResearcher, quota.totalQuotas])

  const canSave = !formulaError && !quotaError

  // ===== Cálculo de ranking (simples, placeholder) =====
  const rankedProjects = useMemo(() => {
    const pw = clamp01(toNumberOrNull(formula.projectWeight) ?? 0.7)
    const iw = clamp01(toNumberOrNull(formula.ipiWeight) ?? 0.3)

    const ignoreSet = new Set(
      appeals.filter((a) => a.ignoreContestedInRanking && a.status !== "RESOLVED").map((a) => a.projectId)
    )

    // normalização simples do IPI para 0..10 (placeholder)
    const ipiVals = projects.map((p) => p.ipiScore)
    const ipiMax = Math.max(1, ...ipiVals)
    const ipiTo10 = (ipi: number) => (ipi / ipiMax) * 10

    const computed = projects.map((p) => {
      const effectiveProjectScore = ignoreSet.has(p.id) ? 0 : p.projectScore
      const finalScore = effectiveProjectScore * pw + ipiTo10(p.ipiScore) * iw
      return { ...p, finalScore }
    })

    computed.sort((a, b) => {
      if (quota.order === "ASC") return (a.finalScore ?? 0) - (b.finalScore ?? 0)
      return (b.finalScore ?? 0) - (a.finalScore ?? 0)
    })

    return computed
  }, [projects, formula.projectWeight, formula.ipiWeight, quota.order, appeals])

  // ===== Distribuição de cotas (simples, placeholder) =====
  const distributionPreview = useMemo(() => {
    const limit = Math.max(0, Math.floor(toNumberOrNull(quota.limitPerResearcher) ?? 1))
    const total = Math.max(0, Math.floor(toNumberOrNull(quota.totalQuotas) ?? 0))

    const counts = new Map<string, number>() // proponent -> used
    const winners: ProjectRow[] = []
    const blocked: { project: ProjectRow; reason: string }[] = []

    for (const p of rankedProjects) {
      if (winners.length >= total) break
      const used = counts.get(p.proponent) ?? 0
      if (limit > 0 && used >= limit) {
        blocked.push({ project: p, reason: "Limite por pesquisador atingido." })
        continue
      }
      winners.push(p)
      counts.set(p.proponent, used + 1)
    }

    return { winners, blocked, total, limit }
  }, [rankedProjects, quota.limitPerResearcher, quota.totalQuotas])

  // ===== Handlers =====
  function setAutoCalc(next: boolean) {
    setAutoCalcByCall((prev) => ({ ...prev, [selectedCallId]: next }))
    setDirty(true)
  }

  function updateFormula(patch: Partial<{ projectWeight: string; ipiWeight: string; expression: string }>) {
    setFormulaByCall((prev) => ({ ...prev, [selectedCallId]: { ...(prev[selectedCallId] ?? formula), ...patch } }))
    setDirty(true)
  }

  function updateQuota(patch: Partial<{ order: "DESC" | "ASC"; limitPerResearcher: string; totalQuotas: string }>) {
    setQuotaByCall((prev) => ({ ...prev, [selectedCallId]: { ...(prev[selectedCallId] ?? quota), ...patch } }))
    setDirty(true)
  }

  function restoreDefaultsForCall() {
    setAutoCalcByCall((prev) => ({ ...prev, [selectedCallId]: true }))
    setFormulaByCall((prev) => ({ ...prev, [selectedCallId]: { projectWeight: "0.7", ipiWeight: "0.3", expression: "" } }))
    setQuotaByCall((prev) => ({ ...prev, [selectedCallId]: { order: "DESC", limitPerResearcher: "1", totalQuotas: "0" } }))
    setDirty(true)
  }

  function save() {
    if (!canSave) return
    setDirty(false)
    alert("Configurações salvas (placeholder).")
  }

  function runRanking() {
    // TODO: API para recalcular ranking no backend
    alert("Ranking recalculado (placeholder).")
  }

  function runDistribution() {
    // TODO: API para “rodar distribuição” e persistir vencedores
    setProjectsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((p) =>
        distributionPreview.winners.some((w) => w.id === p.id) ? { ...p, status: "AWARDED" } : p
      ),
    }))
    alert("Distribuição executada (placeholder).")
  }

  function setIgnoreContested(projectId: string, value: boolean) {
    setAppealsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((a) =>
        a.projectId === projectId && a.status !== "RESOLVED" ? { ...a, ignoreContestedInRanking: value } : a
      ),
    }))
    setDirty(true)
  }

  function assignNewEvaluator(appealId: string) {
    // TODO: integrar com módulo de avaliadores
    setAppealsByCall((prev) => ({
      ...prev,
      [selectedCallId]: (prev[selectedCallId] ?? []).map((a) => (a.id === appealId ? { ...a, newEvaluatorAssigned: true, status: "IN_REVIEW" } : a)),
    }))
    alert("Novo avaliador solicitado (placeholder).")
  }

  function sendAppealEmail(appealId: string) {
    // TODO: e-mail via sistema
    alert(`E-mail enviado (placeholder) para recurso ${appealId}.`)
  }

  if (!selectedCall) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-primary">Classificação & Resultados</h1>
          <p className="text-sm text-neutral">Nenhum edital encontrado.</p>
        </header>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Classificação & Resultados</h1>
        <p className="text-sm text-neutral">
          Ranking por projeto, distribuição de cotas e gestão de recursos <span className="font-semibold">por edital</span>.
        </p>
      </header>

      {/* ===== Contexto do edital ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">Edital em configuração</h2>

          {dirty && (
            <span className="ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle size={14} />
              Alterações não salvas
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <label className="text-sm md:col-span-2">
            <span className="block text-xs text-neutral mb-1">Escolha o edital</span>
            <div className="relative">
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" />
              <select
                value={selectedCallId}
                onChange={(e) => {
                  setSelectedCallId(e.target.value)
                  setDirty(false)
                }}
                className="w-full appearance-none border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                {calls
                  .slice()
                  .sort((a, b) => b.baseYear - a.baseYear)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} • {c.baseYear}
                    </option>
                  ))}
              </select>
            </div>
          </label>

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Resumo</p>
            <p className="text-sm font-semibold text-primary">{selectedCall.title}</p>
            <p className="text-xs text-neutral mt-1">
              Ano-base: <span className="font-semibold text-primary">{selectedCall.baseYear}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            Nota final = combinação de <span className="font-semibold">Nota do Projeto</span> +{" "}
            <span className="font-semibold">IPI</span>. A tabela do IPI é configurada em “Pontuação & IPI”.
          </p>
        </div>
      </section>

      {/* ===== Configurações (fórmula + auto) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section
          title="Cálculo Automático de Notas"
          icon={<Settings size={18} />}
          right={
            <button
              type="button"
              onClick={() => setAutoCalc(!autoCalc)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors
                ${autoCalc ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary"}
              `}
            >
              {autoCalc ? "Ativo" : "Inativo"}
            </button>
          }
        >
          <p className="text-sm text-neutral">
            Quando ativo, o sistema recalcula ranking automaticamente ao receber alterações em notas/pareceres/IPI.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runRanking}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90"
            >
              <RefreshCcw size={16} />
              Recalcular ranking agora
            </button>
            <button
              type="button"
              onClick={() => alert("Logs (placeholder)")}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light"
            >
              Ver logs
            </button>
          </div>
        </Section>

        <Section title="Fórmula do Ranking" icon={<GraduationCap size={18} />}>
          <p className="text-sm text-neutral mb-3">
            Defina como a nota final é composta. Ex.:{" "}
            <span className="font-semibold text-primary">(notaProjeto * 0.7) + (ipiNormalizado * 0.3)</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Peso da nota do projeto</span>
              <input
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                value={formula.projectWeight}
                onChange={(e) => updateFormula({ projectWeight: e.target.value })}
                placeholder="0.7"
              />
            </label>

            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Peso do IPI</span>
              <input
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                value={formula.ipiWeight}
                onChange={(e) => updateFormula({ ipiWeight: e.target.value })}
                placeholder="0.3"
              />
            </label>
          </div>

          <div className="mt-3">
            <label className="text-sm">
              <span className="block text-xs text-neutral mb-1">Expressão (opcional)</span>
              <input
                className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
                value={formula.expression}
                onChange={(e) => updateFormula({ expression: e.target.value })}
                placeholder="ex.: (projeto * 0.7) + (ipi * 0.3)"
              />
            </label>
          </div>

          {formulaError ? (
            <p className="text-sm text-amber-800 mt-3 inline-flex items-center gap-2">
              <AlertTriangle size={16} /> {formulaError}
            </p>
          ) : (
            <p className="text-xs text-neutral mt-3 inline-flex items-center gap-2">
              <Check size={14} /> Pesos válidos (soma = 1.0)
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                ${!canSave ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
              `}
            >
              <Save size={16} />
              Salvar fórmula
            </button>

            <button
              type="button"
              onClick={restoreDefaultsForCall}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light inline-flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Restaurar padrão
            </button>
          </div>
        </Section>
      </div>

      {/* ===== Distribuição de cotas ===== */}
      <Section
        title="Distribuição de Cotas"
        icon={<ShieldCheck size={18} />}
        right={
          <button
            type="button"
            onClick={runDistribution}
            disabled={!!quotaError}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
              ${quotaError ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}
            `}
          >
            <Play size={16} />
            Rodar distribuição
          </button>
        }
      >
        <p className="text-sm text-neutral mb-4">
          Execute a distribuição seguindo a ordem do ranking e o limite por pesquisador.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <label className="md:col-span-4 text-sm">
            <span className="block text-xs text-neutral mb-1">Ordem de classificação</span>
            <select
              className="w-full border border-neutral-light rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              value={quota.order}
              onChange={(e) => updateQuota({ order: e.target.value as "DESC" | "ASC" })}
            >
              <option value="DESC">Maior nota primeiro</option>
              <option value="ASC">Menor nota primeiro</option>
            </select>
          </label>

          <label className="md:col-span-4 text-sm">
            <span className="block text-xs text-neutral mb-1">Limite por pesquisador</span>
            <input
              className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              value={quota.limitPerResearcher}
              onChange={(e) => updateQuota({ limitPerResearcher: e.target.value })}
              placeholder="ex.: 1"
              inputMode="numeric"
            />
          </label>

          <label className="md:col-span-4 text-sm">
            <span className="block text-xs text-neutral mb-1">Total de cotas (bolsas)</span>
            <input
              className="w-full border border-neutral-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
              value={quota.totalQuotas}
              onChange={(e) => updateQuota({ totalQuotas: e.target.value })}
              placeholder="ex.: 20"
              inputMode="numeric"
            />
          </label>
        </div>

        {quotaError && (
          <p className="text-sm text-amber-800 mt-3 inline-flex items-center gap-2">
            <AlertTriangle size={16} /> {quotaError}
          </p>
        )}

        <div className="mt-4 rounded-xl border border-neutral-light bg-neutral-50 p-4 flex items-start gap-2">
          <ArrowDownUp size={16} className="mt-0.5 text-neutral" />
          <div className="text-xs text-neutral">
            <p className="font-semibold text-primary">Prévia (placeholder)</p>
            <p className="mt-1">
              Selecionados: <span className="font-semibold text-primary">{distributionPreview.winners.length}</span> /{" "}
              <span className="font-semibold text-primary">{distributionPreview.total}</span> • Limite/pesquisador:{" "}
              <span className="font-semibold text-primary">{distributionPreview.limit}</span>
            </p>
            {distributionPreview.blocked.length > 0 && (
              <p className="mt-1">
                Bloqueados por limite:{" "}
                <span className="font-semibold text-primary">{distributionPreview.blocked.length}</span>
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ===== Ranking por projeto ===== */}
      <Section title="Ranking por Projeto" icon={<ClipboardList size={18} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral">
                <th className="py-2 pr-3">Projeto</th>
                <th className="py-2 pr-3">Proponente</th>
                <th className="py-2 pr-3">Nota do projeto</th>
                <th className="py-2 pr-3">IPI</th>
                <th className="py-2 pr-3">Nota final</th>
                <th className="py-2 pr-3">Recursos</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {rankedProjects.map((p, idx) => (
                <tr key={p.id} className="border-t border-neutral-light">
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-primary">
                      #{idx + 1} — {p.title}
                    </p>
                    <p className="text-xs text-neutral">{p.notesCount ? `${p.notesCount} parecer(es)` : "—"}</p>
                  </td>
                  <td className="py-3 pr-3 text-sm text-neutral">{p.proponent}</td>
                  <td className="py-3 pr-3 text-sm text-neutral">{p.projectScore.toFixed(1)}</td>
                  <td className="py-3 pr-3 text-sm text-neutral">{p.ipiScore}</td>
                  <td className="py-3 pr-3">
                    <span className="font-semibold text-primary">{(p.finalScore ?? 0).toFixed(2)}</span>
                  </td>
                  <td className="py-3 pr-3">
                    {p.requestedReview ? (
                      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
                        <AlertTriangle size={14} />
                        Em recurso
                      </span>
                    ) : (
                      <span className="text-xs text-neutral">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-3 text-xs text-neutral">{p.status}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => alert("Abrir detalhes do projeto (placeholder)")}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rankedProjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral">
                    Nenhum projeto encontrado para este edital.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            A nota final exibida é uma prévia local (placeholder). Em produção, o ranking deve ser calculado e versionado no backend,
            com auditoria e congelamento por etapa do edital.
          </p>
        </div>
      </Section>

      {/* ===== Gestão de recursos (por projeto) ===== */}
      <Section title="Gestão de Recursos" icon={<AlertCircle size={18} />}>
        <p className="text-sm text-neutral mb-4">
          Receba pedidos de revisão, encaminhe para novo avaliador e (opcionalmente) desconsidere a nota contestada no ranking sem excluí-la.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral">
                <th className="py-2 pr-3">Projeto</th>
                <th className="py-2 pr-3">Motivo</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Desconsiderar no ranking?</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appeals.map((a) => {
                const p = projects.find((x) => x.id === a.projectId)
                const isOpen = a.status !== "RESOLVED"
                return (
                  <tr key={a.id} className="border-t border-neutral-light">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-primary">{p?.title ?? "—"}</p>
                      <p className="text-xs text-neutral">{p?.proponent ?? ""}</p>
                    </td>
                    <td className="py-3 pr-3 text-sm text-neutral">{a.reason}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${
                          a.status === "OPEN"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : a.status === "IN_REVIEW"
                            ? "bg-neutral-50 text-neutral border-neutral-light"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {a.status === "RESOLVED" ? <Check size={14} /> : <AlertTriangle size={14} />}
                        {a.status === "OPEN" ? "Aberto" : a.status === "IN_REVIEW" ? "Em análise" : "Resolvido"}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <label className={`inline-flex items-center gap-2 text-sm ${!isOpen ? "opacity-50 pointer-events-none" : ""}`}>
                        <input
                          type="checkbox"
                          checked={a.ignoreContestedInRanking}
                          onChange={(e) => setIgnoreContested(a.projectId, e.target.checked)}
                        />
                        <span className="text-neutral">Sim</span>
                      </label>
                      <p className="text-[11px] text-neutral mt-1">
                        Mantém histórico, mas remove a nota contestada do cálculo temporariamente.
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => assignNewEvaluator(a.id)}
                          disabled={!isOpen}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border
                            ${
                              !isOpen
                                ? "border-neutral-light text-neutral/40 bg-neutral-50 cursor-not-allowed"
                                : "border-neutral-light hover:bg-neutral-50 text-neutral"
                            }
                          `}
                        >
                          <UserCheck size={16} />
                          Novo avaliador
                        </button>

                        <button
                          type="button"
                          onClick={() => sendAppealEmail(a.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-neutral-light hover:bg-neutral-50 text-neutral"
                        >
                          <Mail size={16} />
                          Notificar
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral mt-2">
                        Criado em: {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                )
              })}

              {appeals.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral">
                    Nenhum recurso registrado para este edital.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-neutral">
          <AlertCircle size={14} className="mt-0.5" />
          <p>
            Regra recomendada: versionar notas por parecer, manter trilha de auditoria e preservar histórico mesmo quando a nota contestada é desconsiderada.
          </p>
        </div>
      </Section>

      {/* ===== CTA final ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5">
        <div className="flex items-center justify-end gap-2 flex-col md:flex-row">
          <button
            type="button"
            onClick={restoreDefaultsForCall}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-neutral-light hover:bg-neutral-light w-full md:w-auto"
          >
            <RotateCcw size={16} />
            Restaurar padrão do edital
          </button>

          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white w-full md:w-auto
              ${!canSave ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-90"}`}
          >
            <Save size={16} />
            Salvar configurações do edital
          </button>
        </div>
      </section>
    </div>
  )
}
