import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"


type ArchiveItem = {
  period: string
  title: string
  link: string
  volumes?: {
    label: string
    link: string
  }[]
}


const ARCHIVES: ArchiveItem[] = [
  {
    period: "2023–2024",
    title: "XXXII ENIC",
    link: "https://periodicos.ufpb.br/index.php/enic/issue/view/3285",
  },
  {
    period: "2022–2023",
    title: "XXXI ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/AnaisEnic2023XXXIENICVig20222023.pdf",
  },
  {
    period: "2021–2022",
    title: "XXX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/anais-enic-2022-xxx-enic-vig-2021-2022.pdf",
  },
  {
    period: "2020–2021",
    title: "XXIX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/anais-enic-2021-xxix-enic-vig-2020-2021.pdf",
  },
  {
    period: "2019–2020",
    title: "XXVIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/anais-enic-2020-xxviii-enic-vig-2019-2020.pdf",
  },
  {
    period: "2018–2019",
    title: "XXVII ENIC",
    link: "https://drive.google.com/file/d/1VgmdBxefA-uKCMx8O7ou3dGOJEPloSui/view",
  },
  {
    period: "2017–2018",
    title: "XXVI ENIC",
    link: "https://drive.google.com/file/d/1ai1A_CXF-C1rqrC-L_QaGHyVVFjnBfj_/view",
  },
  {
    period: "2016–2017",
    title: "XXV ENIC",
    link: "https://drive.google.com/file/d/1bLwnBRFqU5p6NXpw3PLM65I5t6KkXeVc/view",
  },
  {
    period: "2015–2016",
    title: "XXIV ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/anais_xxiv_enic_catalogado_final.pdf",
  },
  {
    period: "2014–2015",
    title: "XXIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/anais_xxiii_enic_final.pdf",
  },
  {
    period: "2013–2014",
    title: "XXII ENIC",
    link: "#",
  },
  {
    period: "2012–2013",
    title: "XXI ENIC",
    link: "#",
  },
  {
    period: "2011–2012",
    title: "XX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xx_enic_livro_de_resumos.pdf",
  },
  {
    period: "2010–2011",
    title: "XIX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/XIX_ENIC_2011_Livro_Resumos.pdf",
  },
  {
    period: "2009–2010",
    title: "XVIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xviii_enic_2010_livro_resumos.pdf",
  },
  {
    period: "2008–2009",
    title: "XVII ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xvii-2009-livro_exatas-v1.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xvii-2009-livro_vida-v2.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xvii-2009-livro_humanas-v3.pdf" },
    ],
  },
  {
    period: "2007–2008",
    title: "XVI ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xvi-2008-livro_resumos_exatas-v1.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xvi-2008-livro_resumos_vida-v2.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xvi-2008-livro_resumos_humanas-v3.pdf" },
    ],
  },
  {
    period: "2006–2007",
    title: "XV ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/livro_enic_2007_exatas-v1.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/livro_enic_2007_vida-v2.pdf" },
      { label: "Vol. 03", link: "#" },
    ],
  },
  {
    period: "2005–2006",
    title: "XIV ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/livro_enic_2006.pdf",
  },
  {
    period: "2004–2005",
    title: "XIII ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/2005-livro_exatas-v1.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/2005-livro_vida-v2.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/2005-livro_humanas-v3.pdf" },
    ],
  },
  {
    period: "2003–2004",
    title: "XII ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xii-2004-livro_exatas.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xii-2004-livro_vida.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xii-2004-livro_humanas.pdf" },
    ],
  },
  {
    period: "2002–2003",
    title: "XI ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xi-2003-livro_exatas.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xi-2003-livro_vida.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/xi-2003-livro_humanas.pdf" },
    ],
  },
  {
    period: "2001–2002",
    title: "X ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/x-2002-livro_exatas.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/x-2002-livro_vida.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/x-2002-livro_humanas.pdf" },
    ],
  },
  {
    period: "2000–2001",
    title: "IX ENIC",
    link: "#",
    volumes: [
      { label: "Vol. 01", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/ix-2001-livro_exatas.pdf" },
      { label: "Vol. 02", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/ix-2001-livro_vida.pdf" },
      { label: "Vol. 03", link: "https://www.propesq.ufpb.br/propesq/contents/downloads/enic/ix-2001-livro_humanas.pdf" },
    ],
  },
]


const Papers: React.FC = () => {
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
          Anais de Iniciação Científica
        </h1>

      <div className="mt-3 mb-3 w-20 h-[4px] bg-accent rounded-full" />

        {/* Texto */}
        <div className="max-w-4xl text-neutral text-base leading-relaxed mb-6">
          <p>
            Coletânea de resumos dos trabalhos apresentados nos Encontros de
            Iniciação Científica (ENIC), promovidos pela Universidade Federal da
            Paraíba.
          </p>
        </div>

        {/* Link externo */}
        <p className="text-sm text-neutral mb-12">
          Mais informações no site oficial:{" "}
          <a
            href="#"
            className="text-primary font-medium hover:underline"
          >
            www.propesq.ufpb.br/enic
          </a>
        </p>

        {/* Arquivos */}
        <div>
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
                    Livro de Resumos
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
                        {/* Livro principal */}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary font-medium hover:underline"
                        >
                          {item.title}
                        </a>

                        {/* Volumes (se existirem) */}
                        {item.volumes && (
                          <div className="text-xs text-primary/80 flex flex-wrap gap-2">
                            {item.volumes.map((vol, i) => (
                              <a
                                key={i}
                                href={vol.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {vol.label}
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
      </div>
    </section>
  )
}

export default Papers
