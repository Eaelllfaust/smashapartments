const bcrypt = require("bcrypt");

// Hash the password before saving it to the database
const hashPassword = async (password) => {
    try {
        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Could not hash password");
    }
};

// Compare the provided password with the stored hashed password
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Could not compare passwords");
    }
};

module.exports = {
    hashPassword,
    comparePassword
};
