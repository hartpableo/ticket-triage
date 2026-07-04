// shared/router.js

// View Routing Control
function switchView(viewId, element) {
  // Toggle active link class in sidebar
  if (element) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active');
    });
    element.classList.add('active');
  } else if (viewId === 'tickets') {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    if (sidebarLinks.length > 0) {
      sidebarLinks.forEach(link => link.classList.remove('active'));
      sidebarLinks[0].classList.add('active');
    }
  }
  
  // Switch views display
  document.querySelectorAll('.view-content').forEach(view => {
    view.classList.remove('active-view');
  });
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) targetView.classList.add('active-view');
  
  // Set Header Title
  const pageTitleMap = {
    'tickets': 'Tickets Queue',
    'analytics': 'Performance & Volume Analytics',
    'clients': 'Clients Directory',
    'team': 'Agency Team Roster',
    'settings': 'Dashboard Configurations',
    'ticket-detail': 'Ticket Thread Details'
  };
  
  const titleEl = document.getElementById('page-title');
  if (titleEl && viewId !== 'ticket-detail') {
    titleEl.innerText = pageTitleMap[viewId] || '';
  }
}
