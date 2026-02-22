
import { Request , Response , NextFunction } from "express";
import jwt , {JwtPayload} from "jsonwebtoken"

const verifyToken = (req : Request , res : Response , next : NextFunction) =>{
    const token = req.cookies["auth_token"];
    console.log('token' , token);
    if(!token) {
        return res.status(401).json({message : "unauthorized"});
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY as string);
        req.userId = (decoded as JwtPayload).userId;
        next();
    }
    catch(err) {
        res.status(401).json({message : "unauthorized"});
    }
    
}

export default verifyToken;