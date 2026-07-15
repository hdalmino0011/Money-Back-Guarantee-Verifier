// REFRESH PAGE FUNCTION
function refreshPage() {
  location.reload();
}

// RESET SESSION FUNCTION - ENHANCED (clears ALL cache and forces fresh load)
function resetSession() {
  // Clear localStorage
  localStorage.clear();
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear all cookies (multiple paths/domains for thoroughness)
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + window.location.hostname);
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=." + window.location.hostname);
  });
  
  // Clear any cached data in Cache API if available
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    }).catch(function() {
      console.log("Cache API clear attempted");
    });
  }
  
  // Clear IndexedDB if any
  if ('indexedDB' in window) {
    try {
      if (indexedDB.databases) {
        indexedDB.databases().then(function(dbs) {
          dbs.forEach(function(db) {
            indexedDB.deleteDatabase(db.name);
          });
        }).catch(function() {
          console.log("IndexedDB clear attempted");
        });
      }
    } catch(e) {
      console.log("IndexedDB clear fallback");
    }
  }
  
  // Clear service worker caches if any
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    }).catch(function() {
      console.log("Service worker unregister attempted");
    });
  }
  
  // Force hard reload with cache-busting parameter
  const url = new URL(window.location.href);
  url.searchParams.set('_reset', Date.now());
  window.location.replace(url.toString());
}

// ===================
// THEME MODAL FUNCTIONS (21 THEMES)
// ===================
const themes = [
  // Original 12 themes
  "light",
  "dark",
  "crimson",
  "royalblue",
  "emerald",
  "amber",
  "purple",
  "teal",
  "pink",
  "navy",
  "olive",
  "slate",
  // 9 Advanced themes
  "cosmos",
  "galaxy",
  "aurora",
  "sunset",
  "ocean",
  "forest",
  "neon",
  "dreamscape",
  "cherryblossom"
];

function openThemeModal() {
  const modal = document.getElementById("themeModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closeThemeModal() {
  const modal = document.getElementById("themeModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function setTheme(themeName) {
  // Remove all theme classes from body
  themes.forEach(theme => {
    document.body.classList.remove(`theme-${theme}`);
  });
  
  // Add the selected theme
  document.body.classList.add(`theme-${themeName}`);
  
  // Save to localStorage
  localStorage.setItem("selectedTheme", themeName);
  
  // Close the modal
  closeThemeModal();
}

// Load saved theme on page load
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme && themes.includes(savedTheme)) {
    document.body.classList.add(`theme-${savedTheme}`);
  } else {
    document.body.classList.add("theme-light");
  }
}

// NAVIGATION
function showSection(id) {
  // Hide all containers
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  
  // When timezone section is shown, ensure display is updated immediately
  if (id === 'timezone') {
    updateAllTimezones();
  }
}

function goHome() {
  showSection('home');
  
  // Clear all results (but NOT notes - keep typed content)
  document.getElementById("refundResult").innerHTML = "";
  document.getElementById("discountResult").innerHTML = "";
  document.getElementById("timeframeResult").innerHTML = "";
  document.getElementById("ahtResult").innerHTML = "";
  // Notes are preserved - do NOT clear them
}

