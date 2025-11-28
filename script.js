// JSON-LIKE CONFIG (KNOWLEDGE BASE)

// Base profiles per project type
const BASE_PROFILES = {
    personal: {
        label: "Personal / Side Project",
        frontend: ["React (or Next.js App Router)", "Vue.js", "Plain HTML/CSS/JS for very simple UIs"],
        backend: ["Node.js + Express", "Supabase / Firebase (BaaS)", "No dedicated backend for simple CRUD"],
        database: ["SQLite / Supabase Postgres", "Browser storage (localStorage/IndexedDB) for ultra-small apps"],
        deployment: ["Vercel", "Netlify", "Render (for full-stack)"],
        architecture: "Single repo, simple monolith. SPA or lightweight SSR if you care about SEO.",
        pros: [
            "Fast to build and deploy using managed services",
            "Simple DevOps – mostly git pushes and automatic deploys",
            "Free / low-cost infrastructure for early experiments",
            "Good ecosystem and tutorials for learning"
        ],
        cons: [
            "Not optimized for huge traffic or complex workflows",
            "Tight coupling between features in one codebase",
            "Risk of skipping testing / observability early"
        ]
    },
    "small-team": {
        label: "Small Team / Internal Tool",
        frontend: ["React + component library (MUI/Chakra)", "Next.js for internal dashboards"],
        backend: ["Node.js + Express / NestJS", "Python + FastAPI / Django"],
        database: ["PostgreSQL", "Redis for caching (optional)"],
        deployment: ["Render", "Railway", "DigitalOcean App Platform"],
        architecture: "Modular monolith: single deployable unit, clear module boundaries for auth, users, domain logic.",
        pros: [
            "Good balance of complexity vs control",
            "Can scale to tens of thousands of users before needing microservices",
            "Teams can iterate quickly with short feedback loops",
            "Straightforward CI/CD using GitHub Actions"
        ],
        cons: [
            "Requires basic DevOps and environment management",
            "Can become a “big ball of mud” if modules are not respected",
            "Migrations to microservices later need planning"
        ]
    },
    scalable: {
        label: "Scalable SaaS / Consumer App",
        frontend: ["Next.js (SSR/SSG + API routes)", "React SPA with backend API"],
        backend: ["Node.js (NestJS)", "Go", "Java (Spring Boot) for stricter environments"],
        database: ["PostgreSQL (primary)", "Redis (cache)", "Optional: Elastic / OpenSearch for search"],
        deployment: ["AWS (ECS / Fargate)", "GCP / GKE", "DigitalOcean Kubernetes"],
        architecture: "Start as a well-structured modular monolith or a small set of services. Use message queues and async jobs early.",
        pros: [
            "Built for growth and multi-tenant usage",
            "Can handle spikes and long-term expansion",
            "More options for observability, security, and SRE practices",
            "Easier to segregate responsibilities across teams"
        ],
        cons: [
            "Higher infra cost from day one",
            "DevOps / SRE skills become mandatory",
            "Onboarding complexity for new developers",
            "Easy to over-engineer for early-stage MVPs"
        ]
    },
    realtime: {
        label: "Real-Time Application",
        frontend: ["React / Next.js", "Vue with real-time state syncing"],
        backend: ["Node.js + Socket.io", "Go with WebSockets", "Elixir (Phoenix Channels) for heavy real-time"],
        database: ["PostgreSQL", "Redis (Pub/Sub)", "Optional: Time-series DB for metrics"],
        deployment: ["AWS / GCP", "Railway / Render for early stages"],
        architecture: "Thin HTTP API + separate real-time gateway using WebSockets. Use Redis or message queues for fan-out.",
        pros: [
            "Low-latency communication with users",
            "Designed for chat, live dashboards, gaming, or trading UIs",
            "Supports event-driven architecture from the beginning"
        ],
        cons: [
            "More complex debugging and monitoring",
            "State synchronization issues across clients and servers",
            "Higher infra usage even at moderate scale"
        ]
    },
    ecommerce: {
        label: "E-Commerce / Payments",
        frontend: ["Next.js (SEO + SSR)", "React / Vue storefront"],
        backend: ["Node.js (Medusa.js / custom)", "Python (Django)"],
        database: ["PostgreSQL", "Optional: Redis for carts / sessions"],
        deployment: ["AWS / DO / Render", "Specialized SaaS like Shopify for simpler use-cases"],
        architecture: "Core: orders, catalog, payments, inventory, users. Build around ACID transactions and strong audit trails.",
        pros: [
            "SEO-friendly storefronts",
            "Battle-tested integrations (Stripe, PayPal, Razorpay, etc.)",
            "Clear domain boundaries (cart, checkout, fulfillment)"
        ],
        cons: [
            "Security and compliance requirements (PCI, data protection)",
            "Failure scenarios are expensive (lost orders, double charges)",
            "High expectations on performance and UX"
        ]
    },
    social: {
        label: "Social / Community Platform",
        frontend: ["React + Next.js", "React Native / Expo for mobile"],
        backend: ["Node.js", "Python (Django/DRF)", "Go for performance-critical services"],
        database: ["PostgreSQL", "Redis", "Search engine (Elastic / OpenSearch)"],
        deployment: ["AWS / GCP with Kubernetes", "DigitalOcean Kubernetes"],
        architecture: "Feed, notifications, search, and media usually become separate services. Start monolith + background workers.",
        pros: [
            "Real-time interactions and growth potential",
            "Well-understood domain patterns (feed ranking, notifications)",
            "Natural fit for event-driven architecture"
        ],
        cons: [
            "Very high infra + product complexity at scale",
            "Content moderation, abuse, and legal risks",
            "Requires serious observability and incident response discipline"
        ]
    }
};

