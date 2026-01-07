// Série Iniciados - Awarded Works component

import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

type ArchiveItem = {
  period: string
  title: string
  link?: string
  subitems?: {
    label: string
    link?: string
  }[]
}


const ARCHIVES: ArchiveItem[] = [
  {
    period: "2022–2023",
    title: "Vol. 29 · XXXI ENIC",
    link: "https://periodicos.ufpb.br/index.php/enic/issue/view/3307",
  },
  {
    period: "2021–2022",
    title: "Vol. 28 · XXX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados-vol-28-2022-xxx-enic-2021-2022.pdf",
  },
  {
    period: "2020–2021",
    title: "Vol. 27 · XXIX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados-vol-27-2021-xxix-enic-2020-2021.pdf",
  },
  {
    period: "2019–2020",
    title: "Vol. 26 · XXVIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados-vol-26-2020-xxviii-2019-2020.pdf",
  },
  {
    period: "2018–2019",
    title: "Vol. 25 · XXVII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciadosvol25.pdf",
  },
  {
    period: "2017–2018",
    title: "Vol. 24 · XXVI ENIC",
    link: "https://drive.google.com/file/d/1qMdl1gdAwDYndwko6FMtfiPEOqPmQbff/view",
  },
  {
    period: "2016–2017",
    title: "Vol. 23 · XXV ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol23_2018_enic2017.pdf",
    subitems: [
      { label: "Revista Eletrônica", link: "https://viewer.joomag.com/s%C3%A9rie-iniciados-vol-23/0985563001533823944?short&" },
    ],
  },
  {
    period: "2012–2016",
    title: "Série Especial (Vols. 19, 20, 21, 22)",
    link: "#",
    subitems: [
      { label: "XXI, XXII, XXIII, XXIV ENIC", link: "#" },
    ],
  },
  {
    period: "2011–2012",
    title: "Vol. 18 · XX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol18_2013_enic2012.pdf",
  },
  {
    period: "2010–2011",
    title: "Vol. 17 · XIX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol17_xix_enic.pdf",
  },
  {
    period: "2009–2010",
    title: "Vol. 16 · XVIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol16_xviii_enic.pdf",
  },
  {
    period: "2008–2009",
    title: "Vol. 15 · XVII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol15_xvii_enic.pdf",
  },
  {
    period: "2007–2008",
    title: "CD-ROM",
    link: "#",
  },
  {
    period: "2006–2007",
    title: "Vol. 13 · XV ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/livros_iniciados_2008.pdf",
  },
]

const AwardedWorks: React.FC = () => {
  const navigate = useNavigate()
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Botão voltar */}
        <button
          onClick={() => navigate(-1)}
          className="
            inline-flex items-center gap-2
            text-sm font-medium text-primary
            hover:underline
            mb-6
          "
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
          Série Iniciados — Trabalhos premiados
        </h1>

        <div className="mt-3 mb-3 w-20 h-[4px] bg-accent rounded-full" />

        {/* Texto */}
        <div className="max-w-4xl text-neutral text-base leading-relaxed mb-6">
          <p>
            Coletânea dos trabalhos premiados apresentados nos Encontros de
            Iniciação Científica (ENIC), publicados no âmbito da Série Iniciados.
          </p>
        </div>

        {/* Link externo */}
        <p className="text-sm text-neutral mb-12">
          Para mais informações, acesse o site oficial do evento:{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            www.propesq.ufpb.br/enic
          </a>
        </p>

        {/* Arquivos */}
        <h2 className="text-lg font-semibold text-primary mb-4 tracking-wide">
          ARQUIVOS
        </h2>

        <div className="overflow-hidden rounded-xl border border-neutral-light">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-neutral-light text-xs md:text-sm text-neutral">
                <th className="text-left px-6 py-3 font-medium border-r border-neutral-light">
                  Vigência
                </th>
                <th className="text-left px-6 py-3 font-medium">
                  Série Iniciados
                </th>
              </tr>
            </thead>

            <tbody>
              {ARCHIVES.map((item, index) => (
                <tr key={index} className="border-t border-neutral-light">
                  <td className="px-6 py-5 font-medium text-primary border-r border-neutral-light align-top">
                    {item.period}
                  </td>

                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      {item.link ? (
                        <a
                          href={item.link}
                          className="block text-primary font-medium hover:underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="block font-medium text-primary">
                          {item.title}
                        </span>
                      )}

                      {item.subitems && (
                        <div className="text-xs text-primary/80 space-y-1">
                          {item.subitems.map((sub, i) => (
                            <a
                              key={i}
                              href={sub.link}
                              className="block hover:underline"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AwardedWorks
