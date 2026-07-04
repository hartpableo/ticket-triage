// shared/init.js

// Initial Load Trigger
window.onload = function() {
  // Sync profile display name initially
  saveProfile({ preventDefault: () => {} });

  // Set dynamic date in today banner
  const dateEl = document.getElementById('today-date-str');
  if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  populateAssigneesList();
  renderTicketsTable();
  if (typeof renderClientsTable === 'function') renderClientsTable();
  if (typeof renderAgentsList === 'function') renderAgentsList();
  
  updateMetrics(); // Triggers updateAnalytics()
  setTimeframe(currentAnalyticsTimeframe); // Initialize charts & metrics with Today scope

  // Smart defaults: set ticket assignee when client is selected in new ticket modal
  const newClientSelect = document.getElementById('new-client');
  if (newClientSelect) {
    newClientSelect.addEventListener('change', function() {
      const selectedClientName = this.value;
      const client = clients.find(c => c.name === selectedClientName);
      const newAssigneeSelect = document.getElementById('new-assignee');
      if (client && newAssigneeSelect) {
        if (client.assignedAgent && client.assignedAgent !== 'Unassigned') {
          newAssigneeSelect.value = client.assignedAgent;
        } else if (window.defaultClientAgent) {
          newAssigneeSelect.value = window.defaultClientAgent;
        } else {
          newAssigneeSelect.value = 'Unassigned';
        }
      }
    });
  }
};
