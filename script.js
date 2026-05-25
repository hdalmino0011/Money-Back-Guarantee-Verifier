function calculate() {
  const orderDate = document.getElementById("orderDate").value;
  const todayDate = document.getElementById("todayDate").value;
  const days = parseInt(document.getElementById("guaranteeDays").value);
  const resultDiv = document.getElementById("result");

  if (!orderDate || !todayDate || !days) {
    resultDiv.innerHTML = "⚠️ Please fill all fields.";
    resultDiv.className = "result";
    return;
  }

  const start = new Date(orderDate);
  const today = new Date(todayDate);

  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const remaining = days - diffDays;

  if (remaining >= 0) {
    resultDiv.className = "result active";
    resultDiv.innerHTML = `
      ✅ Still eligible for refund<br><br>
      Days remaining: ${remaining}
    `;
  } else {
    resultDiv.className = "result expired";
    resultDiv.innerHTML = `
      ❌ Coverage expired<br><br>
      Expired by: ${Math.abs(remaining)} day(s)
    `;
  }
}
