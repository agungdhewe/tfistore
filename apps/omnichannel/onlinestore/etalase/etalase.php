<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class Etalase extends WebModule {
	
	public function LoadPage() {
		// $this->preloadscripts = [
		// 	'./jslibs/pouchdb.min.js',
		// 	'./jslibs/pouchdb.find.min.js'
		// ];

		$this->title = "Etalase" . ' - ' . $this->configuration->basetitle;

	}
}

$MODULE = new Etalase();