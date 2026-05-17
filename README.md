# 🚀 AtomQuest Goals Portal

An enterprise-grade, high-performance internal B2B SaaS platform engineered for alignment, structural visibility, and quarterly performance governance. This portal replaces fragmented manual review cycles with a unified, real-time tracking architecture engineered around automated compliance guardrails, multi-role workspace isolation, and programmatic evaluation matrices.

Built for the **AtomQuest Hackathon 1.0** organized by **y company**.

---

## 🎨 Design System & Visual Philosophy
The application interfaces are built using the **AtomQuest Premium Enterprise Design Tokens**, prioritizing high data density without cognitive clutter. 

* **Color Palette:** Dominated by an icy, professional slate canvas background (`#F8F9FF`), absolute white functional work surfaces (`#FFFFFF`), and a high-contrast Interactive Blue (`#2563EB`) reserved strictly for primary execution paths, active states, and tactical highlights.
* **Typography Hierarchy:** Powered by **Plus Jakarta Sans** for crisp, geometric structural headers and **Inter** for highly legible, tabular numerical operational grids.
* **Rounded Geometry:** Modernized with smooth premium corner transitions using custom mitered contours (Inputs & Tags: `6px`, System Workspace Tables: `12px`, Analytic Card Panels: `16px`).

---
### Key Subsystems:
1. **Simulation Identity Controller:** A persistent, global drop-down selector HUD at the top-right header that allows hackathon evaluators to instantly switch runtime views among `Employee`, `Manager`, and `Admin/HR` personas without triggering database latency or page reloads.
2. **Goal Validation Core:** Front-end and back-end structural constraints checking active item arrays before unlocking the execution actions.
3. **Mathematical Evaluation Matrix:** Translates physical operational parameters into a progress matrix according to programmatic context (Min, Max, Timeline, Zero-based).

---

## ⚙️ Core Technical Specifications & Validation Rules

### 1. Phase 1 Constraints Execution
The **Employee Goal Creation Workspace** enforces strict operational controls in real-time. The system disables the primary "Submit for Approval" action and triggers an Amber-Orange warning alert container (`#FEF3C7`) until all the following assertions are satisfied:
* $\sum (\text{Goal Weightage}) \equiv 100\%$
* $\forall \text{ Individual Goal Weightage} \ge 10\%$
* $\text{Total Goal Array Count} \le 8$

Upon validation parity, the interface seamlessly renders a Success-Green banner (`#DCFCE7`) and activates the primary blue interactive button state.


🛠️ Step-by-Step Installation & Quickstart
To run the unified compiled build platform locally, execute the following commands in your preferred terminal workspace:

1. Clone & Position inside Project Directory
Bash

git clone <repository-link>
cd atomquest-portal
2. Install Project Dependencies
Installs Next.js runtime blocks, Tailwind utility styles, and Lucide React system typography vectors.

Bash

npm install
3. Spin up the Local Development Environment
Launches the server stack locally with hot-reloading configurations active.

Bash

npm run dev
Open your modern browser engine and point it to http://localhost:3000 to evaluate the interactive multi-persona portal flow.
