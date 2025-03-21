let cropper;

window.onload = function () {
    const email = localStorage.getItem('userEmail');  // Pega o e-mail do localStorage

    if (!email) {
        alert('Usuário não está autenticado.');
        window.location.href = 'index.html';  // Redireciona para a página de login caso o email não esteja no localStorage
        return;
    }

    // Lógica para carregar dados do perfil
    fetch(`/profile?email=${email}`)
        .then(response => response.json())
        .then(data => {
            // Divide o nome em primeiro nome e sobrenome
            const [firstName, lastName] = data.name ? data.name.split(" ") : ["", ""];
            // Carrega os dados no formulário
            document.getElementById('newName').value = data.name || '';  // Preenche o nome corretamente
            document.getElementById('newPhotoUrl').value = data.photoUrl || ''; // Preenche a URL da foto
            document.getElementById('image').src = data.photoUrl || '/images/user.png'; // Foto padrão se não houver
        })
        .catch(err => {
            alert('Erro ao carregar dados do perfil.');
            console.error(err);
        });

    // Evento para o envio do formulário
    document.getElementById('editInfoForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const userEmail = localStorage.getItem("userEmail"); // Pega o email do localStorage
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
            console.log("Enviando foto:", newPhoto);
            formData.append('newPhoto', newPhoto);
        }

        // Envio do perfil para o servidor
        fetch('http://localhost:3000/update-profile', {
          method: 'PUT',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
      
          // Atualiza os dados do usuário no localStorage
          const updatedUser = {
              firstName: newName.split(' ')[0],  // Primeiro nome
              lastName: newName.split(' ')[1] || "", // Sobrenome
              email: userEmail,
              photoUrl: newPhotoUrl || "imagens/user.png", // Foto padrão se não for atualizada
          };
      
          localStorage.setItem("user", JSON.stringify(updatedUser));  // Salva os dados atualizados no localStorage
          localStorage.setItem("userEmail", userEmail); // Salva o e-mail
      
          // Atualiza os dados na página Home sem recarregar
          updateHomePage(updatedUser);
      })
      .catch(err => {
          console.log('Erro ao atualizar perfil:', err);
          alert('Erro ao atualizar o perfil.');
      });
    });      

    // Função para atualizar a página Home sem recarregar
    function updateHomePage(user) {
        const userNameElement = document.querySelector('.user-email');
        const userPhotoElement = document.getElementById('profile-photo');

        if (userNameElement) {
            userNameElement.textContent = `Bem-vindo, ${user.firstName} ${user.lastName}`;
        }
        if (userPhotoElement) {
            userPhotoElement.src = user.photoUrl;
        }
    }

    // Evento para selecionar a foto e ativar o Cropper.js
    document.getElementById('newPhoto').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            const imageElement = document.getElementById('image');
            imageElement.src = imageURL;

            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(imageElement, {
                aspectRatio: 1,  // Proporção da imagem (1:1 para quadrada)
                viewMode: 2,
                preview: '.preview',  // Se você estiver utilizando uma visualização do corte
            });
        }
    });

    // Envio da foto cortada
    document.getElementById('uploadImage').addEventListener('click', function () {
        if (!cropper) {
            alert('Nenhuma foto foi carregada para corte.');
            return;
        }

        const canvas = cropper.getCroppedCanvas();
        if (!canvas) {
            alert('Erro ao cortar a imagem.');
            return;
        }

        canvas.toBlob(function (blob) {
            const formData = new FormData();  // Declarar formData aqui
            formData.append('newPhoto', blob); // Envia a imagem cortada

            // Pega o e-mail do localStorage
            const email = localStorage.getItem('userEmail');
            if (!email) {
                alert('E-mail não encontrado no armazenamento local.');
                return;
            }
            formData.append('email', email); // Adiciona o e-mail ao FormData

            // Envia para o servidor
            fetch('http://localhost:3000/update-profile/photo', {
                method: 'PUT',
                body: formData,  // formData é onde está o arquivo de imagem e o e-mail
            })
                .then(response => response.json())
                .then(data => {
                    alert('Perfil atualizado com sucesso!');

                    // Atualiza os dados do usuário no localStorage
                    const updatedUser = {
                        email: email,
                        firstName: newName.split(" ")[0],  // Atualiza o primeiro nome
                        lastName: newName.split(" ")[1],   // Atualiza o sobrenome
                        photoUrl: data.photoUrl, // Atualiza a URL da foto
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                })
                .catch(error => {
                    console.error('Erro ao atualizar foto:', error);
                });
        });
    });

    // Logout
    document.getElementById('logout').addEventListener('click', function () {
        // Limpa os dados do usuário do localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');

        // Redireciona para a página de login
        window.location.href = 'index.html';  // ou qualquer página de login que você tenha
    });
};