// ===================
// ABOUT MODAL FUNCTIONS
// ===================
function openAboutModal() {
  const modal = document.getElementById("aboutModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closeAboutModal() {
  const modal = document.getElementById("aboutModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

// ===================
// LIVE PHILIPPINE TIME (12-HOUR FORMAT WITH AM/PM - UPDATES EVERY SECOND)
// ===================
function updatePhilippineTime() {
  const options = { timeZone: 'Asia/Manila', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = new Date().toLocaleTimeString('en-PH', options);
  document.getElementById('phTime').innerText = timeString;
}
setInterval(updatePhilippineTime, 1000);
updatePhilippineTime();

// ===================
// WINDOW ONLOAD - COMBINED (sets date, loads theme, starts timezone updates, creates animations, checks version, init timers, quotes, notes)
// ===================
window.onload = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayFormatted = `${yyyy}-${mm}-${dd}`;
  
  if (document.getElementById("todayDate")) {
    document.getElementById("todayDate").value = todayFormatted;
  }
  
  // Load saved theme
  loadSavedTheme();
  
  // Start real-time updates for US/Canada times (only when section is visible)
  setInterval(() => {
    const tzSection = document.getElementById('timezone');
    if (tzSection && !tzSection.classList.contains('hidden')) {
      updateAllTimezones();
    }
  }, 1000);
  
  // Create animated background elements
  createStars();
  createRain();
  createParticles();
  createGlowingStars();
  
  // CHECK VERSION - Show popup if old version
  checkVersionAndShowPopup();
  
  // Initialize timers
  initTimers();
  
  // Initialize quotes
  initQuotes();
  
  // Initialize notes with separate tabs
  initNotes();
};

// Close modal when clicking outside of it
document.addEventListener('click', function(event) {
  // Theme modal
  const modal = document.getElementById("themeModal");
  if (modal && modal.classList.contains('show')) {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent && !modalContent.contains(event.target) && !event.target.classList.contains('btn-themes') && !event.target.classList.contains('dark-toggle')) {
      closeThemeModal();
    }
  }
  
  // About modal
  const aboutModal = document.getElementById("aboutModal");
  if (aboutModal && aboutModal.classList.contains('show')) {
    const aboutContent = aboutModal.querySelector('.about-modal-content');
    if (aboutContent && !aboutContent.contains(event.target) && !event.target.classList.contains('btn-about') && !event.target.classList.contains('about-btn')) {
      closeAboutModal();
    }
  }
});

// ===================
// COMPLETE US STATES & CANADIAN PROVINCES/TERRITORIES WITH TIME ZONES
// ===================
const allLocations = [
  // US STATES (50 + DC)
  { name: "Alabama (Central)", tz: "America/Chicago" },
  { name: "Alaska", tz: "America/Anchorage" },
  { name: "Arizona (Mountain - no DST)", tz: "America/Phoenix" },
  { name: "Arkansas (Central)", tz: "America/Chicago" },
  { name: "California (Pacific)", tz: "America/Los_Angeles" },
  { name: "Colorado (Mountain)", tz: "America/Denver" },
  { name: "Connecticut (Eastern)", tz: "America/New_York" },
  { name: "Delaware (Eastern)", tz: "America/New_York" },
  { name: "Florida (Eastern)", tz: "America/New_York" },
  { name: "Georgia (Eastern)", tz: "America/New_York" },
  { name: "Hawaii", tz: "Pacific/Honolulu" },
  { name: "Idaho (Mountain/Pacific)", tz: "America/Denver" },
  { name: "Illinois (Central)", tz: "America/Chicago" },
  { name: "Indiana (Eastern)", tz: "America/Indiana/Indianapolis" },
  { name: "Iowa (Central)", tz: "America/Chicago" },
  { name: "Kansas (Central/Mountain)", tz: "America/Chicago" },
  { name: "Kentucky (Eastern)", tz: "America/New_York" },
  { name: "Louisiana (Central)", tz: "America/Chicago" },
  { name: "Maine (Eastern)", tz: "America/New_York" },
  { name: "Maryland (Eastern)", tz: "America/New_York" },
  { name: "Massachusetts (Eastern)", tz: "America/New_York" },
  { name: "Michigan (Eastern)", tz: "America/Detroit" },
  { name: "Minnesota (Central)", tz: "America/Chicago" },
  { name: "Mississippi (Central)", tz: "America/Chicago" },
  { name: "Missouri (Central)", tz: "America/Chicago" },
  { name: "Montana (Mountain)", tz: "America/Denver" },
  { name: "Nebraska (Central/Mountain)", tz: "America/Chicago" },
  { name: "Nevada (Pacific)", tz: "America/Los_Angeles" },
  { name: "New Hampshire (Eastern)", tz: "America/New_York" },
  { name: "New Jersey (Eastern)", tz: "America/New_York" },
  { name: "New Mexico (Mountain)", tz: "America/Denver" },
  { name: "New York (Eastern)", tz: "America/New_York" },
  { name: "North Carolina (Eastern)", tz: "America/New_York" },
  { name: "North Dakota (Central)", tz: "America/Chicago" },
  { name: "Ohio (Eastern)", tz: "America/New_York" },
  { name: "Oklahoma (Central)", tz: "America/Chicago" },
  { name: "Oregon (Pacific)", tz: "America/Los_Angeles" },
  { name: "Pennsylvania (Eastern)", tz: "America/New_York" },
  { name: "Rhode Island (Eastern)", tz: "America/New_York" },
  { name: "South Carolina (Eastern)", tz: "America/New_York" },
  { name: "South Dakota (Central/Mountain)", tz: "America/Chicago" },
  { name: "Tennessee (Central/Eastern)", tz: "America/Chicago" },
  { name: "Texas (Central/Mountain)", tz: "America/Chicago" },
  { name: "Utah (Mountain)", tz: "America/Denver" },
  { name: "Vermont (Eastern)", tz: "America/New_York" },
  { name: "Virginia (Eastern)", tz: "America/New_York" },
  { name: "Washington (Pacific)", tz: "America/Los_Angeles" },
  { name: "West Virginia (Eastern)", tz: "America/New_York" },
  { name: "Wisconsin (Central)", tz: "America/Chicago" },
  { name: "Wyoming (Mountain)", tz: "America/Denver" },
  { name: "Washington, D.C. (Eastern)", tz: "America/New_York" },
  
  // CANADIAN PROVINCES AND TERRITORIES
  { name: "Alberta (Mountain)", tz: "America/Edmonton" },
  { name: "British Columbia (Pacific)", tz: "America/Vancouver" },
  { name: "Manitoba (Central)", tz: "America/Winnipeg" },
  { name: "New Brunswick (Atlantic)", tz: "America/Moncton" },
  { name: "Newfoundland and Labrador", tz: "America/St_Johns" },
  { name: "Nova Scotia (Atlantic)", tz: "America/Halifax" },
  { name: "Ontario (Eastern)", tz: "America/Toronto" },
  { name: "Prince Edward Island (Atlantic)", tz: "America/Halifax" },
  { name: "Quebec (Eastern)", tz: "America/Montreal" },
  { name: "Saskatchewan (Central - no DST)", tz: "America/Regina" },
  { name: "Northwest Territories (Mountain)", tz: "America/Yellowknife" },
  { name: "Nunavut (Eastern/Central/Mountain)", tz: "America/Iqaluit" },
  { name: "Yukon (Mountain)", tz: "America/Whitehorse" }
];

function updateAllTimezones() {
  const container = document.getElementById("timezoneList");
  if (!container) return;
  
  const now = new Date();
  let html = "";
  
  for (let loc of allLocations) {
    try {
      const timeString = now.toLocaleTimeString('en-US', { timeZone: loc.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      html += `<div class="timezone-item"><strong>${loc.name}</strong><br>${timeString}</div>`;
    } catch(e) {
      html += `<div class="timezone-item"><strong>${loc.name}</strong><br>Time unavailable</div>`;
    }
  }
  container.innerHTML = html;
}

// ===================
// MBG CHECKER
// ===================
function calculateRefund() {
  const orderDateStr = document.getElementById("orderDate").value;
  const todayDateStr = document.getElementById("todayDate").value;
  const guaranteeDays = parseInt(document.getElementById("guaranteeDays").value);
  
  if (!orderDateStr || !todayDateStr || isNaN(guaranteeDays) || guaranteeDays < 0) {
    document.getElementById("refundResult").innerHTML = `
      <span style='color:red'><strong>Error:</strong> Please fill in all fields correctly.</span>
    `;
    return;
  }
  
  const orderDate = new Date(orderDateStr + "T12:00:00");
  const todayDate = new Date(todayDateStr + "T12:00:00");
  
  const timeDiff = todayDate - orderDate;
  const daysUsed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const daysRemaining = guaranteeDays - daysUsed;
  
  const expirationDate = new Date(orderDate);
  expirationDate.setDate(expirationDate.getDate() + guaranteeDays);
  
  let daysBeyond = 0;
  if (daysRemaining < 0) daysBeyond = Math.abs(daysRemaining);
  
  let result = `
    <strong>REFUND BREAKDOWN</strong><br><br>
    <strong>Order Date:</strong> ${orderDate.toDateString()}<br>
    <strong>Today's Date:</strong> ${todayDate.toDateString()}<br>
    <strong>Guarantee Period:</strong> ${guaranteeDays} days<br>
    <strong>Expiration Date:</strong> <strong>${expirationDate.toDateString()}</strong><br><br>
    <strong>Days Used:</strong> ${daysUsed} days<br>
  `;
  
  if (daysRemaining >= 0) {
    result += `<strong>Days Remaining:</strong> ${daysRemaining} days<br><br>`;
    result += `<span style='color:green; font-size:18px;'><strong>Eligible for Refund</strong></span><br>`;
    result += `<span style='color:green;'>You have ${daysRemaining} day(s) left to request a refund.</span>`;
  } else {
    result += `<strong>Days Expired:</strong> ${daysBeyond} days beyond guarantee<br><br>`;
    result += `<span style='color:red; font-size:18px;'><strong>NOT Eligible for Refund</strong></span><br>`;
    result += `<span style='color:red;'>Your refund guarantee expired ${daysBeyond} day(s) ago.</span>`;
  }
  
  document.getElementById("refundResult").innerHTML = result;
}

// ===================
// DISCOUNT CALCULATOR (UPDATED WITH MORE PERCENTAGES)
// ===================
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  
  if (isNaN(amount) || amount <= 0) {
    document.getElementById("discountResult").innerHTML = `
      <span style='color:red'><strong>Error:</strong> Please enter a valid amount.</span>
    `;
    return;
  }
  
  const discounts = [10, 15, 20, 25, 30, 35, 50, 65, 70, 75];
  let output = `<strong>Original Amount: $${amount.toFixed(2)}</strong><br><br>`;
  
  discounts.forEach(d => {
    const discountAmount = amount * d / 100;
    const finalPrice = amount - discountAmount;
    
    output += `
      <strong>${d}% Discount</strong><br>
      Discount Amount: $${discountAmount.toFixed(2)}<br>
      Final Price: <strong>$${finalPrice.toFixed(2)}</strong><br><br>
    `;
  });
  
  document.getElementById("discountResult").innerHTML = output;
}

// ===================
// BUSINESS DAYS CALCULATOR
// ===================
function addBusinessDays(date, days) {
  let result = new Date(date);
  let daysAdded = 0;
  
  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      daysAdded++;
    }
  }
  return result;
}

function calculateTimeframe() {
  const refundDateStr = document.getElementById("refundDate").value;
  
  if (!refundDateStr) {
    document.getElementById("timeframeResult").innerHTML = `
      <span style='color:red'><strong>Error:</strong> Please select a refund request date.</span>
    `;
    return;
  }
  
  const refundDate = new Date(refundDateStr + "T12:00:00");
  const rangeValue = document.getElementById("range").value;
  const [minDays, maxDays] = rangeValue.split("-").map(Number);
  
  const startDate = addBusinessDays(refundDate, minDays);
  const endDate = addBusinessDays(refundDate, maxDays);
  
  document.getElementById("timeframeResult").innerHTML = `
    <strong>Expected Refund Processing Window:</strong><br><br>
    From: <strong>${startDate.toDateString()}</strong><br>
    To: <strong>${endDate.toDateString()}</strong><br><br>
    <span style='font-size:13px;'>Note: Excludes weekends (Saturday & Sunday)</span>
  `;
}

// ===================
// AHT CONVERTER
// ===================
function convertAHT() {
  const seconds = parseInt(document.getElementById("seconds").value);
  
  if (isNaN(seconds) || seconds < 0) {
    document.getElementById("ahtResult").innerHTML = `
      <span style='color:red'><strong>Error:</strong> Please enter valid seconds.</span>
    `;
    return;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = `<strong>AHT Conversion:</strong><br><br>`;
  result += `<strong>${seconds}</strong> seconds = <br>`;
  
  if (hours > 0) result += `<strong>${hours}</strong> hour(s) `;
  if (minutes > 0) result += `<strong>${minutes}</strong> minute(s) `;
  if (secs > 0 || (hours === 0 && minutes === 0)) result += `<strong>${secs}</strong> second(s)`;
  
  document.getElementById("ahtResult").innerHTML = result;
}

// ============================================================
// NOTES - EACH TYPE HAS ITS OWN ENTRY TAB (PRESERVES CONTENT)
// ============================================================
const notesData = { 1: "", 2: "", 3: "" };
let currentNoteType = 1;

function initNotes() {
  // Pre-fill type 1 with template on first load
  const template1 = "Agent Name: \nOrder Date: \nREASON FOR CALLING: \nOFFER SAVE: \nTHREAT: \nRESOLUTION: \nACCOUNT STATUS: ";
  notesData[1] = template1;
  document.getElementById("notesBox").value = template1;
  currentNoteType = 1;
}

function loadNotes(num) {
  const textarea = document.getElementById("notesBox");
  
  // Save current content to the current type
  if (currentNoteType !== null && currentNoteType !== undefined) {
    notesData[currentNoteType] = textarea.value;
  }
  
  // Switch to the new type
  currentNoteType = num;
  
  // If the new type has saved content, load it; otherwise load its template
  if (notesData[num] && notesData[num].trim() !== "") {
    textarea.value = notesData[num];
  } else {
    let template = "";
    if (num === 1) {
      template = "Agent Name: \nOrder Date: \nREASON FOR CALLING: \nOFFER SAVE: \nTHREAT: \nRESOLUTION: \nACCOUNT STATUS: ";
    } else if (num === 2) {
      template = "AGENT:\nREASON FOR CALLING:\nTHREAT: \nSAVE OFFER:\nRESOLUTION:\nSTATUS: \n\ncampaign:\norder date: \nname: \nphone number: \nemail address: \norder id: \nproduct name:";
    } else if (num === 3) {
      template = "FOR NO ACCOUNT FOUND\n \nCampaign: \nOrder Date: \nEmail: \nName: \nPhone Number: \nProduct Name: \nTracking Number: \nOrder ID:";
    }
    notesData[num] = template;
    textarea.value = template;
  }
}

function copyNotes() {
  const notesBox = document.getElementById("notesBox");
  notesBox.select();
  notesBox.setSelectionRange(0, 99999);
  
  try {
    document.execCommand("copy");
    alert("Notes copied to clipboard!");
  } catch(err) {
    alert("Failed to copy. Please manually copy the text.");
  }
}

// ===================
// CURRENCY ABBREVIATIONS (WITH SEARCH)
// ===================
const currencyListFull = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "ZAR", name: "South African Rand" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "KRW", name: "South Korean Won" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "DKK", name: "Danish Krone" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "THB", name: "Thai Baht" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "ILS", name: "Israeli Shekel" }
];

