fetch("http://localhost:5000/api/requests")
  .then(res => res.json())
  .then(data => {
    data.forEach(req => {
      const card = document.createElement("div");
      card.className = "card";

      if (req.isOverdue) card.classList.add("overdue");
      if (req.status === "In Progress") card.classList.add("in-progress");
      if (req.status === "Repaired") card.classList.add("repaired");

      card.innerHTML = `
        <strong>${req.subject}</strong><br>
        Equipment: ${req.equipmentId?.name || "N/A"}<br>
        Assigned: ${req.assignedTo}<br><br>

        <button onclick="updateStatus('${req._id}','In Progress')">▶ Start</button>
        <button onclick="updateStatus('${req._id}','Repaired')">✔ Done</button>
      `;

      document.getElementById(req.status).appendChild(card);
    });
  });

function updateStatus(id, status) {
  fetch(`http://localhost:5000/api/requests/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }).then(() => location.reload());
}
