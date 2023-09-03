import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { FacebookData, UserInfo } from "../types/UserInfo";

export const useFacebookSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      accessToken,
      data_access_expiration_time,
      expiresIn,
      graphDomain,
      id,
      name,
      signedRequest,
      userID,
    }: {
      accessToken: string;
      data_access_expiration_time: number;
      expiresIn: number;
      graphDomain: string;
      id: string;
      name: string;
      signedRequest: string;
      userID: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          accessToken,
          data_access_expiration_time,
          expiresIn,
          graphDomain,
          id,
          name,
          signedRequest,
          userID,
        })
      ).data,
  });

export const useUpdateFacebookMutation = () =>
  useMutation({
    mutationFn: async (user: UserInfo) =>
      (
        await apiClient.post<{ message: string; user: UserInfo }>(
          "api/users/updateFb",
          user
        )
      ).data,
  });

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      userName,
      password,
    }: {
      userName: string;
      password: string;
      // password: string;
    }) =>
      (
        await apiClient.post<{
          groups: string[];
          details: { authenticated: boolean; user: boolean; success: boolean };
          items: string[];
          userName: string;
          password: string;
        }>(`api/fb/login`, {
          userName,
          password,
          // password,
        })
      ).data,
  });

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      tel,
      facebookData,
    }: {
      name: string;
      email: string;
      tel: string;
      facebookData: FacebookData;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          tel,
          facebookData,
        })
      ).data,
  });

export const useUpdateFbInfoMutation = () =>
  useMutation({
    mutationFn: async ({ facebookData }: { facebookData: FacebookData }) =>
      (
        await apiClient.post<FacebookData>(`api/users/facebook`, {
          facebookData,
        })
      ).data,
  });
