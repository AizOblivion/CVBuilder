const revealItems = document.querySelectorAll(
  ".hero-copy, .hero-card, .content-card, .metric-card, .timeline-item, .project-card, .builder-form, .preview-toolbar, .preview-scroll"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});

// fallback: pastikan semua reveal item visible setelah 300ms
setTimeout(() => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => {
    el.classList.add("is-visible");
  });
}, 300);

const form = document.querySelector("#cv-form");
const previewPages = document.querySelector("#cv-preview-pages");
const saveBadge = document.querySelector("#save-badge");
const downloadButton = document.querySelector("#download-cv");
const resetButton = document.querySelector("#reset-cv");
const photoUploadInput = document.querySelector("#photo-upload");
const removePhotoButton = document.querySelector("#remove-photo");
const templateModal = document.querySelector("#template-modal");
const modalClose = document.querySelector("#modal-close");
const modalCancel = document.querySelector("#modal-cancel");
const modalDownload = document.querySelector("#modal-download");
const modalTemplateInputs = document.querySelectorAll('input[name="modal-template"]');
const storageKey = "bikincv-online-data-v3";
let currentPhotoDataUrl = "";
let selectedModalTemplate = "minimal";

const dynamicLists = {
  experience: document.querySelector("#experience-list"),
  education: document.querySelector("#education-list"),
  skill: document.querySelector("#skill-list"),
  language: document.querySelector("#language-list"),
};

const minimumItems = {
  experience: 1,
  education: 1,
  skill: 1,
  language: 1,
};

const defaultData = {
  template: "minimal",
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  city: "",
  website: "",
  birthDate: "",
  maritalStatus: "",
  religion: "",
  gender: "",
  identityNumber: "",
  fullAddress: "",
  photoDataUrl: "",
  summary: "",
  experiences: [{ role: "", company: "", period: "", location: "", details: "" }],
  education: [{ school: "", degree: "", year: "", highlight: "" }],
  skills: [""],
  languages: [{ name: "", level: "" }],
  customSections: [],
};

const fallbackCopy = {
  fullName: "Nama Lengkap",
  jobTitle: "Posisi Profesional",
  email: "email@contoh.com",
  summary:
    "Tulis ringkasan profesional yang menjelaskan pengalaman, kekuatan utama, dan value yang kamu bawa untuk perusahaan.",
};

const demoData = {
  template: "modern",
  fullName: "Aiz Oblivion",
  jobTitle: "Frontend Developer",
  email: "aiz.oblivion@demo-mail.com",
  phone: "+62 812 3456 7890",
  city: "Kota Demo, Indonesia",
  website: "portfolio.aizoblivion.demo",
  birthDate: "",
  maritalStatus: "",
  religion: "",
  gender: "",
  identityNumber: "",
  fullAddress: "",
  photoDataUrl: "",
  summary:
    "Frontend Developer dengan fokus pada pembuatan antarmuka web yang cepat, rapi, dan mudah digunakan. Berpengalaman membangun landing page, dashboard, dan sistem komponen yang konsisten untuk kebutuhan produk digital.",
  experiences: [
    {
      role: "Frontend Developer",
      company: "Pixel Horizon Studio",
      period: "2023 - Sekarang",
      location: "Desa Demo",
      details:
        "Membangun landing page responsif untuk kebutuhan campaign dan akuisisi.\nMenyusun komponen UI reusable agar proses pengembangan lebih cepat.\nBerkolaborasi dengan designer dan product team untuk memperbaiki pengalaman pengguna.",
    },
    {
      role: "UI Designer",
      company: "Nova Interface Lab",
      period: "2021 - 2023",
      location: "Kota Demo",
      details:
        "Membuat wireframe dan high-fidelity mockup untuk produk web.\nMenyusun design guideline sederhana agar tampilan lebih konsisten.",
    },
  ],
  education: [
    {
      school: "Akademi Teknologi Digital",
      degree: "Sarjana Sistem Interaktif",
      year: "2019 - 2023",
      highlight: "Cumlaude",
    },
    {
      school: "Program Pelatihan UI Web",
      degree: "Kelas Intensif Frontend",
      year: "2024",
      highlight: "Proyek akhir unggulan",
    },
  ],
  skills: ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "Figma", "Git"],
  languages: [
    {
      name: "Indonesia",
      level: "Native",
    },
    {
      name: "Inggris",
      level: "Professional Working",
    },
  ],
  customSections: [
    {
      id: "org-demo",
      title: "Organisasi",
      type: "entry",
      placement: "right",
      items: [
        { title: "Ketua BEM Fakultas", sub: "Universitas Demo", period: "2022 - 2023", detail: "Memimpin program kerja dan koordinasi antar divisi." },
      ],
    },
    {
      id: "prestasi-demo",
      title: "Prestasi",
      type: "list",
      placement: "left",
      items: [
        { text: "Juara 1 Lomba Desain UI Nasional 2023" },
        { text: "Mahasiswa Berprestasi Fakultas 2022" },
      ],
    },
  ],
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function baseItem(type) {
  const map = {
    experience: { role: "", company: "", period: "", location: "", details: "" },
    education: { school: "", degree: "", year: "", highlight: "" },
    skill: "",
    language: { name: "", level: "" },
  };

  return clone(map[type]);
}

