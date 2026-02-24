// src/pages/Reports.tsx
import React, { useMemo, useRef, useState } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import { relatorios } from '@/mock/data'
import { Helmet } from 'react-helmet'

type Rel = {
  id: string | number
  tipo: 'Parcial' | 'Final' | string
  projeto: string
  prazo: string
  status: string
}

type Aba = 'Parciais' | 'Finais'

export default function Reports() {
  const [q, setQ] = useState('')
  const [onlyPendentes, setOnlyPendentes] = useState(false)
  const [aba, setAba] = useState<Aba>('Parciais')

  const inputParcialRef = useRef<HTMLInputElement>(null)
  const inputFinalRef = useRef<HTMLInputElement>(null)
  const tabelaRef = useRef<HTMLDivElement>(null)

  /* ================= KPIs ================= */

  const resumo = useMemo(() => {
    const total = (relatorios as Rel[]).length
    const entregues = (relatorios as Rel[]).filter(r =>
      r.status.toLowerCase().includes('entreg')
    ).length
    const atrasados = (relatorios as Rel[]).filter(r =>
      r.status.toLowerCase().includes('atras')
    ).length
    const pendentes = total - entregues - atrasados
    return { total, entregues, atrasados, pendentes }
  }, [])

  const contadores = useMemo(() => {
    const parciais = (relatorios as Rel[]).filter(r =>
      r.tipo.toLowerCase().includes('parc')
    ).length
    const finais = (relatorios as Rel[]).filter(r =>
      r.tipo.toLowerCase().includes('final')
    ).length
    return { parciais, finais }
  }, [])

  /* ================= FILTRO ================= */

  const dadosFiltrados = useMemo(() => {
    const isParciais = aba === 'Parciais'
    const needle = q.trim().toLowerCase()

    return (relatorios as Rel[])
      .filter(r =>
        isParciais
          ? r.tipo.toLowerCase().includes('parc')
          : r.tipo.toLowerCase().includes('final')
      )
      .filter(r =>
        !needle
          ? true
          : [r.id, r.tipo, r.projeto, r.prazo, r.status]
              .join(' ')
              .toLowerCase()
              .includes(needle)
      )
      .filter(r =>
        onlyPendentes ? r.status.toLowerCase().includes('pend') : true
      )
  }, [q, onlyPendentes, aba])

  function badgeClass(status: string) {
    const s = status.toLowerCase()
    if (s.includes('atras')) return 'badge badge-danger'
    if (s.includes('entreg')) return 'badge badge-success'
    if (s.includes('pend')) return 'badge badge-warning'
    return 'badge badge-gray'
  }

  function consultar(tipo: Aba) {
    setAba(tipo)
    setTimeout(() => {
      tabelaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Relatórios • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-10 text-sm">
        {/* ================= KPIs ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <KPI label="Total" value={resumo.total} />
          <KPI label="Entregues" value={resumo.entregues} color="success" />
          <KPI label="Pendentes" value={resumo.pendentes} color="warning" />
          <KPI label="Atrasados" value={resumo.atrasados} color="danger" />
        </div>

        {/* ================= AÇÕES RÁPIDAS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <QuickAction
            title="Relatórios Parciais"
            count={contadores.parciais}
            description="Envie ou consulte relatórios parciais."
            onSend={() => {}}
            onView={() => consultar('Parciais')}
          />
          <QuickAction
            title="Relatórios Finais"
            count={contadores.finais}
            description="Envie ou consulte relatórios finais."
            onSend={() => {}}
            onView={() => consultar('Finais')}
          />
        </div>

        {/* ================= ABAS ================= */}
        <div className="flex items-center justify-between mb-6">
          {/* Segmented Tabs */}
          <div className="inline-flex items-center rounded-full bg-neutral-light p-1">
            {(['Parciais', 'Finais'] as Aba[]).map(t => {
              const active = aba === t

              return (
                <button
                  key={t}
                  onClick={() => setAba(t)}
                  className={`
                    px-6 py-2 rounded-full text-sm font-semibold
                    transition-all duration-200
                    ${
                      active
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-primary/80 hover:text-primary'
                    }
                  `}
                >
                  {t}
                </button>
              )
            })}
          </div>

          {/* Actions bar (direita) */}
          <div>
            <input
              className="w-72 rounded-lg border border-neutral-light px-4 py-2 text-sm"
              placeholder={`Buscar em ${aba.toLowerCase()}`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>


        {/* ================= TABELA ================= */}
        <div ref={tabelaRef}>
          {dadosFiltrados.length === 0 ? (
            <div className="empty-state text-sm">
              <div className="empty-title">Nenhum relatório encontrado</div>
              <div className="empty-subtitle">
                Ajuste o filtro ou tente outro termo de busca.
              </div>
            </div>
          ) : (
            <div>
              <Table
                data={dadosFiltrados}
                cols={[
                  { key: 'id', header: 'ID', width: 'w-28' },
                  { key: 'tipo', header: 'Tipo', width: 'w-32' },
                  { key: 'projeto', header: 'Projeto', width: 'min-w-[260px]' },
                  { key: 'prazo', header: 'Prazo', width: 'w-32' },
                  {
                    key: 'status',
                    header: 'Status',
                    width: 'w-40',
                    render: (r: Rel) => (
                      <span className={badgeClass(r.status)}>{r.status}</span>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= COMPONENTES AUX ================= */

function KPI({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color?: 'success' | 'warning' | 'danger'
}) {
  const colorMap: any = {
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-light p-5 shadow-card">
      <div className="text-xs text-neutral mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color ? colorMap[color] : 'text-primary'}`}>
        {value}
      </div>
    </div>
  )
}

function QuickAction({
  title,
  count,
  description,
  onSend,
  onView,
}: {
  title: string
  count: number
  description: string
  onSend: () => void
  onView: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-light p-7 shadow-card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold text-primary">{title}</h3>
        <span className="text-lg font-bold">{count}</span>
      </div>
      <p className="text-sm text-neutral mb-5">{description}</p>
      <div className="flex gap-3">
        <button className="btn btn-primary px-5 py-2.5 text-sm" onClick={onSend}>
          Enviar
        </button>
        <button
          className="px-5 py-2.5 rounded-xl border border-neutral-light text-sm font-semibold"
          onClick={onView}
        >
          Consultar
        </button>
      </div>
    </div>
  )
}
