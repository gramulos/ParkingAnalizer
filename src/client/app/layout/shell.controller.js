(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$timeout', 'config'];
    /* @ngInject */
    function ShellController($rootScope, $timeout, config) {
        var vm = this;
    }
})();
