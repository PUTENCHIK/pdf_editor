import './DeletePagePage.css'

import Header from '../../components/Header/Header';
import AddFile from '../../components/AddFile/AddFile';

function DeletePagePage() {
    // const [response, setResponse] = useState();

    // useEffect(() => {
    //     deleteRequest();
    // }, []);

    return (
        <>
            <Header />
            <main className='section delete-page'>
                <div className="__content">
                    <h1>Удаление страницы из документа</h1>
                    <p>Описание Описание Описание Описание Описание
                    Описание Описание Описание Описание Описание Описание
                    Описание Описание Описание Описание Описание
                    </p>

                    <form method='POST' action="api/PDF/DeletePage" onSubmit={handlerSubmit}>
                        <input type="file" name="filepdf" className='filepdf' id="" />
                        <input type='number' name='pageNumber' className='pageNumber' placeholder="Номер страницы"/>
                        <button type="submit">Отправить</button>
                    </form>



                    <div className="add-file-container">
                        <form>
                            <AddFile />
                            {/* <Upload></Upload> */}
                        </form>
                    </div>
                </div>
            </main>
        </>
    );

    // async function handlerSubmit(event) {
    //     event.preventDefault();

    //     const fileInput = event.target.querySelector('.filepdf');
    //     const pageInput = event.target.querySelector('.pageNumber');

    //     const file = fileInput.files[0];
    //     const pageNumber = pageInput.value;
    //     console.log(pageNumber);

    //     if (file) {
    //         const result = await deletePageRequest(file, pageNumber);
    //         if (result){
    //             const blob = await result.blob();

    //             const fileURL = URL.createObjectURL(blob);
            
    //             const downloadLink = document.createElement('a');
    //             downloadLink.href = fileURL;
    //             downloadLink.download = 'returned.pdf';
    //             downloadLink.style.display = 'block';
    //             downloadLink.style.fontSize = '30px';
    //             downloadLink.textContent = 'Установить файл';
                
    //             document.body.appendChild(downloadLink);
    //         } else {
    //             console.log("Ошибка загрузки файла");
    //         }
    //     }
    // }

    async function deletePageRequest(file, pageNumber) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pageNumber', pageNumber);

        try {
            const response = await fetch('https://localhost:7199/api/PDF/DeletePage', {
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
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }
}

export default DeletePagePage;