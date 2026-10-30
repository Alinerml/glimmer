import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Composer } from './components/Composer';
import { DetailSheet } from './components/DetailSheet';
import { EchoIcon, MoreIcon, StarMark, SyncIcon } from './components/Icons';
import { Onboarding } from './components/Onboarding';
import { SettingsSheet } from './components/SettingsSheet';
import { Sky } from './components/Sky';
import { SyncSheet } from './components/SyncSheet';
import { Toast } from './components/Toast';
import {
  decodeCode,
  loadCalmMotion,
  loadEntries,
  loadOnboarded,
  makeEntry,
  mergeEntries,
  sanitizeEntries,
  saveCalmMotion,
  saveEntries,
  saveOnboarded,
} from './lib/data';
import { getStreak, getTodayCount } from './lib/date';
import { buildDemoEntries, isDemoRequested } from './lib/demo';
import type { Glimmer, MoodId } from './types';

type SheetKind = 'sync' | 'settings' | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function readHashCode(): string {
  const hash = window.location.hash;
  const marker = hash.indexOf('#s=');
  return marker >= 0 ? hash.slice(marker + 3) : '';
}

export default function App() {
  const demo = isDemoRequested();
  const exitDemoHref = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('demo');
      url.hash = '';
      return `${url.pathname}${url.search}`;
    } catch {
      return './';
    }
  }, []);

  const [entries, setEntries] = useState<Glimmer[]>(() =>
    demo ? buildDemoEntries() : loadEntries(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [incomingCode, setIncomingCode] = useState(() => (demo ? '' : readHashCode()));
  const [showOnboarding, setShowOnboarding] = useState(
    () => !demo && !readHashCode() && !loadOnboarded(),
  );
  const [toast, setToast] = useState<string | null>(null);
  const [latestId, setLatestId] = useState<string | null>(null);
  const [echoPulse, setEchoPulse] = useState(0);
  const [calmMotion, setCalmMotion] = useState(loadCalmMotion);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const toastTimer = useRef<number | undefined>(undefined);
  const latestTimer = useRef<number | undefined>(undefined);
  const echoTimer = useRef<number | undefined>(undefined);

  const stats = useMemo(
    () => ({
      total: entries.length,
      streak: getStreak(entries),
      today: getTodayCount(entries),
    }),
    [entries],
  );

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  const markLatest = useCallback((id: string) => {
    setLatestId(id);
    if (latestTimer.current) window.clearTimeout(latestTimer.current);
    latestTimer.current = window.setTimeout(() => setLatestId(null), 3600);
  }, []);

  useEffect(() => {
    if (demo) return;
    saveEntries(entries);
  }, [demo, entries]);

  useEffect(() => {
    if (demo) return;
    saveCalmMotion(calmMotion);
  }, [calmMotion, demo]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      if (latestTimer.current) window.clearTimeout(latestTimer.current);
      if (echoTimer.current) window.clearTimeout(echoTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!incomingCode) return;
    setSheet('sync');
    setShowOnboarding(false);
    try {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    } catch {
      // file:// 等环境不支持 replaceState 时忽略。
    }
  }, [incomingCode]);

  useEffect(() => {
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallPrompt(null);
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const modalOpen = showOnboarding || Boolean(selectedId) || sheet !== null;

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [modalOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selectedId) {
        setSelectedId(null);
        return;
      }
      if (sheet) {
        setSheet(null);
        setIncomingCode('');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, sheet]);

  const handleAdd = useCallback(
    (text: string, mood: MoodId) => {
      const entry = makeEntry(text, mood);
      setEntries((current) => [...current, entry]);
      markLatest(entry.id);
      notify(demo ? '演示数据不会被保存' : '一束微光，亮起来了');
    },
    [demo, markLatest, notify],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setEntries((current) => current.filter((entry) => entry.id !== id));
      setSelectedId(null);
      notify('它回到了夜空');
    },
    [notify],
  );

  const handleEcho = useCallback(() => {
    if (entries.length === 0) {
      notify('先点亮一束微光，再遇见过去');
      return;
    }
    const pool = entries.length > 1 ? entries.filter((entry) => entry.id !== latestId) : entries;
    const picked = pool[Math.floor(Math.random() * pool.length)] ?? entries[0];
    setEchoPulse((value) => value + 1);
    if (echoTimer.current) window.clearTimeout(echoTimer.current);
    echoTimer.current = window.setTimeout(() => setSelectedId(picked.id), 420);
  }, [entries, latestId, notify]);

  const handleImportCode = useCallback(
    (raw: string) => {
      const incoming = decodeCode(raw);
      const merged = mergeEntries(entries, incoming);
      if (merged.added > 0) {
        setEntries(merged.entries);
        const newest = merged.entries[merged.entries.length - 1];
        if (newest) markLatest(newest.id);
        if (!demo) saveOnboarded();
        setShowOnboarding(false);
      }
      return merged.added;
    },
    [demo, entries, markLatest],
  );

  const handleImportJSON = useCallback(
    (raw: unknown) => {
      const incoming = sanitizeEntries(raw);
      if (incoming.length === 0) throw new Error('没有找到可以导入的微光');
      const merged = mergeEntries(entries, incoming);
      if (merged.added > 0) {
        setEntries(merged.entries);
        if (!demo) saveOnboarded();
        setShowOnboarding(false);
      }
      return merged.added;
    },
    [demo, entries],
  );

  const handleClear = useCallback(() => {
    setEntries([]);
    setSelectedId(null);
    setLatestId(null);
    notify('星空已清空');
  }, [notify]);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) {
      notify('请使用浏览器菜单中的「安装应用」');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === 'accepted') notify('微光已安装到你的设备');
  }, [installPrompt, notify]);

  const finishOnboarding = () => {
    setShowOnboarding(false);
    if (!demo) saveOnboarded();
  };

  const openSync = () => {
    setSelectedId(null);
    setSheet('sync');
  };

  const closeSync = () => {
    setSheet(null);
    setIncomingCode('');
  };

  const openSettings = () => {
    setSelectedId(null);
    setSheet('settings');
  };

  const closeSheet = () => {
    setSheet(null);
    setIncomingCode('');
  };

  const selectedEntry = selectedId ? entries.find((entry) => entry.id === selectedId) ?? null : null;

  return (
    <div className={`app${calmMotion ? ' is-calm' : ''}`}>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="grain" aria-hidden="true" />

      {demo && (
        <aside className="demo-banner" role="note" aria-label="演示模式说明">
          <span className="demo-badge">演示模式</span>
          <span className="demo-banner-note demo-banner-note--long">
            示例数据 · 不会保存或覆盖你的记录
          </span>
          <span className="demo-banner-note demo-banner-note--short">示例数据 · 不会保存</span>
          <a href={exitDemoHref}>进入正常使用 →</a>
        </aside>
      )}

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <StarMark size={24} />
          </div>
          <div className="brand-copy">
            <span className="brand-name">微光</span>
            <span className="brand-tag">把日子，过成星河</span>
          </div>
        </div>

        <div className="top-actions">
          <button type="button" className="pill-btn" onClick={handleEcho} aria-label="遇见过去的一束微光">
            <EchoIcon size={16} />
            <span>遇见过去</span>
          </button>
          <button type="button" className="pill-btn" onClick={openSync} aria-label="同频，在设备之间带走星空">
            <SyncIcon size={16} />
            <span>同频</span>
          </button>
          <button type="button" className="icon-btn" onClick={openSettings} aria-label="设置">
            <MoreIcon size={18} />
          </button>
        </div>
      </header>

      <main className="stage">
        <Sky
          entries={entries}
          selectedId={selectedId}
          latestId={latestId}
          echoPulse={echoPulse}
          onSelect={(id) => {
            setSheet(null);
            setSelectedId(id);
          }}
        />
        <Composer
          total={stats.total}
          streak={stats.streak}
          todayCount={stats.today}
          onAdd={handleAdd}
        />
      </main>

      {showOnboarding && <Onboarding onDone={finishOnboarding} />}

      {selectedEntry && (
        <DetailSheet entry={selectedEntry} onClose={() => setSelectedId(null)} onDelete={handleDelete} />
      )}

      {sheet === 'sync' && (
        <SyncSheet
          entries={entries}
          initialCode={incomingCode}
          onClose={closeSync}
          onImport={handleImportCode}
          onToast={notify}
        />
      )}

      {sheet === 'settings' && (
        <SettingsSheet
          entries={entries}
          canInstall={Boolean(installPrompt)}
          calmMotion={calmMotion}
          onClose={closeSheet}
          onImportJSON={handleImportJSON}
          onClear={handleClear}
          onInstall={handleInstall}
          onToggleMotion={setCalmMotion}
          onToast={notify}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
