const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const users = [
  {
    id: "u1",
    name: "Maria Santos",
    email: "admin@cienciayamorchurch.org",
    password: "password123",
    role: "Admin",
    district: "Central",
  },
  {
    id: "u2",
    name: "Board Secretary",
    email: "board@cienciayamorchurch.org",
    password: "password123",
    role: "Board of Directors",
    district: "All",
  },
  {
    id: "u3",
    name: "Jose Reyes",
    email: "treasury@cienciayamorchurch.org",
    password: "password123",
    role: "Treasury Officer",
    district: "All",
  },
  {
    id: "u4",
    name: "Ana Cruz",
    email: "districtleader@cienciayamorchurch.org",
    password: "password123",
    role: "District Leader",
    district: "North District",
  },
];

const districts = ["Central", "North District", "South District", "East District", "West District"];
const ministries = ["Youth", "Families", "Outreach", "Education", "Worship", "Board"];
const categories = [
  "Seminar",
  "District Activity",
  "Holiday Outreach",
  "Training",
  "Celebration",
  "Community Program",
];
const expenseCategories = [
  "Food",
  "Transportation",
  "Venue",
  "Accommodation",
  "Honorarium",
  "Materials",
  "Printing",
  "Supplies",
  "Emergency fund",
  "Other",
];

let state = {
  currentUser: JSON.parse(localStorage.getItem("cya-user") || "null"),
  page: location.hash.replace("#", "") || "dashboard",
  filters: {},
  dashboardExpenseType: "All",
  dashboardExpenseActivity: "All",
  selectedActivityId: "a2",
  uploadPreview: "",
  mockExtraction: null,
  activities: [
    activity("a1", "Annual Church Planning", "Board", "Central", "Board Secretary", "2026-01-12", "2026-01-12", "Main Sanctuary", 65, "Completed", 85000, 79600),
    activity("a2", "Youth Leadership Seminar", "Youth", "North District", "Ana Cruz", "2026-03-08", "2026-03-09", "Retreat Center", 120, "Approved", 145000, 118500),
    activity("a3", "District Fellowship", "District Activity", "South District", "Pedro Lim", "2026-04-19", "2026-04-19", "South Hall", 180, "Ongoing", 62000, 59000),
    activity("a4", "Holiday Outreach Program", "Holiday Outreach", "East District", "Liza Garcia", "2026-12-18", "2026-12-18", "Barangay Covered Court", 260, "Planned", 175000, 0),
    activity("a5", "Family Day", "Families", "West District", "Ramon Dela Cruz", "2026-05-24", "2026-05-24", "City Park", 220, "Pending Approval", 98000, 0),
    activity("a6", "Bible Study Training", "Training", "Central", "Mina Lopez", "2026-06-14", "2026-06-15", "Education Wing", 75, "Approved", 54000, 48200),
    activity("a7", "Thanksgiving Celebration", "Celebration", "Central", "Choir Ministry", "2026-11-22", "2026-11-22", "Main Sanctuary", 350, "Approved", 210000, 222500),
    activity("a8", "Community Feeding Program", "Community Program", "North District", "Ana Cruz", "2026-08-02", "2026-08-02", "Riverside Community Center", 300, "Approved", 132000, 86500),
  ],
  fundReleases: [
    release("fr1", "a2", 90000, "2026-02-20", "Ana Cruz", "Bank transfer", "BT-2026-044"),
    release("fr2", "a6", 40000, "2026-05-28", "Mina Lopez", "Cash", "CV-2026-108"),
    release("fr3", "a8", 100000, "2026-07-08", "Ana Cruz", "Bank transfer", "BT-2026-219"),
  ],
  expenses: [
    expense("e1", "a2", "Food", "Carmela Catering", "OR-8831", "2026-03-08", 64200, "Approved"),
    expense("e2", "a2", "Materials", "PrintWorks", "INV-1024", "2026-03-03", 18300, "Approved"),
    expense("e3", "a6", "Printing", "GoodPrint", "INV-2209", "2026-06-12", 12200, "Pending Treasury Review"),
    expense("e4", "a7", "Food", "Fiesta Kitchen", "OR-5090", "2026-11-22", 142500, "Approved"),
    expense("e5", "a8", "Supplies", "Community Mart", "CM-778", "2026-07-28", 31000, "Submitted"),
  ],
  liquidationReports: [
    {
      id: "lr1",
      activityId: "a1",
      summary: "Annual planning completed with approved ministry calendars and budget guidance.",
      attendees: 63,
      amountReturned: 5400,
      issues: "None",
      recommendations: "Keep early budget workshops for each district.",
      status: "Approved",
      submittedBy: "Board Secretary",
      submittedDate: "2026-01-18",
    },
  ],
  notifications: [
    note("Budget approved", "Youth Leadership Seminar budget was approved by Treasury.", "u4"),
    note("Report due", "Bible Study Training liquidation is due in 7 days.", "u3"),
    note("Expense submitted", "Community Feeding Program has a receipt waiting for review.", "u3"),
  ],
  auditLogs: [
    log("Maria Santos", "Admin", "Created annual event category", "ActivityCategory: Holiday Outreach"),
    log("Jose Reyes", "Treasury Officer", "Recorded fund release", "FundRelease: Youth Leadership Seminar"),
    log("Ana Cruz", "District Leader", "Uploaded receipt", "Expense: Community Feeding Program"),
    log("Board Secretary", "Board of Directors", "Approved activity budget", "Activity: Annual Church Planning"),
  ],
};

function activity(id, title, category, district, leader, start, end, venue, participants, status, approvedBudget, actualExpense) {
  const proposedBudget = Math.round(approvedBudget * 1.08);
  return {
    id,
    title,
    description: `${title} for church members and community partners.`,
    category,
    ministry: ministries.includes(category) ? category : "Outreach",
    district,
    leader,
    start,
    end,
    venue,
    participants,
    status,
    budgetStatus: status === "Pending Approval" ? "Pending" : "Approved",
    reportStatus: status === "Completed" ? "Submitted" : "Pending",
    fundingSource: "Annual church fund",
    proposedBudget,
    approvedBudget,
    actualExpense,
    lineItems: [
      { category: "Food", description: "Meals and refreshments", forecast: Math.round(approvedBudget * 0.42), approved: Math.round(approvedBudget * 0.4) },
      { category: "Materials", description: "Program supplies", forecast: Math.round(approvedBudget * 0.25), approved: Math.round(approvedBudget * 0.22) },
      { category: "Transportation", description: "Participant transport", forecast: Math.round(approvedBudget * 0.18), approved: Math.round(approvedBudget * 0.18) },
      { category: "Other", description: "Contingency and admin", forecast: Math.round(approvedBudget * 0.15), approved: Math.round(approvedBudget * 0.2) },
    ],
  };
}

