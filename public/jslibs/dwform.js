var btn_edit
var btn_save
var btn_delete
var formobjects
var OnViewModeChanged;

export function attach(f) {
	btn_edit = f.btn_edit
	btn_save = f.btn_save
	btn_delete = f.btn_delete
	formobjects = f.formobjects
	OnViewModeChanged = f.OnViewModeChanged


	btn_edit.linkbutton({
		onClick: () => { btn_edit_click() }
	})


	for (let c in formobjects) {
		var obj = formobjects[c]
		var cls = getEasyuiClass(obj)

		obj.objecttypeclass = cls
		
		if (cls=='easyui-checkbox') {
			var opt = obj.checkbox('options')
			obj.object_isdisabled = opt.disabled
			obj.originalbackground =  obj.parent().find('span.checkbox').css('background-color')
			obj.parent().find('svg').find('path').attr('stroke', 'black')
			obj.parent().find('span.checkbox-inner.checkbox-checked').removeClass('checkbox-checked')
		} else {
			var opt = obj.textbox('options')
			obj.object_isdisabled = opt.disabled
			obj.originalbackground = obj.textbox('textbox').css('background')
		}
	}
}


export function getEasyuiClass(obj) {
	if (obj.hasClass('easyui-textbox')) {
		return 'easyui-textbox'
	} else if (obj.hasClass('easyui-checkbox')) {
		return 'easyui-checkbox'
	} else if (obj.hasClass('easyui-datebox')) {
		return 'easyui-datebox'
	} else if (obj.hasClass('easyui-numberbox')) {
		return 'easyui-numberbox'
	} else if (obj.hasClass('easyui-combobox')) {
		return 'easyui-combobox'
	}
}


export function setViewMode(viewonly) {
	if (viewonly) {
		btn_edit.linkbutton('unselect')
	} else {
		btn_edit.linkbutton('select')
	}

	togleEdit()
}

export function lock(locked) {
	if (locked) {
		btn_edit.linkbutton('disable')
	} else {
		btn_edit.linkbutton('enable')
	}
}





function togleEdit() {
	var opt = btn_edit.linkbutton('options')
	var viewonly = !opt.selected

	for (var c in formobjects) {
		var obj = formobjects[c]
		if (obj.objecttypeclass=='easyui-checkbox') {
			set_state_checkbox(obj, viewonly)
		} else {
			set_state_textbox(obj, viewonly)
		}		
	}

	if (viewonly) {
		btn_save.linkbutton('disable')
		btn_delete.linkbutton('disable')
	} else {
		btn_save.linkbutton('enable')
		btn_delete.linkbutton('enable')
	}

	if (typeof OnViewModeChanged === 'function') {
		OnViewModeChanged(viewonly)
	}
}




function btn_edit_click() {
	togleEdit()
}



function set_state_checkbox(obj, viewonly) {
	if (obj.object_isdisabled) {
		obj.checkbox('disable')
	} else {
		if (viewonly) {
			obj.checkbox('disable')
			obj.parent().find('span.checkbox-inner.checkbox-checked').removeClass('checkbox-checked')
			obj.parent().find('span.checkbox.inputbox').css('background', obj.originalbackground);
		} else {
			obj.checkbox('enable')
			obj.parent().find('span.checkbox.inputbox').css('background', 'rgb(255, 224, 149)');
		}
	}
}

function set_state_textbox(obj, viewonly) {
	if (obj.object_isdisabled) {
	} else {
		if (viewonly) {
			obj.textbox('readonly', true)
			obj.textbox('textbox').css('background', obj.originalbackground);
		} else {
			obj.textbox('readonly', false)
			obj.textbox('textbox').css('background', 'rgb(255, 224, 149)');
		}
	}

	// console.log(obj.find('input .textbox-text').css( "background-color" ));
	

}