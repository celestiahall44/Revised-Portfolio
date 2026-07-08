import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'

const projects = [
  {
    name: 'Netflix Clone',
    desc: 'A streaming UI with auth, movie browsing, and a polished player experience.',
    tags: ['React', 'Firebase', 'TMDB API'],
    link: 'https://github.com/celestiahall44/Netflix-Clone',
    tone: 'red',
    icon: 'NETFLIX',
  },
  {
    name: 'Summarist',
    desc: 'A library app for discovering, saving, and summarizing books with a built-in player.',
    tags: ['Next.js', 'Tailwind', 'NLP'],
    link: 'https://github.com/celestiahall44/Advanced-Internship',
    tone: 'violet',
    icon: 'Summarist',
  },
  {
    name: 'Ultraverse Internship',
    desc: 'An internship platform with application tracking, dashboards, and smooth onboarding.',
    tags: ['Next.js', 'Node.js', 'Tailwind'],
    link: 'https://github.com/celestiahall44/celestia-internship',
    tone: 'indigo',
    icon: 'Ultraverse',
  },
  {
    name: 'Flix React',
    desc: 'A movie app with search, login, and recommendation-focused browsing flows.',
    tags: ['React', 'Firebase', 'TMDB API'],
    link: 'https://github.com/celestiahall44',
    tone: 'orange',
    icon: 'Flix',
  },
  {
    name: 'Skintristic',
    desc: 'An AI-inspired skincare experience with personalized recommendations and clean UX.',
    tags: ['React', 'Next.js', 'Tailwind'],
    link: 'https://github.com/celestiahall44/Skintristic',
    tone: 'rose',
    icon: 'Skintristic',
  },
]

const skills = [
  'React',
  'Next.js',
  'JavaScript (ES6+)',
  'HTML & CSS',
  'Tailwind CSS',
  'Styled Components',
  'Firebase',
  'Node.js',
  'Vercel',
  'TMDB API',
  'NLP',
]

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [])
}

