/**
 * router.js - Hash-based SPA router
 *
 * Loads page partials from /pages/*.html into #app on hash change.
 * Updates document metadata and route-relative URLs on each navigation.
 */

import { buildAbsoluteRuntimeUrl } from './runtime-config.js';
import { trackMetric } from './telemetry.js';

const ROUTES = {
  '': {
    file: 'home',
    titleEn: 'NoDrftSystems',
    titleEs: 'NoDrftSystems',
    descEn: 'Structured website packages and digital builds for teams that need clearer positioning, stronger buyer journeys, and disciplined delivery.',
    descEs: 'Paquetes web y proyectos digitales para equipos que necesitan mejor posicionamiento, recorridos de comprador mas claros y entrega disciplinada.',
  },
  home: {
    file: 'home',
    titleEn: 'NoDrftSystems',
    titleEs: 'NoDrftSystems',
    descEn: 'Structured website packages and digital builds for teams that need clearer positioning, stronger buyer journeys, and disciplined delivery.',
    descEs: 'Paquetes web y proyectos digitales para equipos que necesitan mejor posicionamiento, recorridos de comprador mas claros y entrega disciplinada.',
  },
  capabilities: {
    file: 'capabilities',
    titleEn: 'Website Packages - NoDrftSystems',
    titleEs: 'Paquetes web - NoDrftSystems',
    descEn: 'Structured website packages from clarity sprint to ecosystem build, with clear fit, scope boundaries, and next-step guidance.',
    descEs: 'Paquetes web estructurados desde claridad inicial hasta ecosystem build, con ajuste, limites de alcance y siguiente paso claros.',
  },
  insights: {
    file: 'insights',
    titleEn: 'Insights - NoDrftSystems',
    titleEs: 'Recursos - NoDrftSystems',
    descEn: 'Guidance on package fit, release discipline, handoff quality, and proof posture for serious digital-build engagements.',
    descEs: 'Guia sobre ajuste de paquetes, disciplina de release, calidad de handoff y postura de prueba para proyectos digitales serios.',
  },
  engagements: {
    file: 'engagements',
    titleEn: 'Selected Engagements - NoDrftSystems',
    titleEs: 'Proyectos seleccionados - NoDrftSystems',
    descEn: 'Selected, qualitative engagement snapshots that show how NoDrftSystems clarifies scope, strengthens buyer journeys, and ships disciplined digital builds.',
    descEs: 'Snapshots cualitativos y seleccionados que muestran como NoDrftSystems aclara alcance, fortalece recorridos de comprador y entrega proyectos digitales con disciplina.',
  },
  about: {
    file: 'about',
    titleEn: 'About - NoDrftSystems',
    titleEs: 'Acerca de - NoDrftSystems',
    descEn: 'Who NoDrftSystems is, how it works, and the standards it keeps for serious website and digital-build engagements.',
    descEs: 'Quien es NoDrftSystems, como trabaja y que estandares mantiene para proyectos serios de sitio web y construccion digital.',
  },
  start: {
    file: 'start',
    titleEn: 'Start an Engagement - NoDrftSystems',
    titleEs: 'Iniciar un proyecto - NoDrftSystems',
    descEn: 'Share your business objective, scope, constraints, and timeline so NoDrftSystems can assess fit for a website or digital-build engagement.',
    descEs: 'Comparta su objetivo, alcance, restricciones y plazo para que NoDrftSystems evale el ajuste para un proyecto de sitio web o construccion digital.',
  },
  careers: {
    file: 'careers',
    titleEn: 'Careers - NoDrftSystems',
    titleEs: 'Carreras - NoDrftSystems',
    descEn: 'Future opportunities and vetted specialist interest for people who want to work with NoDrftSystems.',
    descEs: 'Oportunidades futuras e interes de especialistas evaluados para quienes quieran trabajar con NoDrftSystems.',
  },
  inquiries: {
    file: 'inquiries',
    titleEn: 'Inquiries - NoDrftSystems',
    titleEs: 'Consultas - NoDrftSystems',
    descEn: 'General questions, press requests, and partnership conversations.',
    descEs: 'Preguntas generales, solicitudes de prensa y conversaciones de alianza.',
  },
  onboarding: {
    file: 'onboarding',
    titleEn: 'Client Onboarding - NoDrftSystems',
    titleEs: 'Onboarding de clientes - NoDrftSystems',
    descEn: 'Client onboarding requires an active written engagement and a secure workflow. This page does not accept onboarding data.',
    descEs: 'El onboarding de clientes requiere un engagement escrito activo y un flujo seguro. Esta pagina no acepta datos de onboarding.',
  },
  privacy: {
    file: 'privacy',
    titleEn: 'Privacy Policy - NoDrftSystems',
    titleEs: 'Politica de privacidad - NoDrftSystems',
    descEn: 'NoDrftSystems privacy policy and data practices.',
    descEs: 'Politica de privacidad y practicas de datos de NoDrftSystems.',
  },
  terms: {
    file: 'terms',
    titleEn: 'Terms of Service - NoDrftSystems',
    titleEs: 'Terminos del servicio - NoDrftSystems',
    descEn: 'Terms governing use of the NoDrftSystems website and public engagement routes.',
    descEs: 'Terminos que rigen el uso del sitio de NoDrftSystems y sus rutas publicas de engagement.',
  },
};

