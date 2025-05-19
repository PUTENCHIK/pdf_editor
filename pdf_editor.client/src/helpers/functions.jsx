export default function roundNumber(num, dec) {
    if (dec < 1 || !dec) {
        dec = 1;
    }
    return Math.round((num + Number.EPSILON) * 10**dec) / 10**dec
}