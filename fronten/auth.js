// auth.js
// Central Firebase authentication guard (SAFE for multi-page apps)

function checkAuth() {
  const uid = localStorage.getItem("uid");
  const email = localStorage.getItem("email");

  if (!uid || !email) {
    window.location.replace("login.html");
  }
}

// Delay check to allow Firebase session to load
setTimeout(checkAuth, 300);
