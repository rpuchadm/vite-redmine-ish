import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
//import './index.css'
import App from "./App.tsx"
import Layout from "./components/Layout/Layout.tsx"
import AuthContainer from "./components/auth/AuthContainer.tsx"
import { ToastProvider } from "./components/Layout/ToastContext.tsx"

// Crear un cliente de React Query
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Layout>
          <br />
          <AuthContainer>
            <App />
          </AuthContainer>
        </Layout>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
)
