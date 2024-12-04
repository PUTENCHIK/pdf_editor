import './DeletePageFormContent.css'

import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function DeletePageFormContent(props) {
    return (
        <>
            <h3>Удаление страницы</h3>

            <form
                    name='delete-page'
                    action="???"
                    method='POST'
                    onSubmit={props.formOnSubmit}
            >
                <InputWithLabel
                    title="Номер страницы:"
                    type="number"
                    name="page_number"
                    min={1}
                    max={props.pageCount}
                    placeholder={`От 1 до ${props.pageCount}`}
                />
                <div className="button-container">
                    <Button
                        type="submit"
                        class="primory"
                        text="Удалить"
                    />
                </div>
            </form>
        </>
    );
}

export default DeletePageFormContent;