import axios from 'axios';
import ssm from '../utils/SessionStorageManager';

const commonError = "Ошибка сервера! Статус ответа:"

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
        }, {
            'responseType': 'blob'
        }
    );
    return response.data;
}

export async function swapPagesRequest(pageFrom, pageTo) {
    const response = await axios.post(
        "https://localhost:7199/api/PDF/swap-pages", {
            fileId: ssm.getFileId(),
            pageFrom: pageFrom,
            pageTo: pageTo,
        }, {
            'responseType': 'blob'
        }
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
        }, {
            'responseType': 'blob'
        }
    );
    return response.data;
}

export async function insertImageRequest(images) {
    let response = null;
    const elements = document.querySelectorAll('.image-container');
    let i = 0;
    for (const image of images) {
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        let koef = 1;
        let number = 1;
        const rect = elements[i].getBoundingClientRect();
        elements[i].style.display = 'none';
        const elementUnderneath = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        if (elementUnderneath && elementUnderneath.id) {
            const match = elementUnderneath.id.match(/\d+/);
            number = match ? parseInt(match[0], 10) : null;
            const rect2 = elementUnderneath.getBoundingClientRect();
            x = rect2.left;  // Координата X элемента
            y = rect2.top;   // Координата Y элемента
            w = rect2.width;  // Координата X элемента
            h = rect2.height;
            koef = 600 / w;
        }
        const pageContainer = document.getElementById("canvas-" + number);
        console.log("number",number);
        if (!pageContainer) {
            console.error(`Контейнер страницы с ID "${number}" не найден.`);
            return null;
        }
        i += 1;
        const formData = new FormData();
        formData.append('imageFile', image.file); // Передаем файл изображения
        // Формируем URL с query parameters
        const url = new URL("https://localhost:7199/api/PDF/insert-image");
        url.searchParams.append('fileId', ssm.getFileId());
        url.searchParams.append('pageNumber', number);
        url.searchParams.append('width', Math.floor(Number((rect.width) * koef)));
        url.searchParams.append('height', Math.floor(Number((rect.height) * koef)));
        url.searchParams.append('x', Math.floor(Number((rect.x - x) * koef)));
        url.searchParams.append('y', Math.floor(Number((rect.y - y) * koef)));
        try {
            response = await axios.post(url.toString(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob',
            });
        } catch (error) {
            if (error.response && error.response.data) {
                // error.response.data — это Blob, нужно прочитать текст
                const blob = error.response.data;
                const text = await blob.text();
                try {
                    const json = JSON.parse(text);
                } catch (e) {
                    console.error('Ошибка при вставке изображения. Не удалось распарсить JSON:', text);
                }
            } else {
                console.error('Ошибка при вставке изображения:', error.message);
            }
        }

    }
    elements.forEach(element => {
        element.remove(); // Удаляем элемент из DOM
    });
    return response.data;
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
        }, {
            'responseType': 'blob'
        }
    );
    return response.data;
}

export async function getFontsRequest() {
    const response = await axios.get(
        "https://localhost:7199/api/PDF/get-fonts"
    );
    return response.data
}