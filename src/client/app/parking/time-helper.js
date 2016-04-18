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
                       enterTimeInMinutes >= leaveTimeInMinutes;
            },
            toDateMilliseconds: function(time) {
                const today = new Date();
                const datetime = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + time + '+0000');
                return datetime.getTime();
            },
            toTimeFromMilliseconds: function(milliseconds) {
                var day, hour, minute, second;
                second = Math.floor(milliseconds / 1000);
                minute = Math.floor(second / 60);
                second = second % 60;
                hour = Math.floor(minute / 60);
                minute = minute % 60;
                day = Math.floor(hour / 24);
                hour = hour % 24;
                return { day: timePad(day), hour: timePad(hour), minute: timePad(minute), second: timePad(second) };
            }
        };

        function timePad(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        }
    }
})();
