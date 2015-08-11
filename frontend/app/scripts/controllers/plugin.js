'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PluginCtrl
 * @description
 * # PluginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('PluginCtrl', function (API_URL, $scope, $http, $stateParams, $window) {
    $scope.plugin = {
      authors: {},
      downloaded: 0
    };
    $scope.rated = false;

    $scope.ratePlugin = function(note) {
      if (!$scope.rated) {
        $http({
          method: 'POST',
          url: API_URL + '/plugin/star',
          data: {
            note: note,
            plugin_id: $scope.plugin.id
          }
        })
        .success(function(data) {
          $scope.plugin.note = data.new_average;
        });
        localStorage.setItem('rated_' + $scope.plugin.id, true);
        $scope.rated = true;
      }
    };

    $scope.download = function() {
      $window.location.href = API_URL + '/plugin/'+$scope.plugin.key+'/download';
    };

    $scope.fromNow = function(date) {
      return moment(date).fromNow();
    };


    // Enable retrieval of tab index according
    // to given language
    var getTabWithLang = function(lang, defaults) {
      if (!defaults)
        defaults = 'en';

      for (var index in $scope.plugin.descriptions) {
        if (lang === $scope.plugin.descriptions[index].lang)
          return index;
      }

      if (lang == defaults)
        return 0;

      return getTabWithLang(defaults, defaults);
    };

    $scope.$on('languageChange', function(evt, data) {
        $scope.selectedIndex = getTabWithLang(data.newLang);
    });

    // Fetch the Plugin resource
    $http({
      method: 'GET',
      url: API_URL + '/plugin/' + $stateParams.key
    })
    .success(function(data) {
      $scope.plugin = data;
      $scope.rated = (localStorage.getItem('rated_' + $scope.plugin.id) == 'true') ? true : false;
      $scope.selectedIndex = getTabWithLang(localStorage.getItem('lang'));
    });
  });