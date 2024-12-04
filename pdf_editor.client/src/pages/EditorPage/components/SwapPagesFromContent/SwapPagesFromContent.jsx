import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function SwapPagesFromContent(props) {
    return (
        <>
            <h3>Поменять страницы местами</h3>

            <form
                    name='swap-pages'
                    method='POST'
                    onSubmit={props.formOnSubmit}
            >
                <InputWithLabel
                    title="Номер первой страницы:"
                    type="number"
                    name="page_1"
                    min={1}
                    max={props.pageCount}
                    placeholder={`От 1 до ${props.pageCount}`}
                />
                <InputWithLabel
                    title="Номер второй страницы:"
                    type="number"
                    name="page_2"
                    min={1}
                    max={props.pageCount}
                    placeholder={`От 1 до ${props.pageCount}`}
                />
                <div className="button-container">
                    <Button
                        type="submit"
                        class="primory"
                        text="Поменять"
                    />
                </div>
            </form>
        </>
    );
}

export default SwapPagesFromContent;