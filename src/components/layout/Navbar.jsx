import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { Sidebar } from 'primereact/sidebar'
import { Divider } from 'primereact/divider'
import useAuthStore from '@/store/authStore'
import { getInitials } from '@/utils'
import { APP_NAME } from '@/constants'

const Navbar = ({ darkMode, onToggleDark }) => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      template: () => (
        <div style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-color)' }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-color-secondary)' }}>{user?.email}</div>
        </div>
      ),
    },
    { separator: true },
    { label: 'Sign Out', icon: 'pi pi-sign-out', command: handleLogout, style: { color: 'var(--red-500)' } },
  ]

  return (
    <nav className="app-navbar">
      {/* Logo */}
      <Link to="/" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-color)', letterSpacing: '-0.5px', flexShrink: 0, marginRight: '1.5rem' }}>
        {APP_NAME}
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex" style={{ gap: '0.25rem', flex: 1 }}>
        <Link to="/">
          <Button label="Sentences" icon="pi pi-list" text size="small" />
        </Link>
      </div>

      <div style={{ flex: 1 }} />

      {/* Dark mode toggle */}
      <Button
        icon={darkMode ? 'pi pi-sun' : 'pi pi-moon'}
        text
        rounded
        onClick={onToggleDark}
        tooltip={darkMode ? 'Light mode' : 'Dark mode'}
        tooltipOptions={{ position: 'bottom' }}
      />

      {/* Guest buttons */}
      {!isAuthenticated && (
        <div className="hidden md:flex" style={{ gap: '0.5rem' }}>
          <Link to="/login"><Button label="Sign In" outlined size="small" /></Link>
          <Link to="/signup"><Button label="Sign Up" size="small" /></Link>
        </div>
      )}

      {/* Authenticated avatar */}
      {isAuthenticated && (
        <>
          <Menu model={userMenuItems} popup ref={menuRef} style={{ minWidth: '200px' }} />
          <Avatar
            label={getInitials(user?.name || user?.email || '?')}
            shape="circle"
            style={{ background: 'var(--primary-color)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', width: 36, height: 36 }}
            onClick={(e) => menuRef.current.toggle(e)}
          />
        </>
      )}

      {/* Mobile hamburger */}
      <Button icon="pi pi-bars" text rounded className="flex md:hidden" onClick={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      <Sidebar visible={sidebarOpen} onHide={() => setSidebarOpen(false)} position="right" style={{ width: '240px' }}>
        <div style={{ padding: '0.5rem 0' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-color)', padding: '0 0.5rem 1rem' }}>{APP_NAME}</div>
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Button label="Sentences" icon="pi pi-list" text style={{ width: '100%', justifyContent: 'flex-start' }} />
          </Link>
          <Divider />
          {isAuthenticated ? (
            <>
              <div style={{ padding: '0.75rem 0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-color-secondary)' }}>{user?.email}</div>
              </div>
              <Button label="Sign Out" icon="pi pi-sign-out" text severity="danger" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={handleLogout} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
              <Link to="/login" onClick={() => setSidebarOpen(false)}><Button label="Sign In" outlined style={{ width: '100%' }} /></Link>
              <Link to="/signup" onClick={() => setSidebarOpen(false)}><Button label="Sign Up" style={{ width: '100%' }} /></Link>
            </div>
          )}
        </div>
      </Sidebar>
    </nav>
  )
}

export default Navbar
