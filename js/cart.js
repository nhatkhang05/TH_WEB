/* ============================================================
   cart.js — Giỏ hàng dùng localStorage
   Dùng chung cho mọi trang: products, detail, index...
   Require: Bootstrap 5, jQuery
============================================================ */

const CART_KEY = 'sweetCart';

/* ---------- Đọc / Ghi cart ---------- */
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ---------- Thêm sản phẩm ---------- */
function addToCart(id, name, price, img) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) {
        cart[idx].qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    showToast('🛒 Đã thêm "' + name + '" vào giỏ hàng!', 'success');
}

/* ---------- Xóa sản phẩm ---------- */
function removeFromCart(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    updateCartBadge();
}

/* ---------- Cập nhật số lượng ---------- */
function updateQty(id, delta) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx < 0) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(cart);
    updateCartBadge();
}

/* ---------- Tổng tiền ---------- */
function getCartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

/* ---------- Cập nhật badge trên icon giỏ ---------- */
function updateCartBadge() {
    const total = getCart().reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = total;
}

/* ---------- Toast thông báo ---------- */
function showToast(msg, type) {
    const el = document.getElementById('toastMsg');
    if (!el) return;
    document.getElementById('toastBody').textContent = msg;
    el.className = 'toast align-items-center border-0 text-bg-' + (type === 'success' ? 'success' : 'danger');
    new bootstrap.Toast(el, { delay: 2500 }).show();
}

/* ---------- Khởi tạo tự động ---------- */
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (document.getElementById('cartContent')) {
        renderCart();
    }
});

/* ---------- Cart HTML Render Logic ---------- */
function renderCart() {
    const cart = getCart();
    const container = $('#cartContent');
    if (cart.length === 0) {
        container.html(`
            <div class="empty-cart">
                <i class="bi bi-cart-x"></i>
                <h4>Giỏ hàng đang trống</h4>
                <p>Hãy chọn những chiếc bánh ngon để thêm vào giỏ nhé!</p>
                <a href="products.html" class="btn-primary-custom">Xem sản phẩm <i class="bi bi-arrow-right ms-1"></i></a>
            </div>`);
        return;
    }
    let rows = '';
    cart.forEach(item => {
        rows += `
            <tr>
                <td><img src="${item.img}" class="cart-product-img" alt="${item.name}"></td>
                <td><div class="cart-product-name">${item.name}</div></td>
                <td>${item.price.toLocaleString('vi-VN')}đ</td>
                <td>
                    <div class="qty-control">
                        <button class="qty-ctrl-btn" onclick="changeQty(${item.id},-1)">−</button>
                        <span class="qty-val" id="qty-${item.id}">${item.qty}</span>
                        <button class="qty-ctrl-btn" onclick="changeQty(${item.id},1)">+</button>
                    </div>
                </td>
                <td><strong style="color:var(--primary)">${(item.price * item.qty).toLocaleString('vi-VN')}đ</strong></td>
                <td><button class="btn-remove" onclick="removeItem(${item.id})" title="Xóa"><i class="bi bi-trash3"></i></button></td>
            </tr>`;
    });
    const subtotal = getCartTotal();
    const ship = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + ship;
    container.html(`
        <div class="row g-4">
            <div class="col-lg-8">
                <table class="table cart-table mb-0">
                    <thead><tr><th>Ảnh</th><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <div class="mt-3 d-flex gap-2">
                    <a href="products.html" class="btn-continue" style="width:auto;padding:9px 20px;display:inline-block">← Tiếp tục mua sắm</a>
                    <button onclick="clearCart()" style="background:none;border:1.5px solid #dc354540;color:#dc3545;border-radius:20px;padding:9px 18px;font-size:13px;cursor:pointer"><i class="bi bi-trash me-1"></i>Xóa tất cả</button>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="cart-summary">
                    <h5 style="color:var(--accent);font-family:'Playfair Display',serif;margin-bottom:20px">Tóm tắt đơn hàng</h5>
                    <div class="summary-row"><span>Tạm tính</span><span>${subtotal.toLocaleString('vi-VN')}đ</span></div>
                    <div class="summary-row"><span>Phí giao hàng</span><span>${ship === 0 ? '<span style="color:#198754">Miễn phí</span>' : ship.toLocaleString('vi-VN') + 'đ'}</span></div>
                    ${subtotal < 500000 ? `<div style="font-size:11px;color:var(--text-muted);margin-top:-6px;margin-bottom:8px">Mua thêm ${(500000 - subtotal).toLocaleString('vi-VN')}đ để miễn phí ship</div>` : ''}
                    <div class="summary-row total"><span>Tổng cộng</span><span>${total.toLocaleString('vi-VN')}đ</span></div>
                    <button class="btn-checkout" onclick="showCheckout()"><i class="bi bi-truck me-2"></i>Đặt hàng ngay</button>
                    <a href="products.html" class="btn-continue">← Tiếp tục mua sắm</a>
                </div>
            </div>
        </div>`);
}
function changeQty(id, delta) { updateQty(id, delta); renderCart(); }
function removeItem(id) { removeFromCart(id); renderCart(); }
function clearCart() {
    if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm?')) {
        localStorage.removeItem(CART_KEY);
        updateCartBadge();
        renderCart();
    }
}
function showCheckout() {
    $('#checkoutForm').show();
    $('html,body').animate({ scrollTop: $('#checkoutForm').offset().top - 100 }, 400);
}
function submitOrder() {
    let valid = true;
    $('.error-msg').text('');
    const name = $('#oName').val().trim(), phone = $('#oPhone').val().trim(), addr = $('#oAddr').val().trim();
    if (!name) { $('#oErrName').text('Vui lòng nhập họ tên.'); valid = false; }
    if (!phone) { $('#oErrPhone').text('Vui lòng nhập số điện thoại.'); valid = false; }
    if (!addr) { $('#oErrAddr').text('Vui lòng nhập địa chỉ giao hàng.'); valid = false; }
    if (!valid) return;
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    new bootstrap.Modal(document.getElementById('successModal')).show();
    $('#cartContent').html('');
    $('#checkoutForm').hide();
}