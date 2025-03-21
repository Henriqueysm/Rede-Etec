document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000"; // Altere para o seu backend

    // 📌 Cadastro de Usuário
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            const birthDate = document.getElementById("birthDate").value;

            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password, birthDate })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Conta criada com sucesso! Faça login.");
                window.location.href = "index.html";
            } else {
                alert("Erro: " + (data.message || "Erro ao cadastrar"));
            }
        });
    }

    // 📌 Login do Usuário
   // 📌 Login do Usuário
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log("Resposta da API:", data); // Verifica os dados que estão sendo retornados
        
        if (response.ok) {
            // Salve o token e os dados do usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("user", JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                photoUrl: data.photoUrl
            }));

            // Redirecionar para a página home
            window.location.href = "home.html";
        } else {
            alert("Erro: " + data.message);
        }
    });
}


    // 🔒 Verificar se o usuário está autenticado na Home
    if (window.location.pathname.includes("home.html")) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "index.html"; // Redireciona para o login
            return;
        }

        // 📌 Exibir email do usuário no cabeçalho
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            document.querySelector(".user-email").textContent = userEmail;
        }

        // 🚀 Sistema de Postagens
        const postButton = document.getElementById("postButton");
        const postsContainer = document.querySelector(".posts");

        if (postButton) {
            postButton.addEventListener("click", async () => {
                const textarea = document.querySelector(".post-box textarea");
                const content = textarea.value.trim();

                if (content === "") {
                    alert("Digite algo para postar!");
                    return;
                }

                const response = await fetch(`${API_URL}/posts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ content })
                });

                const data = await response.json();
                if (response.ok) {
                    textarea.value = "";
                    carregarPostagens(); // Atualiza os posts
                } else {
                    alert("Erro ao publicar: " + (data.message || "Erro desconhecido"));
                }
            });
        }

        // 📌 Carregar postagens do backend
        async function carregarPostagens() {
            const response = await fetch(`${API_URL}/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const posts = await response.json();
            postsContainer.innerHTML = ""; // Limpa antes de renderizar

            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `<p><strong>${post.author}</strong>: ${post.content}</p>`;
                postsContainer.appendChild(postElement);
            });
        }

        carregarPostagens(); // 🚀 Chama a função para exibir os posts ao carregar a página

        // 🔴 Logout
        document.querySelector(".logout").addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            window.location.href = "home.html"; // Agora irá acessar corretamente a página home.html

        });
    }
});
