import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileText,
  Gavel,
  RefreshCcw,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

type ProjectStatus = "APROVADO" | "REPROVADO" | "PENDENTE";
type PlanStatus = "APROVADO" | "NAO_APROVADO" | "PENDENTE";

type WorkPlan = {
  id: string;
  title: string;
  student: string;
  status: PlanStatus;
  opinion: string;
};

type EvaluationConsolidationItem = {
  id: string;
  code: string;
  projectTitle: string;
  area: string;
  subarea: string;
  evaluatorOne: string;
  evaluatorTwo: string;
  scoreOne: number | null;
  scoreTwo: number | null;
  opinionOne: string;
  opinionTwo: string;
  plans: WorkPlan[];
  consolidated: boolean;
  thirdEvaluatorRequired: boolean;
};

const evaluations: EvaluationConsolidationItem[] = [
  {
    id: "1",
    code: "PIBIC-2026-001",
    projectTitle:
      "Uso de Inteligência Artificial para Apoio à Acessibilidade em Ambientes Educacionais",
    area: "Ciências Exatas e da Terra",
    subarea: "Ciência da Computação",
    evaluatorOne: "Avaliador 01",
    evaluatorTwo: "Avaliador 02",
    scoreOne: 8.5,
    scoreTwo: 7.8,
    opinionOne:
      "Projeto bem estruturado, com objetivos claros, metodologia compatível e boa aderência ao edital.",
    opinionTwo:
      "A proposta apresenta relevância acadêmica e plano de execução adequado ao período de vigência.",
    plans: [
      {
        id: "p1",
        title: "Desenvolvimento de módulo de tradução automática",
        student: "Discente vinculado 01",
        status: "APROVADO",
        opinion: "Plano adequado aos objetivos do projeto.",
      },
      {
        id: "p2",
        title: "Avaliação de usabilidade da interface",
        student: "Discente vinculado 02",
        status: "APROVADO",
        opinion: "Plano compatível com a proposta.",
      },
    ],
    consolidated: false,
    thirdEvaluatorRequired: false,
  },
  {
    id: "2",
    code: "PIBIC-2026-014",
    projectTitle:
      "Análise de Dados Aplicada ao Monitoramento de Indicadores Institucionais",
    area: "Ciências Sociais Aplicadas",
    subarea: "Administração Pública",
    evaluatorOne: "Avaliador 03",
    evaluatorTwo: "Avaliador 04",
    scoreOne: 9.0,
    scoreTwo: 6.5,
    opinionOne:
      "Projeto relevante, com boa fundamentação e forte potencial de contribuição institucional.",
    opinionTwo:
      "A proposta é interessante, mas a metodologia precisa de maior detalhamento operacional.",
    plans: [
      {
        id: "p3",
        title: "Construção de painel de indicadores",
        student: "Discente vinculado 03",
        status: "APROVADO",
        opinion: "Plano aprovado, com ajustes menores recomendados.",
      },
      {
        id: "p4",
        title: "Tratamento e documentação dos dados",
        student: "Discente vinculado 04",
        status: "NAO_APROVADO",
        opinion: "Plano insuficiente quanto ao detalhamento das atividades.",
      },
    ],
    consolidated: false,
    thirdEvaluatorRequired: true,
  },
  {
    id: "3",
    code: "PIBIC-2026-027",
    projectTitle:
      "Estudo Experimental sobre Métodos de Ensino em Cursos de Graduação",
    area: "Ciências Humanas",
    subarea: "Educação",
    evaluatorOne: "Avaliador 05",
    evaluatorTwo: "Avaliador 06",
    scoreOne: 6.8,
    scoreTwo: 6.5,
    opinionOne:
      "Projeto possui mérito, mas apresenta fragilidades na delimitação metodológica.",
    opinionTwo:
      "A proposta precisa de maior clareza nos critérios de análise e nos resultados esperados.",
    plans: [
      {
        id: "p5",
        title: "Aplicação de questionários e análise qualitativa",
        student: "Discente vinculado 05",
        status: "PENDENTE",
        opinion: "Aguardando parecer final do plano.",
      },
    ],
    consolidated: true,
    thirdEvaluatorRequired: false,
  },
];

function calculateDifference(scoreOne: number | null, scoreTwo: number | null) {
  if (scoreOne === null || scoreTwo === null) return null;
  return Math.abs(scoreOne - scoreTwo);
}

function calculateAverage(scoreOne: number | null, scoreTwo: number | null) {
  if (scoreOne === null || scoreTwo === null) return null;
  return (scoreOne + scoreTwo) / 2;
}

