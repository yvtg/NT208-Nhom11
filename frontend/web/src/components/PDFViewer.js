import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Cấu hình worker cho PDF.js
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ fileUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setError(null);
        setLoading(false);
    };

    const onDocumentLoadError = (error) => {
        console.error("PDF Load Error:", error);
        setError("Không thể tải file PDF. Vui lòng thử lại sau.");
        setLoading(false);
    };

    return (
        <div className="pdf-viewer">
            {loading && <div>Đang tải PDF...</div>}
            {error && <div className="text-red-500">{error}</div>}
            
            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<div>Đang tải...</div>}
                error={<div>Không thể tải file PDF</div>}
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
                    />
                ))}
            </Document>
        </div>
    );
}

export default PDFViewer;
