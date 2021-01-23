export function array_union(a,b) {
    let obj = {}; // dictionary to weed out duplicates
    for (let i = 0; i < a.length; i++) {
        obj[a[i]] = a[i];
    }
    for (let i = 0; i < b.length; i++) {
        obj[b[i]] = b[i];
    }
    // take objects from dictionary and create array
    const result = [];
    for (let k in obj) {
        result.push(obj[k]);
    }
    return result;
}

export function array_difference(a,b) {
    let count = {};
    let obj = {};
    for (const a_i of a) {
        obj[a_i] = a_i;
        count[a_i] = 1;
    }
    for (const b_i of b) {
        obj[b_i] = b_i;
        count[b_i] = count[b_i] + 1;
    }
    // take objects from dictionary and create array
    const diff = [];
    for (let k in obj) {
        // only return single-instance elements
        if (count[k] === 1) diff.push(obj[k]);
    }
    return diff;
}