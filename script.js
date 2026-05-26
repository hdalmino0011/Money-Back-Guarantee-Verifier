// NAVIGATION
function showSection(id) {
  document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function goHome() {
  showSection('home');
}

// AUTO TODAY
window.onload = () => {
  const today = new Date().toISOString().split("T")[0];
  if (document.getElementById("todayDate"))
    document.getElementById("todayDate").value = today;
};

// =====================
// REFUND CHECKER
// =====================
function calculateRefund() {
  const orderDate = document.getElementById("orderDate").value;
  const todayDate = document.getElementById("todayDate").value;
  const days = parseInt(document.getElementById("guaranteeDays").value);

  const start = new Date(orderDate);
  const today = new Date(todayDate);

  const used = Math.floor((today - start) / (1000*60*60*24));
  const remaining = days - used;

  const exp = new Date(start);
  exp.setDate(exp.getDate() + days);

  document.getElementById("refundResult").innerHTML = `
    Expiration: ${exp.toDateString()}<br>
    Days Used: ${used}<br>
    Days Remaining: ${remaining}<br><br>
    ${remaining >= 0 ? "✅ Refund Available" : "❌ Refund Not Available"}
  `;
}

// =====================
// DISCOUNT
// =====================
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  const discounts = [10,35,50,70,75];

  let html = "";

  discounts.forEach(d => {
    const disc = (amount*d/100).toFixed(2);
    const final = (amount - disc).toFixed(2);

    html += `${d}% → ${disc} | Final: ${final}<br>`;
  });

  document.getElementById("discountResult").innerHTML = html;
}

// =====================
// BUSINESS DAY ADDER
// =====================
function addBusinessDays(date, days) {
  let result = new Date(date);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      added++;
    }
  }
  return result;
}

// =====================
// TIMEFRAME
// =====================
function calculateTimeframe() {
  const date = new Date(document.getElementById("refundDate").value);
  const range = document.getElementById("range").value;

  const [min,max] = range.split("-").map(Number);

  const start = addBusinessDays(date, min);
  const end = addBusinessDays(date, max);

  document.getElementById("timeframeResult").innerHTML = `
    Expected Between:<br>
    ${start.toDateString()}<br>
    and<br>
    ${end.toDateString()}
  `;
}

// =====================
// AHT
// =====================
function convertAHT() {
  const sec = parseInt(document.getElementById("seconds").value);

  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600)/60);
  const s = sec % 60;

  document.getElementById("ahtResult").innerHTML =
    `${h}h ${m}m ${s}s`;
}

// =====================
// NOTES
// =====================
function loadNotes(type) {
  let text = "";

  if (type === 1) {
text = `Agent Name:
REASON FOR CALLING:
OFFER SAVE:
THREAT:
RESOLUTION:
ACCOUNT STATUS:`; }

  if (type === 2) {
text = `AGENT:
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
product name:`; }

  if (type === 3) {
text = `FOR NO ACCOUNT FOUND

Campaign:
Order Date:
Email:
Name:
Phone Number:
Product Name:
Tracking Number:
Order ID:`; }

  document.getElementById("notesBox").value = text;
}

function copyNotes() {
  const box = document.getElementById("notesBox");
  box.select();
  document.execCommand("copy");
  alert("Copied!");
}
