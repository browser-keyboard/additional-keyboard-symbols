angular.module('optionApp', [])
  .controller('OptionController', ['$scope', '$sce', '$document', function($scope, $sce, $document) {
    $scope.emojiToImage = function(param){
			var emojiImage = emojione.toImage(param);
			var trustedHtml = $sce.trustAsHtml(emojiImage)
			return trustedHtml;
		}

    $scope.symbolSet = [];
    $scope.reset = function(){
      $scope.emptySymbolSet();
			self.port.emit('reset');
			self.port.on('setInfo', function (params) { // Addon SDK API
				$scope.setInfo(params);
			});

		}

	  $scope.emptySymbolSet = function(){
	    var len = $scope.symbolSet.length;
	    for(var i=0; i < len; i++){
	      $scope.symbolSet[i].length = 0;
	    }
	    $scope.symbolSet.length = 0;
	  };

    $scope.setInfo = function(result){
      for(var i = 0, len = result.symbolSet.length; i < len; i++){
					var key = {
					title: keyTitlesAndCodes[i][0],
					lowercase: result.symbolSet[i][0],
					uppercase: result.symbolSet[i][1]
				};
				$scope.symbolSet.push(key);
			}
      $scope.$apply();
	  }

    $scope.reset();

  	$scope.save = function(){
  			var toSave = [];
  			for (var i = 0, len = $scope.symbolSet.length; i < len; i++) {
  				var key = [$scope.symbolSet[i].lowercase, $scope.symbolSet[i].uppercase];
  				toSave.push(key);
  			}
        self.port.emit("save", {'symbolSet': toSave});
  		}

  	$scope.toDefault = function(){
  		$scope.emptySymbolSet();
			self.port.emit('default');
			self.port.on('setDefault', function (params) { // Addon SDK API
				$scope.setInfo(params);
			});
  	}
    $scope.setDefault = function(result){
  		$scope.emptySymbolSet();
  		for(var i = 0, len = result.defaultSet.length; i < len; i++){
  			var key = {
  				title: keyTitlesAndCodes[i][0],
  				lowercase: result.defaultSet[i][0],
  				uppercase: result.defaultSet[i][1]
  			};
  			$scope.symbolSet.push(key);
  		}
  	}

  	$scope.clear = function(){
  		$scope.emptySymbolSet();
  		for(var i = 0, len = keyTitlesAndCodes.length; i < len; i++){
  			var key = {
  				title: keyTitlesAndCodes[i][0],
  				lowercase: "",
  				uppercase: ""
  			};
  			$scope.symbolSet.push(key);
  		}
   }
 }]);
