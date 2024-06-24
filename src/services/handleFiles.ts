import { encode } from 'base-64';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import api from './api';
import { router } from 'expo-router';

const handleFiles = (ticket_id: number, filename: string, index: number, token: string, callback: (error?: Error | null) => void) => {
  const [loadingFiles, setLoadingFiles] = useState<boolean[]>([]);

  setLoadingFiles(prevLoadingFiles => {
    const newLoadingFiles = [...prevLoadingFiles];
    newLoadingFiles[index] = true;
    return newLoadingFiles;
  });

  api.get(`/tickets/${ticket_id}/download/${filename}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    responseType: 'arraybuffer', // importante para baixar arquivos
  })
  .then(response => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

    if (response.data.byteLength > MAX_FILE_SIZE) {
      throw new Error("File too large to process");
    }

    const uint8Array = new Uint8Array(response.data);
    const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
    const base64String = encode(binaryString);

    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    return FileSystem.writeAsStringAsync(fileUri, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });
  })
  .then(() => {
    setLoadingFiles(prevLoadingFiles => {
      const newLoadingFiles = [...prevLoadingFiles];
      newLoadingFiles[index] = false;
      return newLoadingFiles;
    });

    router.replace({
      pathname: `/scm/files_page`,
      params: { ticket_id: ticket_id, uri: fileUri, name: filename }
    });

    callback(); // Notifica que o processo foi concluído sem erros
  })
  .catch(error => {
    setLoadingFiles(prevLoadingFiles => {
      const newLoadingFiles = [...prevLoadingFiles];
      newLoadingFiles[index] = false;
      return newLoadingFiles;
    });

    console.error("Error downloading file:", error);
    callback(error); // Notifica que ocorreu um erro
  });
};

export default handleFiles;
