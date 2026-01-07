import { Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Landing
import LandingHome from "./landing"
import LandingLayout from "./landing/LandingLayout"

// Landing / Publications
import Publications from "./landing/Publications"
import Papers from "./landing/Papers"
import AwardedWorks from "./landing/AwardedWorks"

// Sistema
import AppHeader from "./components/AppHeader"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import MyProjects from "./pages/MyProjects"
import ProjectForm from "./pages/ProjectForm"
import Plans from "./pages/Plans"
import PlanForm from "./pages/PlanForm"
import Evaluations from "./pages/Evaluations"
import EvaluationDetail from "./pages/EvaluationDetail"
import Monitoring from "./pages/Monitoring"
import Reports from "./pages/Reports"
import Certificates from "./pages/Certificates"
import CertificateView from "./pages/CertificateView"
import AdminAnalytics from "./pages/AdminAnalytics"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
    <AppHeader />
    <main className="p-4 md:p-6">{children}</main>
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* 🌐 LANDING PÚBLICA */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingHome />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/anais" element={<Papers />} />
          <Route path="/publications/iniciados" element={<AwardedWorks />} />
        </Route>

        {/* 🔐 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 SISTEMA */}
        <Route path="/dashboard" element={<Protected><Shell><Dashboard /></Shell></Protected>} />
        <Route path="/projetos" element={<Protected><Shell><Projects /></Shell></Protected>} />
        <Route path="/meus-projetos" element={<Protected><Shell><MyProjects /></Shell></Protected>} />
        <Route path="/novo-projeto" element={<Protected><Shell><ProjectForm /></Shell></Protected>} />
        <Route path="/planos" element={<Protected><Shell><Plans /></Shell></Protected>} />
        <Route path="/novo-plano" element={<Protected><Shell><PlanForm /></Shell></Protected>} />
        <Route path="/avaliacoes" element={<Protected><Shell><Evaluations /></Shell></Protected>} />
        <Route path="/avaliacoes/:id" element={<Protected><Shell><EvaluationDetail /></Shell></Protected>} />
        <Route path="/acompanhamento" element={<Protected><Shell><Monitoring /></Shell></Protected>} />
        <Route path="/relatorios" element={<Protected><Shell><Reports /></Shell></Protected>} />
        <Route path="/certificados" element={<Protected><Shell><Certificates /></Shell></Protected>} />
        <Route path="/certificados/:id" element={<Protected><Shell><CertificateView /></Shell></Protected>} />
        <Route path="/painel-gerencial" element={<Protected><Shell><AdminAnalytics /></Shell></Protected>} />
        <Route path="/configuracoes" element={<Protected><Shell><Settings /></Shell></Protected>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </AuthProvider>
  )
}

