// Sidebar navigation
// function showSection(section) {
//     document.getElementById('dashboardSection').classList.add('hidden');
//     document.getElementById('createPollSection').classList.add('hidden');
//     document.getElementById('managePollsSection').classList.add('hidden');
  
//     document.getElementById(`${section}Section`).classList.remove('hidden');
  
//     document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
//     event.target.classList.add('active');
  
//     if (section === 'dashboard') loadDashboard();
//     if (section === 'managePolls') loadManagePolls();
//   }
  
//   // Logout
//   function logout() {
//     localStorage.clear();
//     window.location.href = '/login';
//   }
  
//   // Set welcome message
//   const username = localStorage.getItem('username') || 'Teacher';
//   document.getElementById('welcomeMessage').textContent = `Welcome, ${username} 🎓`;
  
//   // Create Poll - Add options
//   function addOption() {
//     const input = document.createElement('input');
//     input.type = 'text';
//     input.className = 'option';
//     input.placeholder = 'Another option';
//     document.getElementById('createPollForm').insertBefore(input, document.querySelector('#createPollForm button[type="submit"]'));
//   }
  
//   // Create Poll - Submit form
//   document.getElementById('createPollForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const question = document.getElementById('question').value;
//     const options = Array.from(document.querySelectorAll('.option')).map(opt => opt.value);
//     const created_by = localStorage.getItem('teacher_id') || 1;
  
//     const res = await fetch('/poll/create', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ question, options, created_by })
//     });
  
//     const data = await res.json();
//     document.getElementById('createMsg').textContent = data.message;
//     document.getElementById('createPollForm').reset();
//   });
  
