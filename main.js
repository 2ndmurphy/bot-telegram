// Library
const telegramBOt = require("node-telegram-bot-api")
const token = "7064654728:AAHZ9Uug9Ch9qxieLCivfU80Pwi2iULOYnI" //YOUR BOT API TOKEN

// Class called and option
const option = { polling: true }
const murphybot = new telegramBOt(token, option) //name your bot


// Create text on point
const prefix = "/"
const start = new RegExp(`^${prefix}start$`) //main regex
const gempa = new RegExp(`^${prefix}gempa$`) //gempa terkini
const news = new RegExp(`^${prefix}news$`) //berita terkini


//main prefix
murphybot.onText(start, (callback) => {
    murphybot.sendMessage(callback.from.id, `
    Halo ${callback.from.username} apa yang ingin kamu cari?
    /start  => memulai bot
    /gempa  => informasi gempa terbaru
    /news   => berita Indonesia terkini
    `)
})

//GEMPA
murphybot.onText(gempa, async (callback) => {
    const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/"
    const fetcher = await fetch(BMKG_ENDPOINT + "autogempa.json")
    const { 
        Infogempa: {
            gempa: {
                Jam, Magnitude, Tanggal, 
                Wilayah, Potensi, Kedalaman, Shakemap
            }
        } 
    } = await fetcher.json()

    const BMKGImage = BMKG_ENDPOINT + Shakemap

    const resultText = `
Waktu: ${Tanggal} | ${Jam},
Besaran: ${Magnitude} SR,
Wilayah: ${Wilayah},
Potensi: ${Potensi},
Kedalaman: ${Kedalaman}
    `
    murphybot.sendPhoto(callback.from.id, BMKGImage,{
        caption: resultText
    })
})

//BERITA TERKINI INDONESIA
murphybot.onText(news, async (callback) => {
    try {
        const newsAPIEndpoint = "https://newsapi.org/v2/top-headlines?country=id&apiKey=050a22bcf24f44e9b454e81f4aa98c11";
        const response = await fetch(newsAPIEndpoint);
        const newsData = await response.json();

        if (newsData.articles && newsData.articles.length > 0) {
            // Memilih secara acak satu berita dari daftar berita
            const randomIndex = Math.floor(Math.random() * newsData.articles.length);
            const randomArticle = newsData.articles[randomIndex];

            const articleTitle = randomArticle.title;
            const articleURL = randomArticle.url;

            // Menggabungkan judul dan URL artikel
            const message = `${articleTitle}\n${articleURL}`;

            // Memeriksa panjang pesan
            if (message.length > 4096) {
                // Jika pesan terlalu panjang, potong menjadi beberapa bagian
                const chunks = message.match(/.{1,4000}/g);
                chunks.forEach((chunk, index) => {
                    murphybot.sendMessage(callback.from.id, chunk);
                });
            } else {
                // Jika panjang pesan kurang dari atau sama dengan 4096, kirimkan langsung
                murphybot.sendMessage(callback.from.id, message);
            }
        } else {
            murphybot.sendMessage(callback.from.id, "Maaf, tidak ada berita terkini yang tersedia.");
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        murphybot.sendMessage(callback.from.id, "Maaf, terjadi kesalahan dalam mengambil berita terkini.");
    }
});
