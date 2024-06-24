import { useSession } from "@/context/ctx";
import api from "./api";
import { Alert } from "react-native";

const { signOut, session } = useSession();

const updateFollowUP = async (ticket_id: number, value: string) => {
    try {
        const response = await api.post(`/followup/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`,
            },
            data: {
                ticket_id: ticket_id,
                value: value
            }
        });

        console.log(response)

    } catch (error) {
        console.error("Erro ao buscar arquivos:", error);
    } finally {
        Alert.alert("Salvar", "Acompanhamento inserido com sucesso.")
    }
}

export default updateFollowUP
