import './DescriptionBlock.css';
import img_add_file from '../../../../images/common/add_file.png';

import {Link} from 'react-router-dom';

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
                <Link to='/editor' className='add-files-block'>
                    <div className='background'>
                        <svg width="541" height="413" viewBox="0 0 541 413" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M292.938 7.02217C344.758 16.876 379.595 58.15 419.742 93.1807C466.018 133.559 536.835 161.09 540.791 223.287C544.799 286.319 490.558 339.618 437.445 371.557C394.243 397.537 342.474 364.809 292.938 372.334C224.067 382.796 125.578 434.609 63.2374 402.805C-4.32472 368.337 -1.25305 300.676 0.782314 223.287C2.77906 147.366 48.4117 78.4203 108.441 33.9844C160.812 -4.78258 229.442 -5.05216 292.938 7.02217Z" fill="#F14925" fill-opacity="0.8"/>
                        </svg>
                    </div>
                    <div className="choose-files-button">
                        <div className="__content">
                            <img className='icon local' src={img_add_file} alt='add' />
                            <span>Выберите файлы</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default DescriptionBlock;