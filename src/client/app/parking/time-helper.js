(function() {
    'use strict';

    angular.module('app.parking')
           .factory('TimeHelper', TimeHelper);

    function TimeHelper() {
        return {
            toTime: function (minutes) {
                return timePad(Math.floor(minutes / 60)) + ':' + timePad((minutes - Math.floor(minutes / 60) * 60));
            },
            toMinutes: function(time) {
                return parseInt(time[0], 10) * 60 + parseInt(time[1], 10);
            },
            validateTime: function(enterTime, leaveTime) {
                var enterStringTime = enterTime.split(':');
                var leaveStringTime = leaveTime.split(':');
                var enterTimeInMinutes = this.toMinutes(enterStringTime);
                var leaveTimeInMinutes = this.toMinutes(leaveStringTime);
                return enterStringTime[0] > 23 || enterStringTime[0] < 0  ||
                       enterStringTime[1] > 59 || enterStringTime[1] < 0  ||
                       leaveStringTime[0] > 23 || leaveStringTime[0] < 0  ||
                       leaveStringTime[1] > 59 || leaveStringTime[1] < 0  ||
                       enterTimeInMinutes > leaveTimeInMinutes;
            }
        };

        function timePad(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        }
    }
})();
