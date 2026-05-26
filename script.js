// DARK MODE TOGGLE
function toggleDark() {
  document.body.classList.toggle("dark");
  const btn = document.querySelector(".dark-toggle");
  if (document.body.classList.contains("dark")) {
    btn.textContent = "☀️ Light Mode";
  } else {
    btn.textContent = "🌙 Dark Mode";
  }
}

// NAVIGATION
function showSection(id) {
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
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
// MBG CHECKER (FIXED LOGIC)
// ===================
function calculateRefund() {
  const orderDateStr = document.getElementById("orderDate").value;
  const todayDateStr = document.getElementById("todayDate").value;
  const guaranteeDays = parseInt(document.getElementById("guaranteeDays").value);
  
  // Validation
  if (!orderDateStr || !todayDateStr || isNaN(guaranteeDays) || guaranteeDays < 0) {
    document.getElementById("refundResult").innerHTML = `
      <span style='color:red'><strong>⚠️ Error:</strong> Please fill in all fields correctly.</span>
    `;
    return;
  }
  
  // Create date objects (normalized to avoid timezone issues)
  const orderDate = new Date(orderDateStr + "T12:00:00");
  const todayDate = new Date(todayDateStr + "T12:00:00");
  
  // Calculate days difference
  const timeDiff = todayDate - orderDate;
  const daysUsed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const daysRemaining = guaranteeDays - daysUsed;
  
  // Calculate expiration date
  const expirationDate = new Date(orderDate);
  expirationDate.setDate(expirationDate.getDate() + guaranteeDays);
  
  // Determine status
  let statusMessage = "";
  let statusColor = "";
  let daysBeyond = 0;
  
  if (daysRemaining >= 0) {
    statusMessage = `✅ REFUND AVAILABLE`;
    statusColor = "green";
  } else {
    daysBeyond = Math.abs(daysRemaining);
    statusMessage = `❌ REFUND EXPIRED`;
    statusColor = "red";
  }
  
  // Build result HTML
  let result = `
    <strong>📋 REFUND BREAKDOWN</strong><br><br>
    <strong>📅 Order Date:</strong> ${orderDate.toDateString()}<br>
    <strong>📆 Today's Date:</strong> ${todayDate.toDateString()}<br>
    <strong>⏱️ Guarantee Period:</strong> ${guaranteeDays} days<br>
    <strong>📅 Expiration Date:</strong> <strong>${expirationDate.toDateString()}</strong><br><br>
    <strong>📊 Days Used:</strong> ${daysUsed} days<br>
  `;
  
  if (daysRemaining >= 0) {
    result += `<strong>✅ Days Remaining:</strong> ${daysRemaining} days<br><br>`;
    result += `<span style='color:green; font-size:18px;'><strong>✅ Eligible for Refund</strong></span><br>`;
    result += `<span style='color:green;'>You have ${daysRemaining} day(s) left to request a refund.</span>`;
  } else {
    result += `<strong>❌ Days Expired:</strong> ${daysBeyond} days beyond guarantee<br><br>`;
    result += `<span style='color:red; font-size:18px;'><strong>❌ NOT Eligible for Refund</strong></span><br>`;
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
      <span style='color:red'><strong>⚠️ Error:</strong> Please enter a valid amount.</span>
    `;
    return;
  }
  
  const discounts = [10, 35, 50, 70, 75];
  let output = `<strong>💰 Original Amount: $${amount.toFixed(2)}</strong><br><br>`;
  
  discounts.forEach(d => {
    const discountAmount = amount * d / 100;
    const finalPrice = amount - discountAmount;
    
    output += `
      <strong>🎯 ${d}% Discount</strong><br>
      💸 Discount Amount: $${discountAmount.toFixed(2)}<br>
      💵 Final Price: <strong>$${finalPrice.toFixed(2)}</strong><br><br>
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
    // Skip Saturdays (6) and Sundays (0)
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
      <span style='color:red'><strong>⚠️ Error:</strong> Please select a refund request date.</span>
    `;
    return;
  }
  
  const refundDate = new Date(refundDateStr + "T12:00:00");
  const rangeValue = document.getElementById("range").value;
  const [minDays, maxDays] = rangeValue.split("-").map(Number);
  
  const startDate = addBusinessDays(refundDate, minDays);
  const endDate = addBusinessDays(refundDate, maxDays);
  
  document.getElementById("timeframeResult").innerHTML = `
    <strong>📅 Expected Refund Processing Window:</strong><br><br>
    🟢 From: <strong>${startDate.toDateString()}</strong><br>
    🔴 To: <strong>${endDate.toDateString()}</strong><br><br>
    <span style='font-size:13px;'>⚠️ Excludes weekends (Saturday & Sunday)</span>
  `;
}

// ===================
// AHT CONVERTER
// ===================
function convertAHT() {
  const seconds = parseInt(document.getElementById("seconds").value);
  
  if (isNaN(seconds) || seconds < 0) {
    document.getElementById("ahtResult").innerHTML = `
      <span style='color:red'><strong>⚠️ Error:</strong> Please enter valid seconds.</span>
    `;
    return;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = `<strong>⏱️ AHT Conversion:</strong><br><br>`;
  result += `<strong>${seconds}</strong> seconds = <br>`;
  
  if (hours > 0) result += `<strong>${hours}</strong> hour(s) `;
  if (minutes > 0) result += `<strong>${minutes}</strong> minute(s) `;
  if (secs > 0 || (hours === 0 && minutes === 0)) result += `<strong>${secs}</strong> second(s)`;
  
  document.getElementById("ahtResult").innerHTML = result;
}

// ===================
// NOTES TEMPLATES
// ===================
function loadNotes(num) {
  const templates = {
    1: `📋 NOTATION TYPE 1
━━━━━━━━━━━━━━━━━━━━━━

Agent Name: 
REASON FOR CALLING: 
OFFER SAVE: 
THREAT: 
RESOLUTION: 
ACCOUNT STATUS: 

━━━━━━━━━━━━━━━━━━━━━━
Date: ${new Date().toLocaleDateString()}`,

    2: `📋 NOTATION TYPE 2
━━━━━━━━━━━━━━━━━━━━━━

AGENT: 
REASON FOR CALLING: 
THREAT: 
SAVE OFFER: 
RESOLUTION: 
STATUS: 

━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER DETAILS:
Campaign: 
Name: 
Phone Number: 
Email Address: 
Order ID: 
Product Name: 

━━━━━━━━━━━━━━━━━━━━━━
Date: ${new Date().toLocaleDateString()}`,

    3: `📋 NOTATION TYPE 3
━━━━━━━━━━━━━━━━━━━━━━

⚠️ FOR NO ACCOUNT FOUND ⚠️

Campaign: 
Order Date: 
Email: 
Name: 
Phone Number: 
Product Name: 
Tracking Number: 
Order ID: 

━━━━━━━━━━━━━━━━━━━━━━
Date: ${new Date().toLocaleDateString()}`
  };
  
  document.getElementById("notesBox").value = templates[num] || "";
}

function copyNotes() {
  const notesBox = document.getElementById("notesBox");
  notesBox.select();
  notesBox.setSelectionRange(0, 99999); // For mobile devices
  
  try {
    document.execCommand("copy");
    alert("✅ Notes copied to clipboard!");
  } catch(err) {
    alert("❌ Failed to copy. Please manually copy the text.");
  }
}
