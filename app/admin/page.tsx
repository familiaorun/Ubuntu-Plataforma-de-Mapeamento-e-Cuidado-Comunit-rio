import React from 'react'
import { supabaseServer } from '../lib/supabaseServer'

export const dynamic = 'force-dynamic'

function Card({ title, value, sub }: { title: string; value: React.ReactNode; sub?: string }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
      {sub ? <div style={styles.cardSub}>{sub}</div> : null}
    </div>
  )
}

export default async function AdminPage() {
  const supabase = supabaseServer()

  // Contagem total
  const total = await supabase.from('respostas').select('*', { count: 'exact', head: true })

  // Crianças: tem_criancas
  const comCriancas = await supabase
    .from('respostas')
    .select('*', { count: 'exact', head: true })
    .eq('tem_criancas', true)

  // Crianças ficam sozinhas (às vezes / frequentemente)
  const criancasSozinhas = await supabase
    .from('respostas')
    .select('*', { count: 'exact', head: true })
    .in('criancas_ficam_sozinhas', ['as_vezes', 'frequentemente'])

  // Interesse em contraturno (sim / talvez)
  const contraturnoInteresse = await supabase
    .from('respostas')
    .select('*', { count: 'exact', head: true })
    .in('criancas_interesse_contraturno', ['sim', 'talvez'])

  // Segurança alimentar: às vezes / frequentemente
  const insegAlimentar = await supabase
    .from('respostas')
    .select('*', { count: 'exact', head: true })
    .in('seguranca_alimentar', ['as_vezes', 'frequentemente'])

  // Voluntariado: sim / talvez
  const voluntariado = await supabase
    .from('respostas')
    .select('*', { count: 'exact', head: true })
    .in('voluntariado_disponivel', ['sim', 'talvez'])

  // Educação (se você já tinha esses campos no form): interesse_estudar sim/talvez
  const interesseEstudar = await supabase
    .from('respostas')
    .select('*', { count: 'exact', head: true })
    .in('interesse_estudar', ['sim', 'talvez'])

  // Últimas respostas (ajuste o order se você tiver created_at)
  const recentes = await supabase
    .from('respostas')
    .select(
      'nome,bairro,tem_criancas,qtd_criancas,tem_idosos,qtd_idosos,seguranca_alimentar,voluntariado_disponivel,identidade_genero'
    )
    .order('id', { ascending: false })
    .limit(20)

  const err =
    total.error ||
    comCriancas.error ||
    criancasSozinhas.error ||
    contraturnoInteresse.error ||
    insegAlimentar.error ||
    voluntariado.error ||
    interesseEstudar.error ||
    recentes.error

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Painel – Mapeamento</h1>
        <p style={styles.sub}>
          Visão geral da base <strong>respostas</strong>.
        </p>
      </header>

      {err ? (
        <div style={styles.errBox}>
          <strong>Erro ao carregar dados:</strong>
          <div style={{ marginTop: 6 }}>{err.message}</div>
          <div style={styles.errHint}>
            Dica: confirme `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`.
          </div>
        </div>
      ) : null}

      <section style={styles.grid}>
        <Card title="Respostas totais" value={total.count ?? 0} />
        <Card title="Casas com crianças" value={comCriancas.count ?? 0} sub="tem_criancas = true" />
        <Card
          title="Crianças ficam sozinhas"
          value={criancasSozinhas.count ?? 0}
          sub="às vezes / frequentemente"
        />
        <Card
          title="Interesse em contraturno"
          value={contraturnoInteresse.count ?? 0}
          sub="sim / talvez"
        />
        <Card
          title="Insegurança alimentar"
          value={insegAlimentar.count ?? 0}
          sub="às vezes / frequentemente"
        />
        <Card
          title="Disponibilidade p/ voluntariar"
          value={voluntariado.count ?? 0}
          sub="sim / talvez"
        />
        <Card
          title="Interesse em estudar"
          value={interesseEstudar.count ?? 0}
          sub="sim / talvez"
        />
      </section>

      <section style={styles.tableWrap}>
        <h2 style={styles.h2}>Últimas respostas</h2>

        <div style={styles.table}>
          <div style={styles.rowHead}>
            <div>Nome</div>
            <div>Bairro/Cidade</div>
            <div>Crianças</div>
            <div>Idosos</div>
            <div>Seg. alimentar</div>
            <div>Volunt.</div>
            <div>Gênero</div>
          </div>

          {(recentes.data ?? []).map((r, idx) => (
            <div key={idx} style={styles.row}>
              <div style={styles.cellStrong}>{r.nome ?? '—'}</div>
              <div>{r.bairro ?? '—'}</div>
              <div>
                {r.tem_criancas ? `Sim (${r.qtd_criancas ?? '—'})` : 'Não'}
              </div>
              <div>
                {r.tem_idosos ? `Sim (${r.qtd_idosos ?? '—'})` : 'Não'}
              </div>
              <div>{r.seguranca_alimentar ?? '—'}</div>
              <div>{r.voluntariado_disponivel ?? '—'}</div>
              <div>{r.identidade_genero ?? '—'}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.small}>
          ⚠️ Se você for publicar isso online, me chama que eu te passo uma proteção simples pro /admin (senha).
        </p>
      </footer>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 20, maxWidth: 1100, margin: '0 auto', color: '#111' },
  header: { marginBottom: 14 },
  h1: { margin: 0, fontSize: 28, fontWeight: 900, color: '#0f172a' },
  h2: { margin: '18px 0 10px', fontSize: 18, fontWeight: 900, color: '#0f172a' },
  sub: { margin: '8px 0 0', color: '#1f2937', fontSize: 14, lineHeight: 1.6, fontWeight: 600 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
    marginTop: 12,
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 14,
    background: 'white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  },
  cardTitle: { fontSize: 13, fontWeight: 800, color: '#111' },
  cardValue: { marginTop: 8, fontSize: 28, fontWeight: 900, color: '#111' },
  cardSub: { marginTop: 6, fontSize: 12, color: '#374151', fontWeight: 600 },

  tableWrap: { marginTop: 16 },
  table: { border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', background: 'white' },
  rowHead: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr .8fr .8fr .9fr .7fr .8fr',
    gap: 10,
    padding: '10px 12px',
    background: '#f3f4f6',
    fontSize: 12,
    fontWeight: 900,
    color: '#111',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr .8fr .8fr .9fr .7fr .8fr',
    gap: 10,
    padding: '10px 12px',
    borderTop: '1px solid #e5e7eb',
    fontSize: 13,
    color: '#111',
  },
  cellStrong: { fontWeight: 900 },

  errBox: {
    border: '1px solid #fecaca',
    background: '#fff1f2',
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
    color: '#7f1d1d',
    fontWeight: 800,
  },
  errHint: { marginTop: 6, fontSize: 12, color: '#7f1d1d', fontWeight: 700 },

  footer: { marginTop: 14 },
  small: { margin: 0, fontSize: 12, color: '#374151', fontWeight: 700 },
}