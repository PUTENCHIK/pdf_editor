export default function roundNumber(num, dec) {
    if (dec < 0 || !dec) {
        dec = 0;
    }
    return Math.round((num + Number.EPSILON) * 10**dec) / 10**dec
}