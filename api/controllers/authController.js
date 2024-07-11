const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



// @desc Create new user
// @route POST /users
// @access Private
const register = async (req, res) => {
    const { username, password, roles, email, phoneNumber } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd, email, phoneNumber }
        : { username, "password": hashedPwd, roles,  email, phoneNumber }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}


// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: 'No user found' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
        {
            UserInfo: {
                username: foundUser.username,
                roles: foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by web server
        secure: false, // https
        sameSite: 'None', // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry: set to match refreshToken
    });

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Send a sanitized user object (without password field) along with accessToken
    const userWithoutPassword = {
        _id: foundUser._id.toString(),
        username: foundUser.username,
        email: foundUser.email,
        phoneNumber: foundUser.phoneNumber,
        refreshToken: foundUser.refreshToken,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        roles: foundUser.roles,
    };

    // Send accessToken containing username and roles along with sanitized user data
    res.status(200).json({ message: 'Logged in successfully', user: userWithoutPassword });
};


// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser =  await User.findOne({ refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": decoded.username ,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false }); // set to true after production
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    console.log(foundUser)
    console.log(foundUser.refreshToken)
    foundUser.refreshToken = ""
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false }); //set it to true after production
    res.sendStatus(204).json({message: "successfully logged out", data: result});
}

module.exports = {
    login,
    refresh,
    logout,
    register
}
