(function () {
    'use strict';

    angular
        .module('app.parking')
        .controller('ParkingController', ParkingController);

    ParkingController.$inject = ['$scope', 'logger', 'ParkingService', 'highchartConfig', 'Messages'];
    /* @ngInject */
    function ParkingController($scope, logger, ParkingService, highchartConfig, Messages) {
        var vm = this;

        vm.chartConfig = highchartConfig;
        vm.notificationMessage = [Messages.START_MESSAGE];

        var fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function (e) {
            var file = fileInput.files[0];
            var textType = /text.*/; // Constant
            if (fileInput.files[0]) {
                $scope.$apply(function () {
                    vm.notificationMessage = ['Selected file: ' + fileInput.files[0].name];
                });
            } else {
                $scope.$apply(function () {
                    vm.notificationMessage = [Messages.FILE_IS_NOT_SELECTED];
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
                            vm.notificationMessage = validationErrors;
                        });
                    }
                };
                reader.readAsText(file);
            } else {
                $scope.$apply(function () {
                    vm.notificationMessage = [Messages.FILE_IS_NOT_SUPPORTED];
                });
            }
        });

        function analize (inputData) {
            var graphOptions = ParkingService.analize(inputData);
            $scope.$apply(function () {
                vm.chartConfig.xAxis.categories = graphOptions.timeList;
                vm.chartConfig.series[0].data = graphOptions.carCountList;
                vm.notificationMessage = [Messages.ANALIZE_SUCCESS];
            });
        }
    }
})();
