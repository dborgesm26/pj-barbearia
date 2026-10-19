import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

// ---- Dados editáveis ----------------------------------------------------
const PHONE = '5516982184020'
const INSTAGRAM = 'https://www.instagram.com/' // troque pelo perfil da barbearia
const MAPS =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('R. Morchede Elías, 4073 - Jardim Eden, Franca - SP')

const wa = (msg) =>
  `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`

const NAV = [
  ['Início', '#inicio'],
  ['Serviços', '#servicos'],
  ['Sobre nós', '#sobre'],
  ['Contato', '#contato'],
]

const SERVICES = [
  {
    title: 'Cabelo',
    text: 'Corte tradicional ou degradê, com acabamento na navalha.',
    cta: 'Agendar corte',
    msg: 'Olá! Quero agendar um corte de cabelo (tradicional ou degradê).',
    icon: (
      <>
        <circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" />
        <circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" />
      </>
    ),
  },
  {
    title: 'Barba',
    text: 'Barboterapia com toalha quente e alinhamento no desenho do seu rosto.',
    cta: 'Agendar barba',
    msg: 'Olá! Quero agendar barba (barboterapia ou alinhamento).',
    icon: (
      <>
        <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
      </>
    ),
  },
  {
    title: 'Combo cabelo + barba',
    text: 'O visual completo em um único horário. O serviço mais pedido.',
    cta: 'Agendar combo',
    msg: 'Olá! Quero agendar o combo cabelo + barba.',
    featured: true,
    icon: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  },
  {
    title: 'Sobrancelha e acabamento',
    text: 'Design de sobrancelha e finalização para fechar o visual.',
    cta: 'Agendar acabamento',
    msg: 'Olá! Quero agendar sobrancelha / acabamento.',
    icon: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </>
    ),
  },
]

const PERKS = [
  {
    title: 'Ambiente climatizado e aconchegante',
    text: 'Espaço confortável para você relaxar enquanto cuidamos do seu visual.',
    icon: <path d="M12 2v20M17 5l-5 3-5-3M17 19l-5-3-5 3M2 12h20M5 7l3 5-3 5M19 7l-3 5 3 5" />,
  },
  {
    title: 'Profissionais qualificados e pontualidade',
    text: 'Horário marcado é horário respeitado, com atendimento feito por quem entende do ofício.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: 'Fácil de chegar no Jardim Eden',
    text: 'Localização de fácil acesso em Franca, sem complicação para encontrar.',
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </>
    ),
  },
]

// ---- Animação -----------------------------------------------------------
const ease = [0.23, 1, 0.32, 1]
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const rise = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

// ---- Peças reutilizáveis ------------------------------------------------
function Icon({ children, className = 'h-9 w-9' }) {
  return (
    <svg className={`${className} text-gold`} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

function Btn({ href, variant = 'gold', className = '', children, ...rest }) {
  const styles = {
    gold: 'bg-gold text-[#15110a] hover:bg-goldStrong',
    line: 'border-[1.5px] border-line hover:border-gold hover:text-goldStrong',
  }
  const external = href.startsWith('http')
  return (
    <motion.a
      href={href}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.16, ease }}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex min-h-[44px] touch-manipulation items-center justify-center rounded-full px-6 py-3 font-semibold transition-colors duration-150 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.a>
  )
}

function useOpenNow() {
  const [open, setOpen] = useState(null)
  useEffect(() => {
    const check = () => {
      const p = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
      }).formatToParts(new Date())
      const get = (t) => p.find((x) => x.type === t).value
      const t = (parseInt(get('hour'), 10) % 24) + parseInt(get('minute'), 10) / 60
      const d = get('weekday')
      if (['Tue', 'Wed', 'Thu', 'Fri'].includes(d)) setOpen(t >= 9 && t < 21)
      else if (d === 'Sat') setOpen(t >= 7 && t < 17)
      else setOpen(false)
    }
    check()
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [])
  return open
}