function expense(id, activityId, category, vendor, invoiceNo, date, amount, status) {
  return {
    id,
    activityId,
    category,
    vendor,
    invoiceNo,
    date,
    amount,
    tax: Math.round(amount * 0.12),
    description: `${category} expense`,
    paymentMethod: "Cash",
    paidBy: "Activity facilitator",
    remarks: "Uploaded receipt placeholder",
    status,
    attachment: "Receipt image/PDF placeholder",
    extracted: true,
  };
}

function release(id, activityId, amount, date, releasedTo, method, reference) {
  return { id, activityId, amount, date, releasedTo, method, reference, remarks: "Approved activity fund release" };
}

function note(title, body, userId) {
  return { id: crypto.randomUUID(), title, body, userId, date: new Date().toISOString() };
}

function log(user, role, action, record) {
  return {
    id: crypto.randomUUID(),
    user,
    role,
    action,
    record,
    previous: "Pending",
    next: "Updated",
    date: new Date().toLocaleString(),
  };
}

const rolePages = {
  Admin: ["dashboard", "calendar", "activities", "create-activity", "budgets", "funds", "expenses", "upload", "review", "liquidation", "create-liquidation", "reports", "transparency", "users", "districts", "audit", "settings", "profile"],
  "Board of Directors": ["dashboard", "calendar", "activities", "budgets", "funds", "liquidation", "reports", "transparency", "profile"],
  "Treasury Officer": ["dashboard", "calendar", "activities", "budgets", "funds", "expenses", "review", "liquidation", "reports", "transparency", "audit", "profile"],
  "District Leader": ["dashboard", "calendar", "activities", "create-activity", "expenses", "upload", "liquidation", "create-liquidation", "reports", "profile"],
};

const navItems = [
  ["dashboard", "Home", "H"],
  ["calendar", "Calendar", "C"],
  ["activities", "Activities", "A"],
  ["create-activity", "New Activity", "+"],
  ["budgets", "Budgets", "B"],
  ["funds", "Fund Releases", "F"],
  ["expenses", "Expenses", "E"],
  ["upload", "Upload Receipt", "U"],
  ["review", "Expense Review", "R"],
  ["liquidation", "Liquidation", "L"],
  ["create-liquidation", "New Report", "N"],
  ["reports", "Reports", "P"],
  ["transparency", "Transparency", "T"],
  ["users", "Users & Roles", "M"],
  ["districts", "Districts", "D"],
  ["audit", "Audit Logs", "O"],
  ["settings", "Settings", "S"],
];

window.addEventListener("hashchange", () => {
  state.page = location.hash.replace("#", "") || "dashboard";
  render();
});

function saveSession(user) {
  state.currentUser = user;
  localStorage.setItem("cya-user", JSON.stringify(user));
}