function showSection(section) {
    // First, hide all sections
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('createPollSection').classList.add('hidden');
    document.getElementById('managePollsSection').classList.add('hidden');
  
    // Remove active highlight from all sidebar buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
    // Handle each section
    if (section === 'dashboard') {
      document.getElementById('dashboardSection').classList.remove('hidden');
      document.querySelector('.nav-btn:nth-child(2)').classList.add('active');
      loadDashboard();
    }
    else if (section === 'createPoll') {
      document.getElementById('createPollSection').classList.remove('hidden');
      document.querySelector('.nav-btn:nth-child(3)').classList.add('active');
    }
    else if (section === 'managePolls') {
      document.getElementById('managePollsSection').classList.remove('hidden');
      document.querySelector('.nav-btn:nth-child(4)').classList.add('active');
      loadManagePolls();
    }
    else if (section === 'logout') {
      logout();
    }
  }
  
  
  
  // Load Dashboard
  async function loadDashboard() {
    const res = await fetch('/poll/dashboard_polls');
    const polls = await res.json();
    const teacherId = Number(localStorage.getItem('teacher_id')) || 1;
  
    document.getElementById('totalPolls').textContent = polls.length;
  
    const myPolls = polls.filter(p => Number(p.created_by) === teacherId);
    document.getElementById('myPolls').textContent = myPolls.length;
  
    let myTotalAnswers = 0;
    for (const poll of myPolls) {
      const resultRes = await fetch(`/poll/results/${poll.id}`);
      const results = await resultRes.json();
      myTotalAnswers += results.reduce((sum, r) => sum + r.votes, 0);
    }
    document.getElementById('totalAnswers').textContent = myTotalAnswers;
  
    const recentPollsBody = document.getElementById('recentPollsBody');
    recentPollsBody.innerHTML = '';
  
    const recentPolls = myPolls.slice(-5).reverse();
    for (const poll of recentPolls) {
      const resultRes = await fetch(`/poll/results/${poll.id}`);
      const results = await resultRes.json();
      const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${poll.question}</td>
        <td>${totalVotes}</td>
        <td>${poll.created_at ? new Date(poll.created_at).toLocaleDateString() : 'N/A'}</td>
      `;
      recentPollsBody.appendChild(tr);
    }
  }
  
//   async function showAllPolls() {
//     // Hide all other sections first
//     document.getElementById('dashboardSection').classList.add('hidden');
//     document.getElementById('createPollSection').classList.add('hidden');
//     document.getElementById('managePollsSection').classList.remove('hidden');
  
//     // Remove active class from sidebar buttons
//     document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
//     // Fetch all polls (now getting created_by_name from backend)
//     const res = await fetch('/poll/dashboard_polls');
//     const polls = await res.json();
  
//     const container = document.getElementById('managePollsContainer');
//     container.innerHTML = '';
  
//     if (polls.length === 0) {
//       container.innerHTML = '<p style="text-align:center;">No polls available.</p>';
//       return;
//     }
  
//     // Loop through each poll and display
//     polls.forEach(poll => {
//       const pollDiv = document.createElement('div');
//       pollDiv.className = 'poll-card';
//       pollDiv.innerHTML = `
//         <h3 style="margin-bottom: 10px;">${poll.question}</h3>
//         <p style="font-size: 16px; color: #555;">Created By: ${poll.created_by_name}</p>
//       `;
//       container.appendChild(pollDiv);
//     });
//   }
  async function showAllPolls() {
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('createPollSection').classList.add('hidden');
    document.getElementById('managePollsSection').classList.remove('hidden');
  
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
    const res = await fetch('/poll/dashboard_polls');
    const polls = await res.json();
  
    const container = document.getElementById('managePollsContainer');
    container.innerHTML = '';
  
    if (polls.length === 0) {
      container.innerHTML = '<p style="text-align:center;">No polls available.</p>';
      return;
    }
  
    polls.forEach(poll => {
      const pollDiv = document.createElement('div');
      pollDiv.className = 'poll-card';
      pollDiv.innerHTML = `
        <h3 class="poll-question">${poll.question}</h3>
        <p class="created-by">Created By: ${poll.created_by_name}</p>
      `;
      container.appendChild(pollDiv);
    });
  }
  
  
  // Load Manage Polls
  async function loadManagePolls() {
    const res = await fetch('/poll/dashboard_polls');
    const polls = await res.json();
    const teacherId = Number(localStorage.getItem('teacher_id')) || 1;
  
    const myPolls = polls.filter(p => Number(p.created_by) === teacherId);
  
    const container = document.getElementById('managePollsContainer');
    container.innerHTML = '';
  
    if (myPolls.length === 0) {
      container.innerHTML = '<p style="text-align:center;">No polls created yet.</p>';
      return;
    }
  
    myPolls.forEach(poll => {
      const pollDiv = document.createElement('div');
      pollDiv.className = 'poll-card';
      pollDiv.innerHTML = `
        <h3>${poll.question}</h3>
        <div class="poll-buttons">
          <button class="secondary-btn" onclick="toggleResults(${poll.id})">View Results</button>
          <button class="danger-btn" onclick="deletePoll(${poll.id})">Delete Poll</button>
        </div>
        <div id="results_${poll.id}" class="hidden" style="margin-top:15px;">
          <canvas id="chart_${poll.id}" width="250" height="250"></canvas>
        </div>
      `;
      container.appendChild(pollDiv);
    });
  }
  
  
  let chartInstances = {};

async function toggleResults(pollId) {
  const resultsDiv = document.getElementById(`results_${pollId}`);

  if (!resultsDiv.classList.contains('hidden')) {
    resultsDiv.classList.add('hidden');
    if (chartInstances[pollId]) {
      chartInstances[pollId].destroy();
      delete chartInstances[pollId];
    }
    return;
  }

  const res = await fetch(`/poll/results/${pollId}`);
  const results = await res.json();

  resultsDiv.classList.remove('hidden');

  const ctx = document.getElementById(`chart_${pollId}`).getContext('2d');
  const labels = results.length ? results.map(r => r.option_text) : ['No Votes Yet'];
  const votes = results.length ? results.map(r => r.votes) : [1];

  chartInstances[pollId] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: votes,
        backgroundColor: ['#00bcd4', '#2196f3', '#ff9800', '#8bc34a', '#e91e63', '#9c27b0', '#607d8b'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

async function deletePoll(pollId) {
  const confirmed = confirm('Are you sure you want to delete this poll?');
  if (!confirmed) return;

  const res = await fetch('/poll/delete/' + pollId, { method: 'DELETE' });
  const data = await res.json();
  alert(data.message);
  loadManagePolls(); // Refresh after deletion
}


function addOption() {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'option';
    input.placeholder = 'Another option';
    document.getElementById('optionsContainer').appendChild(input);
  }
  
  document.getElementById('createPollForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const question = document.getElementById('question').value.trim();
    const options = Array.from(document.querySelectorAll('.option'))
                         .map(opt => opt.value.trim())
                         .filter(opt => opt !== "");
    const created_by = localStorage.getItem('teacher_id') || 1;
  
    if (!question || options.length < 2) {
      alert('Please enter a poll question and at least two options.');
      return;
    }
  
    try {
      const res = await fetch('/poll/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options, created_by })
      });
  
      if (res.ok) {
        const data = await res.json();
        document.getElementById('createMsg').textContent = data.message;
        document.getElementById('createPollForm').reset();
        document.getElementById('optionsContainer').innerHTML = `
          <input type="text" class="option" placeholder="Option 1" required>
          <input type="text" class="option" placeholder="Option 2" required>
        `;
      } else {
        alert('Failed to create poll.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  });
  
  function logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();           // Clear all stored user data
      window.location.href = '/login'; // Redirect to login page
    }
  }
  
loadDashboard();