function getProjectStatus(average: number | null): ProjectStatus {
  if (average === null) return "PENDENTE";
  return average >= 7 ? "APROVADO" : "REPROVADO";
}

function formatScore(score: number | null) {
  if (score === null) return "—";
  return score.toFixed(1).replace(".", ",");
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles = {
    APROVADO:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    REPROVADO:
      "border-red-200 bg-red-50 text-red-700",
    PENDENTE:
      "border-amber-200 bg-amber-50 text-amber-700",
  };

  const label = {
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    PENDENTE: "Pendente",
  };

  const Icon =
    status === "APROVADO"
      ? CheckCircle2
      : status === "REPROVADO"
        ? XCircle
        : AlertTriangle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <Icon size={13} />
      {label[status]}
    </span>
  );
}

function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const styles = {
    APROVADO:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    NAO_APROVADO:
      "border-red-200 bg-red-50 text-red-700",
    PENDENTE:
      "border-amber-200 bg-amber-50 text-amber-700",
  };

  const label = {
    APROVADO: "Aprovado",
    NAO_APROVADO: "Não aprovado",
    PENDENTE: "Pendente",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-2 text-primary">
          {icon}
        </div>

        <div>
          <p className="text-sm text-neutral">{label}</p>
          <strong className="mt-1 block text-2xl font-bold text-primary">
            {value}
          </strong>
          <p className="mt-1 text-xs text-neutral">{helper}</p>
        </div>
      </div>
    </div>
  );
}

