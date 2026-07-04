// shared/auth.js

// Logout / Login Handling
function logout() {
    if (confirm("Do you want to log out?") === false) return;
    window.location.replace("/logout");
}

// function login(event) {
//     event.preventDefault();
//     const layout = document.getElementById("main-dashboard-layout");
//     const loginScr = document.getElementById("login-screen");
//
//     if (loginScr) {
//         loginScr.classList.add("d-none");
//         loginScr.classList.remove("d-flex");
//     }
//     if (layout) {
//         layout.classList.remove("d-none");
//         layout.classList.add("d-flex");
//     }
//     showToast(`Welcome back, ${userProfile.name}!`);
// }

// Profile Update Handling
function saveProfile(event) {
    if (event && event.preventDefault) event.preventDefault();

    const nameEl = document.getElementById("profile-name");
    const titleEl = document.getElementById("profile-title");
    if (!nameEl || !titleEl) return;

    const name = nameEl.value.trim();
    const title = titleEl.value.trim();

    userProfile.name = name;
    userProfile.role = title;

    // Update Sidebar Profile details
    const displayNm = document.getElementById("sidebar-display-name");
    const displayTitle = document.getElementById("sidebar-display-title");
    if (displayNm) displayNm.innerText = name;
    if (displayTitle) displayTitle.innerText = title;

    // Update initials on elements
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    const sidebarAvatar = document.getElementById("sidebar-avatar-initials");
    if (sidebarAvatar) {
        sidebarAvatar.innerText = initials;
        if (userProfile.avatarColor) sidebarAvatar.style.backgroundColor = userProfile.avatarColor;
    }

    const profilePreview = document.getElementById("profile-avatar-preview");
    if (profilePreview) {
        profilePreview.innerText = initials;
        if (userProfile.avatarColor) profilePreview.style.backgroundColor = userProfile.avatarColor;
    }

    const mobileAvatar = document.getElementById("mobile-avatar-initials");
    if (mobileAvatar) {
        mobileAvatar.innerText = initials;
        if (userProfile.avatarColor) mobileAvatar.style.backgroundColor = userProfile.avatarColor;
    }

    showToast("Profile updated successfully!");
}

// window.login = login;
window.logout = logout;
window.saveProfile = saveProfile;
