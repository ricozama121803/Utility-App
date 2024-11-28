interface CanvaTokens {
    refresh_token: string;
    access_token: string;
    expires_in?: number;
  }
  
  export const saveTokens = (tokens: CanvaTokens): void => {
    localStorage.setItem('canvaTokens', JSON.stringify(tokens));
    console.log('Tokens saved:', tokens);
  };
  
  export const getTokens = (): CanvaTokens | null => {
    const tokens = localStorage.getItem('canvaTokens');
    return tokens ? JSON.parse(tokens) : null;
  };
  
  export const clearTokens = (): void => {
    localStorage.removeItem('canvaTokens');
    console.log('Tokens cleared');
  };
  
  export const getRefreshToken = (): string | null => {
    const tokens = getTokens();
    return tokens?.refresh_token || null;
  };
  