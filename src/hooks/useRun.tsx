import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

interface RunData {
    code: string;
    remainingTime: string;
    problemId: number;
}

export const useRun = () => {
    const runCode = async (data: RunData): Promise<void> => {
        try {
            const API_URL = `/api/problem?id=${data.problemId}`;
            console.log("API 요청 URL:", API_URL);

            const response = await axiosInstance.post(API_URL, {
                code: data.code,
                remainingTime: data.remainingTime,
            });

            console.log("서버 응답:", response.data);
            alert("코드가 성공적으로 실행되었습니다.");
        } catch (error: any) {
            console.error("코드 실행 실패:", error);

            if (axios.isAxiosError(error)) {
                alert(
                    `코드 실행 중 오류가 발생했습니다: ${
                        error.response?.data?.message || error.message
                    }`
                );
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return { runCode };
};
