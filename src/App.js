import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate, BrowserRouter } from 'react-router-dom';

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

{/* Search context */}
// Shares the search query across the whole app so the nav bar can drive
// highlighting on any page.
const SearchContext = React.createContext();

function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

function useSearch() {
  return React.useContext(SearchContext);
}

{/* Highlight helper */}
// Wraps any text that matches the query in a yellow <mark>.
function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = String(text).split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} style={{ background: '#f9e642', borderRadius: '2px', padding: '0 1px' }}>{part}</mark>
          : part
      )}
    </>
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
    <div className="title-bar" style={{ background: dark ? '#0f0f1a' : undefined }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ margin: 0, color: dark ? '#f0d6ff' : '#000' }}>@hyperbole22</h1>
      </Link>
      <ThemeToggle />
    </div>
  );
}

{/* Search bar */}
function NavSearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
  };

  const handleClear = () => setSearchQuery('');

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span style={{
        position: 'absolute',
        left: '10px',
        fontSize: '0.9rem',
        color: dark ? '#c084fc' : '#a855f7',
        pointerEvents: 'none',
      }}>🔍</span>
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search…"
        aria-label="Search portfolio"
        style={{
          paddingLeft: '32px',
          paddingRight: searchQuery ? '28px' : '10px',
          paddingTop: '6px',
          paddingBottom: '6px',
          borderRadius: '999px',
          border: `1.5px solid ${dark ? '#6b3fa0' : '#d8b4fe'}`,
          background: dark ? '#2d1f3d' : '#fdf4ff',
          color: dark ? '#f0d6ff' : '#222',
          fontSize: '0.9rem',
          outline: 'none',
          width: '160px',
          transition: 'width 0.2s ease, border-color 0.2s ease',
        }}
        onFocus={e => { e.target.style.width = '210px'; e.target.style.borderColor = '#a855f7'; }}
        onBlur={e => { e.target.style.width = '160px'; e.target.style.borderColor = dark ? '#6b3fa0' : '#d8b4fe'; }}
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: dark ? '#c084fc' : '#a855f7',
            fontSize: '0.85rem',
            padding: 0,
            lineHeight: 1,
          }}
        >✕</button>
      )}
    </div>
  );
}

