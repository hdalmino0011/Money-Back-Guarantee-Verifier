// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// NAVIGATION
function showSection(id) {
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function goHome() {
  showSection('home');

  document.getElementById("refundResult").innerHTML = "";
  document.getElementById("discountResult").innerHTML = "";
}

// AUTO TODAY
window.onload = () => {
  document.getElementById("todayDate").value =
    new Date().toISOString().split("T")[0];
};

// ===================
// MBG CHECKER
// ===================
function calculateRefund() {
  const orderDate = new Date(document.getElementById("orderDate").value);
  const todayDate = new Date(document.getElementById("todayDate").value);
  const days = parseInt(document.getElementById("guaranteeDays").value);

  const used = Math.floor((todayDate - orderDate) / (1000*60*60*24));
  const remaining = days - used;

  const exp = new Date(orderDate);
  exp.setDate(exp.getDate() + days);

  const result = `
  <strong>📋 Breakdown</strong><br><br>
  Order Date: ${orderDate.toDateString()}<br>
  Today's Date: ${todayDate.toDateString()}<br>
  Guarantee: ${days} days<br>
  Expiration: <strong>${exp.toDateString()}</strong><br><br>

  Days Used: ${used}<br>
  Days Remaining: ${remaining}<br><br>

  ${remaining >= 0
    ? "<span style='color:green'><strong>✅ Refund Available</strong></span>"
    : "<span style='color:red'><strong>❌ Refund Not Available</strong></span>"}
  `;

  document.getElementById("refundResult").innerHTML = result;
}

// ===================
// DISCOUNT (FIXED)
// ===================
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  const discounts = [10,35,50,70,75];

  let output = `<strong>Original: ${amount.toFixed(2)}</strong><br><br>`;

  discounts.forEach(d => {
    const discountVal = amount * d / 100;
    const final = amount - discountVal;

    output += `
    <strong>${d}% Discount</strong><br>
    ${d}% of ${amount.toFixed(2)} = ${discountVal.toFixed(2)}<br>
    Final Price: ${final.toFixed(2)}<br><br>
    `;
  });

  document.getElementById("discountResult").innerHTML = output;
}

// ===================
// BUSINESS TIMEFRAME
// ===================
function addBusinessDays(date, days) {
  let result = new Date(date);
  let count = 0;

  while (count < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      count++;
    }
  }
  return result;
}

function calculateTimeframe() {
  const date = new Date(document.getElementById("refundDate").value);
  const [min,max] = document.getElementById("range").value.split("-").map(Number);

  const start = addBusinessDays(date, min);
  const end = addBusinessDays(date, max);

  document.getElementById("timeframeResult").innerHTML = `
  Expected Processing Window:<br><br>
  ${start.toDateString()}<br>
  to<br>
  ${end.toDateString()}
  `;
}

// ===================
// AHT
// ===================
function convertAHT() {
  const sec = parseInt(document.getElementById("seconds").value);

  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = sec%60;

  document.getElementById("ahtResult").innerHTML =
    `Time: ${h}h ${m}m ${s}s`;
}

// ===================
// NOTES
// ===================
function loadNotes(num) {
  const text = {
    1: `Agent Name:
REASON FOR CALLING:
OFFER SAVE:
THREAT:
RESOLUTION:
ACCOUNT STATUS:`,

    2: `AGENT:
REASON FOR CALLING:
THREAT:
SAVE OFFER:
RESOLUTION:
STATUS:

campaign:
name:
phone number:
email address:
order id:
product name:`,

    3: `FOR NO ACCOUNT FOUND

Campaign:
Order Date:
Email:
Name:
Phone Number:
Product Name:
Tracking Number:
Order ID:`
  };

  document.getElementById("notesBox").value = text[num];
}

function copyNotes() {
  const box = document.getElementById("notesBox");
  box.select();
  document.execCommand("copy");
  alert("Copied!");
}
