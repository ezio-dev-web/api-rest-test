import { User } from "../models/User.js"
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js"

export const register = async (req, res) => {
  const { email, password } = req.body

  try {
      // Verificando email repeat
      let user = await User.findOne({email})
      if(user) throw { code: 11000 }

      user = new User({email, password})
      await user.save()

      // Generar token JWT
      const { token, expiresIn } = generateToken(user.id);
      generateRefreshToken(user.id, res);
      
      return res.status(201).json({ token, expiresIn });

  } catch (error) {
    console.log(error)
    // Alternativa por defecto mongoose
    if(error.code === 11000){
      return res.status(400).json({ error: "Ya existe este usuario" })
    }
    return res.status(500).json({ error: "Error de servidor" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if(!user) return res.status(403).json({ error: "No existe este usuario" })

    const responsePassword = await user.comparePassword(password)
    if(!responsePassword) {
      return res.status(403).json({ error: "Password incorrecto" })
    }

    // Generar token JWT
    const { token, expiresIn } = generateToken(user.id)
    generateRefreshToken(user.id, res)

    return res.json({ token, expiresIn })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Error de servidor" })
  }
}

export const infoUser = async(req, res) => {
  try {
    const user = await User.findById(req.uid).lean() //response light
    return res.json({ email: user.email, uid: user.id })
    
  } catch (error) {
      return res.status(500).json({ error: "error de server" })
  }
}

export const refreshToken = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid)
    return res.json({ token, expiresIn })

  } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "error de server"})
  }
}

export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ ok: true})
}