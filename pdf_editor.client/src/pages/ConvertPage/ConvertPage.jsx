import './ConvertPage.css';
import arrow_right from '../../images/common/arrow_right.png'

import Header from "../../components/Header/Header";
import FileAdditor from './components/FileAdditor/FileAdditor';
import ChooseFilesBlock from '../../components/ChooseFilesBlock/ChooseFilesBlock';

function ConvertPage() {
    return (
        <>
            <Header />
            <main className="section">
                <div className="__content">
                    <h1>Конвертировать</h1>
                    <div className="file-additors-block">
                        <FileAdditor />
                        <img src={arrow_right} alt='arrow' />
                        <FileAdditor />
                    </div>
                    <ChooseFilesBlock />
                </div>
            </main>
        </>
    );
}

export default ConvertPage;