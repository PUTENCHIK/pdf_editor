import './AdvantagesBlock.css';
import AdvantageElement from '../AdvantageElement/AdvantageElement';

import advantages from './../../../../helpers/advantagesList';

function AdvantagesBlock() {
    return (
        <main className='section'>
            <div className="container">
                <div className='advantages-block'>
                    {advantages.map(advantage => {
                        return (
                            <AdvantageElement
                                image={advantage.image}
                                title={advantage.title}
                                text={advantage.text}
                                alt={advantage.alt}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

export default AdvantagesBlock;