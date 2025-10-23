import { useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: usuarios, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single()

      if (queryError) {
        throw new Error('Email o contraseña incorrectos')
      }

      if (usuarios.esta_bloqueado) {
        throw new Error('Tu cuenta ha sido bloqueada. Contacta al administrador.')
      }

      const isPasswordValid = await bcrypt.compare(password, usuarios.password_hash)

      if (!isPasswordValid) {
        throw new Error('Email o contraseña incorrectos')
      }

      const userSession = {
        id_usuario: usuarios.id_usuario,
        nombre: usuarios.nombre,
        email: usuarios.email,
        rol: usuarios.rol,
        telefono: usuarios.telefono
      }
      
      localStorage.setItem('user', JSON.stringify(userSession))

      if (usuarios.rol === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  )
}

export default Login