function toggleForm() {
    const container = document.getElementById('container');
    const loginForm = document.querySelector('.login');
    const signupForm = document.querySelector('.signup');
    
    container.classList.toggle('active');
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}