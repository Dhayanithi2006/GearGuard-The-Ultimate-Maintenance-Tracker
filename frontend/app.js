fetch("http://localhost:5000/api/requests")
  .then(res => res.json())
  .then(data => {
    data.forEach(req => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerText = req.subject;

      document.getElementById(req.status).appendChild(card);
    });
  });
