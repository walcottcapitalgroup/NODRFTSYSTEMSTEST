/**
 * main.js - Entry point
 *
 * Initializes i18n, router, mobile nav, form handlers, and the
 * shareable engagement draft flow.
 */

import { init as initI18n } from './i18n.js';
import { init as initRouter } from './router.js';
import { buildAbsoluteRuntimeUrl, resolveFormEndpoint } from './runtime-config.js';
import { init as initTelemetry, trackMetric } from './telemetry.js';

function syncNavToggleLabel(toggle, isOpen) {
  const lang = document.documentElement.lang || 'en';
  const state = isOpen ? 'open' : 'close';
  const label = toggle.getAttribute(`data-aria-label-${state}-${lang}`)
    || toggle.getAttribute(`data-aria-label-${state}-en`);
  if (label) toggle.setAttribute('aria-label', label);
}

function getFocusableElements(container) {
  if (!container) return [];

  return Array.from(container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter(element => !element.hidden && !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
}

function setMobileNavState(toggle, mobileNav, isOpen, { restoreFocus = false } = {}) {
  mobileNav.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
  syncNavToggleLabel(toggle, isOpen);

  if (isOpen) {
    const [firstFocusable] = getFocusableElements(mobileNav);
    firstFocusable?.focus();
    return;
  }

  if (restoreFocus) toggle.focus();
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMobileNavState(toggle, mobileNav, !isOpen, { restoreFocus: isOpen });
  });

  syncNavToggleLabel(toggle, false);

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMobileNavState(toggle, mobileNav, false);
    });
  });

  document.addEventListener('keydown', event => {
    if (!mobileNav.classList.contains('open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMobileNavState(toggle, mobileNav, false, { restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [toggle, ...getFocusableElements(mobileNav)];
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function isLocalPreview() {
  const host = window.location.hostname;
  return window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
}

function showFormSuccess(form, { preview = false } = {}) {
  const lang = document.documentElement.lang || 'en';
  const successEl = form.closest('[data-form-wrap]')?.querySelector('.form__success')
    || form.parentElement?.querySelector('.form__success');
  if (!successEl) return;

  const body = successEl.querySelector('.form__success-body');
  const existingNote = successEl.querySelector('.form__success-note');
  if (existingNote) existingNote.remove();

  if (body) {
    if (!body.dataset.liveEn) {
      body.dataset.liveEn = body.getAttribute('data-en') || body.innerHTML;
      body.dataset.liveEs = body.getAttribute('data-es') || body.innerHTML;
    }

    if (preview) {
      body.textContent = lang === 'es'
        ? 'Vista previa completada. Configure un endpoint seguro para enviar esta información fuera de este entorno local.'
        : 'Preview completed. Configure a secure submission endpoint to deliver this information outside this local environment.';

      const note = document.createElement('p');
      note.className = 'form__hint form__success-note';
      note.textContent = lang === 'es'
        ? 'No se transmitieron datos desde esta vista previa local.'
        : 'No data was transmitted from this local preview.';
      successEl.appendChild(note);
    } else {
      body.innerHTML = lang === 'es' ? body.dataset.liveEs : body.dataset.liveEn;
    }
  }

  form.style.display = 'none';
  successEl.classList.add('visible');
}

const SHARE_QUERY_KEY = 'ndrf_start_share';
const SHAREABLE_DRAFT_FIELDS = [
  'offer',
  'systemContext',
  'investmentRange',
  'securityContext',
  'timeline',
  'stakeholders',
  'challenge',
  'objective',
];

const SHARE_STATUS_MESSAGES = {
  en: {
    idle: 'Create a review link after you fill the scope fields. Contact details stay blank for the final submitter.',
    copied: 'Review link copied. Send it to your decision team.',
    shared: 'Review link ready. Choose where to send it.',
    opened: 'A shared draft filled the scope fields below. Add contact details before submitting.',
    empty: 'Fill at least one scope field before creating a review link.',
    tooLong: 'This draft is too long for a share link. Shorten the operating problem summary and try again.',
    unavailable: 'This browser could not create a share link.',
    shareSheetText: 'Review this NoDrftSystems engagement brief before it is submitted.',
  },
  es: {
    idle: 'Cree un enlace de revisión después de completar los campos de alcance. Los datos de contacto quedan vacíos para quien envíe la solicitud final.',
    copied: 'Enlace de revisión copiado. Envíelo a su equipo de decisión.',
    shared: 'Enlace de revisión listo. Elija dónde enviarlo.',
    opened: 'Un borrador compartido completó los campos de alcance. Agregue los datos de contacto antes de enviar.',
    empty: 'Complete al menos un campo de alcance antes de crear un enlace de revisión.',
    tooLong: 'Este borrador es demasiado largo para un enlace compartido. Resuma el problema operativo y vuelva a intentarlo.',
    unavailable: 'Este navegador no pudo crear un enlace compartido.',
    shareSheetText: 'Revise este brief de proyecto de NoDrftSystems antes de enviarlo.',
  },
};

const FORM_PROGRESS_MESSAGES = {
  en: {
    ready: 'Required fields complete. Review the brief once more and submit when one owner is ready.',
    pending: 'Complete the required fields for fit, scope, and risk before you submit.',
    count(done, total) {
      return `${done} of ${total} required fields ready`;
    },
  },
  es: {
    ready: 'Los campos obligatorios están completos. Revise el resumen una vez más y envíe cuando una persona responsable esté lista.',
    pending: 'Complete los campos obligatorios de ajuste, alcance y riesgo antes de enviar.',
    count(done, total) {
      return `${done} de ${total} campos obligatorios listos`;
    },
  },
};

const FORM_MODE_MESSAGES = {
  engagement: {
    live: {
      eyebrowEn: 'Live intake',
      eyebrowEs: 'Recepción activa',
      titleEn: 'Engagement intake is active on this environment.',
      titleEs: 'La admisión del proyecto está activa en este entorno.',
      bodyEn: 'Submit only when one owner is ready to send the project brief through the configured live endpoint.',
      bodyEs: 'Envíe solo cuando una persona responsable esté lista para enviar el brief del proyecto a través del endpoint activo configurado.',
      buttonEn: 'Submit Engagement Brief',
      buttonEs: 'Enviar brief del proyecto',
    },
    preview: {
      eyebrowEn: 'Local preview',
      eyebrowEs: 'Vista local',
      titleEn: 'Engagement preview is active only on this machine.',
      titleEs: 'La vista previa del proyecto está activa solo en esta máquina.',
      bodyEn: 'You can test validation, progress, and success states here, but no data leaves this local environment.',
      bodyEs: 'Aquí puede probar validación, progreso y estados de éxito, pero ningún dato sale de este entorno local.',
      buttonEn: 'Preview Engagement Brief',
      buttonEs: 'Probar brief del proyecto',
    },
    offline: {
      eyebrowEn: 'Intake offline',
      eyebrowEs: 'Recepción inactiva',
      titleEn: 'Public engagement intake is not accepting submissions here yet.',
      titleEs: 'La admisión pública del proyecto aún no acepta envíos aquí.',
      bodyEn: 'No secure live endpoint is configured for this environment. Review the questions now, but do not expect a submitted brief to be received.',
      bodyEs: 'No hay un endpoint activo y seguro configurado para este entorno. Revise las preguntas ahora, pero no espere que un envío sea recibido.',
      buttonEn: 'Engagement Intake Offline',
      buttonEs: 'Admisión inactiva',
    },
  },
  inquiry: {
    live: {
      eyebrowEn: 'Live route',
      eyebrowEs: 'Ruta activa',
      titleEn: 'General inquiries are active on this environment.',
      titleEs: 'Las consultas generales están activas en este entorno.',
      bodyEn: 'Use this form for press, partnership, and non-buyer requests when the configured route is live.',
      bodyEs: 'Use este formulario para prensa, alianzas y solicitudes no comerciales cuando la ruta configurada esté activa.',
      buttonEn: 'Send Message',
      buttonEs: 'Enviar mensaje',
    },
    preview: {
      eyebrowEn: 'Local preview',
      eyebrowEs: 'Vista local',
      titleEn: 'Inquiry preview is active only on this machine.',
      titleEs: 'La vista previa de consultas está activa solo en esta máquina.',
      bodyEn: 'You can test validation and success states locally, but no inquiry is transmitted from this preview environment.',
      bodyEs: 'Puede probar la validación y los estados de éxito localmente, pero ninguna consulta se transmite desde este entorno de vista previa.',
      buttonEn: 'Preview Message',
      buttonEs: 'Probar mensaje',
    },
    offline: {
      eyebrowEn: 'Route offline',
      eyebrowEs: 'Ruta inactiva',
      titleEn: 'General contact is not accepting submissions here yet.',
      titleEs: 'El contacto general aún no acepta envíos aquí.',
      bodyEn: 'No live inquiry endpoint is configured for this environment. Do not expect a submitted message to reach an inbox or workflow.',
      bodyEs: 'No hay un endpoint activo de consultas configurado para este entorno. No espere que un mensaje enviado llegue a una bandeja o flujo.',
      buttonEn: 'Inquiry Route Offline',
      buttonEs: 'Ruta inactiva',
    },
  },
  careers: {
    live: {
      eyebrowEn: 'Live intake',
      eyebrowEs: 'Recepción activa',
      titleEn: 'Career submissions are active on this environment.',
      titleEs: 'Las postulaciones de carrera están activas en este entorno.',
      bodyEn: 'Use this form to submit interest for active roles, future opportunities, or specialist engagements.',
      bodyEs: 'Use este formulario para postular su interés en roles activos, oportunidades futuras o compromisos de especialista.',
      buttonEn: 'Submit Interest',
      buttonEs: 'Enviar Interés',
    },
    preview: {
      eyebrowEn: 'Local preview',
      eyebrowEs: 'Vista local',
      titleEn: 'Career preview is active only on this machine.',
      titleEs: 'La vista previa de carrera está activa solo en esta máquina.',
      bodyEn: 'You can test validation and success states locally, but no application is transmitted from this preview environment.',
      bodyEs: 'Puede probar la validación y los estados de éxito localmente, pero ninguna postulación se transmite desde este entorno de vista previa.',
      buttonEn: 'Preview Interest',
      buttonEs: 'Probar interés',
    },
    offline: {
      eyebrowEn: 'Intake offline',
      eyebrowEs: 'Recepción inactiva',
      titleEn: 'Career submissions are not accepting applications here yet.',
      titleEs: 'Las postulaciones de carrera aún no aceptan solicitudes aquí.',
      bodyEn: 'No live careers endpoint is configured for this environment. Do not expect a submitted application to reach a hiring workflow.',
      bodyEs: 'No hay un endpoint activo de carreras configurado para este entorno. No espere que una postulación enviada llegue a un flujo de contratación.',
      buttonEn: 'Careers Intake Offline',
      buttonEs: 'Admisión inactiva',
    },
  },
};

const FIT_BLOCKED_BUTTON_LABELS = {
  en: 'Review Website Packages',
  es: 'Revise los paquetes web',
};

const FIT_GUIDANCE_MESSAGES = {
  en: {
    researching: {
      title: 'This intake works best when the request is already concrete.',
      body: 'If you are still comparing options, review the Website Packages page first. Return here when one owner can describe the live need, the scope, and the next-step decision clearly.',
    },
    'general-contact': {
      title: 'This path is reserved for concrete buyer requests.',
      body: 'General contact, recruiting, press, and exploratory conversations belong on the Inquiries route. Use this intake only when the request maps to a real objective, scope, and decision owner.',
    },
  },
  es: {
    researching: {
      title: 'Esta admisión funciona mejor cuando la solicitud ya es concreta.',
      body: 'Si todavía está comparando opciones, revise primero la página de Website Packages. Vuelva aquí cuando una persona responsable pueda describir con claridad la necesidad real, el alcance y la siguiente decisión.',
    },
    'general-contact': {
      title: 'Esta ruta está reservada para solicitudes comerciales concretas.',
      body: 'El contacto general, reclutamiento, prensa y conversaciones exploratorias van por la ruta de Consultas. Use esta admisión solo cuando la solicitud se vincule con un objetivo real, un alcance claro y una persona responsable de decidir.',
    },
  },
};

function getShareLang() {
  return document.documentElement.lang || 'en';
}

function getShareMessage(key) {
  const lang = getShareLang();
  return SHARE_STATUS_MESSAGES[lang]?.[key] || SHARE_STATUS_MESSAGES.en[key] || '';
}

function updateShareStatus(statusEl, key) {
  if (!statusEl) return;
  statusEl.dataset.shareStatusKey = key;
  statusEl.textContent = getShareMessage(key);
}

function syncShareLanguage() {
  document.querySelectorAll('[data-share-status-key]').forEach(statusEl => {
    updateShareStatus(statusEl, statusEl.dataset.shareStatusKey || 'idle');
  });
}

function getFormProgressCopy() {
  const lang = document.documentElement.lang || 'en';
  return FORM_PROGRESS_MESSAGES[lang] || FORM_PROGRESS_MESSAGES.en;
}

function getFitGuidanceCopy(value) {
  const lang = document.documentElement.lang || 'en';
  const messages = FIT_GUIDANCE_MESSAGES[lang] || FIT_GUIDANCE_MESSAGES.en;
  return messages[value] || null;
}

function getFormMode(form) {
  if (resolveFormEndpoint(form)) return 'live';
  return isLocalPreview() ? 'preview' : 'offline';
}

function getFormModeCopy(form) {
  const lang = document.documentElement.lang || 'en';
  const kind = form.dataset.formKind || 'engagement';
  const mode = getFormMode(form);
  const messages = FORM_MODE_MESSAGES[kind]?.[mode] || FORM_MODE_MESSAGES.engagement[mode];

  return {
    kind,
    mode,
    eyebrow: lang === 'es' ? messages.eyebrowEs : messages.eyebrowEn,
    title: lang === 'es' ? messages.titleEs : messages.titleEn,
    body: lang === 'es' ? messages.bodyEs : messages.bodyEn,
    button: lang === 'es' ? messages.buttonEs : messages.buttonEn,
  };
}

function updateFitGuidance(form) {
  const readinessField = form.elements.decisionReadiness;
  const panel = form.querySelector('[data-fit-guidance]');
  const title = panel?.querySelector('[data-fit-guidance-title]');
  const body = panel?.querySelector('[data-fit-guidance-body]');
  const readinessValue = typeof readinessField?.value === 'string' ? readinessField.value.trim() : '';
  const blocked = readinessValue === 'researching' || readinessValue === 'general-contact';
  const copy = getFitGuidanceCopy(readinessValue);

  form.dataset.fitBlocked = blocked ? 'true' : 'false';

  if (!panel) return blocked;

  if (!blocked || !copy) {
    panel.hidden = true;
    if (title) title.textContent = '';
    if (body) body.textContent = '';
    return blocked;
  }

  panel.hidden = false;
  if (title) title.textContent = copy.title;
  if (body) body.textContent = copy.body;
  return blocked;
}

function initFitGuidance(form) {
  if (form.dataset.fitInit) return;

  const readinessField = form.elements.decisionReadiness;
  if (!readinessField) return;

  form.dataset.fitInit = 'true';

  readinessField.addEventListener('change', () => {
    updateFitGuidance(form);
    updateFormAvailability(form);
  });

  updateFitGuidance(form);
}

function syncFitGuidanceLanguage() {
  document.querySelectorAll('.js-form').forEach(form => {
    updateFitGuidance(form);
  });
}

function updateFormAvailability(form) {
  const wrap = form.closest('[data-form-wrap]');
  if (!wrap) return;

  const availability = wrap.querySelector('[data-form-availability]');
  const eyebrow = availability?.querySelector('[data-form-mode-eyebrow]');
  const title = availability?.querySelector('[data-form-mode-title]');
  const body = availability?.querySelector('[data-form-mode-body]');
  const submitBtn = form.querySelector('[type="submit"]');
  const copy = getFormModeCopy(form);
  const fitBlocked = form.dataset.fitBlocked === 'true';

  if (availability) {
    availability.dataset.formMode = copy.mode;
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (body) body.textContent = copy.body;
  }

  if (submitBtn) {
    const lang = document.documentElement.lang || 'en';
    submitBtn.textContent = fitBlocked ? (FIT_BLOCKED_BUTTON_LABELS[lang] || FIT_BLOCKED_BUTTON_LABELS.en) : copy.button;
    submitBtn.disabled = copy.mode === 'offline' || fitBlocked;
    submitBtn.setAttribute('aria-disabled', String(copy.mode === 'offline' || fitBlocked));
  }

  if (form.dataset.formMode !== copy.mode) {
    form.dataset.formMode = copy.mode;
    trackMetric('form_mode_visible', {
      form: copy.kind,
      mode: copy.mode,
    });
  }
}

function initFormAvailability(form) {
  if (form.dataset.availabilityInit) return;
  form.dataset.availabilityInit = 'true';
  updateFormAvailability(form);
}

function syncFormAvailabilityLanguage() {
  document.querySelectorAll('.js-form').forEach(form => {
    updateFormAvailability(form);
  });
}

function getRequiredProgressFields(form) {
  return Array.from(form.querySelectorAll('[required]')).filter(field => field.type !== 'hidden');
}

function fieldCountsAsComplete(field) {
  if (field.type === 'checkbox') return field.checked;

  const value = typeof field.value === 'string' ? field.value.trim() : '';
  if (!value) return false;
  if (field.type === 'email') return field.checkValidity();

  return true;
}

function updateFormProgress(form) {
  const progress = form.closest('[data-form-wrap]')?.querySelector('[data-form-progress]');
  if (!progress) return;

  const requiredFields = getRequiredProgressFields(form);
  const total = requiredFields.length;
  const completed = requiredFields.filter(fieldCountsAsComplete).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const copy = getFormProgressCopy();
  const bar = progress.querySelector('[data-form-progress-bar]');
  const summary = progress.querySelector('[data-form-progress-summary]');
  const note = progress.querySelector('[data-form-progress-note]');

  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', String(total));
  progress.setAttribute('aria-valuenow', String(completed));
  progress.setAttribute('aria-valuetext', copy.count(completed, total));
  progress.classList.toggle('is-complete', total > 0 && completed === total);

  if (bar) bar.style.width = `${percentage}%`;
  if (summary) summary.textContent = copy.count(completed, total);
  if (note) note.textContent = completed === total ? copy.ready : copy.pending;

  if (completed === total && total > 0 && progress.dataset.reportedReady !== 'true') {
    progress.dataset.reportedReady = 'true';
    trackMetric('engagement_form_ready', { requiredFields: total });
  }

  if (completed < total) {
    progress.dataset.reportedReady = 'false';
  }
}

function initFormProgress(form) {
  const progress = form.closest('[data-form-wrap]')?.querySelector('[data-form-progress]');
  if (!progress || form.dataset.progressInit) return;

  form.dataset.progressInit = 'true';

  getRequiredProgressFields(form).forEach(field => {
    const primaryEvent = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';

    field.addEventListener(primaryEvent, () => {
      updateFormProgress(form);
    });

    if (primaryEvent !== 'change') {
      field.addEventListener('change', () => {
        updateFormProgress(form);
      });
    }
  });

  updateFormProgress(form);
}

function syncFormProgressLanguage() {
  document.querySelectorAll('.js-form').forEach(form => {
    updateFormProgress(form);
  });
}

function getFieldValue(field) {
  if (!field) return '';
  if (field instanceof RadioNodeList) return field.value ? field.value.trim() : '';
  if (field.type === 'checkbox') return field.checked ? 'true' : '';
  return typeof field.value === 'string' ? field.value.trim() : '';
}

function generateShareId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `share-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function encodeSharePayload(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeSharePayload(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function buildSharedDraft(form) {
  const fields = {};

  SHAREABLE_DRAFT_FIELDS.forEach(name => {
    const value = getFieldValue(form.elements[name]);
    if (value) fields[name] = value;
  });

  const fieldCount = Object.keys(fields).length;
  if (!fieldCount) return { errorKey: 'empty' };

  return {
    shareId: generateShareId(),
    version: 1,
    fieldCount,
    fields,
  };
}

function createSharedDraftUrl(form) {
  const draft = buildSharedDraft(form);
  if (draft.errorKey) return draft;

  const url = new URL(buildAbsoluteRuntimeUrl());
  url.hash = '#/start';
  url.searchParams.set(SHARE_QUERY_KEY, encodeSharePayload(JSON.stringify(draft)));

  if (url.toString().length > 3200) {
    return { errorKey: 'tooLong' };
  }

  return {
    url: url.toString(),
    shareId: draft.shareId,
    fieldCount: draft.fieldCount,
  };
}

function copyTextFallback(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.setAttribute('readonly', '');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  temp.remove();
}

async function writeSharedDraftUrl(text) {
  if (window.navigator.clipboard?.writeText) {
    await window.navigator.clipboard.writeText(text);
    return;
  }
  copyTextFallback(text);
}

function getSharedDraftPayload() {
  const encoded = new URLSearchParams(window.location.search).get(SHARE_QUERY_KEY);
  if (!encoded) return null;

  try {
    const payload = JSON.parse(decodeSharePayload(encoded));
    if (!payload || typeof payload !== 'object' || !payload.fields) return null;
    return payload;
  } catch (error) {
    console.error('Shared draft decode error:', error);
    return null;
  }
}

function applySharedDraft(form, statusEl) {
  const payload = getSharedDraftPayload();
  if (!payload?.fields) return false;

  SHAREABLE_DRAFT_FIELDS.forEach(name => {
    const field = form.elements[name];
    const value = payload.fields[name];
    if (!field || typeof value !== 'string') return;

    if (field.type === 'checkbox') {
      field.checked = value === 'true';
      return;
    }

    field.value = value;
  });

  const shareIdField = form.querySelector('input[name="sharedDraftId"]');
  if (shareIdField) shareIdField.value = payload.shareId || '';

  const shareSourceField = form.querySelector('input[name="sharedDraftSource"]');
  if (shareSourceField) shareSourceField.value = 'review_link';

  const banner = form.closest('[data-form-wrap]')?.querySelector('[data-shared-draft-banner]');
  if (banner) banner.hidden = false;

  updateShareStatus(statusEl, 'opened');
    trackMetric('engagement_share_opened', {
    shareId: payload.shareId || '',
    fieldCount: Object.keys(payload.fields).length,
  });

  return true;
}

async function handleSharedDraftAction(form, statusEl) {
  const result = createSharedDraftUrl(form);

  if (result.errorKey) {
    updateShareStatus(statusEl, result.errorKey);
    return;
  }

    trackMetric('engagement_share_clicked', {
    shareId: result.shareId,
    fieldCount: result.fieldCount,
  });

  if (window.navigator.share) {
    try {
      await window.navigator.share({
        title: 'NoDrftSystems engagement brief',
        text: getShareMessage('shareSheetText'),
        url: result.url,
      });
      updateShareStatus(statusEl, 'shared');
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }

  try {
    await writeSharedDraftUrl(result.url);
    updateShareStatus(statusEl, 'copied');
  } catch (error) {
    console.error('Shared draft write error:', error);
    updateShareStatus(statusEl, 'unavailable');
  }
}

function initEngagementDraftSharing(form) {
  if (form.dataset.shareInit) return;
  form.dataset.shareInit = 'true';

  const wrap = form.closest('[data-form-wrap]');
  if (!wrap) return;

  const actionBtn = wrap.querySelector('[data-share-draft-button]');
  const statusEl = wrap.querySelector('[data-share-status]');
  if (!actionBtn || !statusEl) return;

  const openedSharedDraft = applySharedDraft(form, statusEl);
  if (!openedSharedDraft) updateShareStatus(statusEl, 'idle');

  actionBtn.addEventListener('click', () => {
    handleSharedDraftAction(form, statusEl);
  });
}

function wireforms() {
  document.querySelectorAll('.js-form').forEach(form => {
    if (form.dataset.wired) return;
    form.dataset.wired = 'true';

    initFitGuidance(form);
    initFormAvailability(form);

    if (form.dataset.shareable === 'engagement') {
      initEngagementDraftSharing(form);
    }

    initFormProgress(form);

    form.addEventListener('submit', async event => {
      event.preventDefault();

      if (getFormMode(form) === 'offline') {
        updateFormAvailability(form);
        return;
      }

      if (form.dataset.fitBlocked === 'true') {
        updateFitGuidance(form);
        updateFormAvailability(form);
        return;
      }

      form.querySelectorAll('.form__error').forEach(el => {
        el.textContent = '';
      });

      let valid = true;
      let firstInvalidField = null;

      form.querySelectorAll('[required]').forEach(field => {
        const lang = document.documentElement.lang || 'en';
        const value = typeof field.value === 'string' ? field.value.trim() : '';
        const missingValue = field.type === 'checkbox' ? !field.checked : value === '';
        const invalidEmail = field.type === 'email' && !missingValue && !field.checkValidity();

        if (!missingValue && !invalidEmail) return;

        valid = false;
        if (!firstInvalidField) firstInvalidField = field;

        const group = field.closest('.form__group');
        if (!group) return;

        const err = group.querySelector('.form__error');
        if (!err) return;

        if (invalidEmail) {
          err.textContent = (lang === 'es' && field.getAttribute('data-error-invalid-es'))
            ? field.getAttribute('data-error-invalid-es')
            : (field.getAttribute('data-error-invalid')
              || field.getAttribute('data-error')
              || 'Please enter a valid email address.');
          return;
        }

        err.textContent = (lang === 'es' && field.getAttribute('data-error-es'))
          ? field.getAttribute('data-error-es')
          : (field.getAttribute('data-error') || 'This field is required.');
      });

      if (!valid) {
        updateFormProgress(form);
        firstInvalidField?.focus();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const submissionErr = form.querySelector('.form__error--submission');
      if (submissionErr) submissionErr.remove();

      const formData = new FormData(form);
      const endpoint = resolveFormEndpoint(form);

      try {
        if (!endpoint && isLocalPreview()) {
          showFormSuccess(form, { preview: true });
          form.reset();
          return;
        }

        if (!endpoint) throw new Error('No submission endpoint configured.');
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}.`);

        showFormSuccess(form);
        form.reset();
      } catch (error) {
        const lang = document.documentElement.lang || 'en';
        const msg = lang === 'es'
          ? 'No se pudo enviar el formulario. Intentelo de nuevo o contactenos directamente.'
          : 'Submission failed. Please try again or contact us directly.';
        const errEl = document.createElement('p');
        errEl.className = 'form__error form__error--submission';
        errEl.setAttribute('role', 'alert');
        errEl.textContent = msg;
        form.appendChild(errEl);
        console.error('Form submission error:', error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

window.wireforms = wireforms;

/**
 * initScrollReveal — group-aware IntersectionObserver for .fade-up elements.
 *
 * Strategy:
 *  - Elements with sibling stagger classes (fade-d1…fade-d5) belong to a
 *    stagger group. Their shared parent container is observed; when the
 *    container enters the viewport, .is-visible is added to all children
 *    simultaneously so the CSS animation-delay values produce a coordinated
 *    stagger effect.
 *  - Standalone .fade-up elements (no stagger siblings) are observed directly.
 *  - Respects prefers-reduced-motion by skipping setup and immediately marking
 *    all elements visible.
 */
function initScrollReveal() {
  const app = document.getElementById('app');
  if (!app) return;

  // Respect OS-level reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    app.querySelectorAll('.fade-up').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const STAGGER_CLASSES = ['fade-d1', 'fade-d2', 'fade-d3', 'fade-d4', 'fade-d5'];

  function hasStaggerClass(el) {
    return STAGGER_CLASSES.some(cls => el.classList.contains(cls));
  }

  // Find containers whose direct children include stagger-classed .fade-up elements
  const groupContainers = new Set();
  const standaloneElements = [];

  app.querySelectorAll('.fade-up').forEach(el => {
    if (hasStaggerClass(el) && el.parentElement) {
      groupContainers.add(el.parentElement);
    } else {
      // May still be part of a group if siblings have stagger classes; check parent
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter(c => c !== el)
        : [];
      const siblingHasStagger = siblings.some(
        s => s.classList.contains('fade-up') && hasStaggerClass(s)
      );
      if (siblingHasStagger && el.parentElement) {
        groupContainers.add(el.parentElement);
      } else {
        standaloneElements.push(el);
      }
    }
  });

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  // Observe stagger group containers
  const containerObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.fade-up').forEach(child => {
        child.classList.add('is-visible');
      });
      obs.unobserve(entry.target);
    });
  }, observerOptions);

  groupContainers.forEach(container => containerObserver.observe(container));

  // Observe standalone elements individually
  const elementObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, observerOptions);

  standaloneElements.forEach(el => elementObserver.observe(el));
}

window.initMotion = initScrollReveal;

window.ndrfUI = {
  syncLanguage() {
    const toggle = document.getElementById('nav-toggle');
    if (toggle) {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      syncNavToggleLabel(toggle, isOpen);
    }
    syncShareLanguage();
    syncFormProgressLanguage();
    syncFitGuidanceLanguage();
    syncFormAvailabilityLanguage();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  initTelemetry();
  initI18n();
  initMobileNav();
  initRouter();
});
