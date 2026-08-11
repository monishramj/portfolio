import { useEffect } from 'react';

const DownloadIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v13" />
    <path d="M6 11l6 6 6-6" />
    <path d="M4 20h16" />
  </svg>
);

const FullscreenIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3H4v4" />
    <path d="M16 3h4v4" />
    <path d="M8 21H4v-4" />
    <path d="M16 21h4v-4" />
  </svg>
);

const CloseIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export default function ResumeModal({ open, onClose }) {
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`;

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="resume-modal-backdrop" onClick={onClose}>
      <div className="resume-modal" onClick={e => e.stopPropagation()}>
        <div className="resume-modal-bar">
          <span className="resume-modal-title">resume</span>
          <div className="resume-modal-actions">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-modal-btn"
              title="Open fullscreen"
            >
              <FullscreenIcon /> fullscreen
            </a>
            <a href={resumeUrl} download className="resume-modal-btn" title="Download">
              <DownloadIcon /> download
            </a>
            <button className="resume-modal-btn resume-modal-close" onClick={onClose} title="Close">
              <CloseIcon />
            </button>
          </div>
        </div>
        <iframe src={resumeUrl} title="Resume" className="resume-modal-frame" />
      </div>
    </div>
  );
}
