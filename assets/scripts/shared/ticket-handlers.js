// Open & View Ticket Details (Full Page)
function openTicketDetails(id) {
  selectedTicketId = id;
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return;

  // Fill the detailed view fields
  document.getElementById('detail-ticket-id').innerText = ticket.id;
  document.getElementById('detail-ticket-title').innerText = ticket.title;
  document.getElementById('detail-client-name').innerText = ticket.client;
  document.getElementById('detail-category').innerText = ticket.category;
  document.getElementById('detail-created-at').innerText = ticket.createdAt;
  document.getElementById('detail-description').innerText = ticket.description;

  // Load description attachments
  const descAttachmentsEl = document.getElementById('detail-description-attachments');
  if (descAttachmentsEl) {
    descAttachmentsEl.innerHTML = '';
    if (ticket.attachments && ticket.attachments.length > 0) {
      ticket.attachments.forEach(file => {
        if (file.type === 'image') {
          descAttachmentsEl.innerHTML += `
            <div class="border rounded bg-light p-2 text-center" style="max-width: 240px;">
              <img src="${file.url}" class="img-fluid rounded border mb-2" style="max-height: 140px; object-fit: cover; cursor: pointer;" onclick="window.open('${file.url}')" alt="${file.name}">
              <div class="text-truncate small text-muted text-start" style="font-size: 0.75rem;">
                <i class="bi bi-image me-1"></i> ${file.name}
              </div>
            </div>
          `;
        } else if (file.type === 'video') {
          descAttachmentsEl.innerHTML += `
            <div class="border rounded bg-light p-2 text-center" style="max-width: 320px; width: 100%;">
              <video src="${file.url}" controls class="w-100 rounded border mb-2" style="max-height: 180px;"></video>
              <div class="text-truncate small text-muted text-start" style="font-size: 0.75rem;">
                <i class="bi bi-play-btn me-1"></i> ${file.name}
              </div>
            </div>
          `;
        }
      });
    }
  }

  // Set selects values
  document.getElementById('detail-status-select').value = ticket.status;
  document.getElementById('detail-priority-select').value = ticket.priority;
  document.getElementById('detail-assignee-select').value = ticket.assignee;

  // Set header breadcrumb title
  const pageTitleEl = document.getElementById('page-title');
  if (pageTitleEl) {
    pageTitleEl.innerHTML = `
      <span class="text-muted fw-normal" style="cursor: pointer;" onclick="window.location.href='/dashboard/tickets'">Tickets Queue</span>
      <span class="text-secondary mx-2">/</span>
      <span class="text-dark">${ticket.id}</span>
    `;
  }
}

// Comment submission in detail view
function submitDetailComment() {
  const textInput = document.getElementById('detail-comment-input');
  if (!textInput) return;
  const commentText = textInput.value.trim();
  if (commentText === '' && activeCommentAttachments.length === 0) return;

  const isInternalCheck = document.getElementById('detail-comment-is-internal');
  const isInternal = isInternalCheck ? isInternalCheck.checked : false;
  const ticket = tickets.find(t => t.id === selectedTicketId);
  if (!ticket) return;

  const author = isInternal ? `${userProfile.name} (Internal Note)` : userProfile.name;

  ticket.comments.push({
    author: author,
    text: commentText,
    time: 'Just now',
    isSystem: isInternal,
    attachments: [...activeCommentAttachments]
  });

  textInput.value = '';
  if (isInternalCheck) isInternalCheck.checked = false;
  activeCommentAttachments = [];
  renderAttachmentPreviews();

  showToast('Reply posted successfully!', 'success');
}

window.openTicketDetails = openTicketDetails;
window.submitDetailComment = submitDetailComment;
