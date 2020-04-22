var tbl
var maps = []
var OnRowFormatting = function() {}
var OnRowClick = function() {}
var view_checkbox_column = false
var prevent_tr_click = false

const STATE_ORIGINAL = 0
const STATE_NEW = 1
const STATE_DELETED = 2

const btnFirst = document.createElement('span')
const btnPrev = document.createElement('span')
const btnNext = document.createElement('span')
const btnLast = document.createElement('span')

const btnCheckAll = document.createElement('span')

const txtCheckAll = 'Check All'
const txtUnCheckAll = 'UnCheck All'



export function attach(el, options) {
	tbl = el
	tbl.DATA = []
	init(tbl)
}


function init(tbl) {
	/* Public Function */
	tbl.clear = data_clear
	tbl.deletechecked = data_deletechecked
	tbl.fill = data_fill
	tbl.on = addeventlistener
	


	/* Cnstruct */
	tbl.DATA = []

	tbl.thead = tbl.children('thead') 
	var headnumofrows = tbl.thead.children().length

	tbl.find('tbody').remove()

	tbl.append('<tbody></tbody>')
	tbl.tbody =  tbl.children('tbody')




		// ambil kolom yang akan di assign di thead
	if (headnumofrows==0) {
		console.error('thead belum didefinisikan untuk mapping kolom')
		throw ('thead belum didefinisikan untuk mapping kolom')
	}

	var rowmapdata = tbl.thead.find('tr')
	var colmapdata = rowmapdata.find('th')

	for (var colmap of colmapdata) {
		var elcolmap = $(colmap)
		var mapping = elcolmap.attr('mapping')
		var onclick = elcolmap.attr('onclick')
		if (mapping===undefined) {
			mapping = '__CHECKBOX__'
			view_checkbox_column = true
		}

		maps.push({
			mapping: mapping,
			onclick: onclick
		})

	}

	if (headnumofrows>1) {
		tbl.thead.children()[0].remove()
	}


	btnFirst.action = () => { btnFirst_click() }
	btnPrev.action = () => { btnPrev_click() }
	btnNext.action = () => { btnNext_click() }
	btnLast.action = () => { btnLast_click() }
	btnCheckAll.action = () => { btnCheckAll_click() }
	
	createFooter(tbl)


}


function createFooter(tbl) {
	((btns)=>{
		for (let btn of btns) {
			// btn.classList.add('fgpaging-buttoncell')
			btn.setAttribute("style", "margin-left: 8px; margin-right: 8px;");

			btn.disable = () => {
				btn.active = false
				btn.classList.remove('fgpaging-link')
			}

			btn.enable = () => {
				btn.active = true
				btn.classList.add('fgpaging-link')
			}

			btn.enable()
			btn.onclick = () => {
				if (btn.active) {
					if (typeof btn.action == 'function') {
						btn.action()
					}
				}
			}
		}
	})([btnCheckAll, btnFirst, btnPrev, btnNext, btnLast])

	btnCheckAll.appendChild(document.createTextNode(txtCheckAll))
	btnFirst.appendChild(document.createTextNode('first'))
	btnPrev.appendChild(document.createTextNode('prev'))
	btnNext.appendChild(document.createTextNode('next'))
	btnLast.appendChild(document.createTextNode('last'))
	

	var div = document.createElement('div')
	div.setAttribute("style", "margin-top: 15px; display: flex; justify-content: space-between;")

	var divSel = document.createElement('div')
	if (view_checkbox_column) {
		divSel.appendChild(btnCheckAll)
	}


	var view_paging =  tbl.attr('paging')!==undefined ? (tbl.attr('paging').toLowerCase().trim()==='true') : false
	var divPaging = document.createElement('div')

	if (view_paging) {
		divPaging.appendChild(btnFirst)
		divPaging.appendChild(document.createTextNode('|'))
		divPaging.appendChild(btnPrev)
		divPaging.appendChild(document.createTextNode('||'))
		divPaging.appendChild(btnNext)
		divPaging.appendChild(document.createTextNode('|'))
		divPaging.appendChild(btnLast)
	}



	div.appendChild(divSel)
	div.appendChild(divPaging)

	$(div).insertAfter(tbl)
}


