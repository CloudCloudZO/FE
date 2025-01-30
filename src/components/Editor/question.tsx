import React, { useEffect } from "react";
import { useFetchProblem } from "../../hooks/useFetchProblem";
import "./question.scss";

interface QuestionProps {
    onProblemLoad: (id: number) => void;
}

const Question: React.FC<QuestionProps> = ({ onProblemLoad }) => {
    const { problem, loading, error } = useFetchProblem();

    useEffect(() => {
        if (problem) {
            onProblemLoad(problem.problemId);
        }
    }, [problem, onProblemLoad]);

    if (loading) {
        return <div className="question">문제를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="question error">{error}</div>;
    }

    return (
        <div className="question">
            {problem ? (
                <>
                    <h2>문제 {problem.problemId}</h2>
                    <div>{problem.problemContent}</div>
                </>
            ) : (
                <div>문제를 찾을 수 없습니다.</div>
            )}
        </div>
    );
};

export default Question;
