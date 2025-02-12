
import axios from "axios";
const BASE_URL = "https://places.googleapis.com/v1/places:searchText"

const config = {
    headers:{
        'Content-Type':'application/json',
        'X-Goog-Api-Key':'AIzaSyAn9boxE_fb3x0d3heoR34ZtNrjUghDq4g',
        'X-Goog-FieldMask':[
            'places.photos',
            'places.displayName',
            'places.id'
        ]
    }
}


export const getPlacesDetails=(data:any)=>axios.post(BASE_URL,data,config)