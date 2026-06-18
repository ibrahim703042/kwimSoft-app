import httpClient, { httpGet } from "@/infrastructure/http/httpClient";

export const identityApi = {
  login: (credentials: { email: string; pswd: string }) =>
    httpClient.post("/user/login", credentials),
  updatePassword: (payload: { newPswd: string; confirmPswd: string; userId: string }) =>
    httpClient.post("/user/update-pswd", payload),
  getConnectedUser: (id: string) => httpGet(`/user/user-connected/${id}`),
};