function createEmptyState(message) {
  return `<div class="empty-state">${message}</div>`;
}

function experienceCard(item, index, total) {
  const removeDisabled = total <= minimumItems.experience;
  return `
    <div class="repeatable-card" data-type="experience" data-index="${index}">
      <div class="repeatable-head">
        <div>
          <h5>Pengalaman ${index + 1}</h5>
          <div class="repeatable-meta">Tambahkan jabatan, perusahaan, periode, dan pencapaian.</div>
        </div>
        <button type="button" class="danger-button" data-remove="experience" data-index="${index}" ${
          removeDisabled ? "disabled" : ""
        }>
          Hapus
        </button>
      </div>
      <div class="form-grid">
        <label>Jabatan
          <input type="text" data-field="role" value="${escapeHtml(item.role || "")}" />
        </label>
        <label>Perusahaan
          <input type="text" data-field="company" value="${escapeHtml(item.company || "")}" />
        </label>
        <label>Periode
          <input type="text" data-field="period" value="${escapeHtml(item.period || "")}" />
        </label>
        <label>Lokasi
          <input type="text" data-field="location" value="${escapeHtml(item.location || "")}" />
        </label>
      </div>
      <label>Pencapaian / Deskripsi
        <textarea data-field="details" rows="4">${escapeHtml(item.details || "")}</textarea>
      </label>
    </div>
  `;
}

function educationCard(item, index, total) {
  const removeDisabled = total <= minimumItems.education;
  return `
    <div class="repeatable-card" data-type="education" data-index="${index}">
      <div class="repeatable-head">
        <div>
          <h5>Pendidikan ${index + 1}</h5>
          <div class="repeatable-meta">Tambahkan institusi, gelar, tahun, dan highlight.</div>
        </div>
        <button type="button" class="danger-button" data-remove="education" data-index="${index}" ${
          removeDisabled ? "disabled" : ""
        }>
          Hapus
        </button>
      </div>
      <div class="form-grid">
        <label>Institusi
          <input type="text" data-field="school" value="${escapeHtml(item.school || "")}" />
        </label>
        <label>Jurusan / Gelar
          <input type="text" data-field="degree" value="${escapeHtml(item.degree || "")}" />
        </label>
        <label>Tahun
          <input type="text" data-field="year" value="${escapeHtml(item.year || "")}" />
        </label>
        <label>Nilai / Highlight
          <input type="text" data-field="highlight" value="${escapeHtml(item.highlight || "")}" />
        </label>
      </div>
    </div>
  `;
}

function skillCard(item, index, total) {
  const removeDisabled = total <= minimumItems.skill;
  return `
    <div class="repeatable-card" data-type="skill" data-index="${index}">
      <div class="repeatable-head">
        <div>
          <h5>Skill ${index + 1}</h5>
          <div class="repeatable-meta">Tambahkan satu skill per item agar preview lebih rapi.</div>
        </div>
        <button type="button" class="danger-button" data-remove="skill" data-index="${index}" ${
          removeDisabled ? "disabled" : ""
        }>
          Hapus
        </button>
      </div>
      <label>Nama Skill
        <input type="text" data-field="value" value="${escapeHtml(item || "")}" />
      </label>
    </div>
  `;
}

function languageCard(item, index, total) {
  const removeDisabled = total <= minimumItems.language;
  return `
    <div class="repeatable-card" data-type="language" data-index="${index}">
      <div class="repeatable-head">
        <div>
          <h5>Bahasa ${index + 1}</h5>
          <div class="repeatable-meta">Tambahkan bahasa dan level penguasaan.</div>
        </div>
        <button type="button" class="danger-button" data-remove="language" data-index="${index}" ${
          removeDisabled ? "disabled" : ""
        }>
          Hapus
        </button>
      </div>
      <div class="form-grid">
        <label>Bahasa
          <input type="text" data-field="name" value="${escapeHtml(item.name || "")}" />
        </label>
        <label>Level
          <input type="text" data-field="level" value="${escapeHtml(item.level || "")}" />
        </label>
      </div>
    </div>
  `;
}

// ── Custom Sections ──────────────────────────────────────────────

function newCustomSection() {
  return {
    id: `sec-${Date.now()}`,
    title: "",
    type: "entry",
    placement: "right",
    items: [{ title: "", sub: "", period: "", detail: "" }],
  };
}

