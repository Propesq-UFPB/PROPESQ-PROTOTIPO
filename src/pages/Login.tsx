import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth, Role } from "@/context/AuthContext"
import logo from "@/utils/img/logo_propesq.png"
import { Helmet } from "react-helmet"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const Roles: Role[] = ["DISCENTE", "COORDENADOR", "ADMINISTRADOR"]

  const initialRole = useMemo(() => {
    const fromUrl = (searchParams.get("role") || "").toUpperCase()
    if (Roles.includes(fromUrl as Role)) return fromUrl as Role

    const fromStorage = (localStorage.getItem("role") || "").toUpperCase()
    if (Roles.includes(fromStorage as Role)) return fromStorage as Role

    return "DISCENTE"
  }, [searchParams])

  const [role, setRole] = useState<Role>(initialRole)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    setRole(initialRole)
  }, [initialRole])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("role", role)
    login(email || "usuario@ufpb.br", password, role)

    if (role === "ADMINISTRADOR") navigate("/dashboard") 
    else navigate("/projetos")
  }

  return (
    <div className="
      min-h-screen
      flex flex-col
      bg-gradient-to-br
      from-neutral-light
      via-white
      to-primary/5
    ">
      <Helmet>
        <title>Login • PROPESQ UFPB</title>
      </Helmet>

      {/* CONTEÚDO */}
      <main className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="
            w-full max-w-sm
            bg-white
            rounded-2xl
            border border-neutral-light
            shadow-card
            px-6 py-7
          "
        >
          {/* HEADER */}
          <div className="flex flex-col items-center gap-3 mb-7 text-center">
            <img
              src={logo}
              alt="PROPESQ UFPB"
              className="h-10 w-auto select-none"
            />

            <div>
              <h1 className="text-base font-bold text-primary">
                Acesso à Plataforma
              </h1>
              <p className="text-xs text-neutral">
                Pró-Reitoria de Pesquisa • UFPB
              </p>
            </div>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral mb-1">
                E-mail institucional
              </label>
              <input
                type="email"
                placeholder="usuario@ufpb.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full
                  rounded-lg
                  border border-neutral-light
                  px-3 py-2
                  text-xs

                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-lighter/40
                  focus:border-primary
                "
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full
                  rounded-lg
                  border border-neutral-light
                  px-3 py-2
                  text-xs

                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary-lighter/40
                  focus:border-primary
                "
              />
            </div>
          </div>

          {/* PERFIL */}
          <div className="mt-6">
            <p className="text-[10px] font-semibold text-primary mb-2 uppercase tracking-wide">
              Perfil de acesso
            </p>

            <div className="flex flex-wrap gap-2">
              {Roles.map((r) => {
                const active = role === r

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`
                      px-3 py-1.5
                      rounded-full
                      text-[10px] font-semibold
                      border
                      transition-all duration-200

                      ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-primary border-primary/30 hover:bg-primary hover:text-white"
                      }
                    `}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
          </div>

          {/* AÇÕES */}
          <div className="mt-7 space-y-2">
            <button
              type="submit"
              className="
                w-full
                rounded-lg
                bg-primary
                text-white
                py-2.5
                text-xs font-semibold

                transition-all duration-200
                shadow-sm

                hover:bg-primary-light
                hover:shadow-md
              "
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                w-full
                rounded-lg
                border border-primary
                bg-white
                py-2.5
                text-xs font-medium
                text-primary

                transition-colors duration-200
                hover:bg-neutral-light
              "
            >
              Voltar para a página inicial
            </button>
          </div>

          {/* LINK */}
          <div className="mt-4 text-center">
            <a href="#" className="text-[10px] text-primary hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[10px] text-neutral">
        © {new Date().getFullYear()} PROPESQ • Universidade Federal da Paraíba
      </footer>
    </div>
  )
}
