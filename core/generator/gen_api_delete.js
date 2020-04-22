const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"

module.exports = async (fsd, genconfig) => {
	try {
		console.log(`-----------------------------------------------`)
		console.log(`Generate API Save...`)


		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data

		// console.log(data)
		var fields = []
		for (var fieldname in data) {
			fields.push(fieldname)
		}


		var primarykey = headertable.primarykeys[0]
	

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'delete_api.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)

		fsd.script = tplscript
	} catch (err) {
		throw err
	}
}