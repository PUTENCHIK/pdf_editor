import './RightMenu.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ToolButton from '../ToolButton/ToolButton';
import rightMenuTools from '../../../../helpers/rightMenuTools'

function RightMenu() {

    const [activeTool, setActiveTool] = useState("");



    return (
        <div className="right-menu">
            <div className="link-root-container">
                <Link to="/">
                    <div className="link-root"></div>
                </Link>
            </div>
            <div className="__content">
                {rightMenuTools.map((tool) => {
                    return (
                        <div className="tool-button-container" onClick={() => {setActiveTool(tool.name)}}>
                            <ToolButton
                                href={"/editor/" + tool.name}
                                icon={activeTool == tool.name ? tool.icon_active : tool.icon}
                                icon_active={tool.icon_active}
                                name={tool.name}
                                isActive={activeTool == tool.name}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default RightMenu;