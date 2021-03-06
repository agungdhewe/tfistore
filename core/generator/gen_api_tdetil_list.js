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

	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]


	var detil = genconfig.schema.detils[fsd.detilname]
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data
	
	// console.log(data)
	var lookupfields = ''
	var fields = []
	for (var fieldname in data) {
		fields.push(fieldname)

		var comptype = data[fieldname].comp.comptype

		// untuk componen yang tienya combo, tambah lookup
		if (comptype=='combo') {
			var options = data[fieldname].comp.options
			var field_display_name = options.field_display;
			if (options.field_display_name!=null) {
				field_display_name = options.field_display_name;
			}			
			lookupfields += `\t\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, '${options.table}', '${options.field_value}', '${options.field_display}'),\r\n`
		}		
	}	
	
	var primarykey = detiltable.primarykeys[0]

	var header_primarykey = headertable.primarykeys[0]
	

	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'tdetil-list_api.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace('/*{__FIELDS__}*/', fields.join(', '))
	tplscript = tplscript.replace(/<!--__TABLENAME__-->/g, tablename)
	tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
	tplscript = tplscript.replace('/*{__HEADERPRIMARYID__}*/', header_primarykey)
	tplscript = tplscript.replace('/*{__LOOKUPFIELDS__}*/', lookupfields)
	
	fsd.script = tplscript
}