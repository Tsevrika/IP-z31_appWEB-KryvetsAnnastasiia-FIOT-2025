const STORAGE_KEY = 'shopping-cart';
const ITEMS_PER_PAGE = 5;

const nameInput = document.getElementById('product-name');
const qtyInput = document.getElementById('product-qty');
const addBtn = document.getElementById('add-btn');

const tableBody = document.getElementById('table-body');
const paginationContainer = document.getElementById('pagination');

const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalQty = document.getElementById('modal-qty');
const modalStatus = document.getElementById('modal-status');

let items = [];
let currentPage = 1;
let totalPages = 1;

function loadItems() {
    const saved = localStorage.getItem(STORAGE_KEY);
    items = saved ? JSON.parse(saved) : [];
}

function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderTable() {
    if (items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Список порожній</td></tr>';
        paginationContainer.innerHTML = '';
        return;
    }

    totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = items.slice(start, start + ITEMS_PER_PAGE);

    tableBody.innerHTML = pageItems.map((item, index) => `
        <tr data-id="${item.id}">
            <td>${start + index + 1}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>
                <button class="status-btn" data-action="toggle-status">
                    ${item.status}
                </button>
            </td>
            <td>
                <button class="delete-btn" data-action="delete">🗑 Видалити</button>
            </td>
        </tr>
    `).join('');

    renderPagination();
}

function renderPagination() {
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    paginationContainer.innerHTML = `
        <button data-action="prev" ${currentPage === 1 ? "disabled" : ""}>Попередня</button>
        <span>Сторінка ${currentPage} з ${totalPages}</span>
        <button data-action="next" ${currentPage === totalPages ? "disabled" : ""}>Наступна</button>
    `;
}

paginationContainer.addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === 'prev' && currentPage > 1) currentPage--;
    if (action === 'next' && currentPage < totalPages) currentPage++;
    renderTable();
});

addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const qty = parseInt(qtyInput.value.trim());

    if (!name || !qty || qty <= 0) {
        alert("Введіть коректні дані!");
        return;
    }

    items.push({
        id: Date.now(),
        name,
        qty,
        status: "Не куплено"
    });

    saveItems();
    currentPage = Math.ceil(items.length / ITEMS_PER_PAGE);
    renderTable();

    nameInput.value = "";
    qtyInput.value = "";
});

tableBody.addEventListener("click", e => {
    const row = e.target.closest("tr");
    if (!row) return;

    const id = Number(row.dataset.id);
    const action = e.target.dataset.action;

    if (action === "delete") {
        items = items.filter(item => item.id !== id);
        saveItems();
        renderTable();
        return;
    }

    if (action === "toggle-status") {
        const item = items.find(i => i.id === id);
        item.status = item.status === "Куплено" ? "Не куплено" : "Куплено";
        saveItems();
        renderTable();
        return;
    }
});

tableBody.addEventListener('dblclick', e => {
    const row = e.target.closest('tr');
    if (!row) return;

    const id = Number(row.dataset.id);
    const item = items.find(i => i.id === id);

    modalTitle.textContent = item.name;
    modalQty.textContent = item.qty;
    modalStatus.textContent = item.status;

    modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

loadItems();
renderTable();
