import { getSupabaseServer } from '../lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from('respostas')
    .select('id, created_at, nome, telefone, bairro, mensagem')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 1000, margin: '0 auto' }}>
      <h1>Área Admin</h1>
      <p>Últimas respostas (50)</p>

      {error && <p style={{ color: 'crimson' }}>Erro: {error.message}</p>}

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {(data ?? []).map((r) => (
          <div key={r.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              #{r.id} • {new Date(r.created_at).toLocaleString()}
            </div>
            <div><b>Nome:</b> {r.nome || '—'}</div>
            <div><b>Telefone:</b> {r.telefone || '—'}</div>
            <div><b>Bairro:</b> {r.bairro || '—'}</div>
            <div><b>Mensagem:</b> {r.mensagem || '—'}</div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24 }}>
        <a href="/">← Voltar</a>
      </p>
    </main>
  )
}