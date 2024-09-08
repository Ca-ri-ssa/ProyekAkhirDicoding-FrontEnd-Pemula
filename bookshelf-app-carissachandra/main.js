// Do your work here...
// {
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
// }

const books = [];
const STORAGE_KEY = 'BOOKSHELF_APP_KEY';
const RENDER_BOOKSHELF = 'RENDER_EVENT';
const SAVED_EVENT = 'SAVED_EVENT';

document.addEventListener('DOMContentLoaded', function() {
    const submitBookForm = document.getElementById('bookForm');
    submitBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

function generateBookId() {
    return +new Date();
}

function newBook(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function addBook() {
    const bookId = generateBookId();
    const bookTitle = document.getElementById('bookFormTitle').value;
    const bookAuthor = document.getElementById('bookFormAuthor').value;
    const bookYear = Number(document.getElementById('bookFormYear').value);
    const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

    const bookObject = newBook(bookId, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_BOOKSHELF));
    saveData();
    showToast(`"${bookTitle}" telah ditambah`);
}

document.addEventListener(RENDER_BOOKSHELF, function() {
    // console.log("RENDER_BOOKSHELF triggered!")
    // console.log(books);

    const isCompleteBooks = document.getElementById('completeBookList');
    const inCompleteBooks = document.getElementById('incompleteBookList');

    inCompleteBooks.innerHTML = '';
    isCompleteBooks.innerHTML = '';

    for (const book of books) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            isCompleteBooks.append(bookElement);
        } else {
            inCompleteBooks.append(bookElement);
        }
    }
})

function createBookElement(bookObject) {
    const container = document.createElement('div');
    container.setAttribute('data-bookid', bookObject.id);
    container.setAttribute('data-testid', 'bookItem');
    container.classList.add('bookList');

    const titleElement = document.createElement('h3');
    titleElement.setAttribute('data-testid', 'bookItemTitle');
    titleElement.textContent = bookObject.title;

    const authorElement = document.createElement('p');
    authorElement.setAttribute('data-testid', 'bookItemAuthor');
    authorElement.textContent = bookObject.author;

    const yearElement = document.createElement('p');
    yearElement.setAttribute('data-testid', 'bookItemYear');
    yearElement.textContent = bookObject.year;

    const isCompleteButton = document.createElement('button');
    isCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    isCompleteButton.classList.add('btn-isComplete');
    isCompleteButton.textContent = bookObject.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    isCompleteButton.addEventListener('click', function() {
        toggleBookCompletion(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.classList.add('btn-delete');
    deleteButton.textContent = 'Hapus Buku';
    deleteButton.addEventListener('click', function() {
        deleteBook(bookObject.id);
    });

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.classList.add('btn-edit');
    editButton.textContent = 'Edit Buku';
    editButton.addEventListener('click', function() {
        editBook(bookObject.id);
    });

    container.append(titleElement, authorElement, yearElement, isCompleteButton, deleteButton, editButton);
    return container;
}

function toggleBookCompletion(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        document.dispatchEvent(new Event(RENDER_BOOKSHELF));
    }
}

function deleteBook(bookId) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        const deletedBook = books[bookIndex];
        const bookTitle = deletedBook.title;

        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event(RENDER_BOOKSHELF));
        saveData();
        showToast(`"${bookTitle}" telah berhasil dihapus`);
    }
}

function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;

        saveData();
        deleteBook(bookId);
        showToast(`Buku berhasil diperbarui`);
    }
}

document.getElementById('searchBook').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    
    searchFilteredBooks(filteredBooks);
});

function searchFilteredBooks(filteredBooks) {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (const book of filteredBooks) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.append(bookElement);
        } else {
            incompleteBookList.append(bookElement);
        }
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert(`Your browser doesn't support local storage`);
      return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_BOOKSHELF));
}

function showToast(msg) {
    var toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.className = "show";

    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}