const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("userInfo").innerText =
  `${user.name} (${user.role})`;

// Fetch Equipment Count
fetch("http://localhost:5000/api/equipment")
  .then(res => res.json())
  .then(data => {
    document.getElementById("equipCount").innerText = data.length;
  });

// Fetch Requests
fetch("http://localhost:5000/api/requests")
  .then(res => res.json())
  .then(data => {
    document.getElementById("reqCount").innerText = data.length;

    const pending = data.filter(
      r => r.status === "New" || r.status === "In Progress"
    );
    document.getElementById("pendingCount").innerText = pending.length;

    const preventive = data.filter(r => r.type === "Preventive");
    document.getElementById("preventiveCount").innerText = preventive.length;
  });
