function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function collectStylesheets(): string {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');
}

async function waitForStylesheets(doc: Document): Promise<void> {
  const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
  await Promise.all(
    links.map(
      (link) =>
        new Promise<void>((resolve) => {
          if (link.sheet) {
            resolve();
            return;
          }
          link.addEventListener('load', () => resolve(), { once: true });
          link.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
  await doc.fonts.ready;
  await waitForNextFrame();
}

function prepareExportHtml(): string {
  const frame = document.querySelector('.resume-preview-frame');
  if (!frame) return '';

  const exportRoot = frame.cloneNode(true) as HTMLElement;
  exportRoot.style.boxShadow = 'none';

  const page = exportRoot.querySelector('.resume-page') as HTMLElement | null;
  if (page) {
    page.style.backgroundImage = 'none';
    page.style.minHeight = 'auto';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  ${collectStylesheets()}
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; padding: 0; background: #fff; }
    .resume-preview-frame { box-shadow: none !important; min-height: 0 !important; }
    .resume-page { min-height: 0 !important; background-image: none !important; }
  </style>
</head>
<body>${exportRoot.outerHTML}</body>
</html>`;
}

function printViaIframe(html: string): Promise<boolean> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const cleanup = () => {
      iframe.remove();
    };

    const frameWindow = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!frameWindow || !doc) {
      cleanup();
      resolve(false);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    void waitForStylesheets(doc)
      .then(() => {
        frameWindow.focus();
        frameWindow.print();
        frameWindow.addEventListener('afterprint', () => {
          cleanup();
          resolve(true);
        }, { once: true });
        // If afterprint never fires (some browsers), still cleanup.
        setTimeout(() => {
          if (iframe.isConnected) {
            cleanup();
            resolve(true);
          }
        }, 2000);
      })
      .catch(() => {
        cleanup();
        resolve(false);
      });
  });
}

export async function exportPdf(): Promise<void> {
  await document.fonts.ready;
  await waitForNextFrame();

  const html = prepareExportHtml();
  if (!html) return;

  const printed = await printViaIframe(html);
  if (!printed) {
    window.print();
  }
}