function loadCurrencies() {
  renderCurrencies(currencyListFull);
}

function renderCurrencies(filteredList) {
  const container = document.getElementById("currencyList");
  if (!container) return;
  
  let html = "";
  for (let curr of filteredList) {
    html += `<div class="currency-item"><strong>${curr.code}</strong> — ${curr.name}</div>`;
  }
  container.innerHTML = html || "<div>No matching currencies found.</div>";
}

function filterCurrencies() {
  const searchTerm = document.getElementById("currencySearch").value.toLowerCase();
  const filtered = currencyListFull.filter(curr => 
    curr.code.toLowerCase().includes(searchTerm) || 
    curr.name.toLowerCase().includes(searchTerm)
  );
  renderCurrencies(filtered);
}

// ===================
// ANIMATED BACKGROUND ELEMENTS (Stars, Rain, Particles)
// ===================
function createStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = Math.random() * 4 + 2 + 'px';
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 5 + 's';
    star.style.animationDuration = Math.random() * 3 + 2 + 's';
    starsContainer.appendChild(star);
  }
}

function createRain() {
  const rainContainer = document.getElementById('rain');
  if (!rainContainer) return;
  for (let i = 0; i < 60; i++) {
    const drop = document.createElement('div');
    drop.classList.add('drop');
    drop.style.left = Math.random() * 100 + '%';
    drop.style.width = Math.random() * 2 + 1 + 'px';
    drop.style.height = Math.random() * 40 + 30 + 'px';
    drop.style.animationDelay = Math.random() * 10 + 's';
    drop.style.animationDuration = Math.random() * 1.5 + 1 + 's';
    rainContainer.appendChild(drop);
  }
}

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 8 + 4 + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = Math.random() * 20 + 15 + 's';
    particlesContainer.appendChild(particle);
  }
}

