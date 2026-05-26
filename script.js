// REFRESH PAGE FUNCTION
function refreshPage() {
  location.reload();
}

// DARK MODE TOGGLE
function toggleDark() {
  document.body.classList.toggle("dark");
  const btn = document.querySelector(".dark-toggle");
  if (document.body.classList.contains("dark")) {
    btn.textContent = "Light Mode";
  } else {
    btn.textContent = "Dark Mode";
  }
}

// NAVIGATION
function showSection(id) {
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  
  // Load timezone data when that section is opened
  if (id === 'timezone') {
    loadTimezones();
  }
  // Load currency data when that section is opened
  if (id === 'currency') {
    loadCurrencies();
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
// LIVE PHILIPPINE TIME (UPDATES EVERY SECOND)
// ===================
function updatePhilippineTime() {
  const options = { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = new Date().toLocaleTimeString('en-PH', options);
  document.getElementById('phTime').innerText = timeString;
}
setInterval(updatePhilippineTime, 1000);
updatePhilippineTime();

// Set today's date automatically on page load
window.onload = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayFormatted = `${yyyy}-${mm}-${dd}`;
  
  document.getElementById("todayDate").value = todayFormatted;
};

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
// DISCOUNT CALCULATOR
// ===================
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  
  if (isNaN(amount) || amount <= 0) {
    document.getElementById("discountResult").innerHTML = `
      <span style='color:red'><strong>Error:</strong> Please enter a valid amount.</span>
    `;
    return;
  }
  
  const discounts = [10, 35, 50, 70, 75];
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
// NOTES TEMPLATES (EXACT)
// ===================
function loadNotes(num) {
  if (num === 1) {
    document.getElementById("notesBox").value = "Agent Name: \nREASON FOR CALLING: \nOFFER SAVE: \nTHREAT: \nRESOLUTION: \nACCOUNT STATUS: ";
  } else if (num === 2) {
    document.getElementById("notesBox").value = "AGENT:\nREASON FOR CALLING:\nTHREAT: \nSAVE OFFER:\nRESOLUTION:\nSTATUS: \n\ncampaign:\nname: \nphone number: \nemail address: \norder id: \nproduct name:";
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
// US & CANADA TIME ZONES
// ===================
const timezoneData = [
  { region: "New York (Eastern)", tz: "America/New_York" },
  { region: "Chicago (Central)", tz: "America/Chicago" },
  { region: "Denver (Mountain)", tz: "America/Denver" },
  { region: "Phoenix (Mountain - no DST)", tz: "America/Phoenix" },
  { region: "Los Angeles (Pacific)", tz: "America/Los_Angeles" },
  { region: "Anchorage (Alaska)", tz: "America/Anchorage" },
  { region: "Honolulu (Hawaii)", tz: "Pacific/Honolulu" },
  { region: "Toronto (Eastern - Canada)", tz: "America/Toronto" },
  { region: "Winnipeg (Central - Canada)", tz: "America/Winnipeg" },
  { region: "Edmonton (Mountain - Canada)", tz: "America/Edmonton" },
  { region: "Vancouver (Pacific - Canada)", tz: "America/Vancouver" },
  { region: "Halifax (Atlantic - Canada)", tz: "America/Halifax" },
  { region: "St. John's (Newfoundland - Canada)", tz: "America/St_Johns" }
];

function loadTimezones() {
  const container = document.getElementById("timezoneList");
  if (!container) return;
  
  let html = "";
  const now = new Date();
  
  for (let loc of timezoneData) {
    try {
      const timeString = now.toLocaleTimeString('en-US', { timeZone: loc.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      html += `<div class="timezone-item"><strong>${loc.region}</strong><br>${timeString}</div>`;
    } catch(e) {
      html += `<div class="timezone-item"><strong>${loc.region}</strong><br>Error loading time</div>`;
    }
  }
  container.innerHTML = html;
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
