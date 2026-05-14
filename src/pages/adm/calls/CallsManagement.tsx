import React from "react"
import { NavLink } from "react-router-dom"
import { NotebookPen, CalendarClock, Workflow, Clock, CheckCircle2, FileClock } from "lucide-react"

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

function EmptyList({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-neutral-light p-4 text-sm text-neutral">
      {text}
    </div>
  )
}

export default function CallsManagement() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-primary">Gestão de Editais</h1>
        <p className="text-sm text-neutral">
          Crie e publique editais, configure cronogramas e controle o workflow (estados e permissões).
        </p>
      </header>

      {/* Ações principais */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardLink
          to="/adm/calls/CreateCall"
          title="Criar Editais"
          desc="Upload do PDF, metadados, ano-base e vigência de cotas."
          icon={<NotebookPen size={18} />}
        />
        <CardLink
          to="/adm/calls/CallSchedule"
          title="Cronograma"
          desc="Defina datas para submissão, indicação, relatórios e ENIC."
          icon={<CalendarClock size={18} />}
        />
        <CardLink
          to="/adm/calls/CallWorkflow"
          title="Gestão de Estados (Workflow)"
          desc="Estados controlam permissões de submissão, indicação e avaliação."
          icon={<Workflow size={18} />}
        />
      </section>

      {/* Listas (placeholders) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileClock size={18} />
            <h2 className="text-sm font-semibold text-primary">Editais em Avaliação</h2>
          </div>
          <EmptyList text="Nenhum edital em avaliação no momento (placeholder). Conectar API depois." />
        </div>

        <div className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <h2 className="text-sm font-semibold text-primary">Editais em Vigência</h2>
          </div>
          <EmptyList text="Nenhum edital vigente no momento (placeholder)." />
        </div>

        <div className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            <h2 className="text-sm font-semibold text-primary">Editais Encerrados</h2>
          </div>
          <EmptyList text="Nenhum edital encerrado (placeholder)." />
        </div>

        <div className="rounded-xl border border-neutral-light bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileClock size={18} />
            <h2 className="text-sm font-semibold text-primary">Editais Recentes</h2>
          </div>
          <EmptyList text="Lista de editais recentes (placeholder)." />
        </div>
      </section>
    </div>
  )
}
