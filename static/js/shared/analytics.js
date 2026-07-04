// shared/analytics.js

// Update dynamic progress analytics views (Timeframe specific scaling)
function updateAnalytics() {
  const clientListEl = document.getElementById('analytics-client-list');
  if (!clientListEl) return;
  clientListEl.innerHTML = '';
  
  // Group tickets by client name
  const clientCounts = {};
  clients.forEach(c => { clientCounts[c.name] = 0; });
  tickets.forEach(t => {
    if (clientCounts[t.client] !== undefined) {
      clientCounts[t.client]++;
    }
  });

  // Timeframe scale factor
  let scale = 1;
  if (currentAnalyticsTimeframe === 'week') scale = 5;
  else if (currentAnalyticsTimeframe === 'month') scale = 22;

  let scaledTotal = 0;
  Object.keys(clientCounts).forEach(cName => {
    clientCounts[cName] = clientCounts[cName] * scale;
    scaledTotal += clientCounts[cName];
  });
  if (scaledTotal === 0) scaledTotal = 1;

  Object.keys(clientCounts).forEach(clientName => {
    const count = clientCounts[clientName];
    const percentage = Math.round((count / scaledTotal) * 100);
    
    const item = document.createElement('div');
    item.className = 'mb-3';
    item.innerHTML = `
      <div class="d-flex justify-content-between mb-1 small fw-medium">
        <span class="text-dark">${clientName}</span>
        <span class="text-muted">${count} ticket(s) (${percentage}%)</span>
      </div>
      <div class="progress" style="height: 6px;">
        <div class="progress-bar bg-primary" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
    clientListEl.appendChild(item);
  });

  // Group tickets by category
  const catListEl = document.getElementById('analytics-category-list');
  if (catListEl) {
    catListEl.innerHTML = '';
    const catCounts = { 'Bug': 0, 'Feature Request': 0, 'Task': 0, 'Question': 0 };
    tickets.forEach(t => {
      if (catCounts[t.category] !== undefined) {
        catCounts[t.category]++;
      } else {
        catCounts[t.category] = 1;
      }
    });

    let scaledCatTotal = 0;
    Object.keys(catCounts).forEach(c => {
      catCounts[c] = catCounts[c] * scale;
      scaledCatTotal += catCounts[c];
    });
    if (scaledCatTotal === 0) scaledCatTotal = 1;

    Object.keys(catCounts).forEach(cat => {
      const count = catCounts[cat];
      const percentage = Math.round((count / scaledCatTotal) * 100);
      
      const item = document.createElement('div');
      item.className = 'mb-3';
      item.innerHTML = `
        <div class="d-flex justify-content-between mb-1 small fw-medium">
          <span class="text-dark">${cat}</span>
          <span class="text-muted">${count} (${percentage}%)</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar bg-info" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      `;
      catListEl.appendChild(item);
    });
  }

  // Group tickets by priority
  const priListEl = document.getElementById('analytics-priority-list');
  if (priListEl) {
    priListEl.innerHTML = '';
    const priCounts = { 'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0 };
    tickets.forEach(t => {
      if (priCounts[t.priority] !== undefined) {
        priCounts[t.priority]++;
      }
    });

    let scaledPriTotal = 0;
    Object.keys(priCounts).forEach(p => {
      priCounts[p] = priCounts[p] * scale;
      scaledPriTotal += priCounts[p];
    });
    if (scaledPriTotal === 0) scaledPriTotal = 1;

    Object.keys(priCounts).forEach(pri => {
      const count = priCounts[pri];
      const percentage = Math.round((count / scaledPriTotal) * 100);
      
      let colorClass = 'bg-secondary';
      if (pri === 'Critical') colorClass = 'bg-danger';
      else if (pri === 'High') colorClass = 'bg-warning';
      else if (pri === 'Medium') colorClass = 'bg-primary';
      else if (pri === 'Low') colorClass = 'bg-info';

      const item = document.createElement('div');
      item.className = 'mb-3';
      item.innerHTML = `
        <div class="d-flex justify-content-between mb-1 small fw-medium">
          <span class="text-dark">${pri}</span>
          <span class="text-muted">${count} (${percentage}%)</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      `;
      priListEl.appendChild(item);
    });
  }
}

