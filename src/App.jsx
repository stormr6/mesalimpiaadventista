import { Children, cloneElement, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, Gift, ChefHat, Check, ChevronLeft, ChevronRight, Clock3, CreditCard, Download, FileCheck2, FileQuestion, Layers3, LayoutGrid, ListOrdered, MonitorSmartphone, Moon, RefreshCw, ShieldCheck, ShoppingBasket, Zap } from 'lucide-react';
import { content, pages, gallery, comparison, usage, bonuses } from './content.js';
import { comercial } from './comercial.js';

const painIcons = [Clock3, Layers3, FileQuestion, RefreshCw, ShoppingBasket, Moon];
const mechanismIcons = [ChefHat, LayoutGrid, ListOrdered, ShoppingBasket];
const stepIcons = [CreditCard, Download, MonitorSmartphone];

function CTA({ label = 'QUIERO DEJAR DE IMPROVISAR', href = '#oferta' }) {
  return <a className="btn" href={href}>{label}<span aria-hidden="true">→</span></a>;
}

function SectionTitle({ children, lead }) {
  return <header className="section-title"><h2>{children}</h2>{lead && <p>{lead}</p>}</header>;
}

/* Paginas reais do PDF, exportadas como imagem. */
function PageImg({ src, alt, className = '', ...rest }) {
  return <div className={`sheet ${className}`} {...rest}><img src={src} alt={alt} loading="lazy" decoding="async" /></div>;
}

function ProductComposition({ compact = false }) {
  return <div className={`product-composition${compact ? ' product-composition--compact' : ''}`} aria-label="Portada y páginas del material Mesa Limpia">
    <PageImg src={pages.r02} alt="" className="product-sheet product-sheet--left" />
    <PageImg src={pages.r06} alt="" className="product-sheet product-sheet--middle" />
    <PageImg src={pages.r03} alt="" className="product-sheet product-sheet--right" />
    <PageImg src={pages.cover} alt="Portada de Mesa Limpia" className="product-cover" />
    <div className="phone-mockup"><PageImg src={pages.r07} alt="" /></div>
    <div className="quantity-seal"><strong>100</strong><span>RECETAS</span></div>
  </div>;
}

function SheetFan() {
  return <div className="sheet-fan" aria-label="Tabla de combinaciones, guía de mercado y una receta">
    <PageImg src={pages.tabla} alt="" className="fan-a" />
    <PageImg src={pages.mercado} alt="" className="fan-c" />
    <PageImg src={pages.r05} alt="" className="fan-b" />
  </div>;
}
function ScrollRail({ children, label, className = '', auto = false, interval = 2800 }) {
  const ref = useRef(null);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const normalizeTimerRef = useRef(null);
  const items = Children.toArray(children);
  const renderedItems = auto
    ? [...items, ...items.map((child, index) => cloneElement(child, { key: `loop-${index}`, 'aria-hidden': true }))]
    : items;

  const cycleWidth = () => {
    const rail = ref.current;
    if (!rail || rail.children.length <= items.length) return 0;
    return rail.children[items.length].offsetLeft - rail.children[0].offsetLeft;
  };

  const normalize = () => {
    const rail = ref.current;
    const width = cycleWidth();
    if (!rail || !width) return;
    if (rail.scrollLeft >= width) rail.scrollLeft -= width;
  };

  const pauseTemporarily = () => {
    pausedRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => { pausedRef.current = false; }, 4200);
  };

  const scheduleNormalize = () => {
    window.clearTimeout(normalizeTimerRef.current);
    normalizeTimerRef.current = window.setTimeout(normalize, 700);
  };

  const move = direction => {
    const rail = ref.current;
    if (!rail) return;
    pauseTemporarily();
    const width = cycleWidth();
    if (direction < 0 && width && rail.scrollLeft <= 2) rail.scrollLeft = width;
    rail.scrollBy({ left: direction * rail.clientWidth * .82, behavior: 'smooth' });
    scheduleNormalize();
  };

  useEffect(() => {
    if (!auto || !ref.current) return undefined;
    const rail = ref.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; }, { threshold: .18 });
    observer.observe(rail);
    const timer = window.setInterval(() => {
      if (reduceMotion.matches || pausedRef.current || !visibleRef.current || document.hidden) return;
      const firstItem = rail.children[0];
      const secondItem = rail.children[1];
      const step = secondItem ? secondItem.offsetLeft - firstItem.offsetLeft : rail.clientWidth * .82;
      rail.scrollBy({ left: step, behavior: 'smooth' });
      scheduleNormalize();
    }, interval);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(resumeTimerRef.current);
      window.clearTimeout(normalizeTimerRef.current);
    };
  }, [auto, interval, items.length]);

  return <div className={`rail-stage ${className}`}>
    <button type="button" className="rail-arrow rail-arrow--left" onClick={() => move(-1)} aria-label={`Ver anteriores en ${label}`}><ChevronLeft /></button>
    <div
      className={`rail${auto ? ' rail--loop' : ''}`}
      ref={ref}
      tabIndex="0"
      aria-label={label}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onFocus={() => { pausedRef.current = true; }}
      onBlur={() => { pausedRef.current = false; }}
      onPointerDown={() => { pausedRef.current = true; }}
      onPointerUp={pauseTemporarily}
      onTouchEnd={pauseTemporarily}
    >{renderedItems}</div>
    <button type="button" className="rail-arrow rail-arrow--right" onClick={() => move(1)} aria-label={`Ver siguientes en ${label}`}><ChevronRight /></button>
  </div>;
}

