document.getElementById("theme-icon").addEventListener("click", toggleTheme);

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById("theme-icon");

    body.classList.toggle("dark-theme");

    if (body.classList.contains("dark-theme")) {
        icon.innerHTML = "&#11088;"; 
    } else {
        icon.innerHTML = "&#9728;";
    }
}