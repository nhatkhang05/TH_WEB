$(document).ready(function () {
    /* =====================================================
       4. MODAL VALIDATION: nút Gửi đăng ký
    ===================================================== */
    $('#btnModalSubmit').on('click', function () {
        let valid = true;


        $('.modal-error').hide();


        if ($('#mName').val().trim() === '') {
            $('#mErrName').show();
            valid = false;
        }


        if ($('#mPhone').val().trim() === '') {
            $('#mErrPhone').show();
            valid = false;
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailVal = $('#mEmail').val().trim();
        if (!emailRegex.test(emailVal)) {
            $('#mErrEmail').show();
            valid = false;
        }


        if ($('.svc-check:checked').length === 0) {
            $('#mErrSvc').show();
            valid = false;
        }

        if (!valid) return;


        bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
        $('#modalForm')[0].reset();
        if (typeof showToast === 'function') {
            showToast('✅ Đăng ký thành công! Chúng tôi sẽ liên hệ bạn trong 30 phút.', 'success');
        }
    });

    /* =====================================================
       5. CONTACT FORM VALIDATION (jQuery Validate)
    ===================================================== */

    $.validator.addMethod('noDigits', function (value) {
        return !/\d/.test(value);
    }, 'Họ tên không được chứa ký tự số.');

    $('#contactForm').validate({
        rules: {
            name: { required: true, noDigits: true },
            email: { required: true, email: true },
            message: { required: true, minlength: 20 }
        },
        messages: {
            name: { required: 'Vui lòng nhập họ tên.', noDigits: 'Họ tên không được chứa ký tự số.' },
            email: { required: 'Email là bắt buộc.', email: 'Địa chỉ email không hợp lệ.' },
            message: { required: 'Vui lòng nhập nội dung.', minlength: 'Nội dung cần ít nhất 20 ký tự.' }
        },
        errorElement: 'div',
        errorClass: 'error-msg',
        errorPlacement: function (error, element) { error.insertAfter(element); },
        highlight: function (element) { $(element).addClass('is-invalid'); },
        unhighlight: function (element) { $(element).removeClass('is-invalid').addClass('is-valid'); },
        submitHandler: function () {
            if (typeof showToast === 'function') showToast('✅ Tin nhắn đã gửi thành công! Chúng tôi sẽ phản hồi sớm.', 'success');
            $('#contactForm')[0].reset();
            $('#contactForm .is-valid').removeClass('is-valid');
            return false;
        }
    });
});
