import './CombinePage.css'
import Header from "../../components/Header/Header";
import AddFile from '../../components/AddFile/AddFile';
import Button from '../../components/Button/Button';
import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';
import { combineFilesRequest } from '../../helpers/functionRequests';
import { useRef, useState } from 'react';

const CombinePage = () => {
    const addFileButton1 = useRef(null);
    const addFileButton2 = useRef(null);
    const messagesContainerRef = useRef(null);
    const [fileExists1, setFileExists1] = useState(false);
    const [fileExists2, setFileExists2] = useState(false);
    const [resultFile, setResultFile] = useState(null);

    function hasFileUploaded1(flag) {
        setFileExists1(flag);
    }

    function hasFileUploaded2(flag) {
        setFileExists2(flag);
    }

    async function handleCombineForm(event) {
        event.preventDefault();
        
        let file1, file2;
        try {
            file1 = event.target.file1.files[0];
            file2 = event.target.file2.files[0];
        } catch (error) {
            messagesContainerRef.current.addError("Объединение", "Не получено одно из полей формы: " + error.message);
        }
        
        let result = await combineFilesRequest(file1, file2);
        if (result) {
            messagesContainerRef.current.addMessage("Успех", "Файлы объединены");
            setResultFile(result);
        } else {
            messagesContainerRef.current.addError("Объединение", "Не удалось провести объединение файлов");
        }
    }

    function downloadResultFile() {
        const newFile = new File(
            [resultFile],
            `returned.pdf`,
            {
                type: "application/pdf"
            }
        );
        const fileURL = URL.createObjectURL(newFile);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'combined.pdf';
        link.click();

        link.remove();
    }

    function combineAgain() {
        setResultFile(null);
        setFileExists1(false);
        setFileExists2(false);
    }

    return (
        <>
            <Header />
            <main className="section combine-page">
                <div className="__content">
                    <div className="center-block">
                        <div className="texts">
                            <h1>Объединить PDF файлы</h1>
                            <p className='description'>Объединяйте PDF файлы и упорядочите их легко и быстро в любом порядке, который вам нравится.</p>
                        </div>
                        {
                            resultFile == null &&
                            <div className="files-container">
                                <form name='combine-files' method="POST" onSubmit={handleCombineForm}>
                                    <div className="inputs-box">
                                        <div className="file-input-container">
                                            <AddFile
                                                inputName="file1"
                                                uploaded={hasFileUploaded1}
                                                ref={addFileButton1}
                                            />
                                        </div>
                                        <span className='big-plus'>+</span>
                                        <div className="file-input-container">
                                            <AddFile
                                                inputName="file2"
                                                uploaded={hasFileUploaded2}
                                                ref={addFileButton2}
                                            />
                                        </div>
                                    </div>
                                    {
                                        fileExists1 && fileExists2 &&
                                        <>
                                            <div className='button-container'>
                                                <Button
                                                    type="submit"
                                                    class="danger"
                                                    text="Объединить"
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
                                    <p>Готово! Можете скачать объединённый файл:</p>
                                    <Button
                                        type="button"
                                        class="danger"
                                        text="Скачать"
                                        onClick={downloadResultFile}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    text="Объединить заново"
                                    onClick={combineAgain}
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

export default CombinePage;