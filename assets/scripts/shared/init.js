// shared/init.js

// Initial Load Trigger
window.onload = function() {
  // Sync inputs from userProfile state if available
  const nameEl = document.getElementById('profile-name');
  const titleEl = document.getElementById('profile-title');
  if (nameEl && window.userProfile) nameEl.value = window.userProfile.name;
  if (titleEl && window.userProfile) titleEl.value = window.userProfile.role;

  // Sync profile display name initially
  saveProfile({ preventDefault: () => {} });

  // Set dynamic date in today banner
  const dateEl = document.getElementById('today-date-str');
  if (dateEl) {
    dateEl.innerText = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  updateMetrics(); // Triggers updateAnalytics()
  setTimeframe(currentAnalyticsTimeframe); // Initialize charts & metrics with Today scope

  if (window.selectedTicketId) {
    openTicketDetails(window.selectedTicketId);
  }

};

// Event delegation for new client select defaults
document.addEventListener('change', function(e) {
  if (e.target && e.target.id === 'new-client') {
    const selectedClientName = e.target.options[e.target.selectedIndex] ? e.target.options[e.target.selectedIndex].text : '';
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
  }
});

