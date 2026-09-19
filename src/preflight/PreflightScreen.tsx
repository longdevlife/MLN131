import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Monitor, Zap, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface DiagnosticResult {
  webgl2Available: boolean;
  gpuRenderer: string;
  gpuVendor: string;
  viewportWidth: number;
  viewportHeight: number;
  dpr: number;
  fullscreenSupported: boolean;
  serviceWorkerRegistered: boolean;
  estimatedTier: 'high' | 'medium' | 'safe';
  fpsSample: number;
}

export const PreflightScreen: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [testingFps, setTestingFps] = useState(true);

  useEffect(() => {
    // 1. Check WebGL2 and GPU string
    let webgl2Available = false;
    let gpuRenderer = 'Không xác định (Software/Unknown)';
    let gpuVendor = 'N/A';

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      if (gl) {
        webgl2Available = true;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Generic WebGL2 GPU';
          gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Generic Vendor';
        } else {
          gpuRenderer = gl.getParameter(gl.RENDERER) || 'WebGL2 Supported';
          gpuVendor = gl.getParameter(gl.VENDOR) || 'Standard Driver';
        }
      }
    } catch {
      webgl2Available = false;
    }

    // 2. Viewport & DPR
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // 3. Fullscreen support
    const fullscreenSupported = !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled
    );

    // 4. Service worker support
    const serviceWorkerRegistered = 'serviceWorker' in navigator;

    // 5. Run a 1-second FPS benchmark
    let frames = 0;
    let startTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frames++;
      if (now - startTime >= 900) {
        const measuredFps = Math.round((frames * 1000) / (now - startTime));

        // Estimate quality tier
        let estimatedTier: 'high' | 'medium' | 'safe' = 'high';
        if (!webgl2Available || measuredFps < 28) {
          estimatedTier = 'safe';
        } else if (measuredFps < 48 || dpr > 2) {
          estimatedTier = 'medium';
        }

        setDiagnostics({
          webgl2Available,
          gpuRenderer,
          gpuVendor,
          viewportWidth,
          viewportHeight,
          dpr,
          fullscreenSupported,
          serviceWorkerRegistered,
          estimatedTier,
          fpsSample: measuredFps,
        });
        setTestingFps(false);
      } else {
        animId = requestAnimationFrame(measure);
      }
    };

    animId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(animId);
  }, []);

  const launchPresentation = (safeMode = false) => {
    window.location.href = safeMode ? '/?safe=1' : '/';
  };

  const launchControl = () => {
    window.location.href = '/?mode=control';
  };

  return (
    <div
      className="preflight-screen"
      style={{
        minHeight: '100vh',
        background: '#0B0D10',
        color: '#F5F0E8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          width: '100%',
          background: 'rgba(23, 26, 36, 0.95)',
          border: '1px solid rgba(200, 168, 106, 0.3)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <ShieldCheck size={32} color="#C8A86A" />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'serif', color: '#F5F0E8' }}>
              Kiểm tra tiền trạm phòng học (Classroom Preflight)
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#EDE4D6', opacity: 0.75, fontSize: '0.9rem' }}>
              Đánh giá tương thích phần cứng, WebGL và màn chiếu trước giờ thuyết trình
            </p>
          </div>
        </div>

        {testingFps ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#C8A86A' }}>
            <Zap className="animate-spin" size={36} style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.1rem' }}>Đang đo lường hiệu năng GPU & kiểm tra phần cứng...</p>
          </div>
        ) : diagnostics ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Grid of diagnostics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* WebGL2 status */}
              <div style={{ background: '#10131B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #3A2118' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A86A', marginBottom: '6px' }}>
                  <Cpu size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>WebGL2 Khả dụng</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
                  {diagnostics.webgl2Available ? (
                    <>
                      <CheckCircle2 size={20} color="#76A394" />
                      <span style={{ color: '#76A394' }}>Sẵn sàng (Hardware-accelerated)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={20} color="#C87046" />
                      <span style={{ color: '#C87046' }}>Không hỗ trợ (Cần dùng Safe Mode)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Viewport & DPR */}
              <div style={{ background: '#10131B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #3A2118' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A86A', marginBottom: '6px' }}>
                  <Monitor size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Độ phân giải & DPR</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F5F0E8' }}>
                  {diagnostics.viewportWidth} × {diagnostics.viewportHeight} (DPR: {diagnostics.dpr})
                </div>
              </div>

              {/* Benchmark FPS */}
              <div style={{ background: '#10131B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #3A2118' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A86A', marginBottom: '6px' }}>
                  <Zap size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Tốc độ khung hình (FPS)</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: diagnostics.fpsSample >= 50 ? '#76A394' : '#C87046' }}>
                  ~{diagnostics.fpsSample} FPS (Đạt chuẩn mượt)
                </div>
              </div>

              {/* Recommended tier */}
              <div style={{ background: '#10131B', padding: '1.25rem', borderRadius: '8px', border: '1px solid #3A2118' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C8A86A', marginBottom: '6px' }}>
                  <ShieldCheck size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Cấu hình đề xuất</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#DFB15B' }}>
                  Chế độ: {diagnostics.estimatedTier.toUpperCase()}
                </div>
              </div>
            </div>

            {/* GPU Renderer string */}
            <div style={{ background: '#10131B', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #3A2118' }}>
              <span style={{ color: '#9FB3C9', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Chi tiết bộ điều khiển đồ họa (GPU String):
              </span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#F5F0E8', marginTop: '4px' }}>
                {diagnostics.gpuRenderer}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => launchPresentation(false)}
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #C87046 0%, #A54B26 100%)',
                  color: '#F5F0E8',
                  border: '1px solid #DFB15B',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(200, 112, 70, 0.4)',
                }}
              >
                <Play size={18} />
                <span>Khởi động 3D chuẩn (Standard)</span>
              </button>

              <button
                type="button"
                onClick={() => launchPresentation(true)}
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  background: '#171A24',
                  color: '#EDE4D6',
                  border: '1px solid rgba(200, 168, 106, 0.4)',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={18} color="#C8A86A" />
                <span>Khởi động 2D Safe Mode (?safe=1)</span>
              </button>

              <button
                type="button"
                onClick={launchControl}
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  background: '#24344A',
                  color: '#F5F0E8',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Monitor size={18} />
                <span>Mở Bảng điều khiển diễn giả</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
