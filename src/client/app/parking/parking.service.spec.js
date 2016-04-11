/* jshint -W117, -W030 */
describe.skip('Parking Service test', function() {
    beforeEach(function() {
        bard.appModule('app.parking');
        bard.inject('logger', 'DriveOptions');
    });

    describe('createEventList with valid input', function() {
        var parkingService;
        var data = mockData.getMockParkingData();

        beforeEach(function() {
            factory = $factory('ParkingService');
            $rootScope.$apply();
        });

        it('should return parsed object with Key=time, Value=count', function() {
            var actual = DriveEvent.createLeaveEvent({points: 1290});
            var expected = {
                type: DriveOptions.LEAVE_PARKING,
                time: '12:31',
                points: 1290
            };
            expect(actual).to.equal(expected);
        });

        // it('of dashboard should work with $state.go', function() {
        //     $state.go('404');
        //     $rootScope.$apply();
        //     expect($state.is('404'));
        // });
        //
        // it('should route /invalid to the otherwise (404) route', function() {
        //     $location.path('/invalid');
        //     $rootScope.$apply();
        //     expect($state.current.templateUrl).to.equal(views.four0four);
        // });
    });
});
