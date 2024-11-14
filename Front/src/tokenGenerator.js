import { generate } from 'youtube-po-token-generator';

async function getTokens() {
    try {
        const tokens = await generate();
        return tokens; // { visitorData: '...', poToken: '...' }
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw error; // Re-throw the error to handle it elsewhere
    }
}

// Export the function directly
export default getTokens;