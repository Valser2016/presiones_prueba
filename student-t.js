/*
 * Funciones de distribución t de Student para uso sin conexión.
 * Implementación local compatible con jStat.studentt.cdf() e .inv().
 */
(function (global) {
  'use strict';

  function logGamma(z) {
    const p = [
      676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012,
      9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
    z -= 1;
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
    const t = z + p.length - 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }

  function betaFraction(a, b, x) {
    const maxIterations = 300;
    const epsilon = 3e-14;
    const tiny = 1e-300;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < tiny) d = tiny;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= maxIterations; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny;
      c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny;
      c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny;
      d = 1 / d;
      const delta = d * c;
      h *= delta;
      if (Math.abs(delta - 1) < epsilon) break;
    }
    return h;
  }

  function regularizedBeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x));
    if (x < (a + 1) / (a + b + 2)) return bt * betaFraction(a, b, x) / a;
    return 1 - bt * betaFraction(b, a, 1 - x) / b;
  }

  function cdf(t, degreesFreedom) {
    const df = Number(degreesFreedom);
    if (!(df > 0) || Number.isNaN(t)) return NaN;
    if (t === 0) return 0.5;
    if (t === Infinity) return 1;
    if (t === -Infinity) return 0;
    const x = df / (df + t * t);
    const ib = regularizedBeta(x, df / 2, 0.5);
    return t > 0 ? 1 - 0.5 * ib : 0.5 * ib;
  }

  function inv(probability, degreesFreedom) {
    const p = Number(probability), df = Number(degreesFreedom);
    if (!(p > 0 && p < 1) || !(df > 0)) return NaN;
    if (p === 0.5) return 0;
    if (p < 0.5) return -inv(1 - p, df);
    let low = 0, high = 1;
    while (cdf(high, df) < p && high < 1e12) high *= 2;
    for (let i = 0; i < 160; i++) {
      const mid = (low + high) / 2;
      if (cdf(mid, df) < p) low = mid; else high = mid;
    }
    return (low + high) / 2;
  }

  global.jStat = global.jStat || {};
  global.jStat.studentt = { cdf, inv };
})(typeof window !== 'undefined' ? window : self);
