/**
 * Vanilla Mini App Starter Logic
 * Demonstrates Harmony OS Mini App SDK integration.
 */

document.addEventListener('DOMContentLoaded', async function () {
  // Elements
  const bridgeStatusEl = document.getElementById('bridge-status');
  const counterValEl = document.getElementById('counter-value');
  const btnIncrement = document.getElementById('btn-increment');
  const btnDecrement = document.getElementById('btn-decrement');
  const taskInput = document.getElementById('task-input');
  const btnAddTask = document.getElementById('btn-add-task');
  const taskListEl = document.getElementById('task-list');
  const taskCountEl = document.getElementById('task-count');

  let count = 0;
  let tasks = [];

  // 1. Initialize Harmony SDK
  try {
    const context = await Harmony.init();
    if (bridgeStatusEl) {
      bridgeStatusEl.textContent = 'Host Synced';
    }
    console.log('[MiniApp] Handshake complete:', context);
  } catch (err) {
    console.warn('[MiniApp] Running in standalone mode:', err);
  }

  // 2. Theme Adaptation (Sync with Host Dark/Light Mode)
  Harmony.theme.onChange(function (isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });

  // 3. Load Saved State via Harmony.storage
  try {
    const savedCount = await Harmony.storage.getItem('starter_counter');
    if (typeof savedCount === 'number') {
      count = savedCount;
      counterValEl.textContent = count;
    }

    const savedTasks = await Harmony.storage.getItem('starter_tasks');
    if (Array.isArray(savedTasks)) {
      tasks = savedTasks;
      renderTasks();
    }
  } catch (e) {
    console.error('[MiniApp] Error loading storage:', e);
  }

  // 4. Counter Handlers
  btnIncrement.addEventListener('click', function () {
    Harmony.ui.triggerHaptic('light');
    count++;
    counterValEl.textContent = count;
    Harmony.storage.setItem('starter_counter', count);
  });

  btnDecrement.addEventListener('click', function () {
    Harmony.ui.triggerHaptic('light');
    count--;
    counterValEl.textContent = count;
    Harmony.storage.setItem('starter_counter', count);
  });

  // 5. Tasks / Scratchpad Handlers
  function renderTasks() {
    taskListEl.innerHTML = '';
    tasks.forEach(function (t, index) {
      const li = document.createElement('li');
      li.className = 'list-item';

      const span = document.createElement('span');
      span.textContent = t;

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-delete';
      delBtn.textContent = 'Remove';
      delBtn.addEventListener('click', function () {
        Harmony.ui.triggerHaptic('heavy');
        tasks.splice(index, 1);
        renderTasks();
        Harmony.storage.setItem('starter_tasks', tasks);
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      taskListEl.appendChild(li);
    });

    taskCountEl.textContent = tasks.length + ' items';
  }

  btnAddTask.addEventListener('click', function () {
    const val = taskInput.value.trim();
    if (!val) return;
    Harmony.ui.triggerHaptic('medium');
    tasks.unshift(val);
    taskInput.value = '';
    renderTasks();
    Harmony.storage.setItem('starter_tasks', tasks);
  });

  taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      btnAddTask.click();
    }
  });

  // 6. Haptic Feedback Demos
  document.getElementById('haptic-light').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('light');
  });
  document.getElementById('haptic-medium').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('medium');
  });
  document.getElementById('haptic-heavy').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('heavy');
  });
  document.getElementById('haptic-success').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('success');
  });

  // 7. Host System Integration
  document.getElementById('btn-toast').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('selection');
    Harmony.ui.showToast({
      title: 'Hello from Mini App!',
      message: 'This notification was triggered via postMessage RPC.',
      type: 'success'
    });
  });

  document.getElementById('btn-copy').addEventListener('click', async function () {
    Harmony.ui.triggerHaptic('selection');
    const diagnostic = JSON.stringify({
      appId: 'template-vanilla-starter',
      userAgent: navigator.userAgent,
      screen: window.innerWidth + 'x' + window.innerHeight,
      timestamp: new Date().toISOString()
    }, null, 2);

    await Harmony.clipboard.writeText(diagnostic);
    Harmony.ui.showToast({
      title: 'Diagnostics Copied',
      message: 'System info copied to clipboard.',
      type: 'info'
    });
  });

  document.getElementById('btn-notes-app').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('medium');
    Harmony.navigation.openApp('harmony-notes', { source: 'starter-template' });
  });

  document.getElementById('btn-close').addEventListener('click', function () {
    Harmony.ui.triggerHaptic('dismiss');
    Harmony.ui.close();
  });
});
