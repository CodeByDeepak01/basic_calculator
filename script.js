const exprEl = document.getElementById("expression");
const resEl = document.getElementById("result");
let expression = "";

function updateDisplay() {
  exprEl.textContent = expression || "\u00A0";
  resEl.textContent = expression ? expression : "0";
}

function safeEval(exp) {
  const safe = exp.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (/[^0-9.+\-*/()%\s]/.test(safe)) throw new Error("Invalid characters");
  return Function("return (" + safe + ")")();
}

function append(val) {
  if (val === ".") {
    const parts = expression.split(/[^0-9.]/);
    const last = parts[parts.length - 1];
    if (last.includes(".")) return;
    if (last === "") expression += "0";
  }
  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = "";
  updateDisplay();
}
function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function percent() {
  try {
    if (!expression) return;
    const val = safeEval(expression);
    expression = String(val / 100);
    updateDisplay();
  } catch {
    resEl.textContent = "Error";
  }
}

function compute() {
  try {
    if (!expression) return;
    const val = safeEval(expression);
    expression = String(Number.isFinite(val) ? +(+val).toPrecision(12) : val);
    updateDisplay();
  } catch {
    resEl.textContent = "Error";
  }
}

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const v = btn.getAttribute("data-value");
    const a = btn.getAttribute("data-action");
    if (a === "clear") clearAll();
    else if (a === "back") backspace();
    else if (a === "equals") compute();
    else if (a === "percent") percent();
    else if (v) append(v);
  });
});

window.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey) return;
  const key = e.key;
  if (/^[0-9]$/.test(key)) {
    append(key);
    e.preventDefault();
  } else if (key === ".") {
    append(".");
    e.preventDefault();
  } else if (key === "Enter" || key === "=") {
    compute();
    e.preventDefault();
  } else if (key === "Backspace") {
    backspace();
    e.preventDefault();
  } else if (key === "Escape") {
    clearAll();
    e.preventDefault();
  } else if (["+", "-", "*", "/", "%", "(", ")"].includes(key)) {
    append(key);
    e.preventDefault();
  }
});

updateDisplay();