{/* Repo detail modal */}
function RepoModal({ repo, onClose, dark }) {
  const [details, setDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch extra repo details: contributors, releases, open issues count
  React.useEffect(() => {
    if (!repo) return;
    const base = `https://api.github.com/repos/${repo.full_name}`;
    Promise.all([
      fetch(`${base}/contributors?per_page=5`).then(r => r.ok ? r.json() : []),
      fetch(`${base}/releases?per_page=3`).then(r => r.ok ? r.json() : []),
      fetch(`${base}/tags?per_page=3`).then(r => r.ok ? r.json() : []),
    ]).then(([contributors, releases, tags]) => {
      setDetails({ contributors, releases, tags });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [repo]);

  if (!repo) return null;

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        background: dark ? '#1e1030' : '#fff',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        position: 'relative',
        border: dark ? '1px solid #6b3fa0' : '1px solid #e8d5f5',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '14px', right: '16px',
            background: 'none', border: 'none',
            fontSize: '1.4rem', cursor: 'pointer',
            color: dark ? '#c084fc' : '#a855f7',
          }}
        >✕</button>

        {/* Header */}
        <h2 style={{ margin: '0 0 4px', color: dark ? '#f0d6ff' : '#1a1a1a', fontSize: '1.3rem' }}>
          {repo.name}
        </h2>
        <p style={{ margin: '0 0 16px', color: dark ? '#c4a8d8' : '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {repo.description || 'No description provided.'}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { label: '⭐ Stars', value: repo.stargazers_count },
            { label: '👁 Watchers', value: repo.watchers_count },
            { label: '🍴 Forks', value: repo.forks_count },
            { label: '🐛 Issues', value: repo.open_issues_count },
          ].map(stat => (
            <div key={stat.label} style={{
              background: dark ? '#2d1f3d' : '#fdf4ff',
              border: `1px solid ${dark ? '#6b3fa0' : '#e8d5f5'}`,
              borderRadius: '8px',
              padding: '8px 14px',
              textAlign: 'center',
              minWidth: '80px',
            }}>
              <div style={{ fontSize: '0.75rem', color: dark ? '#c084fc' : '#7c3aed', marginBottom: '2px' }}>{stat.label}</div>
              <div style={{ fontWeight: 700, color: dark ? '#f0d6ff' : '#222' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {repo.language && (
          <p style={{ margin: '0 0 16px' }}>
            <span className="project-tag">🖥 {repo.language}</span>
          </p>
        )}

        {loading ? (
          <p style={{ color: dark ? '#c4a8d8' : '#888' }}>Loading details…</p>
        ) : details && (
          <>
            {/* Contributors */}
            {details.contributors.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px', color: dark ? '#e0c8f5' : '#333', fontSize: '0.95rem' }}>
                  👥 Contributors
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {details.contributors.map(c => (
                    <a key={c.login} href={c.html_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                        color: dark ? '#c084fc' : '#7c3aed', fontSize: '0.85rem' }}>
                      <img src={c.avatar_url} alt={c.login}
                        style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                      {c.login}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Releases */}
            {details.releases.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px', color: dark ? '#e0c8f5' : '#333', fontSize: '0.95rem' }}>
                  🏷 Releases
                </h4>
                {details.releases.map(r => (
                  <div key={r.id} style={{ fontSize: '0.85rem', color: dark ? '#c4a8d8' : '#555', marginBottom: '4px' }}>
                    <strong>{r.tag_name}</strong> — {r.name || 'No title'}
                  </div>
                ))}
              </div>
            )}

            {/* Tags (if no releases) */}
            {details.releases.length === 0 && details.tags.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px', color: dark ? '#e0c8f5' : '#333', fontSize: '0.95rem' }}>
                  🔖 Tags
                </h4>
                {details.tags.map(t => (
                  <div key={t.name} style={{ fontSize: '0.85rem', color: dark ? '#c4a8d8' : '#555', marginBottom: '4px' }}>
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
          style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.9rem' }}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}

{/* Home page */}
function Home() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { searchQuery } = useSearch();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  const slides = [
  process.env.PUBLIC_URL + '/images/meschool.jpeg',
  process.env.PUBLIC_URL + '/images/gamma.jpeg',
  process.env.PUBLIC_URL + '/images/famswim1.jpeg',
  process.env.PUBLIC_URL + '/images/meboat.jpeg',
  process.env.PUBLIC_URL + '/images/sisbillie.jpeg',
  process.env.PUBLIC_URL + '/images/famtrain.jpeg',
  process.env.PUBLIC_URL + '/images/camping.jpeg',
  process.env.PUBLIC_URL + '/images/cats.jpeg',
  process.env.PUBLIC_URL + '/images/mecat.png',
];

  const goToSlide = React.useCallback((index) => {
    if (index === currentSlide) return;
    setFade(false);
    setTimeout(() => { setCurrentSlide(index); setFade(true); }, 400);
  }, [currentSlide]);

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
        <img src={slides[currentSlide]} alt="carousel" className="carousel-img"
          style={{ opacity: fade ? 1 : 0 }} />
        <div className="carousel-overlay" />
        <div className="carousel-text">
          <h1 style={{ fontSize: isMobile ? '2rem' : '4rem' }}>Alex Sullivan</h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>Computer Science Student</p>
        </div>
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`} className="carousel-dot"
              style={{
                width: i === currentSlide ? '14px' : '9px',
                height: i === currentSlide ? '14px' : '9px',
                background: i === currentSlide ? 'white' : 'transparent',
              }} />
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="highlights-section" style={{
        padding: isMobile ? '40px 20px' : '60px 40px',
        background: dark ? '#1a1a2e' : undefined,
        color: dark ? '#f0d6ff' : undefined,
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>
          Highlights
        </h2>
        <div className="highlights-grid" style={{ flexDirection: isMobile ? 'column' : 'row' }}>

          {/* About Me */}
          <div className="highlights-col">
            <Link to="/AboutMe" style={sectionHeadingStyle}>
              <h3 style={{ margin: '0 0 12px' }}>About Me</h3>
            </Link>
            <div className="highlights-about-inner" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
              <img src={process.env.PUBLIC_URL + "/images/mepretty.jpeg"} alt="Alex Sullivan" className="highlights-about-img" />
              <p style={{ margin: 0, lineHeight: '1.7', color: dark ? '#d4b8e0' : '#444444' }}>
                <Highlight text="Hello! My name is Alex. I enjoy web and game design, you should go check out my projects. I also like swimming and crocheting." query={searchQuery} />
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
              <div key={skill} className="skill-pill"
                style={{ background: dark ? '#2d1f3d' : undefined, color: dark ? '#e0c8f5' : undefined }}>
                <Highlight text={skill} query={searchQuery} />
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
            <div className="highlights-top-project"
              style={{ borderColor: dark ? '#6b3fa0' : undefined, background: dark ? '#2d1f3d' : undefined }}>
              <h4 style={{ margin: '0 0 8px', color: dark ? '#e0c8f5' : undefined }}>
                <Highlight text="Non-prof org site" query={searchQuery} />
              </h4>
              <p style={{ margin: '0 0 12px', color: dark ? '#c4a8d8' : '#555', lineHeight: '1.6' }}>
                <Highlight text="A website for a mother and daughter to inform people about strokes and tell people about their book about the daughters stroke experience and recovery from the mothers eyes." query={searchQuery} />
              </p>
              <a href="https://github.com/hyperbole22/InTheFaceOfCatastropheGroupWebsite"
                target="_blank" rel="noopener noreferrer"
                style={{ color: dark ? '#a855f7' : '#0070f3', textDecoration: 'none', fontWeight: '500' }}>
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
  const { searchQuery } = useSearch();

  const [ghProfile, setGhProfile] = React.useState(null);

  // Fetch GitHub user profile for the About Me section
  React.useEffect(() => {
    fetch('https://api.github.com/users/hyperbole22')
      .then(r => r.json())
      .then(data => setGhProfile(data))
      .catch(() => {});
  }, []);

  const bioText = `Hello! My name is Alex Sullivan, I am currently a computer science student at Pace University.
I am a part of a few different organizations on campus, including Gamma Sigma Sigma service sorority
and the swimming and diving team. I am from South Jersey (about 20 minutes away from Philadelphia)
and I have 3 cats named Kiki, Soup, and Momo. Kiki stays on campus with me during the school year,
while the other two stay home with my parents and sister, Natalie. In my free time, I enjoy swimming
for fun, spending time with my family, and making things with pottery. Some of my top goals at the
moment are to complete a research project this summer, build a website for people to find higher
education right for them, and to get a job lined up with a lot of travel involved.`;

  return (
    <section id="about">
      <div className="header">
        <h2 style={{ color: dark ? '#f0d6ff' : undefined }}>About Me</h2>
      </div>
      <div className="container">
        <div className="text">
          <p style={{ color: dark ? '#d4b8e0' : undefined }}>
            <Highlight text={bioText} query={searchQuery} />
          </p>
        </div>
        <div className="image">
          <img src={process.env.PUBLIC_URL + "/images/sisswim.png"} alt="Alex Sullivan"
            style={{ width: '563.25px', height: '422.25px', borderRadius: '8px' }} />
        </div>
      </div>

      {/* GitHub Profile Stats (Option C) */}
      {ghProfile && (
        <div style={{
          maxWidth: '700px',
          margin: '32px auto',
          padding: '24px',
          borderRadius: '16px',
          background: dark ? '#1e1030' : '#fdf4ff',
          border: `1.5px solid ${dark ? '#6b3fa0' : '#e8d5f5'}`,
          boxShadow: '0 4px 18px rgba(168,85,247,0.08)',
        }}>
          <h3 style={{ margin: '0 0 20px', color: dark ? '#e0c8f5' : '#7c3aed', textAlign: 'center' }}>
            GitHub Profile
          </h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <a href={ghProfile.html_url} target="_blank" rel="noopener noreferrer">
              <img
                src={ghProfile.avatar_url}
                alt="GitHub avatar"
                style={{ width: '90px', height: '90px', borderRadius: '50%',
                  border: `3px solid ${dark ? '#a855f7' : '#d8b4fe'}` }}
              />
            </a>

            {/* Stats */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '1.1rem',
                color: dark ? '#f0d6ff' : '#222' }}>
                {ghProfile.name || ghProfile.login}
              </p>
              {ghProfile.bio && (
                <p style={{ margin: '0 0 12px', color: dark ? '#c4a8d8' : '#555',
                  fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {ghProfile.bio}
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Followers', value: ghProfile.followers },
                  { label: 'Following', value: ghProfile.following },
                  { label: 'Public Repos', value: ghProfile.public_repos },
                  { label: 'Public Gists', value: ghProfile.public_gists },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: dark ? '#2d1f3d' : '#fff',
                    border: `1px solid ${dark ? '#6b3fa0' : '#e8d5f5'}`,
                    borderRadius: '8px',
                    padding: '8px 14px',
                    textAlign: 'center',
                    minWidth: '76px',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: dark ? '#c084fc' : '#7c3aed',
                      marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontWeight: 700, color: dark ? '#f0d6ff' : '#222', fontSize: '1.1rem' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {ghProfile.location && (
            <p style={{ margin: '14px 0 0', color: dark ? '#c4a8d8' : '#666', fontSize: '0.88rem' }}>
              📍 {ghProfile.location}
            </p>
          )}
          {ghProfile.blog && (
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem' }}>
              🔗 <a href={ghProfile.blog} target="_blank" rel="noopener noreferrer"
                style={{ color: dark ? '#c084fc' : '#7c3aed' }}>{ghProfile.blog}</a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}

{/* Skills page */}
const languages = [
  { name: 'Python',      logo: process.env.PUBLIC_URL + '/images/python.png' },
  { name: 'Java',        logo: process.env.PUBLIC_URL + '/images/java.png' },
  { name: 'JavaScript',  logo: process.env.PUBLIC_URL + '/images/javascript.png' },
  { name: 'C++',         logo: process.env.PUBLIC_URL + '/images/cpp.png' },
  { name: 'HTML5 & CSS', logo: process.env.PUBLIC_URL + '/images/html.png' },
  { name: 'C#',          logo: process.env.PUBLIC_URL + '/images/csharp.png' },
];

const apps = [
  { name: 'React',   logo: process.env.PUBLIC_URL + '/images/react.png' },
  { name: 'Unity',   logo: process.env.PUBLIC_URL + '/images/unity.png' },
  { name: 'FastAPI', logo: process.env.PUBLIC_URL + '/images/fastapi.png' },
  { name: 'MariaDB', logo: process.env.PUBLIC_URL + '/images/mariadb.png' },
  { name: 'Git',     logo: process.env.PUBLIC_URL + '/images/git.png' },
  { name: 'VS Code', logo: process.env.PUBLIC_URL + '/images/vscode.png' },
];

function SkillCard({ skill, dark, query }) {
  const [hovered, setHovered] = React.useState(false);

  // Highlight matching skill cards
  const isMatch = query && skill.name.toLowerCase().includes(query.toLowerCase());

  return (
    <div
      className="skill-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: dark
          ? hovered ? '#3d1f5e' : '#2d1f3d'
          : hovered ? '#f3e8ff' : '#fff',
        border: `2px solid ${isMatch ? '#f9e642' : hovered ? '#a855f7' : dark ? '#4a2d6e' : '#e8d5f5'}`,
        boxShadow: isMatch
          ? '0 0 0 3px rgba(249,230,66,0.5)'
          : hovered
            ? '0 10px 28px rgba(168,85,247,0.22)'
            : dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
        outline: isMatch ? '2px solid #f9e642' : 'none',
      }}
    >
      <div className="skill-card-icon" style={{ background: dark ? '#1a1a2e' : undefined }}>
        <img src={skill.logo} alt={skill.name}
          onError={e => { e.target.style.display = 'none'; }} />
      </div>
      <div className="skill-card-label" style={{ color: dark ? '#e0c8f5' : undefined }}>
        <Highlight text={skill.name} query={query} />
      </div>
    </div>
  );
}

function Skills() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { searchQuery } = useSearch();

  return (
    <section id="skills" style={{ padding: '20px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px',
        color: dark ? '#f0d6ff' : '#222' }}>
        Skills
      </h2>
      <br /><br />
      <div style={{ display: 'flex', maxWidth: '860px', margin: '0 auto', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skills-col-heading" style={{ color: dark ? '#c084fc' : undefined }}>
            Languages
          </div>
          <div className="skills-grid">
            {languages.map(s => <SkillCard key={s.name} skill={s} dark={dark} query={searchQuery} />)}
          </div>
        </div>

        <div className="skills-divider" style={{ background: dark ? '#4a2d6e' : undefined }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skills-col-heading" style={{ color: dark ? '#c084fc' : undefined }}>
            Apps & Tools
          </div>
          <div className="skills-grid">
            {apps.map(s => <SkillCard key={s.name} skill={s} dark={dark} query={searchQuery} />)}
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
    img: process.env.PUBLIC_URL + '/images/dbSite.png',
    imgAlt: 'Store API Site',
  },
  {
    title: 'Non-profit Organization Website',
    tags: ['HTML', 'CSS', 'JavaScript'],
    desc: "Created a website for a mother and daughter to inform people about strokes and advertise their book about the daughter's stroke experience and recovery.",
    github: 'https://github.com/hyperbole22/InTheFaceOfCatastropheGroupWebsite',
    emoji: '💜',
    img: process.env.PUBLIC_URL + '/images/nonproforg.png',
    imgAlt: 'Non-profit organization website',
  },
  {
    title: 'Personal Portfolio',
    tags: ['React', 'CSS'],
    desc: 'Designed and built this portfolio for anyone to be able to view my experience, visit, and get in contact with me.',
    github: 'https://github.com/PaceCS-344/project3-hyperbole22-2',
    emoji: '🗂️',
    img: process.env.PUBLIC_URL + '/images/portfolio.png',
    imgAlt: 'Personal Portfolio',
  },
];

function Projects() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { searchQuery } = useSearch();

  const [repos, setRepos] = React.useState([]);
  const [loadingRepos, setLoadingRepos] = React.useState(true);
  const [selectedRepo, setSelectedRepo] = React.useState(null);

  React.useEffect(() => {
    fetch('https://api.github.com/users/hyperbole22/repos?sort=updated&per_page=10')
      .then(res => res.json())
      .then(data => { setRepos(data); setLoadingRepos(false); })
      .catch(() => setLoadingRepos(false));
  }, []);

  // Filter repos by search query (name, description, language)
  const filteredRepos = React.useMemo(() => {
    if (!searchQuery) return repos;
    const q = searchQuery.toLowerCase();
    return repos.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
    );
  }, [repos, searchQuery]);

  return (
    <>
      <h2 style={{ color: dark ? '#f0d6ff' : undefined }}>Projects</h2>
      {searchQuery && (
        <p style={{ color: dark ? '#c084fc' : '#7c3aed', marginBottom: '12px', fontSize: '0.9rem' }}>
          Showing {filteredRepos.length} result{filteredRepos.length !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      )}

      {loadingRepos ? (
        <p>Loading repos...</p>
      ) : filteredRepos.length === 0 ? (
        <p style={{ color: dark ? '#c4a8d8' : '#888' }}>No repos match your search.</p>
      ) : (
        <div className="projects-grid">
          {filteredRepos.map(repo => (
            <div key={repo.id} className="project-card"
              style={{ background: dark ? '#1e1030' : undefined, borderColor: dark ? '#6b3fa0' : undefined }}>
              <div className="project-card-body">
                <div className="project-card-title-row">
                  <h3 style={{ color: dark ? '#f0d6ff' : undefined }}>
                    <Highlight text={repo.name} query={searchQuery} />
                  </h3>
                </div>
                <p className="project-card-desc">
                  <Highlight text={repo.description || 'No description provided.'} query={searchQuery} />
                </p>
                <div className="project-tags">
                  {repo.language && (
                    <span className="project-tag">
                      <Highlight text={repo.language} query={searchQuery} />
                    </span>
                  )}
                  <span className="project-tag">⭐ {repo.stargazers_count}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    className="project-github-link">
                    View on GitHub →
                  </a>
                  {/* Option A: More Details button */}
                  <button
                    onClick={() => setSelectedRepo(repo)}
                    style={{
                      background: 'none',
                      border: `1px solid ${dark ? '#a855f7' : '#d8b4fe'}`,
                      borderRadius: '999px',
                      padding: '3px 12px',
                      cursor: 'pointer',
                      color: dark ? '#c084fc' : '#7c3aed',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    More details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Repo Detail Modal (Option A) */}
      {selectedRepo && (
        <RepoModal
          repo={selectedRepo}
          onClose={() => setSelectedRepo(null)}
          dark={dark}
        />
      )}
    </>
  );
}

{/* Bottom nav */}
function BottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/AboutMe', label: 'About Me' },
    { to: '/Skills', label: 'Skills' },
    { to: '/Projects', label: 'Projects' },
  ];

  const filtered = links.filter(link => link.to !== location.pathname);

  return (
    <div className="bottom-nav" style={{ color: dark ? '#b89ccf' : undefined }}>
      {filtered.map((link, i) => (
        <React.Fragment key={link.to}>
          {i > 0 && <span className="bottom-nav-sep">|</span>}
          <Link to={link.to} style={{ color: dark ? '#d4a8f0' : undefined }}>{link.label}</Link>
        </React.Fragment>
      ))}
    </div>
  );
}

{/* Main app */}
export default function App() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <ThemeProvider>
      <SearchProvider>
        <BrowserRouter>
          <ThemedApp isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </BrowserRouter>
      </SearchProvider>
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
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="nav-inner">
          {isMobile ? (
            <button onClick={() => setMenuOpen(prev => !prev)} className="hamburger-btn">☰</button>
          ) : (
            <ul>
              <li><Link to="/" style={{ color: dark ? '#e0c8f5' : undefined }}>Home</Link></li>
              <li><Link to="/AboutMe" style={{ color: dark ? '#e0c8f5' : undefined }}>About Me</Link></li>
              <li><Link to="/Skills" style={{ color: dark ? '#e0c8f5' : undefined }}>Skills</Link></li>
              <li><Link to="/Projects" style={{ color: dark ? '#e0c8f5' : undefined }}>Projects</Link></li>
            </ul>
          )}

          <div className="nav-social" style={{ alignItems: 'center', gap: '12px' }}>
            <NavSearchBar />

            <a href="mailto:klsullivan03@gmail.com">
              <img src={process.env.PUBLIC_URL + "/images/Gmail-Logo.png"} alt="Gmail" width="40" height="32" />
            </a>
            <a href="https://www.linkedin.com/in/alex-sullivan-4046bb249/" target="_blank" rel="noopener noreferrer">
              <img src={process.env.PUBLIC_URL + "/images/linkedin_logo.png"} alt="LinkedIn" width="32" height="32" />
            </a>
            <a href="https://github.com/hyperbole22" target="_blank" rel="noopener noreferrer">
              <img src={process.env.PUBLIC_URL + "/images/github_logo.png"} alt="GitHub" width="32" height="32" />
            </a>
          </div>
        </div>

        {isMobile && menuOpen && (
          <ul className="mobile-menu" style={{ borderTopColor: dark ? '#3d1f5e' : undefined }}>
            <li><Link to="/" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Home</Link></li>
            <li><Link to="/AboutMe" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>About Me</Link></li>
            <li><Link to="/Skills" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Skills</Link></li>
            <li><Link to="/Projects" onClick={() => setMenuOpen(false)} style={{ color: dark ? '#e0c8f5' : '#333' }}>Projects</Link></li>
            {/* Search bar in mobile menu too */}
            <li style={{ padding: '4px 0' }}><NavSearchBar /></li>
          </ul>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutMe" element={
          <div style={{ padding: '20px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}>
            <AboutMe /><BottomNav />
          </div>
        } />
        <Route path="/Skills" element={
          <div style={{ padding: '20px 40px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}>
            <Skills /><BottomNav />
          </div>
        } />
        <Route path="/Projects" element={
          <div style={{ padding: '20px 40px', background: dark ? '#0f0f1a' : undefined, minHeight: '100vh', transition: 'background 0.3s ease' }}>
            <Projects /><BottomNav />
          </div>
        } />
      </Routes>
    </div>
  );
}