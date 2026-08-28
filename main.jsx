import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Eye, EyeOff, LoaderCircle, Mail, MapPin, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import './styles.css';

const cities = {
  Delhi: ['New Delhi', 'Noida', 'Gurugram'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Karnataka: ['Bengaluru', 'Mysuru'],
  Telangana: ['Hyderabad', 'Warangal'],
};

const interests = ['Parties', 'Music', 'Food', 'Sports', 'Movies', 'Gaming', 'Travel', 'Networking', 'Art', 'Fitness'];

function Logo() {
  return <div className="brand"><span className="brand-mark">E</span><span>EXTROVERTS</span></div>;
}

function Blob({ className = '' }) { return <span className={`blob ${className}`} aria-hidden="true" />; }

function App() {
  const [page, setPage] = useState('home');
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(() => JSON.parse(sessionStorage.getItem('extroverts-form') || 'null') || {
    email: '', otp: '', password: '', name: '', age: '', pronouns: '', state: '', city: '', college: '', interests: []
  });

  useEffect(() => sessionStorage.setItem('extroverts-form', JSON.stringify(form)), [form]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }, [toast]);

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const toggleInterest = (item) => update('interests', form.interests.includes(item) ? form.interests.filter(x => x !== item) : [...form.interests, item]);

  const next = async () => {
    const error = validate(step, form);
    if (error) { setToast({ type: 'error', text: error }); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 550));
    setLoading(false);
    if (step < 4) setStep(s => s + 1);
    else setPage('success');
  };

  const reset = () => {
    sessionStorage.removeItem('extroverts-form');
    setForm({ email: '', otp: '', password: '', name: '', age: '', pronouns: '', state: '', city: '', college: '', interests: [] });
    setStep(1); setPage('home');
  };

  return <div className="app-shell">
    <Blob className="blob-one" /><Blob className="blob-two" /><Blob className="blob-three" />
    <header className="topbar"><Logo /><nav><button onClick={() => setPage('terms')}>Terms</button><button onClick={() => setPage('home')}>About</button></nav></header>

    {page === 'home' && <Home onStart={() => { setPage('signup'); setStep(1); }} />}
    {page === 'terms' && <Terms onBack={() => setPage('home')} />}
    {page === 'signup' && <Signup step={step} form={form} update={update} showPassword={showPassword} setShowPassword={setShowPassword} next={next} back={() => step === 1 ? setPage('home') : setStep(s => s - 1)} loading={loading} toggleInterest={toggleInterest} />}
    {page === 'success' && <Success reset={reset} />}

    {toast && <div className={`toast ${toast.type}`}><span>{toast.type === 'error' ? <X size={18}/> : <Check size={18}/>}</span>{toast.text}</div>}
  </div>
}

function Home({ onStart }) {
  return <main className="home page-pad">
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> REAL PEOPLE. REAL PLANS.</div>
        <h1>Turn any night<br/><em>into a party.</em></h1>
        <p>Meet people nearby, find something happening, and make plans worth remembering. No endless scrolling — just real-world vibes.</p>
        <div className="hero-actions"><button className="primary" onClick={onStart}>Create your profile <ArrowRight size={19}/></button><button className="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>See how it works</button></div>
        <div className="micro"><ShieldCheck size={16}/> Your profile stays yours. <span>18+ community</span></div>
      </div>
      <div className="hero-art">
        <div className="photo-card main-photo"><div className="photo-overlay"><span>Tonight's vibe</span><strong>Find your people.</strong></div></div>
        <div className="floating-card"><Users size={17}/><div><b>2,400+</b><small>people finding plans</small></div></div>
        <div className="tag tag-a">Music</div><div className="tag tag-b">Weekend</div><div className="tag tag-c">Hangouts</div>
      </div>
    </section>
    <section className="feature-row" id="features">
      <Feature icon={<MapPin/>} title="Find nearby" text="Discover local events and people around you." />
      <Feature icon={<Users/>} title="Meet for real" text="Chat, join a hangout and make memories offline." />
      <Feature icon={<Sparkles/>} title="Build your vibe" text="Shape a profile around the things you actually enjoy." />
    </section>
  </main>
}

