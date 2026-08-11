import { useState, useEffect } from 'react';
import { TRANSLATIONS } from './translations';
import './App.css';

function App() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [view, setView] = useState<'home' | 'camera'>('home');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeFilter, setActiveFilter] = useState('normal');

  const t = TRANSLATIONS[lang];

  // โหลดรายชื่อรูปภาพจาก Backend
  const loadScreenshots = () => {
    fetch('/screenshots')
      .then((res) => res.json())
      .then((data) => setScreenshots(data))
      .catch((err) => console.error('Error fetching screenshots:', err));
  };

  // ตรวจสอบสถานะการอัดวิดีโอจากเซิร์ฟเวอร์
  const checkRecordingStatus = () => {
    fetch('/recording_status')
      .then((res) => res.json())
      .then((data) => setIsRecording(data.is_recording))
      .catch((err) => console.error('Error fetching recording status:', err));
  };

  // บันทึกภาพหน้าจอ
  const captureImage = () => {
    fetch(`/capture?filter=${activeFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          alert(`${t.alert_save_success} ${data.filename}`);
          loadScreenshots();
          // ดาวน์โหลดทันที
          window.location.href = `/download_image/${data.filename}`;
        } else {
          alert(`${t.alert_save_fail} ${data.message}`);
        }
      })
      .catch((err) => console.error('Error capturing image:', err));
  };

  // เริ่ม/หยุด บันทึกวิดีโอ
  const toggleRecording = () => {
    if (!isRecording) {
      fetch('/start_recording')
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setIsRecording(true);
            alert(t.alert_rec_start);
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch((err) => console.error('Error starting record:', err));
    } else {
      fetch('/stop_recording')
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setIsRecording(false);
            alert(t.alert_rec_stop);
            // ดาวน์โหลดวิดีโอทันที
            window.location.href = `/download_video/${data.filename}`;
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch((err) => console.error('Error stopping record:', err));
    }
  };

  // ลบรูปภาพ
  const deleteImage = (filename: string) => {
    if (window.confirm(t.confirm_delete)) {
      fetch(`/delete_image/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            alert(t.alert_delete_success);
            loadScreenshots();
          } else {
            alert(`${t.alert_delete_fail} ${data.message}`);
          }
        })
        .catch((err) => console.error('Error deleting image:', err));
    }
  };

  // หยุดการใช้งานกล้องใน Backend
  const stopCamera = () => {
    fetch('/stop_camera').catch((err) => console.error(err));
  };

  // จัดการคีย์ลัดคีย์บอร์ด
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (view === 'camera') {
        if (event.key.toLowerCase() === 's') {
          captureImage();
        } else if (event.key.toLowerCase() === 'q') {
          stopCamera();
          setView('home');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, lang, activeFilter]);

  // รันเมื่อเข้าหน้ากล้อง
  useEffect(() => {
    if (view === 'camera') {
      loadScreenshots();
      checkRecordingStatus();
    } else {
      stopCamera();
    }
  }, [view]);

  return (
    <div className="container">
      {/* Header */}
      <header>
        <div className="logo-group">
          <span className="logo-icon">👁️</span>
          <span className="logo-text">{t.nav_brand}</span>
        </div>
        <div className="header-controls">
          <div className="lang-switch">
            <button
              className={`btn btn-secondary lang-btn ${lang === 'th' ? 'active' : ''}`}
              onClick={() => setLang('th')}
            >
              TH
            </button>
            <button
              className={`btn btn-secondary lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
          {view === 'camera' && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                stopCamera();
                setView('home');
              }}
            >
              {t.back_home}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {view === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>{t.hero_title}</h1>
              <p>{t.hero_desc}</p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => setView('camera')}>
                  {t.start_btn}
                </button>
              </div>
            </div>
            <div className="hero-graphic" style={{ fontSize: '8rem', textAlign: 'center', opacity: 0.85 }}>
              🤖
            </div>
          </section>

          {/* Features */}
          <h2 className="features-title">{t.features_title}</h2>
          <section className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>{t.feat_rt_title}</h3>
              <p>{t.feat_rt_desc}</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🧠</span>
              <h3>{t.feat_model_title}</h3>
              <p>{t.feat_model_desc}</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📸</span>
              <h3>{t.feat_snap_title}</h3>
              <p>{t.feat_snap_desc}</p>
            </div>
          </section>

          {/* About Author */}
          <div className="author-card">
            <div className="author-avatar">🧑‍💻</div>
            <div className="author-info">
              <h4>{t.about_title}</h4>
              <p>
                <strong>{t.about_intro}</strong>
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{t.about_desc}</p>
            </div>
          </div>
        </>
      ) : (
        /* Camera View */
        <div className="camera-view-container">
          <div className="video-card">
            <div className="video-wrapper">
              <img id="video-feed" src={`/video_feed?filter=${activeFilter}`} alt="Camera Stream" />
            </div>
            <div className="control-bar">
              <button className="btn btn-primary" onClick={captureImage}>
                {t.btn_capture}
              </button>
              <button
                id="record-btn"
                className="btn btn-secondary"
                onClick={toggleRecording}
                style={{
                  borderColor: '#dc2626',
                  color: isRecording ? '#fff' : '#dc2626',
                  backgroundColor: isRecording ? '#dc2626' : 'transparent',
                }}
              >
                {isRecording ? t.btn_stop_record : t.btn_start_record}
              </button>
              
              {/* Dropdown เลือกฟิลเตอร์ */}
              <div className="filter-select-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.label_filter}</span>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-thai), var(--font-eng)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="normal">{t.filter_normal}</option>
                  <option value="vintage">{t.filter_vintage}</option>
                  <option value="grayscale">{t.filter_grayscale}</option>
                  <option value="negative">{t.filter_negative}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="panel-card">
              <h3>{t.panel_shortcuts}</h3>
              <div className="shortcut-item">
                <span>{t.shortcut_snap}</span>
                <span className="key-badge">S</span>
              </div>
              <div className="shortcut-item">
                <span>{t.shortcut_back}</span>
                <span className="key-badge">Q</span>
              </div>
            </div>

            <div className="panel-card">
              <h3>{t.panel_gallery}</h3>
              <div className="gallery-grid" id="gallery">
                {screenshots.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', gridColumn: '1 / -1', textAlign: 'center' }}>
                    {t.gallery_empty}
                  </p>
                ) : (
                  screenshots.map((img) => (
                    <div className="gallery-item" key={img} style={{ display: 'flex', flexDirection: 'column' }}>
                      <img
                        src={`/saved_images/${img}`}
                        alt="Screenshot"
                        onClick={() => window.open(`/saved_images/${img}`, '_blank')}
                        style={{ cursor: 'pointer', flex: 1 }}
                      />
                      <a
                        href={`/download_image/${img}`}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          fontSize: '0.7rem',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          margin: '4px 0 2px 0',
                          fontWeight: 600,
                        }}
                      >
                        📥 Download
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteImage(img);
                        }}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          fontSize: '0.7rem',
                          color: '#dc2626',
                          textDecoration: 'none',
                          margin: '2px 0 6px 0',
                          fontWeight: 600,
                        }}
                      >
                        🗑️ {t.btn_delete}
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