// ===================
// CREATE GLOWING STARS (replaces comets)
// ===================
function createGlowingStars() {
  const starsContainer = document.getElementById('comets');
  if (!starsContainer) return;
  
  // Clear any existing content
  starsContainer.innerHTML = '';
  
  // Create 60 glowing stars of different sizes
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.classList.add('glowing-star');
    
    // Random size class
    const sizeRand = Math.random();
    if (sizeRand < 0.2) {
      star.classList.add('large');
    } else if (sizeRand > 0.8) {
      star.classList.add('small');
    }
    
    // Random position
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    // Random animation delay and duration
    star.style.animationDelay = Math.random() * 5 + 's';
    star.style.animationDuration = Math.random() * 3 + 2 + 's';
    
    starsContainer.appendChild(star);
  }
}

// ===================
// VERSION CHECK - FORCE USERS TO UPDATE
// ===================
const CURRENT_VERSION = "3.0.0";

function checkVersionAndShowPopup() {
  const savedVersion = localStorage.getItem("appVersion");
  
  // If no saved version or version mismatch, show popup
  if (!savedVersion || savedVersion !== CURRENT_VERSION) {
    showUpdatePopup();
  }
}

function showUpdatePopup() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'updatePopup';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 30000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Times New Roman', Times, serif;
  `;
  
  // Create popup content
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: white;
    border-radius: 25px;
    padding: 35px 30px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: popupFadeIn 0.3s ease;
  `;
  
  // Add animation style if not exists
  if (!document.querySelector('#popupAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'popupAnimationStyle';
    style.textContent = `
      @keyframes popupFadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Popup content with pure CSS refresh icon (no emoji)
  popup.innerHTML = `
    <div style="margin: 0 auto 15px auto; width: 60px; height: 60px; position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 48px;
        height: 48px;
        border: 5px solid #dc3545;
        border-radius: 50%;
        border-top-color: transparent;
        position: relative;
        animation: spinUpdate 1.5s linear infinite;
      "></div>
      <div style="
        position: absolute;
        top: 2px;
        right: 2px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 6px 8px 6px;
        border-color: transparent transparent #dc3545 transparent;
        transform: rotate(45deg);
      "></div>
    </div>
    <h2 style="color: #dc3545; margin-bottom: 15px; font-size: 24px;">Update Required</h2>
    <p style="color: #333; margin-bottom: 20px; line-height: 1.5; font-size: 16px;">
      You are using an old version of this tool.<br><br>
      Please click the button below to update to the latest version.
    </p>
    <button id="updateResetBtn" style="
      background: #dc3545;
      color: white;
      border: none;
      padding: 14px 25px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s ease;
    ">Reset Session and Update</button>
  `;
  
  // Add spin animation if not exists
  if (!document.querySelector('#spinAnimationStyle')) {
    const spinStyle = document.createElement('style');
    spinStyle.id = 'spinAnimationStyle';
    spinStyle.textContent = `
      @keyframes spinUpdate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinStyle);
  }
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Add event listener to the reset button
  const updateBtn = document.getElementById('updateResetBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', function() {
      performHardReset();
    });
  }
}

