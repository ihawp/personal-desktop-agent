const login = (req, res) => {
    res.status(200).json({ success: true, authRouterLogin: true });
}

export default login;