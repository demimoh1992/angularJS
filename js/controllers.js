/* global angular */

(function () {
	//turn on javascript strict syntax mode
	"use strict";

	/**
	 * Extend the module 'FilmApp' instantiated in app.js
	 * To add a controller called IndexController
	 * NEW add FilmController
	 *
	 * The controller is given two parameters, a name as a string and an array
	 * The array lists any injected objects to add and then
	 * a function which will be the controller object and can contain properties and methods
	 * $scope is a built in object which refers to the application model and
	 * acts as a sort of link between the controller, its data and the application's views.
	 *
	 * @link https://docs.angularjs.org/guides/scope
	 */
	 angular.module('FilmApp'). 					//call the module() method of angular, chains the call to controller
	 	controller('IndexController',				//controller given two parameters, a name=IndexController and an array=$scope
	 		[
	 			'$scope',							//linking controller to view
	 			'applicationData',
	 			'dataService',
	 			function ($scope, applicationData, dataService){
	 				$scope.title		= 'Film Information';
	 				$scope.coursetitle 	= '';

	 				//setting up a list
	 				//listening to the event systemInfo_course
	 				//when you broadcast, the first thing you receive is an event, named ev
	 				//inside the function, reassign the coursetitle as course(the object) properties called coursetitle
	 				$scope.$on('systemInfo_film',
	 					function (ev, film){
	 						$scope.filmtitle = film.title;
	 				});

	 				//get system info from appInfo.json file
	 				var getSysInfo = function() {
	 					dataService.getSysInfo().then (
	 						function(response) {
		 						$scope.title		= response.data.title;
		 						$scope.author		= response.data.author;
		 					},
		 					//when promise failed
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};
	 				getSysInfo();

	 				//get the menu from menu.json file
	 				var getMenu 	= function() {
	 					dataService.getMenu().then (
	 						function(response) {
		 						$scope.menus	= response.data;
		 					},
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};
	 				getMenu();

	 				//check if user is logged in
	 				var checkLogin = function () {
	 					dataService.checkLogin().then (
	 						function(response) {
		 						$scope.loggedIn 	= response.rowCount || null;
		 						$scope.username		= response.data[0].message || null;
		 						applicationData.publishInfo('login', $scope.loggedIn);
		 					},
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};
	 				checkLogin();

	 				//login the user
	 				$scope.login = function (lEmail, lPassword) {
	 					login(lEmail, lPassword);
	 				}
	 				var login	= function (lEmail, lPassword) {
		 				dataService.login(lEmail, lPassword).then (
		 					function(response) {
			 					$scope.loginInfo	= response.data;
			 					$scope.loggedIn 	= response.rowCount;
			 					$scope.username		= response.data[0].email;
			 					//publish the info to other controllers
			 					applicationData.publishInfo('login', $scope.loggedIn);
			 				},
			 				function(err) {
			 					$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
		 				);
		 			};

		 			//logout the user
		 			$scope.logout = function () {
		 				logout();
		 			};
		 			var logout	= function () {
		 				dataService.logout().then (
		 					function(response) {
			 					$scope.loggedIn	= null;
			 					//publish the info to other controllers
			 					applicationData.publishInfo('login', $scope.loggedIn);
			 				},
			 				function(err) {
			 					$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
		 				);
		 			}
	 			}

	 		]
	 	).											//chain another call to controller FilmController
	 	controller('FilmController',
	 		[
	 			'$scope',
	 			'dataService',						//in services.js
	 			'applicationData',
	 			'$location',						//gives access to the url

	 			function ($scope, dataService, applicationData, $location) {
	 				//set up an object
	 				var filter 				= {page: 0, category: null, term: null}
		 				$scope.itemLimit 	= 20;

		 			//get category listing
		 			var getCategory = function() {
	 					dataService.getCategory().then (
		 					function(response) {
		 						$scope.catCount 	= response.rowCount;
		 						$scope.category		= response.data;
		 					},
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};
	 				getCategory();

	 				//get film listing
	 				var getFilms = function() {
	 					dataService.getFilms(filter).then (
		 					function(response) {
		 						$scope.filmCount 	= response.rowCount;
		 						$scope.films		= response.data;
		 						//FOR PAGINATION
		 						$scope.currentPage	= filter.page || 0;
		 						$scope.cCategory	= filter.category || null;
		 						$scope.searchTerm	= filter.term || null;
		 					},
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};

	 				//get total film listing for pagination number
	 				var getFilmTotal = function() {
	 					dataService.getFilmTotal(filter).then (
		 					function(response) {
		 						$scope.totalFilmC	= response.rowCount;
		 						$scope.totalFilms	= response.data;
		 						//FOR PAGINATION
		 						$scope.cCategory	= filter.category || null;
		 						$scope.searchTerm	= filter.term || null;
		 					},
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};
					getFilmTotal();

					//proceed or go back to next or previous 20 results
	 				$scope.goPage = function (direction) {
	 				    console.log(direction);
	 				    if (direction == 1) {
	 				    	var nextPage = $scope.currentPage + $scope.itemLimit;
	 				    } else {
	 				    	var nextPage = $scope.currentPage - $scope.itemLimit;
	 				    }
	 				    filter.page = nextPage;
	 				    getFilms();
	 				}

	 				//filtering film listing by category
					$scope.filter = function (cCategory) {
					    filter.category = cCategory;
					    filter.page = 0;
						getFilms();
						getFilmTotal();
					}

					//filtering film listing by search term
					$scope.search = function (searchTerm) {
						filter.term		= searchTerm;
						filter.page = 0;
						getFilms();
						getFilmTotal();
					}

					//initialise as an empty object, by attaching to $scope we can access it from our view
	 				$scope.selectedFilm = {};

	 				//remove the second character form the first
	 				//for /films/filmid you get 'films' and 'filmid'
	 				var filmInfo = $location.path().substr(1).split('/');

	 				//check the array if it has 2 things inside
	 				if (filmInfo.length === 2) {
	 					//use the filmid from the path
	 					//and assign to selectedCourse so if the path is reloaded, it's highlighted
	 					$scope.selectedFilm = {film_id: filmInfo[1]};
	 				}

	 				$scope.selectFilm = function ($event, film){	//attach selectCourse to $scope with 2 parameters. the first one holds the click event, second is the course object clicked on
	 					$scope.selectedFilm = film;
	 					applicationData.publishInfo('film', film);
						$location.path('/films/' + film.film_id);
	 				}

	 				getFilms();
	 			}

	 		]
	 	).											//chain another call to controller FilmActorsController
	 	controller('FilmActorsController',
	 		[
	 			'$scope',
	 			'dataService',
	 			'applicationData',
	 			'$routeParams',						//gives access to the parameter in the url we named :filmid in app.js

	 			function($scope, dataService, applicationData, $routeParams) {
	 				$scope.actors 	= [ ];		//initialise scope.students as an empty array
	 				$scope.actorCount = 0;		//initialise scope.studentCount as 0
	 				$scope.loggedIn = false;

	 				//receiving boradcasted info from other controllers
	 				$scope.$on('systemInfo_login',
	 					function (ev, loggedIn){
	 						$scope.loggedIn = !!loggedIn;
	 						getFilmNotes($routeParams.filmid);
	 				});

	 				//get actors according to filmid
	 				var getActors = function(filmid) {
	 					dataService.getActors(filmid).then(
	 						function(response) {
	 							$scope.actorsCount 		= response.rowCount + ' actors';
	 							$scope.actors 			= response.data;
	 							$scope.actorCountNoText = response.rowCount;
	 						},
	 						function(err) {
	 							$scope.status 		= 'Unable to load data ' + err;
	 						}
	 					);
	 				};

	 				//get film details according to filmid
	 				var getFilmDetail = function(filmid) {
	 					dataService.getFilmDetail(filmid).then(
	 						function(response) {
	 							$scope.filmdetail 	= response.data;
	 						},
	 						function(err) {
	 							$scope.status 		= 'Unable to load data ' + err;
	 						}
	 					);
	 				};

	 				//get film notes according to filmid
	 				var getFilmNotes = function(filmid) {
	 					dataService.getFilmNotes(filmid).then(
	 						function(response) {
	 						    var data = response.data || null;
	 						    if (typeof data === "string") {
		 						    data = JSON.parse(data);
	 						    }
	 							$scope.filmnotes	= data;
	 							$scope.filmCount	= response.rowCount;
	 						},
	 						function(err) {
	 							$scope.status 		= 'Unable to load data ' + err;
	 						}
	 					);
	 				};

	 				//check login
	 				var checkLogin = function () {
	 					dataService.checkLogin().then (
	 						function(response) {
		 						$scope.loggedIn 	= response.rowCount || null;
		 						$scope.username		= response.data[0].message || null;
		 						applicationData.publishInfo('login', $scope.loggedIn);
		 					},
		 					function(err) {
		 						$scope.status		= 'Unable to load data ' + err;
							},
							function(notify) {
								console.log(notify);
							}
	 					);
	 				};

	 				$scope.selectedNote = {};

	 				//only if there has been a courseid passed in
	 				if ($routeParams && $routeParams.filmid) {
	 					console.log($routeParams.filmid);
	 					getActors($routeParams.filmid);
	 					getFilmDetail($routeParams.filmid);
	 					checkLogin();
	 					//check if logged in
	 					if ($scope.loggedIn === true) {
	 						getFilmNotes($routeParams.filmid);
	 					}
	 					// store the film id in case that film is edited
	 					$scope.selectedNote.film_id = $routeParams.filmid;
	 				}


	 				$scope.selectNote = function ($event, filmnote){
	 					console.log('click working');
	 					$scope.selectedNote = filmnote;
	 				}

	 				//shows the edit window and positions it based on the row clicked on
	 				$scope.showEditNote = function ($event, filmnote, editorID){
	 					var element	= $event.currentTarget,
	 						padding = 22,
	 						posY = (element.offsetTop + element.clientTop + padding) - (element.scrollTop + element.clientTop),
        					noteEditorElement = document.getElementById(editorID);

        				console.log(filmnote);
        				//if filmnote is undefined aka no records
        				if (filmnote === undefined) {
        					//initialise an object with empty comment
        					filmnote = {
        					   comment:'',
        					   film_id: $scope.selectedNote.film_id
        					};
        				}
        				$scope.selectedNote 	= angular.copy(filmnote);
        				$scope.editorVisible 	= true;

        				noteEditorElement.style.position = 'absolute';
    					noteEditorElement.style.top = posY + 'px';
	 				};

	 				//abandon the edit in progress
	 				$scope.abandonEdit = function () {
	 					$scope.editorVisible 	= false;
	 					$scope.selectedNote		= null;
	 				};

	 				//save the edit
	 				$scope.saveNote = function () {
	 					var n,
	 						scount = $scope.filmnotes.length,
	 						currentNote;

	 					$scope.editorVisible = false;

	 					//call the dataService method
	 					dataService.updateNote($scope.selectedNote).then(
	 						function (response) {
	 							$scope.status = response.status;
	 							if (response.status === 'ok') {
	 								for (n = 0; n < scount; n += 1) {
	 									currentNote = $scope.filmnotes[n];
	 									$scope.filmnotes[n] = angular.copy($scope.selectedNote);
	 									break;
	 								}
	 								getFilmNotes($routeParams.filmid);
	 							}
	 							console.log(response);
	 							//reset selected note
	 							$scope.selectedNote = null;
	 						},
	 						function (err) {
	 							$scope.status = "Error with save " + err;
	 						}
	 					)
	 				};
	 			}
	 		]
	 	);
}());