export default function EvaluationConsolidation() {
  const totalProjects = evaluations.length;

  const consolidatedProjects = evaluations.filter(
    (item) => item.consolidated
  ).length;

  const discrepancyProjects = evaluations.filter((item) => {
    const difference = calculateDifference(item.scoreOne, item.scoreTwo);
    return difference !== null && difference >= 2;
  }).length;

  const pendingThirdEvaluator = evaluations.filter(
    (item) => item.thirdEvaluatorRequired
  ).length;

  return (
    <div className="min-h-screen bg-neutral-light">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <Link
              to="/adm/avaliacao"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/30 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar para Avaliação
            </Link>
          </div>

          <section className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <ClipboardCheck size={14} />
                  Consolidação das avaliações
                </div>

                <h1 className="text-2xl font-bold text-primary md:text-3xl">
                  Consolidação das Avaliações
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral">
                  Consolide as notas atribuídas pelos avaliadores, acompanhe
                  discrepâncias entre pareceres, verifique a situação dos planos
                  de trabalho e registre o resultado final dos projetos.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 lg:max-w-sm">
                <div className="flex gap-2">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <p>
                    Projetos com diferença maior ou igual a{" "}
                    <strong>2 pontos</strong> devem ser revisados e podem exigir
                    terceiro avaliador antes da consolidação.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<FileText size={18} />}
              label="Projetos avaliados"
              value={String(totalProjects)}
              helper="Com duas avaliações registradas ou em análise."
            />

            <MetricCard
              icon={<BadgeCheck size={18} />}
              label="Consolidados"
              value={String(consolidatedProjects)}
              helper="Resultados finais já confirmados."
            />

            <MetricCard
              icon={<AlertTriangle size={18} />}
              label="Com discrepância"
              value={String(discrepancyProjects)}
              helper="Diferença maior ou igual a 2 pontos."
            />

            <MetricCard
              icon={<UserCheck size={18} />}
              label="3º avaliador"
              value={String(pendingThirdEvaluator)}
              helper="Projetos que exigem nova avaliação."
            />
          </section>

          <section className="rounded-3xl border border-neutral/10 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-neutral/10 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  Projetos para consolidação
                </h2>
                <p className="mt-1 text-sm text-neutral">
                  A média final do projeto é calculada a partir das notas dos
                  avaliadores. O projeto é aprovado quando a média for igual ou
                  superior a 7,0.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral/20 bg-white px-4 py-2.5 text-sm font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
              >
                <RefreshCcw size={16} />
                Atualizar lista
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-neutral-light/70 text-xs uppercase tracking-wide text-neutral">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Projeto</th>
                    <th className="px-5 py-4 font-semibold">Avaliadores</th>
                    <th className="px-5 py-4 font-semibold">Notas</th>
                    <th className="px-5 py-4 font-semibold">Diferença</th>
                    <th className="px-5 py-4 font-semibold">Média final</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Planos</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral/10">
                  {evaluations.map((item) => {
                    const difference = calculateDifference(
                      item.scoreOne,
                      item.scoreTwo
                    );

                    const average = calculateAverage(
                      item.scoreOne,
                      item.scoreTwo
                    );

                    const projectStatus = getProjectStatus(average);
                    const hasDiscrepancy =
                      difference !== null && difference >= 2;

                    return (
                      <tr key={item.id} className="align-top">
                        <td className="px-5 py-5">
                          <div className="max-w-sm">
                            <p className="text-xs font-semibold text-neutral">
                              {item.code}
                            </p>

                            <h3 className="mt-1 font-semibold leading-5 text-primary">
                              {item.projectTitle}
                            </h3>

                            <p className="mt-2 text-xs text-neutral">
                              {item.area} • {item.subarea}
                            </p>

                            {hasDiscrepancy ? (
                              <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                                <AlertTriangle size={14} />
                                Discrepância maior ou igual a 2 pontos
                              </div>
                            ) : null}

                            {item.thirdEvaluatorRequired ? (
                              <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                                <Gavel size={14} />
                                Necessita terceiro avaliador
                              </div>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="space-y-2">
                            <div className="rounded-xl border border-neutral/10 bg-neutral-light/50 p-3">
                              <p className="text-xs text-neutral">
                                Avaliador 1
                              </p>
                              <p className="font-semibold text-primary">
                                {item.evaluatorOne}
                              </p>
                            </div>

                            <div className="rounded-xl border border-neutral/10 bg-neutral-light/50 p-3">
                              <p className="text-xs text-neutral">
                                Avaliador 2
                              </p>
                              <p className="font-semibold text-primary">
                                {item.evaluatorTwo}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-neutral">
                                Nota avaliador 1
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {formatScore(item.scoreOne)}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-neutral">
                                Nota avaliador 2
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {formatScore(item.scoreTwo)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                              hasDiscrepancy
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {difference === null
                              ? "—"
                              : formatScore(difference)}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xl font-bold text-primary">
                            {formatScore(average)}
                          </p>
                          <p className="mt-1 text-xs text-neutral">
                            Média das avaliações
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={projectStatus} />

                          {item.consolidated ? (
                            <p className="mt-2 text-xs font-medium text-emerald-700">
                              Resultado consolidado
                            </p>
                          ) : (
                            <p className="mt-2 text-xs text-neutral">
                              Aguardando consolidação
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <div className="space-y-3">
                            {item.plans.map((plan) => (
                              <div
                                key={plan.id}
                                className="rounded-xl border border-neutral/10 bg-neutral-light/50 p-3"
                              >
                                <p className="font-medium leading-5 text-primary">
                                  {plan.title}
                                </p>

                                <p className="mt-1 text-xs text-neutral">
                                  {plan.student}
                                </p>

                                <div className="mt-2">
                                  <PlanStatusBadge status={plan.status} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-col items-end gap-2">
                            <Link
                              to={`/adm/projetos/${item.id}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-neutral/20 bg-white px-3 py-2 text-xs font-semibold text-neutral transition hover:border-primary/30 hover:text-primary"
                            >
                              <Eye size={14} />
                              Ver projeto
                            </Link>

                            <button
                              type="button"
                              disabled={
                                item.consolidated ||
                                item.thirdEvaluatorRequired
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral/30"
                            >
                              <ClipboardCheck size={14} />
                              Consolidar resultado
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            {evaluations.map((item) => {
              const difference = calculateDifference(
                item.scoreOne,
                item.scoreTwo
              );

              const average = calculateAverage(item.scoreOne, item.scoreTwo);
              const projectStatus = getProjectStatus(average);

              return (
                <article
                  key={`parecer-${item.id}`}
                  className="rounded-3xl border border-neutral/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-neutral">
                        {item.code}
                      </p>

                      <h3 className="mt-1 font-semibold text-primary">
                        Pareceres do projeto
                      </h3>
                    </div>

                    <StatusBadge status={projectStatus} />
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-neutral/10 bg-neutral-light/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                        Avaliador 1 — Nota {formatScore(item.scoreOne)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral">
                        {item.opinionOne}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-neutral/10 bg-neutral-light/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                        Avaliador 2 — Nota {formatScore(item.scoreTwo)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral">
                        {item.opinionTwo}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-primary">
                      Resultado calculado
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-neutral">Diferença</p>
                        <p className="font-bold text-primary">
                          {difference === null
                            ? "—"
                            : formatScore(difference)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral">Média final</p>
                        <p className="font-bold text-primary">
                          {formatScore(average)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral">Condição</p>
                        <p className="font-bold text-primary">
                          Nota mínima 7,0
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}