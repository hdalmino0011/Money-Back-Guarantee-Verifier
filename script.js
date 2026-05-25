// NAVIGATION
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

  document.getElementById("refundResult").innerHTML = "";
  document.getElementById("discountResult").innerHTML = "";
}

// REFUND CALCULATION
function calculateRefund() {
  const orderDate = document.getElementById("orderDate").value;
  const todayDate = document.getElementById("todayDate").value;
  const days = parseInt(document.getElementById("guaranteeDays").value);
  const result = document.getElementById("refundResult");

  if (!orderDate || !todayDate || !days) {
    alert("Fill all fields");
    return;
  }

  const start = new Date(orderDate);
  const today = new Date(todayDate);

  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const remaining = days - diffDays;

  if (remaining >= 0) {
    result.className = "active";
    result.innerHTML = `
      ✅ Refund Available <br><br>
      Days Used: ${diffDays} <br>
      Days Remaining: ${remaining}
    `;
  } else {
    result.className = "expired";
    result.innerHTML = `
      ❌ Refund Not Available <br><br>
      Expired by: ${Math.abs(remaining)} days
    `;
  }
}

// DISCOUNT CALCULATION
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  const result = document.getElementById("discountResult");

  if (!amount) {
    alert("Enter amount");
    return;
  }

  const discounts = [10, 35, 50, 70, 75];

  let output = "<strong>Discount Breakdown:</strong><br><br>";

  discounts.forEach(d => {
    const discounted = amount - (amount * d / 100);
    output += `${d}% OFF → ${discounted.toFixed(2)}<br>`;
  });

  result.innerHTML = output;
}
