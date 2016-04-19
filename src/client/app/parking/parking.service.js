(function () {
    'use strict';

    angular
        .module('app.parking')
        .factory('ParkingService', ParkingService);

    ParkingService.$inject = ['DriveOptions', 'TimeHelper', 'TimeFormat', 'ParkingEvent'];
    /* @ngInject */
    function ParkingService(DriveOptions, TimeHelper, TimeFormat, ParkingEvent) {
        function parseInput(inputData) {
            const inputTimeList = transformToArray(inputData);
            return inputTimeList.map(function (time, index) {
                const itemTime = time.split(':');
                if (index % 2 === 0) {
                    return ParkingEvent.createEnterEvent({points: TimeHelper.toMinutes(itemTime)});
                } else {
                    return ParkingEvent.createLeaveEvent({points: TimeHelper.toMinutes(itemTime)});
                }
            });
        };

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
        };

        function createTimeline(eventList) {
            const dayStart = TimeHelper.toDateMilliseconds('00:00:001');
            var timeline = [[dayStart, 0]];
            for (var time in eventList) {
                const carsAtTime = timeline[timeline.length - 1][1] + eventList[time];
                timeline.push([TimeHelper.toDateMilliseconds(time), carsAtTime]);
            }
            return timeline;
        };

        function findPeak(timeline) {
            var peakTimes = [{start: timeline[0][0]}];
            var maxCarCount = timeline[0][1];
            for (var i = 1; i < timeline.length; i++) {
                const eventTime = timeline[i][0];
                const eventCars = timeline[i][1];

                if ( eventCars > maxCarCount ) {
                    maxCarCount = eventCars;
                    peakTimes = [{
                        start: getPeackTime(eventTime)
                    }];
                } else if ( eventCars === maxCarCount ) {
                    const prevCarCount = timeline[i - 1][1];
                    if (prevCarCount !== eventCars) {
                        peakTimes.push({start: getPeackTime(eventTime)});
                    }
                } else if (!peakTimes[peakTimes.length - 1].end) {
                    peakTimes[peakTimes.length - 1].end = getPeackTime(eventTime);
                }
            }
            return {
                carCount: maxCarCount,
                peakTimes: peakTimes
            }
        };

        function getPeackTime(milliseconds) {
            return TimeHelper.toTimeFromMilliseconds(milliseconds).hour +
            ':' + TimeHelper.toTimeFromMilliseconds(milliseconds).minute;
        };

        function analize(inputData) {
            const inputTimeList = parseInput(inputData).sort(ParkingEvent.sortAsc);
            const eventList = createEventList(inputTimeList);
            const timeline = createTimeline(eventList);
            const peak = findPeak(timeline);
            return {
                maxCarCount: peak.carCount,
                peakTimes: peak.peakTimes,
                graphData: timeline
            };
        };

        //Write all date in one line and then split it into array of times
        function transformToArray(inputData) {
            return inputData.replace(/(?:\r\n|\r|\n)/g, ',').replace(/ /g,'').split(',');
        };

        //Check input data for compvareness and validity
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
        };

        const service = {
            analize: analize,
            validateInput: validateInput
        };

        return service;
    }
})();
