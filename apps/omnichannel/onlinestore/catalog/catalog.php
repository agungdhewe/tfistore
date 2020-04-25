<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class Catalog extends WebModule {
	
	public function LoadPage() {
		// $this->preloadscripts = [
		// 	'./jslibs/pouchdb.min.js',
		// 	'./jslibs/pouchdb.find.min.js'
		// ];

		// baca data dari data catalog
		$catalog_db_filename = 'databrands.json';
		$catalog_db_path = __LOCALDB_DIR . "/catalog/databrands.json"; 	
		if (is_file($catalog_db_path)) {
			$catalog_db_json = file_get_contents($catalog_db_path);
			$catalog_db = json_decode($catalog_db_json, true);
		}	

		$modulequerystring = $this->reqinfo->modulequery;
		$modulesquery = explode('/', $modulequerystring);
		$brand_id = $modulesquery[0];
		if (array_key_exists($brand_id, $catalog_db)) {
			$bdata = $catalog_db[$brand_id];
			$this->title = $bdata['name'] . "'s Catalog - " . $this->configuration->basetitle;
			$this->categories =  $bdata['categories'];
		} else {
			$param = [
				'base_href' => $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']),
				'title' => "Catalog - " . $this->configuration->basetitle
			];
			$this->RedirectToEtalase($param);

		}
		
	}



	function RedirectToEtalase($param) {
		die("<!DOCTYPE HTML>
			<html>
				<head>
						<title>".$param['title']."</title>
						<base href=\"".$param['base_href']."\">
				</head>
				<body>
						<script>location.href='index.php/module/omnichannel/onlinestore/etalase'</script>
				</body>
			</html>		
		");
	}
}

$MODULE = new Catalog();