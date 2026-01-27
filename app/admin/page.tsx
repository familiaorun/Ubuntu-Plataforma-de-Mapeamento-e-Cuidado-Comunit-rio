export default function HomePage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.badge}>Ubuntu</div>

        <h1 style={styles.h1}>Mapeamento e cuidado comunitário</h1>

        <p style={styles.p}>
          Uma plataforma para ouvir, registrar e fortalecer redes de apoio no território.
          É rápido, respeitoso e ajuda a gente a cuidar melhor de crianças, pessoas mais velhas e famílias.
        </p>

        <div style={styles.actions}>
          <a href="/formulario" style={{ ...styles.button, ...styles.primary }}>
            Participar do mapeamento
          </a>

          <a href="/admin" style={{ ...styles.button, ...styles.secondary }}>
            Acessar painel (admin)
          </a>
        </div>

        <p style={styles.small}>
          Se você preferir, pode responder só o básico. Ninguém é obrigado a informar o que não quiser.
        </p>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 24,
    background: '#f6f3ee',
  },
  card: {
    width: '100%',
    maxWidth: 820,
    background: '#fff',
    borderRadius: 18,
    padding: 28,
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: 999,
    background: '#153d2e',
    color: 'white',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  h1: {
    fontSize: 34,
    margin: '0 0 10px 0',
    color: '#153d2e',
    lineHeight: 1.15,
  },
  p: {
    margin: '0 0 18px 0',
    fontSize: 16,
    lineHeight: 1.6,
    color: '#2c2c2c',
  },
  actions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 600,
    border: '1px solid rgba(0,0,0,0.12)',
    minWidth: 220,
  },
  primary: {
    background: '#153d2e',
    color: '#fff',
    borderColor: '#153d2e',
  },
  secondary: {
    background: '#fff',
    color: '#153d2e',
  },
  small: {
    marginTop: 18,
    fontSize: 13,
    color: '#555',
  },
}