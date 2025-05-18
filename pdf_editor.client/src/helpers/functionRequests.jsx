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

export async function rotatePagesRequest(degrees) {
    const response = await axios.post(
        "https://localhost:7199/api/PDF/rotate-pages", {
            fileId: ssm.getFileId(),
            degrees: degrees,
        }, {
            'responseType': 'blob'
        }
    );
    return response.data;
}

export async function cropPageRequest(pageNumber, width, height, x, y) {
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

export async function insertImageRequest(imageFile, pageNumber, width, height, x, y) {
    const formData = new FormData();
    formData.append('fileId', ssm.getFileId());
    formData.append('imageFile', imageFile);
    formData.append('pageNumber', pageNumber);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('x', x);
    formData.append('y', y);
    console.log(imageFile, pageNumber, width, height, x, y);
    
    const response = await axios.post(
        "https://localhost:7199/api/PDF/InsertImage",
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            'responseType': 'blob',
        }
    );
    return response.data;
}

export async function combineFiles(file1, file2) {
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

export async function splitFile(file, page) {
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