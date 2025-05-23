import { useRef, useState } from "react";
import './ConvertPage.css';

import Header from "../../components/Header/Header";
import AddFile from "../../components/AddFile/AddFile";
import Button from "../../components/Button/Button";
import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';
import { convertWordToPdfRequest } from "../../helpers/functionRequests";
import { downloadFile } from '../../helpers/functions';

function ConvertPage() {
    const addFileButton = useRef(null);
    const messagesContainerRef = useRef(null);
    const [fileExists, setFileExists] = useState(false);
    const [resultFile, setResultFile] = useState(null);

    function hasFileUploaded(flag) {
        setFileExists(flag);
    }

    async function handleConvertForm(event) {
        event.preventDefault();

        let file;
        try {
            file = event.target.file.files[0];
        } catch (error) {
            messagesContainerRef.current.addError("Конвертация", "Не удалось получить файл из формы");
        }
        let result = await convertWordToPdfRequest(file);
        if (result) {
            messagesContainerRef.current.addMessage("Успех", "Файл конвертирован");
            setResultFile(result);
        } else {
            messagesContainerRef.current.addError("Конвертация", "Не удалось провести конвертацию файла");
        }
    }

    function downloadResultFile() {
        downloadFile(resultFile, "converted.pdf");
    }

    function convertAgain() {
        setResultFile(null);
        setFileExists(false);
    }

    return (
        <>
            <Header />
            <main className="section convert-page">
                <div className="__content">
                    <div className="center-block">
                        <div className="texts">
                            <h1>Конвертировать файл в PDF</h1>
                            <p className='description'>
                                Быстрая и удобная конвертация документа из .doc в .pdf формат
                            </p>
                        </div>
                        { !resultFile &&
                            <div className="files-container">
                                <form name='convert-file' method="POST" onSubmit={handleConvertForm}>
                                    <div className="inputs-box">
                                        <AddFile
                                            accept_types="word"
                                            uploaded={hasFileUploaded}
                                            ref={addFileButton}
                                        />
                                    </div>
                                    { fileExists &&
                                        <div className='button-container'>
                                            <Button
                                                type="submit"
                                                class="danger"
                                                text="Конвертировать"
                                            />
                                        </div>
                                    }
                                </form>
                            </div>
                        }
                        { resultFile &&
                            <>
                                <div className="result-container">
                                    <p>Готово! Можете скачать конвертированный файл:</p>
                                    <Button
                                        type="button"
                                        class="danger"
                                        text="Скачать"
                                        onClick={downloadResultFile}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    text="Конвертировать заново"
                                    onClick={convertAgain}
                                />
                            </>
                        }
                    </div>
                </div>
            </main>
            <MessageBlocksContainer ref={messagesContainerRef} />
        </>
    );
}

export default ConvertPage;