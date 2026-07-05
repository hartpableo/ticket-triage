// Ticket creation handler
// function createNewTicket(event) {
//   event.preventDefault();
//
//   const newId = `TKT-${tickets.length + 101}`;
//   const title = document.getElementById('new-title').value;
//   const client = document.getElementById('new-client').value;
//   const category = document.getElementById('new-category').value;
//   const priority = document.getElementById('new-priority').value;
//   let assignee = document.getElementById('new-assignee').value;
//   const description = document.getElementById('new-description').value;
//
//   // Fallback assignee to client's assigned agent or default client agent if Unassigned
//   if (assignee === 'Unassigned') {
//     const clientObj = clients.find(c => c.name === client);
//     if (clientObj && clientObj.assignedAgent && clientObj.assignedAgent !== 'Unassigned') {
//       assignee = clientObj.assignedAgent;
//     } else if (window.defaultClientAgent && window.defaultClientAgent !== 'Unassigned') {
//       assignee = window.defaultClientAgent;
//     }
//   }
//
//   const newTicket = {
//     id: newId,
//     title: title,
//     client: client,
//     category: category,
//     status: 'Open',
//     priority: priority,
//     assignee: assignee,
//     createdAt: 'Just now',
//     description: description,
//     comments: [
//       { author: 'System', text: 'Ticket registered manually via admin panel', time: 'Just now', isSystem: true }
//     ]
//   };
//
//   tickets.unshift(newTicket); // Add to beginning of array
//
//   // Update Client tickets count
//   const clientObj = clients.find(c => c.name === client);
//   if(clientObj) clientObj.tickets++;
//
//   // Update Agent active tickets count
//   if (assignee !== 'Unassigned') {
//     const agentObj = agents.find(a => a.name === assignee);
//     if (agentObj) agentObj.activeTickets++;
//   }
//
//   // Reset Form
//   document.getElementById('new-ticket-form').reset();
//
//   // Close Modal
//   const modal = bootstrap.Modal.getInstance(document.getElementById('newTicketModal'));
//   modal.hide();
//
//   // Refresh UI
//   renderTicketsTable();
//   renderClientsTable();
//   if (typeof renderAgentsList === 'function') renderAgentsList();
//   updateMetrics();
//
//   showToast(`Ticket ${newId} Created successfully!`, 'success');
// }

// Client creation handler
function createNewClient(event) {
  event.preventDefault();
  const name = document.getElementById('client-name-input').value;
  const domain = document.getElementById('client-domain-input').value;
  const assignedAgent = document.getElementById('client-assignee-input') ? document.getElementById('client-assignee-input').value : 'Unassigned';
  const key = `cl_${name.toLowerCase().replace(/\s+/g, '_')}_${Math.floor(100000 + Math.random() * 900000)}`;

  clients.push({
    name: name,
    domain: domain,
    status: 'Active',
    tickets: 0,
    key: key,
    assignedAgent: assignedAgent
  });

  // Add option to client dropdown filters
  const filterSelect = document.getElementById('filter-client');
  if (filterSelect) {
    const optionFilter = document.createElement('option');
    optionFilter.value = name;
    optionFilter.text = name;
    filterSelect.appendChild(optionFilter);
  }

  // Add option to create ticket form client dropdown
  const ticketSelect = document.getElementById('new-client');
  if (ticketSelect) {
    const optionTicket = document.createElement('option');
    optionTicket.value = name;
    optionTicket.text = name;
    ticketSelect.appendChild(optionTicket);
  }

  document.getElementById('new-client-form').reset();
  bootstrap.Modal.getInstance(document.getElementById('addClientModal')).hide();

  renderClientsTable();
  updateMetrics(); // Triggers updateAnalytics redraw
  showToast(`Client "${name}" registered successfully!`, 'success');
}

// Assign client to agent handler
function assignClientToAgent(clientKey, agentName) {
  const client = clients.find(c => c.key === clientKey);
  if (!client) return;
  client.assignedAgent = agentName;
  showToast(`Client "${client.name}" assigned to ${agentName}`, 'success');
}

// Invite Agent Handler (Email and Role selection)
function createNewAgent(event) {
  event.preventDefault();
  const email = document.getElementById('agent-email-input').value.trim();
  const role = document.getElementById('agent-role-input').value;

  // Check if email already invited/exists
  if (agents.some(a => a.email === email)) {
    showToast('This email has already been invited or is already active.', 'warning');
    return;
  }

  // Split email prefix for a placeholder name
  const prefix = email.split('@')[0];
  const nameStr = prefix.charAt(0).toUpperCase() + prefix.slice(1);

  agents.push({
    name: nameStr,
    email: email,
    role: role,
    activeTickets: 0,
    status: 'Invite Sent (Pending)'
  });

  // Re-populate selects
  // populateAssigneesList();

  document.getElementById('new-agent-form').reset();
  bootstrap.Modal.getInstance(document.getElementById('addAgentModal')).hide();

  renderAgentsList();
  showToast(`Invitation email dispatched to ${email}!`, 'success');
}

// Remove Agent
function removeAgent(email) {
  agents = agents.filter(a => a.email !== email);
  // populateAssigneesList();
  renderAgentsList();
  showToast(`Agent invitation / account removed.`, 'info');
}

// Update Default Agent for Unassigned Clients
function updateDefaultAgent(agentName) {
  window.defaultClientAgent = agentName;
  renderClientsTable();
  showToast(`Default agent for unassigned clients updated to: ${agentName}`, 'success');
}

// window.createNewTicket = createNewTicket;
window.createNewClient = createNewClient;
window.assignClientToAgent = assignClientToAgent;
window.createNewAgent = createNewAgent;
window.removeAgent = removeAgent;
window.updateDefaultAgent = updateDefaultAgent;
