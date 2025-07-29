const error = (req, res) => {
    res.status(404).json({ success: false, error: 'Route non-existent', code: 'NON_EXISTENT' });
}

export default error;