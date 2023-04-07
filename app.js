let allBooks = [];
const all__cards = document.getElementById('all__cards');
const bookmark_cards = document.querySelector('.bookmark_cards');
const loading = document.querySelector('.loading');
const pagination = document.querySelector('.pagination');
const searchInput = document.getElementById('searchInput');
const allBooksCount = document.getElementById('allBooksCount');
let url = new URLSearchParams(window.location.search);
let step = 6;
let page = url.get('page') || 1;

function getAllBooks() {
  loading.style.display = 'block';
  pagination.style.display = 'none';
  fetch('https://book-790d7-default-rtdb.firebaseio.com/books.json').then(res => {
      if (!res.ok) throw new Error('Xatolik bor');
      return res.json();
    })
    .then(res => {
      allBooks = Object.keys(res || {}).map(item => {
        return {
          ...res[item],
          id: item,
          ok: +Math.random().toFixed(4),
        }
      })
      renderPagination(allBooks.length);
      allBooksCount.innerHTML = `Showing ${choppedPagination(allBooks).length} Result(s)`;
      renderHtmlElements(choppedPagination(allBooks));
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {
      loading.style.display = 'none';
      pagination.style.display = 'flex';
    })
}
getAllBooks();



function renderHtmlElements(books) {
  let result = books.map((item, index) => {
    let d = new Date(item.published__date);

    let datestring = d.getFullYear();

    let element = `
    <div class="read-card">
          <div class="read-book__img">
            <img src="${item.img__url}" alt="">
          </div>
          <div class="read-desc">
            <h3>${item.title} </h3>
            <p>${item.author}</p>
            <span>${datestring}</span>
          </div>
          <div class="buttons-info">
            <button class="btn" id="bookmark__btn" onclick='bookmarkFunc(${item.ok})' >Bookmark</button>
            <button class="btn" id="more__btn">More Info</button>
          </div>
          <div class="read-btn">
            <button class="btn" id="read__btn">Read</button>
          </div>
        </div>
    `

    return element;
  }).join(' ');

  all__cards.innerHTML = result;

}
let bookmarkArr = JSON.parse(localStorage.getItem('bookmarkArr')) || [];
renderDeleteElement();
function bookmarkFunc(ok){
  let findedElement = allBooks.find(item => {
    return item.ok === ok;
  })
  if(!bookmarkArr.includes(findedElement)){
    bookmarkArr.push(findedElement);
    localStorage.setItem('bookmarkArr', JSON.stringify(bookmarkArr));
  }
  renderDeleteElement();
}

function renderDeleteElement(){
  let result = JSON.parse(localStorage.getItem('bookmarkArr')).map(item => {
    let element = `
    <div class="bookmark__card">
          <div class="book-order_title">
            <h3>${item.title}</h3>
            <p>${item.author}</p>
          </div>
          <div class="book-order_img">
            <ion-icon name="book-outline"></ion-icon>
            <img src="img/delete.png" alt="" onclick='deleteBookmarkItem(${item.ok})'>
          </div>
        </div>
    `
    return element;
  }).join(' ');

  bookmark_cards.innerHTML = result;
}

function deleteBookmarkItem(ok){
  bookmarkArr = bookmarkArr.filter(item => {
    return ok !== item.ok;
  })
  localStorage.setItem('bookmarkArr', JSON.stringify(bookmarkArr));
  renderDeleteElement();
}



let searchMoviesList = [];
searchInput.addEventListener("input", (e) => {
    searchMoviesList = allBooks.filter((item) => {
      let finded = new RegExp(e.target.value, "gi");
      return finded.test(item.title);
    })
    allBooksCount.innerHTML = `Showing ${searchMoviesList.length} Result(s)`;
    if(e.target.value === ''){
      getAllBooks();
    }else{
      renderSearchHtml();
    }
});

function renderSearchHtml() {
  let result = searchMoviesList.map((item, index) => {
    let d = new Date(item.published__date);

    let datestring = d.getFullYear();
    let element = `
    <div class="read-card">
          <div class="read-book__img">
            <img src="${item.img__url}" alt="">
          </div>
          <div class="read-desc">
            <h3>${item.title} </h3>
            <p>${item.author}</p>
            <span>${datestring}</span>
          </div>
          <div class="buttons-info">
            <button class="btn" id="bookmark__btn" onclick='bookmarkFunc(${item.ok})' >Bookmark</button>
            <button class="btn" id="more__btn">More Info</button>
          </div>
          <div class="read-btn">
            <button class="btn" id="read__btn">Read</button>
          </div>
        </div>
    `

    return element;
  }).join(' ');

  all__cards.innerHTML = result;

}


// Pagination



function renderPagination(length){
  let result = '';
  let pageNumber = Math.ceil(length / step);

  for(let i = 0; i < pageNumber; i++){
    result += `
    <span>${i + 1}</span>
    `;
  }
  document.querySelector('.pagination').innerHTML = result;
  for(let i = 0; i < Array.from(document.querySelectorAll('.pagination span')).length; i++){
    document.querySelectorAll('.pagination span').forEach(item => {
      item.classList.remove('page-active');
    })
    Array.from(document.querySelectorAll('.pagination span'))[page - 1].classList.add('page-active');
  }
 

  document.querySelectorAll('.pagination span').forEach(item => {
    item.addEventListener('click', (e) => {
      page = +e.target.innerHTML;
      searchElements(page);
      getAllBooks();
    })
  })
}


function choppedPagination(books){
  let start = page * step - step;
  let end = start + step;
  return books.slice(start, end);
}


function searchElements(searchValue){
  let url = new URL(window.location.href);
  let query = new URLSearchParams();
  query.append('page', searchValue);
  const urlSearchQuery = query.toString();
  url.search = urlSearchQuery;
  window.history.pushState(null, "", url.toString());
}

document.getElementById('all-book_btn').addEventListener('click', () => {
  if(document.getElementById('all-book_btn').innerHTML == 'See all books'){
    document.getElementById('all-book_btn').innerHTML = 'See books with pagination'
    step = allBooks.length;
    renderHtmlElements(allBooks);
    renderPagination(allBooks.length);
    allBooksCount.innerHTML = `Showing ${choppedPagination(allBooks).length} Result(s)`;
  }else if(document.getElementById('all-book_btn').innerHTML == 'See books with pagination'){
      document.getElementById('all-book_btn').innerHTML = 'See all books'
      step = 6;
      renderHtmlElements(choppedPagination(allBooks));
      renderPagination(allBooks.length);
      allBooksCount.innerHTML = `Showing ${choppedPagination(allBooks).length} Result(s)`;
  }
})