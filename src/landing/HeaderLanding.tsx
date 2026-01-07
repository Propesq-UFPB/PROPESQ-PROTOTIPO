import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "@/utils/img/logo_propesq.png"

type MenuItem = {
  label: string
  id: string
}

const leftMenu: MenuItem[] = [
  { label: "Sobre", id: "about" },
  { label: "Editais", id: "proposals" },
  { label: "Notícias", id: "news" },
  { label: "Publicações", id: "publications" },
]

const rightMenu: MenuItem[] = [
  { label: "Sistemas", id: "systems" },
  { label: "FAQ", id: "faq" },
  { label: "Contato", id: "contact" },
]

export default function HeaderLanding() {
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ robusto: ignora maiúsculas/minúsculas e variações comuns
  const path = location.pathname.toLowerCase()
  const isExternalLandingPage =
    path === "/awardedworks" ||
    path === "/awarded-works" ||
    path === "/papers"

  const scrollToSection = (id: string) => {
    // Se estiver na home, só faz scroll local mesmo
    if (!isExternalLandingPage && (path === "/" || path === "")) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      return
    }

    // ✅ caso "externo": navega para HOME com hash
    // isso garante que quando a home montar, ela sabe pra onde rolar
    navigate({ pathname: "/", hash: `#${id}` }, { replace: false })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-light">
      <nav className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-center gap-10">
        {/* ESQUERDA */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-primary">
          {leftMenu.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="transition-colors hover:text-primary-light"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* LOGO — centro */}
        <button
          onClick={() => scrollToSection("about")}
          aria-label="Ir para seção institucional"
          className="flex items-center"
        >
          <img src={logo} alt="PROPESQ" className="h-12 w-auto select-none" />
        </button>

        {/* DIREITA */}
        <div className="flex items-center gap-4">
          <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-primary">
            {rightMenu.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="transition-colors hover:text-primary-light"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ENTRAR */}
          <Link
            to="/login"
            className="
              px-3 py-1 rounded-md text-sm font-semibold
              text-primary border border-primary/30
              hover:bg-primary hover:text-white
              transition-colors
              whitespace-nowrap
            "
          >
            Entrar
          </Link>
        </div>
      </nav>
    </header>
  )
}
