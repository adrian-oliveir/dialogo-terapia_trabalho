document.getElementById("theme-icon").addEventListener("click", toggleTheme);

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");
    
}

function maskCPF(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    input.value = value;

}
