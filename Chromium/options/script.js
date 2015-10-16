angular.module('optionApp', [])
	.controller('OptionController', ['$scope', '$sce', '$document', function($scope, $sce, $document) {

		$scope.emojiToImage = function(param){
			if(!/^([↖↗↙↘])$/.test(param)){
				var emojiImage = emojione.toImage(param);
				var trustedHtml = $sce.trustAsHtml(emojiImage)
				return trustedHtml;
			}else{
				return $sce.trustAsHtml(param)
			}
		}

		$scope.symbolSet = [];

		$scope.reset = function(){
			$scope.emptySymbolSet();
			chrome.storage.local.get('symbolSet', function (result) {
				for(var i = 0, len = result.symbolSet.length; i < len; i++){
					var key = {
						title: keyTitlesAndCodes[i][0],
						lowercase: result.symbolSet[i][0],
						uppercase: result.symbolSet[i][1]
					};
					$scope.symbolSet.push(key);
				}
	      $scope.$apply();
			});
		};

	  $scope.emptySymbolSet = function(){
	    var len = $scope.symbolSet.length;
	    for(var i=0; i < len; i++){
	      $scope.symbolSet[i].length = 0;
	    }
	    $scope.symbolSet.length = 0;
	  };

		$scope.reset();


		$scope.save = function(){
			var toSave = [];
			for (var i = 0, len = $scope.symbolSet.length; i < len; i++) {
				var key = [$scope.symbolSet[i].lowercase, $scope.symbolSet[i].uppercase];
				toSave.push(key);
			}
			chrome.storage.local.set({'symbolSet': toSave});

			data = {
				eve: "rebult"
			}
			chrome.tabs.query({}, function(tabs) {
				for (var i=0; i<tabs.length; ++i)
					chrome.tabs.sendMessage(tabs[i].id, data);
			});
		}


		$scope.toDefault = function(){
			$scope.emptySymbolSet();
			for(var i = 0, len = DEFAULT_SET.length; i < len; i++){
				var key = {
					title: keyTitlesAndCodes[i][0],
					lowercase: DEFAULT_SET[i][0],
					uppercase: DEFAULT_SET[i][1]
				};
				$scope.symbolSet.push(key);
			}
		}

		$scope.clear = function(){
			$scope.emptySymbolSet();
			for(var i = 0, len = DEFAULT_SET.length; i < len; i++){
				var key = {
					title: keyTitlesAndCodes[i][0],
					lowercase: "",
					uppercase: ""
				};
				$scope.symbolSet.push(key);
			}
		}

		$scope.localeLoad = function(){
			$scope.locale = {};
			$document[0].title = chrome.i18n.getMessage("options");

			$scope.locale.cancel_button = chrome.i18n.getMessage("cancel_button");
			$scope.locale.save_button = chrome.i18n.getMessage("save_button");

			$scope.locale.key_thead = chrome.i18n.getMessage("key_thead");
			$scope.locale.output_thead = chrome.i18n.getMessage("output_thead");
			$scope.locale.cancel_button = chrome.i18n.getMessage("cancel_button");
			$scope.locale.save_button = chrome.i18n.getMessage("save_button");
			$scope.locale.to_default_button = chrome.i18n.getMessage("to_default_button");
			$scope.locale.clear_button = chrome.i18n.getMessage("clear_button");
		}
		$scope.localeLoad();

}]);
