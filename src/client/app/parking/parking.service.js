(function () {
    'use strict';

    angular
        .module('app.parking')
        .factory('ParkingService', ParkingService);

    ParkingService.$inject = ['logger', 'DriveOptions', 'TimeHelper', 'TimeFormat', 'ParkingEvent'];
    /* @ngInject */
    function ParkingService(logger, DriveOptions, TimeHelper, TimeFormat, ParkingEvent) {
        let service = {
            analize: analize,
            validateInput: validateInput
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
        }

        function findPeak(timeline) {
            let peakTimes = [{start: timeline[0][0]}];
            let maxCarCount = timeline[0][1];
            for (let i = 1; i < timeline.length; i++) {
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
                    peakTimes[peakTimes.length - 1].end = getPeackTime(eventTime)
                }
            }
            return {
                carCount: maxCarCount,
                peakTimes: peakTimes
            }
        }

        function getPeackTime(milliseconds) {
            return TimeHelper.toTimeFromMilliseconds(milliseconds).hour + ':' + TimeHelper.toTimeFromMilliseconds(milliseconds).minute;
        }

        function createTimeline(eventList) {
            const dayStart = TimeHelper.toDateMilliseconds('00:00:001');
            let timeline = [[dayStart, 0]];
            for (let time in eventList) {
                let carsAtTime = timeline[timeline.length - 1][1] + eventList[time];
                timeline.push([TimeHelper.toDateMilliseconds(time), carsAtTime]);
            }
            return timeline;
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
            let validationErrors = [];
            let lines = inputData.split('\n');
            lines.forEach(function (line, index) {
                let times = transformToArray(line);
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
            let inputTimeList = transformToArray(inputData);
            return inputTimeList.map(function (time, index) {
                let itemTime = time.split(':');
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
