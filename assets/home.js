import "bootstrap";
import "./styles/home.css";

// Toggle simulated client widget
function toggleSimWidget() {
    const card = document.getElementById("sim-widget-card");
    const icon = document.getElementById("sim-widget-icon");
    const trigger = document.getElementById("sim-widget-trigger");
    const hint = document.getElementById("sim-widget-hint");

    if (card.classList.contains("active")) {
        card.classList.remove("active");
        icon.className = "bi bi-chat-left-text-fill fs-4";
        trigger.setAttribute("aria-expanded", "false");
        if (hint) hint.classList.remove("d-none");
    } else {
        card.classList.add("active");
        icon.className = "bi bi-x-lg fs-4";
        trigger.setAttribute("aria-expanded", "true");
        if (hint) hint.classList.add("d-none");

        // Auto-focus title input when widget opens for accessibility
        setTimeout(() => {
            const firstInput = document.getElementById("sim-issue-title");
            if (firstInput) firstInput.focus();
        }, 150);
    }
}

// Submit ticket inside simulator
function submitSimTicket(e) {
    e.preventDefault();
    const titleInput = document.getElementById("sim-issue-title");
    const title = titleInput.value.trim();
    if (!title) return;

    // Show success screen in widget
    document.getElementById("sim-widget-form-container").classList.add("d-none");
    document.getElementById("sim-widget-success-container").classList.remove("d-none");

    // Trigger main landing page alert
    const alertToast = document.getElementById("simulator-alert");
    alertToast.style.opacity = "1";

    // Keep it up for 3 seconds then close widget
    setTimeout(() => {
        alertToast.style.opacity = "0";
    }, 3000);

    setTimeout(() => {
        toggleSimWidget();
        // Reset form
        titleInput.value = "";
        document.getElementById("sim-widget-form-container").classList.remove("d-none");
        document.getElementById("sim-widget-success-container").classList.add("d-none");
    }, 4000);
}

// Sign up form handler
function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const agencyName = document.getElementById("reg-agency").value.trim();
    const email = document.getElementById("reg-email").value.trim();

    const btn = document.getElementById("signup-submit-btn");
    btn.innerHTML = "<span class=\"spinner-border spinner-border-sm me-2\" role=\"status\" aria-hidden=\"true\"></span>Provisioning sandbox...";
    btn.disabled = true;

    // Mock loading state
    setTimeout(() => {
        const userData = {
            name: name,
            agencyName: agencyName,
            email: email
        };
        localStorage.setItem("signedUpUser", JSON.stringify(userData));

        // Switch card to success state
        document.getElementById("signup-form-container").classList.add("d-none");
        document.getElementById("success-user-name").innerText = name;
        document.getElementById("success-agency-name").innerText = agencyName;
        document.getElementById("signup-success-container").classList.remove("d-none");
    }, 1200);
}

// Expose functions globally for inline HTML event handlers (onclick, onsubmit)
window.toggleSimWidget = toggleSimWidget;
window.submitSimTicket = submitSimTicket;
window.handleSignup = handleSignup;

