var input_fix = function() {
    angular.element(document.querySelectorAll('input')).on('keyup', function(e) {
        if(e.target.value == '') {
            angular.element(this).parent().removeClass('input-filled')
        }
        else {
            angular.element(this).parent().addClass('input-filled')
        }
    })
}
