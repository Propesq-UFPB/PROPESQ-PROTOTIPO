// src/landing/LandingLayout.tsx
import { Outlet } from "react-router-dom"
import HeaderLanding from "./HeaderLanding"

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-ufpb-light text-ufpb-dark">
      <HeaderLanding />

      <main>
        <Outlet />
      </main>

      <footer className="px-2 py-4 text-center text-sm text-white bg-primary">
        © {new Date().getFullYear()} UFPB • PROPESQ
      </footer>
    </div>
  )
}
