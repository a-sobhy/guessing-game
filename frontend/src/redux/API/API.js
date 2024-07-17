import axios from "axios"
import { toast } from "react-toastify"

const url = process.env.REACT_APP_API_URL

export const API = axios.create({
  baseURL: url,
})

//! handle error
export const handleError = (error) => {
  if (error.response?.data) {
    let errorMessage
    const errorData = error.response.data
    switch (errorData.statusCode) {
      case 400: {
        errorMessage = errorData.message.join(", ")
        break
      }
      case 401: {
        localStorage.clear()
        window.location.href = "/login"
        break
      }
      case 406: {
        errorMessage = JSON.stringify(errorData.message)
        break
      }
      case 409: {
        errorMessage = errorData.message.split(".")[0]
        break
      }
      default:
        errorMessage = `${errorData.statusCode}: HANDLE_ME`
    }
    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "colored",
    })
  } else {
    toast.error(error, {
      position: "bottom-right",
      autoClose: 2500,
      theme: "colored",
    })
  }
}
