import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'stream-chat-react/dist/css/v2/index.css'
import './index.css'
import App from './App'
import { ConfirmProvider } from './context/ConfirmContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)