function render() {
  if (!state.currentUser) {
    renderLogin();
    return;
  }
  if (!rolePages[state.currentUser.role].includes(state.page)) state.page = "dashboard";
  document.querySelector("#app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">${brand()}${nav()}</aside>
      <main class="content">
        ${topbar()}
        ${pageBody()}
      </main>
      ${bottomNav()}
    </div>
  `;
  bindGlobal();
}

function renderLogin() {
  document.querySelector("#app").innerHTML = `
    <main class="login-shell">
      <section class="login-panel">
        <div class="login-story">
          <p class="eyebrow">Financial transparency portal</p>
          <h1>Ciencia Y Amor Church Events</h1>
          <p>Manage annual activities, approved budgets, released funds, receipt validation, liquidation reports, and board-ready financial summaries in one mobile-friendly workspace.</p>
        </div>
        <form class="login-form" id="loginForm">
          <h2>Sign in</h2>
          <p style="color: var(--muted); line-height: 1.5;">Use one of the sample accounts to view the portal by role.</p>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" value="admin@cienciayamorchurch.org" required />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" type="password" value="password123" required />
          </div>
          <button class="button" type="submit">Sign in</button>
          <button class="button ghost" type="button" id="forgotBtn" style="margin-left: 8px;">Forgot password</button>
          <div class="quick-logins">
            ${users.map((user) => `<button type="button" data-login="${user.email}"><strong>${user.role}</strong><br><small>${user.email}</small></button>`).join("")}
          </div>
        </form>
      </section>
    </main>
  `;
  document.querySelector("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const user = users.find((item) => item.email === email && item.password === password);
    if (!user) return alert("Please use one of the sample accounts. Password is password123.");
    saveSession(user);
    addAudit("User login", `User: ${user.email}`);
    render();
  });
  document.querySelectorAll("[data-login]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#email").value = button.dataset.login;
      document.querySelector("#password").value = "password123";
    });
  });
  document.querySelector("#forgotBtn").addEventListener("click", () => {
    alert("Password reset email placeholder. Connect this later to your authentication provider.");
  });
}

function brand() {
  return `
    <div class="brand">
      <div class="brand-mark">CA</div>
      <div><strong>Ciencia Y Amor</strong><span>Events and Finance</span></div>
    </div>
  `;
}

function nav() {
  const allowed = rolePages[state.currentUser.role];
  return `<nav class="nav">${navItems
    .filter(([id]) => allowed.includes(id))
    .map(([id, label, icon]) => `<button class="${state.page === id ? "active" : ""}" data-route="${id}"><span>${icon}</span>${label}</button>`)
    .join("")}</nav>`;
}

function bottomNav() {
  const mobile = ["dashboard", "calendar", "activities", "upload", "reports"].filter((id) => rolePages[state.currentUser.role].includes(id));
  return `<nav class="bottom-nav">${mobile.map((id) => {
    const item = navItems.find(([navId]) => navId === id);
    return `<button class="${state.page === id ? "active" : ""}" data-route="${id}"><strong>${item[2]}</strong><span>${item[1]}</span></button>`;
  }).join("")}</nav>`;
}

function topbar() {
  const user = state.currentUser;
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">${user.role}</p>
        <h2>${pageTitle()}</h2>
      </div>
      <div class="split-actions">
        <div class="user-chip"><div class="avatar">${user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><strong>${user.name}</strong><br><small>${user.email}</small></div></div>
        <button class="button secondary" data-route="profile">Profile</button>
        <button class="button ghost" id="logoutBtn">Sign out</button>
      </div>
    </div>
  `;
}

function pageTitle() {
  const item = navItems.find(([id]) => id === state.page);
  if (state.page === "profile") return "User Profile";
  return item ? item[1] : "Dashboard";
}

function pageBody() {
  const pages = {
    dashboard: dashboardPage,
    calendar: calendarPage,
    activities: activitiesPage,
    "create-activity": createActivityPage,
    budgets: budgetsPage,
    funds: fundsPage,
    expenses: expensesPage,
    upload: uploadPage,
    review: reviewPage,
    liquidation: liquidationPage,
    "create-liquidation": createLiquidationPage,
    reports: reportsPage,
    transparency: transparencyPage,
    users: usersPage,
    districts: districtsPage,
    audit: auditPage,
    settings: settingsPage,
    profile: profilePage,
  };
  return pages[state.page]();
}

function visibleActivities() {
  if (state.currentUser.role !== "District Leader") return state.activities;
  return state.activities.filter((activityItem) => activityItem.district === state.currentUser.district || activityItem.leader === state.currentUser.name);
}

function totals(list = visibleActivities()) {
  const approved = sum(list, "approvedBudget");
  const actual = sum(list, "actualExpense");
  const forecast = list.reduce((total, item) => total + item.lineItems.reduce((lineTotal, line) => lineTotal + line.forecast, 0), 0);
  return {
    approved,
    actual,
    forecast,
    remaining: approved - actual,
    approvedCount: list.filter((item) => item.status === "Approved").length,
    completedCount: list.filter((item) => item.status === "Completed").length,
    pendingReports: list.filter((item) => item.reportStatus !== "Submitted").length,
    overBudget: list.filter((item) => item.actualExpense > item.approvedBudget).length,
  };
}

function sum(list, key) {
  return list.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function dashboardPage() {
  const t = totals();
  const pendingExpenses = state.expenses.filter((item) => ["Submitted", "Pending Treasury Review"].includes(item.status)).length;
  return `
    <section class="grid metrics">
      ${metric("Approved Budget", money.format(t.approved), "Annual budget released for visible activities")}
      ${metric("Actual Expenses", money.format(t.actual), `${t.overBudget} activity flagged over budget`)}
      ${metric("Remaining Balance", money.format(t.remaining), "Approved budget less actual expenses")}
      ${metric("Pending Reviews", pendingExpenses, "Expenses or receipts waiting for action")}
    </section>
    <section class="grid two-col" style="margin-top: 16px;">
      <div class="panel">
        <h3>Monthly Spending</h3>
        ${barChart(monthlySpend(), "month", "amount")}
      </div>
      <div class="panel">
        <h3>Notifications</h3>
        <div class="notification-list">${state.notifications.map((item) => `<div class="mini-item"><strong>${item.title}</strong><small>${item.body}</small></div>`).join("")}</div>
      </div>
      <div class="panel">
        <h3>Expense Report Breakdown</h3>
        ${expenseBreakdownFilters()}
        ${expensePieChart(filteredDashboardExpenses())}
      </div>
      <div class="panel">
        <h3>Activities Needing Attention</h3>
        ${activityTable(visibleActivities().filter((item) => item.status === "Pending Approval" || item.actualExpense > item.approvedBudget || item.reportStatus === "Pending").slice(0, 5))}
      </div>
      <div class="panel">
        <h3>Expense by Category</h3>
        ${categoryBars()}
      </div>
    </section>
  `;
}

function metric(label, value, helper) {
  return `<article class="card metric-card"><span>${label}</span><strong>${value}</strong><small>${helper}</small></article>`;
}

function calendarPage() {
  const filtered = filteredActivities();
  const grouped = groupBy(filtered, (item) => new Date(item.start).toLocaleString("en", { month: "long" }));
  return `
    ${activityFilters()}
    <section class="grid">
      ${Object.entries(grouped).map(([month, items]) => `
        <div class="panel">
          <h3>${month}</h3>
          ${activityTable(items)}
        </div>
      `).join("") || `<div class="empty">No activities match these filters.</div>`}
    </section>
  `;
}

function activitiesPage() {
  return `
    ${activityFilters()}
    <div class="panel">${activityTable(filteredActivities(), true)}</div>
  `;
}

function activityFilters() {
  const filter = state.filters;
  return `
    <div class="toolbar">
      ${selectField("monthFilter", "Month", ["All", "January", "February", "March", "April", "May", "June", "July", "August", "November", "December"], filter.month || "All")}
      ${selectField("districtFilter", "District", ["All", ...districts], filter.district || "All")}
      ${selectField("categoryFilter", "Activity type", ["All", ...categories, ...ministries], filter.category || "All")}
      ${selectField("statusFilter", "Status", ["All", "Planned", "Pending Approval", "Approved", "Ongoing", "Completed", "Cancelled"], filter.status || "All")}
      <button class="button secondary" id="clearFilters">Clear</button>
    </div>
  `;
}

function filteredActivities() {
  return visibleActivities().filter((item) => {
    const month = new Date(item.start).toLocaleString("en", { month: "long" });
    return (!state.filters.month || state.filters.month === "All" || state.filters.month === month)
      && (!state.filters.district || state.filters.district === "All" || state.filters.district === item.district)
      && (!state.filters.category || state.filters.category === "All" || state.filters.category === item.category || state.filters.category === item.ministry)
      && (!state.filters.status || state.filters.status === "All" || state.filters.status === item.status);
  });
}

function activityTable(list, includeActions = false) {
  if (!list.length) return `<div class="empty">No records to show.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Activity</th><th>Date</th><th>District / Ministry</th><th>Leader</th><th>Status</th><th>Budget</th><th>Actual</th><th>Variance</th>${includeActions ? "<th>Action</th>" : ""}</tr></thead>
        <tbody>
          ${list.map((item) => {
            const variance = item.actualExpense - item.approvedBudget;
            return `<tr>
              <td><strong>${item.title}</strong><br><small>${item.venue}</small></td>
              <td>${fmtDate(item.start)}<br><small>${fmtDate(item.end)}</small></td>
              <td>${item.district}<br><small>${item.ministry}</small></td>
              <td>${item.leader}</td>
              <td>${status(item.status)}</td>
              <td>${money.format(item.approvedBudget)}</td>
              <td>${money.format(item.actualExpense)}</td>
              <td>${variancePill(variance)}</td>
              ${includeActions ? `<td><button class="button secondary" data-select-activity="${item.id}">Details</button></td>` : ""}
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createActivityPage() {
  return `
    <form class="panel" id="activityForm">
      <h3>Register New Activity</h3>
      <div class="form-grid">
        ${inputField("title", "Activity title", "Community Prayer and Outreach")}
        ${selectField("district", "District or ministry", districts, state.currentUser.district === "All" ? "Central" : state.currentUser.district)}
        ${selectField("category", "Activity category", categories, "Community Program")}
        ${inputField("venue", "Venue", "Community Hall")}
        ${inputField("start", "Start date and time", "", "datetime-local")}
        ${inputField("end", "End date and time", "", "datetime-local")}
        ${inputField("leader", "Person in charge", state.currentUser.name)}
        ${inputField("participants", "Expected participants", "150", "number")}
        ${inputField("fundingSource", "Funding source", "Annual church fund")}
        ${inputField("proposedBudget", "Proposed budget", "75000", "number")}
        <div class="field full"><label for="description">Description</label><textarea id="description">Activity purpose, target participants, and ministry outcome.</textarea></div>
        <div class="field full"><label for="notes">Notes or justification</label><textarea id="notes">Budget supports meals, supplies, transport, and venue needs.</textarea></div>
      </div>
      <h3 class="section-title">Budget Line Items</h3>
      <div class="form-grid">
        ${expenseCategories.slice(0, 4).map((category, index) => inputField(`line-${index}`, category, String([28000, 18000, 15000, 14000][index]), "number")).join("")}
      </div>
      <div class="split-actions" style="margin-top: 18px;"><button class="button" type="submit">Submit for approval</button><button class="button secondary" type="reset">Reset</button></div>
    </form>
  `;
}

function budgetsPage() {
  const activityItem = selectedActivity();
  return `
    <section class="grid two-col">
      <div class="panel">
        <div class="toolbar">
          ${selectField("activityPicker", "Activity", visibleActivities().map((item) => item.title), activityItem.title)}
          ${roleCanApproveBudget() ? `<button class="button" id="approveBudget">Approve budget</button><button class="button danger" id="rejectBudget">Reject</button>` : ""}
        </div>
        <h3>${activityItem.title}</h3>
        ${budgetSummary(activityItem)}
        <h3 class="section-title">Budget Line Items</h3>
        ${lineItemTable(activityItem)}
      </div>
      <div class="panel">
        <h3>Budget Health</h3>
        ${budgetHealth(activityItem)}
      </div>
    </section>
  `;
}

function fundsPage() {
  return `
    <section class="grid two-col">
      <form class="panel" id="releaseForm">
        <h3>Record Fund Release</h3>
        ${selectField("releaseActivity", "Approved activity", visibleActivities().filter((item) => item.status === "Approved").map((item) => item.title), selectedActivity().title)}
        ${inputField("releaseAmount", "Released amount", "25000", "number")}
        ${inputField("releaseDate", "Release date", new Date().toISOString().slice(0, 10), "date")}
        ${inputField("releasedTo", "Released to", "Activity facilitator")}
        ${selectField("paymentMethod", "Payment method", ["Cash", "Bank transfer", "Check", "Mobile wallet"], "Bank transfer")}
        ${inputField("referenceNo", "Reference number", "BT-2026-300")}
        <div class="field"><label for="releaseRemarks">Remarks</label><textarea id="releaseRemarks">Released for approved activity expenses.</textarea></div>
        <button class="button" type="submit">Save release</button>
      </form>
      <div class="panel">
        <h3>Release Monitoring</h3>
        ${releaseTable()}
      </div>
    </section>
  `;
}

function expensesPage() {
  const rows = state.expenses.filter((item) => {
    const activityItem = state.activities.find((activityRow) => activityRow.id === item.activityId);
    return state.currentUser.role !== "District Leader" || activityItem.district === state.currentUser.district;
  });
  return `<div class="panel"><div class="split-actions" style="margin-bottom: 14px;"><button class="button" data-route="upload">Upload receipt</button>${rolePages[state.currentUser.role].includes("review") ? `<button class="button secondary" data-route="review">Review pending</button>` : ""}</div>${expenseTable(rows)}</div>`;
}

function uploadPage() {
  const approvedActivities = visibleActivities().filter((item) => item.status === "Approved");
  return `
    <section class="grid two-col">
      <form class="panel" id="uploadForm">
        <h3>Upload Receipt / Invoice</h3>
        ${selectField("expenseActivity", "Activity", approvedActivities.map((item) => item.title), approvedActivities[0]?.title || "")}
        ${selectField("expenseCategory", "Expense category", expenseCategories, "Food")}
        <div class="upload-zone">
          <label for="receiptFile">Capture or upload receipt</label>
          <input id="receiptFile" type="file" accept="image/*,.pdf" capture="environment" />
          <div id="previewWrap">${state.uploadPreview ? `<img class="preview" src="${state.uploadPreview}" alt="Receipt preview" />` : `<p style="color: var(--muted);">Choose a phone camera image, photo, or PDF. A preview appears here when available.</p>`}</div>
        </div>
        <div class="split-actions" style="margin-top: 14px;"><button class="button" id="extractBtn" type="button">Run AI extraction</button></div>
        <h3 class="section-title">Editable Extracted Fields</h3>
        ${extractionFields()}
        <button class="button" type="submit">Submit for treasury review</button>
      </form>
      <div class="panel">
        <h3>How the review works</h3>
        <div class="mini-item"><strong>1. Upload</strong><small>The original receipt or invoice stays attached as supporting documentation.</small></div>
        <div class="mini-item"><strong>2. AI suggestion</strong><small>Mock extraction fills editable fields now. The service can later connect to Document AI, Azure, Textract, or another OCR provider.</small></div>
        <div class="mini-item"><strong>3. Human confirmation</strong><small>The facilitator confirms the data before treasury validation.</small></div>
      </div>
    </section>
  `;
}

function extractionFields() {
  const data = state.mockExtraction || {
    vendor: "",
    invoiceNo: "",
    date: "",
    amount: "",
    tax: "",
    paymentMethod: "Cash",
    description: "",
  };
  return `
    <div class="form-grid">
      ${inputField("vendor", "Vendor or supplier", data.vendor)}
      ${inputField("invoiceNo", "Invoice or receipt number", data.invoiceNo)}
      ${inputField("invoiceDate", "Invoice date", data.date, "date")}
      ${inputField("amount", "Amount", data.amount, "number")}
      ${inputField("tax", "Tax or VAT", data.tax, "number")}
      ${selectField("expensePayment", "Payment method", ["Cash", "Bank transfer", "Check", "Mobile wallet"], data.paymentMethod || "Cash")}
      ${inputField("paidBy", "Paid by", state.currentUser.name)}
      <div class="field full"><label for="expenseDescription">Description</label><textarea id="expenseDescription">${data.description}</textarea></div>
      <div class="field full"><label for="expenseRemarks">Remarks</label><textarea id="expenseRemarks">Reviewed and confirmed by submitter.</textarea></div>
    </div>
  `;
}

function reviewPage() {
  const pending = state.expenses.filter((item) => ["Submitted", "Pending Treasury Review", "Returned for Correction"].includes(item.status));
  return `
    <section class="grid">
      ${pending.map((item) => reviewCard(item)).join("") || `<div class="empty">No pending expenses for treasury review.</div>`}
    </section>
  `;
}

function reviewCard(item) {
  const activityItem = state.activities.find((activityRow) => activityRow.id === item.activityId);
  return `
    <article class="panel">
      <div class="toolbar">
        <div><h3>${activityItem.title}</h3><p style="margin: 0; color: var(--muted);">${item.vendor} · ${item.invoiceNo} · ${money.format(item.amount)}</p></div>
        <button class="button" data-expense-action="Approved" data-expense-id="${item.id}">Approve</button>
        <button class="button danger" data-expense-action="Rejected" data-expense-id="${item.id}">Reject</button>
        <button class="button secondary" data-expense-action="Returned for Correction" data-expense-id="${item.id}">Return</button>
      </div>
      <div class="form-grid">
        ${inputField(`vendor-${item.id}`, "Vendor", item.vendor)}
        ${inputField(`invoice-${item.id}`, "Invoice no.", item.invoiceNo)}
        ${inputField(`amount-${item.id}`, "Amount", item.amount, "number")}
        ${selectField(`category-${item.id}`, "Category", expenseCategories, item.category)}
      </div>
      <div class="mini-item" style="margin-top: 12px;"><strong>Supporting document</strong><small>${item.attachment}</small></div>
    </article>
  `;
}

function liquidationPage() {
  return `
    <div class="panel">
      <div class="split-actions" style="margin-bottom: 14px;"><button class="button" data-route="create-liquidation">Create liquidation report</button></div>
      ${liquidationTable()}
    </div>
  `;
}

function createLiquidationPage() {
  const activityItem = selectedActivity();
  const approvedExpenses = state.expenses.filter((item) => item.activityId === activityItem.id && item.status === "Approved");
  return `
    <form class="panel" id="liquidationForm">
      <h3>Create Liquidation Report</h3>
      <div class="form-grid">
        ${selectField("liqActivity", "Completed activity", visibleActivities().map((item) => item.title), activityItem.title)}
        ${inputField("actualDate", "Actual date conducted", activityItem.end, "date")}
        ${inputField("attendees", "Number of attendees", String(activityItem.participants), "number")}
        ${inputField("returned", "Amount returned", String(Math.max(0, releasedFor(activityItem.id) - approvedExpenseTotal(activityItem.id))), "number")}
        <div class="field full"><label for="summary">Activity summary</label><textarea id="summary">Summarize what happened, major outcomes, and beneficiaries.</textarea></div>
        <div class="field full"><label for="issues">Issues encountered</label><textarea id="issues">Note operational or budget issues.</textarea></div>
        <div class="field full"><label for="recommendations">Recommendations</label><textarea id="recommendations">Recommendations for future activities.</textarea></div>
        <div class="field full"><label for="supporting">Supporting files</label><input id="supporting" type="file" multiple /></div>
      </div>
      <h3 class="section-title">Approved Expenses Included</h3>
      ${expenseTable(approvedExpenses)}
      <button class="button" type="submit" style="margin-top: 16px;">Submit liquidation report</button>
    </form>
  `;
}

function reportsPage() {
  return `
    <section class="panel">
      <div class="toolbar">
        ${selectField("reportType", "Report", ["Annual activity report", "Monthly activity report", "Budget vs actual report", "Expense report by activity", "Expense report by district", "Expense report by category", "Fund release report", "Unliquidated balance report", "Over-budget activity report", "Pending liquidation report", "Board financial summary report"], "Budget vs actual report")}
        ${inputField("fromDate", "From", "2026-01-01", "date")}
        ${inputField("toDate", "To", "2026-12-31", "date")}
        ${selectField("reportDistrict", "District", ["All", ...districts], "All")}
        ${selectField("reportStatus", "Status", ["All", "Planned", "Pending Approval", "Approved", "Ongoing", "Completed"], "All")}
        <button class="button secondary" id="printReport">Print</button>
        <button class="button" id="exportCsv">Export CSV</button>
      </div>
      <h3>Budget vs Actual Report</h3>
      ${activityTable(visibleActivities())}
    </section>
  `;
}

function transparencyPage() {
  const t = totals(state.activities);
  return `
    <section class="grid metrics">
      ${metric("Annual Approved Budget", money.format(t.approved), "All registered church activities")}
      ${metric("Actual Expenses", money.format(t.actual), "Validated and tracked expenses")}
      ${metric("Forecasted Expenses", money.format(t.forecast), "Based on budget line items")}
      ${metric("Over-Budget Activities", t.overBudget, "Flagged for board and treasury")}
    </section>
    <section class="grid two-col" style="margin-top: 16px;">
      <div class="panel"><h3>Budget vs Actual</h3>${pairedBudgetChart()}</div>
      <div class="panel"><h3>Expense by District</h3>${districtBars()}</div>
      <div class="panel"><h3>Monthly Spending</h3>${barChart(monthlySpend(), "month", "amount")}</div>
      <div class="panel"><h3>Expense by Category</h3>${categoryBars()}</div>
    </section>
  `;
}

function usersPage() {
  return `<div class="panel">${simpleTable(["Name", "Email", "Role", "District"], users.map((item) => [item.name, item.email, item.role, item.district]))}</div>`;
}

function districtsPage() {
  const rows = districts.map((district) => [district, state.activities.filter((item) => item.district === district).length, money.format(sum(state.activities.filter((item) => item.district === district), "approvedBudget"))]);
  return `<div class="panel"><h3>Districts and Ministries</h3>${simpleTable(["District", "Activities", "Approved Budget"], rows)}<h3 class="section-title">Ministries</h3>${simpleTable(["Ministry"], ministries.map((item) => [item]))}</div>`;
}

function auditPage() {
  return `<div class="panel"><div class="audit-list">${state.auditLogs.map((item) => `<div class="mini-item"><strong>${item.action}</strong><small>${item.user} · ${item.role} · ${item.record} · ${item.date}</small><br><small>Previous: ${item.previous} | New: ${item.next}</small></div>`).join("")}</div></div>`;
}

function settingsPage() {
  const backendStatus = window.churchBackend?.isConfigured()
    ? "Connected configuration found"
    : "Mock mode: add config.js from config.example.js to sync with Supabase";
  return `
    <form class="panel">
      <h3>System Settings</h3>
      <div class="mini-item" style="margin-bottom: 14px;"><strong>Backend</strong><small>${backendStatus}</small></div>
      ${inputField("churchName", "Church name", "Ciencia Y Amor Church")}
      ${inputField("fiscalYear", "Fiscal year", "2026")}
      ${selectField("ocrProvider", "Future OCR provider", ["Mock extraction", "Google Document AI", "Azure Document Intelligence", "Amazon Textract"], "Mock extraction")}
      ${inputField("currency", "Currency", "PHP")}
      <button class="button" type="button">Save settings</button>
    </form>
  `;
}

function profilePage() {
  const user = state.currentUser;
  return `
    <form class="panel">
      <h3>User Profile</h3>
      ${inputField("profileName", "Name", user.name)}
      ${inputField("profileEmail", "Email", user.email, "email")}
      ${inputField("profileRole", "Role", user.role)}
      ${inputField("profileDistrict", "District", user.district)}
      <button class="button" type="button">Save profile</button>
    </form>
  `;
}

function budgetSummary(item) {
  const released = releasedFor(item.id);
  const actual = approvedExpenseTotal(item.id) || item.actualExpense;
  return `
    <section class="grid metrics">
      ${metric("Proposed", money.format(item.proposedBudget), "Submitted by facilitator")}
      ${metric("Approved", money.format(item.approvedBudget), item.budgetStatus)}
      ${metric("Released", money.format(released), "Recorded by treasury")}
      ${metric("Variance", money.format(actual - item.approvedBudget), actual > item.approvedBudget ? "Over budget" : "Within budget")}
    </section>
  `;
}

function lineItemTable(item) {
  return simpleTable(["Category", "Description", "Forecast", "Approved"], item.lineItems.map((line) => [line.category, line.description, money.format(line.forecast), money.format(line.approved)]));
}

function budgetHealth(item) {
  const actual = item.actualExpense;
  const pct = item.approvedBudget ? Math.min(140, Math.round((actual / item.approvedBudget) * 100)) : 0;
  const color = pct > 100 ? "var(--red)" : pct > 85 ? "var(--yellow)" : "var(--green)";
  return `<div class="progress" style="height: 18px;"><span style="width: ${Math.min(pct, 100)}%; background: ${color};"></span></div><p><strong>${pct}% used</strong></p><p style="color: var(--muted);">Green is under budget, yellow is near the limit, and red means actual expenses exceed approved budget.</p>`;
}

function releaseTable() {
  const rows = state.fundReleases.map((item) => {
    const activityItem = state.activities.find((row) => row.id === item.activityId);
    const liquidated = approvedExpenseTotal(item.activityId);
    return [activityItem.title, money.format(item.amount), fmtDate(item.date), item.releasedTo, item.method, item.reference, money.format(Math.max(0, item.amount - liquidated))];
  });
  return simpleTable(["Activity", "Released", "Date", "Released to", "Method", "Reference", "Unliquidated"], rows);
}

function expenseTable(list) {
  if (!list.length) return `<div class="empty">No expenses to show.</div>`;
  return simpleTable(["Activity", "Vendor", "Invoice", "Date", "Category", "Amount", "Status"], list.map((item) => {
    const activityItem = state.activities.find((row) => row.id === item.activityId);
    return [activityItem.title, item.vendor, item.invoiceNo, fmtDate(item.date), item.category, money.format(item.amount), status(item.status)];
  }));
}

function liquidationTable() {
  const rows = state.liquidationReports.map((item) => {
    const activityItem = state.activities.find((row) => row.id === item.activityId);
    return [activityItem.title, item.summary, item.attendees, money.format(item.amountReturned), item.submittedBy, fmtDate(item.submittedDate), status(item.status)];
  });
  return simpleTable(["Activity", "Summary", "Attendees", "Returned", "Submitted by", "Date", "Status"], rows);
}

function simpleTable(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function selectedActivity() {
  return state.activities.find((item) => item.id === state.selectedActivityId) || visibleActivities()[0] || state.activities[0];
}

function releasedFor(activityId) {
  return state.fundReleases.filter((item) => item.activityId === activityId).reduce((total, item) => total + item.amount, 0);
}

function approvedExpenseTotal(activityId) {
  return state.expenses.filter((item) => item.activityId === activityId && item.status === "Approved").reduce((total, item) => total + item.amount, 0);
}

function roleCanApproveBudget() {
  return ["Admin", "Board of Directors", "Treasury Officer"].includes(state.currentUser.role);
}

function monthlySpend() {
  const months = ["Jan", "Mar", "Apr", "Jun", "Jul", "Aug", "Nov", "Dec"];
  return months.map((month) => ({
    month,
    amount: state.activities.filter((item) => new Date(item.start).toLocaleString("en", { month: "short" }) === month).reduce((total, item) => total + item.actualExpense, 0),
  }));
}

function barChart(data, labelKey, valueKey) {
  const max = Math.max(...data.map((item) => item[valueKey]), 1);
  return `<div class="chart">${data.map((item) => `<div class="bar"><div class="bar-fill" style="height: ${Math.max(8, (item[valueKey] / max) * 180)}px" title="${money.format(item[valueKey])}"></div><label>${item[labelKey]}</label></div>`).join("")}</div>`;
}

function pairedBudgetChart() {
  const data = state.activities.slice(0, 6);
  const max = Math.max(...data.flatMap((item) => [item.approvedBudget, item.actualExpense]), 1);
  return `<div class="chart">${data.map((item) => `
    <div class="bar"><div style="display:flex; align-items:end; gap:4px; height: 190px;"><div class="bar-fill" style="height:${(item.approvedBudget / max) * 180}px; background: var(--brand);" title="Budget ${money.format(item.approvedBudget)}"></div><div class="bar-fill" style="height:${Math.max(8, (item.actualExpense / max) * 180)}px; background: var(--accent);" title="Actual ${money.format(item.actualExpense)}"></div></div><label>${item.title.split(" ")[0]}</label></div>
  `).join("")}</div><p style="color: var(--muted);">Green bars show approved budget. Gold bars show actual expenses.</p>`;
}

function categoryBars() {
  const grouped = groupBy(state.expenses, (item) => item.category);
  const rows = Object.entries(grouped).map(([name, items]) => ({ name, amount: items.reduce((total, item) => total + item.amount, 0) }));
  return progressRows(rows);
}

function expenseBreakdownFilters() {
  const activities = visibleActivities();
  const selectedType = state.dashboardExpenseType;
  const activityOptions = activities
    .filter((item) => selectedType === "All" || item.category === selectedType)
    .map((item) => item.title);

  if (state.dashboardExpenseActivity !== "All" && !activityOptions.includes(state.dashboardExpenseActivity)) {
    state.dashboardExpenseActivity = "All";
  }

  return `
    <div class="toolbar compact-toolbar">
      ${selectField("dashboardExpenseType", "Activity type", ["All", ...new Set(activities.map((item) => item.category))], selectedType)}
      ${selectField("dashboardExpenseActivity", "Activity name", ["All", ...activityOptions], state.dashboardExpenseActivity)}
    </div>
  `;
}

function filteredDashboardExpenses() {
  const activityIds = visibleActivities()
    .filter((item) => state.dashboardExpenseType === "All" || item.category === state.dashboardExpenseType)
    .filter((item) => state.dashboardExpenseActivity === "All" || item.title === state.dashboardExpenseActivity)
    .map((item) => item.id);

  return state.expenses.filter((item) => activityIds.includes(item.activityId));
}

function expensePieChart(expenses) {
  if (!expenses.length) return `<div class="empty">No expenses match this activity filter.</div>`;

  const grouped = groupBy(expenses, (item) => item.category);
  const rows = Object.entries(grouped)
    .map(([name, items]) => ({ name, amount: items.reduce((total, item) => total + item.amount, 0) }))
    .sort((a, b) => b.amount - a.amount);
  const total = rows.reduce((amount, item) => amount + item.amount, 0);
  const colors = ["#2f6f4e", "#c47a2c", "#2f609d", "#b78a18", "#7d5ba6", "#b9423a", "#52796f", "#8a6f3d"];
  let cursor = 0;
  const segments = rows.map((item, index) => {
    const start = cursor;
    const size = (item.amount / total) * 100;
    cursor += size;
    return `${colors[index % colors.length]} ${start}% ${cursor}%`;
  }).join(", ");

  return `
    <div class="pie-report">
      <div class="pie-chart" style="background: conic-gradient(${segments});">
        <div><strong>${money.format(total)}</strong><small>Total</small></div>
      </div>
      <div class="pie-legend">
        ${rows.map((item, index) => {
          const pct = Math.round((item.amount / total) * 100);
          return `<div class="pie-legend-row"><span style="background:${colors[index % colors.length]}"></span><strong>${item.name}</strong><small>${money.format(item.amount)} · ${pct}%</small></div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function districtBars() {
  const rows = districts.map((name) => ({ name, amount: sum(state.activities.filter((item) => item.district === name), "actualExpense") })).filter((item) => item.amount > 0);
  return progressRows(rows);
}

function progressRows(rows) {
  const max = Math.max(...rows.map((item) => item.amount), 1);
  return `<div class="donut-list">${rows.map((item) => `<div class="legend-row"><strong>${item.name}</strong><div class="progress"><span style="width:${(item.amount / max) * 100}%"></span></div><small>${money.format(item.amount)}</small></div>`).join("")}</div>`;
}

function groupBy(list, getKey) {
  return list.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function status(value) {
  const good = ["Approved", "Completed", "Submitted"];
  const bad = ["Rejected", "Cancelled", "Over budget"];
  const warn = ["Pending Approval", "Pending Treasury Review", "Returned for Correction", "Ongoing", "Pending"];
  const klass = good.includes(value) ? "good" : bad.includes(value) ? "bad" : warn.includes(value) ? "warn" : "info";
  return `<span class="status ${klass}">${value}</span>`;
}

function variancePill(variance) {
  if (variance > 0) return `<span class="status bad">${money.format(variance)}</span>`;
  if (variance > -10000) return `<span class="status warn">${money.format(variance)}</span>`;
  return `<span class="status good">${money.format(variance)}</span>`;
}

function fmtDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

function inputField(id, label, value = "", type = "text") {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${value}" /></div>`;
}

function selectField(id, label, options, selected) {
  return `<div class="field"><label for="${id}">${label}</label><select id="${id}">${options.map((option) => `<option ${option === selected ? "selected" : ""}>${option}</option>`).join("")}</select></div>`;
}

function addAudit(action, record) {
  const entry = log(state.currentUser.name, state.currentUser.role, action, record);
  state.auditLogs.unshift(entry);
  syncToSupabase("insertAuditLog", entry);
}

function syncToSupabase(method, ...payload) {
  if (!window.churchBackend?.isConfigured()) return;
  window.churchBackend[method](...payload).catch((error) => {
    console.warn(`Supabase ${method} failed`, error);
  });
}

function bindGlobal() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = button.dataset.route;
    });
  });
  document.querySelector("#logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("cya-user");
    state.currentUser = null;
    location.hash = "";
    render();
  });
  ["monthFilter", "districtFilter", "categoryFilter", "statusFilter"].forEach((id) => {
    document.querySelector(`#${id}`)?.addEventListener("change", (event) => {
      state.filters[id.replace("Filter", "")] = event.target.value;
      render();
    });
  });
  document.querySelector("#dashboardExpenseType")?.addEventListener("change", (event) => {
    state.dashboardExpenseType = event.target.value;
    state.dashboardExpenseActivity = "All";
    render();
  });
  document.querySelector("#dashboardExpenseActivity")?.addEventListener("change", (event) => {
    state.dashboardExpenseActivity = event.target.value;
    render();
  });
  document.querySelector("#clearFilters")?.addEventListener("click", () => {
    state.filters = {};
    render();
  });
  document.querySelectorAll("[data-select-activity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedActivityId = button.dataset.selectActivity;
      location.hash = "budgets";
    });
  });
  document.querySelector("#activityPicker")?.addEventListener("change", (event) => {
    state.selectedActivityId = state.activities.find((item) => item.title === event.target.value).id;
    render();
  });
  document.querySelector("#approveBudget")?.addEventListener("click", () => {
    selectedActivity().budgetStatus = "Approved";
    selectedActivity().status = "Approved";
    addAudit("Budget approval", `Activity: ${selectedActivity().title}`);
    render();
  });
  document.querySelector("#rejectBudget")?.addEventListener("click", () => {
    selectedActivity().budgetStatus = "Rejected";
    selectedActivity().status = "Pending Approval";
    addAudit("Budget rejected", `Activity: ${selectedActivity().title}`);
    render();
  });
  document.querySelector("#activityForm")?.addEventListener("submit", submitActivity);
  document.querySelector("#releaseForm")?.addEventListener("submit", submitRelease);
  document.querySelector("#receiptFile")?.addEventListener("change", previewReceipt);
  document.querySelector("#extractBtn")?.addEventListener("click", runMockExtraction);
  document.querySelector("#uploadForm")?.addEventListener("submit", submitExpense);
  document.querySelectorAll("[data-expense-action]").forEach((button) => {
    button.addEventListener("click", () => updateExpenseStatus(button.dataset.expenseId, button.dataset.expenseAction));
  });
  document.querySelector("#liquidationForm")?.addEventListener("submit", submitLiquidation);
  document.querySelector("#printReport")?.addEventListener("click", () => window.print());
  document.querySelector("#exportCsv")?.addEventListener("click", exportCsv);
}

