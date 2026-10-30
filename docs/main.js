const REPO = 'Alinerml/glimmer';

/* ---------- 星空尘埃 ---------- */

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function buildDust() {
  const host = document.getElementById('sky-dust');
  if (!host) return;

  const random = seededRandom(20261029);
  const count = window.innerWidth < 720 ? 46 : 82;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const star = document.createElement('i');
    star.style.setProperty('--x', `${(random() * 100).toFixed(2)}%`);
    star.style.setProperty('--y', `${(random() * 100).toFixed(2)}%`);
    star.style.setProperty('--s', `${random() > 0.86 ? 2.4 : 1.2}px`);
    star.style.setProperty('--d', `${(6 + random() * 10).toFixed(1)}s`);
    star.style.setProperty('--delay', `${(-random() * 16).toFixed(1)}s`);
    fragment.appendChild(star);
  }

  host.appendChild(fragment);
}

/* ---------- 滚动入场 ---------- */

function setupReveal() {
  const elements = Array.from(document.querySelectorAll('[data-reveal]'));
  if (elements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
  );

  elements.forEach((element) => observer.observe(element));
}

/* ---------- 顶栏状态 ---------- */

function setupHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 14);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------- 下载链接 ---------- */

function formatBytes(bytes) {
  if (!bytes || typeof bytes !== 'number') return '';
  const mb = bytes / (1024 * 1024);
  return `${mb >= 100 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

async function loadRelease() {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) return;

    const release = await response.json();
    const version = document.getElementById('release-version');
    if (version && release.tag_name) {
      version.textContent = release.tag_name;
    }

    const date = document.getElementById('release-date');
    if (date) {
      const formatted = formatDate(release.published_at);
      if (formatted) date.textContent = formatted;
    }

    const assets = Array.isArray(release.assets) ? release.assets : [];
    for (const link of document.querySelectorAll('[data-asset]')) {
      const suffix = link.dataset.asset;
      if (!suffix) continue;

      const asset = assets.find((item) => typeof item.name === 'string' && item.name.endsWith(suffix));
      if (!asset) continue;

      link.href = asset.browser_download_url;

      const size = document.querySelector(`[data-size-for="${suffix}"]`);
      const label = formatBytes(asset.size);
      if (size && label) size.textContent = label;
    }
  } catch {
    // 网络或 API 不可用时保留指向「最新版本」页面的链接。
  }
}

/* ---------- 页脚年份 ---------- */

function setupYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
}

buildDust();
setupReveal();
setupHeader();
setupYear();
void loadRelease();