// ---- Seções -------------------------------------------------------------
function Header() {
  const [menu, setMenu] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#inicio" className="flex items-center gap-2 font-display text-xl font-extrabold" aria-label="PJ Barbearia, início">
          <span className="pole inline-block h-7 w-2.5 rounded-full" aria-hidden="true" />
          PJ <span className="text-gold">Barbearia</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Principal">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-goldStrong">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Btn href={wa('Olá! Quero agendar um horário na PJ Barbearia.')} className="!px-4 !py-2.5 text-sm sm:!px-5">
            Agendar pelo WhatsApp
          </Btn>
          <button className="-mr-2 p-2 md:hidden" aria-label="Abrir menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden border-t border-line px-5 md:hidden"
            aria-label="Menu móvel"
          >
            {NAV.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="block py-3">{label}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero() {
  const open = useOpenNow()
  const label = open === null ? 'Jardim Eden, Franca' : `${open ? 'Aberto agora' : 'Fechado agora'} · Jardim Eden, Franca`
  const dot = open === null ? 'bg-muted' : open ? 'bg-[#3ecf6b]' : 'bg-[#d9604c]'
  return (
    <section id="inicio" className="hero-bg relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 md:grid-cols-[1.4fr_1fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p variants={rise} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-muted">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            {label}
          </motion.p>
          <motion.h1 variants={rise} className="text-4xl font-extrabold sm:text-6xl">
            Estilo, tradição e respeito ao seu visual em Franca
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-xl text-lg text-muted">
            Atendimento personalizado no Jardim Eden. Agende seu horário com facilidade e sem filas.
          </motion.p>
          <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
            <Btn href={wa('Olá! Quero agendar meu horário na PJ Barbearia.')}>Agendar meu horário</Btn>
            <Btn href="#servicos" variant="line">Ver serviços</Btn>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden justify-center md:flex"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.4 }}
          aria-hidden="true"
        >
          <div className="relative">
            <div className="pole h-[26rem] w-24 rounded-full border-[6px] border-surface2 shadow-[0_0_80px_rgba(224,164,49,.25)]" />
            <div className="absolute -top-3 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-surface2" />
            <div className="absolute -bottom-3 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-surface2" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="servicos" className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Serviços</h2>
        <p className="mt-3 max-w-xl text-muted">
          Escolha o serviço e chame no WhatsApp. A mensagem já vai pronta; é só enviar e combinar o horário e o valor.
        </p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((s) => (
            <motion.article
              key={s.title}
              variants={rise}
              className={`flex flex-col rounded-2xl border bg-bg p-6 transition-colors duration-200 hover:border-gold ${s.featured ? 'border-gold' : 'border-line'}`}
            >
              <Icon>{s.icon}</Icon>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{s.text}</p>
              <p className="mt-4 text-sm font-semibold text-goldStrong">Valor sob consulta</p>
              <Btn href={wa(s.msg)} variant={s.featured ? 'gold' : 'line'} className="mt-4 text-sm">{s.cta}</Btn>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section id="sobre" className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">Por que escolher a PJ Barbearia?</h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {PERKS.map((p) => (
            <motion.div key={p.title} variants={rise} className="rounded-2xl border border-line bg-surface p-7">
              <Icon className="h-8 w-8">{p.icon}</Icon>
              <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-muted">{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contato" className="bg-surface py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        className="mx-auto grid max-w-6xl items-start gap-10 px-5 md:grid-cols-2"
      >
        <motion.div variants={rise}>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Onde estamos</h2>
          <address className="mt-5 text-lg not-italic">
            R. Morchede Elías, 4073<br />Jardim Eden, Franca - SP
          </address>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href={MAPS}>Abrir rota no Google Maps</Btn>
            <Btn href={wa('Olá! Tenho uma dúvida sobre a PJ Barbearia.')} variant="line">Chamar no WhatsApp</Btn>
          </div>
        </motion.div>
        <motion.div variants={rise} className="rounded-2xl border border-line bg-bg p-7">
          <h3 className="text-xl font-bold">Horário de funcionamento</h3>
          <dl className="mt-5">
            <div className="flex justify-between border-b border-line py-3"><dt>Terça a sexta</dt><dd className="font-semibold">09:00 às 21:00</dd></div>
            <div className="flex justify-between border-b border-line py-3"><dt>Sábado</dt><dd className="font-semibold">07:00 às 17:00</dd></div>
            <div className="flex justify-between py-3 text-muted"><dt>Domingo e segunda</dt><dd>Fechado</dd></div>
          </dl>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} PJ Barbearia. Todos os direitos reservados.</p>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-goldStrong">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          Siga no Instagram
        </a>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  return (
    <motion.a
      href={wa('Olá! Vim pelo site e quero agendar um horário.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.2 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] shadow-[0_8px_24px_rgba(0,0,0,.5)]"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.8-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.7.8-2.7-.2-.3a9 9 0 1 1 7.1 3.8Zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.4 7.4 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.7a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </motion.a>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <Services />
        <Why />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </MotionConfig>
  )
}
