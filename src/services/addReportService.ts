import api from "./api";
import { Alert } from "react-native";

// Método que grava o followup no banco de dados
const addReportService = async (ticketId: number, report: string, token: string) => {
    try {
        const response = await api.post(`/technical-report/`, {
            id_complaint: ticketId,
            details: report.toUpperCase()
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Alert.alert("Salvar", "Acompanhamento inserido com sucesso.");
        // return response.data; // Retornar os dados se necessário

    } catch (error) {
        console.error("Erro ao inserir acompanhamento:", error);
        Alert.alert("Erro", "Não foi possível inserir o acompanhamento.");
        throw error; // Rejeitar explicitamente a promessa em caso de erro
    }
}

export default addReportService
