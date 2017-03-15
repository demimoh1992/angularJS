<?php
include_once('setEnv.php');
require_once('classes/applicationRegistry.class.php');
require_once('classes/JSON_RecordSet.class.php');
require_once('classes/session.class.php');

$action  	= isset($_REQUEST['action']) ? $_REQUEST['action'] : null;
$subject 	= isset($_REQUEST['subject']) ? $_REQUEST['subject'] : null;
$film_id  	= isset($_REQUEST['film_id']) ? $_REQUEST['film_id'] : null;
$category  	= isset($_REQUEST['category']) ? $_REQUEST['category'] : null;
$term  		= isset($_REQUEST['term']) ? $_REQUEST['term'] : null;
$pageNum  	= isset($_REQUEST['pageNum']) ? $_REQUEST['pageNum'] : null;
$data  	= isset($_REQUEST['data']) ? $_REQUEST['data'] : null;
$email  	= isset($_REQUEST['email'])? $_REQUEST['email']  : null;
$password  	= isset($_REQUEST['password'])? $_REQUEST['password']  : null;

if (empty($action)) {
	if ((($_SERVER['REQUEST_METHOD'] == 'POST') ||
		($_SERVER['REQUEST_METHOD'] == 'PUT') ||
		($_SERVER['REQUEST_METHOD'] == 'DELETE')) && (strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)) {
		$input = json_decode(file_get_contents('php://input'), true);

		$action = isset($input['params']['action']) ? $input['params']['action'] : null;
		$subject = isset($input['params']['subject']) ? $input['params']['subject'] : null;
		$email = isset($input['params']['email']) ? $input['params']['email'] : null;
		$password = isset($input['params']['password']) ? $input['params']['password'] : null;
		$data = isset($input['params']['data']) ? $input['params']['data'] : null;
	}
}

//concat action and subject with uppercase first letter of subject
$route = $action . ucfirst($subject);

//connect to db
$db = ApplicationRegistry::DB();

//set header to content type json
header("Content-Type: application/json");

