$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.delete-button', deleteBook);
  $('#bookShelf').on('click', '.update-button', updateBook);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="update-button" data-id="${book.id}" data-isRead="${book.isRead}">I've read this!</button></td>
        <td><button class="delete-button" data-id="${book.id}">Delete</button></td>
      </tr>
    `);
  }
}

function deleteBook() {
  const bookIdToDelete = $(this).data('id');
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookIdToDelete}`
  }).then((response) => {
    console.log(response);
    refreshBooks();
  }).catch((err) => {
    console.error(err);
  })
};

function updateBook() {
  const bookIdRead = $(this).data('id');
  const currentIsRead = $(this).data('isRead');

  console.log('bookIdRead', bookIdRead);
  console.log('currentIsRead', currentIsRead);
  $.ajax({
    type: 'PUT',
    url: `/books/${bookIdRead}`,
    data: { currentIsRead: currentIsRead }
  }).then((res) => {
    refreshBooks();
  }).catch((err) => {
    console.error(err);
  })
}

