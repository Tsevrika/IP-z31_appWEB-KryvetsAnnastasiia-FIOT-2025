const images = [
    {
        preview: "images/photo1.jpg",
        original: "images/photo1.jpg",
        description: "Фото 1",
    },
    {
        preview: "images/photo2.jpg",
        original: "images/photo2.jpg",
        description: "Фото 2",
    },
    {
        preview: "images/photo3.jpg",
        original: "images/photo3.jpg",
        description: "Фото 3",
    }
];

const galleryList = document.querySelector(".gallery");

galleryList.innerHTML = images
    .map(({ preview, original, description }) => `
        <li class="gallery-item">
            <img 
                class="gallery-image"
                src="${preview}"
                data-source="${original}"
                alt="${description}"
            />
        </li>
    `)
    .join("");

galleryList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("gallery-image")) return;

    const largeImageURL = event.target.dataset.source;

    const instance = basicLightbox.create(`
        <img src="${largeImageURL}" width="900" alt="${event.target.alt}">
    `);

    instance.show();
});
