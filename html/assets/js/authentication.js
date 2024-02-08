$("#logout").on("click", function () {
  logout();
});

$("#login-btn").on("click", function () {
  login();
});

async function logout() {
  window.location.href = "/index.html";
}

async function login() {
  let email = document.getElementById("signin-email").value;
  let password = document.getElementById("signin-password").value;
  console.log("Login");
  if (email == "issuer@latticelabs.io" && password == "pswd") {
    window.location.href = "./dashboard.html";
  } else {
    alert("Email or Password incorrect.");
  }
}
