import { createContext, useContext, useState } from "react"
import Toast from "react-bootstrap/Toast"
import ToastContainer from "react-bootstrap/ToastContainer"

// 1. Crear el contexto
const ToastContext = createContext()

// 2. Crear el proveedor (ToastProvider)
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (header, body, variant = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, header, body, variant }])
    // Auto-eliminar el toast después de 5 segundos
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Renderizar toasts activos */}
      <ToastContainer position="middle-center">
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
