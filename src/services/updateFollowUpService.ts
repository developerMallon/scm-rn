import { useSession } from "@/context/ctx";
import api from "./api";
import { Alert } from "react-native";

const { signOut, session } = useSession();

const updateFollowUpService = async (ticketId: number, followUp: string) => {

    console.log(`Ticket ID: ${ticketId}, FollowUp: ${followUp.toUpperCase()}`);

    // try {
    //     const response = await api.post(`/followup/`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${session?.access_token}`,
    //         },
    //         data: {
    //             id_complaint: ticketId,
    //             details: followUp.toUpperCase()
    //         }
    //     });

    //     console.log(response)

    // } catch (error) {
    //     console.error("Erro ao buscar arquivos:", error);
    // } finally {
    //     Alert.alert("Salvar", "Acompanhamento inserido com sucesso.")
    // }
}

export default updateFollowUpService
