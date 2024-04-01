// Library
const telegramBOt = require("node-telegram-bot-api")
const token = "7064654728:AAHZ9Uug9Ch9qxieLCivfU80Pwi2iULOYnI" //YOUR BOT API TOKEN

// Class called
const option = { polling: true }
const newsbot = new telegramBOt(token, option)

// Create text on point
const prefix = "/"
const sayHi = new RegExp(`^${prefix}halo$`)
const gempa = new RegExp(`^${prefix}gempa$`)

newsbot.onText(sayHi, (callback) => {
    newsbot.sendMessage(callback.from.id, "Halo juga!")
})

newsbot.onText(gempa, async (callback) => {
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
    newsbot.sendPhoto(callback.from.id, BMKGImage,{
        caption: resultText
    })
})