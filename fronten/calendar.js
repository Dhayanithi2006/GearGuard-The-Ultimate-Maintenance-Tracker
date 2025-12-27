fetch("http://localhost:5000/api/requests/preventive")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("calendar");

    data.forEach(req => {
      const li = document.createElement("li");
      li.innerText = `${req.subject} - ${new Date(req.scheduledDate).toDateString()}`;
      list.appendChild(li);
    });
  });
