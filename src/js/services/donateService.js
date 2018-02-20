'use strict';

angular.module('copayApp.services').factory('donateService', function($log, $state, nextStepsService, lodash, $ionicScrollDelegate, $timeout) {
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

    $log.debug('donate Service, updating nextSteps. linked/total: ' + linkedServices.length + '/' + services.length);

    if (linkedServices.length == 0) {
      nextStepsService.register({
        title: 'Donate to app developer',
        name: 'donate',
        icon: 'icon-garlicoin',
        // sref: 'tabs.donate',
        click: function(){
          $state.go('tabs.send', {}, {
            'reload': true,
            'notify': $state.current.name == 'tabs.send' ? false : true
          });
          // Timeout is required to enable the "Back" button
          $timeout(function() {
            $state.transitionTo('tabs.send.amount', {
              toAddress: 'GNuk6JfjaZBV4BuZ1HW3P34bj1Z7ovJQM1'
            });
          }, 100);
        }
      });
    } else {
      nextStepsService.unregister({
        name: 'donate',
      });
    };

    $timeout(function() {
      $ionicScrollDelegate.resize();
    }, 10);
  };

  var updateNextStepsDebunced = lodash.debounce(root.update, 1000);

  var register = function(serviceInfo) {
    services.push(serviceInfo);
    $log.info('Adding donate service:' + serviceInfo.name + ' linked:' + serviceInfo.linked);
    updateNextStepsDebunced();
  };

  updateNextStepsDebunced();

  root.updateLink = function(name, linked) {
    var service = lodash.find(services, function(x) {
      return x.name == name;
    });
    $log.info('Updating donate service:' + name + ' linked:' + linked);
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
