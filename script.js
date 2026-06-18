// Saare repos yahan store honge
let allRepos = [];

// Default sorting
let sortBy = "stars";

// Search button click
document.getElementById("searchBtn").addEventListener("click", searchUser);

// Enter key press
document.getElementById("usernameInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") searchUser();
});

// Filter buttons
let filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        filterButtons.forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        sortBy = btn.dataset.sort;
        showRepos();
    });
});

// Main search function
async function searchUser() {
    let username = document.getElementById("usernameInput").value.trim();
    if (!username) return;

    showSection("loading");

    try {
        let userData  = await fetchData("https://api.github.com/users/" + username);
        let reposData = await fetchData("https://api.github.com/users/" + username + "/repos?per_page=100");

        allRepos = reposData;
        showProfile(userData);
        showRepos();
        showSection("profileContainer");

    } catch (error) {
        showSection("error");
    }
}

// API se data lana
async function fetchData(url) {
    let response = await fetch(url);
    if (response.status === 404) throw new Error("User not found");
    if (!response.ok)            throw new Error("API error. Try again.");
    return response.json();
}

// Sirf ek section dikhao, baaki chupao
function showSection(sectionId) {
    ["loading", "error", "profileContainer"].forEach(function(id) {
        let el = document.getElementById(id);
        if (id === sectionId) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });
}

// Profile card fill karo
function showProfile(user) {
    setText("profileName",     user.name || user.login);
    setText("profileUsername", "@" + user.login);
    setText("profileBio",      user.bio  || "No bio");
    setText("statFollowers",   formatNumber(user.followers));
    setText("statFollowing",   formatNumber(user.following));
    setText("statRepos",       formatNumber(user.public_repos));
    setText("statGists",       formatNumber(user.public_gists || 0));

    document.getElementById("avatar").src       = user.avatar_url;
    document.getElementById("profileLink").href = user.html_url;

    // Extra info
    let meta = "";
    if (user.location)         meta += '<span class="meta-item">📍 ' + user.location + '</span>';
    if (user.company)          meta += '<span class="meta-item">🏢 ' + user.company + '</span>';
    if (user.blog)             meta += '<span class="meta-item">🔗 <a href="' + user.blog + '" target="_blank">' + user.blog + '</a></span>';
    if (user.twitter_username) meta += '<span class="meta-item">𝕏 @' + user.twitter_username + '</span>';

    document.getElementById("profileMeta").innerHTML = meta;
}

// Repos dikhao
function showRepos() {
    let sorted = [...allRepos];

    if (sortBy === "stars")   sorted.sort(function(a, b) { return b.stargazers_count - a.stargazers_count; });
    if (sortBy === "forks")   sorted.sort(function(a, b) { return b.forks_count - a.forks_count; });
    if (sortBy === "updated") sorted.sort(function(a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });

    let top8 = sorted.slice(0, 8);
    setText("reposCount", allRepos.length);

    if (top8.length === 0) {
        document.getElementById("repoGrid").innerHTML = "<p>No repositories found.</p>";
        return;
    }

    let html = "";
    top8.forEach(function(repo) {
        let description = repo.description || "No description";
        let language    = repo.language    || "Unknown";
        let visibility  = repo.private     ? "Private" : "Public";

        html += `
        <a href="${repo.html_url}" target="_blank" class="repo-card">
            <div class="repo-header">
                <span class="repo-name">${repo.name}</span>
                <span class="repo-visibility">${visibility}</span>
            </div>
            <p class="repo-description">${description}</p>
            <div class="repo-footer">
                <span class="repo-language">
                    <span class="language-dot lang-${language}"></span>
                    ${language}
                </span>
                <span>⭐ ${formatNumber(repo.stargazers_count)}</span>
                <span>🍴 ${formatNumber(repo.forks_count)}</span>
            </div>
        </a>`;
    });

    document.getElementById("repoGrid").innerHTML = html;
}

// Profile URL copy karna
function copyProfile() {
    let username   = document.getElementById("profileUsername").textContent.replace("@", "");
    let profileURL = "https://github.com/" + username;

    navigator.clipboard.writeText(profileURL).then(function() {
        let btn = document.querySelector(".btn-outline");
        btn.textContent = "✓ Copied!";
        setTimeout(function() { btn.textContent = "Copy Link"; }, 2000);
    });
}

// Element ka text set karna
function setText(id, text) {
    document.getElementById(id).textContent = text;
}

// Number ko readable format mein banana
function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000)    return (n / 1000).toFixed(1) + "k";
    return String(n);
}