function customSectionItemCard(item, sIdx, iIdx, type, total) {
  const canRemove = total > 1;
  if (type === "list") {
    return `
      <div class="repeatable-card cs-item" data-si="${sIdx}" data-ii="${iIdx}">
        <div class="repeatable-head">
          <h5>Item ${iIdx + 1}</h5>
          <button type="button" class="danger-button" data-cs-remove-item data-si="${sIdx}" data-ii="${iIdx}" ${canRemove ? "" : "disabled"}>Hapus</button>
        </div>
        <label>Teks
          <input type="text" data-cs-field="text" value="${escapeHtml(item.text || "")}" />
        </label>
      </div>`;
  }
  return `
    <div class="repeatable-card cs-item" data-si="${sIdx}" data-ii="${iIdx}">
      <div class="repeatable-head">
        <h5>Item ${iIdx + 1}</h5>
        <button type="button" class="danger-button" data-cs-remove-item data-si="${sIdx}" data-ii="${iIdx}" ${canRemove ? "" : "disabled"}>Hapus</button>
      </div>
      <div class="form-grid">
        <label>Judul / Jabatan
          <input type="text" data-cs-field="title" value="${escapeHtml(item.title || "")}" />
        </label>
        <label>Sub / Organisasi
          <input type="text" data-cs-field="sub" value="${escapeHtml(item.sub || "")}" />
        </label>
        <label>Periode
          <input type="text" data-cs-field="period" value="${escapeHtml(item.period || "")}" />
        </label>
      </div>
      <label>Deskripsi
        <textarea data-cs-field="detail" rows="2">${escapeHtml(item.detail || "")}</textarea>
      </label>
    </div>`;
}

function renderCustomSectionCard(sec, sIdx, total) {
  const canRemove = total > 0;
  const itemsHtml = sec.items.map((item, iIdx) =>
    customSectionItemCard(item, sIdx, iIdx, sec.type, sec.items.length)
  ).join("");

  return `
    <div class="custom-section-card" data-si="${sIdx}">
      <div class="cs-head">
        <div class="cs-head-left">
          <input class="cs-title-input" type="text" data-cs-title data-si="${sIdx}"
            value="${escapeHtml(sec.title)}" />
        </div>
        <div class="cs-head-right">
          <select data-cs-type data-si="${sIdx}" class="cs-select">
            <option value="entry" ${sec.type === "entry" ? "selected" : ""}>Entry (judul + sub + periode)</option>
            <option value="list" ${sec.type === "list" ? "selected" : ""}>List (teks sederhana)</option>
          </select>
          <select data-cs-placement data-si="${sIdx}" class="cs-select">
            <option value="right" ${sec.placement === "right" ? "selected" : ""}>Kolom kanan</option>
            <option value="left" ${sec.placement === "left" ? "selected" : ""}>Kolom kiri</option>
          </select>
          <button type="button" class="danger-button" data-cs-remove-section data-si="${sIdx}" ${canRemove ? "" : "disabled"}>Hapus Section</button>
        </div>
      </div>
      <div class="cs-items-list">${itemsHtml}</div>
      <button type="button" class="mini-button cs-add-item" data-cs-add-item data-si="${sIdx}">+ Tambah Item</button>
    </div>`;
}

function renderCustomSections(sections) {
  const container = document.querySelector("#custom-sections-list");
  if (!container) return;
  if (!sections.length) {
    container.innerHTML = `<div class="empty-state">Belum ada section tambahan. Klik tombol di atas untuk membuat.</div>`;
    return;
  }
  container.innerHTML = sections.map((sec, i) => renderCustomSectionCard(sec, i, sections.length)).join("");
}

function readCustomSections() {
  const cards = document.querySelectorAll(".custom-section-card");
  return Array.from(cards).map((card) => {
    const sIdx = Number(card.dataset.si);
    const titleEl = card.querySelector("[data-cs-title]");
    const typeEl  = card.querySelector("[data-cs-type]");
    const placEl  = card.querySelector("[data-cs-placement]");
    const type = typeEl?.value || "entry";
    const items = Array.from(card.querySelectorAll(".cs-item")).map(itemEl => {
      const fields = {};
      itemEl.querySelectorAll("[data-cs-field]").forEach(f => { fields[f.dataset.csField] = f.value.trim(); });
      return fields;
    });
    return {
      id: `sec-${sIdx}`,
      title: titleEl?.value.trim() || "",
      type,
      placement: placEl?.value || "right",
      items,
    };
  });
}

function renderDynamicFields(data) {
  dynamicLists.experience.innerHTML = data.experiences.length
    ? data.experiences.map((item, index, items) => experienceCard(item, index, items.length)).join("")
    : createEmptyState("Belum ada pengalaman kerja. Klik tombol tambah untuk membuat item baru.");

  dynamicLists.education.innerHTML = data.education.length
    ? data.education.map((item, index, items) => educationCard(item, index, items.length)).join("")
    : createEmptyState("Belum ada pendidikan. Klik tombol tambah untuk membuat item baru.");

  dynamicLists.skill.innerHTML = data.skills.length
    ? data.skills.map((item, index, items) => skillCard(item, index, items.length)).join("")
    : createEmptyState("Belum ada skill. Klik tombol tambah untuk membuat item baru.");

  dynamicLists.language.innerHTML = data.languages.length
    ? data.languages.map((item, index, items) => languageCard(item, index, items.length)).join("")
    : createEmptyState("Belum ada bahasa. Klik tombol tambah untuk membuat item baru.");

  renderCustomSections(data.customSections || []);
}

