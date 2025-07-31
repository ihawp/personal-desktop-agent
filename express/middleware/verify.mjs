/**
 * Warren Chemerika
 * Created: July 30, 2025
 * Updated: July 30, 2025
 * 
 * @purpose MIDDLEWARE
 * @description Verify the users access token. 
 *  If no access token is present, check the refresh token, 
 *  if it is expired, return error, 
 *  if not, create a new access and refresh token for the user 
 *  THEN grant access as if they arrived with the access token
 *  present.
 * 
*/



const verify = () => {

    const { session } = req.signedCookies;

    if (!session) res.status(200).json({ success: false });

}