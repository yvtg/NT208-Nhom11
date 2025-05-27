export function formatCurrency(value) {
    // Xóa hết ký tự không phải số
    const rawValue = value.replace(/\D/g, "");
    // Thêm dấu chấm ngăn cách hàng nghìn
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
}

export function getRawNumber(value) {
  return value.replace(/[^\d]/g, ""); // xoá hết mọi ký tự không phải số
}