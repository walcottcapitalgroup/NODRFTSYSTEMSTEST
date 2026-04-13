/**
 * telemetry.js
 *
 * Lightweight runtime telemetry for performance and audit sweeps.
 */

function roundMilliseconds(value) {
  return Math.round(value * 10) / 10;
}

function getMetricRating(value, thresholds) {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function trackMetric(eventName, detail = {}) {
  const payload = {
    event: eventName,
    detail,
    path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent('ndrf:metric', { detail: payload }));
  window.ndrfMetrics = window.ndrfMetrics || [];
  window.ndrfMetrics.push(payload);

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...detail });
  }
}

function observePerformanceEntries(type, callback, options = {}) {
  try {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(callback);
    });
    observer.observe({ type, buffered: true, ...options });
    return observer;
  } catch (error) {
    return null;
  }
}

function reportNavigationTiming() {
  const [entry] = performance.getEntriesByType('navigation');
  if (!entry) return;

  trackMetric('navigation_timing', {
    dnsMs: roundMilliseconds(entry.domainLookupEnd - entry.domainLookupStart),
    connectMs: roundMilliseconds(entry.connectEnd - entry.connectStart),
    ttfbMs: roundMilliseconds(entry.responseStart - entry.requestStart),
    domInteractiveMs: roundMilliseconds(entry.domInteractive),
    domContentLoadedMs: roundMilliseconds(entry.domContentLoadedEventEnd),
    loadMs: roundMilliseconds(entry.loadEventEnd),
    transferBytes: entry.transferSize || 0,
    encodedBodyBytes: entry.encodedBodySize || 0,
    decodedBodyBytes: entry.decodedBodySize || 0,
  });
}

function classifyResource(entry) {
  const initiator = entry.initiatorType || 'other';

  try {
    const url = new URL(entry.name, window.location.href);
    const isThirdParty = url.origin !== window.location.origin;

    if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url.pathname)) {
      return { bucket: 'font', isThirdParty };
    }

    if (initiator === 'script') return { bucket: 'script', isThirdParty };
    if (initiator === 'img') return { bucket: 'image', isThirdParty };
    if (initiator === 'fetch' || initiator === 'xmlhttprequest') {
      return { bucket: 'request', isThirdParty };
    }
    if (initiator === 'link' || initiator === 'css') {
      return { bucket: /\.css(\?|$)/i.test(url.pathname) ? 'style' : 'other', isThirdParty };
    }

    return { bucket: 'other', isThirdParty };
  } catch (error) {
    return { bucket: 'other', isThirdParty: false };
  }
}

function reportResourceSummary() {
  const resources = performance.getEntriesByType('resource');
  if (!resources.length) return;

  const summary = {
    requestCount: 0,
    totalBytes: 0,
    thirdPartyCount: 0,
    thirdPartyBytes: 0,
    scriptBytes: 0,
    styleBytes: 0,
    fontBytes: 0,
    imageBytes: 0,
    requestBytes: 0,
  };

  resources.forEach(entry => {
    const size = entry.transferSize || entry.encodedBodySize || entry.decodedBodySize || 0;
    const { bucket, isThirdParty } = classifyResource(entry);

    summary.requestCount += 1;
    summary.totalBytes += size;

    if (isThirdParty) {
      summary.thirdPartyCount += 1;
      summary.thirdPartyBytes += size;
    }

    if (bucket === 'script') summary.scriptBytes += size;
    if (bucket === 'style') summary.styleBytes += size;
    if (bucket === 'font') summary.fontBytes += size;
    if (bucket === 'image') summary.imageBytes += size;
    if (bucket === 'request') summary.requestBytes += size;
  });

  trackMetric('resource_summary', summary);
}

function initCoreWebVitals() {
  let firstContentfulPaint = 0;
  let largestContentfulPaint = 0;
  let cumulativeLayoutShift = 0;
  let interactionToNextPaint = 0;
  let firstInputDelay = 0;
  let reported = false;

  observePerformanceEntries('paint', entry => {
    if (entry.name === 'first-contentful-paint') {
      firstContentfulPaint = entry.startTime;
    }
  });

  observePerformanceEntries('largest-contentful-paint', entry => {
    largestContentfulPaint = entry.startTime;
  });

  observePerformanceEntries('layout-shift', entry => {
    if (!entry.hadRecentInput) {
      cumulativeLayoutShift += entry.value;
    }
  });

  observePerformanceEntries('event', entry => {
    if (entry.interactionId && entry.duration > interactionToNextPaint) {
      interactionToNextPaint = entry.duration;
    }
  }, { durationThreshold: 40 });

  observePerformanceEntries('first-input', entry => {
    firstInputDelay = entry.processingStart - entry.startTime;
  });

  const reportVitals = () => {
    if (reported) return;
    reported = true;

    if (firstContentfulPaint) {
      trackMetric('performance_fcp', {
        value: roundMilliseconds(firstContentfulPaint),
        unit: 'ms',
      });
    }

    if (largestContentfulPaint) {
      trackMetric('web_vital_lcp', {
        value: roundMilliseconds(largestContentfulPaint),
        unit: 'ms',
        rating: getMetricRating(largestContentfulPaint, { good: 2500, needsImprovement: 4000 }),
      });
    }

    trackMetric('web_vital_cls', {
      value: Number(cumulativeLayoutShift.toFixed(3)),
      unit: 'score',
      rating: getMetricRating(cumulativeLayoutShift, { good: 0.1, needsImprovement: 0.25 }),
    });

    if (interactionToNextPaint) {
      trackMetric('web_vital_inp', {
        value: roundMilliseconds(interactionToNextPaint),
        unit: 'ms',
        rating: getMetricRating(interactionToNextPaint, { good: 200, needsImprovement: 500 }),
      });
      return;
    }

    if (firstInputDelay) {
      trackMetric('web_vital_fid_fallback', {
        value: roundMilliseconds(firstInputDelay),
        unit: 'ms',
      });
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') reportVitals();
  });

  window.addEventListener('pagehide', reportVitals, { once: true });
}

function initAuditConsole() {
  window.ndrfAudit = {
    getMetrics() {
      return Array.isArray(window.ndrfMetrics) ? [...window.ndrfMetrics] : [];
    },
    printMetrics() {
      const metrics = Array.isArray(window.ndrfMetrics) ? window.ndrfMetrics : [];
      console.table(metrics.map(metric => ({
        event: metric.event,
        path: metric.path,
        timestamp: metric.timestamp,
        detail: JSON.stringify(metric.detail),
      })));
    },
  };
}

function init() {
  initAuditConsole();
  initCoreWebVitals();

  const reportLoadedMetrics = () => {
    reportNavigationTiming();
    reportResourceSummary();
  };

  if (document.readyState === 'complete') {
    reportLoadedMetrics();
    return;
  }

  window.addEventListener('load', reportLoadedMetrics, { once: true });
}

export { init, trackMetric };