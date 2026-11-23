/* ========== מצב כהה ========== */
(function () {
  var root = document.documentElement;
  var STORAGE_KEY = "theme";
  var toggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    var dark = theme === "dark";
    root.setAttribute("data-theme", dark ? "dark" : "light");
    if (toggle) {
      toggle.setAttribute("aria-pressed", dark ? "true" : "false");
      toggle.querySelector("span[aria-hidden]").textContent = dark ? "☀️" : "🌙";
      toggle.querySelector(".theme-toggle-text").textContent = dark ? "מצב בהיר" : "מצב כהה";
    }
  }

  // טעינת ההעדפה השמורה, ואם אין — לפי הגדרות המערכת
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }

  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* דפדפן שחוסם אחסון מקומי — המצב פשוט לא יישמר */
      }
    });
  }
})();

/* ========== בדיקת טופס יצירת הקשר ========== */
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  var rules = [
    {
      id: "name",
      check: function (v) {
        if (v.length === 0) return "נא למלא שם.";
        if (v.length < 2) return "השם חייב להכיל לפחות שני תווים.";
        return "";
      }
    },
    {
      id: "email",
      check: function (v) {
        if (v.length === 0) return "נא למלא כתובת אימייל.";
        if (!EMAIL_RE.test(v)) return "כתובת האימייל אינה תקינה. דוגמה: name@example.com";
        return "";
      }
    },
    {
      id: "message",
      check: function (v) {
        if (v.length === 0) return "נא לכתוב הודעה.";
        if (v.length < 10) return "ההודעה קצרה מדי — לפחות 10 תווים.";
        return "";
      }
    }
  ];

  function validateField(rule) {
    var input = document.getElementById(rule.id);
    var errorBox = document.getElementById(rule.id + "-error");
    var msg = rule.check(input.value.trim());

    errorBox.textContent = msg;
    if (msg) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
    } else {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    }
    return msg === "";
  }

  // בדיקה חוזרת תוך כדי תיקון, אחרי שהשדה כבר סומן כשגוי
  rules.forEach(function (rule) {
    var input = document.getElementById(rule.id);
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) validateField(rule);
    });
    input.addEventListener("blur", function () {
      if (input.value.trim() !== "") validateField(rule);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var firstInvalid = null;
    var allValid = true;

    rules.forEach(function (rule) {
      var ok = validateField(rule);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = document.getElementById(rule.id);
      }
    });

    if (!allValid) {
      status.textContent = "לא ניתן לשלוח — יש שדות שדורשים תיקון.";
      status.className = "form-status bad";
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.textContent = "הטופס מלא ותקין, תודה! (האתר סטטי, לכן ההודעה לא נשלחה בפועל)";
    status.className = "form-status ok";
    form.reset();
  });
})();
