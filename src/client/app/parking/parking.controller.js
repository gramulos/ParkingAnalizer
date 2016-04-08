(function () {
    'use strict';

    angular
        .module('app.parking')
        .controller('ParkingController', ParkingController);

    ParkingController.$inject = ['logger'];
    /* @ngInject */
    function ParkingController(logger) {
        var vm = this;

        var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');

        vm.labels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
        vm.series = ['Car counts'];
        vm.data = [
          [65, 59, 80, 81, 56, 55, 40]
        ];
        vm.onClick = function (points, evt) {
          console.log(points, evt);
        };

        vm.Start = function () {
            var file = fileInput.files[0];
			var textType = /text.*/;

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerText = reader.result;
				}

				reader.readAsText(file);
			} else {
				fileDisplayArea.innerText = "File not supported!"
			}
        }
    }
})();
