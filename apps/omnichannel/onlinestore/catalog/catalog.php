<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class Catalog extends WebModule {
	
	public function LoadPage() {
		// $this->preloadscripts = [
		// 	'./jslibs/pouchdb.min.js',
		// 	'./jslibs/pouchdb.find.min.js'
		// ];

		$modulequerystring = $this->reqinfo->modulequery;
		$modulesquery = explode('/', $modulequerystring);

		$databrands = [
			'eag' => ['name'=>'Aigner'],
			'hbs' => ['name'=>'Hugo Boss'],
			'frg' => ['name'=>'Salvatore Ferragamo'],
			'fla' => ['name'=>'Furla'],
			'tod' => ['name'=>'Tods'],
			'gex' => ['name'=>'Geox'],
			'fkp' => ['name'=>'Find Kapoor'],
			'can' => ['name'=>'Canali'],
		];

		$brand_id = $modulesquery[0];
		if (array_key_exists($brand_id, $databrands)) {
			$bdata = $databrands[$modulesquery[0]];
			$this->title = $bdata['name'] . "'s Catalog - " . $this->configuration->basetitle;
		} else {
			$base_href=$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);
			$title = "Catalog - " . $this->configuration->basetitle;

			die("<!DOCTYPE HTML>
<html>
	<head>
			<title>$title</title>
			<base href=\"$base_href\">
	</head>
	<body>
			<script>location.href='index.php/module/omnichannel/onlinestore/etalase'</script>
	</body>
</html>		

			");
		}
		
	}
}

$MODULE = new Catalog();