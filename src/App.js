import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';


function Title() {
  return <h1>@hyperbole22</h1>;
}

function Home() {
  const isMobile = useIsMobile();
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setFade(true);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Carousel Section */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <img
          src={slides[currentSlide]}
          alt="carousel"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.35)'
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: 'white', pointerEvents: 'none',
	  width: '90%'
        }}>
          <h1 style={{ fontSize: isMobile ? '2rem' : '4rem', fontWeight: '700', margin: 0, letterSpacing: '2px' }}>
            Alex Sullivan
          </h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', marginTop: '12px', opacity: 0.85 }}>
            Computer Science Student
          </p>
        </div>
      </div>

      {/* Highlights Section */}
      <div style={{ padding: isMobile ? '40px 20px' : '60px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>
          Highlights
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
          gap: '24px'
        }}>

          {/* About Me */}
          <div style={{ flex: 1 }}>
            <h3>About Me</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
              <img
                src="../images/mepretty.jpeg"
                alt="Alex Sullivan"
                style={{
                  width: '100px', height: '100px',
                  borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <p style={{ margin: 0, lineHeight: '1.7', color: '#444444' }}>
                Hi, I'm Alex — a CS student passionate about building clean,
                functional software. I love backend systems, APIs, and solving
                real-world problems with code.
              </p>
            </div>
          </div>

          {!isMobile && <div style={{ width: '1px', background: '#0000ff', alignSelf: 'stretch' }} />}
          {isMobile && <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #0000ff' }} />}

          
          {/* Top Skills */}
          <div style={{ flex: 1 }}>
            <h3>Top Skills</h3>
            {['Python', 'Java', 'HTML & CSS'].map(skill => (
              <div key={skill} style={{
                background: '#f4f4f4', borderRadius: '8px',
                padding: '10px 16px', marginBottom: '10px',
                fontWeight: '500'
              }}>
                {skill}
              </div>
            ))}
          </div>

          {/* Divider */}
          {!isMobile && <div style={{ width: '1px', background: '#0000ff', alignSelf: 'stretch' }} />}
          {isMobile && <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #0000ff' }} />}


          {/* Top Project */}
          <div style={{ flex: '1' }}>
            <h3>Top Project</h3>
            <div style={{
              border: '1px solid #4a4aff', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px' }}>Non-prof org site</h4>
              <p style={{ margin: '0 0 12px', color: '#555', lineHeight: '1.6' }}>
                A website for a mother and daughter to inform people about strokes and tell people about their
                book about the daughters stroke experience and recovery from the mothers eyes.
              </p>
              <a
                href="https://github.com/hyperbole22/InTheFaceOfCatastropheGroupWebsite"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '500' }}
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

function AboutMe() {
  return (
    <section id="about">
      <div class='header'><h2>About Me</h2></div>
      <div class='container'>
          <div class='text'>
            <p>Hello! My name is Alex Sullivan, I am currently a computer science student at Pace University.
              I am a part of a few different organizations on campus, including Gamma Sigma Sigma service sorority
              and the swimming and diving team. I am from South Jersey (about 20 minutes away from Philadelphia) 
              and I have 3 cats named Kiki, Soup, and Momo. Kiki stays on campus with me during the school year, 
              while the other two stay home with my parents and sister, Natalie. In my free time, I enjoy swimming 
              for fun, spending time with my family, and making things with pottery. Some of my top goals at the 
              moment are to complete a research project this summer, build a website for people to find higher
              education right for them, and to get a job lined up with a lot of travel involved.
            </p>
          </div>
        <div class='image'>
          <img src="../images/sisswim.png" alt="Alex Sullivan" style={{ width: '563.25px', height: '422.25px', borderRadius: '8px' }} />
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <ul>
        <li>Python</li>
        <li>Java</li>
        <li>JavaScript & React</li>
        <li>C++</li>
        <li>HTML5 & CSS</li>
        <li>Data Structures (AVL Trees, HashSets)</li>
        <li>C#</li>
        <li>Unity</li>
      </ul>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects">
      <center><h2>Projects</h2></center>
      <div class="project-container">
        <h4>Store API</h4>
        <p>Built a secure API using FastAPI and MariaDB that allows users to purchase items displayed.</p>
        <img src="../images/dbSite.png" alt="Store Api Site" style={{ width: '473.25px', height: '243.5px', borderRadius: '8px' }}></img>
        <h4>Non-profit organization website</h4>
        <p>Created a website for a mother and daughter to inform people about strokes and advertise their
          book about the daughters stroke experience and recovery from the mothers eyes.</p>
        <h4>Personal Portfolio</h4>
        <p>Designed and built this portfolio for anyone to be able to view my experience, visit, and get in contact with me.</p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact">
      <h1>Contact Me!</h1>
      <form className="contact-form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required></textarea>

        <button type="submit" className="cta-button">Send Message</button>
      </form>
    </section>
  );
}

function BottomNav() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/AboutMe', label: 'About' },
    { to: '/Skills', label: 'Skills' },
    { to: '/Projects', label: 'Projects' },
    { to: '/Contact', label: 'Contact' },
  ];

  const filtered = links.filter(link => link.to !== location.pathname);

  return (
    <div style={{ textAlign: 'center', padding: '40px 0 20px', color: '#666', fontSize: '0.95rem' }}>
      {filtered.map((link, i) => (
        <React.Fragment key={link.to}>
          {i > 0 && <span style={{ margin: '0 8px' }}>|</span>}
          <Link to={link.to} style={{ color: '#444', textDecoration: 'none' }}>
            {link.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <Title />
       <nav style={{ padding: '10px 20px', borderBottom: '1px solid #f4f4f4', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {isMobile ? (
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              style={{ background: '#e424c8', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ☰
            </button>
          ) : (
            <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0, alignItems: 'center' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/AboutMe">About Me</Link></li>
              <li><Link to="/Skills">Skills</Link></li>
              <li><Link to="/Projects">Projects</Link></li>
              <li><Link to="/Contact">Contact</Link></li>
            </ul>
          )}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="mailto:klsullivan03@gmail.com">
              <img src="../images/Gmail-Logo.png" alt="Gmail" width="40" height="32" />
            </a>
            <a href="https://www.linkedin.com/in/alex-sullivan-4046bb249/" target="_blank" rel="noopener noreferrer">
              <img src="../images/linkedin_logo.jpg" alt="LinkedIn" width="32" height="32" />
            </a>
            <a href="https://github.com/hyperbole22" target="_blank" rel="noopener noreferrer">
              <img src="../images/github_logo.png" alt="GitHub" width="32" height="32" />
            </a>
          </div>

        </div>

        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <ul style={{
            listStyle: 'none', margin: '10px 0 0', padding: '10px 0',
            borderTop: '1px solid #ceee', display: 'flex',
            flexDirection: 'column', gap: '12px'
          }}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/AboutMe" onClick={() => setMenuOpen(false)}>About Me</Link></li>
            <li><Link to="/Skills" onClick={() => setMenuOpen(false)}>Skills</Link></li>
            <li><Link to="/Projects" onClick={() => setMenuOpen(false)}>Projects</Link></li>
            <li><Link to="/Contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>
        )}
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AboutMe" element={<div style={{ padding: '20px' }}><AboutMe /><BottomNav /></div>} />
          <Route path="/Skills" element={<div style={{ padding: '20px' }}><Skills /><BottomNav /></div>} />
          <Route path="/Projects" element={<div style={{ padding: '20px' }}><Projects /><BottomNav /></div>} />
          <Route path="/Contact" element={<div style={{ padding: '20px' }}><Contact /><BottomNav /></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}