$(document).ready(function () {
    /* =====================================================
       3. MODAL: auto-check checkbox khi bấm nút pricing
    ===================================================== */

    $(document).on('click', '[data-bs-target="#serviceModal"]', function () {
        const service = $(this).data('service');

        $('.svc-check').prop('checked', false);

        if (service) {
            $(`.svc-check[value="${service}"]`).prop('checked', true);
        }

        $('.modal-error').hide();
    });
});