function performHardReset() {
  // Clear localStorage
  localStorage.clear();
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear all cookies
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + window.location.hostname);
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=." + window.location.hostname);
  });
  
  // Set the new version before reload
  localStorage.setItem("appVersion", CURRENT_VERSION);
  
  // Clear Cache API if available (don't wait for this)
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    }).catch(function() {});
  }
  
  // Clear IndexedDB if any (don't wait)
  if ('indexedDB' in window) {
    try {
      if (indexedDB.databases) {
        indexedDB.databases().then(function(dbs) {
          dbs.forEach(function(db) {
            indexedDB.deleteDatabase(db.name);
          });
        }).catch(function() {});
      }
    } catch(e) {}
  }
  
  // Clear service workers if any (don't wait)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    }).catch(function() {});
  }
  
  // Force hard reload with cache-busting parameter using replace to avoid back-button issues
  const url = new URL(window.location.href);
  url.searchParams.set('_reset', Date.now());
  window.location.replace(url.toString());
}

// ===================
// TAP TIMER FOR AGENTS
// ===================
const timerState = {
  break1: {
    duration: 15 * 60,        // 15 minutes in seconds
    remaining: 15 * 60,
    running: false,
    startTime: null,
    endTime: null,
    interval: null
  },
  lunch: {
    duration: 60 * 60,        // 1 hour in seconds
    remaining: 60 * 60,
    running: false,
    startTime: null,
    endTime: null,
    interval: null
  },
  break2: {
    duration: 15 * 60,
    remaining: 15 * 60,
    running: false,
    startTime: null,
    endTime: null,
    interval: null
  }
};

