//SIDEBAR CONTROLL
let toggleAsideBtns = document.querySelectorAll(".toggleAside");
let sideMenu = document.querySelector(".sideMenu");

toggleAsideBtns.forEach((toggleAsideBtn) => {
  toggleAsideBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("active");
  });
});

// PASSWORD STRENGTH
let passwordEntropy = "";

function calculatePasswordEntropy(pass) {
  // Define the character sets and their sizes
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digitChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/\\";

  // Create an array to store character sets used in the password
  const charSets = [];

  // Check if the password includes each character set and add to charSets
  if (new RegExp("[" + lowercaseChars + "]").test(pass)) {
    charSets.push(lowercaseChars);
  }
  if (new RegExp("[" + uppercaseChars + "]").test(pass)) {
    charSets.push(uppercaseChars);
  }
  if (new RegExp("[" + digitChars + "]").test(pass)) {
    charSets.push(digitChars);
  }
  if (new RegExp("[" + specialChars + "]").test(pass)) {
    charSets.push(specialChars);
  }

  // Calculate the number of possible characters
  let numPossibleChars = 0;
  for (const charSet of charSets) {
    numPossibleChars += charSet.length;
  }

  // Calculate password entropy
  passwordEntropy = Math.floor(
    Math.log2(Math.pow(numPossibleChars, pass.length))
  );

  if (passwordEntropy < 10) {
    passwordStrength.innerText = "Very Weak";
    passwordStrength.style.background = "#f00";
  } else if (passwordEntropy >= 10 && passwordEntropy < 50) {
    passwordStrength.innerText = "Weak";
    passwordStrength.style.background = "#cf4d02";
  } else if (passwordEntropy >= 50 && passwordEntropy <= 60) {
    passwordStrength.innerText = "Normal";
    passwordStrength.style.background = "#ff9900";
  } else if (passwordEntropy >= 60 && passwordEntropy < 80) {
    passwordStrength.innerText = "Strong";
    passwordStrength.style.background = "#84cf02";
  } else if (passwordEntropy >= 80 && passwordEntropy < 100) {
    passwordStrength.innerText = "Very Strong";
    passwordStrength.style.background = "#37ad00";
  } else if (passwordEntropy > 100) {
    passwordStrength.innerText = "Strongest";
    passwordStrength.style.background = "#005e03";
  }
}

//PASSWORD GENERATOR
let passwordStrength = document.querySelector(".strength");
let passwordHistory = JSON.parse(localStorage.getItem("passwordHistory")) || [];

let passwordBox = document.querySelector(".password");

let includes = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "1234567890",
  "!@#$%^&*()_+-=[]{}|;:'\",.<>?/\\",
];

let range = document.getElementById("passLength");
let rangeTooltip = document.querySelector(".range-tooltip");
let passLength = 16;
rangeTooltip.innerText = passLength;

range.addEventListener("input", () => {
  passLength = range.value;

  rangeTooltip.innerText = range.value;
  generatePassword();
});

let includeChecks = document.getElementsByName("passInclude");

includeChecks.forEach((includeCheck) => {
  includeCheck.addEventListener("click", () => {
    generatePassword();
  });
});

function generatePassword() {
  let password = "";

  let chars = "";

  for (i = 0; i < includeChecks.length; i++) {
    chars += includeChecks[i].checked ? includes[i] : "";
  }

  for (i = 0; i < passLength; i++) {
    let rand = Math.floor(Math.random() * chars.length);
    password += chars.substring(rand, rand + 1);
  }
  passwordBox.innerText = password;
  calculatePasswordEntropy(password);
}
generatePassword();

//COPY PASSWORD
async function copyPassword() {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(passwordBox.innerText);
  }
  savePassword();
}

let passwordHistoryList = document.querySelector(".history");

function loadSavedPasswords() {
  let historyHTMl = "";

  for (i = 0; i < passwordHistory.length; i++) {
    let historyItem = passwordHistory[i];
    const { password, date } = historyItem;

    let html = `<div class="history-item">
                    <p class="history-date">${date}</p>
                    <p class="history-password">${password}
                    </p>
                    <i class="bx bx-copy historyCopy" onclick="
                      navigator.clipboard.writeText('${password}')
                    "></i>
                </div>`;
    historyHTMl += html;
  }
  passwordHistoryList.innerHTML = historyHTMl;
}

loadSavedPasswords();

function savePassword() {
  // Create a new Date object with the current timestamp
  const currentDate = new Date();

  // Format the date and time components
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("en-GB", { month: "short" });
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const date = `${day} ${month} ${year} | ${hours}:${minutes}`;

  let password = passwordBox.innerText;

  let newData = { password, date };
  passwordHistory.unshift(newData);
  localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));
  loadSavedPasswords();
}

// CLEAR HISTORY
let clearHistoryBtn = document.querySelector(".clearHistory");
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Do you want to clear your password history?")) {
    localStorage.removeItem("passwordHistory");
    passwordHistory = [];
    loadSavedPasswords();
  }
});

//KEYPRESS FUNCTIONS
document.addEventListener("keypress", (event) => {
  event.key === " " ? generatePassword() : "";
  event.key === "c" || event.key === "C" ? copyPassword() : "";
  event.key === "d" || event.key === "D" ? handleDarkMode() : "";
  event.key === "h" || event.key === "H"
    ? sideMenu.classList.toggle("active")
    : "";
  console.log(event);
});

//HANDLE DARK MODE
function handleDarkMode() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    localStorage.removeItem("dark");
    document.querySelector(".logo").setAttribute("src", "img/logo.png");
  } else {
    document.body.classList.add("dark");
    localStorage.setItem("dark", "dark");
    document.querySelector(".logo").setAttribute("src", "img/logo-dark.png");
  }
}

if (localStorage.getItem("dark")) {
  document.body.classList.add("dark");
}
