function calculate() {
  const orderDate = document.getElementById("orderDate").value;
  const todayDate = document.getElementById("todayDate").value;
  const days = parseInt(document.getElementById("guaranteeDays").value);

  if (!orderDate || !todayDate || !days) {
    alert("Please fill all fields!");
    return;
  }

  const start = new Date(orderDate);
  const today = new Date(todayDate);

  const diffTime = today - start;
  const usedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remaining = days - usedDays;

  let statusText = "";
  let color = "";

  if (remaining >= 0) {
    statusText = "Refund is STILL AVAILABLE";
    color = "green";
  } else {
    statusText = "Refund is NOT AVAILABLE";
    color = "red";
  }

  // ✅ OPEN RESULT WINDOW (CENTERED)
  const width = 500;
  const height = 600;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;

  const newWindow = window.open(
    "",
    "_blank",
    `width=${width},height=${height},left=${left},top=${top}`
  );

  newWindow.document.write(`
    <html>
    <head>
      <title>Refund Breakdown</title>
      <style>
        body {
          font-family: "Times New Roman", serif;
          background: linear-gradient(to bottom right, #7ec8ff, #2d8cff);
          margin: 0;
          padding: 20px;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 20px;
          max-width: 450px;
          margin: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .line {
          margin: 10px 0;
          font-size: 16px;
        }

        .status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: ${color};
          border: 2px solid ${color};
        }

        footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
        }
      </style>
    </head>
    <body>

      <div class="card">
        <h2>Refund Breakdown</h2>

        <div class="line"><strong>Order Date:</strong> ${orderDate}</div>
        <div class="line"><strong>Today's Date:</strong> ${todayDate}</div>
        <div class="line"><strong>Guarantee Days:</strong> ${days}</div>
        <div class="line"><strong>Days Used:</strong> ${usedDays}</div>
        <div class="line"><strong>Days Remaining:</strong> ${remaining}</div>

        <div class="status">${statusText}</div>

        <footer>All Rights Reserved 2026</footer>
      </div>

    </body>
    </html>
  `);

  newWindow.document.close();
}
