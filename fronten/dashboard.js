// 🔐 Firebase login check
const uid = localStorage.getItem("uid");
const email = localStorage.getItem("email");

if (!uid || !email) {
  window.location.href = "login.html";
}

/* ----------------------------
   DASHBOARD COUNTS
----------------------------- */
fetch("http://localhost:5000/api/requests")
  .then(res => res.json())
  .then(data => {
    document.getElementById("totalRequests").innerText = data.length;

    const pending = data.filter(
      r => r.status !== "Repaired" && r.status !== "Scrap"
    );
    document.getElementById("pendingRequests").innerText = pending.length;

    const preventive = data.filter(r => r.type === "Preventive");
    document.getElementById("preventiveCount").innerText = preventive.length;
  });

fetch("http://localhost:5000/api/equipment")
  .then(res => res.json())
  .then(data => {
    document.getElementById("totalEquipment").innerText = data.length;
  });

/* ----------------------------
   🔗 NAVIGATION FUNCTIONS
----------------------------- */
function openKanban() {
  window.location.href = "kanban.html";
}

function openCalendar() {
  window.location.href = "calendar.html";
}

function openEquipment() {
  window.location.href = "equipment.html";
}

/* ----------------------------
   LOGOUT
----------------------------- */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// make functions global
window.openKanban = openKanban;
window.openCalendar = openCalendar;
window.openEquipment = openEquipment;
window.logout = logout;
