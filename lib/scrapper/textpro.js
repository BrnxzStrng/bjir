const fetch = require('node-fetch');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function textpro(url, text) {
    // Validasi URL
    if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url)) {
        throw new Error("Url Salah!!");
    }

    // Mengambil halaman dengan fetch
    const geturl = await fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "GoogleBot",
        },
    });

    // Mengambil token dari halaman
    const caritoken = await geturl.text();
    const $ = cheerio.load(caritoken);
    const token = $('input[name="token"]').attr("value");
    const form = new FormData();

    // Menangani input teks
    if (typeof text === "string") text = [text];
    for (let texts of text) form.append("text[]", texts);
    
    // Menambahkan data ke form
    form.append("submit", "Go");
    form.append("token", token);
    form.append("build_server", "https://textpro.me");
    form.append("build_server_id", 1);

    // Mengirim POST request
    const geturl2 = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "GoogleBot",
            ...form.getHeaders(),
        },
        body: form.getBuffer(),
    });

    // Mengambil token dari hasil POST
    const caritoken2 = await geturl2.text();
    const token2 = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(caritoken2);
    if (!token2) throw new Error("Token Tidak Ditemukan!!");

    // Mengirim data untuk memproses gambar
    const prosesimage = await fetch("https://textpro.me/create-", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.parse(token2[1])),
    });

    const hasil = await prosesimage.json();
    if (!hasil || !hasil.fullsize_image) {
        throw new Error("Gambar tidak ditemukan!");
    }
    
    return `https://textpro.me${hasil.fullsize_image}`;
}

// Mengekspor fungsi agar bisa digunakan di file lain
module.exports = { textpro };