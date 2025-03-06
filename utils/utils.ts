import { redirect } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { CallApiError, CallApiResponse, HTTPMethod } from "@/types";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
}

export const callApi = async <T = any>(
  url: string,
  method: HTTPMethod = 'GET',
  data: Record<string, any> | null = null,
  headers: Record<string, string> = {}
): Promise<CallApiResponse<T> | CallApiError> => {
  try {
      const options: AxiosRequestConfig = {
          url: url,
          method: method,
          headers: {
              ...headers,
              'Content-Type': 'application/json',
          },
      };

      // Ajouter `params` pour les requêtes GET, sinon utiliser `data`
      if (method.toUpperCase() === 'GET') {
          options.params = data;
      } else {
          options.data = data;
      }

      // Appel API via Axios
      const response: AxiosResponse<T> = await axios(options);

      return {
          data: response.data,
          success: true,
          method: method,
          url: url,
          error: null,
      };
  } catch (err: any) {
      if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;

          return {
              url,
              method,
              data,
              success: false,
              headers,
              error: {
                  status: axiosError.response?.status || null,
                  message: axiosError.message,
                  data: axiosError.response?.data, // Informations supplémentaires
              },
          };
      } else {
          return {
              url,
              method,
              data,
              headers,
              success: false,
              error: {
                  status: null,
                  message: 'Unknown error',
              },
          };
      }
  }
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