function initTimers() {
  // Initialize all timer displays
  ['break1', 'lunch', 'break2'].forEach(id => {
    updateTimerDisplay(id);
    document.getElementById(`${id}StartTime`).textContent = '--:--';
    document.getElementById(`${id}ReturnTime`).textContent = '--:--';
    // Ensure button labels are correct
    const startBtn = document.querySelector(`.timer-start-btn[data-timer="${id}"]`);
    if (startBtn) {
      startBtn.textContent = 'Start';
      startBtn.disabled = false;
      startBtn.classList.remove('running-btn');
    }
  });
}

function startTimer(id, durationMinutes) {
  const timer = timerState[id];
  if (timer.running) return; // already running
  
  // Set duration from parameter
  timer.duration = durationMinutes * 60;
  timer.remaining = timer.duration;
  
  // Record start time
  const now = new Date();
  timer.startTime = now;
  timer.endTime = new Date(now.getTime() + timer.duration * 1000);
  
  // Update start and return times
  const startTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const returnTimeStr = timer.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById(`${id}StartTime`).textContent = startTimeStr;
  document.getElementById(`${id}ReturnTime`).textContent = returnTimeStr;
  
  timer.running = true;
  
  // Update button
  const startBtn = document.querySelector(`.timer-start-btn[data-timer="${id}"]`);
  if (startBtn) {
    startBtn.textContent = 'Running...';
    startBtn.disabled = true;
    startBtn.classList.add('running-btn');
  }
  
  // Start countdown
  if (timer.interval) clearInterval(timer.interval);
  timer.interval = setInterval(() => {
    const now = Date.now();
    const elapsed = (now - timer.startTime.getTime()) / 1000;
    const remaining = Math.max(0, timer.duration - elapsed);
    timer.remaining = remaining;
    
    updateTimerDisplay(id);
    
    if (remaining <= 0) {
      // Timer completed
      clearInterval(timer.interval);
      timer.interval = null;
      timer.running = false;
      // Update button
      if (startBtn) {
        startBtn.textContent = 'Done';
        startBtn.disabled = true;
        startBtn.classList.remove('running-btn');
      }
    }
  }, 1000);
}

