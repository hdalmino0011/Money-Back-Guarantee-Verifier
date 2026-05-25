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
    statusText = "✅ Refund is STILL AVAILABLE";
    color = "green";
  } else {
    statusText = "❌ Refund is NOT AVAILABLE";
    color = "red";
  }

  // ✅ NEW WINDOW DISPLAY
  const newWindow = window.open("", "_blank");

  newWindow.document.write(`
    <html>
    <head>
      <title>Refund Result</title>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Press Start 2P', cursive;
          background: linear-gradient(to bottom right, #7ec8ff, #2d8cff);
          color: black;
          padding: 20px;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 20px;
          max-width: 500px;
          margin: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        h2 {
          text-align: center;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .line {
          margin: 12px 0;
          font-size: 10px;
        }

        .status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          font-size: 10px;
          color: ${color};
          border: 2px solid ${color};
        }
      </style>
    </head>
    <body>

      <div class="card">
        <h2>Refund Breakdown</h2>

        <div class="line">Order Date: ${orderDate}</div>
        <div class="line">Today's Date: ${todayDate}</div>
        <div class="line">Guarantee Days: ${days}</div>
        <div class="line">Days Used: ${usedDays}</div>
        <div class="line">Days Remaining: ${remaining}</div>

        <div class="status">${statusText}</div>
      </div>

    </body>
    </html>
  `);

  newWindow.document.close();
}
