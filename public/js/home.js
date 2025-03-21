document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "index.html"; // Redireciona para o login
        return;
    }

    // Recupera os dados do usuário
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Erro ao carregar os dados do usuário.");
        window.location.href = "index.html";
        return;
    }

    // Exibe nome do usuário
    const userNameElement = document.querySelector("#user-name");
    const userPhotoElement = document.getElementById("profile-photo");

    if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName || ""}`;
    }

    if (userPhotoElement) {
        userPhotoElement.src = user.photoUrl || "images/user.png";
    }

    // 📌 Sistema de Postagens
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

    window.onload = function () {
    // Recuperar os dados do usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Verificar se o usuário está logado
    if (!user) {
        alert('Usuário não autenticado!');
        window.location.href = 'login.html'; // Redireciona para a página de login
        return;
    }

    // Exibir os dados do usuário na página
    const userNameElement = document.querySelector('.user-email');
    const userPhotoElement = document.getElementById('profile-photo');

    if (userNameElement) {
        // Exibe o nome do usuário, pode ser dividido ou apenas o primeiro nome
        userNameElement.textContent = `Bem-vindo, ${user.firstName} ${user.lastName || ''}`;
    }

    if (userPhotoElement) {
        // Exibe a foto do usuário
        userPhotoElement.src = user.photoUrl || '/images/user.png'; // Foto padrão caso não tenha foto
    }

    // Opcional: se você tiver outros campos no HTML para exibir, faça da mesma forma.
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

    carregarPostagens(); // Chama a função para exibir os posts ao carregar a página

    // 🔴 Logout
    document.querySelector(".logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("user");
        window.location.href = "index.html"; // Agora irá acessar corretamente a página index.html
    });
});


        // 🚀 Atualização do perfil do usuário
        document.getElementById('editInfoForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const userEmail = localStorage.getItem("userEmail"); // Pegue o email do localStorage
            const newName = document.getElementById('newName').value;
            const newPassword = document.getElementById('newPassword').value;
            const newPhotoUrl = document.getElementById('newPhotoUrl').value;
            const newPhoto = document.getElementById('newPhoto').files[0];

            const formData = new FormData();
            formData.append('email', userEmail);
            formData.append('newName', newName);
            formData.append('newPassword', newPassword);
            formData.append('newPhotoUrl', newPhotoUrl);

            if (newPhoto) {
                console.log("Enviando foto:", newPhoto); // Verifique a foto sendo enviada
                formData.append('newPhoto', newPhoto);
            }

            fetch('http://localhost:3000/update-profile', {
                method: 'PUT',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);

                // Atualizar os dados no localStorage com as novas informações
                const updatedUser = {
                    firstName: newName.split(' ')[0],  // Supondo que o nome seja dividido em primeiro e sobrenome
                    lastName: newName.split(' ')[1] || "", // Caso o nome não tenha sobrenome
                    email: userEmail,
                    photoUrl: newPhotoUrl || "imagens/user.png", // Defina uma foto padrão se não foi alterada
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));  // Atualizando no localStorage
                location.reload(); // Recarregar a página para mostrar as mudanças
            })
            .catch(err => {
                console.log('Erro ao atualizar perfil:', err);
                alert('Erro ao atualizar o perfil.');
            });
    

    // Carregar dados do perfil na home
    fetch(`http://localhost:3000/profile?email=${userEmail}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Verifique o que é retornado do backend
            document.getElementById('username').textContent = data.name || "Nome não encontrado";
            document.getElementById('user-age').textContent = `Idade: ${data.age || "Idade não disponível"}`;
            document.getElementById('profile-photo').src = data.photoUrl || "imagens/user.png"; 
            document.querySelector('.user-email').textContent = `Bem-vindo, ${data.email}`;
        })
        .catch(err => {
            console.error('Erro ao carregar perfil:', err);
            alert('Erro ao carregar dados do perfil.');
        });
});
