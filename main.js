const addBtn = document.getElementById('addBtn');
const modalForm = document.getElementById('modalForm');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const close = document.getElementById('close');
const title = document.getElementById('title');
const author = document.getElementById('author');
const category = document.getElementById('category');
const cost = document.getElementById('cost');
const published__date = document.getElementById('published__date');
const rate = document.getElementById('rate');
const img__url = document.getElementById('img__url');
const loaderBnts = document.getElementById('loaderBnts');
const booksList = document.getElementById('booksList');
const deleteBtn = document.getElementById('deleteBtn');
const edit__delete = document.getElementById('edit__delete');
const small__img = document.querySelector('#small__img img');
const smallImg = document.querySelector('#small__img');
const adminPageToLogout = document.querySelector('.logout');
const loading = document.querySelector('.loading');
const pagesLists = document.getElementById('pagesLists');
let allBooks = [];
let globalImageUrl;

let url = new URLSearchParams(window.location.search);

let step = 2;
let page = url.get('page') || 1;

addBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
})
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addNewBook();
});
window.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('key');
})

function addNewBook() {
  uploadImages(globalImageUrl).then(res => {

    let saveObj = {
      title: title.value,
      author: author.value,
      category: category.value,
      cost: cost.value,
      published__date: published__date.value,
      publisher: publisher.value,
      rate: rate.value,
      img__url: res
    }

    let errorInputs = Object.keys(saveObj).filter(item => !saveObj[item]);

    if (errorInputs.length) {
      errorInputs.forEach((item) => {
        document.querySelector(`#${item}`).classList.add('error__input');
        return;
      })
    }

    if (Object.values(saveObj).every((item) => item)) {
      fetch('https://book-790d7-default-rtdb.firebaseio.com/books.json', {
          method: 'POST',
          body: JSON.stringify(saveObj),
        }).then(res => {
          if (!res.ok) throw new Error('Xatolik bor')
          return res.json();
        })
        .then(res => {
          modalForm.reset();
          getAllBooks();
        }).catch(err => {
          console.log(err.message);
        }).finally(() => {
          showBtnLoader(false);
          small__img.setAttribute('src', '');
          smallImg.classList.remove('removePlus');
          modal.style.display = 'none';
        })
      showBtnLoader(true);
    }
  })
}

function getAllBooks() {
  loading.style.display = 'block';
  fetch('https://book-790d7-default-rtdb.firebaseio.com/books.json').then(res => {
      if (!res.ok) throw new Error('Xatolik bor')
      return res.json();
    })
    .then(res => {
      allBooks = Object.keys(res || {}).map(item => {
        return {
          ...res[item],
          id: item,
          ok: +Math.random().toFixed(4)
        }
      })
      renderPagination(allBooks.length);
      console.log(allBooks);
      renderHtmlElements(choppedPagination(allBooks));
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {
      loading.style.display = 'none';
    })
}


function renderHtmlElements(books) {
  let result = books.map((item, index) => {
    let d = new Date(item.published__date);

    let datestring = (d.getDate() <= 9 ? ('0' + d.getDate()) :
        (d.getDate())) +
      "." +
      ((d.getMonth() + 1) <= 9 ? ('0' + ((d.getMonth() + 1))) : (d.getMonth() + 1)) +
      "." +
      d.getFullYear() +
      ", " +
      (d.getHours() <= 9 ? ('0' + d.getHours()) : d.getHours()) +
      ":" +
      (d.getMinutes() <= 9 ? ('0' + d.getMinutes()) : d.getMinutes());

    let starElements = '';
    for (let i = 0; i < item.rate; i++) {
      if (i < 5) {
        starElements += `<img src="img/star.svg" alt="">`
      }
    }
    let element = `
    <div class="book__item">
            <div class="book__img">
              <img src="${item.img__url}" alt="">
            </div>
            <div class="book__desc">
              <h4>${item.title} </h4>
              <p class="book__author">by &nbsp  <span>${item.author}</span> , ${item.publisher}</p>
              <p class="book__date">${datestring}</p>
              <div class="book__rating">
              ${starElements}
              </div>
              <div class="cost">
                <p><span>Cost:</span> ${item.cost.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm</p>
              </div>
            </div>
            <div class="edit__delete-btns" id="edit__delete">
              <button class="btn edit-btn">edit</button>
              <button type="button" class="button btn delete-btn" id="deleteBtn" onclick='deleteBook(${item.ok})'>
                <span class="button__text">delete</span>
              </button>
            </div>
          </div>
    `

    return element;
  }).join(' ');
  booksList.innerHTML = result;

}

getAllBooks();
Array.from(modalForm).forEach(item => {
  if (item.id) {
    item.addEventListener('change', (e) => {
      if (e.target.value) e.target.classList.remove('error__input');
    })
  }
})

modal.addEventListener('click', (e) => {
  if (e.target === close) {
    modal.style.display = 'none';
  }
})

function showBtnLoader(show) {
  if (show) {
    document.querySelector('#loaderBnts button').classList.add('button__loading');
  } else {
    document.querySelector('#loaderBnts button').classList.remove('button__loading');
  }
}

booksList.addEventListener('click', (e) => {
  if (Array.from(e.target.classList).includes('delete-btn')) {
    e.target.classList.add('button__loading')
  } else if (Array.from(e.target.classList).includes('button__text'))
    e.target.parentNode.classList.add('button__loading');
})

function deleteBook(ok) {
  let findedElement = allBooks.find((item, index) => {
    return item.ok === ok;
  })
  fetch(`https://book-790d7-default-rtdb.firebaseio.com/books/${findedElement.id}.json`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error('Xatolik bor')
      return res.json();
    })
    .then(res => {
      console.log("Malumot ochdi", res);
      getAllBooks();
    }).catch(err => {
      console.log(err.message);
    }).finally(() => {})

}

