const fetch = require('node-fetch'); // Pastikan Anda mengimpor fetch
const cheerio = require('cheerio');

// FUNCTION SEARCH GIF
async function searchGif(query) {
  const url = `http://www.pornhub.com/gifs/search?search=${query}`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const gifs = $('ul.gifs.gifLink li');

  return gifs.map((i, gif) => {
    const data = $(gif).find('a');

    return {
      title: data.find('span').text(),
      url: 'http://dl.phncdn.com#id#.gif'.replace('#id#', data.attr('href')),
      webm: data.find('video').attr('data-webm'),
    };
  }).get();
}

// Ekspor fungsi agar dapat diakses dari file lain
module.exports = {
  searchGif
};