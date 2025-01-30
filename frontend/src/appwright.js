import {Client, Databases, ID, Query} from 'appwrite'
const PROJECT_ID= import.meta.env.VITE_APPWRIGHT_PROJECT_ID ;
const DATABASE_ID= import.meta.env.VITE_APPWRIGHT_DATABASE_ID ;
const COLLECTION_ID= import.meta.env.VITE_APPWRIGHT_METRICS_ID ;


const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID)

const database = new Databases(client)
export const updateSearchCount = async(searchTerm, film)=>{
 //1. Use Appwrite SDK to check if the search term exists in the DB
 try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', searchTerm),
    ])
    //2. If it does, update the count
    if(result.documents.length > 0){
        const doc = result.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID,doc.$id, {
            count: doc.count + 1
        })
        //3. If not , create a new document with the search term and count as 1
    }else{
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm,
            count: 1,
            movie_id: film.id,
            poster_url:`https://image.tmdb.org/t/p/w500${film.poster_path}`
        })
    }
 } catch (error) {
    console.log(error)
 }


}

export const getTrendingFilms = async ()=>{
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')

        ])
        return result.documents;
    } catch (error) {
        console.log(error)
    }
}