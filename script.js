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