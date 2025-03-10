import fetch from 'node-fetch';
import readline from 'readline';
import fs from 'node:fs/promises';

const RIS_BASE_URL = 'https://spacescavanger.onrender.com';


const playerEmail = 'YOUR_STUDENT_EMAIL@example.com';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function startGame() {
  const url = `${RIS_BASE_URL}/start?player=${encodeURIComponent(playerEmail)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to start game: ${response.statusText}`);
  }
  return response.json();
}

async function submitAnswer(answer) {
  const response = await fetch(`${RIS_BASE_URL}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answer,
      player: playerEmail
    })
  });
  if (!response.ok) {
    throw new Error(`Failed to submit answer: ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  try {
    console.log('Starting infiltration...');

    // 1) Get the first puzzle
    let currentPuzzle = await startGame();

    let infiltrationActive = true;

    while (infiltrationActive) {
      
      const puzzleText = currentPuzzle.challenge ||
                         currentPuzzle.message  ||
                         JSON.stringify(currentPuzzle);

      console.log('\n================================================');
      console.log('PUZZLE / MESSAGE FROM SERVER:');
      console.log(puzzleText);
      console.log('================================================\n');

      if (puzzleText.includes('skeleton key')) {
        
        const keyMatch = puzzleText.match(/skeleton key:\s*([A-Za-z0-9-]+)/);
        if (keyMatch) {
          const finalKey = keyMatch[1];
          console.log(`\nSkeleton key found: ${finalKey}`);

          await fs.writeFile('skeletonkey.txt', finalKey, 'utf8');
          console.log('skeletonkey.txt written. Infiltration complete!\n');
        } else {
          console.log('Skeleton key phrase found, but could not parse the key properly.');
        }

        infiltrationActive = false;
        break;
      }

      const userAnswer = await askQuestion('Type your answer here, then press Enter: ');

      currentPuzzle = await submitAnswer(userAnswer);
      console.log('SERVER RESPONSE:', currentPuzzle);
    }
    rl.close();
    console.log('All done!');

  } catch (error) {
    console.error('Error in main():', error);
    rl.close();
  }
}

main();