function Feature({ icon, title, text }) { return <article className="feature"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article> }

function Terms({ onBack }) {
  return <main className="legal page-pad"><button className="back-link" onClick={onBack}><ArrowLeft size={18}/> Back</button><div className="legal-card"><div className="eyebrow">EXTROVERTS</div><h1>Terms & Conditions</h1><p className="muted">A concise version for this front-end assessment.</p>
    <h2>1. Community</h2><p>Extroverts is built for meeting people and joining real-world activities. Be respectful, honest and considerate when interacting with others.</p>
    <h2>2. Eligibility</h2><p>You must be 18 or older to create a full profile and participate in the community. The signup flow intentionally avoids collecting unnecessary age-dependent details before eligibility is established.</p>
    <h2>3. Your account</h2><p>Keep your login information private. You are responsible for activity performed through your account.</p>
    <h2>4. Safety</h2><p>Use your judgement when meeting someone. Choose public places, tell a friend where you are going, and report behaviour that makes you uncomfortable.</p>
    <h2>5. Content</h2><p>Do not upload or share content that is unlawful, threatening, abusive, or infringes another person's rights.</p>
    <h2>6. Privacy</h2><p>Only information needed to create and personalize your profile should be requested. This demo stores form state locally in your browser and does not send it to a server.</p>
    <button className="primary" onClick={onBack}>Back to Extroverts <ArrowRight size={18}/></button>
  </div></main>
}

function Signup({ step, form, update, showPassword, setShowPassword, next, back, loading, toggleInterest }) {
  const titles = ['Start with your email', 'Check your inbox', 'Tell us about you', 'Find your people'];
  const subtitles = ['We’ll use it to secure your account.', 'Enter the demo code to continue.', 'Just the basics — you can add more later.', 'Pick a few things you enjoy.'];
  return <main className="signup page-pad">
    <div className="wizard-top"><button className="back-link" onClick={back}><ArrowLeft size={18}/> Back</button><span>STEP {step} OF 4</span></div>
    <div className="progress"><i style={{ width: `${step * 25}%` }} /></div>
    <section className="signup-card">
      <div className="signup-aside"><div className="aside-inner"><Logo/><div className="aside-copy"><span>YOUR NEXT STORY</span><h2>Meet the people who make the night.</h2><p>Build your profile in a few quick steps and start discovering your vibe.</p></div><div className="step-list">{titles.map((t,i)=><div className={i+1===step?'active':''} key={t}><b>{String(i+1).padStart(2,'0')}</b><span>{t}</span></div>)}</div></div></div>
      <div className="signup-main"><div className="form-heading"><span className="step-label">STEP {step}</span><h1>{titles[step-1]}</h1><p>{subtitles[step-1]}</p></div>
        {step === 1 && <StepEmail form={form} update={update} showPassword={showPassword} setShowPassword={setShowPassword}/>} 
        {step === 2 && <StepOtp form={form} update={update}/>} 
        {step === 3 && <StepProfile form={form} update={update}/>} 
        {step === 4 && <StepInterests form={form} toggleInterest={toggleInterest}/>} 
        <button className="primary full" onClick={next} disabled={loading}>{loading ? <><LoaderCircle className="spin" size={19}/> Checking…</> : <>{step === 4 ? 'Complete profile' : 'Continue'} <ArrowRight size={19}/></>}</button>
        <p className="form-foot">By continuing, you agree to our <button onClick={() => window.scrollTo(0,0)}>Terms & Conditions</button>.</p>
      </div>
    </section>
  </main>
}