function useStarfield(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let stars = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      const count = Math.floor((rect.width * rect.height) / 7000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.03 + 0.01,
      }))
    }

    const render = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      stars.forEach((s) => {
        s.a += s.speed
        if (s.a > 1 || s.a < 0) s.speed *= -1

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.abs(s.a) * 0.85})`
        ctx.fill()
      })

      raf = requestAnimationFrame(render)
    }

    resize()
    render()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

function App() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [stats, setStats] = useState({ contributions: 0, repositories: 0, projects: 0 })
  const heroCanvasRef = useRef(null)

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  useReveal()
  useStarfield(heroCanvasRef)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = { contributions: 246, repositories: 20, projects: 5 }
    const duration = 1200
    const start = performance.now()

    let raf = 0
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setStats({
        contributions: Math.floor(target.contributions * eased),
        repositories: Math.floor(target.repositories * eased),
        projects: Math.floor(target.projects * eased),
      })

      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!serviceId || !templateId || !publicKey) {
      setSendError('Email service is not configured yet. Add your EmailJS keys in .env.')
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    setSending(true)
    setSendError('')

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: 'celestia.hall44@gmail.com',
          from_name: name,
          from_email: email,
          message,
        },
        { publicKey },
      )

      setSent(true)
      form.reset()
      setTimeout(() => setSent(false), 3500)
    } catch {
      setSendError('Message failed to send. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  const weeks = 40
  const gridCells = Array.from({ length: weeks * 7 }, (_, i) => {
    const value = (i * 37 + 17) % 100
    const level = value > 80 ? 3 : value > 60 ? 2 : value > 40 ? 1 : 0
    return level
  })

  return (
    <div className="site-wrap">
      <nav className={`top-nav ${scrolled ? 'top-nav--solid' : ''}`}>
        <a href="#home" className="logo-mark">
          Celestia <span>✦</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#experience">Journey</a>
          <a className="pill" href="#contact">
            Contact
          </a>
        </div>
      </nav>

      <header id="home" className="hero-header">
        <canvas ref={heroCanvasRef} className="hero-stars" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Frontend Developer</p>
          <h1>Hi, I&apos;m Celestia</h1>
          <p className="hero-copy">
            Building creative, thoughtful web experiences from the mountains of Polson, Montana.
          </p>
          <div className="hero-cta">
            <a className="btn btn--solid" href="#contact">
              Get in touch
            </a>
            <a className="btn btn--ghost" href="#work">
              View my work
            </a>
          </div>
        </div>
        <a className="scroll-tip" href="#about">
          SCROLL
          <span>↓</span>
        </a>
      </header>

      <section id="about" className="about-section">
        <div className="container split" data-reveal>
          <div>
            <h2>About Me</h2>
            <div className="line" />
            <p>
              I&apos;m an aspiring Frontend Developer with a strong foundation in HTML, CSS,
              JavaScript, and React. I love turning ideas into responsive, user-friendly interfaces.
            </p>
            <p>
              After years of problem-solving in customer-facing and logistics roles, I bring
              persistence, curiosity, and strong attention to detail into every project.
            </p>
            <div className="stat-row">
              <div>
                <strong>{stats.contributions}</strong>
                <span>Contributions</span>
              </div>
              <div>
                <strong>{stats.repositories}</strong>
                <span>Repositories</span>
              </div>
              <div>
                <strong>{stats.projects}+</strong>
                <span>Projects</span>
              </div>
            </div>
          </div>
          <div>
            <h2>Skills</h2>
            <div className="line" />
            <div className="skill-grid">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="work-section">
        <div className="container">
          <div className="section-head" data-reveal>
            <h2>Featured Projects</h2>
            <p>A selection of apps I&apos;ve designed and built while learning.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" data-reveal key={project.name}>
                <div className={`project-top project-top--${project.tone}`}>
                  <span>{project.icon}</span>
                </div>
                <div className="project-body">
                  <h3>{project.name}</h3>
                  <p>{project.desc}</p>
                  <div className="tag-list">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noreferrer">
                    View Project →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="journey-section">
        <div className="container split split--journey">
          <div data-reveal>
            <h3>Experience</h3>
            <div className="timeline">
              <article>
                <time>Oct 2019 — Present</time>
                <h4>Delivery Driver</h4>
                <p>UPS · Polson, MT</p>
              </article>
              <article>
                <time>Apr 2019 — Oct 2019</time>
                <h4>Customer Service Representative</h4>
                <p>Peloton · Great Falls, MT</p>
              </article>
              <article>
                <time>2012 — 2017</time>
                <h4>Inventory Clerk</h4>
                <p>UNICOR · Phoenix, AZ</p>
              </article>
            </div>
          </div>

          <div data-reveal>
            <h3>Education</h3>
            <div className="edu-cards">
              <article>
                <time>Jan 2026 — Aug 2026</time>
                <h4>Frontend Simplified</h4>
                <p>Frontend Software Development</p>
              </article>
              <article>
                <time>2015 — 2019</time>
                <h4>Coastline Community College</h4>
                <p>Associate&apos;s, Social & Behavioral Science</p>
              </article>
              <article className="graph-card">
                <h4>GitHub · last 12 months</h4>
                <div className="contrib-graph">
                  {gridCells.map((level, idx) => (
                    <span key={idx} className={`lvl-${level}`} />
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container narrow" data-reveal>
          <p className="eyebrow">Let&apos;s connect</p>
          <h2>Have a project in mind?</h2>
          <p>
            I&apos;m open to junior frontend roles, collaborations, and freelance work. Let&apos;s build
            something great together.
          </p>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="contact-row">
              <input required name="name" placeholder="Your name" />
              <input required name="email" type="email" placeholder="Your email" />
            </div>
            <textarea required name="message" rows={4} placeholder="Tell me about your project..." />
            <button type="submit" disabled={sending}>
              {sending ? 'Sending...' : sent ? "Thanks! I'll be in touch ✦" : 'Send message'}
            </button>
            {sendError ? <p className="form-error">{sendError}</p> : null}
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="socials">
          <a href="https://github.com/celestiahall44" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/celestia-hall-234795195/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:celestia.hall44@gmail.com">Email</a>
        </div>
        <p>© 2026 Celestia Hall · Crafted among the stars ✦</p>
      </footer>
    </div>
  )
}

export default App
