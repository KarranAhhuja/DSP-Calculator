// ===== FORMAT FUNCTIONS =====

// Format number to 2 decimal places
function formatNum(num) {
  return Number(num).toFixed(2);
}

// Format integer with commas (e.g., 1,000)
function formatInt(num) {
  return Number(num).toLocaleString("en-US");
}

// Format number as USD currency
function formatUSD(num) {
  return (
    "$" +
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// ===== MAIN CALCULATION FUNCTION =====

function calculate() {
  let routesInput = document.getElementById("routes");

  // Remove any non-digit characters (safety sanitization)
  let raw = routesInput.value.replace(/[^0-9]/g, "");

  // Treat empty input as 0 internally
  let routes = raw === "" ? 0 : parseInt(raw);

  // If routes is 0, reset all outputs
  if (routes === 0) {
    document.getElementById("active").value = "0";
    document.getElementById("hire").value = "0";

    ["b4", "b5", "b6", "b7", "b8", "total", "quarter", "annual"].forEach(
      (id) => (document.getElementById(id).value = "0.00"),
    );

    return;
  }

  // ===== BUSINESS LOGIC =====

  let active = Math.round(routes * 2.1);
  document.getElementById("active").value = formatInt(active);

  let hire = Math.round(active * 0.1);
  document.getElementById("hire").value = formatInt(hire);

  let b4 = hire * 0.33;
  let b5 = 27.0;

  let avg_claims = 0.0843;
  let avg_hours = 4.105;
  let avg_litigation = 0.0832;

  let a = active * avg_claims * avg_hours;
  let b = hire * 0.3 * avg_hours;
  let c = (active + hire) * avg_litigation * (0.5 * avg_hours);

  let b6 = a + b + c;
  let b7 = active <= 70 ? 6.0 : 7.2;
  let b8 = 3.0;

  document.getElementById("b4").value = formatNum(b4);
  document.getElementById("b5").value = formatNum(b5);
  document.getElementById("b6").value = formatNum(b6);
  document.getElementById("b7").value = formatNum(b7);
  document.getElementById("b8").value = formatNum(b8);

  let total = b4 + b5 + b6 + b7 + b8;
  document.getElementById("total").value = formatNum(total) + " hrs";

  let quarter;
  if (active <= 20) quarter = total * 48;
  else if (active <= 30) quarter = total * 96;
  else if (active <= 45) quarter = total * 145;
  else quarter = total * 290;

  document.getElementById("quarter").value = formatUSD(quarter);
  document.getElementById("annual").value = formatUSD(quarter * 4);
}

// ===== INPUT HANDLING =====

const routesInput = document.getElementById("routes");

// Recalculate on input or change
["input", "change"].forEach((evt) => {
  routesInput.addEventListener(evt, calculate);
});

// Enforce strict numeric input (no text allowed)
routesInput.addEventListener("input", function () {
  // Remove any non-digit characters immediately
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Block non-numeric key presses
routesInput.addEventListener("keydown", function (e) {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

  // Allow navigation and editing keys
  if (allowedKeys.includes(e.key)) return;

  // Block any key that is not a digit
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
});

// Do NOT run calculation on page load to keep input empty

// ===== BASIC PROTECTION (DETERRENT ONLY) =====

// Disable right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Block common developer tool and action shortcuts
document.addEventListener("keydown", function (e) {
  // Block F12 (DevTools)
  if (e.key === "F12") {
    e.preventDefault();
  }

  // Block Ctrl+Shift+I, J, C (DevTools shortcuts)
  if (
    e.ctrlKey &&
    e.shiftKey &&
    ["I", "J", "C"].includes(e.key.toUpperCase())
  ) {
    e.preventDefault();
  }

  // Block Ctrl+U (View Source)
  if (e.ctrlKey && e.key.toUpperCase() === "U") {
    e.preventDefault();
  }

  // Block Ctrl+S (Save Page)
  if (e.ctrlKey && e.key.toUpperCase() === "S") {
    e.preventDefault();
  }

  // Block Ctrl+C, Ctrl+V, Ctrl+X (Copy, Paste, Cut)
  if (e.ctrlKey && ["C", "V", "X"].includes(e.key.toUpperCase())) {
    e.preventDefault();
  }
});

// Disable copy, paste, and cut actions
["copy", "paste", "cut"].forEach((evt) => {
  document.addEventListener(evt, function (e) {
    e.preventDefault();
  });
});