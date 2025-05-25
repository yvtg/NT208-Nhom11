import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Ollama API endpoint
const OLLAMA_API = 'http://localhost:11434/api/generate';

// Chatbot endpoint
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Sending request to Ollama:', {
            model: 'llama3',
            message: message
        });

        // Kiểm tra kết nối với Ollama trước
        try {
            const healthCheck = await fetch('http://localhost:11434/api/tags');
            if (!healthCheck.ok) {
                throw new Error('Ollama service is not responding');
            }
        } catch (error) {
            console.error('Ollama health check failed:', error);
            return res.status(503).json({ 
                error: 'Ollama service is not available. Please make sure Ollama is running.' 
            });
        }

        // Gọi Ollama API với các tham số tối ưu
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3',
                prompt: `Bạn là trợ lý AI của SkillLink - nền tảng freelancing. Hãy trả lời lịch sự, rõ ràng và chuyên nghiệp.
                Chỉ tập trung vào các chủ đề: tìm việc freelance, ứng tuyển, và sử dụng nền tảng.
                Câu hỏi: ${message}`,
                stream: false,
                options: {
                    num_predict: 100,  // Giới hạn độ dài câu trả lời
                    stop: ["\n\n", "Human:", "Assistant:"], // Dừng khi gặp các token này
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ollama API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received response from Ollama:', {
            success: true,
            responseLength: data.response?.length
        });

        // Xử lý và làm gọn câu trả lời
        let processedResponse = data.response
            .trim()
            .replace(/\n+/g, ' ')  // Thay thế nhiều dòng mới bằng một khoảng trắng
            .replace(/\s+/g, ' ')  // Thay thế nhiều khoảng trắng bằng một khoảng trắng
            .slice(0, 500);        // Giới hạn độ dài tối đa

        res.json({ response: processedResponse });

    } catch (error) {
        console.error('Chatbot error details:', {
            message: error.message,
            stack: error.stack
        });
        
        if (error.message.includes('Ollama service is not available')) {
            res.status(503).json({ 
                error: 'Ollama service is not available. Please make sure Ollama is running.' 
            });
        } else if (error.message.includes('Ollama API error')) {
            res.status(502).json({ 
                error: 'Error communicating with Ollama. Please try again later.' 
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred. Please try again later.' 
            });
        }
    }
});

export default router; 