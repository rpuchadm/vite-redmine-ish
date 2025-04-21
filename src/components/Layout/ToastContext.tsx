import { createContext, useContext, useState } from "react"
import Toast from "react-bootstrap/Toast"
import ToastContainer from "react-bootstrap/ToastContainer"

interface ToastData {
  id: number
  header: string
  body: string
  variant: string
}

interface ToastContextType {
  addToast: (header: string, body: string, variant: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: React.ReactNode
}
const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (header: string, body: string, variant: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, header, body, variant }])
    // Auto-eliminar el toast después de 5 segundos
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Renderizar toasts activos */}
      <ToastContainer position="top-center">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.variant}
            onClose={() => removeToast(toast.id)}
            autohide
          >
            <Toast.Header>{toast.header}</Toast.Header>
            <Toast.Body>{toast.body}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

// 3. Exportar el hook personalizado (useToast)
const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider")
  }
  return context
}

export { ToastProvider, useToast }
