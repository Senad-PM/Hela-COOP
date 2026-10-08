import axiosClient from "./axiosClient";

export const fetchActivityLogs = async () => {
    const { data } = await axiosClient.get("/activity", { params: { limit: 1000 } });
    return data;
};

export const clearActivityLogs = async () => {
    const { data } = await axiosClient.delete("/dashedboard/activity-log");
    return data;
};

export const fetchSettings = async () => {
    const { data } = await axiosClient.get("/dashedboard/settings");
    return data;
};

export const updateSettings = async (settingsData) => {
    const { data } = await axiosClient.put("/dashedboard/settings", settingsData);
    return data;
};