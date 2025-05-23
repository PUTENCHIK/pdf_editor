import { useRef, useState } from "react";
import './CompressPage.css'
import Header from "../../components/Header/Header";
import AddFile from "../../components/AddFile/AddFile";
import InputWithLabel from "../../components/InputWithLabel/InputWithLabel";
import Button from "../../components/Button/Button";
import MessageBlocksContainer from "../../components/MessageBlocksContainer/MessageBlocksContainer";
import { compressFileRequest } from "../../helpers/functionRequests";
import { downloadFile } from '../../helpers/functions';

const CompressPage = () => {
    const addFileButton = useRef(null);
    const messagesContainerRef = useRef(null);
    const [fileExists, setFileExists] = useState(false);
    const [resultFile, setResultFile] = useState(null);

    function hasFileUploaded(flag) {
        setFileExists(flag)
    }

    async function handleCompressForm(event) {
        event.preventDefault();

        let file, ratio;
        try {
            file = event.target.file.files[0];
            ratio = event.target.ratio.value;
        } catch (error) {
            messagesContainerRef.current.addError("Сжатие", "Не получено одно из полей формы: " + error.message);
        }

        if (ratio < 1 || ratio > 9) {
            messagesContainerRef.current.addError("Сжатие", "Степень сжатия должна быть в пределах от 1 до 9");
        } else {
            let result = await compressFileRequest(file, ratio);
            if (result) {
                messagesContainerRef.current.addMessage("Успех", "Файл сжат");
                setResultFile(result);
            } else {
                messagesContainerRef.current.addError("Сжатие", "Не удалось провести сжатие файла");
            }
        }
    }

    function downloadResultFile() {
        downloadFile(resultFile, "compressed.pdf");
    }

    function compressAgain() {
        setResultFile(null);
        setFileExists(false);
    }

    return (
        <>
            <Header />
            <main className="section compress-page">
                <div className="__content">
                    <div className="center-block">
                        <div className="texts">
                            <h1>Сжать PDF файл</h1>
                            <p className='description'>Добавьте свой PDF документ и укажите степень сжатия, чтобы приложение можно уменьшить размер файла</p>
                        </div>
                        { resultFile == null &&
                            <div className="files-container">
                                <form name='compress-file' method="POST" onSubmit={handleCompressForm}>
                                    <div className="inputs-box">
                                        <AddFile
                                            uploaded={hasFileUploaded}
                                            ref={addFileButton}
                                        />
                                    </div>
                                    { fileExists &&
                                        <>
                                            <InputWithLabel
                                                labelType="horizontal"
                                                title="Введите желаемую степень сжатия:"
                                                type="number"
                                                name="ratio"
                                                placeholder="[1-9]"
                                            />
                                            <div className='button-container'>
                                                <Button
                                                    type="submit"
                                                    class="danger"
                                                    text="Сжать"
                                                />
                                            </div>
                                        </>
                                    }
                                </form>
                            </div>
                        }
                        { resultFile != null &&
                            <>
                                <div className="result-container">
                                    <p>Готово! Можете скачать сжатый файл:</p>
                                    <Button
                                        type="button"
                                        class="danger"
                                        text="Скачать"
                                        onClick={downloadResultFile}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    text="Сжать заново"
                                    onClick={compressAgain}
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

export default CompressPage;