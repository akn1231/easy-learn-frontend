import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { PrimeReactProvider } from 'primereact/api'

import AppLayout from '@/components/layout/AppLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const SentencesPage = lazy(() => import('@/pages/SentencesPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false, staleTime: 1000 * 60 * 2 },
  },
})

const App = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('easylearn-dark-mode') === 'true')

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleToggleDark = () => {
    setDarkMode((prev) => {
      localStorage.setItem('easylearn-dark-mode', String(!prev))
      return !prev
    })
  }

  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 14 } }} />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner fullPage message="Loading…" />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/*" element={
                <AppLayout darkMode={darkMode} onToggleDark={handleToggleDark}>
                  <Routes>
                    <Route path="/" element={<SentencesPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </PrimeReactProvider>
  )
}

export default App
