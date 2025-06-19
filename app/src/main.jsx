import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Wallet } from './Wallet'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wallet />
  </StrictMode>,
)
