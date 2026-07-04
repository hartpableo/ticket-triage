// Toast Alerts Trigger
function showToast(message, type = 'info') {
  const msgEl = document.getElementById('toast-message');
  if (msgEl) msgEl.innerText = message;

  const iconEl = document.getElementById('toast-icon');
  if (iconEl) {
    // Reset icon classes
    iconEl.className = 'bi me-2 fs-5';

    // Set appropriate icon class and text color
    if (type === 'success') {
      iconEl.classList.add('bi-check-circle-fill', 'text-success');
    } else if (type === 'error' || type === 'danger') {
      iconEl.classList.add('bi-exclamation-triangle-fill', 'text-danger');
    } else if (type === 'warning') {
      iconEl.classList.add('bi-exclamation-circle-fill', 'text-warning');
    } else {
      iconEl.classList.add('bi-info-circle-fill', 'text-primary');
    }
  }

  const toastEl = document.getElementById('toastNotification');
  if (toastEl) {
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
    toastInstance.show();
  }
}

// Copy Snippet Logic
function selectWidgetSnippet(clientName, key, domain) {
  const textEl = document.getElementById('widget-code-text');
  if (textEl) {
    textEl.innerHTML = `<code>&lt;!-- Ticket Triage Widget Embed Code --&gt;
&lt;script
  src="https://cdn.tickettriage.io/widget.v1.js"
  data-client-id="${key}"
  data-domain="${domain}"
  data-theme="light"
  async&gt;
&lt;/script&gt;</code>`;
  }

  const titleEl = document.getElementById('widget-modal-client-title');
  if (titleEl) {
    titleEl.innerText = `Embed Snippet for ${clientName}:`;
  }

  const modalEl = document.getElementById('widgetEmbedModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  showToast(`Loaded embed code for ${clientName}`, 'info');
}

// Copy Snippet
function copyWidgetSnippet() {
  const codeEl = document.getElementById('widget-code-text');
  if (!codeEl) return;
  const code = codeEl.innerText;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Widget code copied to clipboard!', 'success');

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.innerHTML = '<i class="bi bi-check2-all me-1"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="bi bi-copy me-1"></i> Copy';
      }, 2000);
    }
  });
}

// Bootstrap Modals Setup
function showAddClientModal() {
  const el = document.getElementById('addClientModal');
  if (el) {
    const modal = new bootstrap.Modal(el);
    modal.show();
  }
}

// Show Add Agent Modal
function showAddAgentModal() {
  const el = document.getElementById('addAgentModal');
  if (el) {
    const modal = new bootstrap.Modal(el);
    modal.show();
  }
}

window.showToast = showToast;
window.showAddClientModal = showAddClientModal;
window.showAddAgentModal = showAddAgentModal;
window.copyWidgetSnippet = copyWidgetSnippet;
window.selectWidgetSnippet = selectWidgetSnippet;

// Automatically initialize and show any Symfony flash toasts present in the DOM
document.addEventListener('DOMContentLoaded', () => {
  const flashToasts = document.querySelectorAll('.flash-toast');
  flashToasts.forEach(toastEl => {
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
    toastInstance.show();
  });
});
