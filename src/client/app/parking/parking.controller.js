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

        function analize (input) {
            var graphOptions = ParkingService.analize(input);
            $scope.$apply(function () {
                vm.chartConfig.xAxis.categories = graphOptions.timeList;
                vm.chartConfig.series[0].data = graphOptions.carCountList;
                vm.notificationMessage = 'Analize complete successfull';
            });
        }

        fileInput.addEventListener('change', function (e) {
			var file = fileInput.files[0];
			var textType = /text.*/;
            $scope.$apply(function () {
                vm.notificationMessage = 'Selected file: ' + fileInput.files[0].name;
            });

			if (file && file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					var data = reader.result;
                    analize(data);
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