//take appropriate action based on action and subject
switch($route) {
	//USER LOGIN
	case 'loginUser':
		$session = Session::getInstance();
		$session->setProperty('user', null);
		/**
		 * on the following two lines where I have $yourcode you will need to
		 * replace it with code to retrieve from post
		 * remember if angular this isn't in $_POST;  though with FlexBuilder it probably is
		 */
		$usr   = $email;
		$passw = $password;

		if (!empty($usr) && !empty($passw)) { // if both username and password are present try and log in
			$rs       = new JSONRecordSet();  // this could be your XMLRecordSet if appropriate

			// construct login sql using placeholders
			$loginSQL = "SELECT username, email FROM nfc_user WHERE email=:email AND password=:password";
			// create an array for the placeholder values -notice I encrypt the password, in this example using md5
			$params   = array(':email' => $usr, ':password' => md5($passw));

			// use getRecordSet -I've modified my version to allow an optional $params parameter which, if there is
			// on it'll use execute() instead of just query()
			$retval   = $rs->getRecordSet($loginSQL, 'ResultSet', $params);

			if ($retval !== false) {  // store successful login details
				$session->setProperty('user', $usr);
				echo $retval;
			}
			else { // if the log in failed unset any previously set value for user
				$session->setProperty('user', null);
				echo '{"status":{"error":"error", "text":"You shall not pass..."}}';
			}
		}
		else { // either username or password wasn't present so remove any previously set user values
			$session->setProperty('user', null);
			echo '{"status":{"error":"error", "text":"Username and Password are required."}}';
		}
		break;

	case 'isloggedinUser':
		$session = Session::getInstance();

		if ($session->getProperty('user') != null) {
			$user = $session->getProperty('user');
			echo '{"status":"ok","ResultSet":{"RowCount":1,"Result":[{"message":"' . $user . '"}]}}';
		}
		else {
			echo '{"status":"ok","ResultSet":{"Result":[{"message":"no user logged in"}]}}';
		}
		break;

	case 'someActionRequiringLogin':
		$session = Session::getInstance();
		// check session setting -using the Session class as taught
		if ($session->getProperty('user') != null) {
			$user = $session->getProperty('user');
			// construct appropriate sql
			// execute using xml or json record set class
			// echo return value from record set
		}
		else {
			// this header could be type xml if that's required by your client-side app
			header("Content-Type: application/json", true, 412);  // 412 means 'precondition failed'
			echo '{"status":{"error":"error", "text":"login required to view this information"}}';
		}
		break;

	case 'logoutUser':
		$session = Session::getInstance();

		if ($session->getProperty('user') != null) {
			$session->setProperty('user', null);
			echo '{"status":{"text":"user logged out"}}';
		}
		else {
			echo '{"status":{"error":"error", "text":"no user logged in"}}';
		}
		break;

	//FILM LISTING
	case 'listCategory':
		$sqlCategory		= "SELECT category_id, name
                              FROM nfc_category
                              ORDER BY name";

		$rs                = new JSONRecordSet();
		$retval            = $rs->getRecordSet($sqlCategory);
		echo $retval;
		break;

	case 'listFilms':
		$sqlFilm	= "SELECT f.film_id, title, SUBSTR(description, 1, 100) as desc, release_year, rating, strftime('%d/%m/%Y', f.last_update) as last_update, c.name
                       FROM nfc_film f
                       LEFT JOIN nfc_film_category fc ON f.film_id = fc.film_id
                       LEFT JOIN nfc_category c ON fc.category_id = c.category_id
                       WHERE 1";

		$catFilter 	= '';
		if (!empty($category)) {
			$catFilter .= " AND fc.category_id = '$category'";
		}
		if (!empty($term)) {
			$catFilter .= " AND (title LIKE '%$term%' OR c.name LIKE '%$term%')";
		}
		if (!empty($pageNum)) {
			$catFilter .= " ORDER BY title LIMIT $pageNum, 20";
		} else {
			$catFilter .= " ORDER BY title LIMIT 0, 20";
		}

		$sqlFilmFinal = $sqlFilm . $catFilter;

		$rs         = new JSONRecordSet();
		$retval     = $rs->getRecordSet($sqlFilmFinal, 'ResultSet');
		echo $retval;
		break;

	case 'listFilmCount':
		$sqlFilmC	= "SELECT f.film_id, title, SUBSTR(description, 1, 100) as desc, release_year, rating, f.last_update, c.name
                       FROM nfc_film f
                       LEFT JOIN nfc_film_category fc ON f.film_id = fc.film_id
                       LEFT JOIN nfc_category c ON fc.category_id = c.category_id
                       WHERE 1";

		$catFilter 	= '';
		if (!empty($category)) {
			$catFilter .= " AND fc.category_id = '$category'";
		}
		if (!empty($term)) {
			$catFilter .= " AND (title LIKE '%$term%' OR c.name LIKE '%$term%')";
		}

		$sqlFilmFinalC = $sqlFilmC . $catFilter;

		$rs         = new JSONRecordSet();
		$retval     = $rs->getRecordSet($sqlFilmFinalC, 'ResultSet');
		echo $retval;
		break;

	case 'listFilmDetail':
		$sqlFilmAll	= "SELECT f.film_id, f.title, f.description, f.release_year, l1.name AS name_lang, l2.name AS name_orilang, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, strftime('%d/%m/%Y', f.last_update) as last_update, c.name AS name_cat
                       FROM nfc_film f
                       LEFT JOIN nfc_film_category fc ON f.film_id = fc.film_id
                       LEFT JOIN nfc_category c ON fc.category_id = c.category_id
                       LEFT JOIN nfc_language l1 ON f.language_id = l1.language_id
                       LEFT JOIN nfc_language l2 ON f.original_language_id = l2.language_id
                       WHERE f.film_id= '$film_id'";

		$rs         = new JSONRecordSet();
		$retval     = $rs->getRecordSet($sqlFilmAll, 'ResultSet');
		echo $retval;
		break;

	case 'listFilmNote':
		$session = Session::getInstance();

		if ($session->getProperty('user') != null) {
			$user = $session->getProperty('user');
		}

		$sqlFilmNote	= "SELECT film_id, comment, lastupdated
	                       FROM nfc_note
	                       WHERE film_id='$film_id' AND user='$user'";

		$rs         = new JSONRecordSet();
		$retval     = $rs->getRecordSet($sqlFilmNote, 'ResultSet');
		echo $retval;
		break;

	case 'listActors':
		$sqlFilmActors	= "SELECT fa.actor_id, first_name, last_name
                              FROM nfc_film_actor fa
                              LEFT JOIN nfc_actor a ON fa.actor_id = a.actor_id
                              WHERE film_id= '$film_id'
                              ORDER BY first_name, last_name";

		$rs                = new JSONRecordSet();
		$retval            = $rs->getRecordSet($sqlFilmActors);
		echo $retval;
		break;

	case 'updateNote':
		$session = Session::getInstance();

		if ($session->getProperty('user') != null) {
			$user = $session->getProperty('user');
		}

		$time = time();
		date_default_timezone_set('Europe/London');
		$for_time = date("Y-m-d H:i:s");

		if (!empty($data)) {
			$note = json_decode($data);
			$film_id = $note->film_id;
			$checkRow = "SELECT * FROM nfc_note WHERE user='$user' AND film_id='$film_id'";
			$checkRowR = new JSONRecordSet();
			$checkSQL = $checkRowR->getRecordSet($checkRow);
			$checkSQL_d = json_decode($checkSQL);

			if ($checkSQL_d->status == 'ok') {
				$noteUpdateSQL = "UPDATE nfc_note SET comment=:comment, lastupdated=:lastupdated WHERE user=:user AND film_id=:film_id";
				$rs = new JSONRecordSet();
				$retval = $rs->getRecordSet($noteUpdateSQL, 'ResultSet',
				array(':comment'=>$note->comment,
					  ':lastupdated'=> $for_time,
					  ':film_id'=>$note->film_id,
				      ':user'=>$user));
			} else {
				$noteUpdateSQL = "INSERT INTO nfc_note (user, film_id, comment, lastupdated) VALUES (:user, :film_id, :comment, :lastupdated)";
				$rs = new JSONRecordSet();
				$retval = $rs->getRecordSet($noteUpdateSQL, 'ResultSet',
				array(':comment'=>$note->comment,
					  ':lastupdated'=> $for_time,
					  ':film_id'=>$note->film_id,
				      ':user'=>$user));
			}

			echo '{"status":"ok", "message":{"text":"updated", "note":"'.$note->comment.'"}}';
		}
		break;

	default:
		echo '{"status":"error", "message":{"text": "default no action taken"}}';
		break;
}
?>