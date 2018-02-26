'use strict';

angular.module('copayApp.services').factory('nanexService', function($log, $state, nextStepsService, lodash, $ionicScrollDelegate, $timeout) {
  var root = {};
  var services = [];
  var linkedServices = [];

  root.update = function() {
    var newLinked = lodash.filter(services, function(x) {
      return x.linked;
    });

    // This is to preserve linkedServices pointer
    while (linkedServices.length)
      linkedServices.pop();

    while (newLinked.length)
      linkedServices.push(newLinked.pop());
    //

    $log.debug('nanex Service, updating nextSteps. linked/total: ' + linkedServices.length + '/' + services.length);

    if (linkedServices.length == 0) {
      nextStepsService.register({
        title: 'Trade on Nanex',
        name: 'nanex',
        icon: 'icon-nanex',
        // sref: 'tabs.donate',
        click: function(){
          window.open('https://nanex.co','_system');
        }
      });
    } else {
      nextStepsService.unregister({
        name: 'nanex',
      });
    };

    $timeout(function() {
      $ionicScrollDelegate.resize();
    }, 10);
  };

  var updateNextStepsDebunced = lodash.debounce(root.update, 1000);

  var register = function(serviceInfo) {
    services.push(serviceInfo);
    $log.info('Adding nanex service:' + serviceInfo.name + ' linked:' + serviceInfo.linked);
    updateNextStepsDebunced();
  };

  updateNextStepsDebunced();

  root.updateLink = function(name, linked) {
    var service = lodash.find(services, function(x) {
      return x.name == name;
    });
    $log.info('Updating nanex service:' + name + ' linked:' + linked);
    service.linked = linked

    root.update();
  };


  root.get = function() {
    return services;
  };


  root.getLinked = function() {
    return linkedServices;
  };


  return root;
});
