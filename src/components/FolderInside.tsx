import React, { useState, useEffect, useRef } from 'react';
import '../style/FolderInside.css';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import TxtFile from './TxtFile';
import ImageViewer from './ImageViewer';
import ReactDOM from 'react-dom';

gsap.registerPlugin(Draggable);

let highestZIndex = 2000;
let windowOffset = 0;

type Props = {
    id: string;
    name: string;
    files: any[];
    onClose: () => void;
    onDelete?: () => void;
};

function FolderInside({ id, name, files, onClose, onDelete }: Props) {
    const [openFiles, setOpenFiles] = useState<string[]>([]);
    const windowRef = useRef<HTMLDivElement>(null);
    
    const [position] = useState({
        top: 100 + (windowOffset % 100), 
        left: 100 + (windowOffset % 100)
    });

    useEffect(() => {
        if (windowRef.current) {
            gsap.fromTo(windowRef.current, 
                { opacity: 0, scale: 0.8 }, 
                { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );

            windowOffset += 20;
            highestZIndex++;
            gsap.set(windowRef.current, { zIndex: highestZIndex });

            Draggable.create(windowRef.current, {
                bounds: ".screen",
                trigger: windowRef.current.querySelector(".folder-head"),
                onPress: function() {
                    highestZIndex++;
                    gsap.set(this.target, { zIndex: highestZIndex });
                }
            });
        }
    }, []);

    const handleDoubleClick = (fileId: string) => {
        if (!openFiles.includes(fileId)) {
            setOpenFiles((prev) => [...prev, fileId]);
        }
    };

    const closeFile = (fileId: string) => {
        setOpenFiles((prev) => prev.filter(fId => fId !== fileId));
    };

    const handleCloseFolder = () => {
        if (windowRef.current) {
            gsap.to(windowRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                onComplete: onClose
            });
        } else {
            onClose();
        }
    };

    const getFileIcon = (file: any) => {
        switch(file.type) {
            case 'txt':
                return '/txt-file.png';
            case 'img':
                return '/image-icon.png';
            case 'folder':
                return '/folder.png';
            default:
                return '/txt-file.png';
        }
    };

    return (
        <>
            <div 
                ref={windowRef}
                id={`folder-window-${id}`}
                className="folder-inside" 
                style={{ 
                    top: `${position.top}px`, 
                    left: `${position.left}px`, 
                    position: 'absolute'
                }}
            >
                <div className='folder-head'>
                    <span className='lable'>{name}</span>
                    <button className='close-btn' onClick={handleCloseFolder}>X</button>
                </div>
                
                <div className='folder-toolbar'>
                    <button className='toolbar-btn'>New File</button>
                    <button className='toolbar-btn'>New Folder</button>
                </div>
                
                <div className='folder-content'>
                    <div className='side-feald'>
                        <span>Desktop</span>
                        <span>My PC</span>
                        <span>Documents</span>
                    </div>
                    
                    <div className='folder-items'>
                        {files.length === 0 ? (
                            <p className='empty-msg'>This folder is empty</p>
                        ) : (
                            files.map((file: any) => (
                                <div 
                                    key={file.id}
                                    className='folder-item' 
                                    onDoubleClick={() => handleDoubleClick(file.id)}
                                >
                                    <img src={getFileIcon(file)} alt={file.type} />
                                    <p>{file.name}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {files
                .filter((file: any) => openFiles.includes(file.id) && file.type === 'txt')
                .map((file: any) => (
                    <TxtFile 
                        key={file.id}
                        id={file.id} 
                        name={file.name} 
                        content={file.content || ""}
                        onClose={() => closeFile(file.id)} 
                    />
                ))
            }

            {files
                .filter((file: any) => openFiles.includes(file.id) && file.type === 'img')
                .map((file: any) => (
                    <ImageViewer 
                        key={file.id}
                        id={file.id} 
                        name={file.name} 
                        src={file.src}
                        onClose={() => closeFile(file.id)} 
                    />
                ))
            }
        </>
    );
}

export default FolderInside;