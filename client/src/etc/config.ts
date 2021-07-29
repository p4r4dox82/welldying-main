
export const apiAddress = process.env.REACT_APP_API_ADDRESS || 'http://localhost:5000';
export const publicUrl = process.env.PUBLIC_URL || '';
export const kakaoJskey = process.env.REACT_APP_KAKAO_JSKEY || '';
export const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

export const imageUrl = (imageName: string) => `${publicUrl}/img/${imageName}`;
