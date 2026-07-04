// shared/attachment-handlers.js

let activeCommentAttachments = [];

function renderAttachmentPreviews() {
  const container = document.getElementById('attachment-preview-container');
  const clearBtn = document.getElementById('clear-attachments-btn');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (activeCommentAttachments.length === 0) {
    if (clearBtn) clearBtn.classList.add('d-none');
    return;
  }
  
  if (clearBtn) clearBtn.classList.remove('d-none');
  
  activeCommentAttachments.forEach((file, index) => {
    const card = document.createElement('div');
    card.className = 'position-relative border rounded-3 p-1 bg-white shadow-sm';
    card.style.width = '70px';
    card.style.height = '70px';
    
    let thumbnailContent = '';
    if (file.type === 'image') {
      thumbnailContent = `<img src="${file.url}" style="width: 100%; height: 100%; object-fit: cover;" class="rounded-2" alt="${file.name}">`;
    } else if (file.type === 'video') {
      thumbnailContent = `<div class="w-100 h-100 bg-dark rounded-2 d-flex align-items-center justify-content-center text-white"><i class="bi bi-play-fill fs-4"></i></div>`;
    }
    
    card.innerHTML = `
      ${thumbnailContent}
      <button type="button" class="position-absolute top-0 end-0 btn btn-danger p-0 rounded-circle d-flex align-items-center justify-content-center" 
              style="width: 18px; height: 18px; transform: translate(30%, -30%); font-size: 0.65rem;" 
              onclick="removeAttachmentByIndex(${index})" title="Remove">
        <i class="bi bi-x"></i>
      </button>
    `;
    container.appendChild(card);
  });
}

function clearAttachments() {
  activeCommentAttachments = [];
  renderAttachmentPreviews();
  showToast('All attachments cleared.');
}

function removeAttachmentByIndex(index) {
  activeCommentAttachments.splice(index, 1);
  renderAttachmentPreviews();
}

function simulateMediaAttachment(type) {
  if (type === 'image') {
    activeCommentAttachments.push({
      type: 'image',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      name: 'agent_debug_screenshot.png'
    });
    renderAttachmentPreviews();
    showToast('Mock screenshot attached to response.');
  } else if (type === 'video') {
    activeCommentAttachments.push({
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-40548-large.mp4',
      name: 'agent_screen_recording.mp4'
    });
    renderAttachmentPreviews();
    showToast('Mock screen recording attached to response.');
  }
}
