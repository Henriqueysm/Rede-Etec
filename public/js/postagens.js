// script.js

// Função para buscar postagens
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
            throw new Error('Erro ao buscar postagens');
        }
        const posts = await response.json();
        const postsContainer = document.querySelector('.posts');

        if (!postsContainer) {
            throw new Error('Container de postagens não encontrado');
        }

        // Limpar o container antes de adicionar novas postagens
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p>${post.content}</p>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        alert('Erro ao carregar postagens. Tente novamente mais tarde.');
    }
}

// Função para criar uma nova postagem
async function createPost(content) {
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: 1, content }),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar postagem');
        }

        fetchPosts(); // Atualiza o feed após criar a postagem
        alert('Postagem criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar postagem:', error);
        alert('Erro ao criar postagem. Tente novamente.');
    }
}

// Adicionar evento de clique ao botão "Publicar"
document.getElementById('postButton').addEventListener('click', async () => {
    const textarea = document.querySelector('.post-box textarea');
    const content = textarea.value.trim();
    
    if (content) {
        await createPost(content);
        textarea.value = ''; // Limpa o campo de texto após a postagem
    } else {
        alert('Por favor, escreva algo antes de publicar.');
    }
});

// Carregar as postagens ao iniciar a página
fetchPosts();
