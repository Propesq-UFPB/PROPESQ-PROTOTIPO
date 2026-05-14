import React, { useMemo, useState } from "react"
import { NavLink } from "react-router-dom"
import {
  GraduationCap,
  LineChart,
  Users,
  Bell,
  ClipboardList,
  FileSignature,
  BookOpen,
  ChevronDown,
  Info,
} from "lucide-react"

type Call = {
  id: string
  title: string
  baseYear: number
  statusLabel: string
}

function CardLink({
  to,
  title,
  desc,
  icon,
}: {
  to: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className="block rounded-xl border border-neutral-light bg-white p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-neutral-light/60">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
          <p className="text-sm text-neutral mt-1">{desc}</p>
        </div>
      </div>
    </NavLink>
  )
}

export default function EvaluationScore() {
  // Mock: depois vem de API
  const [calls] = useState<Call[]>([
    { id: "call_2026_01", title: "Edital PROPESQ 01/2026", baseYear: 2026, statusLabel: "Inscrições abertas" },
    { id: "call_2026_02", title: "Edital Inovação 02/2026", baseYear: 2026, statusLabel: "Em avaliação" },
    { id: "call_2025_03", title: "PIBIC 03/2025", baseYear: 2025, statusLabel: "Resultado final" },
  ])

  const [selectedCallId, setSelectedCallId] = useState(calls[0]?.id ?? "")
  const selectedCall = useMemo(() => calls.find((c) => c.id === selectedCallId) ?? null, [calls, selectedCallId])

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Avaliação de Projetos e Pontuação</h1>
        <p className="text-sm text-neutral">
          Selecione o edital e configure regras de classificação e pontuação (IPI).
        </p>
      </header>

      {/* Contexto do edital */}
      <section className="rounded-xl border border-neutral-light bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <h2 className="text-sm font-semibold text-primary">
            Edital em configuração
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm">
            <span className="block text-xs text-neutral mb-1">
              Escolha o edital
            </span>

            <div className="relative">
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none"
              />

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

          <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4">
            <p className="text-xs text-neutral">Resumo</p>
            <p className="text-sm font-semibold text-primary">{selectedCall?.title ?? "—"}</p>
            <p className="text-xs text-neutral mt-1">
              Ano-base: <span className="font-semibold text-primary">{selectedCall?.baseYear ?? "—"}</span>
            </p>
            <p className="text-xs text-neutral mt-1">
              Status: <span className="font-semibold text-primary">{selectedCall?.statusLabel ?? "—"}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-light bg-neutral-50 p-4 flex gap-2">
          <Info size={16} className="mt-0.5 text-neutral" />
          <p className="text-xs text-neutral">
            As configurações de <span className="font-semibold">Classificação</span> e{" "}
            <span className="font-semibold">Pontuação & IPI</span> são salvas por edital.
          </p>
        </div>
      </section>

      {/* KPIs (placeholder) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Pendências abertas</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Avaliadores cadastrados</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
        <div className="rounded-xl border border-neutral-light bg-white p-5">
          <p className="text-xs text-neutral">Regras ativas (edital)</p>
          <p className="text-2xl font-bold text-primary mt-2">—</p>
        </div>
      </section>

      {/* Acessos principais */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardLink
          to="/adm/avaliacao/classificacao"
          title="Classificação"
          desc="Cálculo automático, fórmula configurável, cotas/limites e gestão de recursos."
          icon={<GraduationCap size={18} />}
        />
        <CardLink
          to="/adm/avaliacao/pontuacao"
          title="Pontuação & IPI"
          desc="Tabela de pontos por produção, validade temporal e tratamento de docentes PQ."
          icon={<LineChart size={18} />}
        />
      </section>

      {/* Outras seções do módulo
      <section className="rounded-xl border border-neutral-light bg-white p-5">
        <h2 className="text-sm font-semibold text-primary mb-3">Outras configurações do módulo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <CardLink
            to="/adm/avaliacao/banco-avaliadores"
            title="Banco de Avaliadores"
            desc="Cadastro e manutenção."
            icon={<Users size={18} />}
          />
          <CardLink
            to="/adm/avaliacao/distribuicao"
            title="Distribuição"
            desc="Distribuição de avaliações/cotas."
            icon={<ClipboardList size={18} />}
          />
          <CardLink
            to="/adm/avaliacao/pendencias"
            title="Pendências"
            desc="Monitor e disparos."
            icon={<Bell size={18} />}
          />
        </div>
      </section>*/}
    </div>
  )
}
