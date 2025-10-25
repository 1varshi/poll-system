// --- Pagination Variables ---
let currentPage = 1;
const pollsPerPage = 3;
let allPolls = [];

// --- Sidebar Navigation ---
function showSection(section) {
    document.getElementById('viewPollsSection').classList.add('hidden');
    document.getElementById('answeredPollsSection').classList.add('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (section === 'viewPolls') {
        document.getElementById('viewPollsSection').classList.remove('hidden');
        document.querySelector('.nav-btn:nth-child(2)').classList.add('active');
        loadAvailablePolls();
    } else if (section === 'answeredPolls') {
        document.getElementById('answeredPollsSection').classList.remove('hidden');
        document.querySelector('.nav-btn:nth-child(3)').classList.add('active');
        loadAnsweredPolls();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '/login';
    }
}

// --- Welcome Message ---
const studentUsername = localStorage.getItem('username') || 'Student';
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('welcomeStudent').textContent = `Welcome, ${studentUsername} 🎓`;
});

const studentId = localStorage.getItem('user_id') || 1;

// --- Load Available Polls ---
async function loadAvailablePolls() {
    const res = await fetch('/poll/available');
    allPolls = await res.json();
    currentPage = 1;
    renderPollsPage();
}

function renderPollsPage() {
    const container = document.getElementById('studentPolls');
    container.innerHTML = '';

    if (allPolls.length === 0) {
        container.innerHTML = '<p>No polls available currently.</p>';
        return;
    }

    const start = (currentPage - 1) * pollsPerPage;
    const end = start + pollsPerPage;
    const pollsToDisplay = allPolls.slice(start, end);

    pollsToDisplay.forEach(poll => {
        const div = document.createElement('div');
        div.className = 'poll-card styled-poll-card';
        div.innerHTML = `
            <h3 class="poll-question">${poll.question}</h3>
            <div class="poll-options">
                ${poll.options.map(opt =>
                    `<label class="option-label"><input type="radio" name="poll_${poll.id}" value="${opt.id}" class="option-radio"> ${opt.option_text}</label><br>`
                ).join('')}
            </div>
            <button onclick="submitVote(${poll.id})" class="primary-btn submit-poll-btn">Submit Answer</button>
        `;
        container.appendChild(div);
    });

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-buttons';
    paginationDiv.innerHTML = `
        <button onclick="previousPage()" class="secondary-btn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span style="margin: 0 10px;">Page ${currentPage} of ${Math.ceil(allPolls.length / pollsPerPage)}</span>
        <button onclick="nextPage()" class="secondary-btn" ${end >= allPolls.length ? 'disabled' : ''}>Next</button>
    `;
    container.appendChild(paginationDiv);
}

function nextPage() {
    if (currentPage * pollsPerPage < allPolls.length) {
        currentPage++;
        renderPollsPage();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPollsPage();
    }
}

async function submitVote(pollId) {
    const selected = document.querySelector(`input[name="poll_${pollId}"]:checked`);
    if (!selected) {
        alert("Please select an option first!");
        return;
    }

    const res = await fetch('/poll/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            poll_id: pollId,
            option_id: selected.value,
            student_id: studentId
        })
    });

    const data = await res.json();
    alert(data.message);
    loadAvailablePolls();
    loadAnsweredPolls();
}

// --- Load Answered Polls ---
async function loadAnsweredPolls() {
    const res = await fetch(`/poll/answered/${studentId}`);
    const answered = await res.json();
    const container = document.getElementById('answeredPolls');
    container.innerHTML = '';

    if (answered.length === 0) {
        container.innerHTML = '<p>You have not answered any polls yet.</p>';
        return;
    }

    container.innerHTML = `<p><strong>Total answered polls:</strong> ${answered.length}</p>`;
    answered.forEach(poll => {
        const div = document.createElement('div');
        div.className = 'poll-card';
        div.innerHTML = `
            <h4>${poll.question}</h4>
            <p><strong>Your Answer:</strong> ${poll.option_text}</p>
        `;
        container.appendChild(div);
    });
}

// Initial Load
loadAvailablePolls();
