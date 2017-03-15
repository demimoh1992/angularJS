(function () {
	'use strict';
	// service to return the data

	angular.module('FilmApp').
		//publishing/broadcasting
		service('applicationData',
			function ($rootScope){
				var sharedService = {};
				sharedService.info = {};

				sharedService.publishInfo = function (key, obj){
					this.info[key] = obj;
					$rootScope.$broadcast('systemInfo_'+key, obj);
				};

				return sharedService;
			}
		).

		service('dataService',			//the data service name, can be anything
			[
				'$q',					//dependency 1: $q handles promises, the request initially returns a promise, not the data
				'$http',				//dependency 2: $http handles the ajax request
				function($q, $http) {	//parameters have to be in the same order as dependency
					//variable to hold the database URL
					var urlBase 	= '/cm0665-assignment/server/';
					var urlBase2	= '/cm0665-assignment/server/index.php';

					//add a new function to dataService named getSysInfo()
					this.getSysInfo = function () {
						var defer		= $q.defer(),
							sysInfoUrl	= urlBase + 'appInfo.json';

						$http.get(sysInfoUrl, {cache:false}).
							success(function(response){
								defer.resolve({
									data: response.results[0]
								});
							}).
							error(function(err){
								defer.reject(err);
							});
						return defer.promise;
					};

					//add a new function to dataService named getMenu()
					this.getMenu = function () {
						var defer		= $q.defer(),
							menuInfoUrl	= urlBase + 'menu.json';

						$http.get(menuInfoUrl, {cache:false}).
							success(function(response){
								defer.resolve({
									data: response.results
								});
							}).
							error(function(err){
								defer.reject(err);
							});
						return defer.promise;
					};

					//add a new function to dataService named checkLogin()
					this.checkLogin = function () {
						var defer 		= $q.defer(),				//the promise returned by calling $q.defer()
							data 		= {                        // the data to be passed to the url
		                         action: 'isloggedin',
		                         subject: 'user'
                			};

						$http.get(urlBase2, {params:data, cache:false}).			//call to $http.get() passes 2 arguments: the url and config object(contains only cache:true)
							success(function(response){					//success() function passing one argument(the function, has one parameter - response)
								defer.resolve({							//define the defer.resolve() function, takes one argument which is the object which the promise will return if successful
									data: response.ResultSet.Result,				//properties created when promise is successful
									rowCount: response.ResultSet.RowCount || null
								});
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;		//return the defer object promise before the call to $http.get() returns
					};

					//add a new function to dataService named login()
					this.login = function (lEmail, lPassword) {
						var defer	= $q.defer(),
							email	= lEmail || null,
							password= lPassword || null,

							data 	= {                        // the data to be passed to the url
			                     action: 'login',
			                     subject: 'user'
	                		};

	                	if (email !== null) {
                			data.email = email;
                		}
                		if (password !== null) {
                			data.password = password;
                		}

                		$http.post(urlBase2, {params:data, cache:false}).
							success(function(response){
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;
					};

					//add a new function to dataService named logout()
					this.logout = function () {
						var defer 		= $q.defer(),
							data 		= {
		                         action: 'logout',
		                         subject: 'user'
                			};

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response){
								defer.resolve();
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;
					};

					//add a new function to dataService named getCategory()
					this.getCategory = function () {
						var defer 		= $q.defer(),
							data 		= {
		                         action: 'list',
		                         subject: 'category'
                			};

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response){
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;
					};

					//add a new function to dataService named getFilms()
					this.getFilms = function (filter) {
						var defer 		= $q.defer(),
						    page 		= filter.page || '0',
						    category 	= filter.category || null,
						    term		= filter.term || null,
							data 		= {
		                         action: 'list',
		                         subject: 'films',
		                         pageNum: page
                			};

                			// if there is a category then add it to the data object
                			if (category !== null) {
                				data.category = category;
                			}
                			if (term !== null) {
                				data.term = term;
                			}

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response){
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;
					};

					//add a new function to dataService named getFilmTotal()
					this.getFilmTotal = function (filter) {
						var defer 		= $q.defer(),
						    category 	= filter.category || null,
						    term		= filter.term || null,
							data 		= {
		                         action: 'list',
		                         subject: 'filmCount',
                			};

                			// if there is a category then add it to the data object
                			if (category !== null) {
                				data.category = category;
                			}
                			if (term !== null) {
                				data.term = term;
                			}

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response){
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;
					};

					//add a new function to dataService named getFilmDetail()
					this.getFilmDetail = function (filmid) {
						var defer 		= $q.defer(),
							data 		= {
		                         action: 'list',
		                         subject: 'filmDetail',
		                         film_id: filmid
                			};

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response){
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err){
								defer.reject(err);
							});

						return defer.promise;
					};

					//add a new function to dataService named getActors()
					this.getActors = function (filmid) {
						var defer		= $q.defer(),
							data 		= {
		                         action: 'list',
		                         subject: 'actors',
		                         film_id: filmid
                			};

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response) {
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err) {
								defer.reject(err);
							});
						return defer.promise;
					};

					//add a new function to dataService named getFilmNotes()
					this.getFilmNotes = function (filmid) {
						var defer		= $q.defer(),
							data 		= {
		                         action: 'list',
		                         subject: 'filmNote',
		                         film_id: filmid,
                			};

						$http.get(urlBase2, {params:data, cache:false}).
							success(function(response) {
								defer.resolve({
									data: response.ResultSet.Result,
									rowCount: response.ResultSet.RowCount
								});
							}).
							error(function(err) {
								defer.reject(err);
							});
						return defer.promise;
					};

					//add a new function to dataService named updateNote()
					this.updateNote = function (note){
						var defer	= $q.defer(),
							data	= {
								action: 	'update',
								subject: 	'note',
								data:		angular.toJson(note)
							};
						$http.post(urlBase2, {params:data, cache:false}).
							success(function(response){
					            defer.resolve(response);
					        }).
					        error(function (err){
					            defer.reject(err);
					        });
					    return defer.promise;
					};
				}
			]
		);
}());

