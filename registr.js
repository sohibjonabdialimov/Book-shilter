const registrForm = document.getElementById('registrForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const registrLink = document.querySelector('#registrBtn a');

registrForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (username.value === 'Sohibjon' && password.value === '7777') {
    console.log("salom");
    // registrLink.setAttribute('href', './index.html')
    location.replace('./index.html');
  } else {
    username.style.border = '2px solid #f00';
    password.style.border = '2px solid #f00';
    errorFunc('Username yoki password xato kiritildi.')
    setTimeout(() => {
      errorFunc('');
    }, 1500);
  }
})
username.addEventListener('input', () => {
  username.style.border = '';
})
password.addEventListener('input', () => {
  password.style.border = '';
})

function errorFunc(mess) {
  document.getElementById('errorMessage').innerHTML = mess;
}
registrLink.removeAttribute('href');