const SITE_NAME = 'NoDrftSystems';
const SITE_DESCRIPTION = {
  en: 'Structured website packages and digital builds for teams that need clearer positioning, stronger buyer journeys, and disciplined delivery.',
  es: 'Paquetes web y proyectos digitales para equipos que necesitan mejor posicionamiento, recorridos de comprador mas claros y entrega disciplinada.',
};

function roundMilliseconds(value) {
  return Math.round(value * 10) / 10;
}

function getSiteRootUrl(runtimeUrl) {
  try {
    const url = new URL(runtimeUrl);
    url.hash = '';
    url.search = '';
    return url.toString();
  } catch (error) {
    return runtimeUrl;
  }
}

function getRouteLabel(route, lang) {
  const title = lang === 'es' ? route.titleEs : route.titleEn;
  return title.replace(/\s+-\s+NoDrftSystems$/, '');
}

function getPageSchemaType(routeKey) {
  if (routeKey === 'about') return 'AboutPage';
  if (routeKey === 'start' || routeKey === 'inquiries') return 'ContactPage';
  if (routeKey === 'insights') return 'CollectionPage';
  if (routeKey === 'capabilities') return 'Service';
  return 'WebPage';
}

function updateJsonLdScript(id, value) {
  const script = document.getElementById(id);
  if (!script) return;

  script.textContent = value ? JSON.stringify(value, null, 2) : '';
}

function updateStructuredData(routeKey, route, runtimeUrl, lang) {
  const siteRootUrl = getSiteRootUrl(runtimeUrl);
  const pageLabel = getRouteLabel(route, lang);
  const organizationId = `${siteRootUrl}#organization`;
  const websiteId = `${siteRootUrl}#website`;

  updateJsonLdScript('org-schema', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE_NAME,
    url: siteRootUrl,
    description: SITE_DESCRIPTION[lang] || SITE_DESCRIPTION.en,
  });

  updateJsonLdScript('website-schema', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: SITE_NAME,
    url: siteRootUrl,
    description: SITE_DESCRIPTION[lang] || SITE_DESCRIPTION.en,
    inLanguage: lang,
    publisher: { '@id': organizationId },
  });

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': getPageSchemaType(routeKey),
    '@id': runtimeUrl,
    name: pageLabel,
    url: runtimeUrl,
    description: lang === 'es' ? route.descEs : route.descEn,
    inLanguage: lang,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
  };

  if (pageSchema['@type'] === 'Service') {
    pageSchema.provider = { '@id': organizationId };
    pageSchema.serviceType = lang === 'es'
      ? 'Paquetes web y proyectos digitales'
      : 'Website packages and digital-build engagements';
  }

  updateJsonLdScript('page-schema', pageSchema);

  if (!routeKey) {
    updateJsonLdScript('breadcrumb-schema', null);
    return;
  }

  updateJsonLdScript('breadcrumb-schema', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'es' ? 'Inicio' : 'Home',
        item: siteRootUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageLabel,
        item: runtimeUrl,
      },
    ],
  });
}

function focusPrimaryHeading(app) {
  const heading = app.querySelector('h1');
  if (!heading) return;

  focusElement(heading);
}

function focusElement(element) {
  if (!element) return;

  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }

  requestAnimationFrame(() => {
    element.focus({ preventScroll: true });
  });
}

function focusSectionTarget(app, sectionId) {
  if (!sectionId) return false;

  const target = app.querySelector(`#${CSS.escape(sectionId)}`);
  if (!target) return false;

  requestAnimationFrame(() => {
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    focusElement(target.querySelector('h1, h2, h3, h4') || target);
  });

  return true;
}

function getLoadErrorMarkup({ isLocalFile, lang }) {
  if (isLocalFile) {
    return `
      <div class="container section">
        <article class="card" style="display: grid; gap: var(--space-4);">
          <p class="section-eyebrow">${lang === 'es' ? 'Vista local' : 'Local preview'}</p>
          <h1 class="section-title">${lang === 'es' ? 'Abra este sitio con un servidor local.' : 'Open this site through a local server.'}</h1>
          <p class="section-desc">${lang === 'es' ? 'Esta aplicacion carga el contenido de cada pagina de forma dinamica. Cuando se abre como file://, el navegador bloquea esa carga y la vista queda vacia.' : 'This app loads each page dynamically. When it is opened as file://, the browser blocks that loading and the page appears empty.'}</p>
          <p class="text-muted">${lang === 'es' ? 'Desde la raiz del proyecto, inicie un servidor HTTP local y luego abra http://localhost:8000/.' : 'From the project root, start a local HTTP server and then open http://localhost:8000/.'}</p>
        </article>
      </div>
    `;
  }

  return `
    <div class="container section">
      <article class="card" style="display: grid; gap: var(--space-4);">
        <p class="section-eyebrow">${lang === 'es' ? 'Error de carga' : 'Load error'}</p>
        <h1 class="section-title">${lang === 'es' ? 'No se pudo cargar esta pagina.' : 'This page could not be loaded.'}</h1>
        <p class="section-desc">${lang === 'es' ? 'Verifique que el servidor local este ejecutandose desde la raiz del proyecto y vuelva a intentarlo.' : 'Check that the local server is running from the project root and then try again.'}</p>
      </article>
    </div>
  `;
}

