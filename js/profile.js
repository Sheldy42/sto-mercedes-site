const button = document.getElementById("sendReview");

if (button) {

    button.addEventListener("click", async function () {

        const text = document.getElementById("reviewText").value.trim();

        if (text === "") {

            alert("Введите текст отзыва.");

            return;

        }

        let username = "Гость";

        try {

            const bookingsResponse =
                await fetch("/api/bookings");

            const bookings =
                await bookingsResponse.json();

            if (bookings.length > 0) {

                username =
                    bookings[bookings.length - 1].fullname;

            }

        } catch (error) {

            console.error(error);

        }

        const review = {

            name: username,

            text: text

        };

        try {

            const response =
                await fetch("/api/reviews", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(review)

                });

            if (!response.ok) {

                throw new Error("Ошибка сервера");

            }

            alert("✅ Спасибо! Отзыв успешно отправлен.");

            document.getElementById("reviewText").value = "";

        } catch (error) {

            console.error(error);

            alert("❌ Не удалось отправить отзыв.");

        }

    });

}