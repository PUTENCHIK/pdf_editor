import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function RotatePagesFormContent(props) {
    return (
        <>
            <h3>Повернуть страницы</h3>

            <form
                    name='rotate-pages'
                    method='POST'
                    onSubmit={props.formOnSubmit}
            >
                <InputWithLabel
                    title="Градусы, кратные 90 (по часовой):"
                    type="number"
                    name="degrees"
                    min={-360}
                    max={360}
                    placeholder={`от -360° до 360°`}
                />
                <div className="button-container">
                    <Button
                        type="submit"
                        class="primory"
                        text="Повернуть"
                    />
                </div>
            </form>
        </>
    );
}

export default RotatePagesFormContent;