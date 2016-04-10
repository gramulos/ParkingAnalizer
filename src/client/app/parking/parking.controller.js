(function () {
    'use strict';

    angular
        .module('app.parking')
        .controller('ParkingController', ParkingController);

    ParkingController.$inject = ['logger', '$scope', 'ParkingService', 'highchartConfig'];
    /* @ngInject */
    function ParkingController(logger, $scope, ParkingService, highchartConfig) {
        var vm = this;

        vm.chartConfig = highchartConfig;
        vm.notificationMessage = 'Please select file for start';

        var fileInput = document.getElementById('fileInput');

        function analize (inputData) {
            var graphOptions = ParkingService.analize(inputData);
            $scope.$apply(function () {
                vm.chartConfig.xAxis.categories = graphOptions.timeList;
                vm.chartConfig.series[0].data = graphOptions.carCountList;
                vm.notificationMessage = 'Analize complete successfull';
            });
        }

        fileInput.addEventListener('change', function (e) {
			var file = fileInput.files[0];
			var textType = /text.*/;
            if (fileInput.files[0]) {
                $scope.$apply(function () {
                    vm.notificationMessage = 'Selected file: ' + fileInput.files[0].name;
                });
            } else {
                $scope.$apply(function () {
                    vm.notificationMessage = 'File is not selected';
                });
            }

			if (file && file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					var data = reader.result;
                    var validationErrors = ParkingService.validateInput(data);
                    if (validationErrors.length === 0) {
                        analize(data);
                    } else {
                        $scope.$apply(function() {
                            vm.notificationMessage = '';
                            validationErrors.map(function (error) {
                                vm.notificationMessage = vm.notificationMessage + error + '\n';
                            });
                        });
                    }
				}
				reader.readAsText(file);
			} else {
                $scope.$apply(function () {
    				vm.notificationMessage = 'File is not supported!';
                });
			}
		});
    }
})();
