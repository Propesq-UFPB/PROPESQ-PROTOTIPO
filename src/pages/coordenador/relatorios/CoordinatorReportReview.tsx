import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Mail,
  Send,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

type ReportStatus = "aprovado" | "pendente" | "ajustes";

type ReportType = "Parcial" | "Final";

interface ReportSection {
  title: string;
  content: string;
}

interface CoordinatorReport {
  id: number;
  title: string;
  type: ReportType;
  status: ReportStatus;
  submittedAt: string;
  reviewedAt?: string;
  project: {
    title: string;
    edital: string;
    area: string;
    coordinator: string;
  };
  student: {
    name: string;
    registration: string;
    course: string;
    email: string;
  };
  workPlan: {
    title: string;
    modality: string;
    period: string;
  };
  sections: ReportSection[];
  review?: {
    reviewer: string;
    decision: string;
    comment: string;
  };
}

const mockReport: CoordinatorReport = {
  id: 1,
  title: "Relatório Parcial de Atividades",
  type: "Parcial",
  status: "pendente",
  submittedAt: "10/05/2026",
  project: {
    title: "Tradução Automática entre Português e Libras com Apoio de IA",
    edital: "PIBIC 2025/2026",
    area: "Ciência da Computação",
    coordinator: "Prof. Dr. João Almeida",
  },
  student: {
    name: "Maria Eduarda Santos",
    registration: "20230012345",
    course: "Ciência de Dados e Inteligência Artificial",
    email: "maria.santos@academico.ufpb.br",
  },
  workPlan: {
    title: "Modelagem e avaliação de representações visuais para sinais em Libras",
    modality: "Iniciação Científica",
    period: "2025 - 2026",
  },
  sections: [
    {
      title: "Resumo das atividades desenvolvidas",
      content:
        "Durante o período avaliado, foram realizadas atividades relacionadas ao levantamento bibliográfico, organização dos dados, estudo das técnicas de pré-processamento e construção inicial dos experimentos. Também foram conduzidas reuniões periódicas para acompanhamento das etapas previstas no plano de trabalho.",
    },
    {
      title: "Objetivos alcançados",
      content:
        "Foram alcançados os objetivos referentes à revisão da literatura, definição do pipeline experimental, organização preliminar da base de dados e implementação inicial dos módulos de processamento.",
    },
    {
      title: "Metodologia utilizada",
      content:
        "A metodologia envolveu análise bibliográfica, preparação dos dados, definição de critérios de avaliação e implementação computacional dos experimentos. As etapas foram conduzidas de forma incremental, com validação dos resultados parciais.",
    },
    {
      title: "Resultados parciais",
      content:
        "Os resultados parciais indicam avanço satisfatório em relação ao cronograma previsto, especialmente na estruturação da base experimental e na identificação de técnicas promissoras para continuidade da pesquisa.",
    },
    {
      title: "Dificuldades encontradas",
      content:
        "As principais dificuldades envolveram ajustes na padronização dos dados e definição dos critérios de avaliação mais adequados para comparação dos experimentos.",
    },
    {
      title: "Próximas etapas",
      content:
        "As próximas etapas incluem a finalização dos experimentos, análise quantitativa dos resultados, refinamento metodológico e preparação do relatório final.",
    },
  ],
};

const statusConfig: Record<
  ReportStatus,
  {
    label: string;
    className: string;
  }
> = {
  aprovado: {
    label: "Aprovado",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pendente: {
    label: "Pendente de parecer",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  ajustes: {
    label: "Ajustes solicitados",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

export default function CoordinatorReportView() {
  const { id } = useParams();
  const [opinion, setOpinion] = useState("");

  const report = mockReport;
  const status = statusConfig[report.status];

  function handleSubmitOpinion() {
    console.log({
      reportId: id ?? report.id,
      opinion,
    });
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* VOLTAR */}
          <div className="flex items-center justify-between">
            <Link
              to="/coordenador/relatorios"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para relatórios
            </Link>
          </div>

          {/* HEADER */}
          <section className="w-full rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <FileText size={14} />
                  Visualização de relatório
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-primary md:text-3xl">
                    {report.title}
                  </h1>

                  <p className="max-w-3xl text-sm leading-6 text-neutral">
                    Consulte as informações enviadas pelo discente, os dados do
                    plano de trabalho e registre o parecer do coordenador.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    <CheckCircle2 size={14} />
                    {status.label}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                    <ClipboardList size={14} />
                    Relatório {report.type}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral/20 bg-neutral-light px-3 py-1 text-xs font-semibold text-neutral">
                    <CalendarDays size={14} />
                    Enviado em {report.submittedAt}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* INFORMAÇÕES PRINCIPAIS */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* PROJETO */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-primary">Projeto</h2>
                  <p className="text-xs text-neutral">
                    Informações vinculadas ao relatório
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Título" value={report.project.title} />
                <InfoItem label="Edital" value={report.project.edital} />
                <InfoItem label="Área" value={report.project.area} />
                <InfoItem
                  label="Coordenador"
                  value={report.project.coordinator}
                />
              </div>
            </div>

            {/* DISCENTE */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-primary">Discente</h2>
                  <p className="text-xs text-neutral">
                    Dados do responsável pelo envio
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Nome" value={report.student.name} />
                <InfoItem
                  label="Matrícula"
                  value={report.student.registration}
                />
                <InfoItem label="Curso" value={report.student.course} />

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-neutral/70">
                    E-mail
                  </span>

                  <a
                    href={`mailto:${report.student.email}`}
                    className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Mail size={14} />
                    {report.student.email}
                  </a>
                </div>
              </div>
            </div>

            {/* PLANO DE TRABALHO */}
            <div className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-primary">
                    Plano de trabalho
                  </h2>
                  <p className="text-xs text-neutral">
                    Dados acadêmicos do plano
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoItem label="Título" value={report.workPlan.title} />
                <InfoItem label="Modalidade" value={report.workPlan.modality} />
                <InfoItem label="Período" value={report.workPlan.period} />
                <InfoItem label="Tipo de relatório" value={report.type} />
              </div>
            </div>
          </section>

          {/* CONTEÚDO DO RELATÓRIO */}
          <section className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary">
                  Conteúdo enviado
                </h2>
                <p className="text-sm text-neutral">
                  Seções preenchidas pelo discente no relatório.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {report.sections.map((section, index) => (
                <article
                  key={section.title}
                  className="rounded-2xl border border-neutral/20 bg-neutral-light/40 p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>

                    <h3 className="text-sm font-bold text-primary">
                      {section.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-7 text-neutral">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* PARECER DO COORDENADOR */}
          <section className="rounded-3xl border border-neutral/20 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-primary">
                Parecer do coordenador
              </h2>

              <p className="mt-1 text-sm text-neutral">
                Registre abaixo o parecer referente ao relatório enviado pelo
                discente.
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={opinion}
                onChange={(event) => setOpinion(event.target.value)}
                rows={7}
                placeholder="Digite o parecer do coordenador..."
                className="w-full resize-none rounded-2xl border border-neutral/30 bg-white px-4 py-3 text-sm leading-6 text-neutral outline-none transition placeholder:text-neutral/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitOpinion}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!opinion.trim()}
                >
                  <Send size={16} />
                  Enviar parecer
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-wide text-neutral/70">
        {label}
      </span>

      <p className="mt-1 text-sm font-medium leading-6 text-neutral">
        {value}
      </p>
    </div>
  );
}