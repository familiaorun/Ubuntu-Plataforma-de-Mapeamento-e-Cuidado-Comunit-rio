'use client'

import { useState, type FormEvent } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export default function FormularioPage() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [bairro, setBairro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('saving')
    setErrMsg('')

    const supabase = getSupabaseClient()
    if (!supabase) {
      setStatus('err')
      setErrMsg(
        'Supabase não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.'
      )
      return
    }

    const { error } = await supabase.from('respostas').insert({
      nome,
      telefone,
      bairro,
      mensagem,
    })

    if (error) {
      setStatus('err')
      setErrMsg(error.message)
      return
    }

    setStatus('ok')
    setNome('')
    setTelefone('')
    setBairro('')
    setMensagem('')
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 720, margin: '0 auto' }}>
      <h1>Formulário</h1>
      <p>Responda só o que fizer sentido. Dados sensíveis são opcionais.</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <label>
          Nome (opcional)
          <input value={nome} onChange={(e) => setNome(e.target.value)} style={input} />
        </label>

        <label>
          Telefone (opcional)
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} style={input} />
        </label>

        <label>
          Bairro (opcional)
          <input value={bairro} onChange={(e) => setBairro(e.target.value)} style={input} />
        </label>

        <label>
          Como a casa pode apoiar você / sua família? (opcional)
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            style={{ ...input, minHeight: 120 }}
          />
        </label>

        <button disabled={status === 'saving'} style={button}>
          {status === 'saving' ? 'Enviando…' : 'Enviar'}
        </button>

        {status === 'ok' && <p>✅ Enviado. Obrigado!</p>}
        {status === 'err' && <p style={{ color: 'crimson' }}>❌ {errMsg}</p>}

        <p>
          <a href="/">← Voltar</a>
        </p>
      </form>
    </main>
  )
}

const input: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ccc',
  marginTop: 6,
}

const button: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: '1px solid #1f3b2d',
  background: '#1f3b2d',
  color: 'white',
  cursor: 'pointer',
}