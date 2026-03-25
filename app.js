
let tasks = JSON.parse(localStorage.getItem('taskflow-tasks') || '[]');
let currentFilter = 'all';
let deferredInstallPrompt = null;

const taskInput      = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn         = document.getElementById('add-btn');
const taskList       = document.getElementById('task-list');
const emptyState     = document.getElementById('empty-state');
const pageTitle      = document.getElementById('page-title');
const statsText      = document.getElementById('stats-text');
const badgeAll       = document.getElementById('badge-all');
const badgeActive    = document.getElementById('badge-active');
const badgeCompleted = document.getElementById('badge-completed');
const clearCompleted = document.getElementById('clear-completed');
const filterBtns     = document.querySelectorAll('.filter-btn');
const installBanner  = document.getElementById('install-banner');
const installBtn     = document.getElementById('install-btn');
const dismissBtn     = document.getElementById('dismiss-btn');
const offlineStatus  = document.getElementById('offline-status');
const statusText     = document.getElementById('status-text');
const statusDot      = offlineStatus.querySelector('.status-dot');

const mobileNav = document.createElement('nav');
mobileNav.className = 'mobile-nav';
mobileNav.innerHTML = `
  <button class="filter-btn active" data-filter="all">
    <span class="filter-icon">◈</span> All
    <span class="badge" id="m-badge-all">0</span>
  </button>
  <button class="filter-btn" data-filter="active">
    <span class="filter-icon">◇</span> Active
    <span class="badge" id="m-badge-active">0</span>
  </button>
  <button class="filter-btn" data-filter="completed">
    <span class="filter-icon">◆</span> Done
    <span class="badge" id="m-badge-completed">0</span>
  </button>
`;
document.body.appendChild(mobileNav);

function saveTasks() {
  localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function render() {
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active')    return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  taskList.innerHTML = '';

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;
    li.innerHTML = `
      <span class="priority-dot ${task.priority}"></span>
      <input
        type="checkbox"
        class="task-checkbox"
        aria-label="Mark complete"
        ${task.completed ? 'checked' : ''}
      />
      <span class="task-text">${escapeHtml(task.text)}</span>
      <span class="task-date">${formatDate(task.createdAt)}</span>
      <button class="task-delete" aria-label="Delete task">✕</button>
    `;

    const checkbox = li.querySelector('.task-checkbox');
    const deleteBtn = li.querySelector('.task-delete');

    checkbox.addEventListener('change', () => toggleTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });

  emptyState.classList.toggle('hidden', filtered.length > 0);

  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active    = total - completed;

  badgeAll.textContent       = total;
  badgeActive.textContent    = active;
  badgeCompleted.textContent = completed;

  const mAll  = document.getElementById('m-badge-all');
  const mAct  = document.getElementById('m-badge-active');
  const mDone = document.getElementById('m-badge-completed');
  if (mAll)  mAll.textContent  = total;
  if (mAct)  mAct.textContent  = active;
  if (mDone) mDone.textContent = completed;

  statsText.textContent = active === 1 ? '1 task remaining' : `${active} tasks remaining`;

  const titles = { all: 'All Tasks', active: 'Active', completed: 'Completed' };
  pageTitle.textContent = titles[currentFilter];
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) { taskInput.focus(); return; }

  const task = {
    id: generateId(),
    text,
    priority: prioritySelect.value,
    completed: false,
    createdAt: Date.now(),
  };

  tasks.unshift(task);
  saveTasks();
  render();

  taskInput.value = '';
  prioritySelect.value = 'normal';
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.filter;

  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === currentFilter);
  });

  render();
});

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  installBanner.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installBanner.classList.add('hidden');
});

dismissBtn.addEventListener('click', () => {
  installBanner.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  installBanner.classList.add('hidden');
});

function updateNetworkStatus() {
  if (navigator.onLine) {
    statusDot.className = 'status-dot online';
    statusText.textContent = 'Online';
  } else {
    statusDot.className = 'status-dot offline';
    statusText.textContent = 'Offline';
  }
}
window.addEventListener('online',  updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.error('[SW] Error:', err));
  });
}

render();
