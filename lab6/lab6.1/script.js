const table = document.querySelector("table");

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");

const modalTitle = document.getElementById("modal-title");
const modalQty = document.getElementById("modal-qty");
const modalStatus = document.getElementById("modal-status");

table.addEventListener("click", function (e) {
    const row = e.target.closest("tr");

    if (!row || row.querySelector("th")) return;

    const cells = row.querySelectorAll("td");

    modalTitle.textContent = cells[1].textContent;
    modalQty.textContent = cells[2].textContent;
    modalStatus.textContent = cells[3].textContent;

    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});
