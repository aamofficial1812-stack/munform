/* ============================================================
   AIKTCMUN 2026 — Delegate Registration
   Form logic: step navigation, dynamic portfolios with flags,
   registration type & delegate pricing, payment collection,
   validation, review, and submission handoff.
   ============================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------
     Portfolio data
     UNHRC entries carry an ISO 3166-1 alpha-2 code used to
     render a flag from flagcdn.com. AIPPM portfolios are
     political personalities and intentionally carry no flag.
     -------------------------------------------------------- */
  const PORTFOLIOS = {
    UNHRC: [
      { name: "People\u2019s Democratic Republic of Algeria", code: "dz" },
      { name: "Republic of Angola", code: "ao" },
      { name: "Commonwealth of Australia", code: "au" },
      { name: "Plurinational State of Bolivia", code: "bo" },
      { name: "Republic of Botswana", code: "bw" },
      { name: "Federative Republic of Brazil", code: "br" },
      { name: "Canada", code: "ca" },
      { name: "Republic of Chile", code: "cl" },
      { name: "People\u2019s Republic of China", code: "cn" },
      { name: "Republic of Costa Rica", code: "cr" },
      { name: "Republic of Cuba", code: "cu" },
      { name: "Democratic People\u2019s Republic of Korea", code: "kp" },
      { name: "Kingdom of Denmark", code: "dk" },
      { name: "Republic of Finland", code: "fi" },
      { name: "Federal Republic of Germany", code: "de" },
      { name: "State of Israel", code: "il" },
      { name: "Italian Republic", code: "it" },
      { name: "Japan", code: "jp" },
      { name: "Lao People\u2019s Democratic Republic", code: "la" },
      { name: "Republic of Mauritius", code: "mu" },
      { name: "United Mexican States", code: "mx" },
      { name: "Republic of Mozambique", code: "mz" },
      { name: "Federal Democratic Republic of Nepal", code: "np" },
      { name: "New Zealand", code: "nz" },
      { name: "Republic of Nicaragua", code: "ni" },
      { name: "Kingdom of Norway", code: "no" },
      { name: "State of Qatar", code: "qa" },
      { name: "Republic of Singapore", code: "sg" },
      { name: "Republic of South Africa", code: "za" },
      { name: "Republic of Korea", code: "kr" },
      { name: "Kingdom of Spain", code: "es" },
      { name: "Democratic Socialist Republic of Sri Lanka", code: "lk" },
      { name: "Kingdom of Sweden", code: "se" },
      { name: "Swiss Confederation", code: "ch" },
      { name: "United Republic of Tanzania", code: "tz" },
      { name: "United Arab Emirates", code: "ae" },
      { name: "United Kingdom of Great Britain and Northern Ireland", code: "gb" },
      { name: "United States of America", code: "us" },
      { name: "Oriental Republic of Uruguay", code: "uy" },
      { name: "Bolivarian Republic of Venezuela", code: "ve" },
      { name: "Socialist Republic of Vietnam", code: "vn" },
      { name: "Kingdom of Saudi Arabia", code: "sa" }
    ],
    AIPPM: [
      { name: "Abhijeet Dipke (Cockroach Janta Party)" },
      { name: "Akhilesh Yadav (Samajwadi Party)" },
      { name: "Amit Shah (Bharatiya Janata Party)" },
      { name: "Anurag Singh Thakur (Bharatiya Janata Party)" },
      { name: "Arvind Kejriwal (Aam Aadmi Party)" },
      { name: "Asaduddin Owaisi (All India Majlis-e-Ittehadul Muslimeen)" },
      { name: "Ashwini Vaishnaw (Bharatiya Janata Party)" },
      { name: "Atishi Marlena (Aam Aadmi Party)" },
      { name: "Chandrashekhar Azad (Azad Samaj Party\u2013Kanshi Ram)" },
      { name: "Chirag Paswan (Lok Janshakti Party\u2013Ram Vilas)" },
      { name: "D. Raja (Communist Party of India)" },
      { name: "Derek O\u2019Brien (All India Trinamool Congress)" },
      { name: "Dharmendra Pradhan (Bharatiya Janata Party)" },
      { name: "Digvijaya Singh (Indian National Congress)" },
      { name: "Gaurav Gogoi (Indian National Congress)" },
      { name: "Hardeep Singh Puri (Bharatiya Janata Party)" },
      { name: "Hemant Soren (Jharkhand Mukti Morcha)" },
      { name: "Jairam Ramesh (Indian National Congress)" },
      { name: "Jyotiraditya M. Scindia (Bharatiya Janata Party)" },
      { name: "Kanimozhi Karunanidhi (Dravida Munnetra Kazhagam)" },
      { name: "Kapil Sibal (Independent)" },
      { name: "K. C. Venugopal (Indian National Congress)" },
      { name: "Mahua Moitra (All India Trinamool Congress)" },
      { name: "Mallikarjun Kharge (Indian National Congress)" },
      { name: "Manish Tewari (Indian National Congress)" },
      { name: "Manoj Kumar Jha (Rashtriya Janata Dal)" },
      { name: "Mamata Banerjee (All India Trinamool Congress)" },
      { name: "Mehbooba Mufti (Jammu and Kashmir Peoples Democratic Party)" },
      { name: "Narendra Modi (Bharatiya Janata Party)" },
      { name: "Nirmala Sitharaman (Bharatiya Janata Party)" },
      { name: "Pinarayi Vijayan (Communist Party of India (Marxist))" },
      { name: "Priyanka Gandhi Vadra (Indian National Congress)" },
      { name: "Rahul Gandhi (Indian National Congress)" },
      { name: "Raghav Chadha (Aam Aadmi Party)" },
      { name: "Sachin Pilot (Indian National Congress)" },
      { name: "Sanjay Raut (Shiv Sena (Uddhav Balasaheb Thackeray))" },
      { name: "Saurav Das (Cockroach Janta Party)" },
      { name: "Shashi Tharoor (Indian National Congress)" },
      { name: "Smriti Irani (Bharatiya Janata Party)" },
      { name: "Sudhanshu Trivedi (Bharatiya Janata Party)" },
      { name: "Supriya Sule (Nationalist Congress Party\u2013Sharadchandra Pawar)" }
    ]
  };

  const FLAG_BASE = "https://flagcdn.com/w40/";
  const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_SCREENSHOT_TYPES = ["image/jpeg", "image/png", "image/webp"];

  /* --------------------------------------------------------
     Backend — Google Apps Script Web App
     -------------------------------------------------------- */
  const API_URL =
    "https://script.google.com/macros/s/AKfycbxcnedwxwyqhsPLSuhsCKqAOXCtC0toCIrxudZO3fpX9bkN3RpOzUD7cqwdhPxXvPm3oA/exec";

  /* --------------------------------------------------------
     State
     -------------------------------------------------------- */
  const state = {
    step: 1,
    totalSteps: 5,
    registrationId: "",
    committee: "",
    fullName: "",
    email: "",
    mobile: "",
    college: "",
    munExperience: "",
    preference1: "",
    preference2: "",
    registrationType: "",
    numberOfDelegates: 1,
    amountPayable: 0,
    paymentTransactionId: "",
    paymentScreenshot: null
  };

  /* --------------------------------------------------------
     Element refs
     -------------------------------------------------------- */
  const form = document.getElementById("registrationForm");
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const progressItems = Array.from(document.querySelectorAll(".progress-item"));
  const progressFill = document.getElementById("progressFill");
  const successScreen = document.getElementById("successScreen");

  const committeeInputs = Array.from(document.querySelectorAll('input[name="committee"]'));
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobile");
  const collegeInput = document.getElementById("college");
  const munExperienceSelect = document.getElementById("munExperience");
  const ebSection = document.getElementById("ebSection");

  const registrationTypeInputs = Array.from(document.querySelectorAll('input[name="registrationType"]'));
  const delegateCountInput = document.getElementById("numberOfDelegates");
  const delegateMinusBtn = document.getElementById("delegateMinus");
  const delegatePlusBtn = document.getElementById("delegatePlus");
  const stepperChips = Array.from(document.querySelectorAll(".stepper-chip"));

  const pricingType = document.getElementById("pricingType");
  const pricingDelegates = document.getElementById("pricingDelegates");
  const pricingRate = document.getElementById("pricingRate");
  const pricingTotal = document.getElementById("pricingTotal");
  const paymentAmountValue = document.getElementById("paymentAmountValue");

  const paymentTransactionIdInput = document.getElementById("paymentTransactionId");
  const paymentScreenshotInput = document.getElementById("paymentScreenshot");
  const fileUploadBtn = document.getElementById("fileUploadBtn");
  const fileUploadName = document.getElementById("fileUploadName");

  const submitBtn =
    form.querySelector('[data-action="submit"]') ||
    form.querySelector('button[type="submit"]') ||
    form.querySelector('input[type="submit"]');
  const submitBtnDefaultText = submitBtn ? submitBtn.textContent : "";

  /* --------------------------------------------------------
     Currency formatting
     -------------------------------------------------------- */
  function formatRupees(amount) {
    return "\u20B9" + Number(amount || 0).toLocaleString("en-IN");
  }

  /* --------------------------------------------------------
     Step navigation
     -------------------------------------------------------- */
  function goToStep(stepNumber) {
    state.step = stepNumber;

    steps.forEach((section) => {
      const n = Number(section.dataset.step);
      section.classList.toggle("is-active", n === stepNumber);
    });

    progressItems.forEach((item) => {
      const n = Number(item.dataset.step);
      item.classList.toggle("is-active", n === stepNumber);
      item.classList.toggle("is-complete", n < stepNumber);
    });

    const pct = ((stepNumber - 1) / (state.totalSteps - 1)) * 100;
    progressFill.style.width = pct + "%";

    const inner = document.querySelector(".registration-inner");
    if (inner) {
      inner.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function nextStep() {
    if (!validateStep(state.step)) return;
    if (state.step === 4) syncReview();
    if (state.step < state.totalSteps) goToStep(state.step + 1);
  }

  function prevStep() {
    if (state.step > 1) goToStep(state.step - 1);
  }

  /* --------------------------------------------------------
     Validation helpers
     -------------------------------------------------------- */
  function setError(fieldId, message) {
    const errorEl = document.getElementById("error-" + fieldId);
    const fieldWrap = errorEl ? errorEl.closest(".field") : null;
    if (errorEl) errorEl.textContent = message || "";
    if (fieldWrap) fieldWrap.classList.toggle("has-error", Boolean(message));
    return !message;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidMobile(value) {
    return /^[6-9]\d{9}$/.test(value.trim());
  }

  function validateStep(stepNumber) {
    let valid = true;

    if (stepNumber === 1) {
      const selected = committeeInputs.find((i) => i.checked);
      const errorEl = document.getElementById("error-committee");
      if (!selected) {
        if (errorEl) errorEl.textContent = "Please select a committee to continue.";
        valid = false;
      } else {
        if (errorEl) errorEl.textContent = "";
        state.committee = selected.value;
      }
    }

    if (stepNumber === 2) {
      state.fullName = fullNameInput.value.trim();
      state.email = emailInput.value.trim();
      state.mobile = mobileInput.value.trim();
      state.college = collegeInput.value.trim();
      state.munExperience = munExperienceSelect.value;

      valid = setError("fullName", state.fullName.length < 2 ? "Please enter your full name." : "") && valid;
      valid = setError("email", !isValidEmail(state.email) ? "Please enter a valid email address." : "") && valid;
      valid = setError("mobile", !isValidMobile(state.mobile) ? "Please enter a valid 10-digit mobile number." : "") && valid;
      valid = setError("college", state.college.length < 2 ? "Please enter your college / institution." : "") && valid;
      valid = setError("munExperience", !state.munExperience ? "Please select your MUN experience." : "") && valid;
    }

    if (stepNumber === 3) {
      valid = setError("preference1", !state.preference1 ? "Please select your first preference." : "") && valid;
      valid = setError("preference2", !state.preference2 ? "Please select your second preference." : "") && valid;

      if (state.preference1 && state.preference2 && state.preference1 === state.preference2) {
        setError("preference2", "Preference 2 cannot match Preference 1.");
        valid = false;
      }
    }

    if (stepNumber === 4) {
      const selectedType = registrationTypeInputs.find((i) => i.checked);
      valid = setError("registrationType", !selectedType ? "Please select a registration type." : "") && valid;

      const count = parseInt(delegateCountInput.value, 10);
      if (!count || count < 1) {
        setError("numberOfDelegates", "Please enter at least 1 delegate.");
        valid = false;
      } else {
        setError("numberOfDelegates", "");
        state.numberOfDelegates = count;
      }

      state.paymentTransactionId = paymentTransactionIdInput.value.trim();
      valid = setError("paymentTransactionId", !state.paymentTransactionId ? "Please enter your UTR / Transaction ID." : "") && valid;

      if (!state.paymentScreenshot) {
        setError("paymentScreenshot", "Please upload your payment screenshot.");
        valid = false;
      } else {
        setError("paymentScreenshot", "");
      }
    }

    return valid;
  }

  /* --------------------------------------------------------
     Custom portfolio dropdown (flag + name)
     -------------------------------------------------------- */
  function buildPortfolioDropdown(name) {
    const field = document.getElementById(name + "Field");
    const trigger = document.getElementById(name + "Trigger");
    const triggerFlag = document.getElementById(name + "TriggerFlag");
    const triggerText = document.getElementById(name + "TriggerText");
    const listbox = document.getElementById(name + "Listbox");
    const hiddenInput = document.getElementById(name);

    function close() {
      listbox.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function open() {
      closeAllPortfolioDropdowns();
      renderOptions();
      listbox.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    function renderOptions() {
      const list = PORTFOLIOS[state.committee] || [];
      const otherName = name === "preference1" ? "preference2" : "preference1";
      const otherValue = state[otherName];

      listbox.innerHTML = "";
      list.forEach((entry) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.className = "portfolio-option";
        li.dataset.value = entry.name;

        const isSelected = state[name] === entry.name;
        const isDisabled = otherValue === entry.name;
        li.setAttribute("aria-selected", isSelected ? "true" : "false");
        if (isDisabled) li.setAttribute("aria-disabled", "true");

        if (entry.code) {
          const flagSpan = document.createElement("span");
          flagSpan.className = "portfolio-option-flag";
          const img = document.createElement("img");
          img.src = FLAG_BASE + entry.code + ".png";
          img.alt = "";
          img.loading = "lazy";
          flagSpan.appendChild(img);
          li.appendChild(flagSpan);
        }

        const textSpan = document.createElement("span");
        textSpan.textContent = entry.name;
        li.appendChild(textSpan);

        li.addEventListener("click", () => {
          if (isDisabled) return;
          selectValue(entry);
          close();
        });

        listbox.appendChild(li);
      });
    }

    function selectValue(entry) {
      state[name] = entry.name;
      hiddenInput.value = entry.name;
      triggerText.textContent = entry.name;
      trigger.classList.add("has-value");

      triggerFlag.innerHTML = "";
      if (entry.code) {
        const img = document.createElement("img");
        img.src = FLAG_BASE + entry.code + ".png";
        img.alt = "";
        triggerFlag.appendChild(img);
      }

      setError(name, "");
      refreshBothDropdowns();
      updatePreferenceConflict();
    }

    function reset() {
      state[name] = "";
      hiddenInput.value = "";
      triggerText.textContent = "Select a portfolio";
      trigger.classList.remove("has-value");
      triggerFlag.innerHTML = "";
    }

    trigger.addEventListener("click", () => {
      if (listbox.hidden) open(); else close();
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
        const first = listbox.querySelector('.portfolio-option:not([aria-disabled="true"])');
        if (first) first.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!field.contains(event.target)) close();
    });

    return { open: open, close: close, renderOptions: renderOptions, reset: reset };
  }

  const preference1Dropdown = buildPortfolioDropdown("preference1");
  const preference2Dropdown = buildPortfolioDropdown("preference2");

  function closeAllPortfolioDropdowns() {
    preference1Dropdown.close();
    preference2Dropdown.close();
  }

  function refreshBothDropdowns() {
    preference1Dropdown.renderOptions();
    preference2Dropdown.renderOptions();
  }

  // If a duplicate slips through (e.g. committee change race), clear preference2.
  function updatePreferenceConflict() {
    if (state.preference1 && state.preference2 && state.preference1 === state.preference2) {
      state.preference2 = "";
      document.getElementById("preference2").value = "";
      document.getElementById("preference2TriggerText").textContent = "Select a portfolio";
      document.getElementById("preference2Trigger").classList.remove("has-value");
      document.getElementById("preference2TriggerFlag").innerHTML = "";
      refreshBothDropdowns();
    }
  }

  function resetPortfolioSelections() {
    preference1Dropdown.reset();
    preference2Dropdown.reset();
    refreshBothDropdowns();
  }

  /* --------------------------------------------------------
     Committee selection → portfolios + EB card
     -------------------------------------------------------- */
  committeeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.committee = input.value;
      resetPortfolioSelections();
      ebSection.hidden = state.committee !== "UNHRC";
      setError("committee", "");
    });
  });

  /* --------------------------------------------------------
     Registration type + delegate count → pricing
     -------------------------------------------------------- */
  function getRate(type, count) {
    if (count <= 1) return type === "Inter-College" ? 800 : 500;
    if (count <= 5) return type === "Inter-College" ? 700 : 350;
    return type === "Inter-College" ? 600 : 300;
  }

  function updatePricing() {
    const selectedType = registrationTypeInputs.find((i) => i.checked);
    state.registrationType = selectedType ? selectedType.value : "";

    let count = parseInt(delegateCountInput.value, 10);
    if (!count || count < 1) count = 1;
    delegateCountInput.value = count;
    state.numberOfDelegates = count;

    stepperChips.forEach((chip) => {
      const chipCount = Number(chip.dataset.count);
      chip.classList.toggle("is-active", chipCount === 6 ? count >= 6 : count === chipCount);
    });

    if (!state.registrationType) {
      pricingType.textContent = "Select a registration type";
      pricingDelegates.textContent = "";
      pricingRate.textContent = "\u20B90 \u00D7 0";
      pricingTotal.textContent = formatRupees(0);
      paymentAmountValue.textContent = formatRupees(0);
      state.amountPayable = 0;
      return;
    }

    const rate = getRate(state.registrationType, count);
    const total = rate * count;
    state.amountPayable = total;

    pricingType.textContent = state.registrationType;
    pricingDelegates.textContent = count + (count === 1 ? " Delegate" : " Delegates");
    pricingRate.textContent = formatRupees(rate) + " \u00D7 " + count;
    pricingTotal.textContent = formatRupees(total);
    paymentAmountValue.textContent = formatRupees(total);
  }

  registrationTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updatePricing();
      setError("registrationType", "");
    });
  });

  delegateCountInput.addEventListener("input", () => {
    let value = parseInt(delegateCountInput.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    delegateCountInput.value = value;
    updatePricing();
    setError("numberOfDelegates", "");
  });

  delegateMinusBtn.addEventListener("click", () => {
    let value = parseInt(delegateCountInput.value, 10) || 1;
    value = Math.max(1, value - 1);
    delegateCountInput.value = value;
    updatePricing();
  });

  delegatePlusBtn.addEventListener("click", () => {
    let value = parseInt(delegateCountInput.value, 10) || 1;
    value = value + 1;
    delegateCountInput.value = value;
    updatePricing();
  });

  stepperChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      delegateCountInput.value = Number(chip.dataset.count);
      updatePricing();
    });
  });

  /* --------------------------------------------------------
     Payment screenshot upload
     -------------------------------------------------------- */
  fileUploadBtn.addEventListener("click", () => paymentScreenshotInput.click());

  paymentScreenshotInput.addEventListener("change", () => {
    const file = paymentScreenshotInput.files && paymentScreenshotInput.files[0];

    if (!file) {
      state.paymentScreenshot = null;
      fileUploadName.textContent = "No file selected";
      return;
    }

    if (!ALLOWED_SCREENSHOT_TYPES.includes(file.type)) {
      setError("paymentScreenshot", "Please upload a JPG, PNG or WEBP image.");
      paymentScreenshotInput.value = "";
      state.paymentScreenshot = null;
      fileUploadName.textContent = "No file selected";
      return;
    }

    if (file.size > MAX_SCREENSHOT_BYTES) {
      setError("paymentScreenshot", "File is too large. Maximum size is 5 MB.");
      paymentScreenshotInput.value = "";
      state.paymentScreenshot = null;
      fileUploadName.textContent = "No file selected";
      return;
    }

    state.paymentScreenshot = file;
    fileUploadName.textContent = file.name;
    setError("paymentScreenshot", "");
  });

  paymentTransactionIdInput.addEventListener("input", () => {
    state.paymentTransactionId = paymentTransactionIdInput.value.trim();
    setError("paymentTransactionId", "");
  });

  /* --------------------------------------------------------
     Restrict mobile number input to digits only
     -------------------------------------------------------- */
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
  });

  /* --------------------------------------------------------
     Review step
     -------------------------------------------------------- */
  function syncReview() {
    document.getElementById("reviewCommittee").textContent = state.committee || "\u2014";
    document.getElementById("reviewRegType").textContent = state.registrationType || "\u2014";
    document.getElementById("reviewDelegateCount").textContent = state.numberOfDelegates || "\u2014";
    document.getElementById("reviewName").textContent = state.fullName || "\u2014";
    document.getElementById("reviewEmail").textContent = state.email || "\u2014";
    document.getElementById("reviewMobile").textContent = state.mobile || "\u2014";
    document.getElementById("reviewCollege").textContent = state.college || "\u2014";
    document.getElementById("reviewExperience").textContent = state.munExperience || "\u2014";
    document.getElementById("reviewPref1").textContent = state.preference1 || "\u2014";
    document.getElementById("reviewPref2").textContent = state.preference2 || "\u2014";
    document.getElementById("reviewAmount").textContent = formatRupees(state.amountPayable);
    document.getElementById("reviewUtr").textContent = state.paymentTransactionId || "\u2014";
    document.getElementById("reviewScreenshot").textContent = state.paymentScreenshot ? state.paymentScreenshot.name : "\u2014";
  }

  /* --------------------------------------------------------
     Submission helpers
     -------------------------------------------------------- */

  // Simple unique registration ID, e.g. AIKTCMUN-LQ3F9K-482
  function generateRegistrationId() {
    const timePart = Date.now().toString(36).toUpperCase();
    const randPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    return "AIKTCMUN-" + timePart + "-" + randPart;
  }

  // Converts the uploaded payment screenshot File into a base64 data URL
  // so it can travel inside a plain JSON payload to Apps Script.
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read payment screenshot."));
      reader.readAsDataURL(file);
    });
  }

  // Finds (or lazily creates) a place to show a submission-level error
  // message without altering the existing markup/design.
  function getSubmitErrorEl() {
    let el = document.getElementById("submitError");
    if (!el) {
      el = document.createElement("p");
      el.id = "submitError";
      el.className = "field-error";
      el.setAttribute("role", "alert");
      el.style.marginTop = "12px";
      if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(el, submitBtn);
      } else {
        form.appendChild(el);
      }
    }
    return el;
  }

  function showSubmitError(message) {
    const el = getSubmitErrorEl();
    el.textContent = message;
  }

  function clearSubmitError() {
    const el = document.getElementById("submitError");
    if (el) el.textContent = "";
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.classList.toggle("is-loading", isSubmitting);
    submitBtn.textContent = isSubmitting
      ? "Submitting Registration..."
      : submitBtnDefaultText || "Submit Registration";
  }

  // Shows the registration ID on the existing success screen without
  // changing index.html — creates the element on first use only.
  function showRegistrationIdOnSuccess(registrationId) {
    if (!registrationId) return;
    let el = document.getElementById("successRegistrationId");
    if (!el) {
      el = document.createElement("p");
      el.id = "successRegistrationId";
      successScreen.insertBefore(el, successScreen.firstChild);
    }
    el.textContent = "Registration ID: " + registrationId;
  }

  /* --------------------------------------------------------
     Submission
     Collects the existing form/state data, maps it onto the
     Apps Script backend's expected field names, converts the
     payment screenshot to base64, and POSTs it as JSON.
     -------------------------------------------------------- */
  async function submitRegistration() {
    clearSubmitError();

    if (!state.registrationId) {
      state.registrationId = generateRegistrationId();
    }

    setSubmitting(true);

    try {
      const paymentScreenshotBase64 = await fileToBase64(state.paymentScreenshot);

      const payload = {
        registrationId: state.registrationId,
        committee: state.committee,
        registrationType: state.registrationType,
        numberOfDelegates: String(state.numberOfDelegates),
        fullName: state.fullName,
        email: state.email,
        mobile: state.mobile,
        college: state.college,
        munExperience: state.munExperience,
        preference1: state.preference1,
        preference2: state.preference2,
        amountPayable: String(state.amountPayable),
        utr: state.paymentTransactionId,
        paymentScreenshot: paymentScreenshotBase64
      };

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Server responded with status " + response.status);
      }

      const result = await response.json();

      if (result && result.success) {
        form.hidden = true;
        const progressNav = document.querySelector(".progress-nav");
        if (progressNav) progressNav.hidden = true;
        successScreen.hidden = false;
        showRegistrationIdOnSuccess(state.registrationId);
      } else {
        showSubmitError(
          (result && result.message) ||
            "We couldn't submit your registration. Please try again."
        );
      }
    } catch (err) {
      showSubmitError(
        "Something went wrong while submitting your registration. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* --------------------------------------------------------
     Event bindings — navigation
     -------------------------------------------------------- */
  document.querySelectorAll('[data-action="next"]').forEach((btn) => {
    btn.addEventListener("click", nextStep);
  });
  document.querySelectorAll('[data-action="back"]').forEach((btn) => {
    btn.addEventListener("click", prevStep);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitBtn && submitBtn.disabled) return; // already submitting

    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);
    const step4Valid = validateStep(4);
    const allValid = step1Valid && step2Valid && step3Valid && step4Valid;

    if (!allValid) {
      if (!step1Valid) { goToStep(1); return; }
      if (!step2Valid) { goToStep(2); return; }
      if (!step3Valid) { goToStep(3); return; }
      goToStep(4);
      return;
    }

    syncReview();
    await submitRegistration();
  });

  /* --------------------------------------------------------
     Init
     -------------------------------------------------------- */
  updatePricing();
  goToStep(1);
})();