// Switch timeframe settings view
function setTimeframe(timeframe) {
  currentAnalyticsTimeframe = timeframe;

  // Toggle active timeframe UI buttons
  const timeBtn1 = document.getElementById('timeframe-day');
  const timeBtn2 = document.getElementById('timeframe-week');
  const timeBtn3 = document.getElementById('timeframe-month');
  if (timeBtn1) timeBtn1.classList.remove('active');
  if (timeBtn2) timeBtn2.classList.remove('active');
  if (timeBtn3) timeBtn3.classList.remove('active');
  
  const activeBtn = document.getElementById(`timeframe-${timeframe}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Timeframe performance metrics values
  const kpis = {
    day: { response: '18m', resolution: '4.2h', resolutionRate: '94.2%', csat: '4.9/5' },
    week: { response: '24m', resolution: '5.8h', resolutionRate: '91.8%', csat: '4.7/5' },
    month: { response: '31m', resolution: '6.5h', resolutionRate: '88.5%', csat: '4.6/5' }
  };

  const currentKpis = kpis[timeframe];
  const respEl = document.getElementById('kpi-avg-response');
  const resEl = document.getElementById('kpi-avg-resolution');
  const rateEl = document.getElementById('kpi-resolution-rate');
  const csatEl = document.getElementById('kpi-client-satisfaction');
  
  if (respEl) respEl.innerText = currentKpis.response;
  if (resEl) resEl.innerText = currentKpis.resolution;
  if (rateEl) rateEl.innerText = currentKpis.resolutionRate;
  if (csatEl) csatEl.innerText = currentKpis.csat;

  // Render corresponding Volume Bar Chart
  const chartBarsEl = document.getElementById('analytics-chart-bars');
  const chartTitleEl = document.getElementById('chart-title');
  if (!chartBarsEl) return;
  chartBarsEl.innerHTML = '';

  if (timeframe === 'day') {
    if (chartTitleEl) chartTitleEl.innerText = "Today's Hourly Ticket Volume";
    const hourlyData = [
      { label: '9 AM', count: 2, height: 40 },
      { label: '11 AM', count: 5, height: 100 },
      { label: '1 PM', count: 1, height: 20 },
      { label: '3 PM', count: 4, height: 80 },
      { label: '5 PM', count: 2, height: 40 }
    ];
    hourlyData.forEach(item => {
      chartBarsEl.appendChild(createChartBar(item.label, item.count, item.height));
    });
  } else if (timeframe === 'week') {
    if (chartTitleEl) chartTitleEl.innerText = 'Weekly Ticket Volume (Daily)';
    const weeklyData = [
      { label: 'Mon', count: 12, height: 120 },
      { label: 'Tue', count: 18, height: 180 },
      { label: 'Wed', count: 8, height: 80 },
      { label: 'Thu', count: 15, height: 150 },
      { label: 'Fri', count: 22, height: 220 }
    ];
    weeklyData.forEach(item => {
      chartBarsEl.appendChild(createChartBar(item.label, item.count, item.height));
    });
  } else if (timeframe === 'month') {
    if (chartTitleEl) chartTitleEl.innerText = 'Monthly Ticket Volume (Weekly)';
    const monthlyData = [
      { label: 'Week 1', count: 45, height: 110 },
      { label: 'Week 2', count: 62, height: 180 },
      { label: 'Week 3', count: 38, height: 95 },
      { label: 'Week 4', count: 54, height: 145 }
    ];
    monthlyData.forEach(item => {
      chartBarsEl.appendChild(createChartBar(item.label, item.count, item.height));
    });
  }

  // Trigger distribution list calculations update
  updateAnalytics();
}

function createChartBar(label, count, height) {
  const col = document.createElement('div');
  col.className = 'text-center w-100 d-flex flex-column align-items-center';
  col.innerHTML = `
    <span class="small fw-semibold text-muted mb-2">${count}</span>
    <div class="bg-primary rounded-top" style="width: 32px; height: ${height}px; opacity: 0.9;"></div>
    <span class="small text-muted mt-2 fw-medium">${label}</span>
  `;
  return col;
}

function updateMetrics() {
  // Scoped view metrics logic for member dashboards (non-admin accounts)
  const isScoped = userProfile.role !== 'Agency Admin';
  const filteredList = isScoped ? tickets.filter(t => t.assignee === userProfile.name) : tickets;

  const total = filteredList.length;
  const open = filteredList.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const pending = filteredList.filter(t => t.status === 'Pending Client').length;
  const resolved = filteredList.filter(t => t.status === 'Resolved').length;

  const tEl = document.getElementById('stat-total');
  const oEl = document.getElementById('stat-open');
  const pEl = document.getElementById('stat-pending');
  const rEl = document.getElementById('stat-resolved');
  
  if (tEl) tEl.innerText = total;
  if (oEl) oEl.innerText = open;
  if (pEl) pEl.innerText = pending;
  if (rEl) rEl.innerText = resolved;

  // Trigger updates
  updateAnalytics();
}