function resetTimer(id) {
  const timer = timerState[id];
  if (timer.interval) {
    clearInterval(timer.interval);
    timer.interval = null;
  }
  timer.running = false;
  timer.remaining = timer.duration; // reset to full duration
  timer.startTime = null;
  timer.endTime = null;
  
  // Reset display
  updateTimerDisplay(id);
  document.getElementById(`${id}StartTime`).textContent = '--:--';
  document.getElementById(`${id}ReturnTime`).textContent = '--:--';
  
  // Reset button
  const startBtn = document.querySelector(`.timer-start-btn[data-timer="${id}"]`);
  if (startBtn) {
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
    startBtn.classList.remove('running-btn');
  }
}

function updateTimerDisplay(id) {
  const timer = timerState[id];
  const display = document.getElementById(`${id}Display`);
  if (!display) return;
  
  let remaining = timer.remaining;
  if (timer.running && timer.startTime) {
    // Compute remaining based on current time
    const now = Date.now();
    const elapsed = (now - timer.startTime.getTime()) / 1000;
    remaining = Math.max(0, timer.duration - elapsed);
  }
  
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  // Update color based on remaining
  display.classList.remove('running', 'completed');
  if (timer.running) {
    if (remaining <= 0) {
      display.classList.add('completed');
    } else {
      display.classList.add('running');
    }
  }
}