function submitActivity(event) {
  event.preventDefault();
  const budget = Number(document.querySelector("#proposedBudget").value || 0);
  const start = document.querySelector("#start").value || new Date().toISOString();
  const newActivity = activity(
    crypto.randomUUID(),
    document.querySelector("#title").value,
    document.querySelector("#category").value,
    document.querySelector("#district").value,
    document.querySelector("#leader").value,
    start,
    document.querySelector("#end").value || start,
    document.querySelector("#venue").value,
    Number(document.querySelector("#participants").value || 0),
    "Pending Approval",
    budget,
    0,
  );
  newActivity.description = document.querySelector("#description").value;
  newActivity.fundingSource = document.querySelector("#fundingSource").value;
  state.activities.unshift(newActivity);
  state.selectedActivityId = newActivity.id;
  addAudit("Activity creation", `Activity: ${newActivity.title}`);
  syncToSupabase("insertActivity", newActivity);
  alert("Activity submitted and marked Pending Approval.");
  location.hash = "activities";
}

function submitRelease(event) {
  event.preventDefault();
  const activityItem = state.activities.find((item) => item.title === document.querySelector("#releaseActivity").value);
  if (!activityItem || activityItem.status !== "Approved") return alert("Funds can only be released for approved activities.");
  const newRelease = release(crypto.randomUUID(), activityItem.id, Number(document.querySelector("#releaseAmount").value), document.querySelector("#releaseDate").value, document.querySelector("#releasedTo").value, document.querySelector("#paymentMethod").value, document.querySelector("#referenceNo").value);
  state.fundReleases.unshift(newRelease);
  addAudit("Fund release recorded", `Activity: ${activityItem.title}`);
  syncToSupabase("insertFundRelease", newRelease);
  render();
}

