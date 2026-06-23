const phoneInput = document.getElementById("phone");

if (phoneInput) {

    phoneInput.addEventListener("input", function () {

        // Оставляем только цифры
        let numbers = this.value.replace(/\D/g, "");

        // Если пользователь начал с 8 или 7 — убираем её
        if (numbers.startsWith("8") || numbers.startsWith("7")) {
            numbers = numbers.substring(1);
        }

        // Максимум 10 цифр после +7
        numbers = numbers.substring(0, 10);

        let result = "+7";

        if (numbers.length > 0) {
            result += " (" + numbers.substring(0, 3);
        }

        if (numbers.length >= 3) {
            result += ")";
        }

        if (numbers.length > 3) {
            result += " " + numbers.substring(3, 6);
        }

        if (numbers.length > 6) {
            result += "-" + numbers.substring(6, 8);
        }

        if (numbers.length > 8) {
            result += "-" + numbers.substring(8, 10);
        }

        this.value = result;

    });

}

const form = document.getElementById("bookingForm");

const dateInput = document.getElementById("date");

if (dateInput) {

    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${yyyy}-${mm}-${dd}`;

}

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullname = document.getElementById("fullname").value;
        const phone = document.getElementById("phone").value;
        const service = document.getElementById("service").value;
        const date = document.getElementById("date").value;
        const comment = document.getElementById("comment").value;

        const now = new Date();

        const createdAt =
            `${String(now.getDate()).padStart(2, "0")}.` +
            `${String(now.getMonth() + 1).padStart(2, "0")}.` +
            `${now.getFullYear()} ` +
            `${String(now.getHours()).padStart(2, "0")}:` +
            `${String(now.getMinutes()).padStart(2, "0")}`;

        const booking = {
            
            id: Date.now(),

            fullname,
            phone,
            service,
            date,
            comment,
            createdAt: createdAt,
            status: "Новая"
        };

        try {

        const response = await fetch("/api/bookings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(booking)

        });

        if (!response.ok) {

            throw new Error("Ошибка сервера");

        }

        alert("✅ Заявка успешно отправлена!");

        form.reset();

    } catch (error) {

        alert("❌ Ошибка при отправке заявки");

        console.error(error);

    }

    });

}