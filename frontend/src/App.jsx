import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TransactionPage from './pages/TransactionPage'
import NotFoundPage from './pages/NotFoundPage'
import Header from './components/ui/Header'

function App() {
  // temporary code
  const authUser = true
  // temporary code
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