function data_deletechecked() {
	for (var i in tbl.DATA) {
		let tr = tbl.DATA[i]._tr
		if (tr.isChecked()) {
			tr.removedata()
		}
	}	
}


function data_clear() {
	for (var i in tbl.DATA) {
		let tr = tbl.DATA[i]._tr
		tr.removedata()
	}
	tbl.DATA = []
}

function data_fill(data) {

	for (var i in data) {
		let record = data[i]
		tbl.DATA.push(record)
		var row_id = tbl.DATA.length - 1

		let tr = document.createElement('tr')
		tr.row_id = row_id
		tr.table = tbl
		tr.check = () => {}
		tr.ITEMS = {}

		tr.removedata = () => {
			var row_id = tr.row_id
			tbl.DATA[row_id]._state = STATE_DELETED
			tr.remove()
		}

		Object.assign(record, {
			_original: null,
			_state: STATE_ORIGINAL,
			_tr: tr
		})

		
		for (var col of maps) {
			var field_id = col.mapping
			var onclickstr = col.onclick

			var td = document.createElement('td')
			if (onclickstr!=null) {
				td.row_id = row_id
				td.setAttribute('onclick', onclickstr)
				td.addEventListener('click', (ev)=>{ ev.stopPropagation() }, false)
			}

			let cn = document.createTextNode(record[field_id])
			if (field_id=='__CHECKBOX__') {
				cn = document.createElement('input')
				cn.type = 'checkbox'
				cn.onclick = (ev) => {
					ev.stopPropagation()
				}


				tr.check = (checked) => {
					cn.checked = checked
				}

				tr.isChecked = () => {
					return cn.checked
				}


				td.style.textAlign = 'center'

				td.onclick = (ev) => {
					ev.stopPropagation()
					cn.checked = !cn.checked
				}				

			}

			
			

			td.field_id = field_id
			tr.ITEMS[field_id] = td

			td.appendChild(cn)
			td.classList.add('fgtable-row')
			tr.appendChild(td)
		}

		record['_row'] = tr
		OnRowFormatting(tr)

		if (tr.class!=null & typeof tr.class == 'string') {
			for (var td of tr.childNodes) {
				td.classList.add(tr.class)
			}
		}
		
		tr.onmouseover = () => {
			for (var td of tr.childNodes) {
				td.classList.add('fgtable-row-over')
			}
		}

		tr.onmouseleave = () => {
			for (var td of tr.childNodes) {
				td.classList.remove('fgtable-row-over')
			}
		}


		tr.onclick = (ev) => {
			if (!prevent_tr_click) {
				OnRowClick(tr, ev)
			}
		}


		
		$(tr).appendTo(tbl.tbody)
	}
}


function addeventlistener(evname, fn) {
	if (typeof fn !== 'function')
		return

	switch (evname) {
		case 'RowFormatting' :
			OnRowFormatting = fn
			break;

		case 'RowClick' :
			OnRowClick = fn
			break;	
	}
}








function btnFirst_click() {
	console.log('btnFirst_click')
}

function btnPrev_click() {
	console.log('btnPrev_click')
}

function btnNext_click() {
	console.log('btnNext_click')
}

function btnLast_click() {
	console.log('btnLast_click')
}

function btnCheckAll_click() {
	var check = true
	btnCheckAll.classList.remove('fgpaging-link')
	if (btnCheckAll.innerHTML==txtCheckAll) {
		btnCheckAll.innerHTML = txtUnCheckAll
		check = true
	} else {
		btnCheckAll.innerHTML = txtCheckAll
		check = false
	}


	//console.log('btnCheckAll_click ')
	for (var dat of tbl.DATA) {
		dat._tr.check(check)
	}

	btnCheckAll.classList.add('fgpaging-link')


}