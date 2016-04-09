(function () {
    'use strict';

    angular
        .module('app.parking')
        .controller('ParkingController', ParkingController);

    ParkingController.$inject = ['logger', '$scope'];
    /* @ngInject */
    function ParkingController(logger, $scope) {
        var vm = this;

        var fileInput = document.getElementById('fileInput');
        var inputHeader = document.getElementById('inputHeader');
        var filename = document.getElementById('fileName');
        vm.labels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
        vm.series = ['Car counts'];
        vm.fileData;
        vm.filteredData = [];
        vm.data = [
          [65, 59, 80, 81, 56, 55, 40, 55, 66, 22, 0, 33]
        ];
        vm.onClick = function (points, evt) {
          console.log(points, evt);
        };

        vm.Analize = function () {
            vm.labels = ["00:00"]
            var chartData = [0]
            vm.filteredData.map(function (item, index) {
                vm.labels.push(item.time)
                console.log(index);
                if (item.type === 'IN') {
                    chartData.push(chartData[index] + 1);
                } else {
                    chartData.push(chartData[index] - 1);
                }
            })

            vm.data[0] = chartData;
            console.log(vm.data[0]);
        }

        fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /text.*/;
            inputHeader.innerText = 'File Selected';

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					vm.fileData = reader.result.replace(/(?:\r\n|\r|\n)/g, ',').split(',');
                    var itemsCount = vm.fileData.length;
                    for (var i=0; i<itemsCount; i++) {
                        var itemTime = vm.fileData[i].split(':');

                        if (i % 2 === 0) {
                            vm.filteredData.push({
                                points: parseInt(itemTime[0]*60 + itemTime[1], 10),
                                time: vm.fileData[i],
                                type: 'IN'
                            });
                        } else {
                            vm.filteredData.push({
                                points: parseInt(itemTime[0]*60 + itemTime[1], 10),
                                time: vm.fileData[i],
                                type: 'OUT'
                            });
                        }

                        vm.filteredData.sort(sotrtASC);
                    }
				}

				reader.readAsText(file);
			} else {
				vm.fileData = "File not supported!";
			}
		});

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