// Adjustments based on constraints (budget, skill, sensitivity, etc.)
const ADJUSTMENTS = {
    budget: {
        minimal: {
            deployment: ["Vercel (frontend)", "Netlify", "Render free tier"],
            notes: [
                "Prefer serverless or managed services with generous free tiers.",
                "Avoid self-managed Kubernetes early; that’s unnecessary overhead.",
                "Limit external SaaS costs; choose free monitoring/logging where possible."
            ]
        },
        moderate: {
            deployment: ["Render", "Railway", "DigitalOcean App Platform", "AWS Lightsail"],
            notes: [
                "Use managed Postgres plans instead of running databases manually.",
                "Consider separate staging and production environments.",
                "Budget a small amount for observability (e.g., Sentry, basic APM)."
            ]
        },
        high: {
            deployment: ["AWS (ECS/EKS)", "GCP", "Azure"],
            notes: [
                "You can afford multi-environment setups with dedicated staging, UAT, and production.",
                "Introduce Kubernetes or ECS with autoscaling from the beginning.",
                "Add stronger observability stack (Prometheus/Grafana, DataDog, New Relic)."
            ]
        }
    },
    teamSkill: {
        "solo-junior": {
            architecture: "Keep a single repo and monolithic architecture. Avoid microservices, message queues, and Kubernetes until necessary.",
            devops: [
                "Use Vercel/Netlify for frontend and Render/Railway for backend.",
                "Start with a single Postgres database and simple environment variables.",
                "Use GitHub Actions only for basic build + deploy, if at all."
            ]
        },
        "small-fullstack": {
            architecture: "Modular monolith with well-defined boundaries per domain (auth, billing, core domain, reporting).",
            devops: [
                "Introduce basic CI (lint, tests) before deploy.",
                "Use infrastructure-as-code later (Pulumi/Terraform) once stack stabilizes.",
                "Create explicit staging environment mirroring production."
            ]
        },
        experienced: {
            architecture: "Start with modular monolith but design seams for future services (auth, billing, async jobs). Use message queues where it clearly helps.",
            devops: [
                "Automate CI/CD from day one with GitHub Actions or GitLab CI.",
                "Set up IaC (Terraform/Pulumi) and secrets management (SSM, Vault).",
                "Introduce metrics, tracing, and log aggregation early."
            ]
        }
    },
    dataSensitivity: {
        low: {
            security: [
                "Use OAuth or password auth with a proven library.",
                "Enforce HTTPS everywhere (via managed hosting).",
                "Rotate secrets periodically and avoid committing them to git."
            ]
        },
        medium: {
            security: [
                "Use battle-tested auth (e.g., Auth0, Clerk, NextAuth, Django auth).",
                "Encrypt data at rest (most managed DBs handle this, but verify).",
                "Implement basic rate limiting and brute-force protection on auth.",
                "Log access to sensitive endpoints for audit purposes."
            ]
        },
        high: {
            security: [
                "Segregate sensitive data into separate services or schemas.",
                "Harden authentication: MFA, device checks, session management.",
                "Regular security reviews, dependency scanning, and patching.",
                "Plan for compliance requirements (PCI, HIPAA-like regimes where applicable)."
            ]
        }
    }
};

