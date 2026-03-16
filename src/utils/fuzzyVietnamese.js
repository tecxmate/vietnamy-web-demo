// Vietnamese text comparison with diacritics tolerance

export function stripDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd');
}

// Strip trailing punctuation so "Cảm ơn" matches "Cảm ơn!" etc.
function stripPunctuation(str) {
    return str.replace(/[.!?，。！？]+$/g, '').trim();
}

export function checkVietnameseInput(userInput, expected, expectedNoDiacritics) {
    const trimmedInput = userInput.trim().toLowerCase();
    const trimmedExpected = expected.trim().toLowerCase();

    // Exact match (with punctuation)
    if (trimmedInput === trimmedExpected) {
        return { exact: true, fuzzy: true };
    }

    // Exact match ignoring trailing punctuation
    if (stripPunctuation(trimmedInput) === stripPunctuation(trimmedExpected)) {
        return { exact: true, fuzzy: true };
    }

    const strippedExpected = expectedNoDiacritics
        ? expectedNoDiacritics.trim().toLowerCase()
        : stripDiacritics(trimmedExpected);
    const strippedInput = stripDiacritics(trimmedInput);

    // Fuzzy match (no diacritics)
    if (strippedInput === strippedExpected) {
        return { exact: false, fuzzy: true };
    }

    // Fuzzy match ignoring trailing punctuation
    if (stripPunctuation(strippedInput) === stripPunctuation(strippedExpected)) {
        return { exact: false, fuzzy: true };
    }

    return { exact: false, fuzzy: false };
}
