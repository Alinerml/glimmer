import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import type { Glimmer } from '../types';
import { buildShareLink, encodeCode } from '../lib/data';
import { copyText } from '../lib/clipboard';
import { CheckIcon, CloseIcon, CopyIcon, LinkIcon, LockIcon, QrIcon, SparkIcon } from './Icons';

interface SyncSheetProps {
  entries: Glimmer[];
  initialCode: string;
  onClose: () => void;
  onImport: (code: string) => number;
  onToast: (message: string) => void;
}

type CopyTarget = 'code' | 'link' | null;

export function SyncSheet({ entries, initialCode, onClose, onImport, onToast }: SyncSheetProps) {
  const code = useMemo(() => encodeCode(entries), [entries]);
  const shareLink = useMemo(() => buildShareLink(code), [code]);
  const qrPayload = shareLink || code;
  const hasShareLink = shareLink.length > 0;
  const [importText, setImportText] = useState(initialCode);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [copied, setCopied] = useState<CopyTarget>(null);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrError, setQrError] = useState('');
  const hasEntries = entries.length > 0;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!showQr || !hasEntries) return;
    let cancelled = false;
    setQrUrl('');
    setQrError('');
    if (qrPayload.length > 2300) {
      setQrError('这片星空太大，二维码装不下了，请使用星语码。');
      return;
    }
    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#07101d',
        light: '#f2f8ff',
      },
    })
      .then((url) => {
        if (!cancelled) setQrUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrError('二维码生成失败，请使用星语码。');
      });
    return () => {
      cancelled = true;
    };
  }, [showQr, hasEntries, qrPayload]);

  const handleCopy = async (target: Exclude<CopyTarget, null>, value: string, message: string) => {
    const success = await copyText(value);
    if (success) {
      setCopied(target);
      onToast(message);
    } else {
      onToast('复制失败，请手动选中文本复制');
    }
  };

  const handleImport = () => {
    setImportError('');
    setImportSuccess('');
    try {
      const added = onImport(importText);
      if (added > 0) {
        onToast(`带回了 ${added} 束微光`);
        onClose();
      } else {
        setImportSuccess('这些微光已经在这片星空里了。');
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '星语码读取失败，请再试一次');
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
      <section className="sheet sheet--tall sync-sheet" role="dialog" aria-modal="true" aria-labelledby="sync-title">
        <button type="button" className="sheet-close" onClick={onClose} aria-label="关闭" autoFocus>
          <CloseIcon size={17} />
        </button>

        <header className="sheet-head">
          <p className="eyebrow">同频 · SYNC</p>
          <h2 id="sync-title">让星空，在设备之间流动。</h2>
          <p className="sheet-lead">
            没有账号，也没有云端。把微光压缩成一段「星语码」，换一台设备，就能继续同一片星空。
          </p>
        </header>

        {initialCode && (
          <div className="incoming-note">
            <SparkIcon size={15} />
            已从分享链接收到一段星空。确认下方的星语码，即可把它带回这里。
          </div>
        )}

        <div className="sheet-section">
          <div className="section-title">
            <span>01</span>
            <div>
              <h3>带走星空</h3>
              <p>{hasEntries ? `${entries.length} 束微光已打包，只包含文字与时间。` : '先点亮一束微光，再来带走星空。'}</p>
            </div>
          </div>

          {hasEntries ? (
            <>
              <textarea
                className="code-area"
                readOnly
                value={code}
                rows={4}
                spellCheck={false}
                aria-label="你的星语码"
                onFocus={(event) => event.currentTarget.select()}
              />
              <div className="code-meta">
                <span>{code.length.toLocaleString('zh-CN')} 个字符</span>
                <span>无账号 · 可离线生成</span>
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => handleCopy('code', code, '星语码已复制')}
                >
                  {copied === 'code' ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  {copied === 'code' ? '已复制' : '复制星语码'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={!hasShareLink}
                  onClick={() =>
                    handleCopy('link', shareLink, '分享链接已复制，打开即可带回星空')
                  }
                >
                  {copied === 'link' ? <CheckIcon size={14} /> : <LinkIcon size={14} />}
                  {copied === 'link' ? '已复制' : '复制分享链接'}
                </button>
                <button
                  type="button"
                  className={`btn btn-ghost${showQr ? ' is-active' : ''}`}
                  onClick={() => setShowQr((value) => !value)}
                >
                  <QrIcon size={14} />
                  {showQr ? '收起二维码' : '显示二维码'}
                </button>
              </div>
              {!hasShareLink && (
                <p className="form-message is-hint">
                  当前环境没有可访问的分享网址。二维码会直接编码星语码，请扫码后粘贴到另一台设备；如需一键打开，请使用已部署的网页版。
                </p>
              )}

              {showQr && (
                <div className="qr-panel">
                  {qrUrl ? (
                    <div className="qr-frame">
                      <img src={qrUrl} alt="包含这片星空的二维码" />
                    </div>
                  ) : qrError ? (
                    <p className="form-message is-error">{qrError}</p>
                  ) : (
                    <div className="qr-loading" aria-live="polite">
                      正在把星空放进二维码…
                    </div>
                  )}
                  <p className="qr-caption">
                    {hasShareLink
                      ? '用手机相机扫码，打开微光，即可带回这片星空。'
                      : '扫码可得到一段星语码，复制后粘贴到另一台设备的「同频」中。'}
                  </p>
                  <p className="qr-sub">
                    {hasShareLink
                      ? '本地调试时，手机需要访问电脑的局域网地址。'
                      : '星语码不经过服务器，也不依赖网络。'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="empty-section">你的星空还是空的。写下第一束微光后，这里会生成一段只属于你的星语码。</p>
          )}
        </div>

        <div className="sheet-divider" />

        <div className="sheet-section">
          <div className="section-title">
            <span>02</span>
            <div>
              <h3>带回星空</h3>
              <p>粘贴另一台设备上的星语码或分享链接，微光会自动合并。</p>
            </div>
          </div>
          <textarea
            className="code-area import-area"
            value={importText}
            onChange={(event) => {
              setImportText(event.target.value);
              setImportError('');
              setImportSuccess('');
            }}
            rows={3}
            spellCheck={false}
            placeholder="GLM1.… 或一段带 #s= 的分享链接"
            aria-label="粘贴星语码"
            autoFocus={Boolean(initialCode)}
          />
          {importError && (
            <p className="form-message is-error" role="alert">
              {importError}
            </p>
          )}
          {importSuccess && <p className="form-message is-success">{importSuccess}</p>}
          <div className="button-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              <SparkIcon size={14} />
              合并到我的星空
            </button>
          </div>
        </div>

        <p className="privacy-note">
          <LockIcon size={13} />
          星语码不经过任何服务器，只包含你写下的文字与时间。
        </p>
      </section>
    </div>
  );
}
