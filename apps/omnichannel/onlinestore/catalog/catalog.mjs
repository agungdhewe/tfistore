
export async function init() {


	OnSizeRecalculated();
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated()
	})
}


function OnSizeRecalculated() {
	console.log('size recalculated');
}


export function btn_login_click() {
	console.log('login');
}

export function btn_register_click() {
	console.log('register');
}