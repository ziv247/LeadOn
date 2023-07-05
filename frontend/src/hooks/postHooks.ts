import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Post } from "../types/Post";

export const useGetPostDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => (await apiClient.get<Post>(`api/posts/${id}`)).data,
  });
};

export const useCreatePostMutation = () =>
  useMutation({
    mutationFn: async (post: Post) =>
      (await apiClient.post<{ message: string; post: Post }>("api/posts", post))
        .data,
  });

export const useUpdatePostMutation = () =>
  useMutation({
    mutationFn: async (post: Post) =>
      (await apiClient.post<{ message: string; post: Post }>("api/posts/update", post))
        .data,
  });


export const useUploadFilesMutation = (files:File[]) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }



  return fetch("http://localhost:4000/api/upload/multiple", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    })
    .then(function (data) {
      // `data` is the parsed version of the JSON returned from the above endpoint.
      return data;
    });

};

export const useGetPostHistoryQuery = () =>
  useQuery({
    queryKey: ["post-history"],
    queryFn: async () => (await apiClient.get<Post[]>(`api/posts/mine`)).data,
  });

export const useGetAllPostsQuery = () =>
  useQuery({
    queryKey: ["post-history"],
    queryFn: async () => (await apiClient.get<Post[]>(`api/posts/`)).data,
  });