function Field({ label, children, hint }) { return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label> }
function StepEmail({ form, update, showPassword, setShowPassword }) { return <div className="fields"><Field label="Email address"><div className="input-icon"><Mail size={18}/><input value={form.email} onChange={e=>update('email',e.target.value)} onBlur={()=>{}} placeholder="you@example.com" type="email" autoFocus/></div></Field><Field label="Create password" hint="At least 8 characters"><div className="input-icon"><ShieldCheck size={18}/><input value={form.password} onChange={e=>update('password',e.target.value)} placeholder="Create a password" type={showPassword?'text':'password'}/><button className="icon-button" onClick={()=>setShowPassword(v=>!v)} type="button">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></Field><div className="info-box"><ShieldCheck size={19}/><span>We’ll send a one-time verification code before asking for profile details.</span></div></div> }
function StepOtp({ form, update }) { return <div className="fields"><Field label="6-digit verification code"><input className="otp-input" inputMode="numeric" maxLength={6} value={form.otp} onChange={e=>update('otp',e.target.value.replace(/\D/g,''))} placeholder="000000" autoFocus/></Field><button className="resend" type="button">Didn’t get it? Resend code</button><div className="info-box"><Mail size={19}/><span>For this front-end demo, use <b>123456</b> as the verification code.</span></div></div> }
function StepProfile({ form, update }) { const adult = Number(form.age) >= 18; return <div className="fields grid-fields"><Field label="Your name"><input value={form.name} onChange={e=>update('name',e.target.value)} placeholder="e.g. Alex" autoFocus/></Field><Field label="Age"><input inputMode="numeric" maxLength={2} value={form.age} onChange={e=>update('age',e.target.value.replace(/\D/g,''))} placeholder="18+"/></Field>{adult && <Field label="Pronouns"><select value={form.pronouns} onChange={e=>update('pronouns',e.target.value)}><option value="">Choose</option><option>she / her</option><option>he / him</option><option>they / them</option><option>prefer not to say</option></select></Field>}<Field label="State"><select value={form.state} onChange={e=>{update('state',e.target.value);update('city','')}}><option value="">Choose state</option>{Object.keys(cities).map(s=><option key={s}>{s}</option>)}</select></Field><Field label="City"><select value={form.city} disabled={!form.state} onChange={e=>update('city',e.target.value)}><option value="">Choose city</option>{(cities[form.state]||[]).map(c=><option key={c}>{c}</option>)}</select></Field><Field label="College / workplace (optional)"><input value={form.college} onChange={e=>update('college',e.target.value)} placeholder="Where you spend your weekdays"/></Field></div> }
function StepInterests({ form, toggleInterest }) { return <div className="fields"><p className="select-label">Pick at least 3 interests</p><div className="chips">{interests.map(i=><button type="button" key={i} className={form.interests.includes(i)?'selected':''} onClick={()=>toggleInterest(i)}>{form.interests.includes(i)&&<Check size={15}/>} {i}</button>)}</div><div className="summary-card"><div className="avatar">{(form.name||'E').slice(0,1).toUpperCase()}</div><div><b>{form.name||'Your profile'}</b><span>{form.city || 'Your city'} · {form.interests.length} interests selected</span></div></div></div> }

function Success({ reset }) { return <main className="success page-pad"><div className="success-card"><div className="success-icon"><Check size={36}/></div><span className="eyebrow">PROFILE COMPLETE</span><h1>You’re ready to<br/><em>find your vibe.</em></h1><p>Your profile has been created locally for this assessment demo. Explore the interface or restart the flow to test validation again.</p><div className="success-actions"><button className="primary" onClick={()=>alert('Demo complete — this would open the discovery screen.')}>Enter Extroverts <ArrowRight size={19}/></button><button className="ghost" onClick={reset}>Run signup again</button></div></div></main> }

function validate(step, f) {
  if (step===1) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Please enter a valid email address.'; if ((f.password||'').length < 8) return 'Password must be at least 8 characters.'; }
  if (step===2 && f.otp !== '123456') return 'That code is not correct. Try 123456 for this demo.';
  if (step===3) { if (!f.name.trim()) return 'Please enter your name.'; const age=Number(f.age); if (!age || age<18) return 'You must be 18 or older to continue.'; if (!f.state || !f.city) return 'Please select your state and city.'; if (!f.pronouns) return 'Please choose your pronouns.'; }
  if (step===4 && f.interests.length<3) return 'Choose at least 3 interests.';
  return null;
}

createRoot(document.getElementById('root')).render(<App/>);
