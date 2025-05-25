import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

const OAuthButtons = () => {
    const handleGoogleLogin = () => {
        const redirectUrl = encodeURIComponent('http://localhost:5173/login');
        const oauthUrl = `http://localhost:3000/api/auth/google?redirect_url=${redirectUrl}`;
        console.log('Google OAuth URL:', oauthUrl);
        window.location.href = oauthUrl;
    };

    const handleFacebookLogin = () => {
        const redirectUrl = encodeURIComponent('http://localhost:5173/login');
        const oauthUrl = `http://localhost:3000/api/auth/facebook?redirect_url=${redirectUrl}`;
        console.log('Facebook OAuth URL:', oauthUrl);
        window.location.href = oauthUrl;
    };

    const handleGithubLogin = () => {
        const redirectUrl = encodeURIComponent('http://localhost:5173/login');
        const oauthUrl = `http://localhost:3000/api/auth/github?redirect_url=${redirectUrl}`;
        console.log('GitHub OAuth URL:', oauthUrl);
        window.location.href = oauthUrl;
    };

    return (
        <div className="flex mt-4">
            <button
                onClick={handleGoogleLogin}
                className="mx-4 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
                <FaGoogle className="text-red-500 mr-2" />
            </button>

            <button
                onClick={handleFacebookLogin}
                className="mx-4 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
                <FaFacebook className="text-blue-600 mr-2" />
            </button>

            <button
                onClick={handleGithubLogin}
                className="mx-4 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
                <FaGithub className="text-gray-800 mr-2" />
            </button>
        </div>
    );
};

export default OAuthButtons; 