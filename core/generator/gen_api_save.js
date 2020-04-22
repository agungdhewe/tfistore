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
		// var field
		var lookupfields = ''
		var uppercasefields = ''
		var setnullfields = ''
		var tosqldate = ''
		var fields = []
		var fieldreturn = []

		for (var fieldname in data) {
			fields.push(fieldname)
			fieldreturn.push(fieldname)

			var comptype = data[fieldname].comp.comptype
			if (comptype=='datebox') {
				tosqldate += `\t\t\t$obj->${fieldname} = (\\DateTime::createFromFormat('d/m/Y',$obj->${fieldname}))->format('Y-m-d');`
			}	
			
			var uppercase = data[fieldname].uppercase
			if (uppercase===true) {
				uppercasefields += `\t\t\t$obj->${fieldname} = strtoupper($obj->${fieldname});\r\n`
			}


			var allownull = data[fieldname].null;
			if (allownull) {
				setnullfields += `\t\t\tif ($obj->${fieldname}=='--NULL--') { unset($obj->${fieldname}); }\r\n`
			}


			// untuk componen yang tienya combo, tambah lookup
			if (comptype=='combo') {
				var options = data[fieldname].comp.options
				var field_display_name = options.field_display;
				if (options.field_display_name!=null) {
					field_display_name = options.field_display_name;
				}				
				lookupfields += `\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($data->${fieldname}, $this->db, '${options.table}', '${options.field_value}', '${options.field_display}'),\r\n`
			}


		}

		fieldreturn.push('_createby')
		fieldreturn.push('_createdate')
		fieldreturn.push('_modifyby')
		fieldreturn.push('_modifydate')
		
		var fieldresturnsel = "'" + fieldreturn.join("', '") + "'"



		// $obj->tanggal = (\DateTime::createFromFormat('d/m/Y',$obj->tanggal))->format('Y-m-d');
		var primarykey = headertable.primarykeys[0]
	

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'save_api.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__TOSQLDATE__}*/', tosqldate)
		tplscript = tplscript.replace('/*{__TOUPPERCASE__}*/', uppercasefields)
		tplscript = tplscript.replace('/*{__FIELDRETSEL__}*/', fieldresturnsel)
		tplscript = tplscript.replace('/*{__LOOKUPFIELD__}*/', lookupfields)
		tplscript = tplscript.replace('/*{__SETNULLFIELD__}*/', setnullfields)


		

		fsd.script = tplscript
	} catch (err) {
		throw err
	}
}