// Generic checklist items
const CHECKLIST_BASE = [
    "Define 3–5 core user journeys and success metrics (sign-ups, activations, paid conversions).",
    "Sketch information architecture and key screens before coding.",
    "Create a single git repo and branch strategy (e.g., main + feature branches).",
    "Set up environment variable management (local .env + secrets in hosting provider).",
    "Add basic error boundaries and logging on the frontend and backend."
];

const CHECKLIST_BY_TYPE = {
    personal: [
        "Keep infrastructure minimal; prioritize learning speed over perfect architecture.",
        "Avoid premature optimization. Deploy something small in the first week.",
        "Integrate basic analytics (privacy-friendly if possible)."
    ],
    "small-team": [
        "Define owners for modules (auth, billing, core domain).",
        "Introduce code review and CI checks before merging.",
        "Create a simple runbook: how to deploy, rollback, and debug incidents."
    ],
    scalable: [
        "Decide early on multi-tenant vs single-tenant architecture.",
        "Introduce background job processing for heavy tasks (emails, exports).",
        "Design a migration strategy for schema changes without downtime."
    ],
    realtime: [
        "Decide how you will handle dropped WebSocket connections and reconnection.",
        "Centralize real-time events into an event bus or Redis Pub/Sub.",
        "Simulate load for concurrent users early to avoid surprises."
    ],
    ecommerce: [
        "Run test transactions in sandbox for each payment provider.",
        "Implement idempotency keys for payment-related endpoints.",
        "Define refund, dispute, and chargeback flows from day one."
    ],
    social: [
        "Design privacy controls and content visibility rules clearly.",
        "Plan for abuse reporting and moderation tooling early.",
        "Consider a long-term data retention strategy (especially for media)."
    ]
};

// Common pitfalls by dimension
const PITFALLS = [
    "Choosing a ‘cool’ stack your team cannot maintain long-term.",
    "Skipping automated tests completely, leading to fear of shipping.",
    "Overusing microservices too early; exploding deployment and debugging complexity.",
    "Ignoring performance budgets and letting bundle sizes grow uncontrolled.",
    "Treating security as an afterthought instead of an ongoing practice.",
    "Not planning for technical debt; never scheduling refactor time."
];

// Utility: simple deep clone
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Map qualitative values to numeric scores (0–100) for bars
function scoreComplexity(complexity) {
    switch (complexity) {
        case "simple":
            return 25;
        case "moderate":
            return 55;
        case "complex":
            return 85;
        default:
            return 50;
    }
}

function scoreCost(budget) {
    switch (budget) {
        case "minimal":
            return 20;
        case "moderate":
            return 50;
        case "high":
            return 80;
        default:
            return 40;
    }
}

function scoreRisk(dataSensitivity, traffic) {
    let base = 20;
    if (dataSensitivity === "medium") base += 20;
    if (dataSensitivity === "high") base += 40;
    if (traffic === "medium") base += 10;
    if (traffic === "high") base += 20;
    return Math.min(base, 95);
}

// BUILD RECOMMENDATION MODEL

