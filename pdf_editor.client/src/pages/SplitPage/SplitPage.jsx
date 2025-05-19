import './SplitPage.css'
import Header from '../../components/Header/Header';
import AddFile from '../../components/AddFile/AddFile';
import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';
import InputWithLabel from '../../components/InputWithLabel/InputWithLabel';
import Button from '../../components/Button/Button';

import { splitFileRequest } from '../../helpers/functionRequests';
import { useRef, useState } from 'react';

const SplitPage = () => {
    const addFileButton = useRef(null);
    const messagesContainerRef = useRef(null);
    const [fileExists, setFileExists] = useState(false);
    const [resultFile, setResultFile] = useState(null);

    function hasFileUploaded(flag) {
        setFileExists(flag);
    }

    async function handleSplitForm(event) {
        event.preventDefault();

        let file, page;
        try {
            file = event.target.file.files[0];
            page = event.target.page_number.value;
        } catch (error) {
            messagesContainerRef.current.addError("Разделение", "Не получено одно из полей формы: " + error.message);
        }

        if (page < 2) {
            messagesContainerRef.current.addError("Разделение", "Нельзя указывать первую или более раннюю страницу");
        } else {
            try {
                let result = await splitFileRequest(file, page);
                if (result) {
                    messagesContainerRef.current.addMessage("Успех", "Файлы разделены");
                    setResultFile(result);
                } else {
                    messagesContainerRef.current.addError("Разделение", "Не удалось провести разделение файлов");
                }
            } catch (error) {
                messagesContainerRef.current.addError("Разделение", "Указанная страница не существует в документе");
            }
        }
    }

    function downloadResultFile() {
        const fileName = "splitted.zip";
        const newFile = new File(
            [resultFile],
            fileName,
            {
                type: "application/zip"
            }
        );
        const fileURL = URL.createObjectURL(newFile);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = fileName;
        link.click();

        link.remove();
    }

    function splitAgain() {
        setResultFile(null);
        setFileExists(false);
    }

    return (
        <>
            <Header />
            <main className="section split-page">
                <div className="__content">
                    <div className="center-block">
                        <div className="texts">
                            <h1>Разделить PDF файл</h1>
                            <p className='description'>Быстро разделите ваш PDF файл на две части</p>
                        </div>
                        {
                            resultFile == null &&
                            <div className="files-container">
                                <form name='split-file' method="POST" onSubmit={handleSplitForm}>
                                    <div className="inputs-box">
                                        <AddFile
                                            uploaded={hasFileUploaded}
                                            ref={addFileButton}
                                        />
                                    </div>
                                    {
                                        fileExists &&
                                        <>
                                            <InputWithLabel
                                                labelType="horizontal"
                                                title="Введите номер страницы, с которой начнётся второй файл:"
                                                type="number"
                                                name="page_number"
                                                min="2"
                                            />
                                            <div className='button-container'>
                                                <Button
                                                    type="submit"
                                                    class="danger"
                                                    text="Разделить"
                                                />
                                            </div>
                                        </>
                                    }
                                </form>
                            </div>
                        }
                        {
                            resultFile != null &&
                            <>
                                <div className="result-container">
                                    <p>Готово! Можете скачать архив с разделёнными файлами:</p>
                                    <Button
                                        type="button"
                                        class="danger"
                                        text="Скачать"
                                        onClick={downloadResultFile}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    text="Разделить заново"
                                    onClick={splitAgain}
                                />
                            </>
                        }
                    </div>
                </div>
            </main>
            <MessageBlocksContainer ref={messagesContainerRef} />
        </>
    );
};

export default SplitPage;