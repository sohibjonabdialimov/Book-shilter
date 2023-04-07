// const loginBnt = document.querySelector('#login');

// loginBnt.addEventListener('click', () => {

// })

function debounce(func, wait){
  let timeout;

  return function(){
    let context = this;
    let args = arguments;
    
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  }
}

function searchElements(searchValue){
  console.log(searchValue);
  let url = new URL(window.location.href);
  let query = new URLSearchParams();
  query.append('search', searchValue);
  const urlSearchQuery = query.toString();
  
  console.log(urlSearchQuery);

  url.search = urlSearchQuery;
  window.history.pushState(null, "", url.toString());

}

let debounceChild = debounce(searchElements, 1000);


document.querySelector('input').addEventListener('input', (e) => {
  debounceChild(e.target.value);
})
