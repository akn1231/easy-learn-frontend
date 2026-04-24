import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import useAuthStore from '@/store/authStore'
import { APP_NAME, AUTH_TOKEN_KEY } from '@/constants'

const SignupPage = () => {
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '' },
  })

  useEffect(() => {
    if (isAuthenticated && localStorage.getItem(AUTH_TOKEN_KEY)) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => { clearError() }, [clearError])

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', letterSpacing: '-1px' }}>{APP_NAME}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', marginTop: '0.25rem' }}>Multilingual Sentence Manager</div>
        </div>

        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 12, padding: '2rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Create an account</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', marginBottom: '1.5rem' }}>Sign up to start adding and managing sentences</div>

          {error && <Message severity="error" text={error} style={{ width: '100%', marginBottom: '1rem' }} />}

          <form onSubmit={handleSubmit(async (d) => { await registerUser(d) })} noValidate>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required', maxLength: { value: 60, message: 'Name too long' } }}
                render={({ field: f }) => (
                  <div style={{ position: 'relative' }}>
                    <i className="pi pi-user" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color-secondary)' }} />
                    <InputText {...f} autoComplete="name" style={{ width: '100%', paddingLeft: '2.25rem' }} className={errors.name ? 'p-invalid' : ''} />
                  </div>
                )}
              />
              {errors.name && <small className="p-error">{errors.name.message}</small>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }}
                render={({ field: f }) => (
                  <div style={{ position: 'relative' }}>
                    <i className="pi pi-envelope" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color-secondary)' }} />
                    <InputText {...f} type="email" autoComplete="email" style={{ width: '100%', paddingLeft: '2.25rem' }} className={errors.email ? 'p-invalid' : ''} />
                  </div>
                )}
              />
              {errors.email && <small className="p-error">{errors.email.message}</small>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } }}
                render={({ field: f }) => (
                  <Password {...f} toggleMask autoComplete="new-password" className={errors.password ? 'p-invalid' : ''} />
                )}
              />
              {errors.password && <small className="p-error">{errors.password.message}</small>}
            </div>

            <Button
              type="submit"
              label={isLoading ? 'Creating account…' : 'Create Account'}
              icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'}
              disabled={isLoading}
              style={{ width: '100%' }}
            />
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
