document.getElementById("theme-icon").addEventListener("click", toggleTheme);

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");
    
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});
