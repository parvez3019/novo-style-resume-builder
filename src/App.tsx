import { EditorPanel } from './components/Editor/EditorPanel';
import { ResumeUploadButton } from './components/Editor/ResumeUploadButton';
import { ResumePreview } from './components/Resume/ResumePreview';
import { useResumeStorage } from './hooks/useResumeStorage';
import { exportAtsText } from './lib/exportAtsText';
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
          <h1>Novo Resume Builder</h1>
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
          <button type="button" className="toolbar-btn" onClick={resetTemplate}>
            Reset template
          </button>
        </div>
        <div className="editor-scroll">
          <EditorPanel resume={resume} onChange={setResume} />
        </div>
      </aside>

      <main className="preview-panel">
        <ResumePreview resume={resume} />
      </main>
    </div>
  );
}

export default App;