function previewReceipt(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      state.uploadPreview = reader.result;
      render();
    };
    reader.readAsDataURL(file);
  } else {
    state.uploadPreview = "";
    document.querySelector("#previewWrap").innerHTML = `<p>${file.name} selected for upload.</p>`;
  }
}

function runMockExtraction() {
  state.mockExtraction = {
    vendor: "Carmela Catering Services",
    invoiceNo: `OR-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().slice(0, 10),
    amount: 24850,
    tax: 2982,
    paymentMethod: "Cash",
    description: "Meals and refreshments for approved church activity. Line items: packed meals, drinking water, service fee.",
  };
  addAudit("AI receipt extraction", "Mock OCR service returned editable invoice fields");
  render();
}

function submitExpense(event) {
  event.preventDefault();
  const activityItem = state.activities.find((item) => item.title === document.querySelector("#expenseActivity").value);
  if (!activityItem || activityItem.status !== "Approved") return alert("Expenses must belong to an approved activity.");
  const newExpense = expense(
    crypto.randomUUID(),
    activityItem.id,
    document.querySelector("#expenseCategory").value,
    document.querySelector("#vendor").value,
    document.querySelector("#invoiceNo").value,
    document.querySelector("#invoiceDate").value,
    Number(document.querySelector("#amount").value || 0),
    "Pending Treasury Review",
  );
  newExpense.tax = Number(document.querySelector("#tax").value || 0);
  newExpense.paymentMethod = document.querySelector("#expensePayment").value;
  newExpense.paidBy = document.querySelector("#paidBy").value;
  newExpense.description = document.querySelector("#expenseDescription").value;
  newExpense.remarks = document.querySelector("#expenseRemarks").value;
  state.expenses.unshift(newExpense);
  state.mockExtraction = null;
  state.uploadPreview = "";
  addAudit("Expense submission", `Expense: ${newExpense.invoiceNo}`);
  syncToSupabase("insertExpense", newExpense);
  alert("Expense submitted for treasury validation.");
  location.hash = "expenses";
}

function updateExpenseStatus(expenseId, nextStatus) {
  const item = state.expenses.find((expenseItem) => expenseItem.id === expenseId);
  item.status = nextStatus;
  if (nextStatus === "Approved") {
    const activityItem = state.activities.find((row) => row.id === item.activityId);
    activityItem.actualExpense = approvedExpenseTotal(activityItem.id);
  }
  addAudit("Treasury validation", `Expense: ${item.invoiceNo} set to ${nextStatus}`);
  syncToSupabase("updateExpenseStatus", item.id, nextStatus);
  render();
}

function submitLiquidation(event) {
  event.preventDefault();
  const activityItem = state.activities.find((item) => item.title === document.querySelector("#liqActivity").value);
  const report = {
    id: crypto.randomUUID(),
    activityId: activityItem.id,
    summary: document.querySelector("#summary").value,
    attendees: Number(document.querySelector("#attendees").value || 0),
    amountReturned: Number(document.querySelector("#returned").value || 0),
    issues: document.querySelector("#issues").value,
    recommendations: document.querySelector("#recommendations").value,
    status: "Submitted",
    submittedBy: state.currentUser.name,
    submittedDate: new Date().toISOString().slice(0, 10),
  };
  state.liquidationReports.unshift(report);
  activityItem.reportStatus = "Submitted";
  addAudit("Report submission", `Liquidation: ${activityItem.title}`);
  syncToSupabase("insertLiquidationReport", report);
  alert("Liquidation report submitted.");
  location.hash = "liquidation";
}

function exportCsv() {
  const headers = ["Activity", "District", "Status", "Approved Budget", "Actual Expense", "Variance"];
  const rows = visibleActivities().map((item) => [item.title, item.district, item.status, item.approvedBudget, item.actualExpense, item.actualExpense - item.approvedBudget]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ciencia-y-amor-budget-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

render();
