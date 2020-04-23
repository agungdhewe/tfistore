
export async function init() {


	OnSizeRecalculated();
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated()
	})
}


function OnSizeRecalculated() {
	console.log('size recalculated');
}


export function opencatalog(brand_id) {
	console.log(brand_id);
	location.href='index.php/module/omnichannel/onlinestore/catalog.html/' + brand_id;
}