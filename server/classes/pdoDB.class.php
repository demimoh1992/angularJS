<?php

require_once('applicationRegistry.class.php');

//class SingletonExample {
class pdoDB {
	// private statics to hold the connection
	//private connection = null;
	private static $dbConnection = null;

	// make the next 2 functions private to prevent normal
	// class instantiation
	//private function constructor()
	private function __construct() {
	}
	private function __clone() {
	}

	/**
	 * Return DB connection or create initial connection
	 * @return object (PDO)
	 * @access public
	 */
	//public function getInstance() {
	public static function getConnection() {
		
		if (!defined('DNS')) {
			define('DNS', 'sqlite:/local-html\cm0665-assignment\server\db\nfc_films.sqlite');
		}

		if ( !self::$dbConnection ) {
			try {
				//connection = new Connection
				self::$dbConnection = new PDO(DNS);
				self::$dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
			}
			catch( PDOException $e ) {
				// in a production system you would log the error not display it
				echo $e->getMessage();
			}
		}
		// return the connection
		//RETURN connection;
		return self::$dbConnection;
	}

}

?>