export default function Page() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>Ubuntu • Mapeamento & Cuidado Comunitário</div>
          <h1 style={styles.h1}>Mapear é cuidar.</h1>
          <p style={styles.lead}>
            Este app é uma ferramenta de escuta para fortalecer nossa comunidade — apoiar famílias, nossas crianças e
            nossos mais velhos, com mais precisão e dignidade.
          </p>
        </div>

        <div style={styles.grid}>
          <a href="/formulario" style={{ ...styles.action, ...styles.primary }}>
            <div style={styles.actionTitle}>Preencher o formulário</div>
            <div style={styles.actionDesc}>Leva poucos minutos. Você responde só o que fizer sentido.</div>
          </a>

          <a href="/admin" style={styles.action}>
            <div style={styles.actionTitle}>Área Admin</div>
            <div style={styles.actionDesc}>Acesso restrito para organização e leitura dos dados.</div>
          </a>
        </div>

        <div style={styles.box}>
          <div style={styles.boxTitle}>Privacidade</div>
          <p style={styles.p}>
            Este mapeamento não é fiscalização. É escuta. Dados sensíveis são opcionais. Use “Prefiro não informar” quando
            quiser.
          </p>
        </div>

        <footer style={styles.footer}>
          <span style={styles.footerText}>© {new Date().getFullYear()} • Ubuntu</span>
          <span style={styles.footerDot}>•</span>
          <span style={styles.footerText}>Feito com cuidado</span>
        </footer>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f7f5f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  card: {
    width: '100%',
    maxWidth: 820,
    background: '#ffffff',
    border: '1px solid #e7e1d8',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    borderBottom: '1px solid #eee8df',
  },
  badge: {
    display: 'inline-block',
    background: '#1f3d2b',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 12,
  },
  h1: {
    margin: 0,
    fontSize: 34,
    color: '#1f3d2b',
    letterSpacing: -0.3,
  },
  lead: {
    marginTop: 10,
    marginBottom: 0,
    color: '#2f2a24',
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 680,
  },
  grid: {
    padding: 24,
    display: 'grid',
    gap: 14,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  action: {
    display: 'block',
    textDecoration: 'none',
    border: '1px solid #d7cfc5',
    borderRadius: 14,
    padding: 16,
    background: '#fff',
    color: '#1f1b16',
  },
  primary: {
    border: '1px solid #1f3d2b',
    background: '#f1f6f3',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#1f3d2b',
    marginBottom: 6,
  },
  actionDesc: {
    fontSize: 14,
    color: '#3f3a33',
    lineHeight: 1.6,
  },
  box: {
    margin: '0 24px 24px',
    background: '#f2efe8',
    border: '1px solid #e2d8cb',
    padding: 14,
    borderRadius: 14,
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: '#2a241f',
    marginBottom: 6,
  },
  p: {
    margin: 0,
    color: '#3f3a33',
    lineHeight: 1.6,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTop: '1px solid #eee8df',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b6258',
  },
  footerDot: {
    fontSize: 12,
    color: '#6b6258',
  },
}