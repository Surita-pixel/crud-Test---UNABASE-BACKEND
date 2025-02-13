
export function formatCurrency(value) {
    return `$ ${value.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
}
