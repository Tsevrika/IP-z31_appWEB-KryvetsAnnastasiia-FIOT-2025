import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector("#loader");

let lightbox = null; // ← додано

function initLightbox() {
  // Якщо вже створений — просто оновити
  if (lightbox) {
    lightbox.refresh();
    return;
  }

  // Створити новий екземпляр
  if (window.SimpleLightbox) {
    lightbox = new window.SimpleLightbox(".gallery a", {
      captionsData: "alt",
      captionDelay: 250,
    });
  }
}

const API_KEY = "53639025-767715e0d8cc50d9379a86b4a";
const BASE_URL = "https://pixabay.com/api/";

form.addEventListener("submit", onSearch);

function onSearch(e) {
  e.preventDefault();

  const query = e.target.query.value.trim();
  if (!query) {
    iziToast.warning({
      message: "Please enter a search query!",
      position: "topRight",
    });
    return;
  }

  gallery.innerHTML = "";
  showLoader();

  fetchImages(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message: "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      const markup = createMarkup(data.hits);
      gallery.insertAdjacentHTML("beforeend", markup);

      // Запускаємо SimpleLightbox
      initLightbox();
    })
    .catch(() => {
      iziToast.error({
        message: "Error fetching images. Try again later.",
        position: "topRight",
      });
    })
    .finally(() => {
      hideLoader();
      form.reset();
    });
}

function fetchImages(query) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(url).then(response => {
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  });
}

function createMarkup(images) {
  return images
    .map(
      img => `
<li class="photo-card">
  <a href="${img.largeImageURL}">
    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p><b>Likes:</b> ${img.likes}</p>
    <p><b>Views:</b> ${img.views}</p>
    <p><b>Comments:</b> ${img.comments}</p>
    <p><b>Downloads:</b> ${img.downloads}</p>
  </div>
</li>`
    )
    .join("");
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}
