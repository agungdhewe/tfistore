<?php namespace FGTA4;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class WebUser {
	public $username;
	public $userfullname;
	public $employee_id;
	public $groups = ['public'];
}
