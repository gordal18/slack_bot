/**
 * notifications client controller tests
 */
(function () {
  'use strict';

  describe('NotificationsController', function () {
    // Initialize global variables
    var $scope,
      Socket,
      NotificationsController,
      $timeout,
      $state,
      Authentication;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope, _Socket_, _Authentication_, _$timeout_, _$state_) {
      $scope = $rootScope.$new();
      Socket = _Socket_;
      $timeout = _$timeout_;
      $state = _$state_;
      Authentication = _Authentication_;
    }));

    describe('when user logged out', function () {
      beforeEach(inject(function ($controller, $rootScope, _Socket_, _Authentication_, _$timeout_, _$state_) {
        Authentication.user = undefined;
        spyOn($state, 'go');
        NotificationsController = $controller('NotificationsController as vm', {
          $scope: $scope
        });
      }));

      it('should redirect logged out user to /', function () {
        expect($state.go).toHaveBeenCalledWith('home');
      });
    });

    describe('when user logged in', function () {
      beforeEach(inject(function ($controller, $rootScope, _Socket_, _Authentication_, _$timeout_, _$state_) {
        Authentication.user = {
          name: 'user',
          roles: ['user']
        };

        NotificationsController = $controller('NotificationsController as vm', {
          $scope: $scope
        });
      }));

      it('should make sure socket is connected', function () {
        expect(Socket.socket).toBeTruthy();
      });

      it('should define messages array', function () {
        expect($scope.vm.messages).toBeDefined();
        expect($scope.vm.messages.length).toBe(0);
      });

      describe('sendMessage', function () {
        var text = 'hello world!';
        beforeEach(function () {
          $scope.vm.messageText = text;
          $scope.vm.sendMessage();
          $timeout.flush();
        });

        it('should add message to messages', function () {
          expect($scope.vm.messages.length).toBe(1);
        });

        it('should add message with proper text attribute set', function () {
          expect($scope.vm.messages[0].text).toBe(text);
        });

        it('should clear messageText', function () {
          expect($scope.vm.messageText).toBe('');
        });
      });

      describe('$destroy()', function () {
        beforeEach(function () {
          $scope.$destroy();
        });

        it('should remove notificationsMessage listener', function () {
          expect(Socket.socket.cbs.notificationsMessage).toBeUndefined();
        });
      });
    });
  });
}());
