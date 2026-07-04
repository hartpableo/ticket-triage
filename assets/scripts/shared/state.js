// shared/state.js
let tickets = [
  {
    id: 'TKT-101',
    title: 'Checkout button not working on Safari',
    client: 'Aura Cosmetics',
    category: 'Bug',
    status: 'Open',
    priority: 'High',
    assignee: 'Sarah Connor',
    createdAt: '2 hours ago',
    description: 'Clients are reporting that when trying to purchase items on Safari, the checkout button stays in a loading state and never redirects to Stripe. This is causing loss of sales and needs immediate attention to debug the Apple Pay / WebKit event listener.',
    attachments: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60', name: 'safari_bug_screenshot.png' }
    ],
    comments: [
      { author: 'System', text: 'Ticket created via aurafeedback_widget v1.2', time: '2 hours ago', isSystem: true },
      { author: 'Client (Aura)', text: 'Help! We are losing checkout sales because of this Safari checkout bug. Please fix ASAP!', time: '2 hours ago', isSystem: false },
      { author: 'Sarah Connor', text: 'Investigating the issue. It seems like it might be an issue with Safari\'s treatment of async event loops. Checking the compiled checkout JS bundle now.', time: '1 hour ago', isSystem: false, attachments: [
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34282-large.mp4', name: 'console_logs_recording.mp4' }
      ]}
    ]
  },
  {
    id: 'TKT-102',
    title: 'Implement new testimonials section on homepage',
    client: 'Vertex SaaS',
    category: 'Feature Request',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Alex Mercer',
    createdAt: '5 hours ago',
    description: 'Please add a testimonials slider on the homepage below the features grid. We will use a standard carousel layout with client photos, job titles, and 2-sentence quotes. Mockups have been attached in email thread.',
    comments: [
      { author: 'System', text: 'Ticket submitted via client dashboard', time: '5 hours ago', isSystem: true },
      { author: 'Alex Mercer', text: 'Mockups checked. Starting implementation in the staging environment. Will request client review once deployed.', time: '4 hours ago', isSystem: false }
    ]
  },
  {
    id: 'TKT-103',
    title: 'Contact form submissions sending duplicates',
    client: 'Greenfield Real Estate',
    category: 'Bug',
    status: 'Pending Client',
    priority: 'Low',
    assignee: 'Sarah Connor',
    createdAt: '1 day ago',
    description: 'Whenever a user submits the contact form, the administration email receives duplicate alerts, and database logs show double entries. We need client access keys to check their HubSpot integration settings.',
    comments: [
      { author: 'System', text: 'Ticket created', time: '1 day ago', isSystem: true },
      { author: 'Sarah Connor', text: 'Hi Team, I inspected the frontend JS. It looks like the submit event is being bound twice. Could you provide your staging HubSpot API credentials so I can test the integration directly?', time: '18 hours ago', isSystem: false }
    ]
  },
  {
    id: 'TKT-104',
    title: 'Setup Google Analytics 4 tracking events',
    client: 'Aura Cosmetics',
    category: 'Task',
    status: 'Resolved',
    priority: 'Medium',
    assignee: 'David Miller',
    createdAt: '2 days ago',
    description: 'Configure custom event tracking for "Add to Cart", "Initiate Checkout", and "Purchase" inside GA4, and verify trigger flow matching in Google Tag Manager.',
    comments: [
      { author: 'System', text: 'Ticket created', time: '2 days ago', isSystem: true },
      { author: 'David Miller', text: 'Analytics events successfully set up and verified inside Tag Assistant. Marking this as resolved.', time: '1 day ago', isSystem: false }
    ]
  },
  {
    id: 'TKT-105',
    title: 'Database connection timeout during traffic peak',
    client: 'Vertex SaaS',
    category: 'Bug',
    status: 'Open',
    priority: 'Critical',
    assignee: 'Unassigned',
    createdAt: '10 mins ago',
    description: 'The production database is throwing connection timeout errors. CPU usage peaked at 98% during our weekly email newsletter campaign. We need query optimization and index auditing on the articles table immediately.',
    comments: [
      { author: 'System', text: 'Critical ticket submitted via direct API trigger', time: '10 mins ago', isSystem: true }
    ]
  }
];

let clients = [
  { name: 'Aura Cosmetics', domain: 'auracosmetics.com', status: 'Active', tickets: 2, key: 'cl_aura_983281', assignedAgent: 'Sarah Connor' },
  { name: 'Vertex SaaS', domain: 'vertexsaas.io', status: 'Active', tickets: 2, key: 'cl_vertex_332109', assignedAgent: 'Alex Mercer' },
  { name: 'Greenfield Real Estate', domain: 'greenfieldhomes.com', status: 'Active', tickets: 1, key: 'cl_greenfield_882319', assignedAgent: 'David Miller' },
  { name: 'BlueSky Travel', domain: 'blueskytravels.com', status: 'Inactive', tickets: 0, key: 'cl_bluesky_445210', assignedAgent: 'Unassigned' }
];

let agents = [
  { name: 'Sarah Connor', email: 'sarah@agency.com', role: 'Regular Member', activeTickets: 2, status: 'Active' },
  { name: 'Alex Mercer', email: 'alex.m@agency.com', role: 'Regular Member', activeTickets: 1, status: 'Active' },
  { name: 'David Miller', email: 'david@agency.com', role: 'Regular Member', activeTickets: 1, status: 'Active' }
];

let selectedTicketId = null;
let currentAnalyticsTimeframe = 'day';
window.defaultClientAgent = 'Sarah Connor';

window.tickets = tickets;
window.clients = clients;
window.agents = agents;
window.selectedTicketId = selectedTicketId;
window.currentAnalyticsTimeframe = currentAnalyticsTimeframe;
