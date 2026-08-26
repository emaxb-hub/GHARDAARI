(function () {
  "use strict";

  var defaultCategories = [
    {
      name: "Kitchen Help",
      icon: "KH",
      description: "Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage.",
      topics: ["Recipes", "Meal planning", "Groceries", "Cooking basics", "Kitchen organization", "Food storage"],
      posts: ["I freeze ginger garlic paste in small cubes for busy cooking days.", "Keep onions, tomatoes, and green chilies ready before starting curry."],
      qa: ["How do I keep dhania fresh? Wrap it in tissue and store it in an airtight box.", "How can I plan groceries? Make a weekly menu first, then write the list."],
      articles: ["Weekly Pakistani menu planning", "Food storage basics", "Kitchen cleaning checklist"],
      videos: ["Easy dinner ideas", "Meal prep for beginners"]
    },
    {
      name: "Sewing & Clothing",
      icon: "SC",
      description: "Stitching, darzi tips, fabrics, lace, clothing care, measurements, and sewing tutorials.",
      topics: ["Stitching", "Darzi tips", "Fabrics", "Lace", "Clothing care", "Measurements"],
      posts: ["Always write measurements before giving fabric to a darzi.", "Wash cotton fabric once before stitching to check shrinkage."],
      qa: ["Which measurements matter most? Shoulder, chest, waist, sleeve, shirt length, and trouser length.", "How do I avoid fitting issues? Share a reference photo and confirm style details."],
      articles: ["Darzi measurement guide", "Fabric types for daily wear", "Clothing care basics"],
      videos: ["Basic kurti cutting", "Beginner stitching lessons"]
    },
    {
      name: "Baby & Mother Care",
      icon: "BM",
      description: "Baby food, feeding, sleep routines, pregnancy awareness, common care, and postpartum guidance.",
      topics: ["Baby food", "Feeding", "Sleep routines", "Pregnancy awareness", "Common care", "Postpartum guidance"],
      posts: ["Writing feeding and diaper times helped me explain clearly to the doctor.", "New mothers also need rest, food, water, and emotional support."],
      qa: ["How can I start a sleep routine? Keep lights low and repeat calming steps every night.", "When should I ask a doctor? Ask whenever feeding, fever, breathing, or unusual symptoms worry you."],
      articles: ["Newborn routine basics", "Postpartum care reminders", "Baby food safety"],
      videos: ["Newborn care tips", "Mother care awareness"]
    },
    {
      name: "Women's Rights",
      icon: "WR",
      description: "Nikah rights, inheritance, workplace rights, domestic safety, legal awareness, and support resources.",
      topics: ["Nikah rights", "Inheritance", "Workplace rights", "Domestic safety", "Legal awareness", "Support resources"],
      posts: ["Read every clause before signing important documents.", "Keep copies of CNIC, Nikah Nama, and important papers safe."],
      qa: ["What should I read in Nikah Nama? Mehr, conditions, delegated rights, and personal details.", "What helps in a safety plan? Trusted contacts, documents, emergency money, and a safe place."],
      articles: ["Nikah Nama awareness", "Workplace rights basics", "Domestic safety planning"],
      videos: ["Nikah rights awareness", "Legal awareness Pakistan"]
    },
    {
      name: "Home Management",
      icon: "HM",
      description: "Cleaning, budgeting, organization, grocery planning, household routines, and family responsibilities.",
      topics: ["Cleaning", "Budgeting", "Organization", "Grocery planning", "Household routines", "Family responsibilities"],
      posts: ["Separate money into groceries, bills, savings, and emergency categories.", "A 15-minute daily cleaning habit keeps weekends lighter."],
      qa: ["How do I budget? Track fixed bills first, then groceries, savings, and flexible spending.", "How do I organize routines? Divide tasks into daily, weekly, and monthly lists."],
      articles: ["Monthly budget starter", "Cleaning routine plan", "Grocery planning guide"],
      videos: ["Home budget planning", "House routine ideas"]
    },
    {
      name: "Health & Wellness",
      icon: "HW",
      description: "Periods, hygiene, PCOS awareness, nutrition, self-care, mental health, and wellness.",
      topics: ["Periods", "Hygiene", "PCOS awareness", "Nutrition", "Self-care", "Mental health"],
      posts: ["Tracking periods helps you notice changes and explain symptoms to a doctor.", "Small walks, water, and sleep can support daily wellness."],
      qa: ["When should I ask about PCOS? Ask a doctor about irregular periods, acne, hair growth, or weight changes.", "What helps mental health? Rest, trusted conversation, movement, and professional help when needed."],
      articles: ["Period tracking basics", "PCOS awareness", "Self-care checklist"],
      videos: ["PCOS awareness in Urdu", "Menstrual hygiene basics"]
    }
  ];

  var categories = defaultCategories.slice();

  var resources = [
    { type: "YouTube", title: "Pakistani Meal Planning Ideas", source: "YouTube Search", category: "Kitchen Help", description: "Meal prep and recipe references for daily Pakistani cooking.", url: "https://www.youtube.com/results?search_query=pakistani+meal+planning+urdu" },
    { type: "Guide", title: "Food Storage Basics", source: "GharDaari Guide", category: "Kitchen Help", description: "Simple storage habits for groceries, cooked food, and dry items.", url: "https://www.google.com/search?q=food+storage+tips+pakistan" },
    { type: "YouTube", title: "Basic Kurti Cutting Tutorial", source: "YouTube Search", category: "Sewing & Clothing", description: "Beginner stitching and cutting lessons.", url: "https://www.youtube.com/results?search_query=basic+kurti+cutting+tutorial+urdu" },
    { type: "Article", title: "Fabric Types Explained", source: "Helpful Website", category: "Sewing & Clothing", description: "Learn which fabrics suit daily wear, summer, and formal outfits.", url: "https://www.google.com/search?q=pakistani+fabric+types+for+women" },
    { type: "YouTube", title: "Newborn Care Tips", source: "YouTube Search", category: "Baby & Mother Care", description: "General newborn care and mother care learning references.", url: "https://www.youtube.com/results?search_query=newborn+care+tips+urdu" },
    { type: "Guide", title: "Postpartum Care Checklist", source: "Health Guide", category: "Baby & Mother Care", description: "Rest, hydration, meals, support, and doctor follow-up reminders.", url: "https://www.google.com/search?q=postpartum+care+tips+urdu" },
    { type: "Article", title: "Nikah Nama Rights Awareness", source: "Legal Awareness", category: "Women's Rights", description: "Learn what to read and ask before signing marriage documents.", url: "https://www.google.com/search?q=nikah+nama+rights+pakistan" },
    { type: "YouTube", title: "Women Legal Rights Pakistan", source: "YouTube Search", category: "Women's Rights", description: "Video references for basic rights and support awareness.", url: "https://www.youtube.com/results?search_query=women+legal+rights+pakistan+urdu" },
    { type: "Guide", title: "Monthly Budget Checklist", source: "GharDaari Guide", category: "Home Management", description: "Plan groceries, bills, savings, and emergency money.", url: "https://www.google.com/search?q=monthly+home+budget+planning+urdu" },
    { type: "Article", title: "Home Cleaning Routine", source: "Helpful Website", category: "Home Management", description: "Daily, weekly, and monthly cleaning structure.", url: "https://www.google.com/search?q=home+cleaning+routine+checklist" },
    { type: "YouTube", title: "PCOS Awareness in Urdu", source: "YouTube Search", category: "Health & Wellness", description: "Introductory health awareness references.", url: "https://www.youtube.com/results?search_query=pcos+awareness+urdu" },
    { type: "Article", title: "Menstrual Hygiene Basics", source: "Health Guide", category: "Health & Wellness", description: "Period hygiene, tracking, and self-care learning.", url: "https://www.google.com/search?q=menstrual+hygiene+urdu" }
  ];

  var backendPosts = [];
  var backendResources = [];
  var backendUsers = [];
  var usingBackendResources = false;
  var backendChats = { active: "", groups: [], dms: [], messages: {} };
  var chatPollingTimer = null;
  var chatPollingBusy = false;
  var viewedProfile = null;
  var backendStatusShown = false;

  function page() {
    return document.body.dataset.page || "";
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function load(key, fallback) {
    var raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function sessionToken() {
    return localStorage.getItem("ghardaariToken") || "";
  }

  function isPublicPage() {
    return ["intro", "login", "signup", "forgot-password", "reset-password", "verify-email"].indexOf(page()) !== -1;
  }

  function isProtectedPage() {
    return !isPublicPage();
  }

  function clearSession() {
    localStorage.removeItem("ghardaariToken");
    localStorage.removeItem("ghardaariProfile");
    localStorage.removeItem("ghardaariUserId");
    localStorage.setItem("ghardaariLoggedIn", "false");
  }

  function saveSession(payload) {
    var user = payload && (payload.user || payload);
    if (!payload || !payload.token || !user || !user.id) {
      throw new Error("Login did not return a valid session.");
    }

    localStorage.setItem("ghardaariToken", payload.token);
    save("ghardaariProfile", user);
    localStorage.setItem("ghardaariUserId", String(user.id));
    localStorage.setItem("ghardaariLoggedIn", "true");
    return user;
  }

  function redirectToLogin() {
    if (page() !== "login") window.location.href = "login.html";
  }

  function enforceRouteProtection() {
    if ((page() === "login" || page() === "signup") && sessionToken()) {
      window.location.href = "home.html";
      return false;
    }

    if (isProtectedPage() && !sessionToken()) {
      clearSession();
      redirectToLogin();
      return false;
    }

    return true;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function getProfile() {
    return load("ghardaariProfile", {
      fullName: "GharDaari User",
      username: "ghardaari",
      email: "user@example.com",
      bio: "Learning and sharing in the GharDaari community."
    });
  }

  function currentUserId() {
    var profile = getProfile();
    var id = Number(profile.id || localStorage.getItem("ghardaariUserId") || 0);
    return Number.isInteger(id) && id > 0 ? id : 0;
  }

  function requestedProfileId() {
    var id = Number(new URLSearchParams(window.location.search).get("userId"));
    return Number.isInteger(id) && id > 0 ? id : 0;
  }

  function requestedChatId() {
    return new URLSearchParams(window.location.search).get("chat") || "";
  }

  function profileUrl(userId) {
    userId = Number(userId);
    if (!Number.isInteger(userId) || userId <= 0 || userId === currentUserId()) return "profile.html";
    return "profile.html?userId=" + encodeURIComponent(userId);
  }

  function profileNameLink(userId, label, className) {
    userId = Number(userId);
    var text = escapeHtml(label || "Community member");
    if (!Number.isInteger(userId) || userId <= 0) return '<span class="' + escapeHtml(className || "") + '">' + text + "</span>";
    return '<a class="' + escapeHtml(className || "profile-link") + '" href="' + escapeHtml(profileUrl(userId)) + '">' + text + "</a>";
  }

  function postAuthorMarkup(post) {
    var href = profileUrl(post.userId);
    return '<a class="post-author profile-author-link" href="' + escapeHtml(href) + '">' + avatarMarkup(post.username, post.profileImage, "avatar") + '<div><h3>' + escapeHtml(post.author) + '</h3><p>@' + escapeHtml(post.username) + " - " + escapeHtml(formatTime(post.date)) + "</p></div></a>";
  }

  function formatDateTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function avatarMarkup(name, imageUrl, className) {
    return '<span class="' + escapeHtml(className || "avatar") + '">' + (imageUrl ? '<img src="' + escapeHtml(imageUrl) + '" alt="Profile image">' : escapeHtml(initials(name))) + "</span>";
  }

  function normalizeComment(comment) {
    if (typeof comment === "string") {
      return {
        author: "Community member",
        username: "community",
        profileImage: "",
        text: comment,
        date: ""
      };
    }

    comment = comment || {};
    return {
      id: comment.id || "",
      author: comment.author || comment.fullName || "Community member",
      username: comment.username || "community",
      profileImage: comment.profileImage || "",
      userId: Number(comment.userId || 0),
      text: comment.text || comment.commentText || "",
      date: comment.date || comment.createdAt || ""
    };
  }

  function commentCount(post) {
    return Array.isArray(post.comments) ? post.comments.length : 0;
  }

  function rankedPosts(posts) {
    return posts.slice().sort(function (a, b) {
      var likeDiff = Number(b.likes || 0) - Number(a.likes || 0);
      if (likeDiff) return likeDiff;
      var commentDiff = commentCount(b) - commentCount(a);
      if (commentDiff) return commentDiff;
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
  }

  function isFeedPost(post) {
    return post.type !== "QUESTION" && post.type !== "EXPERIENCE";
  }

  function needDatabaseAccount() {
    window.alert("Please signup or login first so this action can be saved in the database.");
  }

  function initials(name) {
    return String(name || "GD").trim().slice(0, 2).toUpperCase();
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setMessage(element, text, success) {
    if (!element) return;
    element.textContent = text;
    element.classList.toggle("success", Boolean(success));
  }

  function setText(selector, text) {
    var element = document.querySelector(selector);
    if (element) element.textContent = text;
  }

  function setPageStatus(text, success) {
    var banner = document.getElementById("pageStatus");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "pageStatus";
      banner.className = "page-status";
      var header = document.querySelector(".site-header");
      if (header && header.parentNode) {
        header.parentNode.insertBefore(banner, header.nextSibling);
      } else {
        document.body.insertBefore(banner, document.body.firstChild);
      }
    }

    banner.textContent = text || "";
    banner.hidden = !text;
    banner.classList.toggle("success", Boolean(success));
  }

  function showBackendProblem(error) {
    if (backendStatusShown) return;
    backendStatusShown = true;
    setPageStatus((error && error.message) || "The backend is not available right now. Please check the server and database.", false);
  }

  function clearBackendProblem() {
    backendStatusShown = false;
    setPageStatus("", true);
  }

  function loadingState(selector, text) {
    var element = document.querySelector(selector);
    if (element) {
      element.innerHTML = '<p class="empty-state loading-state">' + escapeHtml(text || "Loading...") + "</p>";
    }
  }

  function setInitialLoadingStates() {
    loadingState("#feedList", "Loading posts...");
    loadingState("#resourceGrid", "Loading resources...");
    loadingState("#groupList", "Loading groups...");
    loadingState("#dmList", "Loading direct messages...");
    loadingState("#messageList", "Loading messages...");
    loadingState("#adminReportList", "Loading reports...");
    loadingState("#profilePosts", "Loading profile posts...");
    loadingState("#profileSaved", "Loading saved posts...");
    loadingState("#profileQuestions", "Loading questions...");
    loadingState("#profileExperiences", "Loading experiences...");
  }

  function friendlyApiError(response, data) {
    if (response.status === 500) {
      var detail = String((data && data.detail) || "").toLowerCase();
      if (detail.indexOf("database") !== -1 || detail.indexOf("prisma") !== -1 || detail.indexOf("connect") !== -1) {
        return "The backend is running, but the database is not responding. Please check PostgreSQL and DATABASE_URL.";
      }
      return "The backend had a server error. Please check the backend terminal logs.";
    }

    if (response.status === 429) {
      return (data && data.message) || "Too many requests. Please wait and try again.";
    }

    return (data && data.message) || "Request failed. Please try again.";
  }

  function apiBaseUrl() {
    var configured = window.GHARDAARI_CONFIG && window.GHARDAARI_CONFIG.apiBaseUrl;
    if (configured) {
      return String(configured).replace(/\/+$/, "");
    }

    var host = window.location.hostname;
    if (!host || host === "localhost" || host === "127.0.0.1") {
      return "http://127.0.0.1:5000/api";
    }
    return "http://" + host + ":5000/api";
  }

  async function apiJson(path, options) {
    var requestOptions = options || {};
    var token = sessionToken();
    requestOptions.headers = Object.assign({
      "Content-Type": "application/json"
    }, requestOptions.headers || {});

    if (token) {
      requestOptions.headers.Authorization = "Bearer " + token;
    }

    if (requestOptions.body && typeof requestOptions.body !== "string") {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }

    var response;
    try {
      response = await fetch(apiBaseUrl() + path, requestOptions);
    } catch (error) {
      throw new Error("Cannot reach the backend. Please make sure it is running at http://127.0.0.1:5000.");
    }
    var data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      if (response.status === 401 && isProtectedPage()) {
        clearSession();
        redirectToLogin();
      }
      throw new Error(friendlyApiError(response, data));
    }

    return data;
  }

  async function uploadImageDataUrl(dataUrl, kind) {
    if (!dataUrl || dataUrl.indexOf("data:image/") !== 0) return dataUrl || "";
    var result = await apiJson("/uploads/image", {
      method: "POST",
      body: {
        kind: kind || "posts",
        dataUrl: dataUrl
      }
    });
    return result.url || "";
  }

  async function loadUsersFromBackend() {
    if (page() !== "community" || !window.fetch) return;

    try {
      backendUsers = await apiJson("/users");
    } catch (error) {
      backendUsers = [];
      showBackendProblem(error);
    }
  }

  async function loadCurrentUser() {
    if (!isProtectedPage()) return;

    var user = await apiJson("/users/me");
    save("ghardaariProfile", user);
    localStorage.setItem("ghardaariUserId", String(user.id));
    localStorage.setItem("ghardaariLoggedIn", "true");
  }

  function pageUsesBackendCategories() {
    return ["home", "categories", "category", "helpful-posts", "resources", "profile"].indexOf(page()) !== -1;
  }

  function mergeBackendCategory(row) {
    var fallback = defaultCategories.find(function (item) {
      return item.name === row.name;
    }) || {};

    return {
      id: row.id,
      name: row.name || fallback.name,
      icon: row.icon || fallback.icon || "GD",
      description: row.description || fallback.description || "",
      topics: fallback.topics || [],
      posts: fallback.posts || [],
      qa: fallback.qa || [],
      articles: fallback.articles || [],
      videos: fallback.videos || []
    };
  }

  async function loadCategoriesFromBackend() {
    if (!pageUsesBackendCategories() || !window.fetch) return;

    try {
      var response = await fetch(apiBaseUrl() + "/categories");
      if (!response.ok) throw new Error("Could not load categories");
      var data = await response.json();
      if (!Array.isArray(data) || !data.length) return;
      categories = data.map(mergeBackendCategory);
      save("ghardaariBackendCategories", categories);
      clearBackendProblem();
    } catch (error) {
      categories = load("ghardaariBackendCategories", defaultCategories);
      showBackendProblem(new Error("Categories are using saved/local data because the backend or database is not available."));
    }
  }

  async function loadPostsFromBackend() {
    if (["home", "profile", "category", "helpful-posts"].indexOf(page()) === -1 || !window.fetch) return;

    try {
      backendPosts = await apiJson("/posts");
      clearBackendProblem();
    } catch (error) {
      backendPosts = [];
      showBackendProblem(error);
    }
  }

  async function loadResourcesFromBackend() {
    if (["resources", "category"].indexOf(page()) === -1 || !window.fetch) return;

    try {
      backendResources = await apiJson("/resources");
      if (Array.isArray(backendResources) && backendResources.length) {
        resources = backendResources;
        usingBackendResources = true;
      }
      clearBackendProblem();
    } catch (error) {
      usingBackendResources = false;
      showBackendProblem(error);
    }
  }

  async function loadGroupsFromBackend(activeId) {
    if (page() !== "community" || !window.fetch) return;

    try {
      var groups = await apiJson("/groups");
      var dms = await apiJson("/direct-conversations");
      var previous = backendChats || { active: "" };
      var nextMessages = {};

      groups.forEach(function (group) {
        nextMessages[group.id] = group.messages || [];
      });
      dms.forEach(function (dm) {
        nextMessages[dm.id] = dm.messages || [];
      });

      backendChats = {
        active: activeId || requestedChatId() || previous.active || (groups[0] ? groups[0].id : (dms[0] ? dms[0].id : "")),
        groups: groups,
        dms: dms,
        messages: nextMessages
      };
      clearBackendProblem();
    } catch (error) {
      backendChats = { active: "", groups: [], dms: [], messages: {} };
      showBackendProblem(error);
    }
  }

  function initIntro() {
    if (page() === "intro") {
      setTimeout(function () {
        window.location.href = sessionToken() ? "home.html" : "login.html";
      }, 1600);
    }
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav-links");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    if (nav && sessionToken() && getProfile().role === "ADMIN" && !nav.querySelector('[href="dashboard.html"]')) {
      var logoutButton = nav.querySelector("[data-logout]");
      var adminLink = document.createElement("a");
      adminLink.href = "dashboard.html";
      adminLink.textContent = "Admin";
      if (page() === "dashboard") adminLink.className = "active";
      nav.insertBefore(adminLink, logoutButton || null);
    }
    document.querySelectorAll("[data-logout]").forEach(function (button) {
      button.addEventListener("click", function () {
        clearSession();
        window.location.href = "login.html";
      });
    });
    document.addEventListener("click", function () {
      document.querySelectorAll(".post-menu-panel").forEach(function (item) {
        item.hidden = true;
      });
      document.querySelectorAll("[data-post-menu-toggle]").forEach(function (item) {
        item.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initAuth() {
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var email = document.getElementById("loginEmail").value.trim();
        var password = document.getElementById("loginPassword").value.trim();
        var target = document.getElementById("loginMessage");
        if (!email || !password) return setMessage(target, "Please enter email and password.", false);
        if (!validEmail(email)) return setMessage(target, "Please enter a valid email.", false);

        try {
          setMessage(target, "Checking your account...", true);
          var loginSession = await apiJson("/users/login", {
            method: "POST",
            body: { email: email, password: password }
          });
          saveSession(loginSession);
          setMessage(target, "Login successful. Opening home...", true);
          setTimeout(function () { window.location.href = "home.html"; }, 500);
        } catch (error) {
          setMessage(target, error.message, false);
        }
      });
    }

    var signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var fullName = document.getElementById("fullName").value.trim();
        var username = document.getElementById("username").value.trim();
        var email = document.getElementById("signupEmail").value.trim();
        var password = document.getElementById("signupPassword").value;
        var confirm = document.getElementById("confirmPassword").value;
        var target = document.getElementById("signupMessage");
        if (!fullName || !username || !email || !password || !confirm) return setMessage(target, "Please complete all fields.", false);
        if (!validEmail(email)) return setMessage(target, "Please enter a valid email.", false);
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setMessage(target, "Password must be at least 8 characters and include a letter and a number.", false);
        if (password !== confirm) return setMessage(target, "Passwords do not match.", false);

        try {
          setMessage(target, "Creating your account...", true);
          var signupSession = await apiJson("/users/signup", {
            method: "POST",
            body: {
              fullName: fullName,
              username: username,
              email: email,
              password: password
            }
          });
          saveSession(signupSession);
          if (signupSession.verificationToken) {
            localStorage.setItem("ghardaariLastVerificationToken", signupSession.verificationToken);
          }
          setMessage(target, "Signup successful. Opening home...", true);
          setTimeout(function () { window.location.href = "home.html"; }, 500);
        } catch (error) {
          setMessage(target, error.message, false);
        }
      });
    }

    var forgotForm = document.getElementById("forgotPasswordForm");
    if (forgotForm) {
      forgotForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var email = document.getElementById("forgotEmail").value.trim();
        var target = document.getElementById("forgotMessage");
        if (!email || !validEmail(email)) return setMessage(target, "Please enter a valid email.", false);

        try {
          var result = await apiJson("/users/forgot-password", {
            method: "POST",
            body: { email: email }
          });
          if (result.resetToken) {
            localStorage.setItem("ghardaariLastResetToken", result.resetToken);
            setMessage(target, "Reset token created. It has been filled on the reset page for local testing.", true);
            setTimeout(function () { window.location.href = "reset-password.html"; }, 700);
          } else {
            setMessage(target, result.message, true);
          }
        } catch (error) {
          setMessage(target, error.message, false);
        }
      });
    }

    var resetForm = document.getElementById("resetPasswordForm");
    if (resetForm) {
      var resetToken = document.getElementById("resetToken");
      if (resetToken && !resetToken.value) {
        resetToken.value = new URLSearchParams(window.location.search).get("token") || localStorage.getItem("ghardaariLastResetToken") || "";
      }
      resetForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var token = document.getElementById("resetToken").value.trim();
        var password = document.getElementById("resetPassword").value;
        var confirm = document.getElementById("resetConfirmPassword").value;
        var target = document.getElementById("resetMessage");
        if (!token) return setMessage(target, "Reset token is required.", false);
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setMessage(target, "Password must be at least 8 characters and include a letter and a number.", false);
        if (password !== confirm) return setMessage(target, "Passwords do not match.", false);

        try {
          var result = await apiJson("/users/reset-password", {
            method: "POST",
            body: { token: token, password: password }
          });
          localStorage.removeItem("ghardaariLastResetToken");
          setMessage(target, result.message, true);
          setTimeout(function () { window.location.href = "login.html"; }, 900);
        } catch (error) {
          setMessage(target, error.message, false);
        }
      });
    }

    var verifyForm = document.getElementById("verifyEmailForm");
    if (verifyForm) {
      var verifyToken = document.getElementById("verifyToken");
      if (verifyToken && !verifyToken.value) {
        verifyToken.value = new URLSearchParams(window.location.search).get("token") || localStorage.getItem("ghardaariLastVerificationToken") || "";
      }
      verifyForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var token = document.getElementById("verifyToken").value.trim();
        var target = document.getElementById("verifyMessage");
        if (!token) return setMessage(target, "Verification token is required.", false);

        try {
          var result = await apiJson("/users/verify-email", {
            method: "POST",
            body: { token: token }
          });
          localStorage.removeItem("ghardaariLastVerificationToken");
          setMessage(target, result.message, true);
          setTimeout(function () { window.location.href = sessionToken() ? "profile.html" : "login.html"; }, 900);
        } catch (error) {
          setMessage(target, error.message, false);
        }
      });
    }
  }

  function getPosts() {
    return backendPosts.map(function (post) {
      return {
        id: post.id || "post-" + Date.now(),
        author: post.author || post.username || "GharDaari User",
        username: post.username || String(post.author || "ghardaari").toLowerCase().replace(/\s+/g, ""),
        profileImage: post.profileImage || "",
        userId: Number(post.userId || 0),
        category: post.category || categories[0].name,
        text: post.text || post.description || "",
        image: post.image || "",
        date: post.date || new Date().toISOString(),
        type: post.type || (String(post.text || "").indexOf("?") !== -1 ? "QUESTION" : "THOUGHT"),
        likes: Number(post.likes || 0),
        saved: Boolean(post.saved),
        canEdit: Boolean(post.canEdit),
        comments: Array.isArray(post.comments) ? post.comments.map(normalizeComment) : []
      };
    });
  }

  function setPosts(posts) {
    backendPosts = posts;
  }

  function categoryOptions(select, allLabel) {
    if (!select) return;
    select.innerHTML = allLabel ? '<option value="All">' + allLabel + "</option>" : "";
    categories.forEach(function (category) {
      var option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }

  function initHome() {
    if (page() !== "home") return;
    var profile = getProfile();
    setText("[data-user-avatar]", initials(profile.fullName));
    renderHomeProfile();
    categoryOptions(document.getElementById("postCategory"));
    renderPosts();
    updateSavedSummary();
    var composerToggle = document.getElementById("openPostComposer");
    var postForm = document.getElementById("postForm");
    if (composerToggle && postForm) {
      composerToggle.addEventListener("click", function () {
        postForm.hidden = false;
        composerToggle.hidden = true;
        document.getElementById("postText").focus();
      });
    }

    var imageInput = document.getElementById("postImage");
    var preview = document.getElementById("imagePreview");
    var previewWrap = document.getElementById("imagePreviewWrap");
    var removeImage = document.getElementById("removeImage");
    var selectedImage = "";

    if (imageInput) {
      imageInput.addEventListener("change", function () {
        var file = imageInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          selectedImage = String(reader.result || "");
          preview.src = selectedImage;
          previewWrap.hidden = false;
        };
        reader.readAsDataURL(file);
      });
    }

    if (removeImage) {
      removeImage.addEventListener("click", function () {
        selectedImage = "";
        imageInput.value = "";
        previewWrap.hidden = true;
      });
    }

    var postForm = document.getElementById("postForm");
    if (postForm) {
      postForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var text = document.getElementById("postText").value.trim();
        var category = document.getElementById("postCategory").value;
        var target = document.getElementById("postMessage");
        if (!text && !selectedImage) return setMessage(target, "Write something or upload an image first.", false);

        try {
          var imageUrl = await uploadImageDataUrl(selectedImage, "posts");
          await apiJson("/posts", {
            method: "POST",
            body: {
              categoryName: category || categories[0].name,
              text: text,
              imageUrl: imageUrl,
              type: "THOUGHT"
            }
          });
          await loadPostsFromBackend();
          postForm.reset();
          selectedImage = "";
          previewWrap.hidden = true;
          postForm.hidden = true;
          if (composerToggle) composerToggle.hidden = false;
          categoryOptions(document.getElementById("postCategory"));
          setMessage(target, "Post saved to database.", true);
          renderPosts();
          updateSavedSummary();
        } catch (error) {
          setMessage(target, error.message, false);
        }
      });
    }

    var search = document.getElementById("postSearch");
    if (search) search.addEventListener("input", renderPosts);
  }

  function renderHomeProfile() {
    var box = document.querySelector("[data-home-profile]");
    if (!box) return;
    var profile = getProfile();
    box.innerHTML = avatarMarkup(profile.fullName, profile.profileImage, "avatar") + '<div><h3>' + escapeHtml(profile.fullName) + '</h3><p>@' + escapeHtml(profile.username) + "</p></div>";
  }

  function renderPosts() {
    var list = document.getElementById("feedList");
    if (!list) return;
    var query = (document.getElementById("postSearch") || {}).value || "";
    query = query.toLowerCase();
    var posts = getPosts().filter(function (post) {
      return !query || post.text.toLowerCase().indexOf(query) !== -1 || post.author.toLowerCase().indexOf(query) !== -1 || post.category.toLowerCase().indexOf(query) !== -1;
    });
    if (page() === "home") {
      posts = posts.filter(isFeedPost);
    }
    if (page() === "helpful-posts") {
      var category = selectedCategory();
      posts = rankedPosts(posts.filter(function (post) {
        return post.category === category.name && isFeedPost(post);
      }));
      setText("[data-helpful-title]", category.name + " Helpful Posts");
    }
    list.innerHTML = "";
    posts.forEach(function (post) {
      var ownPost = post.canEdit || post.userId === currentUserId();
      var menuActions = '<button type="button" data-save="' + post.id + '">' + (post.saved ? "Unsave" : "Save") + "</button>";
      menuActions += ownPost
        ? '<button type="button" data-edit-post="' + post.id + '">Edit</button><button type="button" data-delete-post="' + post.id + '">Delete</button>'
        : '<button type="button" data-report-post="' + post.id + '">Report</button><button type="button" data-block-user="' + post.userId + '">Block</button>';
      var card = document.createElement("article");
      card.className = "card post-card";
      card.innerHTML =
        '<div class="post-card-top"><div class="post-meta">' + postAuthorMarkup(post) + '<span class="pill">' + escapeHtml(post.category) + '</span></div><div class="post-menu"><button class="post-menu-toggle" type="button" aria-label="Post options" aria-expanded="false" data-post-menu-toggle>&#8942;</button><div class="post-menu-panel" hidden>' + menuActions + "</div></div></div>" +
        '<p class="post-text">' + escapeHtml(post.text) + "</p>" +
        (post.image ? '<img class="post-image" src="' + post.image + '" alt="Post upload">' : "") +
        '<div class="post-actions"><button class="btn btn-outline" type="button" data-like="' + post.id + '">Like</button><button class="btn btn-outline" type="button" data-comment="' + post.id + '">Comment</button></div>';
      list.appendChild(card);
    });
    if (!posts.length) list.innerHTML = '<p class="empty-state">No posts found.</p>';

    list.querySelectorAll("[data-post-menu-toggle]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        var panel = button.nextElementSibling;
        var willOpen = panel.hidden;
        document.querySelectorAll(".post-menu-panel").forEach(function (item) {
          item.hidden = true;
        });
        document.querySelectorAll("[data-post-menu-toggle]").forEach(function (item) {
          item.setAttribute("aria-expanded", "false");
        });
        panel.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
      });
    });
    list.querySelectorAll("[data-like]").forEach(function (button) {
      button.addEventListener("click", async function () {
        var menuPanel = button.closest(".post-menu-panel");
        if (menuPanel) menuPanel.hidden = true;
        try {
          await apiJson("/posts/" + button.dataset.like + "/like", { method: "POST", body: {} });
          await loadPostsFromBackend();
          renderPosts();
          updateSavedSummary();
          renderProfileLists();
        } catch (error) {
          showBackendProblem(error);
        }
      });
    });
    list.querySelectorAll("[data-save]").forEach(function (button) {
      button.addEventListener("click", async function () {
        try {
          await apiJson("/posts/" + button.dataset.save + "/save", { method: "POST", body: {} });
          await loadPostsFromBackend();
          renderPosts();
          updateSavedSummary();
          renderProfileLists();
        } catch (error) {
          showBackendProblem(error);
        }
      });
    });
    list.querySelectorAll("[data-comment]").forEach(function (button) {
      button.addEventListener("click", function () {
        openComments(button.dataset.comment);
      });
    });
    list.querySelectorAll("[data-edit-post]").forEach(function (button) {
      button.addEventListener("click", function () { editPost(button.dataset.editPost); });
    });
    list.querySelectorAll("[data-delete-post]").forEach(function (button) {
      button.addEventListener("click", function () { deletePost(button.dataset.deletePost); });
    });
    list.querySelectorAll("[data-report-post]").forEach(function (button) {
      button.addEventListener("click", function () { openReport("POST", button.dataset.reportPost); });
    });
    list.querySelectorAll("[data-block-user]").forEach(function (button) {
      button.addEventListener("click", function () { blockUser(button.dataset.blockUser); });
    });
  }

  async function editPost(id) {
    var post = getPosts().find(function (item) { return item.id === id; });
    if (!post) return;
    var nextText = window.prompt("Edit post", post.text);
    if (nextText === null) return;
    nextText = nextText.trim();
    if (!nextText && !post.image) return window.alert("Post text or image is required.");

    await apiJson("/posts/" + id, {
      method: "PUT",
      body: {
        categoryName: post.category,
        text: nextText,
        imageUrl: post.image,
        type: post.type || "THOUGHT"
      }
    });
    await loadPostsFromBackend();
    renderPosts();
    renderProfileLists();
  }

  async function deletePost(id) {
    if (!window.confirm("Delete this post?")) return;
    await apiJson("/posts/" + id, { method: "DELETE" });
    await loadPostsFromBackend();
    renderPosts();
    renderProfileLists();
  }

  function changePost(id, updater) {
    var posts = getPosts();
    posts.forEach(function (post) {
      if (post.id === id) updater(post);
    });
    setPosts(posts);
    renderPosts();
    updateSavedSummary();
    renderProfileLists();
  }

  var activeCommentPost = "";

  function openComments(id) {
    activeCommentPost = id;
    renderComments();
    openModal("commentModal");
  }

  function renderComments() {
    var list = document.getElementById("commentList");
    if (!list) return;
    var post = getPosts().find(function (item) { return item.id === activeCommentPost; });
    list.innerHTML = "";
    (post ? post.comments : []).forEach(function (comment) {
      comment = normalizeComment(comment);
      var ownComment = comment.userId === currentUserId();
      var actions = ownComment
        ? '<div class="inline-actions"><button class="btn btn-outline" type="button" data-edit-comment="' + comment.id + '">Edit</button><button class="btn btn-outline" type="button" data-delete-comment="' + comment.id + '">Delete</button></div>'
        : '<div class="inline-actions"><button class="btn btn-outline" type="button" data-report-comment="' + comment.id + '">Report</button><button class="btn btn-outline" type="button" data-block-comment-user="' + comment.userId + '">Block</button></div>';
      list.insertAdjacentHTML("beforeend", '<div class="content-item comment-item"><div class="comment-head"><a class="avatar-link" href="' + escapeHtml(profileUrl(comment.userId)) + '">' + avatarMarkup(comment.username, comment.profileImage, "comment-avatar") + '</a><div><div class="comment-meta">' + profileNameLink(comment.userId, comment.username, "profile-link") + '<span>' + escapeHtml(formatTime(comment.date)) + '</span></div><p>' + escapeHtml(comment.text) + "</p></div></div>" + actions + "</div>");
    });
    if (!list.children.length) list.innerHTML = '<p class="empty-state">No comments yet.</p>';

    list.querySelectorAll("[data-edit-comment]").forEach(function (button) {
      button.addEventListener("click", function () { editComment(button.dataset.editComment); });
    });
    list.querySelectorAll("[data-delete-comment]").forEach(function (button) {
      button.addEventListener("click", function () { deleteComment(button.dataset.deleteComment); });
    });
    list.querySelectorAll("[data-report-comment]").forEach(function (button) {
      button.addEventListener("click", function () { openReport("COMMENT", button.dataset.reportComment); });
    });
    list.querySelectorAll("[data-block-comment-user]").forEach(function (button) {
      button.addEventListener("click", function () { blockUser(button.dataset.blockCommentUser); });
    });
  }

  async function editComment(commentId) {
    var post = getPosts().find(function (item) { return item.id === activeCommentPost; });
    var comment = post ? post.comments.map(normalizeComment).find(function (item) { return String(item.id) === String(commentId); }) : null;
    if (!comment) return;
    var nextText = window.prompt("Edit comment", comment.text);
    if (nextText === null) return;
    nextText = nextText.trim();
    if (!nextText) return;

    await apiJson("/posts/" + activeCommentPost + "/comments/" + commentId, {
      method: "PUT",
      body: { commentText: nextText }
    });
    await loadPostsFromBackend();
    renderPosts();
    renderComments();
    renderProfileLists();
  }

  async function deleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    await apiJson("/posts/" + activeCommentPost + "/comments/" + commentId, { method: "DELETE" });
    await loadPostsFromBackend();
    renderPosts();
    renderComments();
    renderProfileLists();
  }

  function initComments() {
    var form = document.getElementById("commentForm");
    if (!form) return;
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var input = document.getElementById("commentText");
      var text = input.value.trim();
      if (!text) return;

      await apiJson("/posts/" + activeCommentPost + "/comments", {
        method: "POST",
        body: { commentText: text }
      });
      await loadPostsFromBackend();
      input.value = "";
      renderPosts();
      renderComments();
      updateSavedSummary();
    });
  }

  function updateSavedSummary() {
    var box = document.getElementById("savedSummary");
    if (!box) return;
    var saved = getPosts().filter(function (post) { return post.saved; });
    box.innerHTML = saved.length ? saved.map(function (post) { return '<div class="content-item"><h3>' + escapeHtml(post.category) + "</h3><p>" + escapeHtml(post.text.slice(0, 90)) + "</p></div>"; }).join("") : '<p class="empty-state">Saved posts appear here.</p>';
  }

  function initCategories() {
    var grid = document.querySelector("[data-category-cards]");
    if (!grid) return;
    grid.innerHTML = "";
    categories.forEach(function (category) {
      var card = document.createElement("article");
      card.className = "card category-card";
      card.innerHTML = '<span class="category-icon">' + escapeHtml(category.icon) + '</span><h2>' + escapeHtml(category.name) + '</h2><p>' + escapeHtml(category.description) + '</p><button class="btn btn-primary" type="button">Explore</button>';
      card.querySelector("button").addEventListener("click", function () {
        localStorage.setItem("ghardaariSelectedCategory", category.name);
        window.location.href = "category.html";
      });
      grid.appendChild(card);
    });
  }

  function selectedCategory() {
    var name = localStorage.getItem("ghardaariSelectedCategory") || categories[0].name;
    return categories.find(function (category) { return category.name === name; }) || categories[0];
  }

  function initCategoryPage() {
    if (page() !== "category") return;
    renderCategoryContent();
    var search = document.getElementById("categorySearch");
    if (search) search.addEventListener("input", renderCategoryContent);
    var questionButton = document.querySelector("[data-open-question]");
    var experienceButton = document.querySelector("[data-open-experience]");
    var helpfulButton = document.querySelector("[data-open-helpful]");
    var articleButton = document.querySelector("[data-open-article]");
    var videoButton = document.querySelector("[data-open-video]");
    if (questionButton) questionButton.addEventListener("click", function () { openModal("questionModal"); });
    if (experienceButton) experienceButton.addEventListener("click", function () { openModal("experienceModal"); });
    if (helpfulButton) helpfulButton.addEventListener("click", function () {
      window.location.href = "helpful-posts.html";
    });
    if (articleButton) articleButton.addEventListener("click", function () { openModal("articleModal"); });
    if (videoButton) videoButton.addEventListener("click", function () { openModal("videoModal"); });
    initCategoryForms();
  }

  function categoryExtras() {
    return {};
  }

  function renderCategoryContent() {
    var category = selectedCategory();
    var query = ((document.getElementById("categorySearch") || {}).value || "").toLowerCase();
    var categoryPosts = rankedPosts(getPosts().filter(function (post) { return post.category === category.name; }));
    var categoryQuestions = categoryPosts.filter(function (post) { return post.type === "QUESTION" || post.type === "EXPERIENCE"; });
    var categoryArticles = resources.filter(function (resource) {
      return resource.category === category.name && resource.source === "Community Article";
    });
    var categoryVideos = resources.filter(function (resource) {
      return resource.category === category.name && resource.source === "Community Video";
    });
    setText("[data-category-title]", category.name);
    fillPostItems("[data-category-qa]", categoryQuestions, query, "Q/A");
    fillArticleResources("[data-category-articles]", categoryArticles, query);
    var videoBox = document.querySelector("[data-category-videos]");
    if (videoBox) {
      videoBox.innerHTML = "";
      categoryVideos.filter(function (resource) {
        return !query || resource.title.toLowerCase().indexOf(query) !== -1 || resource.description.toLowerCase().indexOf(query) !== -1;
      }).forEach(function (resource) { videoBox.appendChild(resourceCard(resource)); });
      if (!videoBox.children.length) videoBox.innerHTML = '<p class="empty-state">No matching videos yet.</p>';
    }
  }

  function helpfulCategoryPosts() {
    var category = selectedCategory();
    return rankedPosts(getPosts().filter(function (post) {
      return post.category === category.name && isFeedPost(post);
    }));
  }

  function renderHelpfulPostsModal() {
    var query = ((document.getElementById("categorySearch") || {}).value || "").toLowerCase();
    fillHelpfulPosts("[data-helpful-modal-posts]", helpfulCategoryPosts(), [], query);
  }

  function initHelpfulPostsPage() {
    if (page() !== "helpful-posts") return;
    renderPosts();
  }

  function fillPills(selector, items, query) {
    var box = document.querySelector(selector);
    if (!box) return;
    box.innerHTML = items.filter(function (item) { return !query || item.toLowerCase().indexOf(query) !== -1; }).map(function (item) { return '<span class="pill">' + escapeHtml(item) + "</span>"; }).join("");
    if (!box.children.length) box.innerHTML = '<p class="empty-state">No matching topics.</p>';
  }

  function fillItems(selector, items, query, label) {
    var box = document.querySelector(selector);
    if (!box) return;
    box.innerHTML = "";
    items.filter(function (item) { return !query || item.toLowerCase().indexOf(query) !== -1; }).forEach(function (item) {
      box.insertAdjacentHTML("beforeend", '<article class="content-item"><h3>' + escapeHtml(label) + "</h3><p>" + escapeHtml(item) + "</p></article>");
    });
    if (!box.children.length) box.innerHTML = '<p class="empty-state">No matching content.</p>';
  }

  function fillPostItems(selector, posts, query, label) {
    var box = document.querySelector(selector);
    if (!box) return;
    box.innerHTML = "";
    posts.filter(function (post) {
      return !query || post.text.toLowerCase().indexOf(query) !== -1 || post.author.toLowerCase().indexOf(query) !== -1;
    }).forEach(function (post) {
      var title = post.type === "EXPERIENCE" ? "Experience" : label;
      box.insertAdjacentHTML("beforeend", '<article class="content-item qa-item"><div class="content-author"><a class="avatar-link" href="' + escapeHtml(profileUrl(post.userId)) + '">' + avatarMarkup(post.username, post.profileImage, "comment-avatar") + '</a><div><h3>' + escapeHtml(title) + '</h3><div class="item-meta">' + profileNameLink(post.userId, post.username, "profile-link") + '<span>' + escapeHtml(formatTime(post.date)) + '</span></div></div></div><p>' + escapeHtml(post.text) + '</p><button class="btn btn-primary" type="button" data-reply-post="' + post.id + '">Reply</button></article>');
    });
    if (!box.children.length) box.innerHTML = '<p class="empty-state">No matching content.</p>';
    box.querySelectorAll("[data-reply-post]").forEach(function (button) {
      button.addEventListener("click", function () { openComments(button.dataset.replyPost); });
    });
  }

  function fillArticleResources(selector, items, query) {
    var box = document.querySelector(selector);
    if (!box) return;
    box.innerHTML = "";
    items.filter(function (resource) {
      return !query || resource.title.toLowerCase().indexOf(query) !== -1 || resource.description.toLowerCase().indexOf(query) !== -1;
    }).forEach(function (resource) {
      box.insertAdjacentHTML("beforeend", '<article class="content-item"><div class="content-author"><a class="avatar-link" href="' + escapeHtml(profileUrl(resource.userId)) + '">' + avatarMarkup(resource.username, resource.profileImage, "comment-avatar") + '</a><div><h3>' + escapeHtml(resource.title) + '</h3><div class="item-meta">' + profileNameLink(resource.userId, resource.username || "community", "profile-link") + '<span>' + escapeHtml(formatTime(resource.date)) + '</span></div></div></div><p>' + escapeHtml(resource.description) + '</p><a class="btn btn-primary" href="' + escapeHtml(resource.url) + '" target="_blank" rel="noopener">Open Article</a></article>');
    });
    if (!box.children.length) box.innerHTML = '<p class="empty-state">No matching articles yet.</p>';
  }

  function fillHelpfulPosts(selector, posts, fallbackItems, query) {
    var box = document.querySelector(selector);
    if (!box) return;
    box.innerHTML = "";
    posts.filter(function (post) {
      return !query || post.text.toLowerCase().indexOf(query) !== -1 || post.author.toLowerCase().indexOf(query) !== -1 || post.category.toLowerCase().indexOf(query) !== -1;
    }).forEach(function (post) {
      box.insertAdjacentHTML("beforeend", '<article class="content-item"><div class="content-author"><a class="avatar-link" href="' + escapeHtml(profileUrl(post.userId)) + '">' + avatarMarkup(post.username, post.profileImage, "comment-avatar") + '</a><div><h3>' + profileNameLink(post.userId, post.author, "profile-link") + '</h3><div class="item-meta">' + profileNameLink(post.userId, post.username, "profile-link") + '<span>' + escapeHtml(formatTime(post.date)) + '</span></div></div></div><p>' + escapeHtml(post.text) + '</p><div class="item-meta"><span>' + Number(post.likes || 0) + ' likes</span><span>' + commentCount(post) + ' comments</span></div></article>');
    });
    fallbackItems.filter(function (item) { return !query || item.toLowerCase().indexOf(query) !== -1; }).forEach(function (item) {
      box.insertAdjacentHTML("beforeend", '<article class="content-item"><h3>Helpful Post</h3><p>' + escapeHtml(item) + "</p></article>");
    });
    if (!box.children.length) box.innerHTML = '<p class="empty-state">No matching content.</p>';
  }

  function initCategoryForms() {
    var questionForm = document.getElementById("questionForm");
    var experienceForm = document.getElementById("experienceForm");
    var articleForm = document.getElementById("articleForm");
    var videoForm = document.getElementById("videoForm");
    if (questionForm) {
      questionForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        await addCategoryExtra("questions", document.getElementById("questionText").value.trim(), "questionModal", questionForm);
      });
    }
    if (experienceForm) {
      experienceForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        await addCategoryExtra("experiences", document.getElementById("experienceText").value.trim(), "experienceModal", experienceForm);
      });
    }
    if (articleForm) {
      articleForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        await addCategoryResource("ARTICLE", articleForm, "articleModal", "articleMessage", {
          title: document.getElementById("articleTitle").value.trim(),
          description: document.getElementById("articleDescription").value.trim(),
          url: document.getElementById("articleUrl").value.trim()
        });
      });
    }
    if (videoForm) {
      videoForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        await addCategoryResource("YOUTUBE_VIDEO", videoForm, "videoModal", "videoMessage", {
          title: document.getElementById("videoTitle").value.trim(),
          description: document.getElementById("videoDescription").value.trim(),
          url: document.getElementById("videoUrl").value.trim()
        });
      });
    }
  }

  async function addCategoryExtra(type, text, modalId, form) {
    if (!text) return;
    var category = selectedCategory();

    await apiJson("/posts", {
      method: "POST",
      body: {
        categoryName: category.name,
        text: text,
        imageUrl: "",
        type: type === "questions" ? "QUESTION" : "EXPERIENCE"
      }
    });
    await loadPostsFromBackend();
    form.reset();
    closeModal(document.getElementById(modalId));
    renderCategoryContent();
  }

  async function addCategoryResource(type, form, modalId, messageId, data) {
    var target = document.getElementById(messageId);
    if (!data.title || !data.description || !data.url) return setMessage(target, "Please complete all fields.", false);

    try {
      await apiJson("/resources", {
        method: "POST",
        body: {
          categoryName: selectedCategory().name,
          type: type,
          title: data.title,
          description: data.description,
          url: data.url
        }
      });
      await loadResourcesFromBackend();
      form.reset();
      closeModal(document.getElementById(modalId));
      renderCategoryContent();
    } catch (error) {
      setMessage(target, error.message, false);
    }
  }

  function resourceCard(resource) {
    var card = document.createElement("article");
    card.className = "card resource-card";
    card.innerHTML = '<div class="resource-thumb">' + escapeHtml(resource.type) + '</div><div class="resource-meta"><span class="pill">' + escapeHtml(resource.category) + '</span><span class="pill">' + escapeHtml(resource.source) + '</span></div><div class="content-author"><a class="avatar-link" href="' + escapeHtml(profileUrl(resource.userId)) + '">' + avatarMarkup(resource.username, resource.profileImage, "comment-avatar") + '</a><div><h2>' + escapeHtml(resource.title) + '</h2><div class="item-meta">' + profileNameLink(resource.userId, resource.username || "community", "profile-link") + '<span>' + escapeHtml(formatTime(resource.date)) + '</span></div></div></div><p>' + escapeHtml(resource.description) + '</p><a class="btn btn-primary" href="' + escapeHtml(resource.url) + '" target="_blank" rel="noopener">Open Resource</a>';
    return card;
  }

  function initResources() {
    if (page() !== "resources") return;
    categoryOptions(document.getElementById("resourceFilter"), "All Categories");
    renderResources();
    document.getElementById("resourceSearch").addEventListener("input", renderResources);
    document.getElementById("resourceFilter").addEventListener("change", renderResources);
  }

  function renderResources() {
    var grid = document.getElementById("resourceGrid");
    if (!grid) return;
    var query = document.getElementById("resourceSearch").value.toLowerCase();
    var filter = document.getElementById("resourceFilter").value;
    grid.innerHTML = "";
    resources.filter(function (resource) {
      var categoryMatch = filter === "All" || filter === "All Categories" || resource.category === filter;
      var queryMatch = !query || resource.title.toLowerCase().indexOf(query) !== -1 || resource.description.toLowerCase().indexOf(query) !== -1 || resource.source.toLowerCase().indexOf(query) !== -1;
      return categoryMatch && queryMatch;
    }).forEach(function (resource) { grid.appendChild(resourceCard(resource)); });
    if (!grid.children.length) grid.innerHTML = '<p class="empty-state">No matching resources.</p>';
  }

  function getChats() {
    return backendChats || { active: "", groups: [], dms: [], messages: {} };
  }

  function setChats(chats) {
    backendChats = chats;
  }

  function initCommunity() {
    if (page() !== "community") return;
    renderChatLists();
    renderChatWindow();
    startChatPolling();
    document.getElementById("chatSearch").addEventListener("input", renderChatLists);
    document.querySelector("[data-open-group]").addEventListener("click", function () { openModal("groupModal"); });
    document.getElementById("groupForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      var name = document.getElementById("groupName").value.trim();
      var about = document.getElementById("groupAbout").value.trim();
      var target = document.getElementById("groupMessage");
      if (!name || !about) return setMessage(target, "Please enter group name and about text.", false);

      try {
        var group = await apiJson("/groups", {
          method: "POST",
          body: { name: name, description: about }
        });
        await loadGroupsFromBackend(group.id);
        document.getElementById("groupForm").reset();
        closeModal(document.getElementById("groupModal"));
        renderChatLists();
        renderChatWindow();
      } catch (error) {
        setMessage(target, error.message, false);
      }
    });
    document.getElementById("messageForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      var input = document.getElementById("messageText");
      var text = input.value.trim();
      if (!text) return;
      var chats = getChats();

      if (chats.active && chats.active.indexOf("group-") === 0) {
        var groupId = Number(chats.active.replace("group-", ""));
        if (!Number.isInteger(groupId)) return needDatabaseAccount();
        await apiJson("/groups/" + groupId + "/messages", {
          method: "POST",
          body: { messageText: text }
        });
        await loadGroupsFromBackend(chats.active);
        input.value = "";
        renderChatLists();
        renderChatWindow();
        return;
      }

      if (chats.active && chats.active.indexOf("dm-") === 0) {
        var conversationId = Number(chats.active.replace("dm-", ""));
        if (!Number.isInteger(conversationId)) return needDatabaseAccount();
        await apiJson("/direct-conversations/" + conversationId + "/messages", {
          method: "POST",
          body: { messageText: text }
        });
        await loadGroupsFromBackend(chats.active);
        input.value = "";
        renderChatLists();
        renderChatWindow();
      }
    });
  }

  function startChatPolling() {
    if (chatPollingTimer) return;
    chatPollingTimer = window.setInterval(async function () {
      if (chatPollingBusy || document.visibilityState === "hidden") return;
      chatPollingBusy = true;
      try {
        await loadGroupsFromBackend(getChats().active);
        renderChatLists();
        renderChatWindow();
      } catch (error) {
        // Keep the current chat visible if a refresh fails.
      } finally {
        chatPollingBusy = false;
      }
    }, 5000);
  }

  function fillDmUsers() {
    var select = document.getElementById("dmUserSelect");
    if (!select) return;
    select.innerHTML = "";
    backendUsers.forEach(function (user) {
      var option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.fullName + " (@" + user.username + ")";
      select.appendChild(option);
    });
    if (!select.children.length) {
      select.innerHTML = '<option value="">No available users</option>';
    }
  }

  function renderChatLists() {
    var query = ((document.getElementById("chatSearch") || {}).value || "").toLowerCase();
    var chats = getChats();
    renderChatList("groupList", chats.groups, query);
    renderChatList("dmList", chats.dms, query);
  }

  function renderChatList(id, items, query) {
    var box = document.getElementById(id);
    if (!box) return;
    var chats = getChats();
    box.innerHTML = "";
    items.filter(function (item) { return !query || item.name.toLowerCase().indexOf(query) !== -1 || item.about.toLowerCase().indexOf(query) !== -1; }).forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chat-item" + (item.id === chats.active ? " active" : "");
      button.innerHTML = '<span class="avatar">' + escapeHtml(initials(item.name)) + '</span><span><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.about) + "</small></span>";
      button.addEventListener("click", function () {
        var next = getChats();
        next.active = item.id;
        setChats(next);
        renderChatLists();
        renderChatWindow();
      });
      box.appendChild(button);
    });
    if (!box.children.length) box.innerHTML = '<p class="empty-state">No chats found.</p>';
  }

  function renderChatWindow() {
    var chats = getChats();
    var all = chats.groups.concat(chats.dms);
    var active = all.find(function (item) { return item.id === chats.active; }) || all[0];
    var box = document.getElementById("messageList");
    if (!active) {
      setText("[data-chat-title]", "No chat selected");
      setText("[data-chat-type]", "Community");
      if (box) box.innerHTML = '<p class="empty-state">Create a group or open a direct message to start chatting.</p>';
      return;
    }
    setText("[data-chat-title]", active.name);
    setText("[data-chat-type]", active.id.indexOf("dm-") === 0 ? "Direct Message" : "Group");
    box.innerHTML = "";
    (chats.messages[active.id] || []).forEach(function (message) {
      var targetType = active.id.indexOf("dm-") === 0 ? "DIRECT_MESSAGE" : "GROUP_MESSAGE";
      var own = message.sender === "You" || message.senderId === currentUserId();
      var actions = own ? "" : '<div class="inline-actions"><button class="btn btn-outline" type="button" data-report-message="' + message.id + '" data-report-type="' + targetType + '">Report</button><button class="btn btn-outline" type="button" data-block-message-user="' + message.senderId + '">Block</button></div>';
      box.insertAdjacentHTML("beforeend", '<div class="message-bubble' + (own ? " mine" : "") + '"><strong>' + escapeHtml(message.sender) + "</strong><p>" + escapeHtml(message.text) + "</p><small>" + escapeHtml(formatTime(message.time)) + "</small>" + actions + "</div>");
    });
    if (!box.children.length) {
      box.innerHTML = '<p class="empty-state">No messages yet. Start the conversation.</p>';
      return;
    }
    box.querySelectorAll("[data-report-message]").forEach(function (button) {
      button.addEventListener("click", function () { openReport(button.dataset.reportType, button.dataset.reportMessage); });
    });
    box.querySelectorAll("[data-block-message-user]").forEach(function (button) {
      button.addEventListener("click", function () { blockUser(button.dataset.blockMessageUser); });
    });
    box.scrollTop = box.scrollHeight;
  }

  function viewedProfileOrOwn() {
    return viewedProfile || getProfile();
  }

  function viewingOwnProfile(profile) {
    return Number((profile || viewedProfileOrOwn()).id || 0) === currentUserId();
  }

  async function loadViewedProfile() {
    var id = requestedProfileId();
    if (!id || id === currentUserId()) {
      viewedProfile = getProfile();
      return viewedProfile;
    }

    viewedProfile = await apiJson("/users/" + id);
    return viewedProfile;
  }

  async function startDirectMessage(userId, target) {
    userId = Number(userId);
    if (!Number.isInteger(userId) || userId <= 0 || userId === currentUserId()) return;

    try {
      if (target) setMessage(target, "Opening direct message...", true);
      var dm = await apiJson("/direct-conversations", {
        method: "POST",
        body: { userId: userId }
      });
      window.location.href = "community.html?chat=" + encodeURIComponent(dm.id);
    } catch (error) {
      if (target) setMessage(target, error.message, false);
      else window.alert(error.message);
    }
  }

  async function initProfile() {
    if (page() !== "profile") return;
    var selectedProfileImage = "";
    try {
      await loadViewedProfile();
    } catch (error) {
      viewedProfile = getProfile();
      window.alert(error.message);
    }
    renderProfile();
    var editButton = document.querySelector("[data-edit-profile]");
    var dmButton = document.querySelector("[data-profile-dm]");
    var verifyButton = document.querySelector("[data-request-verification]");
    var passwordButton = document.querySelector("[data-change-password]");
    if (editButton) editButton.addEventListener("click", function () {
      var profile = getProfile();
      selectedProfileImage = "";
      document.getElementById("profileNameInput").value = profile.fullName;
      document.getElementById("profileUsernameInput").value = profile.username;
      document.getElementById("profileEmailInput").value = profile.email;
      document.getElementById("profileBioInput").value = profile.bio;
      document.getElementById("profileImageInput").value = "";
      document.getElementById("profileImagePreviewWrap").hidden = !profile.profileImage;
      document.getElementById("profileImagePreview").src = profile.profileImage || "";
      openModal("profileModal");
    });
    if (dmButton) dmButton.addEventListener("click", function () {
      startDirectMessage(viewedProfileOrOwn().id, document.getElementById("profileActionMessage"));
    });
    if (verifyButton) verifyButton.addEventListener("click", requestEmailVerification);
    if (passwordButton) passwordButton.addEventListener("click", function () {
      document.getElementById("changePasswordForm").reset();
      setMessage(document.getElementById("changePasswordMessage"), "", false);
      openModal("changePasswordModal");
    });
    document.getElementById("profileImageInput").addEventListener("change", function () {
      var file = document.getElementById("profileImageInput").files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        selectedProfileImage = String(reader.result || "");
        document.getElementById("profileImagePreview").src = selectedProfileImage;
        document.getElementById("profileImagePreviewWrap").hidden = false;
      };
      reader.readAsDataURL(file);
    });
    document.getElementById("profileForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      var profile = getProfile();
      var profileImage = selectedProfileImage ? await uploadImageDataUrl(selectedProfileImage, "profiles") : (profile.profileImage || "");
      var next = {
        fullName: document.getElementById("profileNameInput").value.trim(),
        username: document.getElementById("profileUsernameInput").value.trim(),
        email: document.getElementById("profileEmailInput").value.trim(),
        bio: document.getElementById("profileBioInput").value.trim(),
        profileImage: profileImage
      };
      var target = document.getElementById("profileMessage");
      if (!next.fullName || !next.username || !next.email || !next.bio) return setMessage(target, "Please complete all fields.", false);
      if (!validEmail(next.email)) return setMessage(target, "Please enter a valid email.", false);

      try {
        if (!profile.id) {
          throw new Error("This profile was made before database signup. Please signup again to create a database user.");
        }

        var savedUser = await apiJson("/users/" + profile.id, {
          method: "PATCH",
          body: next
        });
        save("ghardaariProfile", savedUser);
        viewedProfile = savedUser;
        selectedProfileImage = "";
        setMessage(target, "Profile saved to database.", true);
        renderProfile();
        setTimeout(function () { closeModal(document.getElementById("profileModal")); }, 500);
      } catch (error) {
        setMessage(target, error.message, false);
      }
    });
    document.getElementById("changePasswordForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      var currentPassword = document.getElementById("currentPassword").value;
      var newPassword = document.getElementById("newPassword").value;
      var confirmPassword = document.getElementById("confirmNewPassword").value;
      var target = document.getElementById("changePasswordMessage");

      if (!currentPassword) return setMessage(target, "Current password is required.", false);
      if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) return setMessage(target, "New password must be at least 8 characters and include a letter and a number.", false);
      if (newPassword !== confirmPassword) return setMessage(target, "Passwords do not match.", false);

      try {
        var result = await apiJson("/users/change-password", {
          method: "POST",
          body: {
            currentPassword: currentPassword,
            newPassword: newPassword
          }
        });
        setMessage(target, result.message, true);
        document.getElementById("changePasswordForm").reset();
      } catch (error) {
        setMessage(target, error.message, false);
      }
    });
  }

  async function requestEmailVerification() {
    var target = document.getElementById("profileActionMessage");
    try {
      var result = await apiJson("/users/request-email-verification", {
        method: "POST",
        body: {}
      });
      if (result.verificationToken) {
        localStorage.setItem("ghardaariLastVerificationToken", result.verificationToken);
        setMessage(target, "Verification token created. Opening verification page...", true);
        setTimeout(function () { window.location.href = "verify-email.html"; }, 700);
        return;
      }
      setMessage(target, result.message, true);
    } catch (error) {
      setMessage(target, error.message, false);
    }
  }

  function renderProfile() {
    var profile = viewedProfileOrOwn();
    var own = viewingOwnProfile(profile);
    setText("[data-profile-name]", profile.fullName);
    setText("[data-profile-username]", "@" + profile.username);
    var email = document.querySelector("[data-profile-email]");
    if (email) {
      email.hidden = !own;
      email.textContent = own ? profile.email : "";
    }
    setText("[data-profile-bio]", profile.bio);
    var editButton = document.querySelector("[data-edit-profile]");
    var dmButton = document.querySelector("[data-profile-dm]");
    var verifyButton = document.querySelector("[data-request-verification]");
    var passwordButton = document.querySelector("[data-change-password]");
    var savedCard = document.querySelector("[data-profile-saved-card]");
    if (editButton) editButton.hidden = !own;
    if (dmButton) dmButton.hidden = own;
    if (verifyButton) verifyButton.hidden = !own || profile.emailVerified;
    if (passwordButton) passwordButton.hidden = !own;
    if (savedCard) savedCard.hidden = !own;
    setText("[data-profile-posts-title]", own ? "Your Posts" : profile.fullName + "'s Posts");
    setText("[data-profile-questions-title]", own ? "Your Q/As" : profile.fullName + "'s Q/As");
    setText("[data-profile-experiences-title]", own ? "Your Experiences" : profile.fullName + "'s Experiences");
    var photo = document.querySelector(".profile-photo");
    if (photo) {
      photo.innerHTML = profile.profileImage ? '<img src="' + escapeHtml(profile.profileImage) + '" alt="Profile image">' : escapeHtml(initials(profile.fullName));
    }
    renderProfileLists();
  }

  function renderProfileLists() {
    if (page() !== "profile") return;
    var profile = viewedProfileOrOwn();
    var own = viewingOwnProfile(profile);
    var posts = getPosts();
    fillProfileList("profilePosts", posts.filter(function (post) { return (post.userId === profile.id || post.username === profile.username) && isFeedPost(post); }), own ? "Your posts will appear here." : "No posts yet.");
    if (own) fillProfileList("profileSaved", posts.filter(function (post) { return post.saved; }), "Saved posts will appear here.");
    fillProfileList("profileQuestions", posts.filter(function (post) { return post.userId === profile.id && post.type === "QUESTION"; }), own ? "Questions will appear here." : "No questions yet.");
    fillProfileList("profileExperiences", posts.filter(function (post) { return post.userId === profile.id && post.type === "EXPERIENCE"; }), own ? "Shared experiences will appear here." : "No experiences yet.");
  }

  function fillProfileList(id, posts, empty) {
    var box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = "";
    posts.forEach(function (post) {
      box.insertAdjacentHTML("beforeend", '<article class="content-item"><div class="item-meta"><span>' + escapeHtml(post.category) + '</span><span>' + escapeHtml(formatTime(post.date)) + '</span></div><p>' + escapeHtml(post.text) + "</p>" + (post.image ? '<img class="post-image" src="' + escapeHtml(post.image) + '" alt="Post upload">' : "") + "</article>");
    });
    if (!box.children.length) box.innerHTML = '<p class="empty-state">' + escapeHtml(empty) + "</p>";
  }

  var activeReportTarget = null;
  var adminReportsCache = [];
  var adminActionState = null;

  function ensureReportModal() {
    if (document.getElementById("reportModal")) return;
    document.body.insertAdjacentHTML("beforeend",
      '<div class="modal" id="reportModal" aria-hidden="true"><div class="modal-card"><button type="button" class="modal-close" data-close-modal aria-label="Close">x</button><h2>Report</h2><form id="reportForm" novalidate><div class="form-group"><label for="reportReason">Reason</label><textarea id="reportReason" rows="4" placeholder="Briefly explain the issue..."></textarea></div><p class="form-message" id="reportMessage" aria-live="polite"></p><button class="btn btn-primary full-width" type="submit">Submit Report</button></form></div></div>'
    );
    initModals();
    document.getElementById("reportForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      var reason = document.getElementById("reportReason").value.trim();
      var target = document.getElementById("reportMessage");
      if (!reason) return setMessage(target, "Please enter a reason.", false);

      try {
        await apiJson("/moderation/reports", {
          method: "POST",
          body: {
            targetType: activeReportTarget.targetType,
            targetId: activeReportTarget.targetId,
            reason: reason
          }
        });
        setMessage(target, "Report submitted.", true);
        document.getElementById("reportForm").reset();
        setTimeout(function () { closeModal(document.getElementById("reportModal")); }, 500);
      } catch (error) {
        setMessage(target, error.message, false);
      }
    });
  }

  function openReport(targetType, targetId) {
    ensureReportModal();
    activeReportTarget = { targetType: targetType, targetId: Number(targetId) };
    setMessage(document.getElementById("reportMessage"), "", false);
    openModal("reportModal");
  }

  async function blockUser(userId) {
    userId = Number(userId);
    if (!Number.isInteger(userId) || userId <= 0) return;
    if (!window.confirm("Block this user? Their posts and messages will be hidden.")) return;

    await apiJson("/moderation/blocks", {
      method: "POST",
      body: { userId: userId }
    });
    await loadPostsFromBackend();
    await loadUsersFromBackend();
    await loadGroupsFromBackend();
    renderPosts();
    renderComments();
    renderChatLists();
    renderChatWindow();
    renderProfileLists();
  }

  async function initAdminDashboard() {
    if (page() !== "dashboard") return;
    var profile = getProfile();
    var statusFilter = document.getElementById("reportStatusFilter");
    var searchInput = document.getElementById("reportSearch");
    var refreshButton = document.getElementById("refreshReports");
    var panel = document.getElementById("adminReportList");
    var message = document.getElementById("adminMessage");

    if (!panel) return;

    if (profile.role !== "ADMIN") {
      panel.innerHTML = '<p class="empty-state">Admin access is required.</p>';
      setMessage(message, "Your account is not an admin account.", false);
      return;
    }

    if (statusFilter) statusFilter.addEventListener("change", loadAdminReports);
    if (searchInput) searchInput.addEventListener("input", function () { renderAdminReports(adminReportsCache); });
    if (refreshButton) refreshButton.addEventListener("click", loadAdminReports);
    initAdminActionModal();
    await loadAdminReports();
  }

  async function loadAdminReports() {
    var statusFilter = document.getElementById("reportStatusFilter");
    var message = document.getElementById("adminMessage");
    var status = statusFilter ? statusFilter.value : "";

    try {
      setMessage(message, "Loading reports...", true);
      var query = status ? "?status=" + encodeURIComponent(status) : "";
      var reports = await apiJson("/moderation/reports" + query);
      adminReportsCache = reports;
      renderAdminSummary(reports);
      renderAdminReports(reports);
      setMessage(message, reports.length ? "Reports loaded." : "No reports found.", true);
    } catch (error) {
      setMessage(message, error.message, false);
      renderAdminReports([]);
    }
  }

  function renderAdminReports(reports) {
    var panel = document.getElementById("adminReportList");
    if (!panel) return;
    var search = ((document.getElementById("reportSearch") || {}).value || "").toLowerCase();
    reports = reports.filter(function (report) {
      var target = report.target || {};
      var text = [
        report.id,
        report.status,
        report.targetType,
        report.reason,
        report.moderatorNote,
        report.reporter && report.reporter.username,
        report.reporter && report.reporter.fullName,
        target.title,
        target.text,
        target.author
      ].join(" ").toLowerCase();
      return !search || text.indexOf(search) !== -1;
    });
    panel.innerHTML = "";

    reports.forEach(function (report) {
      var target = report.target || {};
      var history = '<div class="admin-report-history"><span>Created: ' + escapeHtml(formatDateTime(report.createdAt)) + '</span>';
      history += report.reviewedAt ? '<span>Reviewed: ' + escapeHtml(formatDateTime(report.reviewedAt)) + '</span>' : '<span>Not reviewed yet</span>';
      history += report.moderator ? '<span>Moderator: @' + escapeHtml(report.moderator.username) + '</span>' : "";
      history += "</div>";
      var card = document.createElement("article");
      card.className = "card admin-report-card";
      card.innerHTML =
        '<div class="admin-report-head"><div><p class="eyebrow">' + escapeHtml(report.targetType) + '</p><h2>Report #' + report.id + '</h2></div><span class="pill status-pill status-' + escapeHtml(report.status.toLowerCase().replace("_", "-")) + '">' + escapeHtml(report.status.replace("_", " ")) + '</span></div>' +
        '<p><strong>Reason:</strong> ' + escapeHtml(report.reason) + '</p>' +
        '<div class="content-item"><h3>' + escapeHtml(target.title || "Reported target") + '</h3><p>' + escapeHtml(target.exists === false ? "This target no longer exists." : (target.text || "No preview available.")) + '</p><p class="item-meta"><span>Author: ' + escapeHtml(target.author || "Unknown") + '</span><span>Reporter: @' + escapeHtml(report.reporter.username) + '</span></p></div>' +
        history +
        (report.moderatorNote ? '<p><strong>Moderator note:</strong> ' + escapeHtml(report.moderatorNote) + '</p>' : "") +
        '<div class="post-actions"><button class="btn btn-outline" type="button" data-review-report="' + report.id + '">Mark Reviewed</button><button class="btn btn-outline" type="button" data-dismiss-report="' + report.id + '">Dismiss</button><button class="btn btn-outline" type="button" data-warn-report="' + report.id + '">Warn User</button>' + (report.targetType === "USER" ? "" : '<button class="btn btn-primary" type="button" data-delete-target="' + report.id + '">Remove Content</button>') + '</div>';
      panel.appendChild(card);
    });

    if (!panel.children.length) {
      panel.innerHTML = '<p class="empty-state">No reports found.</p>';
    }

    panel.querySelectorAll("[data-review-report]").forEach(function (button) {
      button.addEventListener("click", function () { openAdminAction("review", button.dataset.reviewReport); });
    });
    panel.querySelectorAll("[data-dismiss-report]").forEach(function (button) {
      button.addEventListener("click", function () { openAdminAction("dismiss", button.dataset.dismissReport); });
    });
    panel.querySelectorAll("[data-warn-report]").forEach(function (button) {
      button.addEventListener("click", function () { openAdminAction("warn", button.dataset.warnReport); });
    });
    panel.querySelectorAll("[data-delete-target]").forEach(function (button) {
      button.addEventListener("click", function () { openAdminAction("remove", button.dataset.deleteTarget); });
    });
  }

  function renderAdminSummary(reports) {
    var box = document.getElementById("adminSummary");
    if (!box) return;
    var counts = reports.reduce(function (acc, report) {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});
    box.innerHTML =
      '<div class="card admin-stat"><strong>' + reports.length + '</strong><span>Total</span></div>' +
      '<div class="card admin-stat"><strong>' + (counts.PENDING || 0) + '</strong><span>Pending</span></div>' +
      '<div class="card admin-stat"><strong>' + (counts.REVIEWED || 0) + '</strong><span>Reviewed</span></div>' +
      '<div class="card admin-stat"><strong>' + (counts.ACTION_TAKEN || 0) + '</strong><span>Action Taken</span></div>' +
      '<div class="card admin-stat"><strong>' + (counts.DISMISSED || 0) + '</strong><span>Dismissed</span></div>';
  }

  function initAdminActionModal() {
    var form = document.getElementById("adminActionForm");
    if (!form) return;
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      await submitAdminAction();
    });
  }

  function openAdminAction(action, reportId) {
    var titles = {
      review: "Mark Report Reviewed",
      dismiss: "Dismiss Report",
      warn: "Warn Reported User",
      remove: "Remove Reported Content"
    };
    var bodies = {
      review: "This keeps the report in history and marks it as reviewed.",
      dismiss: "This closes the report without removing content.",
      warn: "This sends a warning record to the reported user.",
      remove: "This removes the reported post, comment, or message from the database."
    };
    var notes = {
      review: "Reviewed by moderator.",
      dismiss: "Dismissed after review.",
      warn: "Warning sent to reported user.",
      remove: "Reported content removed."
    };
    adminActionState = { action: action, reportId: reportId };
    setText("#adminActionTitle", titles[action] || "Confirm Action");
    setText("#adminActionBody", bodies[action] || "Confirm this moderation action.");
    document.getElementById("adminActionNote").value = notes[action] || "";
    document.getElementById("adminWarningText").value = action === "warn" ? "Please follow the GharDaari community rules." : "";
    document.getElementById("adminWarningGroup").hidden = action !== "warn";
    setMessage(document.getElementById("adminActionMessage"), "", false);
    openModal("adminActionModal");
  }

  async function submitAdminAction() {
    if (!adminActionState) return;
    var action = adminActionState.action;
    var reportId = adminActionState.reportId;
    var note = document.getElementById("adminActionNote").value.trim();
    var warning = document.getElementById("adminWarningText").value.trim();
    var message = document.getElementById("adminActionMessage");

    if (!note) return setMessage(message, "Moderator note is required.", false);
    if (action === "warn" && !warning) return setMessage(message, "Warning message is required.", false);

    setMessage(message, "Saving moderation action...", true);
    try {
      if (action === "review") {
        await apiJson("/moderation/reports/" + reportId, {
          method: "PATCH",
          body: { status: "REVIEWED", moderatorNote: note }
        });
      } else if (action === "dismiss") {
        await apiJson("/moderation/reports/" + reportId + "/dismiss", {
          method: "POST",
          body: { moderatorNote: note }
        });
      } else if (action === "warn") {
        await apiJson("/moderation/reports/" + reportId + "/warn", {
          method: "POST",
          body: { message: warning, moderatorNote: note }
        });
      } else if (action === "remove") {
        await apiJson("/moderation/reports/" + reportId + "/target", {
          method: "DELETE",
          body: { moderatorNote: note }
        });
      }

      closeModal(document.getElementById("adminActionModal"));
      adminActionState = null;
      await loadAdminReports();
    } catch (error) {
      setMessage(message, error.message, false);
    }
  }

  function initModals() {
    document.querySelectorAll("[data-close-modal]").forEach(function (button) {
      button.addEventListener("click", function () {
        closeModal(button.closest(".modal"));
      });
    });
    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModal(modal);
      });
    });
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("DOMContentLoaded", async function () {
    if (!enforceRouteProtection()) return;
    setInitialLoadingStates();
    if (isProtectedPage()) {
      try {
        setPageStatus("Loading your account and app data...", true);
        await loadCurrentUser();
      } catch (error) {
        showBackendProblem(error);
        initNavigation();
        return;
      }
    }
    await loadCategoriesFromBackend();
    await loadResourcesFromBackend();
    await loadPostsFromBackend();
    await loadUsersFromBackend();
    await loadGroupsFromBackend();
    initIntro();
    initNavigation();
    initModals();
    initAuth();
    initHome();
    initComments();
    initCategories();
    initCategoryPage();
    initHelpfulPostsPage();
    initCommunity();
    initResources();
    await initAdminDashboard();
    await initProfile();
    if (!backendStatusShown) clearBackendProblem();
  });
})();