function buildRecommendationModel(formData) {
    const {
        projectType,
        complexity,
        performance,
        budget,
        teamSkill,
        dataSensitivity,
        traffic,
        timeline,
        goal,
        aiAssistance,
        description
    } = formData;

    const baseProfile = deepClone(
        BASE_PROFILES[projectType] || BASE_PROFILES.personal
    );

    // Attach core label
    const title = `${baseProfile.label} – ${complexity.toUpperCase()} / ${performance
        .replace("-", " ")
        .toUpperCase()}`;

    // Determine architecture emphasis
    const skillAdjust = ADJUSTMENTS.teamSkill[teamSkill] || {};
    const budgetAdjust = ADJUSTMENTS.budget[budget] || {};
    const securityAdjust = ADJUSTMENTS.dataSensitivity[dataSensitivity] || {};

    let architectureSummary = baseProfile.architecture;
    if (skillAdjust.architecture) {
        architectureSummary = skillAdjust.architecture;
    }

    if (projectType === "scalable" && goal === "long-term") {
        architectureSummary +=
            " Favor clear domain modules and early separation of concerns. Use asynchronous processing (queues, workers) for slow operations.";
    }

    if (projectType === "personal" && goal === "ship-fast") {
        architectureSummary +=
            " Cut anything non-essential. Use opinionated frameworks and hosted DBs to move quickly.";
    }

    // AI Assistance Adjustments
    if (aiAssistance === "agents") {
        architectureSummary += " Design for agentic workflows: keep context clear, use modular files, and ensure strong typing to help agents reason about code.";
    }

    // DevOps guidance
    const devopsGuidance = skillAdjust.devops || [
        "Use your hosting provider’s built-in CI/CD or GitHub Actions.",
        "Add basic health checks and uptime monitoring.",
        "Keep deployments simple: one environment to start, then add staging."
    ];

    if (aiAssistance === "agents") {
        devopsGuidance.push("Setup agentic workflows (e.g., automated PR reviews, test generation, and self-healing scripts).");
    } else if (aiAssistance === "vibe") {
        devopsGuidance.push("Leverage AI copilots for rapid iteration, but ensure human review for security critical paths.");
    }

    // Extend deployment with budget-based hosts
    const deploymentStack = Array.from(
        new Set([...baseProfile.deployment, ...budgetAdjust.deployment])
    );

    // Security notes
    const securityNotes = securityAdjust.security || [
        "Use managed auth providers or battle-tested libraries.",
        "Keep all communication over HTTPS.",
        "Rotate secrets and never commit them to version control."
    ];

    // Checklist
    const checklist = [
        ...CHECKLIST_BASE,
        ...(CHECKLIST_BY_TYPE[projectType] || [])
    ];

    if (aiAssistance !== "none") {
        checklist.push("Configure AI tools (Cursor, Windsurf, GitHub Copilot) with project-specific context rules.");
        checklist.push("Establish a 'human-in-the-loop' review process for AI-generated code.");
    }

    // Metrics
    const metrics = {
        complexityScore: scoreComplexity(complexity),
        costScore: scoreCost(budget),
        riskScore: scoreRisk(dataSensitivity, traffic)
    };

    // Trade-offs (pros / cons)
    const pros = baseProfile.pros || [];
    const cons = baseProfile.cons || [];

    // Description for context (optional)
    const context = description && description.trim().length > 0 ? description.trim() : null;

    return {
        title,
        profileLabel: baseProfile.label,
        projectType,
        complexity,
        performance,
        budget,
        teamSkill,
        dataSensitivity,
        traffic,
        timeline,
        goal,
        context,
        frontend: baseProfile.frontend,
        backend: baseProfile.backend,
        database: baseProfile.database,
        deployment: deploymentStack,
        architectureSummary,
        devopsGuidance,
        securityNotes,
        checklist,
        metrics,
        pros,
        cons,
        budgetNotes: budgetAdjust.notes || [],
        pitfalls: PITFALLS
    };
}

// RENDERING