function readDynamicList(type) {
  const cards = dynamicLists[type].querySelectorAll(`.repeatable-card[data-type="${type}"]`);

  if (type === "skill") {
    return Array.from(cards)
      .map((card) => card.querySelector('[data-field="value"]').value.trim());
  }

  return Array.from(cards)
    .map((card) => {
      const fields = {};
      card.querySelectorAll("[data-field]").forEach((field) => {
        fields[field.dataset.field] = field.value.trim();
      });
      return fields;
    });
}

function getFormData() {
  const data = clone(defaultData);
  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    if (key === "template") continue;
    data[key] = String(value).trim();
  }

  data.photoDataUrl = currentPhotoDataUrl;
  data.experiences = readDynamicList("experience");
  data.education = readDynamicList("education");
  data.skills = readDynamicList("skill");
  data.languages = readDynamicList("language");
  data.customSections = readCustomSections();

  return data;
}

function summaryValue(data) {
  return data.summary || fallbackCopy.summary;
}

function sanitizeData(data) {
  return {
    template: data.template || "minimal",
    fullName: data.fullName || fallbackCopy.fullName,
    jobTitle: data.jobTitle || fallbackCopy.jobTitle,
    email: data.email || fallbackCopy.email,
    phone: data.phone || "",
    city: data.city || "",
    website: data.website || "",
    birthDate: data.birthDate || "",
    maritalStatus: data.maritalStatus || "",
    religion: data.religion || "",
    gender: data.gender || "",
    identityNumber: data.identityNumber || "",
    fullAddress: data.fullAddress || "",
    photoDataUrl: data.photoDataUrl || "",
    summary: summaryValue(data),
    experiences: (data.experiences || []).filter((item) => Object.values(item).some(Boolean)),
    education: (data.education || []).filter((item) => Object.values(item).some(Boolean)),
    skills: (data.skills || []).filter(Boolean),
    languages: (data.languages || []).filter((item) => Object.values(item).some(Boolean)),
    customSections: (data.customSections || []),
  };
}

function renderSummarySection(summary) {
  // potong ringkasan maks 300 karakter agar tidak overflow
  const trimmed = summary.length > 300 ? summary.slice(0, 297) + "..." : summary;
  return `
    <section class="cv-block cv-block-summary">
      <p class="cv-label">Profil Singkat</p>
      <p class="cv-summary">${escapeHtml(trimmed)}</p>
    </section>
  `;
}

function renderPersonalDetails(profile) {
  const rows = [
    profile.birthDate ? `<div class="cv-detail-item"><strong>Tanggal Lahir</strong><span>${escapeHtml(profile.birthDate)}</span></div>` : "",
    profile.maritalStatus ? `<div class="cv-detail-item"><strong>Status Pernikahan</strong><span>${escapeHtml(profile.maritalStatus)}</span></div>` : "",
    profile.religion ? `<div class="cv-detail-item"><strong>Agama</strong><span>${escapeHtml(profile.religion)}</span></div>` : "",
    profile.gender ? `<div class="cv-detail-item"><strong>Jenis Kelamin</strong><span>${escapeHtml(profile.gender)}</span></div>` : "",
    profile.identityNumber ? `<div class="cv-detail-item"><strong>NIK / KTP</strong><span>${escapeHtml(profile.identityNumber)}</span></div>` : "",
    profile.fullAddress ? `<div class="cv-detail-item cv-detail-wide"><strong>Alamat</strong><span>${escapeHtml(profile.fullAddress)}</span></div>` : "",
  ].filter(Boolean);

  if (!rows.length) {
    return "";
  }

  return `
    <section class="cv-block cv-block-personal">
      <p class="cv-label">Data Diri</p>
      <div class="cv-detail-list">
        ${rows.join("")}
      </div>
    </section>
  `;
}

