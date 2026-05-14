import React, { useMemo, useState } from "react"
import { ShieldCheck, Plus, Trash2, Pencil, X, Check, Coins, Building2 } from "lucide-react"

type Org = {
  id: string
  name: string
}

type ScholarshipType = {
  id: string
  name: string
  value?: number | null
  payerOrgId: string
  allowStacking: boolean
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function formatBRL(value?: number | null) {
  if (value === null || value === undefined) return "—"
  try {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  } catch {
    return `R$ ${value}`
  }
}

export default function ScholarshipEntities() {
  // ===== Mock inicial (troque por dados da API depois) =====
  const [orgs, setOrgs] = useState<Org[]>([
    { id: "cnpq", name: "CNPq" },
    { id: "ufpb", name: "UFPB" },
    { id: "fapesq", name: "FAPESQ" },
  ])

  const [types, setTypes] = useState<ScholarshipType[]>([
    { id: "bolsa_1", name: "PIBIC", value: 700, payerOrgId: "cnpq", allowStacking: false },
    { id: "bolsa_2", name: "Monitoria", value: null, payerOrgId: "ufpb", allowStacking: true },
  ])

  // ===== UI state =====
  const [orgQuery, setOrgQuery] = useState("")
  const [typeQuery, setTypeQuery] = useState("")

  const [orgModalOpen, setOrgModalOpen] = useState(false)
  const [orgEditingId, setOrgEditingId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState("")

  const [typeModalOpen, setTypeModalOpen] = useState(false)
  const [typeEditingId, setTypeEditingId] = useState<string | null>(null)
  const [typeName, setTypeName] = useState("")
  const [typeValueEnabled, setTypeValueEnabled] = useState(false)
  const [typeValue, setTypeValue] = useState<string>("")
  const [typePayerOrgId, setTypePayerOrgId] = useState<string>("")
  const [typeAllowStacking, setTypeAllowStacking] = useState(false)

  const orgsFiltered = useMemo(() => {
    const q = orgQuery.trim().toLowerCase()
    if (!q) return orgs
    return orgs.filter((o) => o.name.toLowerCase().includes(q))
  }, [orgs, orgQuery])

  const typesFiltered = useMemo(() => {
    const q = typeQuery.trim().toLowerCase()
    if (!q) return types
    return types.filter((t) => {
      const orgName = orgs.find((o) => o.id === t.payerOrgId)?.name ?? ""
      return (
        t.name.toLowerCase().includes(q) ||
        orgName.toLowerCase().includes(q) ||
        (t.allowStacking ? "acúmulo" : "sem acúmulo").includes(q)
      )
    })
  }, [types, typeQuery, orgs])

  // ===== Helpers: abrir/fechar modais =====
  function openCreateOrg() {
    setOrgEditingId(null)
    setOrgName("")
    setOrgModalOpen(true)
  }
  function openEditOrg(o: Org) {
    setOrgEditingId(o.id)
    setOrgName(o.name)
    setOrgModalOpen(true)
  }
  function closeOrgModal() {
    setOrgModalOpen(false)
    setOrgEditingId(null)
    setOrgName("")
  }

  function openCreateType() {
    setTypeEditingId(null)
    setTypeName("")
    setTypeValueEnabled(false)
    setTypeValue("")
    setTypePayerOrgId(orgs[0]?.id ?? "")
    setTypeAllowStacking(false)
    setTypeModalOpen(true)
  }
  function openEditType(t: ScholarshipType) {
    setTypeEditingId(t.id)
    setTypeName(t.name)
    setTypeValueEnabled(t.value !== null && t.value !== undefined)
    setTypeValue(t.value !== null && t.value !== undefined ? String(t.value) : "")
    setTypePayerOrgId(t.payerOrgId)
    setTypeAllowStacking(t.allowStacking)
    setTypeModalOpen(true)
  }
  function closeTypeModal() {
    setTypeModalOpen(false)
    setTypeEditingId(null)
    setTypeName("")
    setTypeValueEnabled(false)
    setTypeValue("")
    setTypePayerOrgId("")
    setTypeAllowStacking(false)
  }

  // ===== CRUD Órgãos =====
  function saveOrg() {
    const name = orgName.trim()
    if (!name) return

    // evita duplicado (case-insensitive)
    const exists = orgs.some(
      (o) => o.name.trim().toLowerCase() === name.toLowerCase() && o.id !== orgEditingId
    )
    if (exists) return

    if (orgEditingId) {
      setOrgs((prev) => prev.map((o) => (o.id === orgEditingId ? { ...o, name } : o)))
    } else {
      const newId = uid("org")
      setOrgs((prev) => [...prev, { id: newId, name }])
      // se não tem fonte selecionada no cadastro de bolsa, seta a primeira
      if (!typePayerOrgId) setTypePayerOrgId(newId)
    }

    // TODO: chamar API aqui
    closeOrgModal()
  }

  function deleteOrg(id: string) {
    // regra simples: impedir apagar se estiver em uso
    const inUse = types.some((t) => t.payerOrgId === id)
    if (inUse) return

    setOrgs((prev) => prev.filter((o) => o.id !== id))
    // TODO: chamar API aqui
  }

  // ===== CRUD Tipos de Bolsa =====
  function saveType() {
    const name = typeName.trim()
    if (!name) return
    if (!typePayerOrgId) return

    // valor opcional
    let parsedValue: number | null = null
    if (typeValueEnabled) {
      const v = typeValue.replace(",", ".").trim()
      if (v.length > 0) {
        const n = Number(v)
        if (Number.isFinite(n) && n >= 0) parsedValue = n
        else return
      } else {
        parsedValue = null
      }
    } else {
      parsedValue = null
    }

    // evita duplicado de nome (opcional, mas útil)
    const exists = types.some(
      (t) => t.name.trim().toLowerCase() === name.toLowerCase() && t.id !== typeEditingId
    )
    if (exists) return

    if (typeEditingId) {
      setTypes((prev) =>
        prev.map((t) =>
          t.id === typeEditingId
            ? {
                ...t,
                name,
                value: parsedValue,
                payerOrgId: typePayerOrgId,
                allowStacking: typeAllowStacking,
              }
            : t
        )
      )
    } else {
      setTypes((prev) => [
        ...prev,
        {
          id: uid("bolsa"),
          name,
          value: parsedValue,
          payerOrgId: typePayerOrgId,
          allowStacking: typeAllowStacking,
        },
      ])
    }

    // TODO: chamar API aqui
    closeTypeModal()
  }

  function deleteType(id: string) {
    setTypes((prev) => prev.filter((t) => t.id !== id))
    // TODO: chamar API aqui
  }

  const orgNameError =
    orgName.trim().length > 0 &&
    orgs.some(
      (o) => o.name.trim().toLowerCase() === orgName.trim().toLowerCase() && o.id !== orgEditingId
    )

  const typeNameError =
    typeName.trim().length > 0 &&
    types.some(
      (t) =>
        t.name.trim().toLowerCase() === typeName.trim().toLowerCase() && t.id !== typeEditingId
    )

  const orgIdToName = useMemo(() => {
    const map = new Map<string, string>()
    orgs.forEach((o) => map.set(o.id, o.name))
    return map
  }, [orgs])

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Entidades & Tipos de Bolsa</h1>
        <p className="text-sm text-neutral">
          Cadastre órgãos financiadores e configure os tipos de bolsas disponíveis no sistema.
        </p>
      </header>

      {/* ===== ÓRGÃOS ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <h2 className="text-sm font-semibold text-primary">Cadastro de Órgãos</h2>
          </div>

          <button
            type="button"
            onClick={openCreateOrg}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-95"
          >
            <Plus size={16} />
            Novo órgão
          </button>
        </div>

        <p className="text-sm text-neutral">Exemplos: CNPq, UFPB, FAPESQ.</p>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-neutral">Buscar órgão</label>
            <input
              value={orgQuery}
              onChange={(e) => setOrgQuery(e.target.value)}
              placeholder="Ex.: CNPq"
              className="mt-1 w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-xs text-neutral md:text-right">
            {orgsFiltered.length} de {orgs.length}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-light">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Órgão</th>
                <th className="text-right font-semibold px-4 py-3 w-[220px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orgsFiltered.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-neutral" colSpan={2}>
                    Nenhum órgão encontrado.
                  </td>
                </tr>
              ) : (
                orgsFiltered.map((o) => {
                  const inUse = types.some((t) => t.payerOrgId === o.id)
                  return (
                    <tr key={o.id} className="border-t border-neutral-light">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-neutral" />
                          <span className="font-medium text-primary">{o.name}</span>
                        </div>
                        {inUse && (
                          <p className="text-xs text-neutral mt-0.5">
                            Em uso por {types.filter((t) => t.payerOrgId === o.id).length} tipo(s) de
                            bolsa.
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditOrg(o)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteOrg(o.id)}
                            disabled={inUse}
                            title={inUse ? "Não é possível excluir: órgão está em uso." : "Excluir"}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold
                              ${
                                inUse
                                  ? "border-neutral-light text-neutral/40 cursor-not-allowed"
                                  : "border-red-200 text-red-600 hover:bg-red-50"
                              }`}
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-neutral">
          Dica: por segurança, um órgão só pode ser excluído se não estiver associado a nenhum tipo de
          bolsa.
        </p>
      </section>

      {/* ===== TIPOS DE BOLSA ===== */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coins size={18} />
            <h2 className="text-sm font-semibold text-primary">Definição de Tipos de Bolsa</h2>
          </div>

          <button
            type="button"
            onClick={openCreateType}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-95"
          >
            <Plus size={16} />
            Novo tipo
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-neutral">Buscar tipo</label>
            <input
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)}
              placeholder="Ex.: PIBIC, Monitoria, CNPq..."
              className="mt-1 w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-xs text-neutral md:text-right">
            {typesFiltered.length} de {types.length}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-light">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Tipo</th>
                <th className="text-left font-semibold px-4 py-3">Fonte pagadora</th>
                <th className="text-left font-semibold px-4 py-3">Valor</th>
                <th className="text-left font-semibold px-4 py-3">Permite acúmulo</th>
                <th className="text-right font-semibold px-4 py-3 w-[220px]">Ações</th>
              </tr>
            </thead>

            <tbody>
              {typesFiltered.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-neutral" colSpan={5}>
                    Nenhum tipo de bolsa encontrado.
                  </td>
                </tr>
              ) : (
                typesFiltered.map((t) => {
                  const orgName = orgIdToName.get(t.payerOrgId) ?? "—"
                  return (
                    <tr key={t.id} className="border-t border-neutral-light">
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary">{t.name}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral">{orgName}</td>
                      <td className="px-4 py-3 text-neutral">{formatBRL(t.value ?? null)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border
                            ${
                              t.allowStacking
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-neutral-50 text-neutral border-neutral-light"
                            }`}
                        >
                          {t.allowStacking ? <Check size={14} /> : <X size={14} />}
                          {t.allowStacking ? "Sim" : "Não"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditType(t)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteType(t.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-neutral">
          Esses parâmetros serão utilizados nos editais e no controle financeiro.
        </p>
      </section>

      {/* ================= MODAL: ORG ================= */}
      {orgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeOrgModal} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-neutral-light shadow-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary">
                  {orgEditingId ? "Editar órgão" : "Novo órgão"}
                </h3>
                <p className="text-xs text-neutral mt-1">
                  Cadastre a instituição/órgão que financia bolsas.
                </p>
              </div>
              <button
                type="button"
                onClick={closeOrgModal}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-xs text-neutral">Nome do órgão</label>
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Ex.: CNPq"
                className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              {orgNameError && (
                <p className="text-xs text-red-600">Já existe um órgão com esse nome.</p>
              )}
              <p className="text-[11px] text-neutral">
                Dica: use siglas oficiais (ex.: CNPq) ou nome por extenso se necessário.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeOrgModal}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveOrg}
                disabled={!orgName.trim() || orgNameError}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${!orgName.trim() || orgNameError ? "bg-primary/40 cursor-not-allowed" : "bg-primary hover:opacity-95"}`}
              >
                <Check size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TYPE ================= */}
      {typeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeTypeModal} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-neutral-light shadow-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-primary">
                  {typeEditingId ? "Editar tipo de bolsa" : "Novo tipo de bolsa"}
                </h3>
                <p className="text-xs text-neutral mt-1">
                  Configure o tipo para ser usado em editais, concessões e relatórios.
                </p>
              </div>
              <button
                type="button"
                onClick={closeTypeModal}
                className="p-2 rounded-lg border border-neutral-light hover:bg-neutral-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral">Nome da bolsa</label>
                <input
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="Ex.: PIBIC, PIBITI, Monitoria..."
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                {typeNameError && (
                  <p className="text-xs text-red-600">Já existe um tipo com esse nome.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral">Fonte pagadora</label>
                <select
                  value={typePayerOrgId}
                  onChange={(e) => setTypePayerOrgId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-light px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  {orgs.length === 0 ? (
                    <option value="">Cadastre um órgão primeiro</option>
                  ) : (
                    orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))
                  )}
                </select>
                {orgs.length === 0 && (
                  <p className="text-xs text-neutral">
                    Você precisa cadastrar pelo menos um órgão antes de criar tipos de bolsa.
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs text-neutral">Valor (opcional)</label>

                  <label className="inline-flex items-center gap-2 text-xs text-neutral select-none">
                    <input
                      type="checkbox"
                      checked={typeValueEnabled}
                      onChange={(e) => setTypeValueEnabled(e.target.checked)}
                      className="accent-primary"
                    />
                    Definir valor
                  </label>
                </div>

                <input
                  value={typeValue}
                  onChange={(e) => setTypeValue(e.target.value)}
                  disabled={!typeValueEnabled}
                  inputMode="decimal"
                  placeholder={typeValueEnabled ? "Ex.: 700 ou 700.00" : "—"}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20
                    ${typeValueEnabled ? "border-neutral-light" : "border-neutral-light bg-neutral-50 text-neutral/60"}`}
                />
                <p className="text-[11px] text-neutral">
                  Se o valor variar por edital, deixe vazio e defina no edital.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral">Permite acúmulo?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeAllowStacking(true)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold
                      ${
                        typeAllowStacking
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-neutral-light hover:bg-neutral-50 text-neutral"
                      }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeAllowStacking(false)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold
                      ${
                        !typeAllowStacking
                          ? "border-primary/30 bg-neutral-50 text-primary"
                          : "border-neutral-light hover:bg-neutral-50 text-neutral"
                      }`}
                  >
                    Não
                  </button>
                </div>
                <p className="text-[11px] text-neutral">
                  Use “Sim” quando a bolsa puder coexistir com outros vínculos no sistema.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeTypeModal}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-light text-neutral hover:bg-neutral-50 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveType}
                disabled={!typeName.trim() || typeNameError || !typePayerOrgId || orgs.length === 0}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white
                  ${
                    !typeName.trim() || typeNameError || !typePayerOrgId || orgs.length === 0
                      ? "bg-primary/40 cursor-not-allowed"
                      : "bg-primary hover:opacity-95"
                  }`}
              >
                <Check size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
