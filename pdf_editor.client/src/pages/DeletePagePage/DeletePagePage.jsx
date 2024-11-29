import './DeletePagePage.css'

import Header from '../../components/Header/Header';
import AddFile from '../../components/AddFile/AddFile';

function DeletePagePage() {
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
}

export default DeletePagePage;