"use strict";

var urlBase = "http://localhost:8080";

angular.module('myApp', []).controller("ClientController", function($scope, $http) {
	$scope.motCle = "";
	$scope.pageCourante = 0;
	$scope.pageCouranteText = 1;
	$scope.totalPages = 0;
	$scope.size = 10;
	$scope.pages = [];
	$scope.sortColumn = "idClient";
	$scope.sortOption = "ASC";
	$scope.sortOptions = [ {
		value : 'ASC'
	}, {
		value : 'DESC'
	} ];
	$scope.steps = [ {
		value : '10'
	}, {
		value : '25'
	}, {
		value : '50'
	}, {
		value : '100'
	} ];
	
	$scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid) { 
			alert('our form is amazing');
		}

	};
	
	$scope.orderby = function(clientOrder) {
		if ($scope.sortColumn == clientOrder && $scope.sortOption == $scope.sortOptions[0].value) {
			$scope.sortColumn = clientOrder;
			$scope.sortOption = $scope.sortOptions[1].value;
			$scope.getClients();
		} else {
			$scope.sortColumn = clientOrder;
			$scope.sortOption = $scope.sortOptions[0].value;
			$scope.getClients();
		}
	}
	//Liste Des Clients
	$scope.listeDesClients = function() {
		$http.get(urlBase + "/clients/chercherClients?mc="
			+ $scope.motCle + "&sort=" + $scope.sortColumn + "&option=" + $scope.sortOption + "&page=" + (($scope.pageCourante <= 0) ? 0 : $scope.pageCourante) + "&size=" + $scope.size)
			.then(function(response) {
				$scope.clients = response.data.content;
				$scope.pages = new Array(response.data.totalPages);
				$scope.totalPages = response.data.totalPages;
			}, function(err) {
				sweetAlert("Error", err, "error");
				console.log(err);
			});
	}
	$scope.getClients = function() {
		$scope.pageCourante = 0;
		$scope.pageCouranteText = 1;
		$scope.listeDesClients();
	}
	$scope.gotoPage = function(p) {
		$scope.pageCourante = (p) < 0 ? 0 : ((p) < $scope.totalPages ? (p) : $scope.totalPages - 1);
		$scope.pageCouranteText = (p + 1) < 1 ? 1 : ((p + 1) <= $scope.totalPages ? (p + 1) : $scope.totalPages);
		$scope.listeDesClients();
	}
	$scope.nouveau = function() {
		$scope.client = {};
	}
	$scope.nouveauSearch = function() {
		$scope.motCle = "";
		$scope.getClients();
	}
	$scope.sauvgarde = function() {
		if (!$scope.client.idClient) {
			$http.post(urlBase + "/clients/", $scope.client)
				.then(function(response) {
					$scope.listeDesClients();
					$scope.nouveau();
					sweetAlert("Confirmation", "Votre Client a été ajouté avec succès", "success");
				}, function(err) {
					sweetAlert("Error", err, "error");
					console.log(err);
				});
		} else {
			$http.put(urlBase + "/clients/" + $scope.client.idClient, $scope.client)
				.then(function(response) {
					$scope.listeDesClients();
					$scope.nouveau();
					sweetAlert("Confirmation", "Votre Client a été modifié avec succès", "success");
				}, function(err) {
					sweetAlert("Error", err, "error");
					console.log(err.statusText);
				});
		}
	}
	$scope.editer = function(clientSel) {
		$scope.client = angular.copy(clientSel);
		$scope.client.nom = $scope.client.nom;
		$scope.client.telPortable = $scope.client.telPortable
		$scope.client.telFixe = $scope.client.telFixe;
		$scope.client.email = $scope.client.email;
		$scope.client.logo = $scope.client.logo;
		$scope.client.remarque = $scope.client.remarque;
		$scope.client.commentaire = $scope.client.commentaire;
	}
	$scope.supprimer = function(clientSel) {
		swal({
			title : "Confirmation",
			text : "Voulez vous vraiment supprimer?",
			type : "warning",
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			confirmButtonText : "Confirmer",
			cancelButtonText : "Annuler",
			closeOnConfirm : false
		}, function() {
			$http.delete(urlBase + "/clients/" + clientSel.idClient)
				.then(function(response) {
					$scope.listeDesClients();
					$scope.nouveau();
					swal("Confirmation", "Votre Client a été supprimé avec succès", "success");
				}, function(err) {
					sweetAlert("Error", err, "error");
					console.log(err);
				});
		});


	}
});