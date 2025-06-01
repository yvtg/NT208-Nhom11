import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); 

// Together AI API 
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // kiểm tra cache trước khi gọi api 
        const cacheKey = message.trim().toLowerCase();
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            console.log('Serving response from cache');
            return res.json({ response: cachedResponse });
        }

        
        const messages = [
            {
                role: "system",
                content: "Bạn là trợ lý AI của SkillLink – nền tảng freelance. Hãy trả lời ngắn gọn, thân thiện và rõ ràng, tập trung vào các chủ đề: tìm việc freelance, ứng tuyển, và cách sử dụng nền tảng SkillLink. Nếu phù hợp, hãy chủ động gợi ý thêm giải pháp hoặc bước tiếp theo cho người dùng."
            },
            {
                role: "user",
                content: message
            }
        ];
// Cấu hình request gửi đến together ai 
        const requestBody = {
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages: messages,
            temperature: 0.7,
            top_p: 0.95,
            stream: false
        };

        // gọi Together AI API
        const response = await fetch(TOGETHER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOGETHER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            timeout: 15000   
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            throw new Error(`Together AI API error: ${response.status} ${response.statusText} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        
        // Xử lý câu trả lời 
        let processedResponse = data.choices?.[0]?.message?.content
            ?.trim()
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')

        if (!processedResponse) {
            throw new Error('Invalid response format from Together AI API');
        }

        // Lưu vào cache để dùng lại 
        cache.set(cacheKey, processedResponse);

        res.json({ response: processedResponse });

    } catch (error) {
        console.error('Chatbot error details:', {
            message: error.message,
            stack: error.stack
        });
        
        if (error.message.includes('timeout')) {
            res.status(504).json({ 
                error: 'Request timed out. Please try again.' 
            });
        } else if (error.message.includes('Together AI API error')) {
            res.status(502).json({ 
                error: 'Error communicating with Together AI API. Please try again later.',
                details: error.message
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred. Please try again later.',
                details: error.message
            });
        }
    }
}; 