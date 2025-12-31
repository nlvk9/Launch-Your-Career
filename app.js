// 1. DATA CONFIGURATION
const fields = ["name", "title", "links", "edu", "exp", "proj", "skills"];
const defaults = {
  name: "YOUR NAME",
  title: "STEM Professional",
  links: "GitHub | LinkedIn | Portfolio",
};

// 2. CORE LOGIC
function updatePreview() {
  fields.forEach((f) => {
    const val = document.getElementById(`in-${f}`).value;
    document.getElementById(`out-${f}`).innerText = val || defaults[f] || "";
    localStorage.setItem(`in-${f}`, val);
  });
}

function autoBullet(e) {
  const el = e.target;
  if (el.value === "" && e.key.length === 1) {
    el.value = "• ";
  }

  if (e.key === "Enter") {
    e.preventDefault();
    const pos = el.selectionStart;
    el.value = el.value.slice(0, pos) + "\n• " + el.value.slice(pos);
    el.selectionStart = el.selectionEnd = pos + 3;
    updatePreview();
  }
}

// 3. NAVIGATION & DATA MGMT
function navigateTo(id) {
  // Save the current page to localStorage
  localStorage.setItem("activePage", id);

  document
    .querySelectorAll(".page-section, .nav-links li")
    .forEach((el) => el.classList.remove("active"));

  document.getElementById(id).classList.add("active");

  // Select the specific nav li that has the onclick for this id
  const navItem = document.querySelector(`[onclick*="${id}"]`);
  if (navItem) navItem.classList.add("active");
}

function clearData() {
  if (confirm("Clear all progress?")) {
    fields.forEach((f) => (document.getElementById(`in-${f}`).value = ""));
    localStorage.clear();
    updatePreview();
  }
}

function loadSample() {
  const sample = {
    name: "JOHN DOE",
    title: "Software Engineer | Full-Stack Developer",
    links:
      "johndoe@email.com | (555) 012-3456 | github.com/johndoe | linkedin.com/in/johndoe",
    edu: "STATE UNIVERSITY OF TECHNOLOGY — BS in Computer Science | GPA: 3.85 | May 2026\nRelevant Coursework: Data Structures, Systems Programming, Databases, Web Architecture",
    exp: "SOFTWARE ENGINEERING INTERN | Global Tech Solutions\nMay 2024 – August 2024\n• Optimized API response times by 35% via SQL refactoring for 10k daily users.\n• Developed 15+ reusable React components, reducing dev time for new features by 25%.\n• Collaborated in an Agile team of 5 to deliver a core beta feature 2 weeks ahead of schedule.\n\nTECHNICAL ASSISTANT | University IT Department\nSeptember 2023 – April 2024\n• Resolved 200+ hardware/software tickets monthly with a 98% user satisfaction rating.\n• Automated system backups using Python, saving 10 manual labor hours per week.",
    proj: "STEM-CRAFT CAREER PORTAL | Node.js, MongoDB, React\n• Built a full-stack app for 500+ students to track internship applications and interview stages.\n• Integrated AWS S3 and CloudFront for secure, low-latency resume storage and retrieval.\n\nAUTONOMOUS PATHFINDER | C++, Robotics\n• Engineered a path-finding algorithm for a robot, achieving 92% obstacle avoidance.\n• Implemented Kalman filters to process sensor data, increasing navigation precision by 15%.",
    skills:
      "LANGUAGES: Python, Java, C++, TypeScript, SQL, HTML/CSS, Go, Shell\nFRAMEWORKS: React, Node.js, Express, Tailwind CSS, Django, FastAPI\nTOOLS: Git, Docker, AWS (S3, EC2), Linux, Postman, Kubernetes, Jenkins\nSOFT SKILLS: Agile/Scrum, Technical Writing, Mentorship, Problem Solving",
  };

  fields.forEach((f) => {
    const el = document.getElementById(`in-${f}`);
    if (el) {
      el.value = sample[f];
      localStorage.setItem(`in-${f}`, sample[f]);
    }
  });
  updatePreview();
}

function loadData() {
  fields.forEach((f) => {
    const el = document.getElementById(`in-${f}`);
    if (el) el.value = localStorage.getItem(`in-${f}`) || "";
  });
  updatePreview();
}

function scanATS() {
  const jobText = document
    .getElementById("job-description")
    .value.toLowerCase();

  // Combine all resume fields into one searchable string
  const resumeText = fields
    .map((f) => document.getElementById(`in-${f}`).value || "")
    .join(" ")
    .toLowerCase();

  if (!jobText.trim()) {
    alert("Please paste a job description first!");
    return;
  }

  if (!resumeText.trim()) {
    alert("Please add resume content before scanning.");
    return;
  }

  // 1. Identify potential keywords
  const commonWords = new Set([
    "this",
    "that",
    "with",
    "from",
    "their",
    "requirements",
    "responsibilities",
    "experience",
    "ability",
    "preferred",
  ]);

  const jobWords = jobText.match(/\b(\w+)\b/g) || [];

  const keywords = [...new Set(jobWords)].filter(
    (word) => word.length > 3 && !commonWords.has(word)
  );

  let matches = 0;
  let missing = [];

  keywords.forEach((word) => {
    if (resumeText.includes(word)) {
      matches++;
    } else if (missing.length < 5) {
      missing.push(word);
    }
  });

  const score = keywords.length
    ? Math.round((matches / keywords.length) * 100)
    : 0;

  const resultsDiv = document.getElementById("ats-results");
  const scoreEl = document.getElementById("ats-score");
  const feedbackEl = document.getElementById("ats-feedback");

  resultsDiv.classList.remove("hidden");

  scoreEl.innerText = `${score}%`;
  scoreEl.style.color =
    score > 70 ? "var(--success)" : score > 40 ? "#f9e2af" : "#f38ba8";

  feedbackEl.innerHTML =
    score === 100
      ? "Great match! Your resume aligns well with this role."
      : `Try adding keywords like: <strong>${missing.join(", ")}</strong>`;
}

window.onload = loadData;
