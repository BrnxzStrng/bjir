// ephoto.js
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function ephoto(url, text) {
    let form = new FormData();
    
    // Mengambil halaman dengan axios
    let gT = await axios.get(url, {
        headers: {
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        },
    });

    // Memuat data HTML dengan cheerio
    let $ = cheerio.load(gT.data);
    
    // Mengambil token dan server dari input
    let token = $('input[name=token]').val();
    let build_server = $('input[name=build_server]').val();
    let build_server_id = $('input[name=build_server_id]').val();
    
    // Menambahkan data ke form
    form.append('text[]', text);
    form.append('token', token);
    form.append('build_server', build_server);
    form.append('build_server_id', build_server_id);
    
    // Mengirim POST request
    let res = await axios({
        url: url,
        method: 'POST',
        data: form,
        headers: {
            Accept: '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            cookie: gT.headers['set-cookie']?.join('; '),
            ...form.getHeaders(),
        },
    });

    // Memuat data hasil POST dengan cheerio
    let $$ = cheerio.load(res.data);
    let json = JSON.parse($$('input[name=form_value_input]').val());
    json['text[]'] = json.text;
    delete json.text;

    // Mengirim data untuk membuat gambar
    let { data } = await axios.post(
        'https://en.ephoto360.com/effect/create-image',
        new URLSearchParams(json),
        {
            headers: {
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
                cookie: gT.headers['set-cookie'].join('; '),
            },
        }
    );

    // Mengembalikan URL gambar yang dihasilkan
    return build_server + data.image;
}

// Mengekspor fungsi agar bisa digunakan di file lain
module.exports = { ephoto };