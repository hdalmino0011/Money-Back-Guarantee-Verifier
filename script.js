// ==========================
// NAVIGATION FUNCTIONS
// ==========================
function showGuarantee() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("guarantee").classList.remove("hidden");
}

function showDiscount() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("discount").classList.remove("hidden");
}

function goHome() {
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("guarantee").classList.add("hidden");
  document.getElementById("discount").classList.add("hidden");

  // Clear results when going back
  document.getElementById("refundResult").innerHTML = "";
  document.getElementById("discountResult").innerHTML = "";
}

// ==========================
// REFUND CALCULATOR
// ==========================
function calculateRefund() {
  const orderDate = document.getElementById("orderDate").value;
  const todayDate = document.getElementById("todayDate").value;
  const days = parseInt(document.getElementById("guaranteeDays").value);

  const result = document.getElementById("refundResult");

  if (!orderDate || !todayDate || !days) {
    alert("Please fill all fields!");
    return;
  }

  const start = new Date(orderDate);
  const today = new Date(todayDate);

  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const remaining = days - diffDays;

  if (remaining >= 0) {
    result.className = "active";
    result.innerHTML = `
      ✅ <strong>Refund Available</strong><br><br>
      Days Used: ${diffDays}<br>
      Days Remaining: ${remaining}
    `;
  } else {
    result.className = "expired";
    result.innerHTML = `
      ❌ <strong>Refund Not Available</strong><br><br>
      Expired by: ${Math.abs(remaining)} day(s)
    `;
  }
}

// ==========================
// DISCOUNT CALCULATOR (FIXED)
// ==========================
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  const result = document.getElementById("discountResult");

  if (!amount) {
    alert("Please enter an amount!");
    return;
  }

  const discounts = [10, 35, 50, 70, 75];

  let output = `
    <strong>Original Price: ${amount.toFixed(2)}</strong>
    <br><br>
    <strong>Discount Breakdown:</strong><br><br>
  `;

  discounts.forEach(d => {
    // Calculate discount value
    const rawDiscount = amount * d / 100;
    const discountValue = parseFloat(rawDiscount.toFixed(2));

    // Calculate final price
    const finalPrice = parseFloat((amount - rawDiscount).toFixed(2));

    output += `
      <strong>${d}% Discount</strong><br>
      ${d}% of ${amount.toFixed(2)} = ${discountValue.toFixed(2)}<br>
      Final Price: ${finalPrice.toFixed(2)}<br><br>
    `;
  });

  result.innerHTML = output;
}
