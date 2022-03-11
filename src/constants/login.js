export const LOGIN_TEXT = {
  LOGIN_FAILED: "로그인 실패. 잠시 후 다시 시도해 주세요.",
  REQUEST_ACCEPT_ALL:
    "서비스 이용을 위하여 필수정보와 선택정보인 이메일을 모두 동의 해주세요.",
};

export const LOGIN_URL = {
  VERIFY_USERINFO: "/v2/user/me",
  REVOKE_AUTH: "/v1/user/unlink",
};

export const LOGIN_BTN = {
  CONTAINER: "#kakao-login-btn",
  SCOPE: "profile_nickname, profile_image, account_email",
};
