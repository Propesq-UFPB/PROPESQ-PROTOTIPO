import React, { useMemo, useState } from "react"
import Card from "@/components/Card"
import Table from "@/components/Table"
import { certificados } from "@/mock/data"
import { Helmet } from "react-helmet"

type Certificado = {
  id: string | number
  nome: string
  pessoa: string
  projetoId: string
  data: string
  pdfUrl?: string
  download?: never
  verificar?: never
}

function normalize(str: string) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

function parseDate(d: string) {
  const iso = new Date(d)
  if (!isNaN(iso.getTime())) return iso
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d)
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
  return new Date(NaN)
}

function formatDate(d: string) {
  const dt = parseDate(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function Certificates() {
  const [q, setQ] = useState("")
  const [tipo, setTipo] = useState<"todos" | string>("todos")

  const tipos = useMemo(() => {
    const set = new Set<string>()
    ;(certificados as Certificado[]).forEach((c) => {
      if (c?.nome) set.add(c.nome)
    })
    return ["todos", ...Array.from(set).sort()]
  }, [])

  const data = useMemo(() => {
    const nq = normalize(q)
    const filtered = (certificados as Certificado[]).filter((c) => {
      const inTipo = tipo === "todos" || c.nome === tipo
      if (!inTipo) return false
      if (!q) return true

      const hay =
        normalize(String(c.id)) +
        " " +
        normalize(c.nome) +
        " " +
        normalize(c.pessoa) +
        " " +
        normalize(c.projetoId) +
        " " +
        normalize(c.data)

      return hay.includes(nq)
    })

    return filtered
      .slice()
      .sort(
        (a, b) =>
          (parseDate(b.data).getTime() || 0) -
          (parseDate(a.data).getTime() || 0)
      )
  }, [q, tipo])

  const emptyMsg =
    q || tipo !== "todos"
      ? "Nenhum certificado encontrado para os filtros aplicados."
      : "Nenhum certificado cadastrado."

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Certificados • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10">
          {/* TOOLBAR / FILTROS */}
          <section
            className="mb-8 bg-white rounded-2xl border border-neutral-light p-6 shadow-card"
            role="region"
            aria-label="Filtros de certificados"
          >
            <h2 className="text-lg font-semibold text-primary mb-4">
              Filtros
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Busca */}
              <div>
                <label
                  htmlFor="q"
                  className="block text-sm font-medium text-neutral mb-1"
                >
                  Busca
                </label>
                <input
                  id="q"
                  type="text"
                  placeholder="Buscar por nome, projeto, tipo ou ID…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-lg border border-neutral-light px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-lighter/40"
                />
              </div>

              {/* Tipo */}
              <div>
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-neutral mb-1"
                >
                  Tipo
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full rounded-lg border border-neutral-light px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-lighter/40"
                >
                  {tipos.map((t) => (
                    <option key={t} value={t}>
                      {t === "todos" ? "Todos" : t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contador */}
              <div className="flex items-center justify-end">
                <div
                  className="text-sm font-medium text-neutral"
                  aria-live="polite"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />
                  {data.length} resultado{data.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </section>

          {/* TABELA */}
          {data.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-lg font-semibold text-primary">
                Nenhum certificado encontrado
              </div>
              <div className="mt-2 text-sm text-neutral">{emptyMsg}</div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-light p-6 shadow-card">
              <Table
                data={data}
                cols={[
                  {
                    key: "id",
                    header: "ID",
                    render: (r: Certificado) => (
                      <span className="font-mono text-sm">{r.id}</span>
                    ),
                  },
                  {
                    key: "nome",
                    header: "Tipo",
                    render: (r: Certificado) => (
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary"
                        title={r.nome}
                      >
                        {r.nome}
                      </span>
                    ),
                  },
                  { key: "pessoa", header: "Nome" },
                  {
                    key: "projetoId",
                    header: "Projeto",
                    render: (r: Certificado) => (
                      <span className="text-sm" title={r.projetoId}>
                        {r.projetoId}
                      </span>
                    ),
                  },
                  {
                    key: "data",
                    header: "Data",
                    render: (r: Certificado) => formatDate(r.data),
                  },
                  {
                    key: "download",
                    header: "Baixar",
                    render: (r: Certificado) => (
                      <a
                        href={r.pdfUrl || "#"}
                        download={Boolean(r.pdfUrl) || undefined}
                        aria-disabled={!r.pdfUrl}
                        onClick={(e) => {
                          if (!r.pdfUrl) e.preventDefault()
                        }}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-semibold
                          ${
                            r.pdfUrl
                              ? "bg-accent text-primary hover:bg-accent-medium"
                              : "bg-neutral-light text-neutral cursor-not-allowed"
                          }
                        `}
                      >
                        Baixar PDF
                      </a>
                    ),
                  },
                  {
                    key: "verificar",
                    header: "Verificar",
                    render: () => (
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Verificar
                      </button>
                    ),
                  },
                ]}
                striped
                stickyHeader
                dense="compact"
              />
            </div>
          )}
      </div>
    </div>
  )
}
