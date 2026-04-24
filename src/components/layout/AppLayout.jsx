import Navbar from './Navbar'

const AppLayout = ({ children, darkMode, onToggleDark }) => (
  <div style={{ minHeight: '100vh', background: 'var(--surface-ground)', display: 'flex', flexDirection: 'column' }}>
    <Navbar darkMode={darkMode} onToggleDark={onToggleDark} />
    <main style={{ flex: 1, width: '100%', maxWidth: 1400, margin: '0 auto', padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)' }}>
      {children}
    </main>
  </div>
)

export default AppLayout
