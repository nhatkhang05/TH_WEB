$(document).ready(function () {
    /* =====================================================
       3. MODAL: auto-check checkbox khi bấm nút pricing
    ===================================================== */
    // Khi bấm nút "Đăng ký ngay" ở pricing
    $(document).on('click', '[data-bs-target="#serviceModal"]', function () {
        const service = $(this).data('service'); // lấy data-service từ button

        // Reset tất cả checkbox
        $('.svc-check').prop('checked', false);

        // Check đúng checkbox tương ứng
        if (service) {
            $(`.svc-check[value="${service}"]`).prop('checked', true);
        }

        // Ẩn hết lỗi cũ
        $('.modal-error').hide();
    });
});