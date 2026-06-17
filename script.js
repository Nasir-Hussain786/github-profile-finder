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