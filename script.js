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