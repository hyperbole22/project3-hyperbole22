import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

{/* Theme context */}
const ThemeContext = React.createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return React.useContext(ThemeContext);
}

{/* Theme button */}
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="theme-toggle"
      style={{
        background: dark ? '#3d1f5e' : undefined,
        borderColor: dark ? '#a855f7' : undefined,
        color: dark ? '#e0c8f5' : undefined,
      }}
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}

{/* Title bar */}
function TitleBar() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div
      className="title-bar"
      style={{ background: dark ? '#0f0f1a' : undefined }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ margin: 0, color: dark ? '#f0d6ff' : '#000' }}>@hyperbole22</h1>
      </Link>
      <ThemeToggle />
    </div>
  );
}

{/* Home page */}
function Home() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  const slides = [
    '../images/meschool.jpeg',
    '../images/gamma.jpeg',
    '../images/famswim1.jpeg',
    '../images/meboat.jpeg',
    '../images/sisbillie.jpeg',
    '../images/famtrain.jpeg',
    '../images/camping.jpeg',
    '../images/cats.jpeg',
    '../images/mecat.png',
  ];

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 400);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sectionHeadingStyle = {
    textDecoration: 'none',
    color: dark ? '#f0d6ff' : 'inherit',
    display: 'inline-block',
    cursor: 'pointer',
  };

  return (
    <>
      {/* Carousel */}
      <div className="carousel-wrapper">
        <img
          src={slides[currentSlide]}
          alt="carousel"
          className="carousel-img"
          style={{ opacity: fade ? 1 : 0 }}
        />
        <div className="carousel-overlay" />
        <div className="carousel-text">
          <h1 style={{ fontSize: isMobile ? '2rem' : '4rem' }}>
            Alex Sullivan
          </h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
            Computer Science Student
          </p>
        </div>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="carousel-dot"
              style={{
                width: i === currentSlide ? '14px' : '9px',
                height: i === currentSlide ? '14px' : '9px',
                background: i === currentSlide ? 'white' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div
        className="highlights-section"
        style={{
          padding: isMobile ? '40px 20px' : '60px 40px',
          background: dark ? '#1a1a2e' : undefined,
          color: dark ? '#f0d6ff' : undefined,
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>
          Highlights
        </h2>
        <div
          className="highlights-grid"
          style={{ flexDirection: isMobile ? 'column' : 'row' }}
        >

          {/* About Me */}
          <div className="highlights-col">
            <Link to="/AboutMe" style={sectionHeadingStyle}>
              <h3 style={{ margin: '0 0 12px' }}>About Me</h3>
            </Link>
            <div
              className="highlights-about-inner"
              style={{ flexDirection: isMobile ? 'column' : 'row' }}
            >
              <img
                src="../images/mepretty.jpeg"
                alt="Alex Sullivan"
                className="highlights-about-img"
              />
              <p style={{ margin: 0, lineHeight: '1.7', color: dark ? '#d4b8e0' : '#444444' }}>
                Hello! My name is Alex. I enjoy web and game design, you should
                go check out my projects. I also like swimming and crocheting.
              </p>
            </div>
          </div>

          {!isMobile && <div className="highlights-divider-v" style={{ background: dark ? '#555' : undefined }} />}
          {isMobile && <hr className="highlights-divider-h" style={{ borderTopColor: dark ? '#555' : undefined }} />}

          {/* Top Skills */}
          <div className="highlights-col">
            <Link to="/Skills" style={sectionHeadingStyle}>
              <h3 style={{ margin: '0 0 12px' }}>Top Skills</h3>
            </Link>
            {['Python', 'Java', 'HTML & CSS'].map(skill => (
              <div
                key={skill}
                className="skill-pill"
                style={{
                  background: dark ? '#2d1f3d' : undefined,
                  color: dark ? '#e0c8f5' : undefined,
                }}
              >
                {skill}
              </div>
            ))}
          </div>

          {!isMobile && <div className="highlights-divider-v" style={{ background: dark ? '#555' : undefined }} />}
          {isMobile && <hr className="highlights-divider-h" style={{ borderTopColor: dark ? '#555' : undefined }} />}

          {/* Top Project */}
          <div className="highlights-col">
            <Link to="/Projects" style={sectionHeadingStyle}>
              <h3 style={{ margin: '0 0 12px' }}>Top Project</h3>
            </Link>
            <div
              className="highlights-top-project"
              style={{
                borderColor: dark ? '#6b3fa0' : undefined,
                background: dark ? '#2d1f3d' : undefined,
              }}
            >
              <h4 style={{ margin: '0 0 8px', color: dark ? '#e0c8f5' : undefined }}>Non-prof org site</h4>
              <p style={{ margin: '0 0 12px', color: dark ? '#c4a8d8' : '#555', lineHeight: '1.6' }}>
                A website for a mother and daughter to inform people about strokes and tell people about their
                book about the daughters stroke experience and recovery from the mothers eyes.
              </p>
              <a
                href="https://github.com/hyperbole22/InTheFaceOfCatastropheGroupWebsite"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: dark ? '#a855f7' : '#0070f3', textDecoration: 'none', fontWeight: '500' }}
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

{/* About me page */}
function AboutMe() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <section id="about">
      <div className='header'>
        <h2 style={{ color: dark ? '#f0d6ff' : undefined }}>About Me</h2>
      </div>
      <div className='container'>
        <div className='text'>
          <p style={{ color: dark ? '#d4b8e0' : undefined }}>
            Hello! My name is Alex Sullivan, I am currently a computer science student at Pace University.
            I am a part of a few different organizations on campus, including Gamma Sigma Sigma service sorority
            and the swimming and diving team. I am from South Jersey (about 20 minutes away from Philadelphia)
            and I have 3 cats named Kiki, Soup, and Momo. Kiki stays on campus with me during the school year,
            while the other two stay home with my parents and sister, Natalie. In my free time, I enjoy swimming
            for fun, spending time with my family, and making things with pottery. Some of my top goals at the
            moment are to complete a research project this summer, build a website for people to find higher
            education right for them, and to get a job lined up with a lot of travel involved.
          </p>
        </div>
        <div className='image'>
          <img src="../images/sisswim.png" alt="Alex Sullivan" style={{ width: '563.25px', height: '422.25px', borderRadius: '8px' }} />
        </div>
      </div>
    </section>
  );
}

{/* Skills page */}
const languages = [
  { name: 'Python',         logo: '../images/python.png' },
  { name: 'Java',           logo: '../images/java.png' },
  { name: 'JavaScript',     logo: '../images/javascript.png' },
  { name: 'C++',            logo: '../images/cpp.png' },
  { name: 'HTML5 & CSS',    logo: '../images/html.png' },
  { name: 'C#',             logo: '../images/csharp.png' },
];

const apps = [
  { name: 'React',          logo: '../images/react.png' },
  { name: 'Unity',          logo: '../images/unity.png' },
  { name: 'FastAPI',        logo: '../images/fastapi.png' },
  { name: 'MariaDB',        logo: '../images/mariadb.png' },
  { name: 'Git',            logo: '../images/git.png' },
  { name: 'VS Code',        logo: '../images/vscode.png' },
];

function SkillCard({ skill, dark }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="skill-card"
      style={{
        background: dark
          ? hovered ? '#3d1f5e' : '#2d1f3d'
          : hovered ? '#f3e8ff' : '#fff',
        border: `2px solid ${hovered ? '#a855f7' : dark ? '#4a2d6e' : '#e8d5f5'}`,
        boxShadow: hovered
          ? '0 10px 28px rgba(168,85,247,0.22)'
          : dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="skill-card-icon"
        style={{ background: dark ? '#1a1a2e' : undefined }}
      >
        <img
          src={skill.logo}
          alt={skill.name}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
      <div
        className="skill-card-label"
        style={{ color: dark ? '#e0c8f5' : undefined }}
      >
        {skill.name}
      </div>
    </div>
  );
}

function Skills() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="skills" style={{ padding: '20px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px', color: dark ? '#f0d6ff' : '#222' }}>
        Skills
      </h2>
      <br /><br />
      <div style={{ display: 'flex', maxWidth: '860px', margin: '0 auto', alignItems: 'flex-start' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="skills-col-heading"
            style={{ color: dark ? '#c084fc' : undefined }}
          >
            Languages
          </div>
          <div className="skills-grid">
            {languages.map(s => <SkillCard key={s.name} skill={s} dark={dark} />)}
          </div>
        </div>

        <div
          className="skills-divider"
          style={{ background: dark ? '#4a2d6e' : undefined }}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="skills-col-heading"
            style={{ color: dark ? '#c084fc' : undefined }}
          >
            Apps & Tools
          </div>
          <div className="skills-grid">
            {apps.map(s => <SkillCard key={s.name} skill={s} dark={dark} />)}
          </div>
        </div>

      </div>
    </section>
  );
}

{/* Projects page */}
const projectsData = [
  {
    title: 'Store API',
    tags: ['Python', 'FastAPI', 'MariaDB'],
    desc: 'Built a secure API using FastAPI and MariaDB that allows users to purchase items displayed.',
    github: 'https://github.com/hyperbole22/project1-nbbaddies',
    emoji: '🛒',
    img: '../images/dbSite.png',
    imgAlt: 'Store API Site',
  },
  {
    title: 'Non-profit Organization Website',
    tags: ['HTML', 'CSS', 'JavaScript'],
    desc: "Created a website for a mother and daughter to inform people about strokes and advertise their book about the daughter's stroke experience and recovery.",
    github: 'https://github.com/hyperbole22/InTheFaceOfCatastropheGroupWebsite',
    emoji: '💜',
    img: '../images/nonproforg.png',
    imgAlt: 'Non-profit organization website',
  },
  {
    title: 'Personal Portfolio',
    tags: ['React', 'CSS'],
    desc: 'Designed and built this portfolio for anyone to be able to view my experience, visit, and get in contact with me.',
    github: 'https://github.com/PaceCS-344/project3-hyperbole22-2',
    emoji: '🗂️',
    img: '../images/portfolio.png',
    imgAlt: 'Personal Portfolio',
  },
];

function Projects() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [hovered, setHovered] = React.useState(null);

  return (
    <section id="projects" style={{ padding: '20px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px', color: dark ? '#f0d6ff' : '#222' }}>
        Projects
      </h2>
      <br /><br />
      <div className="projects-grid">
        {projectsData.map((project) => {
          const isHovered = hovered === project.title;
          return (
            <div
              key={project.title}
              onMouseEnter={() => setHovered(project.title)}
              onMouseLeave={() => setHovered(null)}
              className="project-card"
              style={{
                background: dark
                  ? isHovered ? '#3d1f5e' : '#2d1f3d'
                  : isHovered ? '#faf5ff' : undefined,
                borderColor: isHovered ? '#a855f7' : dark ? '#4a2d6e' : undefined,
                boxShadow: isHovered
                  ? '0 16px 40px rgba(168,85,247,0.2)'
                  : dark ? '0 2px 8px rgba(0,0,0,0.4)' : undefined,
                transform: isHovered ? 'translateY(-6px)' : undefined,
              }}
            >
              <div className="project-card-img-wrapper">
                <img src={project.img} alt={project.imgAlt} />
              </div>
              <div className="project-card-body">
                <div className="project-card-title-row">
                  <span style={{ fontSize: '1.4rem' }}>{project.emoji}</span>
                  <h3 style={{ color: dark ? '#e0c8f5' : undefined }}>
                    {project.title}
                  </h3>
                </div>
                <p
                  className="project-card-desc"
                  style={{ color: dark ? '#c4a8d8' : undefined }}
                >
                  {project.desc}
                </p>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="project-tag"
                      style={{
                        background: dark ? '#1a1a2e' : undefined,
                        color: dark ? '#c084fc' : undefined,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-github-link"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

{/* Contact me page */}
function Contact() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <section id="contact">
      <h1 style={{ color: dark ? '#f0d6ff' : undefined }}>Contact Me!</h1>
      <form className="contact-form" style={{
        background: dark ? '#2d1f3d' : undefined,
        color: dark ? '#e0c8f5' : undefined,
      }}>
        <label htmlFor="name" style={{ color: dark ? '#e0c8f5' : undefined }}>Name</label>
        <input type="text" id="name" name="name" required style={{
          background: dark ? '#1a1a2e' : undefined,
          color: dark ? '#f0d6ff' : undefined,
          border: dark ? '1px solid #6b3fa0' : undefined,
        }} />
        <label htmlFor="email" style={{ color: dark ? '#e0c8f5' : undefined }}>Email</label>
        <input type="email" id="email" name="email" required style={{
          background: dark ? '#1a1a2e' : undefined,
          color: dark ? '#f0d6ff' : undefined,
          border: dark ? '1px solid #6b3fa0' : undefined,
        }} />
        <label htmlFor="message" style={{ color: dark ? '#e0c8f5' : undefined }}>Message</label>
        <textarea id="message" name="message" required style={{
          background: dark ? '#1a1a2e' : undefined,
          color: dark ? '#f0d6ff' : undefined,
          border: dark ? '1px solid #6b3fa0' : undefined,
        }} />
        <button type="submit" className="cta-button">Send Message</button>
      </form>
    </section>
  );
}

function BottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/AboutMe', label: 'About Me' },
    { to: '/Skills', label: 'Skills' },
    { to: '/Projects', label: 'Projects' },
    { to: '/Contact', label: 'Contact' },
  ];

  const filtered = links.filter(link => link.to !== location.pathname);

  return (
    <div
      className="bottom-nav"
      style={{ color: dark ? '#b89ccf' : undefined }}
    >
      {filtered.map((link, i) => (
        <React.Fragment key={link.to}>
          {i > 0 && <span className="bottom-nav-sep">|</span>}
          <Link
            to={link.to}
            style={{ color: dark ? '#d4a8f0' : undefined }}
          >
            {link.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}

{/* Mobile handler */}
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

{/* Main app */}
export default function App() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemedApp isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function ThemedApp({ isMobile, menuOpen, setMenuOpen }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div style={{
      background: dark ? '#0f0f1a' : '#ffbcf5',
      minHeight: '100vh',
      transition: 'background 0.3s ease',
    }}>
      <TitleBar />

      <nav style={{
        borderColor: dark ? '#3d1f5e' : undefined,
        background: dark ? '#1a0d2e' : undefined,
      }}>
        <div className="nav-inner">
          {isMobile ? (
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="hamburger-btn"
            >
              ☰
            </button>
          ) : (
            <ul>
              <li><Link to="/" style={{ color: dark ? '#e0c8f5' : undefined }}>Home</Link></li>
              <li><Link to="/AboutMe" style={{ color: dark ? '#e0c8f5' : undefined }}>About Me</Link></li>
              <li><Link to="/Skills" style={{ color: dark ? '#e0c8f5' : undefined }}>Skills</Link></li>
              <li><Link to="/Projects" style={{ color: dark ? '#e0c8f5' : undefined }}>Projects</Link></li>
              <li><Link to="/Contact" style={{ color: dark ? '#e0c8f5' : undefined }}>Contact</Link></li>
            </ul>
          )}

          <div className="nav-social">
            <a href="mailto:klsullivan03@gmail.com">
              <img src="../images/Gmail-Logo.png" alt="Gmail" width="40" height="32" />
            </a>
            <a href="https://www.linkedin.com/in/alex-sullivan-4046bb249/" target="_blank" rel="noopener noreferrer">
              <img src="../images/linkedin_logo.png" alt="LinkedIn" width="32" height="32" />
            </a>
            <a href="https://github.com/hyperbole22" target="_blank" rel="noopener noreferrer">
              <img src="../images/github_logo.png" alt="GitHub" width="32" height="32" />
            </a>
          </div>
        </div>

        {isMobile && menuOpen && (
          <ul
            className="mobile-menu"
            style={{ borderTopColor: dark ? '#3d1f5e' : undefined }}
          >
            <li><Link to="/" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Home</Link></li>
            <li><Link to="/AboutMe" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>About Me</Link></li>
            <li><Link to="/Skills" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Skills</Link></li>
            <li><Link to="/Projects" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Projects</Link></li>
            <li><Link to="/Contact" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Contact</Link></li>
          </ul>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutMe" element={<div style={{ padding: '20px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}><AboutMe /><BottomNav /></div>} />
        <Route path="/Skills" element={<div style={{ padding: '20px 40px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}><Skills /><BottomNav /></div>} />
        <Route path="/Projects" element={<div style={{ padding: '20px 40px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}><Projects /><BottomNav /></div>} />
        <Route path="/Contact" element={<div style={{ padding: '20px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}><Contact /><BottomNav /></div>} />
      </Routes>
    </div>
  );
}