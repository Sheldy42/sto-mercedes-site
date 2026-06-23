const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const bookingsFile =
    path.join(__dirname, "data", "bookings.json");

const reviewsFile =
    path.join(__dirname, "data", "reviews.json");

function readJSON(file) {

    if (!fs.existsSync(file)) {
        return [];
    }

    return JSON.parse(
        fs.readFileSync(file, "utf8")
    );

}

function writeJSON(file, data) {

    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2)
    );

}

/* ===========================
   ЗАЯВКИ
=========================== */

// Получить все заявки
app.get("/api/bookings", (req, res) => {

    res.json(readJSON(bookingsFile));

});

// Добавить заявку
app.post("/api/bookings", (req, res) => {

    const bookings = readJSON(bookingsFile);

    const booking = {
        ...req.body,
        id: Date.now()
    };

    bookings.push(booking);

    writeJSON(bookingsFile, bookings);

    res.json({
        success: true
    });

});

// Обновить статус
app.put("/api/bookings/:id", (req, res) => {

    const bookings = readJSON(bookingsFile);

    const booking =
        bookings.find(
            b => b.id == req.params.id
        );

    if (!booking) {

        return res
            .status(404)
            .json({
                error: "Not found"
            });

    }

    booking.status = req.body.status;

    writeJSON(bookingsFile, bookings);

    res.json({
        success: true
    });

});

// Удалить заявку
app.delete("/api/bookings/:id", (req, res) => {

    let bookings = readJSON(bookingsFile);

    bookings =
        bookings.filter(
            b => b.id != req.params.id
        );

    writeJSON(bookingsFile, bookings);

    res.json({
        success: true
    });

});

/* ===========================
   ОТЗЫВЫ
=========================== */

// Получить отзывы
app.get("/api/reviews", (req, res) => {

    res.json(readJSON(reviewsFile));

});

// Добавить отзыв
app.post("/api/reviews", (req, res) => {

    const reviews = readJSON(reviewsFile);

    reviews.push(req.body);

    writeJSON(reviewsFile, reviews);

    res.json({
        success: true
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server started: http://localhost:${PORT}`
    );

});