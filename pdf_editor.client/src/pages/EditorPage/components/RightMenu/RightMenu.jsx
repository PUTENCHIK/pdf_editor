import './RightMenu.css'
import { useState, forwardRef, useImperativeHandle, useEffect, act } from 'react';
import { Link } from 'react-router-dom';

import ToolButton from '../ToolButton/ToolButton';
import rightMenuTools from '../../../../helpers/rightMenuTools'

const RightMenu = forwardRef((props, ref) => {

    const [activeTool, setActiveTool] = useState(props.activeTool);

    useEffect(() => {
        if (activeTool) {
            props.onClick();
        }
    }, [activeTool]);

    useImperativeHandle(ref, () => {
        return {
            getActiveTool() {
                return activeTool;
            }
        }
    });

    return (
        <div className="right-menu">
            <div className="link-root-container">
                <Link to="/">
                    <div className="link-root"></div>
                </Link>
            </div>

            {props.showTools &&
                <div className="__content">
                    {rightMenuTools.map((tool) => {
                        return (
                            <div className="tool-button-container" onClick={() => {setActiveTool(tool.name)}}>
                                <ToolButton
                                    icon={activeTool == tool.name ? tool.icon_active : tool.icon}
                                    icon_active={tool.icon_active}
                                    name={tool.name}
                                    title={tool.title}
                                    isActive={activeTool == tool.name || props.activeTool == tool.name }
                                />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
});

export default RightMenu;