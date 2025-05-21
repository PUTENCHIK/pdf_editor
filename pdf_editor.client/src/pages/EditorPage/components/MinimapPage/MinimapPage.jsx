import './MinimapPage.css'
import arrow_counterclockwise from '../../../../images/common/arrow_counterclockwise.svg'
import delete_icon from '../../../../images/common/delete_icon_active.svg'
import DocumentPage from '../../../../components/DocumentPage/DocumentPage';
import ToolButton from '../ToolButton/ToolButton';

const MinimapPage = (props) => {
    function handleDeletePage() {
        props.onDeletePage(props.pageNumber);
    }

    function handleRotatePage() {
        props.onRotatePage(props.pageNumber, false);
    }

    return (
        <div className="minimap-page-container">
            <DocumentPage
                page={props.page}
                pageNumber={props.pageNumber}
                pageWidth={props.pageWidth}
                isCurrent={props.isCurrent}
            />
            <div className="low-panel">
                <ToolButton
                    icon={arrow_counterclockwise}
                    alt="rotate"
                    title={`Повернуть страницу ${props.pageNumber} против часовой стрелки`}
                    onClick={handleRotatePage}
                />
                {props.pageNumber}
                <ToolButton
                    icon={delete_icon}
                    alt="delete"
                    title={`Удалить страницу ${props.pageNumber}`}
                    onClick={handleDeletePage}
                />
            </div>
        </div>
    );
}

export default MinimapPage;