const commonError = "Ошибка сервера! Статус ответа:"

export async function deletePageRequest(file, pageNumber) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageNumber', pageNumber);

    const response = await fetch('https://localhost:7199/api/PDF/DeletePage', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || commonError + response.status;
        throw new Error(errorMessage);
    }

    const data = await response;
    return data;
}

export async function swapPagesRequest(file, pageFrom, pageTo) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageFrom', pageFrom);
    formData.append('pageTo', pageTo);

    const response = await fetch('https://localhost:7199/api/PDF/SwapPages', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || commonError + response.status;
        throw new Error(errorMessage);
    }

    const data = await response;
    return data;
}

export async function rotatePagesRequest(file, degrees) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('degrees', degrees);

    const response = await fetch('https://localhost:7199/api/PDF/RotatePages', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || commonError + response.status;
        throw new Error(errorMessage);
    }

    const data = await response;
    return data;
}

export async function cropPageRequest(file, pageNumber, width, height, x, y) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageNumber', pageNumber);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('x', x);
    formData.append('y', y);

    const response = await fetch('https://localhost:7199/api/PDF/CropPage', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response;
    return data;
}

export async function insertImageRequest(file, imageFile, pageNumber, width, height, x, y) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageFile', imageFile);
    formData.append('pageNumber', pageNumber);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('x', x);
    formData.append('y', y);    

    const response = await fetch('https://localhost:7199/api/PDF/InsertImage', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response;
    console.log('Success:', data);
    return data;
}