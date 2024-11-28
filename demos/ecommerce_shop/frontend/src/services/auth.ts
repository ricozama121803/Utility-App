import { BACKEND_HOST } from "src/config";

const endpoints = {
  AUTHORIZE: "/authorize",
  REVOKE: "/revoke",
  IS_AUTHORIZED: "/isauthorized",
  TOKEN_INFO: "/token-info",  // New endpoint to get token info
};

export const getCanvaAuthorization = async () => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const url = new URL(endpoints.AUTHORIZE, BACKEND_HOST);
      const windowFeatures = ["popup", "height=800", "width=800"];
      const authWindow = window.open(url, "", windowFeatures.join(","));

      window.addEventListener("message", async (event) => {
        if (event.data === "authorization_success") {
          // After successful authorization, fetch and log token info
          const tokenInfo = await getTokenInfo();
          console.log("Refresh Token:", tokenInfo.refresh_token);
          
          // Store in localStorage for persistence
          localStorage.setItem('canvaTokens', JSON.stringify(tokenInfo));
          
          resolve(true);
          authWindow?.close();
        } else if (event.data === "authorization_error") {
          reject(new Error("Authorization failed"));
          authWindow?.close();
        }
      });

      const checkAuth = async () => {
        try {
          const authorized = await checkAuthorizationStatus();
          if (authorized.status) {
            const tokenInfo = await getTokenInfo();
            console.log("Refresh Token:", tokenInfo.refresh_token);
            localStorage.setItem('canvaTokens', JSON.stringify(tokenInfo));
          }
          resolve(authorized.status);
        } catch (error) {
          reject(error);
        }
      };

      const checkWindowClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkWindowClosed);
          checkAuth();
        }
      }, 1000);
    } catch (error) {
      console.error("Authorization failed", error);
      reject(error);
    }
  });
};

export const getTokenInfo = async () => {
  const url = new URL(endpoints.TOKEN_INFO, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });
  
  if (!response.ok) {
    throw new Error('Failed to fetch token info');
  }
  
  return response.json();
};

export const revoke = async () => {
  const url = new URL(endpoints.REVOKE, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    return false;
  }

  localStorage.removeItem('canvaTokens');
  return true;
};

export const checkAuthorizationStatus = async (): Promise<{
  status: boolean;
}> => {
  const url = new URL(endpoints.IS_AUTHORIZED, BACKEND_HOST);
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    return { status: false };
  }
  return response.json();
};
