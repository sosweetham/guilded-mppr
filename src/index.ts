import axios from "axios"
import promptsync from "prompt-sync"

const baseURL = "https://www.guilded.gg/api"

const axiosInstance = axios.create({baseURL})

const prompt = promptsync({sigint: true})

/**
 * 
 * @param email - The email of the account
 * @param password - The password of the account
 * @returns - Returns the response of user logged in which includes auth cookie and userId
 */
export const login = async (email: string, password: string) => {
    const loginDetails = {
        email, 
        password, 
        getMe: true
    }
    const res = await axiosInstance.post(baseURL+"/login", loginDetails)
    return res
}

/**
 * 
 * @param userId - The userId of the account
 * @param postId - The postId of the post to be deleted
 * @param cookie - The authorization cookie 
 */
export const deletePost = async (userId: string, postId: string, cookie: string) => {
    await axiosInstance.delete(baseURL+"/users/"+userId+"/posts/"+postId, {headers: {cookie}})
} 

const email = prompt("Enter guilded email: ")

const password = prompt("Enter guilded password: ", {echo: ''})

const lastPost = parseInt(prompt("Enter the ID of the post to be deleted: "))

const firstPost = parseInt(prompt("Enter ID of first post: "))


login(email, password).then(async (res) => {
    const userId = res.data.user.id
    const cookies = res.headers["set-cookie"]

    if (cookies) {
        const firstEls = cookies.map((stuff) => {
            return stuff.split(';')[0]
        })
        const realCookie = firstEls.join(';')
        console.log(realCookie)
        for (let i = firstPost; i <= lastPost; i++) {
            await deletePost(userId, `${i}`, realCookie).then((res) => {
                console.log(`Successfully deleted post: ${i} from user: ${userId} profile, res: ${res}`)
            }).catch((err) => {
                console.log(`OOF failed to delete post ${i}!! err: ${err}`)
            })
        }
    } else {
        console.log("Couldnt get cookie, aborted")
        return
    }
   
}).catch((err) => {
    console.log(err)
})