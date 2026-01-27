'use client'

import React, { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Answers = {
  // básicos
  nome_social?: string
  pronomes?: string
  email?: string
  whatsapp?: string
  cidade?: string
  bairro?: string
  faixa_etaria?: string

  // identidade (opcional)
  genero?: string
  orientacao?: string

  // casa
  pessoas_casa?: string
  tem_criancas?: 'Não' | 'Sim'
  criancas_qtd?: string
  criancas_faixas?: string[]
  tem_idosos?: 'Não' | 'Sim'
  idosos_qtd?: string

  // idosos (detalhado)
  idoso_mobilidade?: string
  idoso_necessidades?: string[]
  idoso_obs?: string

  // crianças (detalhado)
  criancas_sozinhas?: string
  criancas_horarios?: string[]
  criancas_interesse_contraturno?: string
  criancas_atividades?: string[]
  criancas_precisam?: string

  // educação
  escolaridade?: string
  interesse_estudos?: string
  areas_formacao?: string[]

  // alimentação
  faltou_comida?: string
  apoio_alimentar?: string[]
  restricao_alimentar?: string

  // voluntariado
  voluntariar?: string
  tempo_voluntario?: string
  causas?: string[]

  // contato/consentimento
  pode_contatar?: 'Sim' | 'Não'

  // livre
  observacoes?: string
}

type Step = {
  key: string
  title: string
  intro: string
  show?: (a: Answers) => boolean
  render: (a: Answers, setA: React.Dispatch<React.SetStateAction<Answers>>) => React.ReactNode
}

export default function FormularioWizard() {
  const [answers, setAnswers] = useState<Answers>({
    tem_criancas: 'Não',
    tem_idosos: 'Não',
    pode_contatar: 'Não',
  })
  const [stepIndex, setStepIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState(false)

  const steps: Step[] = useMemo(
    () => [
      {
        key: 'abertura',
        title: 'Mapear é cuidar.',
        intro:
          'Este formulário é um gesto de escuta. Você responde só o que fizer sentido. As respostas ajudam a fortalecer nossa comunidade, nossas crianças e nossos mais velhos.',
        render: () => (
          <div style={styles.block}>
            <div style={styles.manifesto}>
              <div style={styles.manifestoTag}>Manifesto</div>

              <p style={styles.manifestoText}>
                Este mapeamento não é fiscalização. É escuta. É ferramenta para enxergar necessidades, proteger nossos
                mais velhos, apoiar nossas crianças e fortalecer caminhos de formação, alimento e dignidade.
              </p>

              <p style={{ ...styles.manifestoText, marginBottom: 0 }}>
                Cada resposta é um ponto aceso: um retrato coletivo para planejar ações com mais precisão e afeto.
              </p>
            </div>

            <p style={styles.p}>
              Você responde só o que fizer sentido. Perguntas opcionais podem ser puladas.
            </p>
          </div>
        ),
      },

      {
        key: 'basico',
        title: 'Quem é você?',
        intro: 'Só o básico para a gente se organizar.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {textInput(
              'Nome social / Como você gosta de ser chamado *',
              a.nome_social,
              (v) => setA((p) => ({ ...p, nome_social: v })),
              true
            )}

            {selectInput(
              'Pronomes (opcional)',
              a.pronomes,
              (v) => setA((p) => ({ ...p, pronomes: v })),
              ['Prefiro não informar', 'Ela/Dela', 'Ele/Dele', 'Elu/Delu', 'Outro']
            )}

            {textInput('E-mail (opcional, mas recomendado)', a.email, (v) => setA((p) => ({ ...p, email: v })))}

            {textInput('WhatsApp (opcional)', a.whatsapp, (v) => setA((p) => ({ ...p, whatsapp: v })))}

            {textInput('Cidade *', a.cidade, (v) => setA((p) => ({ ...p, cidade: v })), true)}

            {textInput('Bairro/Comunidade *', a.bairro, (v) => setA((p) => ({ ...p, bairro: v })), true)}

            {selectInput(
              'Faixa etária (opcional)',
              a.faixa_etaria,
              (v) => setA((p) => ({ ...p, faixa_etaria: v })),
              ['Prefiro não informar', '18–24', '25–34', '35–44', '45–59', '60+']
            )}
          </div>
        ),
      },

      {
        key: 'identidade',
        title: 'Identidade (opcional)',
        intro: 'Isso ajuda a gente a construir ações mais inclusivas. Você pode pular.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput(
              'Identidade de gênero (opcional)',
              a.genero,
              (v) => setA((p) => ({ ...p, genero: v })),
              [
                'Prefiro não informar',
                'Mulher cis',
                'Homem cis',
                'Mulher trans',
                'Homem trans',
                'Não-binárie',
                'Travesti',
                'Outro',
              ]
            )}
            {selectInput(
              'Orientação afetivo-sexual (opcional)',
              a.orientacao,
              (v) => setA((p) => ({ ...p, orientacao: v })),
              ['Prefiro não informar', 'Hetero', 'Gay', 'Lésbica', 'Bi/Pan', 'Assexual', 'Outra']
            )}
          </div>
        ),
      },

      {
        key: 'casa',
        title: 'Sua casa',
        intro: 'Nossa comunidade é feita de muitas casas.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {textInput('Quantas pessoas moram com você? (número)', a.pessoas_casa, (v) =>
              setA((p) => ({ ...p, pessoas_casa: v }))
            )}

            {selectInput('Há crianças/adolescentes na casa?', a.tem_criancas, (v) => setA((p) => ({ ...p, tem_criancas: v as any })), [
              'Não',
              'Sim',
            ])}

            {a.tem_criancas === 'Sim' &&
              textInput('Quantas crianças/adolescentes?', a.criancas_qtd, (v) => setA((p) => ({ ...p, criancas_qtd: v })))}

            {a.tem_criancas === 'Sim' &&
              multiCheckbox(
                'Faixas etárias das crianças',
                ['0–5', '6–10', '11–14', '15–17'],
                a.criancas_faixas || [],
                (vals) => setA((p) => ({ ...p, criancas_faixas: vals }))
              )}

            {selectInput('Há idosos na casa?', a.tem_idosos, (v) => setA((p) => ({ ...p, tem_idosos: v as any })), ['Não', 'Sim'])}

            {a.tem_idosos === 'Sim' &&
              textInput('Quantos idosos?', a.idosos_qtd, (v) => setA((p) => ({ ...p, idosos_qtd: v })))}
          </div>
        ),
      },

      {
        key: 'idosos',
        title: 'Nossos mais velhos',
        intro: 'Se houver idosos, queremos entender mobilidade e necessidades para cuidar melhor.',
        show: (a) => a.tem_idosos === 'Sim',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput(
              'Nível de mobilidade (na média)',
              a.idoso_mobilidade,
              (v) => setA((p) => ({ ...p, idoso_mobilidade: v })),
              ['Independente', 'Precisa de apoio às vezes', 'Precisa de apoio frequente', 'Acamado / mobilidade muito reduzida']
            )}

            {multiCheckbox(
              'Principais necessidades',
              [
                'Companhia / visitas',
                'Transporte para consultas',
                'Alimentação / cesta',
                'Remédios / acesso à saúde',
                'Atividades (roda, memória, dança)',
                'Apoio para rotina (cuidado)',
                'Documentação / benefícios',
                'Segurança (quedas, casa)',
                'Outro',
              ],
              a.idoso_necessidades || [],
              (vals) => setA((p) => ({ ...p, idoso_necessidades: vals }))
            )}

            {textArea(
              'Observações (opcional) — necessidades específicas, horários, contexto',
              a.idoso_obs,
              (v) => setA((p) => ({ ...p, idoso_obs: v }))
            )}
          </div>
        ),
      },

      {
        key: 'criancas',
        title: 'Nossas crianças',
        intro: 'Se houver crianças/adolescentes, queremos entender rotina, segurança e apoio.',
        show: (a) => a.tem_criancas === 'Sim',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput(
              'As crianças ficam sozinhas em algum momento?',
              a.criancas_sozinhas,
              (v) => setA((p) => ({ ...p, criancas_sozinhas: v })),
              ['Prefiro não informar', 'Nunca', 'Às vezes', 'Frequentemente']
            )}

            {multiCheckbox(
              'Quando isso acontece? (se aplicável)',
              ['Manhã', 'Tarde', 'Noite', 'Fins de semana'],
              a.criancas_horarios || [],
              (vals) => setA((p) => ({ ...p, criancas_horarios: vals }))
            )}

            {selectInput(
              'Interesse em atividades no contraturno/fim de semana?',
              a.criancas_interesse_contraturno,
              (v) => setA((p) => ({ ...p, criancas_interesse_contraturno: v })),
              ['Sim', 'Talvez', 'Não']
            )}

            {multiCheckbox(
              'Que tipo de atividade seria mais útil?',
              [
                'Reforço escolar / tarefa',
                'Leitura / biblioteca',
                'Música / dança',
                'Artes (desenho, teatro)',
                'Esporte / movimento',
                'Informática / tecnologia',
                'Horta / educação ambiental',
                'Cultura afro/ancestralidade',
                'Outro',
              ],
              a.criancas_atividades || [],
              (vals) => setA((p) => ({ ...p, criancas_atividades: vals }))
            )}

            {textArea(
              'O que as crianças mais precisam hoje? (opcional)',
              a.criancas_precisam,
              (v) => setA((p) => ({ ...p, criancas_precisam: v }))
            )}
          </div>
        ),
      },

      {
        key: 'educacao',
        title: 'Educação e formação',
        intro: 'Queremos entender escolaridade e interesses para criar caminhos de formação.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput(
              'Escolaridade (opcional)',
              a.escolaridade,
              (v) => setA((p) => ({ ...p, escolaridade: v })),
              [
                'Prefiro não informar',
                'Não alfabetizado(a)',
                'Fundamental incompleto',
                'Fundamental completo',
                'Médio incompleto',
                'Médio completo',
                'Técnico',
                'Superior incompleto',
                'Superior completo',
                'Pós-graduação',
              ]
            )}

            {selectInput(
              'Interesse em continuar/terminar estudos ou fazer cursos?',
              a.interesse_estudos,
              (v) => setA((p) => ({ ...p, interesse_estudos: v })),
              ['Sim', 'Talvez', 'Não']
            )}

            {multiCheckbox(
              'Áreas de interesse para formação',
              [
                'Cultura (produção cultural, eventos)',
                'Educação (oficinas, apoio escolar)',
                'Comunicação (foto, vídeo, redes)',
                'Tecnologia (computador, internet)',
                'Empreendedorismo / finanças',
                'Saúde / bem-estar',
                'Gastronomia / alimentação',
                'Artesanato / ofícios',
                'Outra',
              ],
              a.areas_formacao || [],
              (vals) => setA((p) => ({ ...p, areas_formacao: vals }))
            )}
          </div>
        ),
      },

      {
        key: 'alimentacao',
        title: 'Segurança alimentar',
        intro: 'Comer é um direito. Aqui não existe julgamento.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput(
              'Nos últimos 30 dias, faltou comida ou dinheiro pra comida?',
              a.faltou_comida,
              (v) => setA((p) => ({ ...p, faltou_comida: v })),
              ['Prefiro não informar', 'Nunca', 'Às vezes', 'Frequentemente']
            )}

            {multiCheckbox(
              'Que tipo de apoio ajudaria?',
              ['Cesta/alimentos', 'Refeição/cozinha solidára', 'Planejamento/orientação alimentar', 'Horta comunitária', 'Outro'],
              a.apoio_alimentar || [],
              (vals) => setA((p) => ({ ...p, apoio_alimentar: vals }))
            )}

            {textInput('Restrição alimentar importante? (opcional)', a.restricao_alimentar, (v) =>
              setA((p) => ({ ...p, restricao_alimentar: v }))
            )}
          </div>
        ),
      },

      {
        key: 'voluntario',
        title: 'Caminhar junto',
        intro: 'Toda comunidade forte nasce da partilha.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput('Você teria disponibilidade de ajudar/voluntariar?', a.voluntariar, (v) => setA((p) => ({ ...p, voluntariar: v })), [
              'Sim',
              'Talvez',
              'Não',
            ])}

            {selectInput('Quanto tempo por semana?', a.tempo_voluntario, (v) => setA((p) => ({ ...p, tempo_voluntario: v })), [
              '1–2h',
              '3–5h',
              '6h+',
              'Depende / por evento',
            ])}

            {multiCheckbox(
              'Quais causas te mobilizam?',
              [
                'Crianças e educação',
                'Juventude',
                'Idosos',
                'Segurança alimentar',
                'Saúde mental / acolhimento',
                'Cultura e eventos',
                'Comunicação/divulgação',
                'Meio ambiente/horta',
                'Direitos LGBTQIA+',
                'Combate ao racismo',
                'Outra',
              ],
              a.causas || [],
              (vals) => setA((p) => ({ ...p, causas: vals }))
            )}
          </div>
        ),
      },

      {
        key: 'fechamento',
        title: 'Finalizar',
        intro: 'Quase lá. Consentimento de contato + recado final.',
        render: (a, setA) => (
          <div style={styles.grid}>
            {selectInput(
              'Você aceita que a equipe te contate para ações, avisos e oportunidades?',
              a.pode_contatar,
              (v) => setA((p) => ({ ...p, pode_contatar: v as any })),
              ['Sim', 'Não']
            )}

            {textArea('Recado livre (opcional)', a.observacoes, (v) => setA((p) => ({ ...p, observacoes: v })))}
          </div>
        ),
      },
    ],
    []
  )

  const visibleSteps = useMemo(() => steps.filter((s) => (s.show ? s.show(answers) : true)), [steps, answers])
  const step = visibleSteps[stepIndex]
  const progress = Math.round(((stepIndex + 1) / visibleSteps.length) * 100)

  function canNext() {
    if (step.key !== 'basico') return true
    return Boolean(answers.nome_social && answers.cidade && answers.bairro)
  }

  async function handleFinish() {
    setLoading(true)
    setErro('')
    setOk(false)

    const payload = {
      ...answers,
      criancas_faixas: answers.criancas_faixas ?? [],
      criancas_horarios: answers.criancas_horarios ?? [],
      criancas_atividades: answers.criancas_atividades ?? [],
      areas_formacao: answers.areas_formacao ?? [],
      apoio_alimentar: answers.apoio_alimentar ?? [],
      causas: answers.causas ?? [],
      idoso_necessidades: answers.idoso_necessidades ?? [],
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('respostas').insert([payload])
    if (error) setErro(error.message)
    else setOk(true)

    setLoading(false)
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.progressWrap} aria-label="Progresso">
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>

          <div style={styles.progressText}>
            {stepIndex + 1} / {visibleSteps.length}
          </div>

          <h1 style={styles.h1}>{step.title}</h1>
          <p style={styles.lead}>{step.intro}</p>
        </div>

        <div style={styles.body}>{step.render(answers, setAnswers)}</div>

        {erro && <div style={styles.error}>{erro}</div>}
        {ok && <div style={styles.ok}>Obrigado! 💚 Sua resposta foi registrada.</div>}

        <div style={styles.footer}>
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0 || loading}
            style={{ ...styles.btn, ...styles.btnGhost, opacity: stepIndex === 0 ? 0.5 : 1 }}
          >
            Voltar
          </button>

          {stepIndex < visibleSteps.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext() && setStepIndex((i) => i + 1)}
              disabled={!canNext() || loading}
              style={{ ...styles.btn, ...styles.btnPrimary, opacity: !canNext() ? 0.6 : 1 }}
            >
              Próximo
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              style={{ ...styles.btn, ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Enviando...' : 'Concluir'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

/* ---------- UI helpers ---------- */

function textInput(label: string, value: string | undefined, onChange: (v: string) => void, required = false) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>
        {label} {required ? <span style={styles.req}>*</span> : null}
      </span>
      <input style={styles.input} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function textArea(label: string, value: string | undefined, onChange: (v: string) => void) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <textarea style={styles.textarea} value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={5} />
    </label>
  )
}

