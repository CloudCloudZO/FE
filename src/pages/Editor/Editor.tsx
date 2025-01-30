import React, { useRef, useState } from "react";
import "./Editor.scss";
import Question from "../../components/Editor/question";
import Output from "../../components/Editor/output";
import CodeEditor from "../../components/Editor/codeEditor";
import { useRun } from "../../hooks/useRun";

const Editor: React.FC = () => {
    const editorRef = useRef<any>(null); // CodeEditor의 Monaco Editor 참조
    const remainingTimeRef = useRef<string>(""); // 남은 시간 저장
    const [problemId, setProblemId] = useState<number | null>(null);
    const { runCode } = useRun(); // 코드 실행 훅

    // CodeEditor에서 Monaco Editor와 남은 시간을 전달받는 함수
    const handleCodeEditorMount = (editor: any, time: string) => {
        editorRef.current = editor;
        remainingTimeRef.current = time;
    };

    // Question 컴포넌트에서 problemId를 가져오는 함수
    const handleProblemLoad = (id: number) => {
        setProblemId(id);
    };

    // 실행하기 버튼 클릭 시 호출되는 함수
    const handleRun = async () => {
        if (!editorRef.current) {
            alert("코드 편집기가 로드되지 않았습니다.");
            return;
        }

        if (problemId === null) {
            alert("문제 ID를 가져올 수 없습니다.");
            return;
        }

        const code = editorRef.current.getValue()?.trim();
        const remainingTime = remainingTimeRef.current;

        if (!code) {
            alert("코드를 입력해주세요.");
            return;
        }

        console.log("코드 실행 요청:", { code, remainingTime, problemId });
        await runCode({ code, remainingTime, problemId });
    };

    return (
        <div className="content">
            <div className="question-content">
                <Question onProblemLoad={handleProblemLoad} />
            </div>

            <div className="editor-content">
                <CodeEditor onMount={handleCodeEditorMount} />
                <Output onRun={handleRun} />
            </div>
        </div>
    );
};

export default Editor;
