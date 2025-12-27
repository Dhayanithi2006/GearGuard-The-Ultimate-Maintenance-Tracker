

function login() {
  const emailInput = document.getElementById("email");

  if (!emailInput || !emailInput.value) {
    alert("Please enter your email");
    return;
  }

  const email = emailInput.value.trim();

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Invalid login");
      }
      return res.json();
    })
    .then(user => {
      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect everyone to dashboard
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      alert("Login failed: User not found");
      console.error(err);
    });
}
(function checkExistingLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    window.location.href = "dashboard.html";
  }
})();
