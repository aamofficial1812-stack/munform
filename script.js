/* ============================================================
   AIKTCMUN 2026 — Registration Portal Logic
   Vanilla JS, structured for a future Google Apps Script backend.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     0. BACKEND CONFIGURATION
     ============================================================ */

  const API_URL =
    "https://script.google.com/macros/s/AKfycbxIaSk3EJDVh7QhgAWO5zmxQsRQMfTuDJJkTvr5Dd1N2vHqiba5PRfj8W6xmX3ZSjvV3w/exec";

  /* ============================================================
     1. PORTFOLIO DATA
     ============================================================ */

  // UNHRC — country name + ISO 3166-1 alpha-2 code (used for flag CDN)
  const UNHRC_COUNTRIES = [
    { name: "People\u2019s Democratic Republic of Algeria", code: "DZ" },
    { name: "Republic of Angola", code: "AO" },
    { name: "Commonwealth of Australia", code: "AU" },
    { name: "Plurinational State of Bolivia", code: "BO" },
    { name: "Republic of Botswana", code: "BW" },
    { name: "Federative Republic of Brazil", code: "BR" },
    { name: "Canada", code: "CA" },
    { name: "Republic of Chile", code: "CL" },
    { name: "People\u2019s Republic of China", code: "CN" },
    { name: "Republic of Costa Rica", code: "CR" },
    { name: "Republic of Cuba", code: "CU" },
    { name: "Democratic People\u2019s Republic of Korea", code: "KP" },
    { name: "Kingdom of Denmark", code: "DK" },
    { name: "Republic of Finland", code: "FI" },
    { name: "Federal Republic of Germany", code: "DE" },
    { name: "State of Israel", code: "IL" },
    { name: "Italian Republic", code: "IT" },
    { name: "Japan", code: "JP" },
    { name: "Lao People\u2019s Democratic Republic", code: "LA" },
    { name: "Republic of Mauritius", code: "MU" },
    { name: "United Mexican States", code: "MX" },
    { name: "Republic of Mozambique", code: "MZ" },
    { name: "Federal Democratic Republic of Nepal", code: "NP" },
    { name: "New Zealand", code: "NZ" },
    { name: "Republic of Nicaragua", code: "NI" },
    { name: "Kingdom of Norway", code: "NO" },
    { name: "State of Qatar", code: "QA" },
    { name: "Republic of Singapore", code: "SG" },
    { name: "Republic of South Africa", code: "ZA" },
    { name: "Republic of Korea", code: "KR" },
    { name: "Kingdom of Spain", code: "ES" },
    { name: "Democratic Socialist Republic of Sri Lanka", code: "LK" },
    { name: "Kingdom of Sweden", code: "SE" },
    { name: "Swiss Confederation", code: "CH" },
    { name: "United Republic of Tanzania", code: "TZ" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom of Great Britain and Northern Ireland", code: "GB" },
    { name: "United States of America", code: "US" },
    { name: "Oriental Republic of Uruguay", code: "UY" },
    { name: "Bolivarian Republic of Venezuela", code: "VE" },
    { name: "Socialist Republic of Vietnam", code: "VN" },
    { name: "Kingdom of Saudi Arabia", code: "SA" }
  ].map(function (c) { return { id: "unhrc-" + c.code, name: c.name, code: c.code }; });

  // AIPPM — political figure + party (CJP entries permanently excluded)
  const AIPPM_CANDIDATES = [
    { name: "Akhilesh Yadav", party: "Samajwadi Party" },
    { name: "Amit Shah", party: "Bharatiya Janata Party" },
    { name: "Anurag Singh Thakur", party: "Bharatiya Janata Party" },
    { name: "Arvind Kejriwal", party: "Aam Aadmi Party" },
    { name: "Asaduddin Owaisi", party: "All India Majlis-e-Ittehadul Muslimeen" },
    { name: "Ashwini Vaishnaw", party: "Bharatiya Janata Party" },
    { name: "Atishi Marlena", party: "Aam Aadmi Party" },
    { name: "Chandrashekhar Azad", party: "Azad Samaj Party\u2013Kanshi Ram" },
    { name: "Chirag Paswan", party: "Lok Janshakti Party\u2013Ram Vilas" },
    { name: "D. Raja", party: "Communist Party of India" },
    { name: "Derek O\u2019Brien", party: "All India Trinamool Congress" },
    { name: "Dharmendra Pradhan", party: "Bharatiya Janata Party" },
    { name: "Digvijaya Singh", party: "Indian National Congress" },
    { name: "Gaurav Gogoi", party: "Indian National Congress" },
    { name: "Hardeep Singh Puri", party: "Bharatiya Janata Party" },
    { name: "Hemant Soren", party: "Jharkhand Mukti Morcha" },
    { name: "Jairam Ramesh", party: "Indian National Congress" },
    { name: "Jyotiraditya M. Scindia", party: "Bharatiya Janata Party" },
    { name: "Kanimozhi Karunanidhi", party: "Dravida Munnetra Kazhagam" },
    { name: "Kapil Sibal", party: "Independent" },
    { name: "K. C. Venugopal", party: "Indian National Congress" },
    { name: "Mahua Moitra", party: "All India Trinamool Congress" },
    { name: "Mallikarjun Kharge", party: "Indian National Congress" },
    { name: "Manish Tewari", party: "Indian National Congress" },
    { name: "Manoj Kumar Jha", party: "Rashtriya Janata Dal" },
    { name: "Mamata Banerjee", party: "All India Trinamool Congress" },
    { name: "Mehbooba Mufti", party: "Jammu and Kashmir Peoples Democratic Party" },
    { name: "Narendra Modi", party: "Bharatiya Janata Party" },
    { name: "Nirmala Sitharaman", party: "Bharatiya Janata Party" },
    { name: "Pinarayi Vijayan", party: "Communist Party of India (Marxist)" },
    { name: "Priyanka Gandhi Vadra", party: "Indian National Congress" },
    { name: "Rahul Gandhi", party: "Indian National Congress" },
    { name: "Raghav Chadha", party: "Aam Aadmi Party" },
    { name: "Sachin Pilot", party: "Indian National Congress" },
    { name: "Sanjay Raut", party: "Shiv Sena (Uddhav Balasaheb Thackeray)" },
    { name: "Shashi Tharoor", party: "Indian National Congress" },
    { name: "Smriti Irani", party: "Bharatiya Janata Party" },
    { name: "Sudhanshu Trivedi", party: "Bharatiya Janata Party" },
    { name: "Supriya Sule", party: "Nationalist Congress Party\u2013Sharadchandra Pawar" }
  ].map(function (c, i) { return { id: "aippm-" + i, name: c.name, party: c.party }; });

  const PORTFOLIOS = { UNHRC: UNHRC_COUNTRIES, AIPPM: AIPPM_CANDIDATES };

  /* ============================================================
     2. STATE — mirrors the shape a Google Apps Script backend expects
     ============================================================ */

  const registrationData = {
    registrationType: "",       // "individual" | "group"
    registrationCategory: "",   // "interCollege" | "inHouse"
    groupSize: 1,
    representative: {
      name: "", email: "", mobile: "", whatsapp: "", college: "", city: ""
    },
    delegates: [],               // { id, name, email, mobile, college, city, gender, experience, previousMuns, committee, preference1, preference1Id, preference2, preference2Id }
    payment: {
      transactionId: "",
      screenshotName: null,
      screenshotFile: null
    },
    groupId: ""
  };

  function makeDelegate(id) {
    return {
      id: id, name: "", email: "", mobile: "", college: "", city: "",
      gender: "", experience: "", previousMuns: "",
      committee: "", preference1: "", preference1Id: "", preference2: "", preference2Id: ""
    };
  }

  // Executive Board — shown dynamically based on the committee a delegate selects.
  const EB_INFO = {
    UNHRC: { name: "Zaid Shaikh", role: "UNHRC \u2014 Executive Board", img: "zaid.jpeg" },
    AIPPM: { name: "Dev Mirajkar", role: "AIPPM \u2014 Executive Board", img: "Dev Mirajkar.jpeg" }
  };

  /* ============================================================
     3. NAVIGATION STATE
     ============================================================ */

  const TOTAL_STEPS = 7;
  let currentStep = 1;
  let highestStepReached = 1;

  const wizard = document.getElementById("wizard");
  const progressList = document.getElementById("progressList");

  function goToStep(step) {
    if (step < 1 || step > TOTAL_STEPS) return;
    document.querySelectorAll(".step-panel").forEach(function (panel) {
      panel.hidden = Number(panel.dataset.step) !== step;
    });
    currentStep = step;
    if (step > highestStepReached) highestStepReached = step;
    updateProgressIndicator();
    if (step === 3) renderDelegateForms();
    if (step === 4) renderPortfolioStep();
    if (step === 5) renderPaymentSummary();
    if (step === 6) renderReview();
    if (step === 7) renderConfirmation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateProgressIndicator() {
    progressList.querySelectorAll(".progress-step").forEach(function (li) {
      const s = Number(li.dataset.step);
      li.classList.toggle("is-active", s === currentStep);
      li.classList.toggle("is-complete", s < currentStep);
      li.setAttribute("aria-current", s === currentStep ? "step" : "false");
    });
  }

  /* ============================================================
     4. VALIDATION HELPERS
     ============================================================ */

  function setError(id, message) {
    const el = document.getElementById("err-" + id);
    if (el) el.textContent = message || "";
    const field = document.getElementById(id);
    if (field) field.classList.toggle("has-error", !!message);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidMobile(value) {
    return /^[6-9]\d{9}$/.test(value.trim().replace(/\D/g, "").slice(-10)) && value.trim().replace(/\D/g, "").length >= 10;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  }

  /* ============================================================
     5. STEP 1 — REGISTRATION TYPE
     ============================================================ */

  const groupSizeBlock = document.getElementById("groupSizeBlock");

  document.querySelectorAll('[data-group="registrationType"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectSingleChoice("registrationType", btn.dataset.value, '[data-group="registrationType"]');
      registrationData.registrationType = btn.dataset.value;
      setError("registrationType", "");
      if (btn.dataset.value === "individual") {
        groupSizeBlock.hidden = true;
        registrationData.groupSize = 1;
      } else {
        groupSizeBlock.hidden = false;
      }
    });
  });

  document.querySelectorAll('[data-group="groupSize"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const size = Math.min(6, Math.max(2, parseInt(btn.dataset.value, 10)));
      selectSingleChoice("groupSize", String(size), '[data-group="groupSize"]');
      registrationData.groupSize = size;
      setError("groupSize", "");
    });
  });

  document.querySelectorAll('[data-group="registrationCategory"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectSingleChoice("registrationCategory", btn.dataset.value, '[data-group="registrationCategory"]');
      registrationData.registrationCategory = btn.dataset.value;
      setError("registrationCategory", "");
    });
  });

  function selectSingleChoice(groupName, value, selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      const active = el.dataset.value === value;
      el.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  function validateStep1() {
    let ok = true;
    if (!registrationData.registrationType) {
      setError("registrationType", "Please select how you are registering.");
      ok = false;
    }
    if (registrationData.registrationType === "group") {
      if (!registrationData.groupSize || registrationData.groupSize < 2 || registrationData.groupSize > 6) {
        setError("groupSize", "Please select the number of delegates (2\u20136).");
        ok = false;
      }
    }
    if (!registrationData.registrationCategory) {
      setError("registrationCategory", "Please select a registration category.");
      ok = false;
    }
    return ok;
  }

  /* ============================================================
     6. STEP 2 — REPRESENTATIVE
     ============================================================ */

  const step2Title = document.getElementById("step2-title");
  const step2Sub = document.getElementById("step2-sub");

  function refreshStep2Copy() {
    if (registrationData.registrationType === "individual") {
      step2Title.textContent = step2Title.dataset.titleIndividual;
      step2Sub.textContent = "These details will be used as your delegate profile and primary contact.";
    } else {
      step2Title.textContent = step2Title.dataset.titleGroup;
      step2Sub.textContent = "The group representative will complete the registration and payment on behalf of all delegates in this group.";
    }
  }

  const repFieldIds = ["repName", "repEmail", "repMobile", "repWhatsapp", "repCollege", "repCity"];
  repFieldIds.forEach(function (id) {
    document.getElementById(id).addEventListener("input", function (e) {
      const key = id.replace("rep", "");
      const mapped = key.charAt(0).toLowerCase() + key.slice(1);
      registrationData.representative[mapped] = e.target.value;
      setError(id, "");
    });
  });

  function validateStep2() {
    let ok = true;
    const rep = registrationData.representative;
    if (!rep.name.trim()) { setError("repName", "Full name is required."); ok = false; }
    if (!rep.email.trim() || !isValidEmail(rep.email)) { setError("repEmail", "Enter a valid email address."); ok = false; }
    if (!rep.mobile.trim() || !isValidMobile(rep.mobile)) { setError("repMobile", "Enter a valid 10-digit mobile number."); ok = false; }
    if (!rep.whatsapp.trim() || !isValidMobile(rep.whatsapp)) { setError("repWhatsapp", "Enter a valid 10-digit WhatsApp number."); ok = false; }
    if (!rep.college.trim()) { setError("repCollege", "College / institution is required."); ok = false; }
    if (!rep.city.trim()) { setError("repCity", "City is required."); ok = false; }
    return ok;
  }

  /* ============================================================
     7. STEP 3 — DELEGATE DETAILS
     ============================================================ */

  const delegateList = document.getElementById("delegateList");

  function syncDelegateArray() {
    const size = registrationData.groupSize || 1;
    const current = registrationData.delegates;
    if (current.length < size) {
      for (let i = current.length; i < size; i++) current.push(makeDelegate(i + 1));
    } else if (current.length > size) {
      registrationData.delegates = current.slice(0, size);
    }
  }

  function renderDelegateForms() {
    syncDelegateArray();
    delegateList.innerHTML = "";
    registrationData.delegates.forEach(function (delegate, index) {
      const card = document.createElement("div");
      card.className = "delegate-card";
      card.innerHTML =
        '<div class="delegate-header"><span class="d-num">' + String(index + 1).padStart(2, "0") + '</span>' +
        '<span class="d-title">Delegate ' + String(index + 1).padStart(2, "0") + '</span></div>' +
        '<div class="delegate-body">' +
          '<div class="field-grid">' +
            field("name", "Full Name", "text", delegate) +
            field("email", "Email Address", "email", delegate) +
            field("mobile", "Mobile Number", "tel", delegate) +
            field("college", "College / Institution", "text", delegate) +
            field("city", "City", "text", delegate) +
            selectField("gender", "Gender", ["Male", "Female", "Non-binary", "Prefer not to say"], delegate) +
            selectField("experience", "MUN Experience", ["First-time delegate", "1\u20132 MUNs", "3\u20135 MUNs", "6+ MUNs"], delegate) +
            field("previousMuns", "Previous MUNs (optional)", "text", delegate, false) +
          "</div>" +
        "</div>";
      delegateList.appendChild(card);

      repeat: {
        const inputs = card.querySelectorAll("input, select");
        inputs.forEach(function (input) {
          input.addEventListener("input", function () {
            delegate[input.dataset.key] = input.value;
            setError(input.id, "");
          });
          input.addEventListener("change", function () {
            delegate[input.dataset.key] = input.value;
            setError(input.id, "");
          });
        });
      }
    });

    function field(key, label, type, delegate, required) {
      const id = "d" + delegate.id + "-" + key;
      const req = required === false ? "" : "required";
      return '<div class="field"><label for="' + id + '">' + label + '</label>' +
        '<input type="' + type + '" id="' + id + '" data-key="' + key + '" value="' + escapeHtml(delegate[key]) + '" ' + req + '>' +
        '<span class="field-error" id="err-' + id + '" role="alert"></span></div>';
    }

    function selectField(key, label, options, delegate) {
      const id = "d" + delegate.id + "-" + key;
      let opts = '<option value="">Select\u2026</option>';
      options.forEach(function (opt) {
        opts += '<option value="' + opt + '"' + (delegate[key] === opt ? " selected" : "") + ">" + opt + "</option>";
      });
      return '<div class="field"><label for="' + id + '">' + label + '</label>' +
        '<select id="' + id + '" data-key="' + key + '" required>' + opts + '</select>' +
        '<span class="field-error" id="err-' + id + '" role="alert"></span></div>';
    }
  }

  function validateStep3() {
    let ok = true;
    registrationData.delegates.forEach(function (delegate) {
      const required = ["name", "email", "mobile", "college", "city", "gender", "experience"];
      required.forEach(function (key) {
        const id = "d" + delegate.id + "-" + key;
        const value = (delegate[key] || "").trim();
        if (!value) {
          setError(id, "This field is required.");
          ok = false;
        } else if (key === "email" && !isValidEmail(value)) {
          setError(id, "Enter a valid email address.");
          ok = false;
        } else if (key === "mobile" && !isValidMobile(value)) {
          setError(id, "Enter a valid 10-digit mobile number.");
          ok = false;
        }
      });
    });
    return ok;
  }

  /* ============================================================
     8. STEP 4 — COMMITTEE & PORTFOLIO
     ============================================================ */

  const portfolioDelegatesEl = document.getElementById("portfolioDelegates");
  const groupOverview = document.getElementById("groupOverview");
  const overviewSize = document.getElementById("overviewSize");
  const overviewList = document.getElementById("overviewList");

  // NOTE: preferences are personal choices, not final allocations. The only
  // duplicate rule enforced anywhere in this step is within a single delegate
  // (their own Preference 1 cannot equal their own Preference 2). Different
  // delegates \u2014 in the same or different groups \u2014 may freely choose the
  // same portfolio as any of their preferences.

  function ebCardHtml(committee) {
    const info = EB_INFO[committee];
    if (!info) return "";
    return (
      '<div class="eb-card">' +
        '<div class="eb-photo"><img src="' + info.img + '" alt="' + escapeHtml(info.name) + '"></div>' +
        '<div class="eb-info">' +
          '<span class="eb-eyebrow">Executive Board</span>' +
          '<span class="eb-name">' + escapeHtml(info.name) + '</span>' +
          '<span class="eb-role">' + escapeHtml(info.role) + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  function preferenceBlockHtml(prefNum, committee) {
    const heading = prefNum === 1 ? "First Preference" : "Second Preference";
    const sub = prefNum === 1 ? "Your preferred portfolio" : "Your second-choice portfolio";
    return (
      '<div class="pref-block">' +
        '<p class="pref-label">' + heading + '</p>' +
        '<p class="pref-sublabel">' + sub + '</p>' +
        '<div class="portfolio-search">' +
          '<input type="text" placeholder="Search ' + (committee || "committee") + '\u2026" aria-label="Search portfolios for ' + heading + '" class="pf-search-input" data-pref="' + prefNum + '" ' + (committee ? "" : "disabled") + '>' +
        '</div>' +
        '<div class="portfolio-grid" data-pref="' + prefNum + '"></div>' +
      '</div>'
    );
  }

  function renderPortfolioStep() {
    portfolioDelegatesEl.innerHTML = "";

    const isGroup = registrationData.registrationType === "group" && registrationData.delegates.length > 1;
    groupOverview.hidden = !isGroup;

    registrationData.delegates.forEach(function (delegate) {
      const block = document.createElement("div");
      block.className = "portfolio-delegate-block";

      const label = registrationData.registrationType === "individual" ? "Your Selection" : "Delegate " + String(delegate.id).padStart(2, "0");

      block.innerHTML =
        '<div class="pd-header"><span class="d-num">' + String(delegate.id).padStart(2, "0") + '</span>' +
        '<span class="d-title">' + escapeHtml(delegate.name || label) + '</span></div>' +
        '<div class="pd-body">' +
          '<div class="committee-selector" role="radiogroup" aria-label="Committee for delegate ' + delegate.id + '">' +
            '<button type="button" class="committee-btn" data-committee="UNHRC" role="radio" aria-checked="' + (delegate.committee === "UNHRC") + '">UNHRC</button>' +
            '<button type="button" class="committee-btn" data-committee="AIPPM" role="radio" aria-checked="' + (delegate.committee === "AIPPM") + '">AIPPM</button>' +
          '</div>' +
          '<div class="eb-card-wrap" data-eb-wrap>' + ebCardHtml(delegate.committee) + '</div>' +
          '<p class="pref-note">Please select two different preferences. The same portfolio may be selected by multiple delegates as a preference.</p>' +
          preferenceBlockHtml(1, delegate.committee) +
          preferenceBlockHtml(2, delegate.committee) +
          '<div class="field-error" id="err-portfolio-' + delegate.id + '" role="alert"></div>' +
        '</div>';

      portfolioDelegatesEl.appendChild(block);

      const ebWrap = block.querySelector("[data-eb-wrap]");
      const grid1 = block.querySelector('.portfolio-grid[data-pref="1"]');
      const grid2 = block.querySelector('.portfolio-grid[data-pref="2"]');
      const search1 = block.querySelector('.pf-search-input[data-pref="1"]');
      const search2 = block.querySelector('.pf-search-input[data-pref="2"]');

      function refreshBoth() {
        renderPortfolioGrid(grid1, delegate, search1.value, 1);
        renderPortfolioGrid(grid2, delegate, search2.value, 2);
      }

      block.querySelectorAll(".committee-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const committee = btn.dataset.committee;
          delegate.committee = committee;
          delegate.preference1 = ""; delegate.preference1Id = "";
          delegate.preference2 = ""; delegate.preference2Id = "";
          block.querySelectorAll(".committee-btn").forEach(function (b) {
            b.setAttribute("aria-checked", b === btn ? "true" : "false");
          });
          [search1, search2].forEach(function (input) {
            input.disabled = false;
            input.placeholder = "Search " + committee + "\u2026";
            input.value = "";
          });
          ebWrap.innerHTML = ebCardHtml(committee);
          setError("portfolio-" + delegate.id, "");
          refreshBoth();
          renderGroupOverview();
        });
      });

      search1.addEventListener("input", function () { renderPortfolioGrid(grid1, delegate, search1.value, 1); });
      search2.addEventListener("input", function () { renderPortfolioGrid(grid2, delegate, search2.value, 2); });

      refreshBoth();
    });

    renderGroupOverview();
  }

  function renderPortfolioGrid(grid, delegate, query, prefNum) {
    grid.innerHTML = "";
    if (!delegate.committee) {
      grid.innerHTML = '<p class="portfolio-empty">Choose a committee above to view available portfolios.</p>';
      return;
    }
    const list = PORTFOLIOS[delegate.committee];
    const q = query.trim().toLowerCase();

    // The ONLY id to avoid is this same delegate's OTHER preference \u2014
    // never another delegate's selection.
    const otherPrefId = prefNum === 1 ? delegate.preference2Id : delegate.preference1Id;
    const ownId = prefNum === 1 ? delegate.preference1Id : delegate.preference2Id;

    const filtered = list.filter(function (item) {
      if (!q) return true;
      if (delegate.committee === "UNHRC") return item.name.toLowerCase().includes(q);
      return item.name.toLowerCase().includes(q) || item.party.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="portfolio-empty">No portfolios match your search.</p>';
      return;
    }

    filtered.forEach(function (item) {
      const isLocked = otherPrefId === item.id;
      const isSelected = ownId === item.id;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "portfolio-card" + (isSelected ? " is-selected" : "") + (isLocked ? " is-locked" : "");
      card.disabled = isLocked;
      card.setAttribute("aria-pressed", String(isSelected));

      const statusText = isLocked ? "Already your other preference" : "Available";

      if (delegate.committee === "UNHRC") {
        card.innerHTML =
          '<img class="portfolio-flag" src="https://flagcdn.com/w80/' + item.code.toLowerCase() + '.png" alt="' + escapeHtml(item.name) + ' flag" loading="lazy">' +
          '<span class="portfolio-name">' + escapeHtml(item.name) + '</span>' +
          '<span class="portfolio-status">' + statusText + '</span>' +
          '<span class="pf-check" aria-hidden="true">&#10003;</span>';
      } else {
        card.innerHTML =
          '<span class="portfolio-name">' + escapeHtml(item.name) + '</span>' +
          '<span class="portfolio-party">' + escapeHtml(item.party) + '</span>' +
          '<span class="portfolio-status">' + statusText + '</span>' +
          '<span class="pf-check" aria-hidden="true">&#10003;</span>';
      }

      card.addEventListener("click", function () {
        if (isLocked) return;
        if (prefNum === 1) { delegate.preference1 = item.name; delegate.preference1Id = item.id; }
        else { delegate.preference2 = item.name; delegate.preference2Id = item.id; }
        setError("portfolio-" + delegate.id, "");

        const wrap = grid.closest(".pd-body");
        const g1 = wrap.querySelector('.portfolio-grid[data-pref="1"]');
        const g2 = wrap.querySelector('.portfolio-grid[data-pref="2"]');
        const s1 = wrap.querySelector('.pf-search-input[data-pref="1"]');
        const s2 = wrap.querySelector('.pf-search-input[data-pref="2"]');
        renderPortfolioGrid(g1, delegate, s1.value, 1);
        renderPortfolioGrid(g2, delegate, s2.value, 2);
        renderGroupOverview();
      });

      grid.appendChild(card);
    });
  }

  function renderGroupOverview() {
    const isGroup = registrationData.registrationType === "group" && registrationData.delegates.length > 1;
    if (!isGroup) return;
    overviewSize.textContent = "Group Size: " + registrationData.delegates.length + " Delegates";
    overviewList.innerHTML = "";
    registrationData.delegates.forEach(function (delegate) {
      const li = document.createElement("li");
      let prefsHtml = "";
      if (delegate.preference1 || delegate.preference2) {
        prefsHtml = '<span class="ov-prefs">' +
          (delegate.preference1 ? '<span class="ov-pref-line"><b>1st:</b> ' + escapeHtml(delegate.preference1) + '</span>' : '') +
          (delegate.preference2 ? '<span class="ov-pref-line"><b>2nd:</b> ' + escapeHtml(delegate.preference2) + '</span>' : '') +
        '</span>';
      } else {
        prefsHtml = '<span class="ov-status ov-pending">Pending</span>';
      }
      li.innerHTML =
        '<span class="ov-num">D' + String(delegate.id).padStart(2, "0") + '</span>' +
        '<span class="ov-committee">' + (delegate.committee || "\u2014") + '</span>' +
        prefsHtml;
      overviewList.appendChild(li);
    });
  }

  function validateStep4() {
    let ok = true;
    registrationData.delegates.forEach(function (delegate) {
      if (!delegate.committee || !delegate.preference1Id || !delegate.preference2Id) {
        setError("portfolio-" + delegate.id, "Please select a committee and both portfolio preferences for this delegate.");
        ok = false;
      } else if (delegate.preference1Id === delegate.preference2Id) {
        setError("portfolio-" + delegate.id, "Please select two different portfolio preferences.");
        ok = false;
      }
    });
    return ok;
  }

  /* ============================================================
     9. STEP 5 — PAYMENT
     ============================================================ */

  const PRICING = {
    interCollege: { 1: 800, "2-5": 700, 6: 600 },
    inHouse: { 1: 500, "2-5": 350, 6: 300 }
  };

  function pricePerDelegate() {
    const category = registrationData.registrationCategory || "interCollege";
    const size = registrationData.groupSize || 1;
    const table = PRICING[category];
    if (size === 1) return table[1];
    if (size === 6) return table[6];
    return table["2-5"];
  }

  function totalAmount() {
    return pricePerDelegate() * (registrationData.groupSize || 1);
  }

  function formatINR(amount) {
    return "\u20B9" + amount.toLocaleString("en-IN");
  }

  function renderPaymentSummary() {
    document.getElementById("priceRegType").textContent =
      (registrationData.registrationCategory === "inHouse" ? "In-House" : "Inter-College") +
      " \u2014 " + (registrationData.registrationType === "individual" ? "Individual" : "Group");
    document.getElementById("priceDelegateCount").textContent = String(registrationData.groupSize || 1);
    document.getElementById("pricePerDelegate").textContent = formatINR(pricePerDelegate());
    document.getElementById("priceTotal").textContent = formatINR(totalAmount());
  }

  document.getElementById("txnId").addEventListener("input", function (e) {
    registrationData.payment.transactionId = e.target.value;
    setError("txnId", "");
  });

  document.getElementById("txnScreenshot").addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];
    registrationData.payment.screenshotFile = file || null;
    registrationData.payment.screenshotName = file ? file.name : null;
    document.getElementById("screenshotName").textContent = file ? file.name : "No file selected";
    setError("txnScreenshot", "");
  });

  function validateStep5() {
    let ok = true;
    if (!registrationData.payment.transactionId.trim()) {
      setError("txnId", "Transaction ID / UTR number is required.");
      ok = false;
    }
    if (!registrationData.payment.screenshotFile) {
      setError("txnScreenshot", "Please attach your payment screenshot.");
      ok = false;
    }
    return ok;
  }

  /* ============================================================
     10. STEP 6 — REVIEW
     ============================================================ */

  function renderReview() {
    const rep = registrationData.representative;

    document.getElementById("reviewRepresentative").innerHTML =
      sectionHead(registrationData.registrationType === "individual" ? "Delegate Details" : "Group Representative", 2) +
      '<div class="review-grid">' +
        reviewItem("Name", rep.name) +
        reviewItem("Email", rep.email) +
        reviewItem("Mobile", rep.mobile) +
        reviewItem("College", rep.college) +
        reviewItem("City", rep.city) +
      '</div>';

    document.getElementById("reviewRegistration").innerHTML =
      sectionHead("Registration", 1) +
      '<div class="review-grid">' +
        reviewItem("Registration Type", (registrationData.registrationType === "individual" ? "Individual" : "Group") + " \u2014 " + (registrationData.registrationCategory === "inHouse" ? "In-House" : "Inter-College")) +
        reviewItem("Number of Delegates", String(registrationData.groupSize)) +
        reviewItem("Total Amount", formatINR(totalAmount())) +
      '</div>';

    const delegatesHtml = registrationData.delegates.map(function (d) {
      return '<div class="review-delegate">' +
        '<p class="rd-name">Delegate ' + String(d.id).padStart(2, "0") + ' \u2014 ' + escapeHtml(d.name) + '</p>' +
        '<p class="rd-line">Committee: ' + escapeHtml(d.committee) + '</p>' +
        '<p class="rd-line">Preference 1: ' + escapeHtml(d.preference1) + '</p>' +
        '<p class="rd-line">Preference 2: ' + escapeHtml(d.preference2) + '</p>' +
        '</div>';
    }).join("");
    document.getElementById("reviewDelegates").innerHTML = sectionHead("Delegates", 3) + delegatesHtml;

    document.getElementById("reviewPayment").innerHTML =
      sectionHead("Payment", 5) +
      '<div class="review-grid">' +
        reviewItem("Transaction ID", registrationData.payment.transactionId) +
        reviewItem("Amount", formatINR(totalAmount())) +
        reviewItem("Screenshot", registrationData.payment.screenshotName || "\u2014") +
      '</div>';

    function sectionHead(title, targetStep) {
      return '<div class="review-section-head"><h2 class="review-section-title">' + title + '</h2>' +
        '<button type="button" class="btn-edit" data-edit-step="' + targetStep + '">Edit</button></div>';
    }
    function reviewItem(label, value) {
      return '<div class="review-item"><span class="r-label">' + label + '</span><span class="r-value">' + escapeHtml(value || "\u2014") + '</span></div>';
    }

    document.querySelectorAll("[data-edit-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        goToStep(Number(btn.dataset.editStep));
      });
    });
  }

  document.getElementById("confirmAccurate").addEventListener("change", function () {
    setError("confirmAccurate", "");
  });

  function validateStep6() {
    if (!document.getElementById("confirmAccurate").checked) {
      setError("confirmAccurate", "Please confirm your information is accurate before submitting.");
      return false;
    }
    return true;
  }

  /* ============================================================
     11. STEP 7 — CONFIRMATION
     ============================================================ */

  function renderConfirmation() {
    document.getElementById("groupIdValue").textContent = registrationData.groupId || "\u2014";

    // Remove any delegate-ID block from a previous render before re-adding it.
    const existingDelegateBlock = document.getElementById("delegateIdBlock");
    if (existingDelegateBlock) existingDelegateBlock.remove();

    const groupIdBlock = document.querySelector(".group-id-block");
    if (groupIdBlock && Array.isArray(registrationData.delegateIds) && registrationData.delegateIds.length) {
      const delegateIdBlock = document.createElement("div");
      delegateIdBlock.className = "group-id-block";
      delegateIdBlock.id = "delegateIdBlock";

      const label = document.createElement("span");
      label.className = "group-id-label";
      label.textContent = registrationData.delegateIds.length > 1 ? "Delegate IDs" : "Delegate ID";

      const value = document.createElement("span");
      value.className = "group-id-value";
      value.textContent = registrationData.delegateIds.join(", ");

      delegateIdBlock.appendChild(label);
      delegateIdBlock.appendChild(value);
      groupIdBlock.insertAdjacentElement("afterend", delegateIdBlock);
    }

    const title = document.getElementById("step7-title");
    if (title) {
      title.textContent = (registrationData.groupSize || 1) > 1
        ? "Your group of " + registrationData.groupSize + " delegates has been successfully registered."
        : "Your registration details have been recorded.";
    }
  }

  /* ============================================================
     12. BACKEND SUBMISSION
     ============================================================ */

  let isSubmitting = false;
  const submitBtn = document.querySelector('[data-action="submit"]');
  const submitBtnDefaultLabel = submitBtn ? submitBtn.textContent : "Submit Registration";

  // Add a dedicated error slot for submission-level failures, placed right
  // after the existing confirmation-checkbox error so it uses the same
  // established visual language without altering the HTML file itself.
  const confirmAccurateError = document.getElementById("err-confirmAccurate");
  let submitErrorEl = null;
  if (confirmAccurateError) {
    submitErrorEl = document.createElement("div");
    submitErrorEl.className = "field-error";
    submitErrorEl.id = "err-submit";
    submitErrorEl.setAttribute("role", "alert");
    confirmAccurateError.insertAdjacentElement("afterend", submitErrorEl);
  }

  function setSubmitError(message) {
    if (submitErrorEl) submitErrorEl.textContent = message || "";
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      if (!file) { resolve(""); return; }
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error("Could not read the payment screenshot.")); };
      reader.readAsDataURL(file);
    });
  }

  function buildSubmissionPayload(screenshotBase64) {
    const rep = registrationData.representative;
    const amountPerDelegate = pricePerDelegate();

    return {
      registrationType: registrationData.registrationType,
      representative: {
        name: rep.name,
        email: rep.email,
        mobile: rep.mobile,
        whatsapp: rep.whatsapp
      },
      college: rep.college,
      city: rep.city,
      delegates: registrationData.delegates.map(function (d) {
        return {
          name: d.name,
          email: d.email,
          mobile: d.mobile,
          college: d.college,
          city: d.city,
          gender: d.gender,
          munExperience: d.experience,
          committee: d.committee,
          preference1: d.preference1,
          preference2: d.preference2,
          amountPaid: amountPerDelegate,
          utrId: registrationData.payment.transactionId,
          paymentScreenshot: screenshotBase64 || ""
        };
      })
    };
  }

  async function submitRegistration() {
    if (isSubmitting) return;
    if (!validateStep6()) return;

    isSubmitting = true;
    setSubmitError("");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Registration\u2026";
    }

    try {
      const screenshotBase64 = await fileToBase64(registrationData.payment.screenshotFile);
      const payload = buildSubmissionPayload(screenshotBase64);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data && data.success) {
        registrationData.groupId = data.groupId || "";
        registrationData.delegateIds = Array.isArray(data.delegateIds) ? data.delegateIds : [];
        if (data.groupSize) registrationData.groupSize = data.groupSize;
        goToStep(7);
      } else {
        setSubmitError((data && data.message) || "Registration could not be submitted. Please check your information and try again.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtnDefaultLabel;
        }
      }
    } catch (err) {
      setSubmitError("Unable to connect to the registration server. Please check your internet connection and try again.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtnDefaultLabel;
      }
    } finally {
      isSubmitting = false;
    }
  }

  /* ============================================================
     13. NAVIGATION WIRING
     ============================================================ */

  const validators = { 1: validateStep1, 2: validateStep2, 3: validateStep3, 4: validateStep4, 5: validateStep5, 6: validateStep6 };

  document.querySelectorAll('[data-action="next"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      const validate = validators[currentStep];
      if (validate && !validate()) {
        const firstError = document.querySelector(".field-error:not(:empty)");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (currentStep === 1) refreshStep2Copy();
      goToStep(currentStep + 1);
    });
  });

  document.querySelectorAll('[data-action="back"]').forEach(function (btn) {
    btn.addEventListener("click", function () { goToStep(currentStep - 1); });
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      submitRegistration();
    });
  }

  /* ============================================================
     14. INIT
     ============================================================ */

  goToStep(1);

  // Expose for debugging / a future admin bridge.
  window.AIKTCMUN = {
    getRegistrationData: function () { return registrationData; }
  };
})();