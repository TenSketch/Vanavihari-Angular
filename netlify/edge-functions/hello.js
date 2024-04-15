import { HmacSHA256, enc } from 'crypto-js';

function urlBase64Encode(str) {
    let base64 = btoa(unescape(encodeURIComponent(str)));
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return (base64 + padding).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
export default async (req) => {
    try {
        console.log('hello world');

        return new Response(JSON.stringify({'status':'success' }), {
            headers: { "Content-Type": "application/json" },
        });
    }
    catch
    {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
}

export const config = { path: "/test" };