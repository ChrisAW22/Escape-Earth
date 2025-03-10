import fetch from 'node-fetch';

const BASE_URL = 'https://spacescavanger.onrender.com';
const playerEmail = 'christoffw@uia.no';

async function startGame() {
    const url = `${BASE_URL}/start?player=${encodeURIComponent(playerEmail)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to start game: ${response.statusText}`);
        }
        const data = await response.json();

        console.log("Data recived from /start:", data);

        return data;
    } catch (error) {
        console.error(error);
    }
}

async function submitAnswer(answer) {
    try {
        const response = await fetch(`${BASE_URL}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer, player: playerEmail })
        });

        if (!response.ok) {
            throw new Error(`Failed to submit answer: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response from /answer:", data);
        return data;
    } catch (error) {
        console.error(error);
    }
    
}