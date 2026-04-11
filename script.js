const API_URL = "https://openlibrary.org/search.json";

//fetching
async function fetchBooks(query) {
    const res = await fetch(`${API_URL}?q=${query}`);
    const data = await res.json();

    //Checks to see if array is empty
    if (!data.docs || data.docs.length === 0) {
    return [];
    }

    return data.docs.slice(0, 50);
}

async function searchBooks() {
    const input =
        document.getElementById("searchInput") ||
        document.getElementById("genreSearchInput");

    if (!input) return;

    const query = input.value.trim();
    if (!query) return;

    const books = await fetchBooks(query);

    if (books.length === 0) {
        displayNoResults(query);
        return;
    }

    displayBooks(books);
}

function displayBooks(books) {
    const container =
        document.getElementById("carouselContainer") ||
        document.getElementById("resultsContainer");

    container.innerHTML = "";

    books.forEach(book => {
        const card = createBookCard(book);
        container.appendChild(card);
    });
}

//Diplays no data was found for a specific search
function displayNoResults(query) {
    const container = 
        document.getElementById("carouselContainer") ||
        document.getElementById("resultsContainer");

    container.innerHTML = `
    <p>No results found for "<strong>${query}</strong>"</p>`;
}

//book cards
function createBookCard(book) {
    const div = document.createElement("div");
    div.className = "book-card";

    let coverUrl = "https://via.placeholder.com/150x200";
    if (book.cover_i) {
        coverUrl = "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
    }

    let author = "Unknown Author";
    if (book.author_name && book.author_name.length > 0) {
        author = book.author_name[0];
    }

    div.innerHTML = `
        <img src="${coverUrl}">
        
        <div class="book-info">
            <p><strong>${book.title}</strong></p>
            <p>${author}</p>
            <button onclick="removeBookmark('${book.key}')">Remove</button>
            <button onclick='bookmarkBook(${JSON.stringify(book)})'>Bookmark</button>
        </div>
    `;

    return div;
}

function scrollCarousel(direction) {
    const container = document.getElementById("carouselContainer");
    const scrollAmount = 300;

    container.scrollLeft += direction * scrollAmount;
}

//genre buttons
const genres = [
    "fantasy", "romance", "mystery",
    "science", "history", "horror",
    "fiction", "adventure"
];

function loadGenres() {
    const container = document.getElementById("genreList");
    if (!container) return;
    container.innerHTML = "";

    genres.forEach(genre => {
        const btn = document.createElement("button");
        btn.textContent = genre;
        btn.classList.add("genre-btn");
        btn.onclick = () => loadGenreBooks(genre);
        container.appendChild(btn);
    });
}

async function loadGenreBooks(genre) {
    const books = await fetchBooks(genre);
    displayBooks(books);
}

//clicking login button to open login popup
function openLogin(){

    document.getElementById("login-modal").style.display = "flex";
    
}

//cancelling login
function closeLogin(){

    document.getElementById("login-modal").style.display = "none";
}

//login form
function login(){
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    if (username ==="" || email === ""){
        alert("Please fill in all needed fields");
        return;
    }

    //https://www.w3schools.com/js/js_json_stringify.asp
    const user = {username, email};
    localStorage.setItem("user", JSON.stringify(user));

    closeLogin();
    updateNavbar();
}

//changing login button to username when logged in
function updateNavbar(){

    const nav = document.getElementById("nav-right");
    const user = JSON.parse(localStorage.getItem("user"));


    if (user){

        nav.innerHTML = `
            <div class="user-menu">
                <button>Hi, ${user.username}!</button>
                <div class="dropdown">
                    <button onclick="logout()">Logout</button>
                </div>
            </div>
        
        `;

    }
    else {
        nav.innerHTML = `
         <button id="loginBtn" onclick="openLogin()">Login</button>
        `;

    }

}

function logout(){
    
    localStorage.removeItem("user");
    updateNavbar();
}

//bookmarking
function bookmarkBook(book){
    
    const user = localStorage.getItem("user");

    if (!user) {
        alert("Please log in to use bookmarking!");
        return;
    }

   let bookmarks = [];

    try {
        const stored = localStorage.getItem("bookmarks");
        if (stored) {
            bookmarks = JSON.parse(stored);
        }
    } catch (e) {
        bookmarks = [];
    }

    const exists = bookmarks.find(b => b.key === book.key);
    if (exists){
        alert("Already in Bookmarks!");
        return;
    }

    bookmarks.push(book);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    alert("Bookmarked!");

}

function loadBookmarks(){

    const container = document.getElementById("bookmark-container");

    if (!container){
        return;
    }

    let bookmarks = [];

    try {

        const stored = localStorage.getItem("bookmarks");
        if (stored) {
            bookmarks = JSON.parse(stored);

        }
    
    }
    catch (e){
        bookmarks = [];
    }

    container.innerHTML = "";

    if (stored.length === 0) {
        container.innerHTML = "<p>No bookmarks yet</p>";
        return;
    }

    stored.forEach (book => {
        const card = createBookCard(book, true);
        container.appendChild(card);
    });
}




function removeBookmark(bookKey){
    let bookmarks = [];

    try{

        const stored = localStorage.getItem("bookmarks");

        if (stored){
            bookmarks = JSON.parse(stored);
        }
    }
    catch(e){
        bookmarks = [];
    }

    bookmarks = bookmarks.filter(book => book.key !== bookKey);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    loadBookmarks()


}

window.onload = () => {
    loadGenres();
    updateNavbar();
    fetchBooks("popular").then(displayBooks);
};