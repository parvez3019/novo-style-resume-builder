import { EditorPanel } from './components/Editor/EditorPanel';
import { ResumeUploadButton } from './components/Editor/ResumeUploadButton';
import { ResumePreview } from './components/Resume/ResumePreview';
import { useResumeStorage } from './hooks/useResumeStorage';
import { exportAtsText } from './lib/exportAtsText';
import { exportJson } from './lib/exportJson';
import { exportPdf } from './lib/exportPdf';
import { loadThemeFont } from './lib/theme';
import './styles/editor.css';
import './styles/global.css';

loadThemeFont('ubuntu');

function App() {
  const { resume, setResume, resetTemplate } = useResumeStorage();

  return (
    <div className="app-shell">
      <aside className="editor-panel no-print">
        <div className="editor-toolbar">
          <h1>Novo-Style Resume Builder</h1>
          <ResumeUploadButton
            currentPhotoUrl={resume.personal.photoUrl}
            currentTheme={resume.theme}
            onImport={setResume}
          />
          <button type="button" className="toolbar-btn toolbar-btn--primary" onClick={exportPdf}>
            Download PDF
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => exportAtsText(resume)}
          >
            Download ATS Text
          </button>
          <button type="button" className="toolbar-btn" onClick={() => exportJson(resume)}>
            Download JSON
          </button>
          <button type="button" className="toolbar-btn" onClick={resetTemplate}>
            Reset template
          </button>
        </div>
        <div className="editor-scroll">
          <EditorPanel resume={resume} onChange={setResume} />
        </div>
        <footer className="editor-footer">
          <a href="https://parvez3019.github.io/novo-style-resume-builder/docs/" target="_blank" rel="noreferrer">
            Help &amp; docs
          </a>
          <span aria-hidden="true">·</span>
          <a href="https://github.com/parvez3019/novo-style-resume-builder" target="_blank" rel="noreferrer">
            ★ Star on GitHub
          </a>
        </footer>
      </aside>

      <main className="preview-panel">
        <ResumePreview resume={resume} />
      </main>
    </div>
  );
}

export default App;
