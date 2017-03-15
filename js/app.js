(function () {
	//turn on javascript strict syntax mode
	"use strict";

	/**
	 *	start a new Application, a module in Angular
	 *	@param {string} ApplicationName a string wihch will be the name of the application
	 *					and an object to which we add all other components
	 *	@param {array} dependencies An array of dependencies, the names are passed as strings
	 */

	 angular.module("FilmApp",		//call the module() method of angular, the first argument is the application's name "CourseApp"
	 	[								//the second argument is an array of dependencies
	 		'ngRoute' 					//the only dependency at this stage, passed as string, for URL routing
	 	]								//close the array
	 ).									//this fullstop where we chain the call to config
	 config(							//chain a call to config in which we will provide the functionality of the app
	 	[								//start an array of arguments to pass in config
	 		'$routeProvider',			//built in variable which injects functionality, passed as a string. $routeProvider gives us access to URLs
	 		function($routeProvider) {	//second argument of config is a function which will be invoked when the app runs
	 			$routeProvider.			//the dot means we will chain a method call on the next line
	 				when('/films', {	//chain a call to $routeProvider.when(), the first argument is a URL, the second is a brace indicating the start of an object literal
	 					controller: 'FilmController'					//gives the name of the controller which will handle the logic needed for the '/films' URL
	 				}).
	 				//new lines
	 				when('/films/:filmid', {						//the :(colon) indicates what follows wont be the literal word, but a parameter
	 					templateUrl: 'js/partials/actor-list.html',
	 					controller: 'FilmActorsController'
	 				}).
	 				otherwise({			//otherwise() method will be called if the URL is none of the ones defined
	 					redirectTo: '/'	//redirect to the root URL
	 				});
	 		}
	 	]
	);									//end of config
}());									//end of IIFE, the last () make it immediately Invoke