'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'

export default function FormularioPage() {
  const [ok, setOk] = useState(false)

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Formulário</h1>
      <p style={{ maxWidth: 720 }}>
        Se esta tela abriu, o deploy está ok. Agora vamos reconectar o Supabase com segurança (sem quebrar o site).
      </p>

      <button
        onClick={() => setOk(true)}
        style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #ccc' }}
      >
        Testar botão
      </button>

      {ok && <p style={{ marginTop: 16 }}>✅ UI funcionando.</p>}

      <p style={{ marginTop: 24 }}>
        <a href="/">← Voltar</a>
      </p>
    </main>
  )
}