function getPageUrl(fileName) {
  return new URL(`../../pages/${fileName}.html`, import.meta.url);
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [pathPart, queryString = ''] = hash.split('?');
  const params = new URLSearchParams(queryString);
  const legacySectionMatch = /^(pkg-|threshold-bridge|support-)/;
  const sectionId = params.get('section');

  if (pathPart.startsWith('es/')) {
    let routeKey = pathPart.slice(3) || '';
    if (!ROUTES[routeKey] && legacySectionMatch.test(routeKey)) {
      return { routeKey: 'capabilities', lang: 'es', sectionId: routeKey };
    }
    return { routeKey, lang: 'es', sectionId };
  }

  if (!ROUTES[pathPart] && legacySectionMatch.test(pathPart)) {
    return { routeKey: 'capabilities', lang: 'en', sectionId: pathPart };
  }

  return { routeKey: pathPart || '', lang: 'en', sectionId };
}

function getRoute() {
  return parseRoute().routeKey;
}

function getRouteLang() {
  return parseRoute().lang;
}

async function loadPage(routeKey, { sectionId = null } = {}) {
  const route = ROUTES[routeKey] || ROUTES[''];
  const lang = getRouteLang();
  if (window.i18n?.setLang) {
    window.i18n.setLang(lang);
  } else {
    document.documentElement.lang = lang;
  }
  const runtimeUrl = buildAbsoluteRuntimeUrl();
  const routeStart = performance.now();

  document.title = lang === 'es' ? route.titleEs : route.titleEn;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', lang === 'es' ? route.descEs : route.descEn);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', lang === 'es' ? route.titleEs : route.titleEn);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', lang === 'es' ? route.descEs : route.descEn);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', runtimeUrl);

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', lang === 'es' ? route.titleEs : route.titleEn);

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', lang === 'es' ? route.descEs : route.descEn);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', runtimeUrl);

  const xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
  if (xDefault) xDefault.setAttribute('href', runtimeUrl);

  const hrefLangEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
  if (hrefLangEn) {
    const enUrl = new URL(window.location.pathname, window.location.origin).toString();
    hrefLangEn.setAttribute('href', enUrl);
  }

  const hrefLangEs = document.querySelector('link[rel="alternate"][hreflang="es"]');
  if (hrefLangEs) {
    const esUrl = new URL(`${window.location.pathname}#/es/`, window.location.origin).toString();
    hrefLangEs.setAttribute('href', esUrl);
  }

  updateStructuredData(routeKey, route, runtimeUrl, lang);

  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const linkRoute = link.getAttribute('data-nav-link');
    const isActive = linkRoute === routeKey || (routeKey === '' && linkRoute === 'home');
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
      return;
    }
    link.removeAttribute('aria-current');
  });

  const app = document.getElementById('app');
  try {
    const fragmentStart = performance.now();
    const res = await fetch(getPageUrl(route.file));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const fragmentResponse = performance.now();
    const html = await res.text();

    app.style.animation = 'none';
    app.offsetHeight;
    app.style.animation = '';

    app.innerHTML = html;

    if (window.i18n) window.i18n.apply();
    if (window.wireforms) window.wireforms();
    if (window.initMotion) window.initMotion();

    if (!focusSectionTarget(app, sectionId)) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      focusPrimaryHeading(app);
    }

    const mobileNav = document.getElementById('mobile-nav');
    const navToggle = document.getElementById('nav-toggle');
    if (mobileNav && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.ndrfUI?.syncLanguage?.();
    }

    trackMetric('route_loaded', {
      route: route.file,
      lang,
      fragmentFetchMs: roundMilliseconds(fragmentResponse - fragmentStart),
      totalRouteMs: roundMilliseconds(performance.now() - routeStart),
      fragmentBytes: new TextEncoder().encode(html).length,
    });
  } catch (err) {
    const isLocalFile = window.location.protocol === 'file:';
    app.innerHTML = getLoadErrorMarkup({ isLocalFile, lang });
    trackMetric('route_load_failed', {
      route: route.file,
      lang,
      message: err instanceof Error ? err.message : 'Unknown route load error',
    });
    console.error('Router error:', err);
  }

}

function init() {
  window.addEventListener('hashchange', () => {
    const { routeKey, lang, sectionId } = parseRoute();
    if (window.i18n?.setLang) {
      window.i18n.setLang(lang);
    } else {
      document.documentElement.lang = lang;
    }
    loadPage(routeKey, { sectionId });
  });

  const { routeKey, lang, sectionId } = parseRoute();
  if (window.i18n?.setLang) {
    window.i18n.setLang(lang);
  } else {
    document.documentElement.lang = lang;
  }
  loadPage(routeKey, { sectionId });
}

export { init, loadPage, getRoute, ROUTES };
