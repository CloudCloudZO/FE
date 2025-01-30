import axios from "axios";

// 혹시 URL 앞에 https 안 붙은 문제인가...? 싶어서 시도
const rawBaseURL = process.env.REACT_APP_BASE_URL;

const formattedBaseURL = rawBaseURL?.startsWith("http")
  ? rawBaseURL
  : `https://${rawBaseURL}`;  // 기본적으로 https 붙이기

console.log("Formatted Axios baseURL:", formattedBaseURL);

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: formattedBaseURL, // 환경변수에서 API 기본 URL 설정
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 설정: 모든 요청에 Authorization header 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // local storage에서 token 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("토큰이 없습니다. 로그인 상태를 확인하세요.");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;