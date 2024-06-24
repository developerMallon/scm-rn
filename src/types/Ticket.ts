type Ticket = {
    id: number;
    created_at: string;
    status: Status;
    requester: { first_name: string; last_name: string; };
    responsible_group: ResponsibleGroup;
    client: Client;
    type: Type;
    km_hr: string;
    complaint: string;
    vehicles: Vehicle[];
    technical_reports: TechnicalReport[];
    follow_ups: FollowUp[];
};