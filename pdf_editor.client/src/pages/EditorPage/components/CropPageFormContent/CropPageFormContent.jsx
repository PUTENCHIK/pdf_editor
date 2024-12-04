import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function CropPageFormContent(props) {
    return (
        <>
            <h3>Обезать страницу</h3>

            <form
                    name='crop-page'
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
                <p>От левого нижнего угла:</p>
                <div className="start-coordinates">
                    <InputWithLabel
                        title="X:"
                        type="number"
                        name="x"
                        min={0}
                        // max={props.pageWidth}
                        placeholder={`от 0`}
                    />
                    <InputWithLabel
                        title="Y:"
                        type="number"
                        name="y"
                        min={0}
                        // max={props.pageHeight}
                        placeholder={`от 0`}
                    />
                </div>
                <div className="crop-sizes">
                    <InputWithLabel
                        title="Ширина:"
                        type="number"
                        name="width"
                        min={0}
                        // max={props.pageWidth}
                        placeholder={`от 0`}
                    />
                    <InputWithLabel
                        title="Высота:"
                        type="number"
                        name="height"
                        min={0}
                        // max={props.pageHeight}
                        placeholder={`от 0`}
                    />
                </div>
                <div className="button-container">
                    <Button
                        type="submit"
                        class="primory"
                        text="Обрезать"
                    />
                </div>
            </form>
        </>
    );
}

export default CropPageFormContent;