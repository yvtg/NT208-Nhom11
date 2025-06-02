import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set workerSrc 1 lần ở ngoài component, hoặc trong useEffect đầu tiên
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js';

function PDFViewer({ fileUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        if (isMounted.current) {
            setNumPages(numPages);
            setError(null);
            setLoading(false);
        }
    };

    const onDocumentLoadError = (error) => {
        if (isMounted.current) {
            console.error("PDF Load Error:", error);
            setError("Không thể tải file PDF.");
            setLoading(false);
        }
    };

    return (
        <div className="pdf-viewer">
            {error && <div style={{ color: "red" }}>{error}</div>}

            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={{
                    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                    cMapPacked: true,
                }}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={800}
                        className="mb-4"
                        renderTextLayer={false}
                    />
                ))}
            </Document>
        </div>
    );
}

export default PDFViewer;
