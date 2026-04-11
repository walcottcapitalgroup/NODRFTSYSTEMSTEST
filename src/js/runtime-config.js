/**
 * runtime-config.js
 *
 * Reads deploy-time configuration declared in the shell.
 */

function getMetaContent(name) {
  if (!name) return '';

  const value = document.querySelector(`meta[name="${name}"]`)?.getAttribute('content');
  return typeof value === 'string' ? value.trim() : '';
}

function getConfiguredSiteOrigin() {
  const origin = getMetaContent('ndrf-site-origin');
  if (!origin) return '';

  try {
    return new URL(origin).toString().replace(/\/$/, '');
  } catch (error) {
    console.error(`Invalid ndrf-site-origin meta value: ${origin}`, error);
    return '';
  }
}

function buildAbsoluteRuntimeUrl() {
  const configuredOrigin = getConfiguredSiteOrigin();
  if (!configuredOrigin) return window.location.href;

  try {
    return new URL(
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
      `${configuredOrigin}/`,
    ).toString();
  } catch (error) {
    console.error('Failed to compose runtime URL from ndrf-site-origin.', error);
    return window.location.href;
  }
}

function resolveFormEndpoint(form) {
  const metaName = form.dataset.endpointMeta || '';
  if (metaName) return getMetaContent(metaName);

  return (form.dataset.endpoint || '').trim();
}

export { buildAbsoluteRuntimeUrl, getConfiguredSiteOrigin, getMetaContent, resolveFormEndpoint };