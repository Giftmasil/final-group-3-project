export interface Emergency {
    _id?: string
    title: string
    description: string
    place: string
    latitude: string
    longitude: string
    user: string
    status: "Delivered" |"Pending" | "Done"
    condition: string,
    responderLatitude?: string,
    responderLongitude?: string,
    responder?: string,
    createdAt?: Date
    updatedAt?: Date
}