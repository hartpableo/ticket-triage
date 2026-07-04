// shared/rendering.js

function renderTicketsTable(dataToRender = tickets) {
  const tableBody = document.getElementById('tickets-table-body');
  const emptyState = document.getElementById('empty-state');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';

  // Filter to show only tickets assigned to the logged-in member if it is a member dashboard
  const isScoped = userProfile.role !== 'Agency Admin';
  const scopedData = isScoped ? dataToRender.filter(t => t.assignee === userProfile.name) : dataToRender;

  if (scopedData.length === 0) {
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }
  if (emptyState) emptyState.classList.add('d-none');

  scopedData.forEach(ticket => {
    const tr = document.createElement('tr');
    tr.onclick = () => openTicketDetails(ticket.id);

    const statusClass = `status-${ticket.status.toLowerCase().replace(' ', '-')}`;
    const priorityClass = `priority-${ticket.priority.toLowerCase()}`;

    // Initials for avatar
    const initials = ticket.assignee !== 'Unassigned'
      ? ticket.assignee.split(' ').map(n => n[0]).join('')
      : '--';

    tr.innerHTML = `
      <td class="fw-semibold text-muted text-nowrap" data-label="ID">${ticket.id}</td>
      <td data-label="Subject">
        <div class="fw-semibold text-dark text-truncate subject-title" style="max-width: 250px;">${ticket.title}</div>
        <div class="text-muted text-truncate text-nowrap mt-1 subject-desc" style="font-size: 0.75rem; max-width: 250px;">${ticket.description}</div>
      </td>
      <td data-label="Client"><span class="text-secondary fw-medium">${ticket.client}</span></td>
      <td data-label="Status"><span class="badge-custom ${statusClass}">${ticket.status}</span></td>
      <td data-label="Priority"><span class="badge-custom ${priorityClass}">${ticket.priority}</span></td>
      <td data-label="Assigned To">
        <div class="d-flex align-items-center gap-2 justify-content-end justify-content-md-start">
          <div class="avatar bg-light text-muted border text-uppercase" style="width: 26px; height: 26px; font-size: 0.7rem;">${initials}</div>
          <span class="text-secondary small fw-medium">${ticket.assignee}</span>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderClientsTable() {
  const tableBody = document.getElementById('clients-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';
  
  clients.forEach(client => {
    const tr = document.createElement('tr');
    const statusBadge = client.status === 'Active' 
      ? '<span class="badge bg-success-subtle text-success">Active Portal</span>'
      : '<span class="badge bg-secondary-subtle text-secondary">Inactive</span>';
    
    const assigned = client.assignedAgent || 'Unassigned';
    let selectHtml = `<select class="form-select form-select-sm" style="max-width: 185px;" onchange="assignClientToAgent('${client.key}', this.value)">`;
    const defaultText = window.defaultClientAgent && window.defaultClientAgent !== 'Unassigned'
      ? `Unassigned (Default: ${window.defaultClientAgent})`
      : 'Unassigned';
    selectHtml += `<option value="Unassigned" ${assigned === 'Unassigned' ? 'selected' : ''}>${defaultText}</option>`;
    agents.forEach(agent => {
      const selectedAttr = assigned === agent.name ? 'selected' : '';
      const label = agent.status === 'Active' ? agent.name : `${agent.name} (Invited)`;
      selectHtml += `<option value="${agent.name}" ${selectedAttr}>${label}</option>`;
    });
    selectHtml += `</select>`;
    
    tr.innerHTML = `
      <td class="fw-semibold text-dark" data-label="Client Name">${client.name}</td>
      <td data-label="Widget Domain"><code>${client.domain}</code></td>
      <td data-label="Status">${statusBadge}</td>
      <td class="fw-semibold" data-label="Open Tickets">${client.tickets}</td>
      <td data-label="Assigned Agent">${selectHtml}</td>
      <td data-label="Actions">
        <button class="btn btn-light btn-sm border" onclick="selectWidgetSnippet('${client.name}', '${client.key}', '${client.domain}')">
          <i class="bi bi-code-slash me-1"></i> Get Script
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderAgentsList() {
  const listContainer = document.getElementById('agents-settings-list');
  if (!listContainer) return;
  listContainer.innerHTML = '';
  
  agents.forEach(agent => {
    const item = document.createElement('div');
    item.className = 'list-group-item d-flex align-items-center justify-content-between py-3 border-light-subtle';
    
    const initials = agent.name ? agent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AG';
    const isPending = agent.status !== 'Active';
    const isAdmin = agent.role === 'Admin';
    
    const roleBadgeClass = isAdmin ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary';
    const statusBadge = isPending 
      ? `<span class="badge bg-warning-subtle text-warning ms-2" style="font-size: 0.7rem;">Invite Sent (${agent.role})</span>`
      : `<span class="badge ${roleBadgeClass} ms-2" style="font-size: 0.7rem;">${agent.role}</span>`;
    
    item.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="avatar text-white me-3 bg-primary bg-opacity-75 text-uppercase" style="font-weight:700;">${initials}</div>
        <div>
          <h6 class="mb-0 fw-semibold text-dark">${agent.name}</h6>
          <span class="text-muted small">${agent.email}</span> ${statusBadge}
        </div>
      </div>
      <div class="text-end">
        <span class="badge bg-light text-dark border me-2">${agent.activeTickets} Active Tickets</span>
        <button class="btn btn-outline-danger btn-sm border-0" onclick="removeAgent('${agent.email}')"><i class="bi bi-trash"></i></button>
      </div>
    `;
    listContainer.appendChild(item);
  });

  updateTeamStats();
}

function updateTeamStats() {
  const activeCount = agents.filter(a => a.status === 'Active').length;
  const pendingCount = agents.filter(a => a.status !== 'Active').length;
  const actEl = document.getElementById('team-stat-active');
  const pendEl = document.getElementById('team-stat-pending');
  if (actEl) actEl.innerText = activeCount;
  if (pendEl) pendEl.innerText = pendingCount;
}

// Populate Assignees List inside Select Dropdown
function populateAssigneesList() {
  const detailSelect = document.getElementById('detail-assignee-select');
  if (detailSelect) {
    detailSelect.innerHTML = '<option value="Unassigned">Unassigned</option>';
    agents.forEach(agent => {
      const opt = document.createElement('option');
      opt.value = agent.name;
      opt.text = agent.status === 'Active' ? agent.name : `${agent.name} (Invited)`;
      detailSelect.appendChild(opt);
    });
  }

  const newTicketSelect = document.getElementById('new-assignee');
  if (newTicketSelect) {
    newTicketSelect.innerHTML = '<option value="Unassigned">Leave Unassigned</option>';
    agents.forEach(agent => {
      const opt = document.createElement('option');
      opt.value = agent.name;
      opt.text = agent.status === 'Active' ? agent.name : `${agent.name} (Invited)`;
      newTicketSelect.appendChild(opt);
    });
  }

  const newClientSelect = document.getElementById('client-assignee-input');
  if (newClientSelect) {
    newClientSelect.innerHTML = '<option value="Unassigned">Unassigned</option>';
    agents.forEach(agent => {
      const opt = document.createElement('option');
      opt.value = agent.name;
      opt.text = agent.status === 'Active' ? agent.name : `${agent.name} (Invited)`;
      newClientSelect.appendChild(opt);
    });
  }

  const defaultAgentSelect = document.getElementById('default-agent-select');
  if (defaultAgentSelect) {
    defaultAgentSelect.innerHTML = '<option value="Unassigned">None (Leave Unassigned)</option>';
    agents.forEach(agent => {
      const opt = document.createElement('option');
      opt.value = agent.name;
      opt.text = agent.status === 'Active' ? agent.name : `${agent.name} (Invited)`;
      if (agent.name === window.defaultClientAgent) {
        opt.selected = true;
      }
      defaultAgentSelect.appendChild(opt);
    });
  }
}

// Render detail view timeline activity comments
function renderDetailTimeline(ticket) {
  const timeline = document.getElementById('detail-timeline');
  if (!timeline) return;
  timeline.innerHTML = '';

  ticket.comments.forEach(comment => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    let bubbleClass = 'bg-light text-dark border';
    let badgeClass = '';
    let headerHtml = '';
    let authorText = `<strong class="text-dark">${comment.author}</strong>`;

    if (comment.author === 'System') {
      bubbleClass = 'bg-light-subtle text-secondary border border-dashed py-2 px-3';
      badgeClass = 'system';
      authorText = `<span class="text-muted fw-semibold" style="font-size: 0.8rem;"><i class="bi bi-gear-fill me-1"></i> System Log</span>`;
    } else if (comment.author.includes('Internal Note') || (comment.isSystem && comment.author !== 'System')) {
      bubbleClass = 'bg-warning-subtle text-warning-emphasis border-warning-subtle';
      badgeClass = 'internal';
      const cleanAuthor = comment.author.replace(' (Internal Note)', '');
      authorText = `<strong class="text-dark">${cleanAuthor}</strong>`;
      headerHtml = `<div class="d-flex align-items-center justify-content-between mb-1 pb-1 border-bottom border-warning-subtle border-opacity-50">
        <span class="badge bg-warning text-warning-emphasis fw-bold" style="font-size: 0.65rem;"><i class="bi bi-lock-fill me-1"></i> INTERNAL NOTE</span>
      </div>`;
    } else if (comment.author.includes('Client')) {
      bubbleClass = 'bg-white text-dark border-light-subtle shadow-sm';
      authorText = `<strong class="text-primary"><i class="bi bi-person-fill me-1"></i> ${comment.author}</strong>`;
    } else {
      bubbleClass = 'bg-white text-dark border-light-subtle shadow-sm';
      authorText = `<strong class="text-dark"><i class="bi bi-patch-check-fill text-info me-1"></i> ${comment.author}</strong>`;
    }

    let attachmentsHtml = '';
    if (comment.attachments && comment.attachments.length > 0) {
      attachmentsHtml += '<div class="mt-3 d-flex flex-wrap gap-2">';
      comment.attachments.forEach(file => {
        if (file.type === 'image') {
          attachmentsHtml += `
            <div class="border rounded bg-white p-2 text-center" style="max-width: 240px;">
              <img src="${file.url}" class="img-fluid rounded border mb-2" style="max-height: 140px; object-fit: cover; cursor: pointer;" onclick="window.open('${file.url}')" alt="${file.name}">
              <div class="text-truncate small text-muted text-start" style="font-size: 0.75rem;">
                <i class="bi bi-image me-1"></i> ${file.name}
              </div>
            </div>
          `;
        } else if (file.type === 'video') {
          attachmentsHtml += `
            <div class="border rounded bg-white p-2 text-center" style="max-width: 320px; width: 100%;">
              <video src="${file.url}" controls class="w-100 rounded border mb-2" style="max-height: 180px;"></video>
              <div class="text-truncate small text-muted text-start" style="font-size: 0.75rem;">
                <i class="bi bi-play-btn me-1"></i> ${file.name}
              </div>
            </div>
          `;
        }
      });
      attachmentsHtml += '</div>';
    }

    item.innerHTML = `
      <div class="timeline-badge ${badgeClass}"></div>
      <div class="small text-muted mb-1">${comment.time}</div>
      <div class="p-3 rounded-3 fs-7 ${bubbleClass}" style="font-size: 0.875rem;">
        ${headerHtml}
        <div class="mb-1">${authorText}</div>
        <div style="white-space: pre-wrap;">${comment.text}</div>
        ${attachmentsHtml}
      </div>
    `;
    timeline.appendChild(item);
  });
}
