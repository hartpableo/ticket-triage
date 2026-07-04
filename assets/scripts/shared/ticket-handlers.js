// shared/ticket-handlers.js

// Filter & Search Functionality
function applyFilters() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const clientVal = document.getElementById('filter-client').value;
  const statusVal = document.getElementById('filter-status').value;
  const priorityVal = document.getElementById('filter-priority').value;

  const filtered = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(query) || 
                          ticket.title.toLowerCase().includes(query) || 
                          ticket.description.toLowerCase().includes(query);
    const matchesClient = clientVal === '' || ticket.client === clientVal;
    const matchesStatus = statusVal === '' || ticket.status === statusVal;
    const matchesPriority = priorityVal === '' || ticket.priority === priorityVal;

    return matchesSearch && matchesClient && matchesStatus && matchesPriority;
  });

  renderTicketsTable(filtered);
}

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

  // Render Timeline Activity
  renderDetailTimeline(ticket);

  // Switch view content to detail view
  switchView('ticket-detail', null);
  
  // Set header breadcrumb title
  const pageTitleEl = document.getElementById('page-title');
  if (pageTitleEl) {
    pageTitleEl.innerHTML = `
      <span class="text-muted fw-normal" style="cursor: pointer;" onclick="switchView('tickets', null)">Tickets Queue</span> 
      <span class="text-secondary mx-2">/</span> 
      <span class="text-dark">${ticket.id}</span>
    `;
  }
}

// Update field handlers in detailed view
function updateDetailTicketStatus() {
  const ticket = tickets.find(t => t.id === selectedTicketId);
  if (!ticket) return;
  
  const oldStatus = ticket.status;
  const newStatus = document.getElementById('detail-status-select').value;
  ticket.status = newStatus;
  
  ticket.comments.push({
    author: 'System',
    text: `Status changed from "${oldStatus}" to "${newStatus}"`,
    time: 'Just now',
    isSystem: true
  });

  renderDetailTimeline(ticket);
  renderTicketsTable();
  updateMetrics();
  showToast(`Ticket status updated to ${newStatus}`);
}

// Update detail view priority
function updateDetailTicketPriority() {
  const ticket = tickets.find(t => t.id === selectedTicketId);
  if (!ticket) return;

  const oldPriority = ticket.priority;
  const newPriority = document.getElementById('detail-priority-select').value;
  ticket.priority = newPriority;

  ticket.comments.push({
    author: 'System',
    text: `Priority changed from "${oldPriority}" to "${newPriority}"`,
    time: 'Just now',
    isSystem: true
  });

  renderDetailTimeline(ticket);
  renderTicketsTable();
  showToast(`Ticket priority set to ${newPriority}`);
}

// Update detail view assignee
function updateDetailTicketAssignee() {
  const ticket = tickets.find(t => t.id === selectedTicketId);
  if (!ticket) return;

  const oldAssignee = ticket.assignee;
  const newAssignee = document.getElementById('detail-assignee-select').value;
  
  // Decrement tickets on old agent
  if(oldAssignee !== 'Unassigned') {
    const oldAg = agents.find(a => a.name === oldAssignee);
    if(oldAg) oldAg.activeTickets = Math.max(0, oldAg.activeTickets - 1);
  }
  
  // Increment tickets on new agent
  if(newAssignee !== 'Unassigned') {
    const newAg = agents.find(a => a.name === newAssignee);
    if(newAg) newAg.activeTickets++;
  }

  ticket.assignee = newAssignee;

  ticket.comments.push({
    author: 'System',
    text: `Assigned changed from "${oldAssignee}" to "${newAssignee}"`,
    time: 'Just now',
    isSystem: true
  });

  renderDetailTimeline(ticket);
  renderTicketsTable();
  if (typeof renderAgentsList === 'function') renderAgentsList();
  updateMetrics();
  showToast(`Ticket assigned to ${newAssignee}`);
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

  renderDetailTimeline(ticket);
  showToast('Reply posted successfully!');
}
