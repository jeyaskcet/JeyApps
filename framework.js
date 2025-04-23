window.MyFramework = (() => {
  const logs = [];

  function log(name, action) {
  const time = new Date().toISOString();
  const logEntry = {
    time: time,
    name: name,
    action: action
  };

  const logs = getData('logs') || []; // Retrieve existing logs, or initialize as an empty array.
  logs.push(logEntry);               // Add the new log.
  saveData('logs', logs);            // Save back to localStorage.

  console.log(`[${time}] ${name}: ${action}`); // Optionally log to the console as well.
}



  function onClick(selector, name, callback) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', (e) => {
      log(name, 'clicked');
      callback(e);
    });
  });
}

function onInput(selector, name) {
  document.querySelectorAll(selector).forEach(input => {
    input.addEventListener('input', () => {
      log(name, 'entered value');
    });
  });
}

  function getLogs() {
    return logs;
  }

  function downloadLogs(filename = 'logs.json') {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  function saveLogs() {
  localStorage.setItem('myFrameworkLogs', JSON.stringify(logs));
}

function loadLogs() {
  const saved = localStorage.getItem('myFrameworkLogs');
  return saved ? JSON.parse(saved) : [];
}

function displayLogs() {
  const logs = getData('logs');
  if (logs && logs.length) {
    logs.forEach(log => {
      console.log(`[${log.time}] ${log.name}: ${log.action}`);
    });
  } else {
    console.log('No logs found.');
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}


  return {
    log,
    onClick,
    getLogs,
    saveLogs,
    downloadLogs
  };
})();
