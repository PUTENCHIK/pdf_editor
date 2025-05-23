export function roundNumber(num, dec) {
    if (dec < 0 || !dec) {
        dec = 0;
    }
    return Math.round((num + Number.EPSILON) * 10**dec) / 10**dec
}

export function downloadFile(object, fileName, isFile=false) {
    if (!isFile)
        object = new File([object], fileName, { type: "application/pdf" });

    const fileURL = URL.createObjectURL(object);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `${fileName}`;
    link.click();
    link.remove();
}