// ===================
// ADD GLOBAL TIMER UPDATE LOOP (to keep displays current even when not on home)
// ===================
setInterval(() => {
  // Update all timer displays if they exist and are running
  ['break1', 'lunch', 'break2'].forEach(id => {
    const timer = timerState[id];
    if (timer.running) {
      updateTimerDisplay(id);
      // Check if timer completed and stop it
      if (timer.remaining <= 0 && timer.interval) {
        clearInterval(timer.interval);
        timer.interval = null;
        timer.running = false;
        const startBtn = document.querySelector(`.timer-start-btn[data-timer="${id}"]`);
        if (startBtn) {
          startBtn.textContent = 'Done';
          startBtn.disabled = true;
          startBtn.classList.remove('running-btn');
        }
      }
    }
  });
}, 1000);

// ===================
// TYPEWRITER QUOTES
// ===================
const quotes = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The best time to start was yesterday. The next best time is now.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Keep your face always toward the sunshine—and shadows will fall behind you.",
  "The secret of getting ahead is getting started.",
  "Quality is not an act, it is a habit.",
  "In the middle of difficulty lies opportunity.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
  "The only place where success comes before work is in the dictionary.",
  "Strive not to be a success, but rather to be of value.",
  "Everything you've ever wanted is on the other side of fear.",
  "The purpose of our lives is to be happy.",
  "You are never too old to set another goal or to dream a new dream.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only impossible journey is the one you never begin.",
  "Small daily improvements over time lead to stunning results."
];

const usedQuotes = [];

function getRandomQuote() {
  // If all quotes have been used, reset the used list
  if (usedQuotes.length >= quotes.length) {
    usedQuotes.length = 0;
  }
  
  // Find a quote that hasn't been used recently
  let availableQuotes = quotes.filter((_, index) => !usedQuotes.includes(index));
  if (availableQuotes.length === 0) {
    usedQuotes.length = 0;
    availableQuotes = quotes;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quoteText = availableQuotes[randomIndex];
  const originalIndex = quotes.indexOf(quoteText);
  usedQuotes.push(originalIndex);
  
  return quoteText;
}

function initQuotes() {
  // Check if quotes section exists
  const quoteElement = document.getElementById('quoteText');
  if (!quoteElement) return;
  
  // Start with a random quote
  const firstQuote = getRandomQuote();
  quoteElement.textContent = firstQuote;
  
  // Change quote every 15 seconds with typewriter effect
  setInterval(() => {
    const newQuote = getRandomQuote();
    typeWriterEffect(quoteElement, newQuote);
  }, 15000);
}

function typeWriterEffect(element, text) {
  // Clear the element
  element.textContent = '';
  
  let charIndex = 0;
  const typingSpeed = 30; // milliseconds per character
  
  // Create cursor span
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  cursorSpan.textContent = '|';
  element.appendChild(cursorSpan);
  
  function typeCharacter() {
    if (charIndex < text.length) {
      // Insert character before the cursor
      const cursor = element.querySelector('.cursor');
      const charNode = document.createTextNode(text.charAt(charIndex));
      element.insertBefore(charNode, cursor);
      charIndex++;
      setTimeout(typeCharacter, typingSpeed);
    }
  }
  
  // Start typing after a short delay
  setTimeout(typeCharacter, 500);
}
