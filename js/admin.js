let bookings = [];

async function loadBookings() {

    const response = await fetch("/api/bookings");

    bookings = await response.json();

    const search =
    document.getElementById("searchInput")?.value.toLowerCase() || "";

    const statusFilter =
    document.getElementById("statusFilter")?.value || "Все";

    const order = {
        "Новая": 0,
        "В работе": 1,
        "Выполнена": 2
    };

    bookings.sort((a, b) => {

        if (order[a.status] !== order[b.status]) {
            return order[a.status] - order[b.status];
        }

        return new Date(a.date) - new Date(b.date);

    });

    const filteredBookings = bookings.filter(booking => {

        const matchSearch =
            booking.fullname.toLowerCase().includes(search) ||
            booking.phone.includes(search) ||
            booking.service.toLowerCase().includes(search);

        const matchStatus =
            statusFilter === "Все" ||
            booking.status === statusFilter;

        return matchSearch && matchStatus;

    });

    const table = document.getElementById("applicationsTable");

    table.innerHTML = "";

    filteredBookings.forEach((booking) => {

        const dateParts = booking.date.split("-");

        const russianDate =
            `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        let statusColor = "";

        if (booking.status === "Новая") statusColor = "red";
        if (booking.status === "В работе") statusColor = "orange";
        if (booking.status === "Выполнена") statusColor = "green";

        table.innerHTML += `
        <tr>
            <td>${booking.fullname}</td>
            <td>${booking.phone}</td>
            <td>${booking.service}</td>
            <td>${russianDate}</td>
            <td>${booking.createdAt}</td>

            <td>
                ${
                    booking.comment && booking.comment.trim() !== ""
                    ?
                    `<button class="comment-btn" onclick="showComment(${booking.id})">
                        💬 Просмотреть
                    </button>`
                    :
                    "-"
                }
            </td>

            <td style="font-weight:bold; color:${statusColor}">
                ${booking.status}
            </td>

            <td>
                ${
                    booking.status !== "Выполнена"
                    ?
                    `<select onchange="changeStatus(${booking.id}, this.value)">
                        <option value="Новая" ${booking.status === "Новая" ? "selected" : ""}>Новая</option>
                        <option value="В работе" ${booking.status === "В работе" ? "selected" : ""}>В работе</option>
                        <option value="Выполнена" ${booking.status === "Выполнена" ? "selected" : ""}>Выполнена</option>
                    </select>`
                    :
                    `<button onclick="deleteBooking(${booking.id})">
                        🗑 Удалить
                    </button>`
                }
            </td>
        </tr>
        `;
    });

    updateStats();

}

async function changeStatus(id, status){

    await fetch(`/api/bookings/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status: status
        })

    });

    showToast("✅ Статус заявки изменён");

    loadBookings();

}

function updateStats(){

    document.getElementById("newBookings").textContent =
        bookings.filter(b => b.status === "Новая").length;

    document.getElementById("doneBookings").textContent =
        bookings.filter(b => b.status === "Выполнена").length;

}

function showToast(text){

    const toast = document.getElementById("toast");

    toast.textContent = text;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}

async function deleteBooking(id){

    if (!confirm("Удалить заявку?")) {
        return;
    }

    await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
    });

    loadBookings();

}

async function loadReviews(){

    const response =
        await fetch("/api/reviews");

    const reviews =
        await response.json();

    const container =
        document.getElementById("reviewsContainer");

    container.innerHTML = "";

    reviews.forEach(review => {

        container.innerHTML += `
            <div class="review-card">
                <h3>${review.name}</h3>
                <p>${review.text}</p>
            </div>
        `;

    });

    document.getElementById("reviewsCount").textContent =
        reviews.length;

}

function showComment(id){

    const booking = bookings.find(b => b.id === id);

    if(!booking) return;

    document.getElementById("modalClientName").textContent =
        booking.fullname;

    document.getElementById("modalComment").textContent =
        booking.comment;

    document.getElementById("commentModal").style.display = "block";

}

function closeComment(){

    document.getElementById("commentModal").style.display = "none";

}

window.onclick = function(event){

    const modal = document.getElementById("commentModal");

    if(event.target === modal){

        modal.style.display = "none";

    }

}

loadBookings();

loadReviews();