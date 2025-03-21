// Função para abrir o pop-up
function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

// Função para fechar o pop-up
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Simula o envio do código para o e-mail
function sendEmail() {
    let email = document.getElementById("emailInput").value;

    if (email === "") {
        alert("Digite um e-mail válido.");
        return;
    }

    // Aqui, você pode futuramente chamar uma API para enviar o e-mail.
    alert("Código enviado para " + email);

    // Muda para a tela de inserção do token
    document.getElementById("step-email").style.display = "none";
    document.getElementById("step-token").style.display = "block";
}

// Simula a verificação do token
function verifyToken() {
    let token = document.getElementById("tokenInput").value;

    if (token === "123456") { // Simulação de código correto
        alert("Código correto! Agora você pode redefinir sua senha.");
        closePopup();
    } else {
        alert("Código inválido, tente novamente.");
    }
}


// Fechar pop-up ao pressionar "Esc"
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") { 
        closePopup();
    }
});