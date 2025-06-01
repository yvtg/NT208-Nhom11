import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL  } from "firebase/storage"
import { useState, useEffect } from "react";


// Firebase configuration (Move sensitive data to .env file in production)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    database: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

function PdfLinkFromStorage({ path }) {
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUrl = async () => {
        try {
            const pdfRef = ref(storage, path); 
            const downloadUrl = await getDownloadURL(pdfRef);
            setUrl(downloadUrl);
        } catch (err) {
            setError(err.message);
        }
        };

        fetchUrl();
    }, [path]);

    if (error) return <div>Lỗi: {error}</div>;
    if (!url) return <div>Đang tải...</div>;

    return (
        <div>
        <a href={url} target="_blank" rel="noopener noreferrer">
            Mở PDF
        </a>
        <iframe src={url} width="100%" height="600px" title="PDF file" />
        </div>
    );
}

export const storage = getStorage(app);
export { PdfLinkFromStorage };