function renderExperienceSection(experiences) {
  const items = (experiences.length ? experiences : [baseItem("experience")])
    .map((item) => {
      const bullets = (item.details || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 3); // maks 3 bullet per pengalaman

      const bulletMarkup = bullets.length
        ? `<ul class="cv-bullets">${bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
        : `<ul class="cv-bullets"><li>Tambahkan deskripsi singkat untuk menjelaskan tanggung jawab atau hasil kerja.</li></ul>`;

      return `
        <article class="cv-entry">
          <div class="cv-entry-head">
            <div>
              <h2>${escapeHtml(item.role || "Jabatan")}</h2>
              <p>${escapeHtml(item.company || "Nama Perusahaan")}</p>
            </div>
            <div class="cv-entry-meta">
              <span>${escapeHtml(item.period || "Periode")}</span>
              <span>${escapeHtml(item.location || "Lokasi")}</span>
            </div>
          </div>
          ${bulletMarkup}
        </article>
      `;
    })
    .join("");

  return `
    <section class="cv-block cv-block-experience">
      <p class="cv-label">Pengalaman Kerja</p>
      <div class="cv-section-stack">
        ${items}
      </div>
    </section>
  `;
}

function renderEducationSection(education) {
  const items = (education.length ? education : [baseItem("education")])
    .map((item) => `
      <article class="cv-education">
        <div class="cv-mini-head">
          <div>
            <h2>${escapeHtml(item.school || "Nama Institusi")}</h2>
            <p>${escapeHtml(item.degree || "Jurusan / Gelar")}</p>
          </div>
          <div class="cv-entry-meta">
            <span>${escapeHtml(item.year || "Tahun")}</span>
            <span>${escapeHtml(item.highlight || "Highlight")}</span>
          </div>
        </div>
      </article>
    `)
    .join("");

  return `
    <section class="cv-block cv-block-education">
      <p class="cv-label">Pendidikan</p>
      <div class="cv-section-stack">
        ${items}
      </div>
    </section>
  `;
}

function renderSkillsSection(skills) {
  const safeSkills = skills.length ? skills : ["Tambahkan", "Skill", "Di Sini"];

  return `
    <section class="cv-block cv-block-skills">
      <p class="cv-label">Skills</p>
      <div class="chip-list">
        ${safeSkills.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderLanguagesSection(languages) {
  const items = (languages.length ? languages : [baseItem("language")])
    .map((item) => `
      <div class="cv-language-item">
        <strong>${escapeHtml(item.name || "Bahasa")}</strong>
        <span>${escapeHtml(item.level || "Level penguasaan")}</span>
      </div>
    `)
    .join("");

  return `
    <section class="cv-block cv-block-language">
      <p class="cv-label">Bahasa</p>
      <div class="cv-language-list">
        ${items}
      </div>
    </section>
  `;
}

function nameClass(fullName) {
  if (fullName.length > 60) return "cv-name cv-name-xxlong";
  if (fullName.length > 40) return "cv-name cv-name-xlong";
  if (fullName.length > 20) return "cv-name cv-name-long";
  return "cv-name";
}

function renderPreview(data, templateOverride) {
  const profile = sanitizeData(data);
  if (templateOverride) profile.template = templateOverride;
  const contactItems = [
    profile.email,
    profile.phone,
    profile.city,
    profile.website,
  ].filter(Boolean);

  previewPages.className = `cv-pages template-${profile.template || "minimal"}`;

  previewPages.innerHTML = buildCvHtml(profile, contactItems);
}

function buildCvHtml(profile, contactItems) {
  const contactIcons = {
    phone: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>`,
    email: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    city:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    web:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  };

  function contactIcon(val) {
    if (!val) return "";
    if (val.includes("@")) return contactIcons.email;
    if (/^[+\d\s()-]{6,}$/.test(val)) return contactIcons.phone;
    if (val.match(/^https?:|linkedin|portfolio|github/i)) return contactIcons.web;
    return contactIcons.city;
  }

  const photoHtml = profile.photoDataUrl
    ? `<div class="cv-photo-circle"><img src="${profile.photoDataUrl}" alt="Foto profil" /></div>`
    : `<div class="cv-photo-circle cv-photo-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity=".4"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>`;

  const personalRows = [
    profile.birthDate      ? `<div class="cv-si-row"><span>Tgl. Lahir</span><span>${escapeHtml(profile.birthDate)}</span></div>` : "",
    profile.gender         ? `<div class="cv-si-row"><span>Jenis Kelamin</span><span>${escapeHtml(profile.gender)}</span></div>` : "",
    profile.religion       ? `<div class="cv-si-row"><span>Agama</span><span>${escapeHtml(profile.religion)}</span></div>` : "",
    profile.maritalStatus  ? `<div class="cv-si-row"><span>Status</span><span>${escapeHtml(profile.maritalStatus)}</span></div>` : "",
    profile.identityNumber ? `<div class="cv-si-row"><span>NIK</span><span>${escapeHtml(profile.identityNumber)}</span></div>` : "",
    profile.fullAddress    ? `<div class="cv-si-row cv-si-full"><span>Alamat</span><span>${escapeHtml(profile.fullAddress)}</span></div>` : "",
  ].filter(Boolean).join("");

  const skillsHtml = profile.skills.length
    ? profile.skills.map(s => `<div class="cv-skill-item">— ${escapeHtml(s)}</div>`).join("")
    : `<div class="cv-skill-item">— Tambahkan skill</div>`;

  const langsHtml = profile.languages.length
    ? profile.languages.map(l => `<div class="cv-skill-item">— ${escapeHtml(l.name)}${l.level ? ` <em>(${escapeHtml(l.level)})</em>` : ""}</div>`).join("")
    : "";

  const expHtml = profile.experiences.length
    ? profile.experiences.map(item => {
        const bullets = (item.details || "").split("\n").map(l => l.trim()).filter(Boolean).slice(0, 3);
        return `
          <div class="cv-right-entry">
            <div class="cv-right-entry-head">
              <div>
                <strong>${escapeHtml(item.role || "Jabatan")}</strong>
                <span>${escapeHtml(item.company || "Perusahaan")}${item.location ? ` · ${escapeHtml(item.location)}` : ""}</span>
              </div>
              <span class="cv-right-period">${escapeHtml(item.period || "")}</span>
            </div>
            ${bullets.length ? `<ul class="cv-right-bullets">${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
          </div>`;
      }).join("")
    : `<div class="cv-right-entry"><strong>Tambahkan pengalaman kerja</strong></div>`;

  const eduHtml = profile.education.length
    ? profile.education.map(item => `
        <div class="cv-right-entry">
          <div class="cv-right-entry-head">
            <div>
              <strong>${escapeHtml(item.school || "Institusi")}</strong>
              <span>${escapeHtml(item.degree || "")}${item.highlight ? ` · ${escapeHtml(item.highlight)}` : ""}</span>
            </div>
            <span class="cv-right-period">${escapeHtml(item.year || "")}</span>
          </div>
        </div>`).join("")
    : `<div class="cv-right-entry"><strong>Tambahkan pendidikan</strong></div>`;

  const summaryTrimmed = profile.summary.length > 300 ? profile.summary.slice(0, 297) + "..." : profile.summary;

  // custom sections
  const leftCustom = (profile.customSections || []).filter(s => s.placement === "left" && s.title);
  const rightCustom = (profile.customSections || []).filter(s => s.placement === "right" && s.title);

  function renderCustomSectionCv(sec) {
    const itemsHtml = sec.type === "list"
      ? sec.items.map(it => `<div class="cv-right-list-item">— ${escapeHtml(it.text || "")}</div>`).join("")
      : sec.items.map(it => `
          <div class="cv-right-entry">
            <div class="cv-right-entry-head">
              <div>
                <strong>${escapeHtml(it.title || "")}</strong>
                ${it.sub ? `<span>${escapeHtml(it.sub)}</span>` : ""}
              </div>
              ${it.period ? `<span class="cv-right-period">${escapeHtml(it.period)}</span>` : ""}
            </div>
            ${it.detail ? `<ul class="cv-right-bullets"><li>${escapeHtml(it.detail)}</li></ul>` : ""}
          </div>`).join("");
    return { title: sec.title, type: sec.type, itemsHtml };
  }

  return `
    <article class="cv-page cv-split">
      <aside class="cv-left">
        ${photoHtml}
        <h1 class="${nameClass(profile.fullName)} cv-left-name">${escapeHtml(profile.fullName)}</h1>
        <p class="cv-left-role">${escapeHtml(profile.jobTitle)}</p>

        <div class="cv-left-section">
          <div class="cv-left-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            Kontak
          </div>
          <div class="cv-left-items">
            ${contactItems.map(v => `<div class="cv-left-contact-item">${contactIcon(v)}<span>${escapeHtml(v)}</span></div>`).join("")}
          </div>
        </div>

        ${personalRows ? `
        <div class="cv-left-section">
          <div class="cv-left-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            Data Diri
          </div>
          <div class="cv-si-list">${personalRows}</div>
        </div>` : ""}

        <div class="cv-left-section">

        ${langsHtml ? `
        <div class="cv-left-section">
          <div class="cv-left-heading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
            Bahasa
          </div>
          <div class="cv-left-items">${langsHtml}</div>
        </div>` : ""}

        ${leftCustom.map(sec => {
          const { title, type, itemsHtml } = renderCustomSectionCv(sec);
          return `
          <div class="cv-left-section">
            <div class="cv-left-heading">${escapeHtml(title)}</div>
            <div class="cv-left-items">${itemsHtml}</div>
          </div>`;
        }).join("")}
      </aside>

      <div class="cv-right">
        <div class="cv-right-section">
          <div class="cv-right-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            Profil
          </div>
          <p class="cv-right-summary">${escapeHtml(summaryTrimmed)}</p>
        </div>

        <div class="cv-right-section">
          <div class="cv-right-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.05 15.96 0 13.36 0c-1.46 0-2.35.87-3.36 2.14C8.99.87 8.1 0 6.64 0 4.04 0 2 2.05 2 4.64c0 .48.11.92.18 1.36H0v14h24V6h-4zm-6.64-4c.9 0 1.64.74 1.64 1.64 0 1-.89 1.36-1.64 1.36S12 4.64 12 3.64C12 2.74 12.46 2 13.36 2zM6.64 2c.9 0 1.36.74 1.36 1.64 0 1-.74 1.36-1.64 1.36-.75 0-1.64-.36-1.64-1.36C4.72 2.74 5.74 2 6.64 2zM2 18V8h9v10H2zm11 0V8h9v10h-9z"/></svg>
            Pengalaman Kerja
          </div>
          ${expHtml}
        </div>

        <div class="cv-right-section">
          <div class="cv-right-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
            Pendidikan
          </div>
          ${eduHtml}
        </div>

        ${rightCustom.map(sec => {
          const { title, itemsHtml } = renderCustomSectionCv(sec);
          return `
          <div class="cv-right-section">
            <div class="cv-right-heading">${escapeHtml(title)}</div>
            ${itemsHtml}
          </div>`;
        }).join("")}
      </div>
    </article>
  `;
}

const modalDetailPreview = document.querySelector("#modal-detail-preview");
const modalDetailLabel   = document.querySelector("#modal-detail-label");

const templateLabels = { minimal: "Minimal", modern: "Modern", executive: "Executive" };

function renderModalPreviews(data) {
  const templates = ["minimal", "modern", "executive"];
  templates.forEach((tpl) => {
    const container = document.querySelector(`#modal-preview-${tpl}`);
    if (!container) return;

    const profile = sanitizeData({ ...data, template: tpl });
    const contactItems = [profile.email, profile.phone, profile.city, profile.website].filter(Boolean);
    container.innerHTML = buildCvHtml(profile, contactItems);

    // scale thumbnail (64px wide)
    requestAnimationFrame(() => {
      const thumb = container.closest(".modal-tpl-thumb");
      if (!thumb) return;
      const scale = thumb.offsetWidth / 794;
      container.style.transform = `scale(${scale})`;
      container.style.width = "794px";
    });
  });
}

function renderDetailPreview(data, tpl) {
  if (!modalDetailPreview) return;
  const profile = sanitizeData({ ...data, template: tpl });
  const contactItems = [profile.email, profile.phone, profile.city, profile.website].filter(Boolean);
  modalDetailPreview.className = `cv-pages template-${tpl}`;
  modalDetailPreview.innerHTML = buildCvHtml(profile, contactItems);
  if (modalDetailLabel) {
    modalDetailLabel.textContent = `Preview — ${templateLabels[tpl] || tpl}`;
  }
}

function openModal() {
  const data = getFormData();
  renderModalPreviews(data);
  renderDetailPreview(data, selectedModalTemplate);
  templateModal.hidden = false;
  document.body.style.overflow = "hidden";
  modalDownload.focus();
}

function closeModal() {
  templateModal.hidden = true;
  document.body.style.overflow = "";
}

async function exportPdfFromPreview() {
  const html2canvasLib = window.html2canvas;
  const jsPdfLib = window.jspdf?.jsPDF;

  if (!html2canvasLib || !jsPdfLib) {
    if (saveBadge) {
      saveBadge.textContent = "Library PDF belum siap, coba lagi sesaat";
    }
    return;
  }

  // render preview dengan template yang dipilih di modal
  const data = getFormData();
  renderPreview(data, selectedModalTemplate);

  const exportHost = document.createElement("div");
  exportHost.className = "pdf-export-host";

  const cloneNode = previewPages.cloneNode(true);
  cloneNode.classList.add("export-clone", "exporting-pdf");
  exportHost.appendChild(cloneNode);
  document.body.appendChild(exportHost);

  const pageNodes = Array.from(cloneNode.querySelectorAll(".cv-page"));

  const pdf = new jsPdfLib({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  try {
    for (let index = 0; index < pageNodes.length; index += 1) {
      const pageNode = pageNodes[index];
      const canvas = await html2canvasLib(pageNode, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png", 1);

      if (index > 0) pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, 0, 210, 297, undefined, "FAST");
    }

    const fullName = getFormData().fullName || "cv-online";
    const safeTitle = fullName.toLowerCase().replace(/\s+/g, "-");
    pdf.save(`${safeTitle}-cv.pdf`);

    if (saveBadge) {
      saveBadge.textContent = "PDF berhasil diunduh";
    }
  } finally {
    exportHost.remove();
  }
}

function saveData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
  if (saveBadge) {
    saveBadge.textContent = "Tersimpan di browser";
  }
}

function loadData() {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? { ...clone(defaultData), ...JSON.parse(stored) } : null;
  } catch {
    return null;
  }
}

function populateStaticFields(data) {
  Object.entries(data).forEach(([key, value]) => {
    if (["experiences", "education", "skills", "languages", "template"].includes(key)) {
      return;
    }

    if (key === "photoDataUrl") {
      currentPhotoDataUrl = value || "";
      if (photoUploadInput) {
        photoUploadInput.value = "";
      }
      return;
    }

    const field = form.elements.namedItem(key);
    if (!field) return;

    if (field instanceof RadioNodeList) {
      Array.from(field).forEach((radio) => {
        radio.checked = radio.value === value;
      });
      return;
    }

    field.value = value;
  });
}

function populateAll(data) {
  populateStaticFields(data);
  renderDynamicFields({
    experiences: data.experiences?.length ? data.experiences : clone(defaultData.experiences),
    education: data.education?.length ? data.education : clone(defaultData.education),
    skills: data.skills?.length ? data.skills : clone(defaultData.skills),
    languages: data.languages?.length ? data.languages : clone(defaultData.languages),
    customSections: data.customSections || [],
  });
  renderPreview({
    ...clone(defaultData),
    ...data,
  }, selectedModalTemplate);
}

function sync() {
  const data = getFormData();
  renderPreview(data, selectedModalTemplate);
  saveData(data);
}

function addItem(type) {
  const data = getFormData();
  const map = {
    experience: "experiences",
    education: "education",
    skill: "skills",
    language: "languages",
  };

  data[map[type]].push(baseItem(type));
  populateAll(data);
  saveData(data);
}

function removeItem(type, index) {
  const data = getFormData();
  const map = {
    experience: "experiences",
    education: "education",
    skill: "skills",
    language: "languages",
  };
  const key = map[type];
  const minimum = minimumItems[type];

  if (data[key].length <= minimum) {
    if (saveBadge) {
      saveBadge.textContent = "Minimal satu item harus tersedia";
    }
    return;
  }

  data[key] = data[key].filter((_, itemIndex) => itemIndex !== index);
  populateAll(data);
  saveData(getFormData());
}

const addCustomSectionBtn = document.querySelector("#add-custom-section");
if (addCustomSectionBtn) {
  addCustomSectionBtn.addEventListener("click", () => {
    const data = getFormData();
    data.customSections = [...(data.customSections || []), newCustomSection()];
    renderCustomSections(data.customSections);
    saveData(data);
    sync();
  });
}

// sync saat type/placement berubah
document.addEventListener("change", (e) => {
  if (e.target.matches("[data-cs-type], [data-cs-placement]")) {
    const sIdx = Number(e.target.dataset.si);
    const data = getFormData();
    if (e.target.matches("[data-cs-type]")) {
      const sec = data.customSections[sIdx];
      if (sec) {
        sec.type = e.target.value;
        sec.items = sec.type === "list"
          ? sec.items.map(it => ({ text: it.text || it.title || "" }))
          : sec.items.map(it => ({ title: it.title || it.text || "", sub: it.sub || "", period: it.period || "", detail: it.detail || "" }));
        renderCustomSections(data.customSections);
      }
    }
    saveData(data);
    sync();
  }
});

const storedData = loadData();
populateAll(storedData || clone(defaultData));

if (storedData && saveBadge) {
  saveBadge.textContent = "Data sebelumnya dimuat";
}

form.addEventListener("input", sync);
form.addEventListener("change", sync);

document.addEventListener("click", (event) => {
  // tambah item standar
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addItem(addButton.dataset.add);
    return;
  }

  // hapus item standar
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removeItem(removeButton.dataset.remove, Number(removeButton.dataset.index));
    return;
  }

  // hapus section custom
  const removeSection = event.target.closest("[data-cs-remove-section]");
  if (removeSection) {
    const card = removeSection.closest(".custom-section-card");
    const cards = [...document.querySelectorAll(".custom-section-card")];
    const sIdx = cards.indexOf(card);
    const data = getFormData();
    data.customSections.splice(sIdx, 1);
    renderCustomSections(data.customSections);
    saveData(data);
    sync();
    return;
  }

  // tambah item custom
  const addItemBtn = event.target.closest("[data-cs-add-item]");
  if (addItemBtn) {
    const card = addItemBtn.closest(".custom-section-card");
    const cards = [...document.querySelectorAll(".custom-section-card")];
    const sIdx = cards.indexOf(card);
    const data = getFormData();
    const sec = data.customSections[sIdx];
    if (!sec) return;
    const emptyItem = sec.type === "list" ? { text: "" } : { title: "", sub: "", period: "", detail: "" };
    sec.items.push(emptyItem);
    renderCustomSections(data.customSections);
    saveData(data);
    sync();
    return;
  }

  // hapus item custom
  const removeItemBtn = event.target.closest("[data-cs-remove-item]");
  if (removeItemBtn) {
    const itemEl = removeItemBtn.closest(".cs-item");
    const card = removeItemBtn.closest(".custom-section-card");
    const cards = [...document.querySelectorAll(".custom-section-card")];
    const sIdx = cards.indexOf(card);
    const items = [...card.querySelectorAll(".cs-item")];
    const iIdx = items.indexOf(itemEl);
    const data = getFormData();
    if (data.customSections[sIdx]?.items.length > 1) {
      data.customSections[sIdx].items.splice(iIdx, 1);
      renderCustomSections(data.customSections);
      saveData(data);
      sync();
    }
  }
});

resetButton.addEventListener("click", () => {
  requestAnimationFrame(() => {
    localStorage.removeItem(storageKey);
    currentPhotoDataUrl = "";
    if (photoUploadInput) {
      photoUploadInput.value = "";
    }
    populateAll(clone(defaultData));
    if (saveBadge) {
      saveBadge.textContent = "Data direset";
    }
  });
});

downloadButton.addEventListener("click", () => {
  openModal();
});

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);

templateModal.addEventListener("click", (e) => {
  if (e.target === templateModal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !templateModal.hidden) closeModal();
});

modalTemplateInputs.forEach((input) => {
  input.addEventListener("change", () => {
    selectedModalTemplate = input.value;
    renderDetailPreview(getFormData(), selectedModalTemplate);
  });
});

modalDownload.addEventListener("click", async () => {
  modalDownload.classList.add("is-busy");
  modalDownload.setAttribute("aria-busy", "true");
  const originalLabel = modalDownload.textContent;
  modalDownload.textContent = "Membuat PDF...";

  try {
    await exportPdfFromPreview();
    closeModal();
  } finally {
    modalDownload.classList.remove("is-busy");
    modalDownload.removeAttribute("aria-busy");
    modalDownload.textContent = originalLabel;
  }
});

photoUploadInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    if (saveBadge) {
      saveBadge.textContent = "Foto terlalu besar, maksimal 2MB";
    }
    photoUploadInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    currentPhotoDataUrl = typeof reader.result === "string" ? reader.result : "";
    sync();
  };
  reader.readAsDataURL(file);
});

removePhotoButton.addEventListener("click", () => {
  currentPhotoDataUrl = "";
  if (photoUploadInput) {
    photoUploadInput.value = "";
  }
  sync();
});
