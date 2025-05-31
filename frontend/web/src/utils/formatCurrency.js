export function formatCurrency(value) {
    if (!value) return "0 VNĐ";

    const rawValue = value.toString().replace(/\D/g, "");
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
}


export function getRawNumber(value) {
  return value.replace(/[^\d]/g, ""); // xoá hết mọi ký tự không phải số
}