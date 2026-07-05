// Assign client to agent handler
function assignClientToAgent(clientKey, agentName) {
  const client = clients.find(c => c.key === clientKey);
  if (!client) return;
  client.assignedAgent = agentName;
  showToast(`Client "${client.name}" assigned to ${agentName}`, 'success');
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
window.removeAgent = removeAgent;
window.updateDefaultAgent = updateDefaultAgent;
