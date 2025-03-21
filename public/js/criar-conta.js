document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            // Verificando se os campos existem antes de pegar os valores
            const firstName = document.getElementById("firstName");
            const lastName = document.getElementById("lastName");
            const email = document.getElementById("registerEmail");
            const password = document.getElementById("registerPassword");
            const birthDate = document.getElementById("birthDate");

            // Verifique se todos os campos foram encontrados
            if (!firstName || !lastName || !email || !password || !birthDate) {
                alert("Alguns campos não foram encontrados. Verifique o código HTML.");
                return;
            }

            // Pega os valores dos campos
            const firstNameValue = firstName.value;
            const lastNameValue = lastName.value;
            const emailValue = email.value;
            const passwordValue = password.value;
            const birthDateValue = birthDate.value;

            // Verificar se todos os campos foram preenchidos
            if (!firstNameValue || !lastNameValue || !emailValue || !passwordValue || !birthDateValue) {
                alert("Todos os campos devem ser preenchidos.");
                return;
            }

            // Log para verificar os dados
            console.log("Dados de registro:", { firstNameValue, lastNameValue, emailValue, passwordValue, birthDateValue });

            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstName: firstNameValue, lastName: lastNameValue, email: emailValue, password: passwordValue, birthDate: birthDateValue })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Conta criada com sucesso! Faça login.");
                    window.location.href = "index.html"; // Redireciona de volta para a página de login
                } else {
                    alert("Erro: " + data.message);
                }
            } catch (error) {
                console.error("Erro ao fazer requisição:", error);
                alert("Ocorreu um erro ao tentar criar a conta.");
            }
        });
    }
});
