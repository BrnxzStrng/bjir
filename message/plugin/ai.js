
let handler = async (m, { alice, text, prefix, command }) => {
			try {
		if (!text) return m.reply('Iyaa kenafaa?')
			
				m.reply('memek')
			} catch (err) {
				console.log(err)
				m.reply('Terjadi Kesalahan')
			}
}
handler.command = ["oi"];
handler.tags = ["ai"];
handler.help = ["oi"].map((a) => a + " *text*");
module.exports = handler