<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webmodule.php';


class ModuleRoute extends Route {

	public function ProcessRequest($reqinfo) {
		$MODULE = null;
		$reqinfo->modulecontrollerpath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.php" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.php";
		$reqinfo->moduleviewpath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.phtml" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.phtml";
		$reqinfo->modulejspath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.mjs" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.mjs";
		$reqinfo->modulejsurl = $reqinfo->modulerequestinfo == '' ? "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulename.mjs" : "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulerequestinfo.mjs";
		$reqinfo->modulecsspath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.css" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.css";
		$reqinfo->modulecssurl = $reqinfo->modulerequestinfo == '' ? "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulename.css" : "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulerequestinfo.css";


		$this->reqinfo = $reqinfo;

		if (!$reqinfo->moduleconfig->allowanonymous) {
			if (!$this->auth->is_login()) {
				$reqinfo->moduledir = __ROOT_DIR . "/apps/fgta/framework/login";
				$reqinfo->modulecontrollerpath = "$reqinfo->moduledir/login.php";
				$reqinfo->moduleviewpath = "$reqinfo->moduledir/login.phtml";
				$reqinfo->modulejspath = "$reqinfo->moduledir/login.mjs";
				$reqinfo->modulejsurl = "./index.php/asset/fgta/framework/login/login.mjs";
			} else {
				// check apakah group yang dimiliki diperolehkan
				$allowed = false;
				foreach ($this->auth->get_groups() as $groupname) {
					if (in_array($groupname, $reqinfo->moduleconfig->allowedgroups)) {
						$allowed = true;
					}
				}
				if (!$allowed) { throw new \FGTA4\exceptions\WebException("Group yang anda miliki tidak diperbolehkan untuk mengakses ".$reqinfo->moduleconfig->title, 401);	 }
			}
		}


		if (!is_file($reqinfo->modulecontrollerpath)) {
			$MODULE = new \FGTA4\module\WebModule();
			$MODULE->LoadPage = function() { 
				return; 
			};
		} else {
			require_once $reqinfo->modulecontrollerpath;
			
			if (!is_object($MODULE)) {
				throw new \FGTA4\exceptions\WebException("Object MODULE belum terdefinisi dengan benar!", 500);		
			}

			if (!method_exists($MODULE, 'LoadPage')) {
				throw new \FGTA4\exceptions\WebException("Method 'LoadPage' pada MODULE '$reqinfo->modulecontrollerpath' tidak ditemukan", 500);
			}				
		}

		if (!is_file($reqinfo->moduleviewpath)) {
			throw new \FGTA4\exceptions\WebException("Module '$reqinfo->moduleviewpath' tidak ditemukan!", 500);
		}


		if (!method_exists($MODULE, 'Render')) {
			throw new \FGTA4\exceptions\WebException("Method 'Render' pada MODULE '$reqinfo->modulecontrollerpath' tidak ditemukan", 500);		
		}

		$this->MODULE = $MODULE;
		$this->MODULE->configuration = $this->configuration;
		$this->MODULE->reqinfo = $reqinfo;
		$this->MODULE->title = $reqinfo->moduleconfig->title;

		$this->MODULE->auth = $this->auth;
		$this->MODULE->LoadPage();
		
	}

	public function ShowResult($content) {
		$this->MODULE->Render($content, __ROOT_DIR . '/public/templates/' . __APPTEMPLATE);
	}

	public function ShowError($ex) {
		$content = ob_get_contents();
		ob_end_clean();

		if (!property_exists($ex, 'errorstatusmessage')) {
			$ex->errorstatusmessage = $ex->getMessage();
			$ex->errorstatus = 500;
		}

		$err = new \FGTA4\ErrorPage($ex->errorstatusmessage, $ex->errorstatus);
		$err->content = $content;
		$err->Show($ex->getMessage());		
	}

}

$ROUTER = new ModuleRoute();