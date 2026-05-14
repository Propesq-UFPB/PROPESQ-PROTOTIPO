import React, { useMemo, useState } from "react"
import { ShieldCheck, Plus, Search, Save, X, Pencil, Trash2 } from "lucide-react"

type FundingOrg = { id: string; name: string }

type Quota = {
  id: string
  code: string
  description: string
  fundingOrgId: string
  validityFrom: string
  validityTo: string
  partialReportsFrom: string
  partialReportsTo: string
  finalReportsFrom: string
  finalReportsTo: string
  volunteerPlanFrom: string
  volunteerPlanTo: string
  annualProjectReport: boolean
}

function uid(prefix = "quota") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}
function normalize(s: string) {
  return s.trim().toLowerCase()
}
function isISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}
function dateRangeError(from: string, to: string) {
  if (!from && !to) return ""
  if (from && !isISODate(from)) return "Data inicial inválida."
  if (to && !isISODate(to)) return "Data final inválida."
  if (from && to && from > to) return "A data final não pode ser menor que a inicial."
  return ""
}

const MOCK_ORGS: FundingOrg[] = [
  { id: "org_ufpb", name: "UFPB" },
  { id: "org_cnpq", name: "CNPq" },
  { id: "org_fapesq", name: "FAPESQ" },
]

const EMPTY: Quota = {
  id: "",
  code: "",
  description: "",
  fundingOrgId: "",
  validityFrom: "",
  validityTo: "",
  partialReportsFrom: "",
  partialReportsTo: "",
  finalReportsFrom: "",
  finalReportsTo: "",
  volunteerPlanFrom: "",
  volunteerPlanTo: "",
  annualProjectReport: false,
}

