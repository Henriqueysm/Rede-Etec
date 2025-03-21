document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", function() {
        const passwordInput = this.previousElementSibling.previousElementSibling; // Acha o input de senha
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.querySelector("img").src = "images/eye-open.png"; // Muda para olho aberto
        } else {
            passwordInput.type = "password";
            this.querySelector("img").src = "images/eye-closed.png"; // Muda para olho fechado
        }
    });
});