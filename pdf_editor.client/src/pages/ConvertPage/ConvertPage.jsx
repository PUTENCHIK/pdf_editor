import './ConvertPage.css';
import arrow_right from '../../images/common/arrow_right.png'
import availableTypes from '../../helpers/availableTypes';

import Header from "../../components/Header/Header";
import Selector from '../../components/Selector/Selector';
import ChooseFilesBlock from '../../components/ChooseFilesBlock/ChooseFilesBlock';

function ConvertPage() {
    return (
        <>
            <Header />
            <main className="section">
                <div className="__content">
                    <h1>Конвертировать</h1>
                    <div className="file-additors-block">
                        <Selector
                            id='in-type'
                            options={availableTypes}
                        />
                        <img src={arrow_right} alt='arrow' />
                        <Selector
                            id='out-type'
                            options={availableTypes}
                        />
                    </div>
                    <div className='choose-files-container'>
                        <ChooseFilesBlock id='id-convert-page' />
                    </div>
                </div>
            </main>
        </>
    );
}

export default ConvertPage;