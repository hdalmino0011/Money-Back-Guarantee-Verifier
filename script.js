// AUTO SET TODAY'S DATE
window.onload = function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("todayDate").value = today;
};

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

// REFUND CALCULATOR
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

  const expirationDate = new Date(start);
  expirationDate.setDate(expirationDate.getDate() + days);

  const formattedExpiration = expirationDate.toLocaleDateString();

  let output = `
    <strong>📋 Breakdown</strong><br><br>

    Order Date: <span class="highlight">${orderDate}</span><br>
    Today's Date: <span class="highlight">${todayDate}</span><br>
    Guarantee Period: <span class="highlight">${days} days</span><br>
    Expiration Date: <span class="highlight">${formattedExpiration}</span><br><br>

    Days Used: ${diffDays}<br>
    Days Remaining: ${remaining}<br><br>
  `;

  if (remaining >= 0) {
    result.className = "active";
    output += `
      ✅ <strong style="color:green;">Refund STILL AVAILABLE</strong><br>
      ⏳ Days left before expiration: <strong>${remaining}</strong>
    `;
  } else {
    result.className = "expired";
    output += `
      ❌ <strong style="color:red;">Refund NOT AVAILABLE</strong><br>
      ⚠️ Expired by: <strong>${Math.abs(remaining)}</strong> day(s)
    `;
  }

  result.innerHTML = output;
}

// DISCOUNT CALCULATOR
function calculateDiscount() {
  const amount = parseFloat(document.getElementById("amount").value);
  const result = document.getElementById("discountResult");

  if (!amount) {
    alert("Please enter an amount!");
    return;
  }

  const discounts = [10, 35, 50, 70, 75];

  let output = `
    <strong>Original Price: ${amount.toFixed(2)}</strong><br><br>
    <strong>💸 Discount Breakdown</strong><br><br>
  `;

  discounts.forEach(d => {
    const raw = amount * d / 100;
    const discountValue = parseFloat(raw.toFixed(2));
    const finalPrice = parseFloat((amount - raw).toFixed(2));

    output += `
      <strong>${d}% Discount</strong><br>
      ${d}% of ${amount.toFixed(2)} = ${discountValue.toFixed(2)}<br>
      Final Price: <span class="highlight">${finalPrice.toFixed(2)}</span><br><br>
    `;
  });

  result.innerHTML = output;
}
