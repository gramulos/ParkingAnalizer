(function() {
    'use strict';

    angular
        .module('app.parking')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'parking',
                config: {
                    url: '/',
                    templateUrl: 'app/parking/parking.html',
                    controller: 'ParkingController',
                    controllerAs: 'vm',
                    title: 'Parking'
                }
            }
        ];
    }
})();
