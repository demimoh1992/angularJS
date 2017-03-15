<?php

/**
 * System Registry information
 * @package classes
 * @author Rob Davis
 */
/**
 * require the base registry class and the pdoDB class
 */
require_once('classes/registry.class.php');
require_once('classes/pdoDB.class.php');
/**
 *
 * Class to handle Application level settings
 * @author Rob Davis
 * @package classes
 *
 */
Class ApplicationRegistry extends Registry {
	/**
	 * Private array holding application values
	 * @var Array $values
	 */
	private $values = array();
	/**
	 * Singleton instance
	 * @var ApplicationRegistry
	 */
	private static $instance;

	/**
	 * Opens system config file by calling the private function
	 * {@link ApplicationRegistry::openSystemConfigFile()}
	 */
	private function __construct() {
		$this->openSystemConfigFile();
	}

	/**
	 * Singleton instance
	 * @return ApplicationRegistry object self
	 */
	private static function instance() {
		if (!self::$instance) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * returns the value for a previously set key
	 * Accessed only from public static functions within this class {@link ApplicationRegistry::getDNS()}
	 * @param mixed $key
	 * @return mixed
	 */
	protected function get($key) {
		return isset($this->values[$key]) ? $this->values[$key] : null;
	}

	/**
	 * Set a value for a key
	 * Called only by the constructor calling
	 * {@link ApplicationRegistry::openSystemConfigFile()}
	 * @param string $key
	 * @param mixed $value
	 */
	protected function set($key, $value) {
		$this->values[$key] = $value;
	}

	/**
	 * Reads system file, used by constructor which is a singleton so only read once.
	 * a function that opens the system config file and reads the values into
	 * the values array
	 * @see ApplicationRegistry::__construct()
	 * @example examples/config.example.xml example xml config file - should be kept above web root
	 */
	private function openSystemConfigFile() {
		$filename = CONFIGLOCATION;  //CONFIGLOCATION a constant defined elsewhere
		if (file_exists($filename)) {
			$temp = simplexml_load_file($filename);
			foreach ($temp as $key => $value) {
				$this->set($key, trim($value));
			}
		}
	}
	/**
	 * You should create a new static function for each value you wish the client
	 * to be able to retrieve
	 */

	/**
	 * returns the dns used by the application.
	 * This is one of several static functions in ApplicationRegistry to
	 * provide access to oft used values.  This returns the dns connection string for the database
	 * @return the database DNS string
	 */
	public static function getDNS() {
		return self::instance()->get('dns');
	}

	/**
	 * Get the database username
	 * @return string database username
	 */
	public static function getUsername() {
		return self::instance()->get('username');
	}

	/**
	 * Get the database password
	 * @return string database password
	 */
	public static function getPassword() {
		return self::instance()->get('password');
	}

	/**
	 * returns a database connection
	 * Static function to return a database connection to hide the pdoDB implementation
	 * @return pdoDB database connection
	 * @see pdoDB::getConnection()
	 */
	public static function DB() {
		return pdoDB::getConnection();
	}

}

?>