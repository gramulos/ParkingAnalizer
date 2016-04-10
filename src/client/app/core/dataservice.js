(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ParkingService', ParkingService);

    ParkingService.$inject = ['logger'];
    /* @ngInject */
    function ParkingService(logger) {
        var service = {
            analize: analize
        };

        return service;

        function analize(input) {
            var inputTimeList = parseInput(input);
            var sortedTimeList = inputTimeList.sort(sotrtASC);
            var eventList = createEventList(sortedTimeList);
            var graphOptions = generateGraph(eventList);
            return graphOptions;
        }

        function generateGraph (eventList) {
            var timeList = ["00:00"];
            var carCountList = [0];
            eventList.map(function (item, index) {
                timeList.push(item.eventTime);
                if (index > 0 && eventList[index - 1].enteredCars > 0 && eventList[index - 1].leftCars > 0) {
                    carCountList.push(carCountList[carCountList.length-1] - eventList[index - 1].leftCars);
                    if (item.enteredCars > 0) {
                        carCountList[carCountList.length-1] = carCountList[carCountList.length-1] + item.enteredCars;
                    } else {
                        carCountList[carCountList.length-1] = carCountList[carCountList.length-1] - item.leftCars;
                    }
                } else {
                    if (item.enteredCars > 0) {
                        carCountList.push(carCountList[carCountList.length-1] + item.enteredCars);
                    } else {
                        carCountList.push(carCountList[carCountList.length-1] - item.leftCars);
                    }
                }
            });
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
                if (item.type === 'IN') {
                    enteredCars++;
                }
                else {
                    leftCars++;
                };
            });

            return {
                enteredCars: enteredCars,
                leftCars: leftCars
            }
        }

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

        function validateInput(input) {

        }

        function transformToArray(input) {
            return input.replace(/(?:\r\n|\r|\n)/g, ',').split(',');
        }

        function parseInput(input) {
            var inputTimeList = transformToArray(input);
            var timeList = [];
            inputTimeList.map(function (time, index) {
                var itemTime = time.split(':');
                timeList.push({
                    points: parseInt(itemTime[0]*60 + itemTime[1], 10),
                    time: time,
                    type: index % 2 === 0 ? 'IN' : 'OUT'
                });
            });
            return timeList;
        }

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
