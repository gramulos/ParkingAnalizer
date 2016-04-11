(function () {
    'use strict';

    angular
        .module('app.parking')
        .factory('ParkingService', ParkingService);

    ParkingService.$inject = ['logger', 'DriveOptions', 'TimeHelper', 'TimeFormat', 'ParkingEvent'];
    /* @ngInject */
    function ParkingService(logger, DriveOptions, TimeHelper, TimeFormat, ParkingEvent) {
        var service = {
            analize: analize,
            validateInput: validateInput
        };

        function analize(inputData) {
            var inputTimeList = parseInput(inputData);
            var eventsTimeline = inputTimeList.sort(ParkingEvent.sortAsc);
            var eventList = createEventList(eventsTimeline);
            var graphOptions = generateGraph(eventList);
            return graphOptions;
        }

        function generateGraph (eventList) {
            var timeList = ['00:00'];
            var carCountList = [0];
            for (var time in eventList){
                timeList.push(time);
                carCountList.push(carCountList[carCountList.length - 1] + eventList[time]);
            }
            return {
                timeList: timeList,
                carCountList: carCountList
            };
        }

        //Create list of events at the point of a time with count of entered and left cars
        function createEventList (eventsTimeline) {
            return eventsTimeline.reduce(function(allEvents, event) {
                // If time does not exist in array add this time with initial value 0
                if (!allEvents[event.time]) {
                    allEvents[event.time] = 0;
                }

                // Counting of events at time
                if (event.type === DriveOptions.ENTER_TO_PARKING) {
                    allEvents[event.time] += 1;
                } else if (event.type === DriveOptions.LEAVE_PARKING) {
                    allEvents[event.time] -= 1;
                }

                return allEvents;
            }, {});
        }

        //Check input data for completeness and validity
        function validateInput(inputData) {
            var validationErrors = [];
            var lines = inputData.split('\n');
            lines.forEach(function (line, index) {
                var times = transformToArray(line);
                //Checking inputs for validity. Inputs must match time format hh:mm
                if (!TimeFormat.rgFormat.test(times[0]) || !TimeFormat.rgFormat.test(times[1]) || TimeHelper.validateTime(times[0], times[1])) {
                    validationErrors.push('Invalid input at line ' + (index + 1) +  ' for times ' + line + ': Time is not in valid format.');
                    return;
                }
            });
            return validationErrors;
        }

        //Write all date in one line and then split it into array of times
        function transformToArray(inputData) {
            return inputData.replace(/(?:\r\n|\r|\n)/g, ',').replace(/ /g,'').split(',');
        }

        function parseInput(inputData) {
            var inputTimeList = transformToArray(inputData);
            return inputTimeList.map(function (time, index) {
                var itemTime = time.split(':');
                if (index % 2 === 0) {
                    return ParkingEvent.createEnterEvent({points: TimeHelper.toMinutes(itemTime)});
                } else {
                    return ParkingEvent.createLeaveEvent({points: TimeHelper.toMinutes(itemTime)})
                }
            });
        }

        return service;
    }
})();
