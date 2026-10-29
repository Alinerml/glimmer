import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { Glimmer } from '../types';
import { dayKey } from '../lib/date';
import {
  CloseIcon,
  DownloadIcon,
  InstallIcon,
  LockIcon,
  TrashIcon,
  UploadIcon,
} from './Icons';

interface SettingsSheetProps {
  entries: Glimmer[];
  canInstall: boolean;
  calmMotion: boolean;
  onClose: () => void;
  onImportJSON: (raw: unknown) => number;
  onClear: () => void;
  onInstall: () => void;
  onToggleMotion: (value: boolean) => void;
  onToast: (message: string) => void;
}

export function SettingsSheet({
  entries,
  canInstall,
  calmMotion,
  onClose,
  onImportJSON,
  onClear,
  onInstall,
  onToggleMotion,
  onToast,
}: SettingsSheetProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!confirmClear) return;
    const timer = window.setTimeout(() => setConfirmClear(false), 3200);
    return () => window.clearTimeout(timer);
  }, [confirmClear]);

  const exportJSON = () => {
    const payload = {
      app: 'glimmer',
      version: 1,
      exportedAt: new Date().toISOString(),
      entries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `glimmer-${dayKey(Date.now())}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast('已导出 JSON 备份');
  };

  const importJSON = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 4_000_000) throw new Error('备份文件太大了');
      const text = await file.text();
      const data: unknown = JSON.parse(text);
      const added = onImportJSON(data);
      onToast(added > 0 ? `导入了 ${added} 束微光` : '没有新的微光');
    } catch (error) {
      onToast(error instanceof Error ? error.message : '导入失败，请检查文件格式');
    }
  };

  return (
    <div
      className="overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="sheet sheet--tall settings-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <button type="button" className="sheet-close" onClick={onClose} aria-label="关闭" autoFocus>
          <CloseIcon size={17} />
        </button>

        <header className="sheet-head">
          <p className="eyebrow">设置 · SETTINGS</p>
          <h2 id="settings-title">让微光，更像你的。</h2>
          <p className="sheet-lead">所有微光都保存在你自己的设备上。没有账号，没有追踪，也没有算法。</p>
        </header>

        <div className="sheet-section">
          <div className="section-title">
            <span>01</span>
            <div>
              <h3>数据</h3>
              <p>随时带走，随时回来。JSON 备份包含完整的时间与心情。</p>
            </div>
          </div>
          <div className="setting-actions">
            <button type="button" className="btn btn-soft" onClick={exportJSON} disabled={entries.length === 0}>
              <DownloadIcon size={14} />
              导出 JSON
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <UploadIcon size={14} />
              导入 JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={importJSON}
              hidden
            />
            <button
              type="button"
              className={`btn clear-btn${confirmClear ? ' is-confirming' : ''}`}
              disabled={entries.length === 0}
              onClick={() => {
                if (confirmClear) {
                  onClear();
                  setConfirmClear(false);
                  onToast('星空已清空');
                } else {
                  setConfirmClear(true);
                }
              }}
            >
              <TrashIcon size={14} />
              {confirmClear ? '再点一次，确认清空' : '清空星空'}
            </button>
          </div>
          <p className="field-note">当前 {entries.length} 束微光 · 建议在换设备前导出一份备份。</p>
        </div>

        <div className="sheet-divider" />

        <div className="sheet-section">
          <div className="section-title">
            <span>02</span>
            <div>
              <h3>体验</h3>
              <p>在安静的地方，让动画也安静一点。</p>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <h4>减少动态效果</h4>
              <p>关闭星光闪烁、极光漂移和流星动画。</p>
            </div>
            <button
              type="button"
              className={`switch${calmMotion ? ' is-on' : ''}`}
              role="switch"
              aria-checked={calmMotion}
              aria-label="减少动态效果"
              onClick={() => onToggleMotion(!calmMotion)}
            >
              <span />
            </button>
          </div>
        </div>

        <div className="sheet-divider" />

        <div className="sheet-section">
          <div className="section-title">
            <span>03</span>
            <div>
              <h3>安装</h3>
              <p>同一套微光，在网页、桌面和手机上继续。</p>
            </div>
          </div>
          {canInstall ? (
            <button type="button" className="btn btn-primary install-btn" onClick={onInstall}>
              <InstallIcon size={15} />
              安装到当前设备
            </button>
          ) : (
            <p className="field-note">
              在浏览器菜单中选择「安装应用 / 添加到主屏幕」，即可像原生 App 一样打开微光。
            </p>
          )}
          <div className="platform-row" aria-label="支持的平台">
            <span>Web / PWA</span>
            <span>Windows</span>
            <span>macOS</span>
            <span>Android</span>
            <span>iOS</span>
          </div>
        </div>

        <div className="about-block">
          <div className="about-mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <strong>微光 Glimmer</strong>
            <p>v{__APP_VERSION__} · 把日子，过成星河。</p>
          </div>
          <span className="about-badge">
            <LockIcon size={12} />
            本地优先
          </span>
        </div>
      </section>
    </div>
  );
}
