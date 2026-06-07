# Novo Resume Builder

A local, browser-based resume editor with live preview, theme controls, PDF export, and ATS plain-text export. Built with React, TypeScript, and Vite.

This project is an **independent, open-source learning exercise**. It is **not** the official Novo Resume / NovoResume product and is **not** affiliated with, endorsed by, or sponsored by Novo Resume or any related company.

---

## Disclaimer & fair use (educational purpose)

**Please read this section before using or distributing this project.**

### Purpose

This repository exists solely for **education and personal skill development**, including:

- Learning front-end layout, typography, and print/PDF export in the browser
- Practicing React, TypeScript, and local-first app design
- Demonstrating how a two-column resume template can be built with semantic HTML and CSS

It is **not** intended to compete with, replace, or commercially replicate any commercial resume platform.

### No affiliation

- **Novo Resume**, **NovoResume**, and related names, logos, and branding may be trademarks of their respective owners.
- This project **does not** use official Novo Resume logos, proprietary assets, backend services, or paid features.
- Any visual similarity (e.g. two-column layout, accent color, section structure) reflects a **common resume format** and **CSS layout study**, not a claim of ownership or partnership.

### Fair use & good-faith intent

The author believes this project falls within reasonable **fair use / fair dealing for educational purposes** because it:

1. Is **non-commercial** and shared for learning
2. Does **not** redistribute Novo Resume’s proprietary software, templates, or subscriber content
3. Does **not** impersonate Novo Resume or suggest official status
4. Lets users create **their own** resume content stored **locally** in the browser
5. Uses **generic placeholder copy** by default, not copied proprietary text

**This disclaimer is not legal advice.** Laws on fair use, trademarks, and trade dress vary by country. If you are unsure whether your use is permitted, consult a qualified attorney.

### Your responsibilities

If you fork or publish this project:

- Do **not** present it as the official Novo Resume app or service
- Do **not** use Novo Resume trademarks in app names, domains, or marketing without permission
- Do **not** scrape or republish Novo Resume’s paid templates or user data
- Prefer describing it as a **“resume layout inspired by common Novo-style templates”** or **“educational resume builder clone”**

### Limitation of liability

This software is provided **“as is”**, without warranty of any kind. The authors and contributors are **not liable** for any misuse, legal disputes, or damages arising from use of this project.

---

## Features

- Split-screen editor and A4 live preview
- Personal info, work experience, skills, community, education, achievements
- Upload `.pdf` / `.txt` to auto-fill fields (text extraction only)
- Appearance: font, template size, line/section spacing, accent color
- **Download PDF** via browser print (Save as PDF)
- **Download ATS Text** for applicant tracking systems
- Data saved in `localStorage` in your browser

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Exporting PDF

1. Click **Download PDF**
2. In the print dialog:
   - Destination: **Save as PDF**
   - **Turn off** “Headers and footers”
   - Margins: **None** (padding is built into the template)

Browsers often remember these settings for the next export.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- Plain CSS (no UI framework)
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) for PDF text import
- [lucide-react](https://lucide.dev/) icons

## License

No license file is included yet. Treat this repository as **source-available for educational use** unless a `LICENSE` file is added. Add an explicit license (e.g. MIT) before public distribution if you intend others to reuse the code commercially.

---

**Summary:** This is a **personal/educational resume builder**, not Novo Resume. Use it to learn and build your own CV—not to misrepresent affiliation with any commercial product.