function renderRecommendation(model) {
    const {
        title,
        profileLabel,
        projectType,
        complexity,
        performance,
        budget,
        teamSkill,
        dataSensitivity,
        traffic,
        timeline,
        goal,
        context,
        frontend,
        backend,
        database,
        deployment,
        architectureSummary,
        devopsGuidance,
        securityNotes,
        checklist,
        metrics,
        pros,
        cons,
        budgetNotes,
        pitfalls
    } = model;

    const complexityLabel = complexity.charAt(0).toUpperCase() + complexity.slice(1);
    const perfLabel = {
        "not-critical": "Low",
        important: "Medium",
        critical: "High"
    }[performance] || performance;

    // Main stack & trade-offs card
    const stackCard = `
        <article class="card">
            <div class="card-header">
                <div class="card-title">
                    <span>🧩</span>
                    <div>
                        ${title}
                        <div class="card-meta">
                            ${profileLabel} • Complexity: ${complexityLabel} • Performance priority: ${perfLabel}
                        </div>
                    </div>
                </div>
                <div class="pill">
                    <span class="pill-dot green"></span>
                    <span>${goal === "ship-fast" ? "Optimize for speed" : goal === "long-term" ? "Optimize for robustness" : "Balanced"}</span>
                </div>
            </div>

            <div class="card-body-grid">
                <div>
                    <div class="stack-group">
                        <div class="stack-label">Frontend</div>
                        <div class="stack-items">
                            ${frontend.map(t => `<span class="tech-badge">${t}</span>`).join("")}
                        </div>
                    </div>

                    <div class="stack-group">
                        <div class="stack-label">Backend</div>
                        <div class="stack-items">
                            ${backend.map(t => `<span class="tech-badge">${t}</span>`).join("")}
                        </div>
                    </div>

                    <div class="stack-group">
                        <div class="stack-label">Database & Storage</div>
                        <div class="stack-items">
                            ${database.map(t => `<span class="tech-badge">${t}</span>`).join("")}
                        </div>
                    </div>

                    <div class="stack-group">
                        <div class="stack-label">Deployment</div>
                        <div class="stack-items">
                            ${deployment.map(t => `<span class="tech-badge">${t}</span>`).join("")}
                        </div>
                    </div>
                </div>

                <div>
                    <div class="section-title-sm">Why this stack works for you</div>
                    <p class="section-text">
                        Selected based on your project type, performance needs, budget, and team skill. 
                        It balances maintainability, ecosystem maturity, and available hosting options.
                    </p>

                    <div class="pros-cons">
                        <div class="pros">
                            <h4>Benefits</h4>
                            <ul>
                                ${pros.map(p => `<li>${p}</li>`).join("")}
                            </ul>
                        </div>
                        <div class="cons">
                            <h4>Trade-offs</h4>
                            <ul>
                                ${cons.map(c => `<li>${c}</li>`).join("")}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="metrics-row">
                <div class="metric">
                    <div class="metric-label">Implementation Complexity</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${metrics.complexityScore}%;"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">Infra Cost Level</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${metrics.costScore}%;"></div>
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">Risk & Security Sensitivity</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${metrics.riskScore}%;"></div>
                    </div>
                </div>
            </div>
        </article>
    `;

    // Architecture & deployment strategy
    const architectureCard = `
        <article class="card">
            <div class="card-header">
                <div class="card-title">
                    <span>🏗️</span>
                    <div>
                        Architecture & Deployment Blueprint
                        <div class="card-meta">
                            ${projectType} • Team: ${teamSkill} • Timeline: ${timeline}
                        </div>
                    </div>
                </div>
                <div class="pill">
                    <span class="pill-dot amber"></span>
                    <span>Start simple, evolve later</span>
                </div>
            </div>

            <div class="section-title-sm">High-level architecture</div>
            <p class="section-text">${architectureSummary}</p>

            <div class="block-note">
                <strong>Deployment Strategy (first 60–90 days):</strong><br>
                1) Start with a single production environment using ${deployment[0] || "a managed host"} and a managed Postgres instance.<br>
                2) Wire up CI/CD so that merges to <code>main</code> trigger deploys.<br>
                3) Add a staging environment once your release cadence stabilizes.<br>
                4) Introduce background workers and queues only when there is a clear need (slow tasks, heavy jobs).
            </div>

            ${budgetNotes.length
            ? `<div class="section-title-sm" style="margin-top: 10px;">Budget-aware infra notes</div>
                       <ul class="checklist">
                           ${budgetNotes.map(n => `<li><span>•</span><div>${n}</div></li>`).join("")}
                       </ul>`
            : ""
        }
        </article>
    `;

    // DevOps, security & risks
    const opsCard = `
        <article class="card">
            <div class="card-header">
                <div class="card-title">
                    <span>🛡️</span>
                    <div>
                        DevOps, Security & Risk
                        <div class="card-meta">
                            Data sensitivity: ${dataSensitivity.toUpperCase()} • Traffic: ${traffic.toUpperCase()}
                        </div>
                    </div>
                </div>
                <div class="pill">
                    <span class="pill-dot red"></span>
                    <span>Avoid hidden technical debt</span>
                </div>
            </div>

            <div class="card-body-grid">
                <div>
                    <div class="section-title-sm">DevOps & workflow</div>
                    <ul class="checklist">
                        ${devopsGuidance.map(item => `<li><span>•</span><div>${item}</div></li>`).join("")}
                    </ul>

                    <div class="section-title-sm" style="margin-top: 10px;">Security focus areas</div>
                    <ul class="checklist">
                        ${securityNotes.map(item => `<li><span>•</span><div>${item}</div></li>`).join("")}
                    </ul>
                </div>
                <div>
                    <div class="section-title-sm">Common pitfalls for this profile</div>
                    <ul class="checklist">
                        ${pitfalls.map(p => `<li><span>⚠</span><div>${p}</div></li>`).join("")}
                    </ul>
                </div>
            </div>
        </article>
    `;

    // Checklist & learning path
    const checklistCard = `
        <article class="card">
            <div class="card-header">
                <div class="card-title">
                    <span>✅</span>
                    <div>
                        Getting Started Checklist & Learning Path
                        <div class="card-meta">
                            Use this as a linear path from idea → running app.
                        </div>
                    </div>
                </div>
                <div class="pill">
                    <span class="pill-dot green"></span>
                    <span>Execution roadmap</span>
                </div>
            </div>

            ${context
            ? `<div class="section-title-sm">Your project context</div>
                       <p class="section-text">${context}</p>`
            : ""
        }

            <div class="section-title-sm" style="margin-top: 8px;">Execution checklist</div>
            <ul class="checklist">
                ${checklist.map(item => `<li><span>☑</span><div>${item}</div></li>`).join("")}
            </ul>

            <div class="section-title-sm" style="margin-top: 10px;">Recommended learning order</div>
            <ul class="checklist">
                <li><span>1</span><div>Frontend: Focus on one framework (${frontend[0]}). Learn routing, state, and API calls.</div></li>
                <li><span>2</span><div>Backend: Learn your chosen backend (${backend[0]}), including API design and auth basics.</div></li>
                <li><span>3</span><div>Database: Understand modeling in ${database[0]} and basic migrations.</div></li>
                <li><span>4</span><div>Deployment: Deploy a minimal vertical slice (one user journey end-to-end).</div></li>
                <li><span>5</span><div>Quality: Add tests (unit + a few integration), logging, and basic monitoring.</div></li>
            </ul>
        </article>
    `;

    return stackCard + architectureCard + opsCard + checklistCard;
}

