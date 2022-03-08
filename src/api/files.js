export async function getFiles({ axios, id }) {
  const res = await axios.get(`/users/${id}/files`, {
    withCredentials: true,
  });

  return res.data;
}

export async function deleteFile({ axios, id, filename, fileId }) {
  const res = await axios.delete(`users/${id}/files/${fileId}`, {
    data: {
      filename,
    },
    withCredentials: true,
  });

  return res.data;
}

export async function createFile({ axios, id, formData }) {
  const res = await axios.post(`users/${id}/files/`, formData, {
    headers: { "content-type": "multipart/form-data" },
    withCredentials: true,
  });

  return res.data;
}

export async function updateFile({ axios, id, fileId, newSubThemes }) {
  const res = await axios.put(
    `users/${id}/files/${fileId}`,
    { subThemes: newSubThemes },
    {
      withCredentials: true,
    },
  );

  return res.data;
}