function selectInput(label: string, value: string | undefined, onChange: (v: string) => void, options: string[]) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <select style={styles.select} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          Selecione...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

function multiCheckbox(label: string, options: string[], value: string[], onChange: (vals: string[]) => void) {
  return (
    <fieldset style={styles.fieldset}>
      <legend style={styles.legend}>{label}</legend>
      <div style={styles.checkGrid}>
        {options.map((opt) => {
          const checked = value.includes(opt)
          return (
            <label key={opt} style={styles.checkItem}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const next = checked ? value.filter((v) => v !== opt) : [...value, opt]
                  onChange(next)
                }}
              />
              <span>{opt}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/* ---------- styles ---------- */

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
    maxWidth: 780,
    background: '#ffffff',
    border: '1px solid #e7e1d8',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottom: '1px solid #eee8df',
  },
  progressWrap: {
    height: 8,
    background: '#efe8de',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    background: '#1f3d2b',
    borderRadius: 999,
    transition: 'width 200ms ease',
  },
  progressText: {
    marginTop: 10,
    fontSize: 12,
    color: '#6b6258',
  },
  h1: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 28,
    color: '#1f3d2b',
    letterSpacing: -0.2,
  },
  lead: {
    margin: 0,
    color: '#2f2a24',
    fontSize: 15,
    lineHeight: 1.6,
  },
  body: {
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTop: '1px solid #eee8df',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
  },
  btn: {
    padding: '12px 16px',
    borderRadius: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent',
  },
  btnPrimary: {
    background: '#1f3d2b',
    color: '#fff',
  },
  btnGhost: {
    background: '#fff',
    color: '#1f3d2b',
    border: '1px solid #d7cfc5',
  },
  grid: {
    display: 'grid',
    gap: 14,
  },
  field: {
    display: 'grid',
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#1f3d2b',
    fontWeight: 700,
  },
  req: {
    color: '#c04b3f',
    fontWeight: 700,
  },
  input: {
    padding: '12px 12px',
    borderRadius: 12,
    border: '1px solid #cdbfb2',
    outline: 'none',
    fontSize: 15,
    color: '#1f1b16',
    background: '#fff',
  },
  textarea: {
    padding: '12px 12px',
    borderRadius: 12,
    border: '1px solid #cdbfb2',
    outline: 'none',
    fontSize: 15,
    color: '#1f1b16',
    background: '#fff',
    resize: 'vertical',
  },
  select: {
    padding: '12px 12px',
    borderRadius: 12,
    border: '1px solid #cdbfb2',
    outline: 'none',
    fontSize: 15,
    color: '#1f1b16',
    background: '#fff',
  },
  fieldset: {
    border: '1px solid #d7cfc5',
    borderRadius: 12,
    padding: 12,
  },
  legend: {
    padding: '0 6px',
    fontSize: 13,
    fontWeight: 700,
    color: '#2f2a24',
  },
  checkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 10,
    marginTop: 10,
  },
  checkItem: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    fontSize: 14,
    color: '#2f2a24',
  },
  error: {
    margin: '0 20px 10px',
    background: '#fff2f1',
    color: '#8a1f16',
    border: '1px solid #f2c7c2',
    padding: 12,
    borderRadius: 12,
  },
  ok: {
    margin: '0 20px 10px',
    background: '#eef7f0',
    color: '#1f3d2b',
    border: '1px solid #cfe6d4',
    padding: 12,
    borderRadius: 12,
  },
  block: {
    display: 'grid',
    gap: 12,
  },
  p: {
    margin: 0,
    color: '#3f3a33',
    lineHeight: 1.6,
  },
  manifesto: {
    background: '#f2efe8',
    border: '1px solid #e2d8cb',
    padding: 14,
    borderRadius: 14,
  },
  manifestoTag: {
    display: 'inline-block',
    background: '#1f3d2b',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  manifestoText: {
    margin: 0,
    marginBottom: 10,
    color: '#2a241f',
    lineHeight: 1.7,
    fontSize: 14,
  },
}