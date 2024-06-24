import api from "./api";

const getTicketFiles = async (id: string, token: string): Promise<string[]> => {
     
    try {
      const response = await api.get(`/tickets/${id}/list/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return response.data['filenames'] || [];

    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
      return []
    }
  }

export default getTicketFiles;