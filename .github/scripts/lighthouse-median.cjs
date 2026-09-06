const fs = require('fs');
const { spawnSync } = require('child_process');

const [name, url] = process.argv.slice(2);
if (!name || !url) {
  console.error('Usage: node lighthouse-median.cjs <name> <url>');
  process.exit(2);
}

const runs = 3;
const results = [];

const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

for (let i = 1; i <= runs; i += 1) {
  const output = `lighthouse-${name}-${i}.json`;
  const proc = spawnSync('npx', [
    'lighthouse', url,
    '--quiet',
    '--chrome-flags=--headless --no-sandbox',
    '--output=json',
    `--output-path=${output}`
  ], { stdio: 'inherit', shell: false });

  if (proc.status !== 0) {
    console.error(`Lighthouse ${name} run ${i} failed to execute.`);
    process.exit(proc.status || 2);
  }

  const report = JSON.parse(fs.readFileSync(output, 'utf8'));
  const categories = report.categories;
  const row = {
    run: i,
    performance: categories.performance.score,
    accessibility: categories.accessibility.score,
    bestPractices: categories['best-practices'].score,
    seo: categories.seo.score,
    lcpMs: report.audits['largest-contentful-paint']?.numericValue ?? null,
    cls: report.audits['cumulative-layout-shift']?.numericValue ?? null,
    tbtMs: report.audits['total-blocking-time']?.numericValue ?? null
  };
  results.push(row);
  console.log(`${name} run ${i}`, row);
}

const summary = {
  generatedAt: new Date().toISOString(),
  url,
  runs: results,
  gate: {
    medianPerformance: median(results.map(r => r.performance)),
    minimumPerformance: Math.min(...results.map(r => r.performance)),
    minimumAccessibility: Math.min(...results.map(r => r.accessibility)),
    minimumBestPractices: Math.min(...results.map(r => r.bestPractices)),
    medianSeo: median(results.map(r => r.seo))
  },
  thresholds: {
    medianPerformance: 0.80,
    severeRunFloor: 0.65,
    minimumAccessibility: 0.90,
    minimumBestPractices: 0.90
  }
};

fs.writeFileSync(`lighthouse-${name}-summary.json`, JSON.stringify(summary, null, 2));
console.log(`${name} summary`, summary.gate);

if (summary.gate.medianPerformance < summary.thresholds.medianPerformance) {
  throw new Error(`${name}: median performance < ${summary.thresholds.medianPerformance}`);
}
if (summary.gate.minimumPerformance < summary.thresholds.severeRunFloor) {
  throw new Error(`${name}: a performance run < ${summary.thresholds.severeRunFloor}`);
}
if (summary.gate.minimumAccessibility < summary.thresholds.minimumAccessibility) {
  throw new Error(`${name}: accessibility < ${summary.thresholds.minimumAccessibility}`);
}
if (summary.gate.minimumBestPractices < summary.thresholds.minimumBestPractices) {
  throw new Error(`${name}: best-practices < ${summary.thresholds.minimumBestPractices}`);
}
