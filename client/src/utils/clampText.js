const clampText = (text, maxLength = 50) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength - 3) + "...";
    } else {
        return text;
    }
}

export {clampText}