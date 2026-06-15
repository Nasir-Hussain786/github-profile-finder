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