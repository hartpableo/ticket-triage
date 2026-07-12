import "dashboard";

function showAddAgentModal() {
    const el = document.getElementById('addAgentModal');
    if (el) {
        const modal = new bootstrap.Modal(el);
        modal.show();
    }
}

window.showAddAgentModal = showAddAgentModal;
