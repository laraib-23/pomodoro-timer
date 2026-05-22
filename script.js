const timerDisplay = document.getElementById("timerDisplay");
const sessionLabel = document.getElementById("sessionLabel");

const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");

const progressBar = document.getElementById("progressBar");
const historyList = document.getElementById("historyList");
// Timer state variables
let timerInterval = null;
let isRunning = false;
let isPaused = false;
let currentMode = "focus"; // focus | break
let totalSeconds = 0;
let remainingSeconds = 0;
// Local storage keys
const HISTORY_KEY = "pomodoro_history";
const DATE_KEY = "pomodoro_current_date";

// Initial App Load
initializeApp();
// Event Listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resumeBtn.addEventListener("click", resumeTimer);
resetBtn.addEventListener("click", resetTimer);
// Live update of time before start
focusInput.addEventListener("input", handleInputChange);
breakInput.addEventListener("input", handleInputChange);
// Initilize application
function initializeApp(){
  resetHistoryIfNewDay();
  loadHistory();
  setFocusSession();
}
// Handle Input Changes
function handleInputChange(){
  // Prevent invalid values
  validateInputs();
  if (!isRunning && !isPaused) {
    if (currentMode === "focus") {
      remainingSeconds = getFocusSeconds();
      totalSeconds = getFocusSeconds();
    } else {
      remainingSeconds = getBreakSeconds();
      totalSeconds = getBreakSeconds();
    }
    updateTimerDisplay();
    updateProgressBar();
  }
}

// Get input values
function getFocusSeconds() {
  return Number(focusInput.value) * 60;
}
function getBreakSeconds() {
  return Number(breakInput.value) * 60;
}
// Validate input
function validateInputs() {
  if (focusInput.value < 1) {
    focusInput.value = 1;
  }
  if (breakInput.value < 1) {
    breakInput.value = 1;
  }
}

// Start Timer
function startTimer(){
  if (isRunning) return;
  validateInputs();
  isRunning = true;
  isPaused = false;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  disableInputs();
  // If starting fresh
  if (remainingSeconds <= 0) {
    if (currentMode === "focus") {
      setFocusSession();
    } else {
      setBreakSession();
    }
  }
  timerInterval = setInterval(runTimer, 1000);
}
// Run timer function
function runTimer() {
  if (remainingSeconds > 0) {
    remainingSeconds--;
    updateTimerDisplay();
    updateProgressBar();
  }
  if (remainingSeconds === 0) {
    completeCurrentSession();
  }
}
// Pause Timer
function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
}
// Resume timer
function resumeTimer() {
  if (!isPaused) return;
  isRunning = true;
  isPaused = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  timerInterval = setInterval(runTimer, 1000);
}
// Reset timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;
  currentMode = "focus";
  setFocusSession();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  enableInputs();
}

// focus session
function setFocusSession() {
  currentMode = "focus";
  sessionLabel.textContent = "Focus Time";
  totalSeconds = getFocusSeconds();
  remainingSeconds = totalSeconds;
  updateTimerDisplay();
  updateProgressBar();
}

// Break Session
function setBreakSession() {
  currentMode = "break";
  sessionLabel.textContent = "Break Time";
  totalSeconds = getBreakSeconds();
  remainingSeconds = totalSeconds;
  updateTimerDisplay();
  updateProgressBar();
}

// Complete session
function completeCurrentSession() {
  clearInterval(timerInterval);
  playNotificationSound();
  // Save only focus sessions
  if (currentMode === "focus") {
    saveFocusHistory();
    setBreakSession();
  } else {
    setFocusSession();
  }
  // Auto continue next session
  timerInterval = setInterval(runTimer, 1000);
}

// Update timer display
function updateTimerDisplay(){
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Update progress bar
function updateProgressBar() {
  const progress =
    ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  progressBar.style.width = `${progress}%`;
}

// Disable input during active session
function disableInputs() {
  focusInput.disabled = true;
  breakInput.disabled = true;
}

// Enable inputs when timer is reset
function enableInputs() {
  focusInput.disabled = false;
  breakInput.disabled = false;
}

// notification sound 
function playNotificationSound() {
  const audioContext =
    new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = 700;
  oscillator.type = "sine";
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
  oscillator.stop(audioContext.currentTime + 1);
}

// Save history of completed focus sessions to local storage
function saveFocusHistory() {
  const history =
    JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  const completedAt = new Date();
  const timeString = completedAt.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
  const focusMinutes = focusInput.value;
  const historyEntry =
    `✓ ${focusMinutes}:00 focus — ${timeString}`;
  history.push(historyEntry);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history)
  );

  renderHistory(history);

}

// Load History
function loadHistory() {
  const history =
    JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  renderHistory(history);
}

// Render History
function renderHistory(history) {
  historyList.innerHTML = "";
  if (history.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent =
      "No focus sessions completed today.";
    historyList.appendChild(emptyItem);
    return;
  }
  history.forEach(session => {
    const li = document.createElement("li");
    li.textContent = session;
    historyList.appendChild(li);
  });
}
// RESET HISTORY ON NEW DAY
function resetHistoryIfNewDay() {
  const today = new Date().toDateString();
  const savedDate =
    localStorage.getItem(DATE_KEY);
  if (savedDate !== today) {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.setItem(DATE_KEY, today);
  }
}
