<?php namespace FGTA4\module;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class WebModule {
    public function __call($method, $args)
    {
        if (isset($this->$method)) {
            $func = $this->$method;
            return call_user_func_array($func, $args);
        }
	}
	
	
	public function Render($content, $template) {
		require_once $template;
	}
}
