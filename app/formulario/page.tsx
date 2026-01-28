  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setErro(
        'Supabase não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.'
      )
      setLoading(false)
      return
    }

    const insertPromise = supabase.from('respostas').insert([payload])

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout ao salvar (10s). Pode ser rede, CORS ou Supabase bloqueando a request.')), 10000)
    )

    const result: any = await Promise.race([insertPromise, timeoutPromise])

    if (result?.error) {
      setErro(result.error.message)
    } else {
      setOk(true)
    }
  } catch (e: any) {
    setErro(e?.message ?? 'Erro inesperado ao salvar.')
  } finally {
    setLoading(false)
  }