export default function AdmCallQuotas() {
  const [tab, setTab] = useState<"create" | "list">("create")
  const [orgs] = useState<FundingOrg[]>(MOCK_ORGS)

  // ✅ depois trocar por API
  const [quotas, setQuotas] = useState<Quota[]>([])
  const [form, setForm] = useState<Quota>(EMPTY)

  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Quota | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const formErrors = useMemo(() => {
    const e: Record<string, string> = {}

    if (!form.code.trim()) e.code = "Código é obrigatório."
    if (!form.description.trim()) e.description = "Descrição é obrigatória."
    if (!form.fundingOrgId) e.fundingOrgId = "Selecione um órgão financiador."

    const v = dateRangeError(form.validityFrom, form.validityTo)
    if (v) e.validity = v

    const p = dateRangeError(form.partialReportsFrom, form.partialReportsTo)
    if (p) e.partial = p

    const f = dateRangeError(form.finalReportsFrom, form.finalReportsTo)
    if (f) e.final = f

    const vol = dateRangeError(form.volunteerPlanFrom, form.volunteerPlanTo)
    if (vol) e.volunteer = vol

    return e
  }, [form])

  const canCreate = Object.keys(formErrors).length === 0

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return quotas
    return quotas.filter((x) => {
      const orgName = orgs.find((o) => o.id === x.fundingOrgId)?.name ?? ""
      return (
        normalize(x.code).includes(q) ||
        normalize(x.description).includes(q) ||
        normalize(orgName).includes(q)
      )
    })
  }, [quotas, query, orgs])

  const draftErrors = useMemo(() => {
    if (!draft) return {}
    const e: Record<string, string> = {}
    if (!draft.code.trim()) e.code = "Código é obrigatório."
    if (!draft.description.trim()) e.description = "Descrição é obrigatória."
    if (!draft.fundingOrgId) e.fundingOrgId = "Selecione um órgão financiador."
    const v = dateRangeError(draft.validityFrom, draft.validityTo)
    if (v) e.validity = v
    const p = dateRangeError(draft.partialReportsFrom, draft.partialReportsTo)
    if (p) e.partial = p
    const f = dateRangeError(draft.finalReportsFrom, draft.finalReportsTo)
    if (f) e.final = f
    const vol = dateRangeError(draft.volunteerPlanFrom, draft.volunteerPlanTo)
    if (vol) e.volunteer = vol
    return e
  }, [draft])

  const canSaveDraft = draft && Object.keys(draftErrors).length === 0

  async function onCreate() {
    if (!canCreate) return
    setSaving(true)
    try {
      // ✅ depois: POST /quotas
      await new Promise((r) => setTimeout(r, 350))
      const newQuota: Quota = { ...form, id: uid("quota") }
      setQuotas((prev) => [newQuota, ...prev])
      setForm(EMPTY)
      setTab("list")
    } finally {
      setSaving(false)
    }
  }

  function onCancelCreate() {
    setForm(EMPTY)
  }

  function startEdit(q: Quota) {
    setEditingId(q.id)
    setDraft({ ...q })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
  }

  async function saveEdit() {
    if (!draft || !editingId || !canSaveDraft) return
    setSaving(true)
    try {
      // ✅ depois: PUT /quotas/:id
      await new Promise((r) => setTimeout(r, 350))
      setQuotas((prev) => prev.map((x) => (x.id === editingId ? draft : x)))
      cancelEdit()
    } finally {
      setSaving(false)
    }
  }

  function askDelete(id: string) {
    setConfirmDeleteId(id)
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return
    const id = confirmDeleteId
    setConfirmDeleteId(null)
    // ✅ depois: DELETE /quotas/:id
    await new Promise((r) => setTimeout(r, 250))
    setQuotas((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary inline-flex items-center gap-2">
          <ShieldCheck size={18} />
          Cotas
        </h1>
        <p className="text-sm text-neutral">
          Cadastre cotas de bolsas e gerencie (listar/alterar/remover) conforme o edital.
        </p>
      </header>

      {/* Tabs (Cadastrar / Listar-Alterar) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("create")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === "create" ? "bg-primary text-white shadow-sm" : "bg-white border border-neutral-light text-neutral hover:bg-neutral-light"
          }`}
        >
          Cadastrar
        </button>
        <button
          onClick={() => setTab("list")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === "list" ? "bg-primary text-white shadow-sm" : "bg-white border border-neutral-light text-neutral hover:bg-neutral-light"
          }`}
        >
          Listar/Alterar
        </button>
      </div>

      {tab === "create" ? (
        <section className="bg-white border border-neutral-light rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-light">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral">Cadastro de Cota de Bolsas</p>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldText
                label="Código"
                required
                value={form.code}
                onChange={(v) => setForm((p) => ({ ...p, code: v }))}
                error={formErrors.code}
              />

              <FieldText
                label="Descrição"
                required
                value={form.description}
                onChange={(v) => setForm((p) => ({ ...p, description: v }))}
                error={formErrors.description}
              />

              <FieldSelect
                label="Órgão Financiador"
                required
                value={form.fundingOrgId}
                onChange={(v) => setForm((p) => ({ ...p, fundingOrgId: v }))}
                options={[{ value: "", label: "-- SELECIONE --" }, ...orgs.map((o) => ({ value: o.id, label: o.name }))]}
                error={formErrors.fundingOrgId}
              />
            </div>

            <div className="space-y-3">
              <RangeRow
                title="Período de Validade"
                from={form.validityFrom}
                to={form.validityTo}
                onFrom={(v) => setForm((p) => ({ ...p, validityFrom: v }))}
                onTo={(v) => setForm((p) => ({ ...p, validityTo: v }))}
                error={formErrors.validity}
              />

              <RangeRow
                title="Período de Envio de Relatórios Parciais"
                from={form.partialReportsFrom}
                to={form.partialReportsTo}
                onFrom={(v) => setForm((p) => ({ ...p, partialReportsFrom: v }))}
                onTo={(v) => setForm((p) => ({ ...p, partialReportsTo: v }))}
                error={formErrors.partial}
              />

              <RangeRow
                title="Período de Envio de Relatórios Finais"
                from={form.finalReportsFrom}
                to={form.finalReportsTo}
                onFrom={(v) => setForm((p) => ({ ...p, finalReportsFrom: v }))}
                onTo={(v) => setForm((p) => ({ ...p, finalReportsTo: v }))}
                error={formErrors.final}
              />

              <RangeRow
                title="Período de cadastro de plano Voluntário"
                from={form.volunteerPlanFrom}
                to={form.volunteerPlanTo}
                onFrom={(v) => setForm((p) => ({ ...p, volunteerPlanFrom: v }))}
                onTo={(v) => setForm((p) => ({ ...p, volunteerPlanTo: v }))}
                error={formErrors.volunteer}
              />
            </div>

            <div className="flex items-center justify-between gap-3 border border-neutral-light rounded-xl p-3">
              <p className="text-xs font-bold text-neutral">Enviar relatório anual de projeto?</p>
              <div className="flex items-center gap-3">
                <Radio
                  label="Sim"
                  checked={form.annualProjectReport === true}
                  onChange={() => setForm((p) => ({ ...p, annualProjectReport: true }))}
                />
                <Radio
                  label="Não"
                  checked={form.annualProjectReport === false}
                  onChange={() => setForm((p) => ({ ...p, annualProjectReport: false }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-2">
              <button
                onClick={onCreate}
                disabled={!canCreate || saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                {saving ? "Cadastrando..." : "Cadastrar"}
              </button>

              <button
                onClick={onCancelCreate}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white border border-neutral-light rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-light flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral flex-1">Listar Cotas de Bolsa Cadastradas</p>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por código, descrição ou órgão..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-light text-sm outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>

          <div className="divide-y divide-neutral-light">
            {filtered.length === 0 && <div className="p-6 text-sm text-neutral">Nenhuma cota cadastrada.</div>}

            {filtered.map((q) => {
              const isEditing = editingId === q.id
              const row = isEditing && draft ? draft : q
              const orgName = orgs.find((o) => o.id === row.fundingOrgId)?.name ?? "—"

              return (
                <div key={q.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FieldText
                          label="Código"
                          required
                          value={row.code}
                          onChange={(v) => isEditing && setDraft((p) => (p ? { ...p, code: v } : p))}
                          error={isEditing ? (draftErrors as any).code : ""}
                          readOnly={!isEditing}
                        />

                        <FieldText
                          label="Descrição"
                          required
                          value={row.description}
                          onChange={(v) => isEditing && setDraft((p) => (p ? { ...p, description: v } : p))}
                          error={isEditing ? (draftErrors as any).description : ""}
                          readOnly={!isEditing}
                        />

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral">
                            Órgão Financiador <span className="text-red-500">*</span>
                          </label>
                          {isEditing ? (
                            <>
                              <select
                                value={row.fundingOrgId}
                                onChange={(e) => setDraft((p) => (p ? { ...p, fundingOrgId: e.target.value } : p))}
                                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                                  (draftErrors as any).fundingOrgId ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-neutral-light focus:ring-2 focus:ring-accent/30"
                                }`}
                              >
                                <option value="">-- SELECIONE --</option>
                                {orgs.map((o) => (
                                  <option key={o.id} value={o.id}>
                                    {o.name}
                                  </option>
                                ))}
                              </select>
                              {(draftErrors as any).fundingOrgId && (
                                <p className="text-[11px] text-red-500 font-semibold">{(draftErrors as any).fundingOrgId}</p>
                              )}
                            </>
                          ) : (
                            <div className="px-3 py-2 rounded-lg border border-neutral-light text-sm text-neutral bg-neutral-light/40">
                              {orgName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <MiniRange label="Validade" from={row.validityFrom} to={row.validityTo} />
                        <MiniRange label="Relatórios Parciais" from={row.partialReportsFrom} to={row.partialReportsTo} />
                        <MiniRange label="Relatórios Finais" from={row.finalReportsFrom} to={row.finalReportsTo} />
                        <MiniRange label="Plano Voluntário" from={row.volunteerPlanFrom} to={row.volunteerPlanTo} />
                      </div>

                      <div className="text-xs text-neutral">
                        Relatório anual do projeto:{" "}
                        <span className="font-bold text-primary">{row.annualProjectReport ? "Sim" : "Não"}</span>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:min-w-[220px] justify-end">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => startEdit(q)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-primary hover:bg-neutral-light"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            onClick={() => askDelete(q.id)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Remover
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={saveEdit}
                            disabled={!canSaveDraft || saving}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save size={16} />
                            {saving ? "Salvando..." : "Salvar"}
                          </button>

                          <button
                            onClick={cancelEdit}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X size={16} />
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Modal remover */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-light overflow-hidden">
            <div className="p-4 border-b border-neutral-light">
              <p className="text-sm font-bold text-primary">Confirmar remoção</p>
              <p className="text-xs text-neutral mt-1">Essa ação remove a cota cadastrada.</p>
            </div>

            <div className="p-4 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-2 rounded-lg border border-neutral-light text-sm font-semibold text-neutral hover:bg-neutral-light"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:opacity-90"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= UI COMPONENTS ================= */

function FieldText(props: {
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
  readOnly?: boolean
}) {
  const { label, required, value, onChange, placeholder, error, readOnly } = props
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm outline-none
          ${readOnly ? "bg-neutral-light/40 text-neutral border-neutral-light" : ""}
          ${error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-neutral-light focus:ring-2 focus:ring-accent/30"}
        `}
      />

      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function FieldSelect(props: {
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  const { label, required, value, onChange, options, error } = props
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm outline-none
          ${error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-neutral-light focus:ring-2 focus:ring-accent/30"}
        `}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function RangeRow(props: {
  title: string
  from: string
  to: string
  onFrom: (v: string) => void
  onTo: (v: string) => void
  error?: string
}) {
  const { title, from, to, onFrom, onTo, error } = props
  return (
    <div className="border border-neutral-light rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-neutral">{title} <span className="text-red-500">*</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neutral">de</label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFrom(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
              error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-neutral-light focus:ring-2 focus:ring-accent/30"
            }`}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neutral">até</label>
          <input
            type="date"
            value={to}
            onChange={(e) => onTo(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
              error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-neutral-light focus:ring-2 focus:ring-accent/30"
            }`}
          />
        </div>
      </div>

      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
    </div>
  )
}

function MiniRange(props: { label: string; from: string; to: string }) {
  const { label, from, to } = props
  return (
    <div className="border border-neutral-light rounded-xl p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-neutral">{label}</p>
      <p className="text-sm text-neutral mt-1">
        {from || "—"} <span className="text-neutral">até</span> {to || "—"}
      </p>
    </div>
  )
}

function Radio(props: { label: string; checked: boolean; onChange: () => void }) {
  const { label, checked, onChange } = props
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
        checked ? "border-primary text-primary bg-primary/10" : "border-neutral-light text-neutral hover:bg-neutral-light"
      }`}
      aria-pressed={checked}
    >
      <span className={`h-3 w-3 rounded-full border ${checked ? "bg-primary border-primary" : "bg-white border-neutral-light"}`} />
      {label}
    </button>
  )
}
