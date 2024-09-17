import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) {
          fallback();
        } else {
          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Something went wrong"
          );
        }
      }
    });
  }, [errors]);
};

export const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [mutate] = mutationHook();
  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Loading...");
    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res.data.message || "Updated data successful");

        setData(res.data);
      } else {
        toast.error(res?.error?.data?.error || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      console.log("hellow world");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  };
  return [executeMutation, isLoading, data];
};

export const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  });
};
