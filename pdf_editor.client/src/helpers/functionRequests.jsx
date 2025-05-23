import axios from 'axios';
import ssm from '../utils/SessionStorageManager';

export async function startEditingRequest(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        "https://localhost:7199/api/PDF/start-editing",
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data.fileId;
}

export async function deletePageRequest(pageNumber) {
    const response = await axios.post(
        "https://localhost:7199/api/PDF/delete-page", {
            fileId: ssm.getFileId(),
            pageNumber: pageNumber,
        }, { 'responseType': 'blob' }
    );
    return response.data;
}

export async function swapPagesRequest(pageFrom, pageTo) {
    const response = await axios.post(
        "https://localhost:7199/api/PDF/swap-pages", {
            fileId: ssm.getFileId(),
            pageFrom: pageFrom,
            pageTo: pageTo,
        }, { 'responseType': 'blob' }
    );
    return response.data;
}

export async function rotatePagesRequest(isClockwise) {
    const pathes = {
        true: "rotate-pages-right",
        false: "rotate-pages-left",
    }
    const response = await axios.post(
        `https://localhost:7199/api/PDF/${pathes[isClockwise]}`, {
            fileId: ssm.getFileId(),
        }, { 'responseType': 'blob' }
    );
    return response.data;
}

export async function cropPageRequest(pageNumber, x, y, width, height) {
    const response = await axios.post(
        "https://localhost:7199/api/PDF/crop-page", {
            fileId: ssm.getFileId(),
            pageNumber: pageNumber,
            width: width,
            height: height,
            x: x,
            y: y,
        }, { 'responseType': 'blob' }
    );
    return response.data;
}

export async function insertImageRequest(images, pdfDocument) {
    let response = null;
    const elements = document.querySelectorAll('.image-container');
    let i = 0;

    for (const image of images) {
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        let number = 1;

        const rect = elements[i].getBoundingClientRect();
        elements[i].style.display = 'none';
        const elementUnderneath = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        if (elementUnderneath && elementUnderneath.id) {
            const match = elementUnderneath.id.match(/\d+/);
            number = match ? parseInt(match[0], 10) : null;
            if (!number) {
                console.error('Не удалось определить номер страницы');
                return null;
            }
            const rect2 = elementUnderneath.getBoundingClientRect();
            x = rect2.left;
            y = rect2.bottom;
            w = rect2.width;
            h = rect2.height;
        } else {
            console.error('Не найден элемент под изображением');
            return null;
        }
        const page = await pdfDocument.getPage(number);
        const viewport = page.getViewport({ scale: 1 }); // оригинальный размер страницы
        const pageWidth = viewport.width;
        const pageHeight = viewport.height;
        const scaleX = w / pageWidth;
        const scaleY = h / pageHeight;
        const scale = (scaleX + scaleY) / 2;

        const offsetX = rect.left - x;
        const offsetY = y-rect.bottom;
        
        const imageX = offsetX / scale;
        const imageY = (offsetY / scale);
        const imageWidth = rect.width / scale;
        const imageHeight = rect.height / scale;

        i += 1;
        const formData = new FormData();
        formData.append('imageFile', image.file);
        formData.append('fileId', ssm.getFileId()); 
        formData.append('pageNumber', number);
        formData.append('width', Math.floor(imageWidth));
        formData.append('height', Math.floor(imageHeight));
        formData.append('x', Math.floor(imageX));
        formData.append('y', Math.floor(imageY));

        const url = "https://localhost:7199/api/PDF/insert-image";

        response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
        });
    }

    return response?.data || null;
}


export async function combineFilesRequest(file1, file2) {
    const formData = new FormData();
    formData.append('file', file1);
    formData.append('file2', file2);
    const response = await axios.post(
        "https://localhost:7199/api/PDF/combine-pdf-files",
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            'responseType': 'blob',
        }
    );
    return response.data;
}

export async function splitFileRequest(file, page) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        `https://localhost:7199/api/PDF/split-file?breakPageNumber=${page}`,
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/zip'
            },
            'responseType': 'blob',
        }
    );
    return response.data;
}

export async function compressFileRequest(file, compressionRatio) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        `https://localhost:7199/api/PDF/compress-pdf-file?compressionRatio=${compressionRatio}`,
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            'responseType': 'blob',
        }
    );
    return response.data;
}

export async function rotatePageRequest(pageNumber, isClockwise) {
    const pathes = {
        true: "rotate-page-right",
        false: "rotate-page-left",
    }
    const response = await axios.post(
        `https://localhost:7199/api/PDF/${pathes[isClockwise]}`, {
            fileId: ssm.getFileId(),
            pageNumber: pageNumber
        }, { 'responseType': 'blob' }
    );
    return response.data;
}

export async function getFontsRequest() {
    const response = await axios.get(
        "https://localhost:7199/api/PDF/get-fonts"
    );
    return response.data
}

export async function insertTextRequest(withBackground, pageNumber, data) {
    let requestData = {
        fileId: ssm.getFileId(),
        pageNumber: pageNumber,
        text: data.text,
        x: data.x,
        y: data.y,
        fontSize: data.textSize,
        font: data.font,
        isBold: data.isBold,
        isItalic: data.isItalic,
        isUnderline: data.isUnderline,
        
    };
    if (withBackground) {
        requestData.htmlColorCodeText = data.textColor;
        requestData.htmlColorCodeBackground = data.backgroundColor;
    } else {
        requestData.htmlColorCode = data.textColor;
    }
    const pathes = {
        false: "add-text",
        true: "edit-text"
    };
    const response = await axios.post(
        `https://localhost:7199/api/PDF/${pathes[withBackground]}`,
        requestData,
        { 'responseType': 'blob' }
    );
    return response.data;
}

export async function convertWordToPdfRequest(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        `https://localhost:7199/api/PDF/сonvert-word-to-pdf`,
        formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            'responseType': 'blob',
        }
    );
    return response.data;
}