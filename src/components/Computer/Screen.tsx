import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import pcData from '../../data/pc.json';
// @ts-ignore: CSS import without type declarations
import '../../style/Screen.css';
import RightClickFeald from './RightClickFeald';
import Folder from './Folder';
import File from './File';
import Widget, { CalendarWidget, ClockWidget, SystemMonitorWidget } from './Widget';
import { Calendar } from 'lucide-react';
import Chat from './Chat';

gsap.registerPlugin(Draggable);

function Screen() {
    const navRef = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem('pc_files');
        const defaultFiles = pcData.Screen?.textfile || [];
        console.log('Initial files:', defaultFiles);
        return saved ? JSON.parse(saved) : defaultFiles;
    });

    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem('pc_folders');
        const defaultFolders = pcData.Screen?.folder || [];
        console.log('Initial folders from JSON:', defaultFolders);
        const result = saved ? JSON.parse(saved) : defaultFolders;
        console.log('Final folders state:', result);
        return result;
    });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);

    useEffect(() => {
        console.log('Current folders state:', folders);
        console.log('Current files state:', files);
    }, [folders, files]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMousePosition({ x: e.pageX, y: e.pageY });
        setShowContextMenu(true);
    };

    const handleClick = () => {
        if (showContextMenu) setShowContextMenu(false);
    };

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power3.out" }
        );

        Draggable.create("#my-pc", { bounds: ".screen" });
    }, []);

    const createNewFile = (position: { x: number; y: number }) => {
        const newFile = {
            id: `txt-file-${Date.now()}`,
            name: `New File ${files.length + 1}.txt`,
            position: {
                top: position.y,
                left: position.x
            },
            content: "This is a new file. Edit me!"
        };

        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        localStorage.setItem('pc_files', JSON.stringify(updatedFiles));
        setShowContextMenu(false);
    };

    const createNewFolder = (position: { x: number; y: number }) => {
        const newFolder = {
            id: `folder-${Date.now()}`,
            name: `New Folder ${folders.length + 1}`,
            position: {
                top: position.y,
                left: position.x
            },
            files: []
        };

        const updatedFolders = [...folders, newFolder];
        console.log('Creating new folder, updated folders:', updatedFolders);
        setFolders(updatedFolders);
        localStorage.setItem('pc_folders', JSON.stringify(updatedFolders));
        setShowContextMenu(false);
    };

    const refreshScreen = () => {
        localStorage.removeItem('pc_files');
        localStorage.removeItem('pc_folders');

        const defaultFiles = pcData.Screen?.textfile || [];
        const defaultFolders = pcData.Screen?.folder || [];

        console.log('Refreshing - folders from JSON:', defaultFolders);

        setFiles(defaultFiles);
        setFolders(defaultFolders);
        setShowContextMenu(false);
    };

    const deleteFile = (id: string) => {
        const updatedFiles = files.filter((f: any) => f.id !== id);
        setFiles(updatedFiles);
        localStorage.setItem('pc_files', JSON.stringify(updatedFiles));
    };

    const deleteFolder = (id: string) => {
        const updatedFolders = folders.filter((f: any) => f.id !== id);
        setFolders(updatedFolders);
        localStorage.setItem('pc_folders', JSON.stringify(updatedFolders));
    };

    const updateFileContent = (id: string, newContent: string) => {
        const updatedFiles = files.map((f: any) =>
            f.id === id ? { ...f, content: newContent } : f
        );
        setFiles(updatedFiles);
        localStorage.setItem('pc_files', JSON.stringify(updatedFiles));
    };

    const renameFile = (id: string, newName: string) => {
        const updatedFiles = files.map((f: any) =>
            f.id === id ? { ...f, name: newName } : f
        );
        setFiles(updatedFiles);
        localStorage.setItem('pc_files', JSON.stringify(updatedFiles));
    };

    const renameFolder = (id: string, newName: string) => {
        const updatedFolders = folders.map((f: any) =>
            f.id === id ? { ...f, name: newName } : f
        );
        setFolders(updatedFolders);
        localStorage.setItem('pc_folders', JSON.stringify(updatedFolders));
    };

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [showContextMenu]);

    console.log('Rendering Screen, folders count:', folders.length);

    return (
        <div className="screen" onContextMenu={handleContextMenu}>
            <div className="monitor-content">

                <Chat />

                <Widget position={{ x: 1600, y: 100 }} size={{ width: 200, height: 150 }} title='Stiker' content='To do: find new hobby, go to gym, read book' style={undefined} />
                <CalendarWidget position={{ x: 1350, y: 600 }} size={{ width: 500, height: 300 }} title='Calendar' content={null} style={undefined} />
                <ClockWidget position={{ x: 850, y: 200 }} size={{ width: 220, height: 100 }} />
                <SystemMonitorWidget position={{ x: 1600, y: 400 }} size={{ width: 240, height: 130 }} />

                <div id="my-pc" className='icons pc'>
                    <img src="/my-pc.png" alt="My PC Icon" />
                    <p>My PC</p>
                </div>

                {folders.length === 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '50px',
                        left: '10px',
                        color: 'red',
                        background: 'white',
                        padding: '10px',
                        zIndex: 10000
                    }}>
                        ⚠️ No folders loaded! Check console.
                    </div>
                )}

                {folders.map((folder: any) => {
                    console.log('Rendering folder:', folder);
                    return (
                        <Folder
                            key={folder.id}
                            id={folder.id}
                            name={folder.name}
                            position={folder.position}
                            files={folder.files || []}
                            onDelete={() => deleteFolder(folder.id)}
                            onRename={(newName) => renameFolder(folder.id, newName)}
                        />
                    );
                })}

                {files.map((file: any) => (
                    <File
                        key={file.id}
                        id={file.id}
                        name={file.name}
                        position={file.position}
                        content={file.content}
                        onDelete={() => deleteFile(file.id)}
                        onSave={(newContent) => updateFileContent(file.id, newContent)}
                        onRename={(newName) => renameFile(file.id, newName)}
                    />
                ))}

                {showContextMenu && (
                    <RightClickFeald
                        position={mousePosition}
                        onCreateFile={() => createNewFile(mousePosition)}
                        onCreateFolder={() => createNewFolder(mousePosition)}
                        onRefresh={refreshScreen}
                    />
                )}
            </div>

            <div ref={navRef} className='navigation-panel'>
                <div className="start-btn">
                    <div className="start-icon-grid">
                        <span></span><span></span><span></span><span></span>
                    </div>
                </div>
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Пошук" disabled />
                </div>
                <div className="taskbar-apps">
                </div>
            </div>
        </div>
    );
}

export default Screen;