function Comparison() {
  const ref = useRef(null);
  const update = event => ref.current?.style.setProperty('--position', `${event.currentTarget.value}%`);
  return <div className="comparison" ref={ref}>
    <img className="comparison-image" src={pages.r02} alt="Mapa visual de Mesa Limpia: hamburguesas de garbanzos al horno" loading="lazy" />
    <div className="comparison-cut"><img className="comparison-image" src={pages.antes} alt="La misma receta en texto corrido" loading="lazy" /></div>
    <div className="comparison-line" aria-hidden="true"><span><ArrowLeft size={16}/><ArrowRight size={16}/></span></div>
    <input className="comparison-range" type="range" min="8" max="92" defaultValue="48" onInput={update} aria-label="Comparar la receta en texto corrido con el mapa visual" />
  </div>;
}
export default function App() {
  return <>
    <main>
      <section className="hero"><div className="content content--860 hero-flow">
        <p className="hero-pill"><span aria-hidden="true" />{content.hero.badge}</p>
        <h1>{content.hero.titleBefore}<em>{content.hero.titleEmphasis}</em>{content.hero.titleAfter}</h1>
        <div className="hero-media"><ProductComposition /></div>
        <p className="hero-sub">{content.hero.subtitle.map(([text, emphasis], index) => emphasis ? <strong key={index}>{text}</strong> : <span key={index}>{text}</span>)}</p>
        <ul className="hero-bullets">{content.hero.bullets.map(item => <li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
        <CTA label="QUIERO VER LAS RECETAS" href="#previas" />
        <p className="hero-amplitude">{content.hero.amplitude}</p>
      </div></section>

      <section className="section pain"><div className="content content--880 section-flow">
        <SectionTitle>{content.pain.title}<br/>{content.pain.emphasis}</SectionTitle>
        <div className="ornament" aria-hidden="true"><span /></div>
        <div className="pain-grid">{content.pains.map((item,index)=>{const Icon=painIcons[index];return <div className="pain-chip" key={item}><Icon size={18}/><span>{item}</span></div>})}</div>
        <p className="bridge">{content.pain.bridge.map(([text, emphasis], index) => emphasis ? <strong key={index}>{text}</strong> : <span key={index}>{text}</span>)}</p>
      </div></section>

      <section className="section section--tint gallery" id="previas"><div className="content content--1180 section-flow">
        <SectionTitle>{content.gallerySection.title}</SectionTitle>
        <ScrollRail label="Páginas de muestra del material" className="gallery-rail" auto interval={2800}>{gallery.map(([src,alt])=><figure className="gallery-card" key={alt}><PageImg src={src} alt={alt} /></figure>)}</ScrollRail>
        <p className="note">{content.gallerySection.note}</p>
      </div></section>

      <section className="section mechanism"><div className="content content--1120 section-flow">
        <SectionTitle>{content.mechanismTitle}</SectionTitle>
        <div className="mechanism-grid">{content.mechanism.map(([title,text],index)=>{const Icon=mechanismIcons[index];return <article key={title}><span className="mechanism-icon"><Icon size={25}/></span><h3>{title}</h3><p>{text}</p></article>})}</div>
        <p className="mechanism-close">{content.mechanismClose}</p><CTA/>
      </div></section>

      <section className="section section--tint compare"><div className="content content--780 section-flow">
        <SectionTitle lead={comparison.lead}>{comparison.title}</SectionTitle>
        <Comparison /><p className="note">{comparison.note}</p><CTA />
      </div></section>
      <section className="usage-carousel" aria-label="Mesa Limpia en la vida real">
        <div className="content content--860 usage-heading">
          <p>{usage.eyebrow}</p>
          <h2>{usage.title}</h2>
          <span>{usage.lead}</span>
        </div>
        <ScrollRail label="Formas de usar Mesa Limpia" className="usage-rail" auto interval={3000}>{usage.photos.map(([src,alt])=><figure className="usage-photo" key={src}><img src={src} alt={alt} loading="lazy"/></figure>)}</ScrollRail>
      </section>
      <section className="section mid-pitch"><div className="content content--1040 mid-pitch-grid">
        <div className="mid-pitch-media"><SheetFan /></div>
        <div className="mid-pitch-copy"><h2>{content.midPitch.title}</h2><p>{content.midPitch.text}</p><CTA /></div>
      </div></section>

      <section className="section audiences"><div className="content content--1040 section-flow">
        <SectionTitle>Esto es para ti si…</SectionTitle>
        <div className="audience-grid">{content.audiences.map(([title,text])=><article key={title}><span><Check size={17}/></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div></section>

      <section className="section section--tint receive"><div className="content content--1000 section-flow">
        <SectionTitle>{content.receive.title}</SectionTitle>
        <div className="receive-media"><ProductComposition compact /></div>
        <article className="receive-card"><p className="access-badge">{content.receive.badge}</p><h3>{comercial.productName}: 100 recetas vegetarianas</h3><p>{content.receive.summary}</p><ul>{content.benefits.map(item=><li key={item}><Check size={20}/><span>{item}</span></li>)}</ul></article>
      </div></section>

      <section className="section bonuses"><div className="content content--980 section-flow">
        <header className="bonus-intro"><p>Y NO PARA AQUÍ...</p><h2>TAMBIÉN RECIBES</h2><span><Gift size={17}/>{bonuses.length} BONOS INCLUIDOS</span></header>
        <div className="bonus-grid">{bonuses.map(bonus=><article className="bonus-card" key={bonus.title}>
          <div className="bonus-card-top"><p className="bonus-num">{bonus.number}</p><div className="bonus-art"><span className="bonus-art-shadow"/><span className="bonus-page bonus-page--1 bonus-page--blank"/><span className="bonus-page bonus-page--2 bonus-page--blank"/><div className="bonus-book"><img src={bonus.image} alt={`Portada del ${bonus.title}`} loading="lazy"/></div></div></div>
          <div className="bonus-card-body"><h3>{bonus.title}</h3><p>{bonus.text}</p><div className="bonus-gain"><Check size={18}/><span>{bonus.gain}</span></div><div className="bonus-price"><s>{bonus.value}</s><strong>GRATIS HOY</strong></div></div>
        </article>)}</div>
      </div></section>
      <section className="section offer" id="oferta"><div className="content content--720 section-flow">
        <SectionTitle>Deja de improvisar desde hoy</SectionTitle>
        <div className="value-stack" aria-label="Composición del valor de la oferta">
          <p>LO QUE RECIBES HOY</p>
          <ul>{comercial.valueStack.map(([item,value])=><li key={item}><span>{item}</span><s>{value}</s></li>)}</ul>
          <div><strong>VALOR NORMAL DEL PAQUETE</strong><s>{comercial.anchorPrice}</s></div>
        </div>
        <article className="plan-card" id="checkout">
          <p className="plan-badge">100 RECETAS + {bonuses.length} BONOS</p>
          <p className="plan-kicker">OFERTA COMPLETA</p><h3>{comercial.productName}: 100 recetas vegetarianas</h3>
          <div className="plan-mockup"><ProductComposition compact /></div>
          <ul>{content.included.map(item=><li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
          <div className="price"><small>De <s>{comercial.anchorPrice}</s> por solo</small><strong>{comercial.price}</strong><span>{comercial.priceNote}</span></div>
          <CTA label="QUIERO MESA LIMPIA AHORA" href={comercial.checkoutUrl}/><div className="payment-trust"><span><ShieldCheck size={18}/>Pago seguro</span><span><BadgeCheck size={18}/>Pago único</span><span><Zap size={18}/>Acceso inmediato</span></div>
        </article>
        <p className="offer-close">{content.offer.noTrick}</p>
      </div></section>

      <section className="section purchase-safety"><div className="content content--1000 safety-layout">
        <article className="guarantee-card"><ShieldCheck size={54}/><h2>Garantía de {comercial.guaranteeDays} días</h2><p>{comercial.guarantee}</p></article>
        <div className="safety-cards"><article><CreditCard size={30}/><div><h3>Pago seguro</h3><p>Procesado por {comercial.platform}. Tus datos de pago no quedan con nosotros.</p></div></article><article><FileCheck2 size={30}/><div><h3>Criterio claro de alimentos</h3><p>Cada receta evita las carnes que Levítico 11 considera impuras.</p></div></article></div>
      </div></section>

      <section className="section section--tint access-steps"><div className="content content--980 section-flow">
        <SectionTitle>Cómo funciona después del pago</SectionTitle>
        <div className="steps-grid">{content.steps.map(([title,text],index)=>{const Icon=stepIcons[index];return <article key={title}><span>{index+1}</span><Icon/><h3>{title}</h3><p>{text}</p></article>})}</div>
        <CTA />
      </div></section>

      <section className="section faq"><div className="content content--780 section-flow"><SectionTitle>Preguntas frecuentes</SectionTitle><div className="faq-list">{content.faqs.filter(([,answer])=>!answer.startsWith('[') && !answer.includes('[CORREO')).map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <section className="closing"><div className="content content--780 closing-inner"><p>{content.closing.eyebrow}</p><h2>{content.closing.titleBefore}<em>{content.closing.titleEmphasis}</em></h2><CTA/><small>Material digital en PDF. Pago único.</small></div></section>
    </main>
    <footer className="footer"><div className="footer-inner"><p>Soporte: {comercial.supportEmail}</p><p className="footer-legal">Producto independiente, sin vínculo con la Iglesia Adventista del Séptimo Día. Material de recetas: no sustituye la orientación médica o nutricional.</p><nav><a href="#">Términos de uso</a><span>•</span><a href="#">Política de privacidad</a></nav></div></footer>
  </>;
}






