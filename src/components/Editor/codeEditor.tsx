import React, { useEffect, useRef, useState } from "react";
import "./codeEditor.scss";
import { useTimer } from "../../hooks/useTimer";
import ModalTimer from "../Modal/modalTimer";
import Editor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
    onMount: (editor: any, time: string) => void; // Monaco Editor와 남은 시간을 전달
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onMount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditorDisabled, setIsEditorDisabled] = useState(false);
    const editorRef = useRef<any>(null); // Monaco Editor 참조

    const { time } = useTimer({
        initialTime: 20 * 60, // 20분
        onFiveMinutesLeft: () => {
            setIsModalOpen(true);
            setTimeout(() => setIsModalOpen(false), 3000);
        },
        onTimeEnd: () => {
            setIsEditorDisabled(true); // 에디터 비활성화
        },
    });

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#1E1E1E",
                "editor.lineHighlightBackground": "#2E2E2E",
            },
        });
        monaco.editor.setTheme("custom-dark");

        onMount(editor, formatTime(time));
    };

    useEffect(() => {
        if (editorRef.current) {
            onMount(editorRef.current, formatTime(time)); // 상위 컴포넌트로 업데이트 전달
        }
    }, [time, onMount]);

    return (
        <>
            <div className="code-editor">
                <div className="timer">남은 시간 {formatTime(time)}</div>
                <div className="editor">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        defaultValue="// 여기에 코드를 입력하세요"
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            readOnly: isEditorDisabled,
                        }}
                        onMount={handleEditorDidMount}
                    />
                </div>
            </div>
            <ModalTimer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default CodeEditor;
