import './DescriptionBlock.css';
import {Link} from 'react-router-dom';

import ChooseFilesBlock from '../../../../components/ChooseFilesBlock/ChooseFilesBlock';

function DescriptionBlock() {
    return (
        <div className='description-block'>
            <div className='__content'>
                <div className="description">
                    <h1>Веб-редактор <br /> PDF</h1>
                    <p>Редактируйте PDF-файлы легко! Добавляйте текст, изображения и 
                        аннотации. Меняйте содержание по своему усмотрению и сохраняйте 
                        изменения. Упростите свои рабочие процессы!
                    </p>
                </div>
                <Link to='/editor' className='add-files-link'>
                    <ChooseFilesBlock />
                </Link>
            </div>
        </div>
    );
}

export default DescriptionBlock;