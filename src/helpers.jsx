// Helper functions used across go-react //
export function toIndex(row, col, size) { return row*size + col; }
export function toRowCol(i, size) {
    return {
        row: Math.floor(i / size),
        col: i % size
    }
}