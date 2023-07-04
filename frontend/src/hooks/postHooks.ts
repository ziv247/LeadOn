import { useMutation, useQuery } from "@tanstack/react-query";
import { CartItem, ShippingAddress } from "../types/Cart";
import apiClient from "../apiClient";
import { Order } from "../types/Order";
import { Post, What, When, Where } from "../types/Post";

export const useGetPostDetailsQuery = (id: string) => {
  console.log(id);
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

// export const useUploadFilesMutation = () =>
//   useMutation({
//     mutationFn: async (formData: FileList) =>
//       (await apiClient.post<{ files: Array<any>; }>("api/upload/multiple", convetFileToForm(formData)))
//         .data,
//   });

//   const convetFileToForm = files=>{
//     const formData = new FormData();
//   for (let i = 0; i < files.length; i++) {
//     formData.append("files", files[i]);
//   }
//   console.log(formData)
//   return formData
//   }
export const useUploadFilesMutation = (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  // useMutation({
  //   mutationFn: async (files: FormData) =>
  //     (
  //       await apiClient.post<{ files: Array<any> }>(
  //         "api/upload/multiple",
  //         files
  //       )
  //     ).data,
  // });

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
      console.log(data); // { "userId": 1, "id": 1, "title": "...", "body": "..." }
      return data;
    });
  // .then((res) => {
  //     res.json().then((data) => {
  //     console.log(data)
  //   })})
  //   .catch((err) => {
  //     console.error(err.message);
  //   });
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
