const registrForm = document.getElementById('registrForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const registrLink = document.querySelector('#registrBtn a');

registrForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (username.value === 'Sohibjon' && password.value === '7777') {
    // registrLink.setAttribute('href', './index.html')
    let data = {
      username: username.value,
      password: password.value
    }
    console.log(data);
    localStorage.setItem('key', JSON.stringify(data));
    if(JSON.parse(localStorage.getItem('key'))){
      location.replace('./index.html');
    }
  } else {
    username.style.border = '2px solid #f00';
    password.style.border = '2px solid #f00';
    toastFunc('Username or password error');
    setTimeout(() => {
      document.getElementById('toast').innerHTML = '';
      document.getElementById('toast').classList.remove('active');
    }, 2000)
    errorFunc('Username yoki password xato kiritildi.')
    setTimeout(() => {
      errorFunc('');
    }, 2000);
  }


})

if(JSON.parse(localStorage.getItem('key'))){
  location.replace('./index.html');
}
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

function toastFunc(err){
  document.getElementById('toast').innerHTML = err;
  document.getElementById('toast').classList.add('active');
}