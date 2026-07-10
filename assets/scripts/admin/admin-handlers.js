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
  showToast(`Agent invitation / account removed.`, 'info');
}

window.assignClientToAgent = assignClientToAgent;
window.removeAgent = removeAgent;
