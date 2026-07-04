function logout() {
    if (confirm("Do you want to log out?") === false) return;
    window.location.replace("/logout");
}

window.logout = logout;
