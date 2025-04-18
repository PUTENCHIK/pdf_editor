class SessionStorageManager {
    constructor() {
        this.name = "pdf_editor_session";
        this.init();
    }

    init() {
        sessionStorage[this.name] = JSON.stringify({
            'fileId': null
       });
    }

    json() {
        return JSON.parse(sessionStorage[this.name]);
    }

    getFileId() {
        return this.json().fileId;
    }

    setFileId(newId) {
        let storage = this.json();
        storage.fileId = newId;
        sessionStorage[this.name] = JSON.stringify(storage);
    }
}

const ssm = new SessionStorageManager();

export default ssm;