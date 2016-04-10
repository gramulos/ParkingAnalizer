(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ParkingService', ParkingService);

    ParkingService.$inject = ['logger', 'driveOptions'];
    /* @ngInject */
    function ParkingService(logger, driveOptions) {
        var service = {
            analize: analize,
            validateInput: validateInput
        };

        var DriveEvent = {
            init: function(args) {
                args = args || {};

                this.points = args.points;
                this.time = args.time;
                this.type = args.type;
                return this;
            }
        }

        return service;

        function analize(inputData) {
            var inputTimeList = parseInput(inputData);
            var sortedTimeList = inputTimeList.sort(sotrtASC);
            var eventList = createEventList(sortedTimeList);
            var graphOptions = generateGraph(eventList);
            return graphOptions;
        }

        function generateGraph (eventList) {
            var timeList = ['00:00'];
            var carCountList = [0];
            eventList.map(function (item, index) {
                timeList.push(item.eventTime);
                // if (index > 0 && eventList[index - 1].enteredCars > 0 && eventList[index - 1].leftCars > 0) {
                //     carCountList.push(carCountList[carCountList.length-1] - eventList[index - 1].leftCars);
                //     if (item.enteredCars > 0) {
                //         carCountList[carCountList.length-1] = carCountList[carCountList.length-1] + item.enteredCars;
                //     } else {
                //         carCountList[carCountList.length-1] = carCountList[carCountList.length-1] - item.leftCars;
                //     }
                // } else {
                //     if (item.enteredCars > 0) {
                //         carCountList.push(carCountList[carCountList.length-1] + item.enteredCars);
                //     } else {
                //         carCountList.push(carCountList[carCountList.length-1] - item.leftCars);
                //     }
                // }
                if (index > 0 && eventList[index - 1].enteredCars > 0 && eventList[index - 1].leftCars > 0) {
                    carCountList.push(carCountList[carCountList.length - 1] - eventList[index - 1].leftCars);
                    if (item.enteredCars > 0) {
                        carCountList[carCountList.length - 1] = carCountList[carCountList.length - 1] + item.enteredCars;
                    }
                } else {
                    if (item.enteredCars > 0) {
                        carCountList.push(carCountList[carCountList.length - 1] + item.enteredCars);
                    } else {
                        carCountList.push(carCountList[carCountList.length - 1]);
                    }
                    if (index > 0) {
                        carCountList[carCountList.length - 1] = carCountList[carCountList.length - 1] - eventList[index - 1].leftCars;
                    }
                };
            });
            timeList.push('00:00');
            carCountList.push(0);
            return {
                timeList: timeList,
                carCountList: carCountList
            }
        }

        function filterByTime (time, sortedTimeList) {
            return sortedTimeList.filter(function (item) {
                return item.time === time;
            });
        }

        function sortByStatus (actionArray) {
            var enteredCars = 0;
            var leftCars = 0;

            actionArray.map(function (item) {
                if (item.type === driveOptions.ENTER_TO_PARKING) {
                    enteredCars += 1;
                }
                else {
                    leftCars += 1;
                };
            });

            return {
                enteredCars: enteredCars,
                leftCars: leftCars
            }
        }

        //Create list of events at the point of a time with count of entered and left cars
        function createEventList (sortedTimeList) {
            var sortedArray = [];
            var tempFilteredData = sortedTimeList;

            for (var i = 0; i < tempFilteredData.length; i++) {
                var eventTime = tempFilteredData[i].time;
                if (sortedArray.length > 0 && sortedArray[i-1].eventTime === eventTime) {
                    tempFilteredData.splice(i, 1);
                    i--;
                } else {
                    var filteredByTime = filterByTime(eventTime, sortedTimeList);
                    var sortedByStatus = sortByStatus(filteredByTime);
                    sortedArray.push({
                        eventTime: eventTime,
                        enteredCars: sortedByStatus.enteredCars,
                        leftCars: sortedByStatus.leftCars
                    });
                }
            }

            return sortedArray;
        }

        //Check input data for completeness and validity
        function validateInput(inputData) {
            var validationErrors = [];
            var lines = inputData.split('\n');
            lines.map(function (line, index) {
                var times = line.replace(/(?:\r\n|\r|\n)/g, '').split(',');
                var timePattern = /^([0-9]{2}:[0-9]{2})$/; //Regex for validation time format hh:mm

                //Checking inputs for validity. Inputs must match time format hh:mm
                if (!(timePattern.test(times[0]) && timePattern.test(times[1]))) {
                    validationErrors.push('Invalid input at line ' + (index + 1) +  ' for times ' + line + ': Time is not in valid format.');
                    return;
                }

                //Checking inputs for validity as time (hours must be less than 24 and minutes must me less than 59)
                var enterStringTime = times[0].split(':');
                var leaveStringTime = times[1].split(':');

                if (validateTime(enterStringTime) || validateTime(leaveStringTime)) {
                    validationErrors.push('Invalid input at line ' + (index + 1) +  ' for times ' + line + ': Time is not in valid format.');
                    return;
                };

                // Cheking for time interval validity (enterTime must be less then leaveTime)
                var enterTime = new Date('2016', '01', '01', enterStringTime[0], enterStringTime[1]);
                var leaveTime = new Date('2016', '01', '01', leaveStringTime[0], leaveStringTime[1]);

                if(enterTime.getTime() >= leaveTime.getTime()) {
                    validationErrors.push('Invalid input at line ' + (index + 1) +  ' for times ' + line + ': Time interval is not valid.');
                    return;
                }
            });
            return validationErrors;
        }

        //Validate inputs for matching valid time format hh:mm
        function validateTime(inputTime) {
            return inputTime[0] > 23 || inputTime[0] < 0 || inputTime[1] > 59 || inputTime[1] < 0
        }

        //Write all date in one line and then split it into array of times
        function transformToArray(inputData) {
            return inputData.replace(/(?:\r\n|\r|\n)/g, ',').split(',');
        }

        function parseInput(inputData) {
            var inputTimeList = transformToArray(inputData);
            var timeList = [];
            inputTimeList.map(function (time, index) {
                var itemTime = time.split(':');
                var driveEvent = Object.create(DriveEvent);
                driveEvent.init({
                    points: parseInt(itemTime[0]*60 + itemTime[1], 10),
                    time: time,
                    type: index % 2 === 0 ? driveOptions.ENTER_TO_PARKING : driveOptions.LEAVE_PARKING
                });
                timeList.push(driveEvent);
            });
            return timeList;
        }

        //Fonction for sorting times
        function sotrtASC(first, second) {
          if (first.points < second.points)
            return -1;
          else if (first.points > second.points)
            return 1;
          else
            return 0;
        }
    }
})();
