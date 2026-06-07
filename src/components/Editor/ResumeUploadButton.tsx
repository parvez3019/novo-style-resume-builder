import { useRef, useState } from 'react';
import { tryImportResumeFile } from '../../lib/importResume';
import type { ResumeData } from '../../types/resume';

interface Props {
  currentPhotoUrl: string;
  currentTheme: ResumeData['theme'];
  onImport: (resume: ResumeData) => void;
}

export function ResumeUploadButton({ currentPhotoUrl, currentTheme, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsLoading(true);
    setStatus(null);

    const result = await tryImportResumeFile(file, {
      photoUrl: currentPhotoUrl,
      theme: currentTheme,
    });
    setIsLoading(false);

    if (result.ok) {
      onImport(result.data);
      setStatus(`Imported from ${file.name}`);
    } else {
      setStatus(result.error);
    }
  };

  return (
    <div className="upload-control">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        hidden
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="toolbar-btn"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
      >
        {isLoading ? 'Importing…' : 'Upload resume'}
      </button>
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
}
