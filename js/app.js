// Book Constructor
function Book (title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI constructor
function UI (){}


// Add Book To List Method
UI.prototype.addBookToList = function(book) {
  const table = document.getElementById('book-list');
  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>`

  table.appendChild(row);
}


// Show Alert Method
UI.prototype.showAlert = function(message, className) {
  // Create Div
  const div = document.createElement('div');
  // Add Classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get a Parent
  const container = document.querySelector('.container');
  // Get a  Form
  const form = document.querySelector('#book-form');
  // Insert div
  container.insertBefore(div, form);
  // Timeout
  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000);
}


// deleteBook method
UI.prototype.deleteBook = function(target) {
  if(target.className === 'delete') {
    target.parentElement.parentElement.remove();

    const ui = new UI();
    ui.showAlert('Book has been removed', 'error');
  }
}



// Clear Fielts Method
UI.prototype.clearFields = function() {
  document.getElementById('title').value ='';
  document.getElementById('author').value ='';
  document.getElementById('ISBN').value ='';
}

function Storage (){}

Storage.prototype.getFromLocalStorage = function() {
  let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
}

Storage.prototype.displayBooks = function() {
  const storage = new Storage();
  const books = storage.getFromLocalStorage();


  books.forEach(function(book){
    const ui = new UI;

    ui.addBookToList(book);
  });
}

Storage.prototype.saveToLocalStorage = function(book) {
  const storage = new Storage();
  const books = storage.getFromLocalStorage();

  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));
}

Storage.prototype.deleteFromLocalStorage = function(isbn) {
  const storage = new Storage();
  const books = storage.getFromLocalStorage();

  books.forEach(function(book, index){
    if(book.isbn === isbn) {
      books.splice(index, 1);
    }
  })

  localStorage.setItem('books', JSON.stringify(books));

}

// Add Event Listener For displayBooks From Local Storage
document.addEventListener('DOMContentLoaded', function() {

  const storage = new Storage();
  storage.displayBooks();
} )


// Add Event Listener for addBook
document.getElementById('book-form').addEventListener('submit', 
function(e){
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('ISBN').value;

  // Instantiate book
  const book = new Book(title, author, isbn);
  
  // Instantiate ui
  const ui = new UI();

  const storage = new Storage();

  // Validate
  if(title === '' || author === '' || isbn === ''){
    ui.showAlert('Please fulfill all fields', 'error')
  } else {
    // Add Book To List
    ui.addBookToList(book);

    // Save To Local Storage
    storage.saveToLocalStorage(book);

    // Success
    ui.showAlert('Book added to the list', 'success');

    // Clear Fields
    ui.clearFields();
  }

  e.preventDefault();
})

// Add event listener for deleteBook
document.getElementById('book-list').addEventListener('click', function(e){
  
   // Instantiate ui
   const ui = new UI();
   const storage = new Storage();

   ui.deleteBook(e.target); 
   storage.deleteFromLocalStorage(e.target.parentElement.previousElementSibling.textContent);

  e.preventDefault();
})

