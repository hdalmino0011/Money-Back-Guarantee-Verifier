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
      // Some browsers support indexedDB.databases()
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
  window.location.href = url.toString();
}

// ===================
// THEME MODAL FUNCTIONS
// ===================
const themes = [
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
  "slate"
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
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  
  // When timezone section is shown, ensure display is updated immediately
  if (id === 'timezone') {
    updateAllTimezones();
  }
}

function goHome() {
  showSection('home');
  
  // Clear all results
  document.getElementById("refundResult").innerHTML = "";
  document.getElementById("discountResult").innerHTML = "";
  document.getElementById("timeframeResult").innerHTML = "";
  document.getElementById("ahtResult").innerHTML = "";
  document.getElementById("notesBox").value = "";
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
// WINDOW ONLOAD - COMBINED (sets date, loads theme, starts timezone updates, creates animations)
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
};

// Close modal when clicking outside of it
document.addEventListener('click', function(event) {
  const modal = document.getElementById("themeModal");
  if (modal && modal.classList.contains('show')) {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent && !modalContent.contains(event.target) && !event.target.classList.contains('dark-toggle')) {
      closeThemeModal();
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
  
  const discounts = [10, 15, 20, 25, 30, 35, 50, 70, 75];
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

// ===================
// NOTES TEMPLATES (UPDATED WITH ORDER DATE FIELD - NO AUTO-FILL)
// ===================
function loadNotes(num) {
  if (num === 1) {
    document.getElementById("notesBox").value = "Agent Name: \nOrder Date: \nREASON FOR CALLING: \nOFFER SAVE: \nTHREAT: \nRESOLUTION: \nACCOUNT STATUS: ";
  } else if (num === 2) {
    document.getElementById("notesBox").value = "AGENT:\nREASON FOR CALLING:\nTHREAT: \nSAVE OFFER:\nRESOLUTION:\nSTATUS: \n\ncampaign:\norder date: \nname: \nphone number: \nemail address: \norder id: \nproduct name:";
  } else if (num === 3) {
    document.getElementById("notesBox").value = "FOR NO ACCOUNT FOUND\n \nCampaign: \nOrder Date: \nEmail: \nName: \nPhone Number: \nProduct Name: \nTracking Number: \nOrder ID:";
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
