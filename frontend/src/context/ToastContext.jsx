import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();

    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 space-y-4 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              min-w-[260px] px-5 py-4 rounded-xl backdrop-blur-lg border shadow-lg
              transition-all duration-300 animate-[slideIn_0.3s_ease-out]
              ${
                toast.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : toast.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};