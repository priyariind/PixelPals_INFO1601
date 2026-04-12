//Gets book data and comments from url when on comments page ONLY
const params = new URLSearchParams(window.location.search);

const book = params.get("book")
    ? JSON.parse(decodeURIComponent(params.get("book")))
    : null;

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
            <button onclick="removeBookmark('${book.key}')" class = "card-btn">Remove</button>
            <button onclick='bookmarkBook(${JSON.stringify(book)})' class = "card-btn">Bookmark</button>
            </div>
    `;

    const commentBtn = document.createElement("button");
    commentBtn.textContent = "Comments";
    commentBtn.className = "card-btn";

    commentBtn.addEventListener("click", () => {
        openComments(book);
    });

    div.querySelector(".book-info").appendChild(commentBtn);

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

function requireLogin() {
    const user = localStorage.getItem("user");

    if (!user) {
        openLogin();
        return false;
    }

    return true;
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
                <h2>Hi, ${user.username}!</h2>
                <button onclick="logout()" id="loginBtn" >Logout</button>
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
        openLogin();
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

    if (bookmarks.length === 0) {
        container.innerHTML = "<p>No bookmarks yet</p>";
        return;
    }

    bookmarks.forEach(book => {
        const card = createBookmarkCard(book);
        container.appendChild(card);
    });
}

function createBookmarkCard(book) {
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
            <button onclick="removeBookmark('${book.key}')" class = "bookmark-btn">Remove</button>
            <button onclick='bookmarkBook(${JSON.stringify(book)})' class = "bookmark-btn">Bookmark</button>
        </div>
    `;

    return div;
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

//Opens comments page
function openComments(book) {
    const url =
        "comments.html?book=" + encodeURIComponent(JSON.stringify(book));

    if (!requireLogin()) {
        return; // stop if not logged in
    }


    window.location.href = url;
}

//loads book information when on comments page
function loadBookInfo() {
    document.getElementById("bookTitle").textContent = book.title;

    document.getElementById("bookAuthor").textContent =
        book.author_name?.[0] || "Unknown Author";

    const cover = document.getElementById("bookCover");

    if (book.cover_i) {
        cover.src =
            "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
    } else {
        cover.src = "https://via.placeholder.com/150x200";
    }

}

function loadComments(bookKey) {
    const table = document.getElementById("commentsTable");

    let comments = JSON.parse(localStorage.getItem(bookKey)) || [];

    table.innerHTML = "";

    if (comments.length === 0) {
        table.innerHTML = `
            <tr>
                <td>No comments yet</td>
            </tr>
        `;
        return;
    }

    comments.forEach(comment => {
        const row = document.createElement("tr");
        row.classList.add("comment-row");

        const cell = document.createElement("td");

        cell.innerHTML = `
            <strong>${comment.username}:</strong> ${comment.text}
        `;

        row.appendChild(cell);
        table.appendChild(row);
    });
}


// add comment
function addComment() {
    const input = document.getElementById("commentInput");
    const text = input.value.trim();

    if (text === "") return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please log in to comment!");
        return;
    }

    const commentObj = {
        username: user.username,
        text: text   // ONLY raw message
    };

    let comments = JSON.parse(localStorage.getItem(book.key)) || [];

    comments.push(commentObj);

    localStorage.setItem(book.key, JSON.stringify(comments));

    input.value = "";
    loadComments(book.key);
}

//returns to html page from comments page
function goBack() {
    window.location.href = "index.html";
}

if (document.getElementById("bookmark-container")) {
    loadBookmarks();
}

window.onload = () => {
    updateNavbar();

    if (window.location.pathname.includes("comments.html") && book) {
        loadComments(book.key);
        loadBookInfo && loadBookInfo(); // if you have it
    } else {
        loadGenres();
        fetchBooks("popular").then(displayBooks);
    }
};
