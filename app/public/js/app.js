angular.module('browser', ['ui.bootstrap', 'ngSanitize'])
  .controller('main', function ($scope, $sce, prompt, Window) {
    $scope.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    }
    $scope.tabs = [
      {
        url: 'http://www.sitepoint.com/'
      }
    ];
    $scope.newTab = function () {
      prompt("Please enter a url", "http://www.sitepoint.com")
      .then(function (url) {
        var tab = {url: url, active:true}
        $scope.tabs.push(tab);
      },
      function () {
        alert("Error opening site!");
      });
    };
    $scope.closeTab = function (index) {
      $scope.tabs.splice(index, 1);
    };
    $scope.minimize = function () {
      Window.minimize();
    };

    $scope.toggleKioskMode = function () {
      Window.toggleKioskMode();
    };

    $scope.close = function () {
      Window.close();
    };
  })
  .directive('iframeTab', function () {
    return {
      restrict: 'E',
      scope: {
        tabs: '='
      },
      replace: true,
      template: '<uib-tab ng-repeat="tab in tabs" active="tab.active">' +
      '<uib-tab-heading>{{tab.url}} <i class="fa fa-times close-tab"' +
      'ng-click="closeTab($index)"></i></uib-tab-heading>' +
      '<iframe src="{{trustSrc(tab.url)}}"' +
      'style="width:100%; height:100%" nwdisable nwfaketop></iframe>' +
      '</uib-tab>'
    };
  })
  .factory("prompt", function ($window, $q) {
    function prompt(message, defaultValue) {
      var defer = $q.defer();
      var response = $window.prompt(message, defaultValue);
      if (response === null) {
        defer.reject();
      } else {
        defer.resolve(response);
      }
      return (defer.promise);
    }
    return (prompt);
  })
  .factory('GUI', function () {
    return require('nw.gui');
  })
  .factory('Window', function (GUI) {
    return GUI.Window.get();
  });

