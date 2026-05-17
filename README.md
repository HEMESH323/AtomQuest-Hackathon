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

### 2. Phase 2 Progress Formulas
The **Manager Evaluation Dashboard** and **Check-in Modules** calculate performance indexes using distinct algorithmic routines tailored by the **Unit of Measurement (UoM)**:

$$\n\\begin{array}{|l|l|l|}\n\\hline\n\\textbf{UoM Type} & \\textbf{Strategic Vector} & \\textbf{Algorithmic Formula} \\\\ \\hline\n\\text{Min (Numeric / \\%)} & \\text{Higher is better (e.g., Sales Revenue)} & \\text{Progress} = \\frac{\\text{Actual Achievement}}{\\text{Planned Target}} \\times 100 \\\\ \\hline\n\\text{Max (Numeric / \\%)} & \\text{Lower is better (e.g., Turnaround Time)} & \\text{Progress} = \\frac{\\text{Planned Target}}{\\text{Actual Achievement}} \\times 100 \\\\ \\hline\n\\text{Timeline} & \\text{Milestone Date Target Compliance} & \\text{If (Completion Date} \\le \\text{Deadline) } 100\\%, \\text{ else } 0\\% \\\\ \\hline\n\\text{Zero} & \\text{Absolute Incident Suppression} & \\text{If (Actual } == 0) \\, 100\\%, \\text{ else } 0\\% \\\\ \\hline\n\\end{array}\n$$


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
