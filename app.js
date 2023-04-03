let allBooks = [];
const all__cards = document.getElementById('all__cards');
const bookmark_cards = document.querySelector('.bookmark_cards');
const loading = document.querySelector('.loading');
const pagination = document.querySelector('.pagination');
const searchInput = document.getElementById('searchInput');
const allBooksCount = document.getElementById('allBooksCount');

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

      allBooksCount.innerHTML = `Showing ${allBooks.length} Result(s)`;
      renderHtmlElements();
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {
      loading.style.display = 'none';
      pagination.style.display = 'flex';
    })
}
getAllBooks();

function renderHtmlElements() {
  let result = allBooks.map((item, index) => {
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
let bookmarkArr = [];
renderDeleteElement();
function bookmarkFunc(ok){
  let findedElement = allBooks.find(item => {
    return item.ok === ok;
  })
  if(!bookmarkArr.includes(findedElement)){
    bookmarkArr.push(findedElement);
  }
  renderDeleteElement();
}
function renderDeleteElement(){
  let result = bookmarkArr.map(item => {
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
  renderDeleteElement();
}



let searchMoviesList = [];
searchInput.addEventListener("input", (e) => {
    searchMoviesList = allBooks.filter((item) => {
      let finded = new RegExp(e.target.value, "gi");
      return finded.test(item.title);
    })
    allBooksCount.innerHTML = `Showing ${searchMoviesList.length} Result(s)`;
    renderSearchHtml();
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