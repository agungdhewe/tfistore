const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"


const fieldexclude = ['_createby', '_createdate', '_modifyby', '_modifydate']



module.exports = async (fsd, genconfig) => {

	
	console.log(`-----------------------------------------------`)
	console.log(`Generate HTML Grid Detil...`)

	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]
	var header_primarykey = headertable.primarykeys[0]

	var detil = genconfig.schema.detils[fsd.detilname]
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data
	var primarykey = detiltable.primarykeys[0]

	var headermap_script = ''
	var headerrow_script = ''
	for (var fieldname in data) {
		if (fieldexclude.includes(fieldname)) { continue }

		var suppresslist = data[fieldname].suppresslist===true ? true : false;
		if (suppresslist) { continue }
		if (fieldname==header_primarykey) { continue }

		var comptype = data[fieldname].comp.comptype
		if (comptype=='combo') {
			var options = data[fieldname].comp.options
			var labeltext = data[fieldname].text !== undefined ? data[fieldname].text : options.field_display;
			headermap_script += `\t\t\t\t\t<th mapping="${options.field_display}">${options.field_display}</th>\r\n`
			headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
		} else {
			var labeltext = data[fieldname].text !== undefined ? data[fieldname].text : fieldname;
			headermap_script += `\t\t\t\t\t<th mapping="${fieldname}">${fieldname}</th>\r\n`
			headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
		}

	}


	var pagetitle = fsd.pagename
	if (detil.title!=undefined) {
		pagetitle = detil.title
	}

	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'detilgrid_phtml.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace(/<!--__PANELNAME__-->/g, fsd.panel)
	tplscript = tplscript.replace('<!--__PAGENAME__-->', fsd.pagename)
	tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)
	tplscript = tplscript.replace('<!--__HEADERMAP__-->', headermap_script)
	tplscript = tplscript.replace('<!--__HEADERROW__-->', headerrow_script)

	
	fsd.script = tplscript
}