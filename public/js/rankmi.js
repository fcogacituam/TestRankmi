
//Create service for git repos

angular.module('Services',[])
.factory('gitService',function($http,$q){
	var userRequest = function(url){
		var defered=$q.defer();
		var promise=defered.promise;
		return $http({
			method:'GET',
			url:url
		}).success(function(response){
			return defered.resolve(response.data);
		}).error(function(response,status){
			return defered.reject(status);
		})
		return deferred.promise;
	};
	return{
	
		event: function(url){
			return userRequest(url);
		}
	}
})



//used depdendencies
var app= angular.module('rankmiModule',['Services'])
app.controller("httpController",function($scope,$timeout,gitService){
	var timeout;
	$scope.showInfo=false;
	$scope.userNotFound=false;
	$scope.reposFound=false;

	//watch if username change
	$scope.$watch("username",function(newUser){
		if(newUser){
			//cancel the execution of timeout service
			if(timeout)	$timeout.cancel(timeout);
			
			timeout= $timeout(function(){
				var urlUser='https://api.github.com/users/'+newUser+'?access_token=09a9f615a8eeaedde31bf7ec1a4b0ae698005e0a';
				var urlRepos='https://api.github.com/users/'+newUser+'/repos?access_token=09a9f615a8eeaedde31bf7ec1a4b0ae698005e0a';
				gitService.event(urlUser).then(function(data,status){
					console.log(data);
					$scope.user = data.data;
					$scope.showInfo=true;
					$scope.userNotFound =false;
				},function(error){
					$scope.showInfo=false;
					$scope.userNotFound=true;
				})
				gitService.event(urlRepos).then(function(data,status){
					console.log(data);
					$scope.repos = data.data;
					$scope.showInfo=true;
					$scope.reposFound=true;
				},function(error){
					$scope.reposFound=false;
				});

			},400);
		}else{
			$scope.showInfo=false;
		}
	});


	//orderBy Table
	$scope.orderByMe=function(x){
		$scope.myOrderBy=x;
	}

});


