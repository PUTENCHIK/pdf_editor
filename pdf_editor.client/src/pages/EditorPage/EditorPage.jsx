import './EditorPage.css';
import { useRef } from 'react';

import Header from "../../components/Header/Header";
import RightMenu from "./components/RightMenu/RightMenu";
import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';

function EditorPage() {

    const messagesContainer = useRef(null);

    return (
        <>
            <RightMenu />

            <div className="page-content">
                <Header linkRootExists={false} />

                <main className="section editor-page">
                    <h1>Редактор</h1>

                </main>
            </div>
        </>
    );
}

export default EditorPage;