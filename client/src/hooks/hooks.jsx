import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) {
          fallback();
        } else {
          toast.error(error?.response?.data?.message || "Something went wrong");
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
        toast.success(res.data.message || "Updated data successful")
        
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.error || "Something went wrong", );
        // console.log(res.error.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", );
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  };
  return [ executeMutation, isLoading, data ];
};
