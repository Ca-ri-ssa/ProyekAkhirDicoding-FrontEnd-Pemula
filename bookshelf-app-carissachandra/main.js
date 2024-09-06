// Do your work here...
// {
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
// }

const books = [];
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    return typeof(Storage) !== 'undefined';
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if (data !== null) {
        books.push(...data);
    }
}

if (isStorageExist()) {
    loadDataFromStorage();
}

function generateBookId() {
    return +new Date();
}

function addNewBook(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.getElementById('bookForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = generateBookId();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const newBook = addNewBook(id, title, author, year, isComplete);
    books.push(newBook);
    saveData();
    renderBooks();
})

function renderBooks() {
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
}

function createBookElement(book) {
    const container = document.createElement('div');
    container.setAttribute('data-bookid', book.id);
    container.setAttribute('data-testid', 'bookItem');
    container.classList.add('bookList')

    const titleElement = document.createElement('h3');
    titleElement.setAttribute('data-testid', 'bookItemTitle');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.setAttribute('data-testid', 'bookItemAuthor');
    authorElement.textContent = `Penulis: ${book.author}`;

    const yearElement = document.createElement('p');
    yearElement.setAttribute('data-testid', 'bookItemYear');
    yearElement.textContent = `Tahun: ${book.year}`;

    const isCompleteButton = document.createElement('button');
    isCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    isCompleteButton.classList.add('btn-isComplete')
    isCompleteButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    isCompleteButton.addEventListener('click', function() {
        toggleBookCompletion(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.classList.add('btn-delete');
    deleteButton.textContent = 'Hapus Buku';
    deleteButton.addEventListener('click', function() {
        deleteBook(book.id);
    });

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.classList.add('btn-edit')
    editButton.textContent = 'Edit Buku';
    editButton.addEventListener('click', function() {
        editBook(book.id);
    });

    container.append(titleElement, authorElement, yearElement, isCompleteButton, deleteButton, editButton);
    return container;
}

function toggleBookCompletion(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        saveData();
        renderBooks();
    }
}

function deleteBook(bookId) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveData();
        renderBooks();
    }
}

document.getElementById('searchBook').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    
    // Render only filtered books
    renderFilteredBooks(filteredBooks);
});

function renderFilteredBooks(filteredBooks) {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (const book of filteredBooks) {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
            completeBookList.append(bookElement);
        } else {
            incompleteBookList.append(bookElement);
        }
    }
}

function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;
        
        // Remove the book and re-add it after editing
        deleteBook(bookId);
    }
}
