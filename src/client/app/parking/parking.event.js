(function() {
    'use strict';

    angular.module('app.parking')
           .factory('ParkingEvent', ParkingEvent);

    function ParkingEvent(DriveOptions, TimeHelper) {
        var TIME_FOR_LEFT_PARKING_IN_MINUTES = 1;
        return {
            createLeaveEvent: function(args) {
                var props = {
                    type: DriveOptions.LEAVE_PARKING,
                    time: TimeHelper.toTime(args.points + TIME_FOR_LEFT_PARKING_IN_MINUTES),
                    points: args.points + TIME_FOR_LEFT_PARKING_IN_MINUTES
                };
                return Object.create(this).init(props);
            },

            createEnterEvent: function(args) {
                var props = {
                    type: DriveOptions.ENTER_TO_PARKING,
                    time: TimeHelper.toTime(args.points),
                    points: args.points
                };
                return Object.create(this).init(props);
            },

            init: function(args) {
                args = args || {};

                this.points = args.points;
                this.time = args.time;
                this.type = args.type;
                return this;
            },

            //Function for sorting times
            sortAsc: function(first, second) {
                return first.points - second.points;
            }
        };
    }
})();
