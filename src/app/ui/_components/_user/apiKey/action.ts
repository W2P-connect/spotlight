"use server"

import { createApiKey, updateApiKey } from "@/utils/queries/apiKeys"
import { ApiKey } from "@prisma/client";
import { License } from "types";

export const submitApiKey = async (license: License) => {

    if (license.id) {
        const apiKey = await createApiKey(license)
        return apiKey
    } else {
        return null
    }

}

export const submitUpdateApiKey = async (apiKey: Partial<ApiKey> & { id: number }): Promise<boolean> => {

    try {
        const updatedApiKey = await updateApiKey(apiKey)
        return updatedApiKey
            ? true
            : false

    } catch (error) {
        //TODO
        console.log("-> Error submiting update API key:", error);
        return false
    }
}

export const submitDeleteApiKey = async (apiKey: ApiKey): Promise<boolean> => {

    try {
        if (apiKey.id && apiKey.subscription_id) {
            const updatedApiKey = await updateApiKey(apiKey)
            return updatedApiKey
                ? true
                : false
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}