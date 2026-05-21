const DEMO_ACCOUNTS = [
    { email: 'demo@sweetbakery.vn', password: 'bakery123', name: 'Khách hàng Demo' },
    { email: 'admin@sweetbakery.vn', password: 'admin2025', name: 'Admin Sweet Bakery' },
];

$(document).ready(function () {
    if ($('.swiper-banner').length > 0) {
        new Swiper('.swiper-banner', {
            loop: true,
            autoplay: { delay: 4500, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            speed: 700,
        });
    }

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 30) {
            $('#mainNav').addClass('scrolled');
        } else {
            $('#mainNav').removeClass('scrolled');
        }

        const sections = ['about', 'services', 'portfolio', 'pricing', 'contact'];
        let current = '';
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && $(window).scrollTop() >= $(el).offset().top - 100) {
                current = id;
            }
        });
        $('.navbar-nav .nav-link').removeClass('active');
        if (current) {
            $(`.navbar-nav .nav-link[href="#${current}"]`).addClass('active');
        }
    });

    $(document).on('click', '[data-bs-target="#serviceModal"]', function () {
        const service = $(this).data('service');
        $('.svc-check').prop('checked', false);
        if (service) {
            $(`.svc-check[value="${service}"]`).prop('checked', true);
        }
        $('.modal-error').hide();
    });

    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        const cat = $(this).data('cat');
        if (cat === 'all') {
            $('.product-wrap').show();
        } else {
            $('.product-wrap').hide();
            $(`.product-wrap[data-cat="${cat}"]`).show();
        }
        $('#searchNotice').hide();
    });

    if (window.location.pathname.includes('products.html')) {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('search');
        if (q) {
            $('#searchInput').val(q);
            filterSearch();
        }
    }

    if ($('#loginForm').length) {
        const session = JSON.parse(localStorage.getItem('sweetSession'));
        if (session) showLoggedIn(session.name);

        $('#togglePass').on('click', function () {
            const input = $('#lPass');
            const icon = $('#eyeIcon');
            if (input.attr('type') === 'password') {
                input.attr('type', 'text');
                icon.removeClass('bi-eye').addClass('bi-eye-slash');
            } else {
                input.attr('type', 'password');
                icon.removeClass('bi-eye-slash').addClass('bi-eye');
            }
        });

        if (typeof $.fn.validate !== 'undefined') {
            $('#loginForm').validate({
                rules: { email: { required: true, email: true }, password: { required: true, minlength: 6 } },
                messages: { email: { required: 'Vui lòng nhập email.', email: 'Email không đúng định dạng.' }, password: { required: 'Vui lòng nhập mật khẩu.', minlength: 'Mật khẩu ít nhất 6 ký tự.' } },
                errorElement: 'div', errorClass: 'error-msg',
                errorPlacement: function (err, el) { if (el.attr('id') === 'lPass') { err.insertAfter(el.closest('.input-group')); } else { err.insertAfter(el); } },
                highlight: function (el) { $(el).addClass('is-invalid'); },
                unhighlight: function (el) { $(el).removeClass('is-invalid'); },
                submitHandler: function () {
                    const email = $('#lEmail').val().trim().toLowerCase();
                    const pass = $('#lPass').val();
                    const remember = $('#rememberMe').is(':checked');
                    const found = DEMO_ACCOUNTS.find(a => a.email === email && a.password === pass);
                    if (!found) {
                        $('#loginError').text('Email hoặc mật khẩu không đúng.').show();
                        return false;
                    }
                    const sessionData = { email: found.email, name: found.name };
                    if (remember) localStorage.setItem('sweetSession', JSON.stringify(sessionData));
                    else { sessionStorage.setItem('sweetSession', JSON.stringify(sessionData)); localStorage.setItem('sweetSession', JSON.stringify(sessionData)); }
                    showLoggedIn(found.name);
                    return false;
                }
            });

            $.validator.addMethod('noDigits', function (v) { return !/\d/.test(v); }, 'Họ tên không được chứa số.');
            $('#registerForm').validate({
                rules: { name: { required: true, noDigits: true }, email: { required: true, email: true }, password: { required: true, minlength: 6 } },
                messages: { name: { required: 'Vui lòng nhập họ tên.' }, email: { required: 'Vui lòng nhập email.', email: 'Email không đúng định dạng.' }, password: { required: 'Vui lòng nhập mật khẩu.', minlength: 'Mật khẩu ít nhất 6 ký tự.' } },
                errorElement: 'div', errorClass: 'error-msg',
                errorPlacement: function (err, el) { err.insertAfter(el); },
                highlight: function (el) { $(el).addClass('is-invalid'); },
                unhighlight: function (el) { $(el).removeClass('is-invalid'); },
                submitHandler: function () {
                    const name = $('#rName').val().trim();
                    const sessionData = { email: $('#rEmail').val().trim(), name };
                    localStorage.setItem('sweetSession', JSON.stringify(sessionData));
                    showLoggedIn(name);
                    return false;
                }
            });
        }
    }
});

function doSearch() {
    const keyword = $('#searchInput').val().trim();
    if (keyword) {
        window.location.href = 'products.html?search=' + encodeURIComponent(keyword);
    }
}

function filterSearch() {
    const kw = $('#searchInput').val().trim().toLowerCase();
    if (!kw) {
        $('.product-wrap').show();
        $('#searchNotice').hide();
        return;
    }
    let count = 0;
    $('.product-wrap').each(function () {
        const name = $(this).data('name') || '';
        if (name.includes(kw)) { $(this).show(); count++; }
        else $(this).hide();
    });
    $('.filter-btn').removeClass('active');
    $('.filter-btn[data-cat="all"]').addClass('active');
    $('#searchNotice').text(`Tìm thấy ${count} sản phẩm cho "${kw}"`).show();
}

function showLoggedIn(name) {
    $('#loginView, #registerView').hide();
    $('#userDisplayName').text(name);
    $('#loggedInView').show();
}
function showRegister() {
    $('#loginView').hide();
    $('#registerView').show();
}
function showLogin() {
    $('#registerView').hide();
    $('#loginView').show();
}
function logout() {
    localStorage.removeItem('sweetSession');
    sessionStorage.removeItem('sweetSession');
    $('#loggedInView').hide();
    $('#loginView').show();
    $('#loginForm')[0].reset();
}
function showToast(msg, type) {
    const el = document.getElementById('toastMsg');
    if (!el) return;
    document.getElementById('toastBody').textContent = msg;
    el.className = 'toast align-items-center border-0 text-bg-'
        + (type === 'success' ? 'success' : 'danger');
    new bootstrap.Toast(el, { delay: 3000 }).show();
}