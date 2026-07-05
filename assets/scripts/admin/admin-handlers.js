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

window.assignClientToAgent = assignClientToAgent;
window.createNewAgent = createNewAgent;
window.removeAgent = removeAgent;
window.updateDefaultAgent = updateDefaultAgent;
