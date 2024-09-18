// import { verifyToken } from "../utils/token.js"

// export const authentication = () => {
//     return (req, res, next) => {
//         const { autherization } = req.headers
//         const [bearer, token] = autherization.split(' ')
//         if (bearer == 'access-token') {
//             const payload = verifyToken({ token, secretkey: process.env.SECRET_KEY_ACCESS_TOKEN })
//         } else if (bearer == 'reset-password') {
//             verifyToken({ token, secretkey: process.env.SECRET_KEY_RESET_PASSWORD })
//         }
//     }

// }