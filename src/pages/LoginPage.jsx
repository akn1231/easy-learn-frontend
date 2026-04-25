import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'
import useAuthStore from '@/store/authStore'
import { APP_NAME, AUTH_TOKEN_KEY } from '@/constants'

const field = (label, error) => ({
  style: { width: '100%', marginTop: '0.25rem' },
  className: error ? 'p-invalid' : '',
})

const LoginPage = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      /* email: 'admin@easylearn.app', password: 'admin123' */
    },
  })

  useEffect(() => {
    if (isAuthenticated && localStorage.getItem(AUTH_TOKEN_KEY)) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    clearError()
  }, [clearError])

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--primary-color)',
              letterSpacing: '-1px',
            }}
          >
            {APP_NAME}
          </Link>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-color-secondary)',
              marginTop: '0.25rem',
            }}
          >
            Multilingual Sentence Manager
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--surface-border)',
            borderRadius: 12,
            padding: '2rem',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            Sign in to your account
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-color-secondary)',
              marginBottom: '1.5rem',
            }}
          >
            Enter your credentials to continue
          </div>

          {error && (
            <Message
              severity="error"
              text={error}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          )}

          <form
            onSubmit={handleSubmit(async (d) => {
              await login(d)
            })}
            noValidate
          >
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                }}
                render={({ field: f }) => (
                  <div style={{ position: 'relative' }}>
                    <i
                      className="pi pi-envelope"
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-color-secondary)',
                      }}
                    />
                    <InputText
                      {...f}
                      type="email"
                      placeholder="enter your email"
                      autoComplete="email"
                      {...field('Email', errors.email)}
                      style={{ width: '100%', paddingLeft: '2.25rem' }}
                    />
                  </div>
                )}
              />
              {errors.email && <small className="p-error">{errors.email.message}</small>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field: f }) => (
                  <Password
                    {...f}
                    placeholder="enter your password"
                    feedback={false}
                    toggleMask
                    autoComplete="current-password"
                    {...field('Password', errors.password)}
                    invalid={!!errors.password}
                    className={errors.password ? 'p-invalid' : '' + ' w-full'}
                  />
                )}
              />
              {errors.password && <small className="p-error">{errors.password.message}</small>}
            </div>

            <Button
              type="submit"
              label={isLoading ? 'Signing in…' : 'Sign In'}
              icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </form>

          {/* <Divider align="center"><span style={{ fontSize: '0.8rem', color: 'var(--text-color-secondary)' }}>Demo Credentials</span></Divider>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Admin', email: 'admin@easylearn.app', pass: 'admin123' },
              { label: 'Demo User', email: 'demo@easylearn.app', pass: 'demo123' },
            ].map((c) => (
              <div key={c.label} style={{ padding: '0.75rem', background: 'var(--surface-ground)', borderRadius: 8, border: '1px solid var(--surface-border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>{c.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-color-secondary)', wordBreak: 'break-all' }}>{c.email}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-color-secondary)', opacity: 0.7 }}>{c.pass}</div>
              </div>
            ))}
          </div> */}

          <p
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-color-secondary)',
            }}
          >
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
