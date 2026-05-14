import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  Pencil,
  Save,
  XCircle,
} from "lucide-react"

import { projetos } from "@/mock/data"

type Projeto = {
  id: string | number
  titulo: string
  centro?: string
  unidade?: string
  tipo?: "interno" | "externo"
  status?: string
  prazo?: string
  dataInicio?: string
  dataFim?: string
  pesquisador?: string
  linhaPesquisa?: string
  areaConhecimento?: string
  grandeArea?: string
  objetivos?: string
  palavrasChave?: string[] | string
  agencia?: string
  edital?: string
  categoria?: string
  subcategoria?: string
  protocoloEtica?: string
  comiteEtica?: "Sim" | "Não"
}

const safe = (v?: any) => (v === undefined || v === null || v === "" ? "—" : String(v))

function asKeywordString(v?: string[] | string) {
  if (!v) return ""
  if (Array.isArray(v)) return v.join(", ")
  return v
}

function statusClass(status?: string) {
  const s = (status || "").toLowerCase()
  if (s.includes("aprov")) return "bg-green-100 text-green-800"
  if (s.includes("pend") || s.includes("anál") || s.includes("analise")) return "bg-amber-100 text-amber-800"
  if (s.includes("reprov") || s.includes("indefer")) return "bg-red-100 text-red-800"
  return "bg-neutral-light text-neutral"
}

function Field({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
        {label}
      </span>
      <div className="text-sm text-neutral">{value}</div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  textarea = false,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  textarea?: boolean
  type?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-neutral/70">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral outline-none focus:border-primary"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-neutral-light bg-white px-4 py-3 text-sm text-neutral outline-none focus:border-primary"
        />
      )}
    </label>
  )
}

export default function ProjectViewEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const project = useMemo(() => {
    const list = projetos as Projeto[]
    return list.find((p) => String(p.id) === String(id))
  }, [id])

  const [form, setForm] = useState<Projeto | null>(null)

  React.useEffect(() => {
    if (project) setForm(project)
  }, [project])

  if (!project || !form) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>Projeto não encontrado • PROPESQ</title>
        </Helmet>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="mt-8 rounded-2xl border border-neutral-light bg-white p-10 text-center shadow-card">
            <p className="text-base text-neutral">Projeto não encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  function setField<K extends keyof Projeto>(key: K, value: Projeto[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function handleSave() {
    // depois conectamos com a API
    console.log("Salvar projeto:", form)
    setIsEditing(false)
  }

  function handleCancel() {
    setForm(project ?? null)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>{safe(project.titulo)} • Visualizar/Editar • PROPESQ</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => nav(-1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>

                <span className="inline-flex items-center rounded-full bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                  #{String(project.id)}
                </span>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(project.status)}`}>
                  {safe(project.status)}
                </span>
              </div>

              <h1 className="mt-3 truncate text-xl font-bold text-primary">
                {safe(project.titulo)}
              </h1>

              <p className="mt-1 text-sm text-neutral">
                Coordenação:{" "}
                <span className="font-semibold text-primary">
                  {safe(project.pesquisador)}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  <Pencil size={16} />
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                  >
                    <Save size={16} />
                    Salvar
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
                  >
                    <XCircle size={16} />
                    Cancelar
                  </button>
                </>
              )}

              <Link
                to="/adm/monitoring/report-validation"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-light px-3 py-2 text-sm font-semibold text-primary hover:bg-neutral-light/50"
              >
                Relatórios
              </Link>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-neutral-light bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-neutral-light px-6 py-4">
            <BookOpen size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-primary">
              {isEditing ? "Editar projeto" : "Visualizar projeto"}
            </h2>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Título" value={safe(form.titulo)} />
                <Field label="Coordenador" value={safe(form.pesquisador)} />
                <Field label="Centro" value={safe(form.centro)} />
                <Field label="Unidade" value={safe(form.unidade)} />
                <Field label="Tipo" value={safe(form.tipo)} />
                <Field label="Situação" value={safe(form.status)} />
                <Field label="Área do conhecimento" value={safe(form.areaConhecimento)} />
                <Field label="Grande área" value={safe(form.grandeArea)} />
                <Field label="Linha de pesquisa" value={safe(form.linhaPesquisa)} />
                <Field label="Agência" value={safe(form.agencia)} />
                <Field label="Edital" value={safe(form.edital)} />
                <Field label="Categoria" value={safe(form.categoria)} />
                <Field label="Subcategoria" value={safe(form.subcategoria)} />
                <Field label="Data de início" value={safe(form.dataInicio)} />
                <Field label="Data de fim" value={safe(form.dataFim)} />
                <Field label="Prazo" value={safe(form.prazo)} />
                <Field label="Comitê de ética" value={safe(form.comiteEtica)} />
                <Field label="Protocolo de ética" value={safe(form.protocoloEtica)} />
                <Field label="Palavras-chave" value={safe(asKeywordString(form.palavrasChave))} />
                <div className="md:col-span-2">
                  <Field label="Objetivos" value={safe(form.objetivos)} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input label="Título" value={form.titulo || ""} onChange={(v) => setField("titulo", v)} />
                <Input label="Coordenador" value={form.pesquisador || ""} onChange={(v) => setField("pesquisador", v)} />
                <Input label="Centro" value={form.centro || ""} onChange={(v) => setField("centro", v)} />
                <Input label="Unidade" value={form.unidade || ""} onChange={(v) => setField("unidade", v)} />
                <Input label="Tipo" value={form.tipo || ""} onChange={(v) => setField("tipo", v as Projeto["tipo"])} />
                <Input label="Situação" value={form.status || ""} onChange={(v) => setField("status", v)} />
                <Input label="Área do conhecimento" value={form.areaConhecimento || ""} onChange={(v) => setField("areaConhecimento", v)} />
                <Input label="Grande área" value={form.grandeArea || ""} onChange={(v) => setField("grandeArea", v)} />
                <Input label="Linha de pesquisa" value={form.linhaPesquisa || ""} onChange={(v) => setField("linhaPesquisa", v)} />
                <Input label="Agência" value={form.agencia || ""} onChange={(v) => setField("agencia", v)} />
                <Input label="Edital" value={form.edital || ""} onChange={(v) => setField("edital", v)} />
                <Input label="Categoria" value={form.categoria || ""} onChange={(v) => setField("categoria", v)} />
                <Input label="Subcategoria" value={form.subcategoria || ""} onChange={(v) => setField("subcategoria", v)} />
                <Input label="Data de início" type="date" value={form.dataInicio?.slice(0, 10) || ""} onChange={(v) => setField("dataInicio", v)} />
                <Input label="Data de fim" type="date" value={form.dataFim?.slice(0, 10) || ""} onChange={(v) => setField("dataFim", v)} />
                <Input label="Prazo" value={form.prazo || ""} onChange={(v) => setField("prazo", v)} />
                <Input label="Comitê de ética" value={form.comiteEtica || ""} onChange={(v) => setField("comiteEtica", v as Projeto["comiteEtica"])} />
                <Input label="Protocolo de ética" value={form.protocoloEtica || ""} onChange={(v) => setField("protocoloEtica", v)} />
                <Input label="Palavras-chave" value={asKeywordString(form.palavrasChave)} onChange={(v) => setField("palavrasChave", v)} />
                <div className="md:col-span-2">
                  <Input label="Objetivos" value={form.objetivos || ""} onChange={(v) => setField("objetivos", v)} textarea />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}