// FORM HANDLERS

function readFormData() {
    return {
        projectType: document.getElementById("projectType").value,
        complexity: document.getElementById("complexity").value,
        performance: document.getElementById("performance").value,
        timeline: document.getElementById("timeline").value,
        budget: document.getElementById("budget").value,
        teamSkill: document.getElementById("teamSkill").value,
        dataSensitivity: document.getElementById("dataSensitivity").value,
        traffic: document.getElementById("traffic").value,
        goal: document.getElementById("goal").value,
        aiAssistance: document.getElementById("aiAssistance").value,
        description: document.getElementById("description").value
    };
}

function validateForm(data) {
    const requiredFields = [
        "projectType",
        "complexity",
        "performance",
        "timeline",
        "budget",
        "teamSkill",
        "dataSensitivity",
        "traffic",
        "goal",
        "aiAssistance"
    ];
    return requiredFields.every((k) => data[k] && data[k].trim() !== "");
}

function showLoading(state) {
    const form = document.getElementById("projectForm");
    const results = document.getElementById("resultsContainer");
    if (state) {
        form.classList.add("loading");
        results.classList.add("loading");
    } else {
        form.classList.remove("loading");
        results.classList.remove("loading");
    }
}

function resetResults() {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h2>No recommendation yet</h2>
            <p>
                Fill the form on the left and get:
            </p>
            <ul class="empty-state-list">
                <li>Suggested frontend, backend, database, and deployment stack</li>
                <li>Architecture blueprint (monolith vs modular vs microservices)</li>
                <li>DevOps & workflow recommendations (Git, CI/CD, environments)</li>
                <li>Security, risk, and technical-debt considerations</li>
                <li>Actionable startup checklist to move from “idea” to “running app”</li>
            </ul>
        </div>
    `;
}

// INIT

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("projectForm");
    const resetBtn = document.getElementById("resetBtn");
    const resultsContainer = document.getElementById("resultsContainer");
    resetResults();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = readFormData();

        if (!validateForm(data)) {
            alert("Please fill all the required fields before generating a recommendation.");
            return;
        }

        showLoading(true);

        // Simulate “thinking” quickly without async
        const model = buildRecommendationModel(data);
        const html = renderRecommendation(model);
        resultsContainer.innerHTML = html;

        showLoading(false);
    });

    resetBtn.addEventListener("click", () => {
        setTimeout(() => {
            resetResults();
        }, 0);
    });
});