function postImage(e) {
  globalImageUrl = e.target.files;
  // const formData = new FormData();
  // formData.append('formFile', e.target.files);
  // for(let i of formData.entries()){
  //   console.log(i[0], i[1]);
  // }
  // Promise.all([...e.target.files].map(item => {

  //   formData.append('formFile', item);

  //   return (
  //     // axios.post('https://api.oqot.uz/api/1.0/file/upload', formData)
  //     fetch('https://api.oqot.uz/api/1.0/file/upload', {
  //       method: 'POST',
  //       headers: {
  //         // 'Content-Type': 'multipart/form-data',
  //       },
  //       body: formData,
  //     }).then(res => res.json())
  //   )
  // })).then(res => {

  //   globalImageUrl = res.map(item => {
  //     return `https://api.oqot.uz/api/1.0/file/download/${item}`
  //   }).join(' ');
  //   smallImg.classList.add('removePlus')
  // })

  //   axios.post('https://api.oqot.uz/api/1.0/file/upload', formData).then(res => {
  //   console.log(res);
  // })

  // fetch('https://api.oqot.uz/api/1.0/file/upload', {
  //   method: 'POST', 
  //   headers: {
  //     // 'Content-Type': 'multipart/form-data',
  //   },
  //   body: formData,
  // }).then(res => res.json())
  // .then(res => {
  //   console.log(res);
  // })
}

function uploadImages(files) {
  const formData = new FormData();

  let promise = new Promise((resolve, reject) => {
    Promise.all([...files].map(item => {

      formData.append('formFile', item);

      return (
        // axios.post('https://api.oqot.uz/api/1.0/file/upload', formData)
        fetch('https://api.oqot.uz/api/1.0/file/upload', {
          method: 'POST',
          headers: {
            // 'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }).then(res => res.json())
      )
    })).then(res => {
      resolve(
        res.map(item => {
          return `https://api.oqot.uz/api/1.0/file/download/${item}`
        }).join(' ')
      )
      smallImg.classList.add('removePlus');
    })
  })

  return promise;

}

document.querySelector(`#img__url`).addEventListener('change', showPostImage);

function showPostImage(e) {
  const file = e.target.files[0];
  small__img.setAttribute('src', URL.createObjectURL(file));
}

document.querySelector(`#img__url`).addEventListener('change', postImage);

adminPageToLogout.addEventListener('click', () => {
  location.replace('./about.html');
})
// fetch('https://book-790d7-default-rtdb.firebaseio.com/');
// Pagination


function renderPagination(length){
  let result = '';
  let pageNumber = Math.ceil(length / step);
  localStorage.setItem('key', JSON.stringify(page));
  localStorage.setItem('page', JSON.stringify('page-active'));

  for(let i = 0; i < pageNumber; i++){
    result += `
      <li class="page__list">
        <button class="page-btn">${i + 1}</button>
      </li>
    `;
  }
  pagesLists.innerHTML = result;
  for(let i = 0; i < Array.from(document.querySelectorAll('.page-btn')).length; i++){
    document.querySelectorAll('.page-btn').forEach(item => {
      item.classList.remove('page-active');
    })
    Array.from(document.querySelectorAll('.page-btn'))[page - 1]?.classList.add('page-active');
  }
 

  document.querySelectorAll('.page-btn').forEach(item => {
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




