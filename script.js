const API_URL = "https://openlibrary.org/search.json";

//fetchign
async function fetchBooks(query) {
    const res = await fetch(`${API_URL}?q=${query}`);
    const data = await res.json();
    return data.docs.slice(0, 50);
}

async function searchBooks() {
    const input =
        document.getElementById("searchInput") ||
        document.getElementById("genreSearchInput");

    const query = input.value.trim();
    if (!query) return;

    const books = await fetchBooks(query);
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
            <button onclick="bookmarkBook('${book.key}')">Bookmark</button>
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

    genres.forEach(genre => {
        const btn = document.createElement("button");
        btn.textContent = genre;
        btn.onclick = () => loadGenreBooks(genre);
        container.appendChild(btn);
    });
}

async function loadGenreBooks(genre) {
    const books = await fetchBooks(genre);
    displayBooks(books);
}


window.onload = () => {
    loadGenres();
    fetchBooks("popular").then(displayBooks);
};