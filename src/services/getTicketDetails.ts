import api from "./api";

const getTicketDetails = async (id: string, token: string): Promise<Ticket | null> => {

    try {
      const response = await api.get(`/complaint/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return response.data[0] || [];

    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      return null
    } 
  };

  export default getTicketDetails;