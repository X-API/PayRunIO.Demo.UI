$(function() {

    $('#IsSupplementary').change(function() {
        if(this.checked) {
            $('#StartDate').val($('#SupPeriodStart').val());
            $('#EndDate').val($('#SupPeriodEnd').val());

            $('#PaymentDate').val($('#SupMinPaymentDate').val());
            $('#PaymentDate').prop('min', $('#SupMinPaymentDate').val());
            $('#PaymentDate').prop('max', $('#SupMaxPaymentDate').val());
        } else {
            $('#StartDate').val($('#NextPeriodStart').val());
            $('#EndDate').val($('#NextPeriodEnd').val());

            $('#PaymentDate').val($('#NextPaymentDate').val());
            $('#PaymentDate').prop('min', $('#NextTaxPeriodStart').val());
            $('#PaymentDate').prop('max', $('#NextTaxPeriodEnd').val());
        } 
    });

})