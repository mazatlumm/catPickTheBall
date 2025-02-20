import { useState } from 'react';
import './App.css';

function App() {
  const arenas = [0, 1];

  const [balls, setBalls] = useState([
    Array(9)
      .fill(null)
      .map((_, index) => ({
        position: 130 * (index + 1),
        isPicked: false,
      })),
    Array(9)
      .fill(null)
      .map((_, index) => ({
        position: 130 * (index + 1),
        isPicked: false,
      })),
  ]);

  const [cats, setCats] = useState([
    {
      name: 'Tata',
      position: 0,
      direction: 'forward',
      image: '/cat.png',
      isFlipped: true,
      hasBall: false,
      targetBall: 0,
    },
    {
      name: 'Azam',
      position: 0,
      direction: 'forward',
      image: '/kitty.png',
      isFlipped: false,
      hasBall: false,
      targetBall: 0,
    },
  ]);

  // State untuk menyimpan kecepatan dan status mulai
  const [speedCat1, setSpeedCat1] = useState(50);
  const [speedCat2, setSpeedCat2] = useState(50);
  const [isStarted, setIsStarted] = useState(false);

  const runningCat = (number: number, speed: number, order: 'left-right' | 'right-left') => {
    const adjustedSpeed = 100 - speed;
    setInterval(() => {
      setCats((prevCats) =>
        prevCats.map((cat, catIndex) => {
          if (catIndex === number) {
            let newPosition = cat.position;
            let newDirection = cat.direction;
            let isFlipped = cat.isFlipped;
            let hasBall = cat.hasBall;
            let targetBall = cat.targetBall;
  
            const maxBallIndex = balls[catIndex].length - 1;
            if (order === 'right-left') {
              targetBall = maxBallIndex - cat.targetBall;
            }
  
            if (targetBall < 0 || targetBall > maxBallIndex) return cat;
  
            const ballPosition = balls[catIndex][targetBall]?.position;
  
            if (cat.direction === 'forward') {
              newPosition += 5;
              if (newPosition >= 1170) {
                newDirection = 'backward';
                isFlipped = !isFlipped;
              }
            } else {
              newPosition -= 5;
              if (newPosition <= 0) {
                newDirection = 'forward';
                isFlipped = !isFlipped;
              }
            }
  
            if (!hasBall && Math.abs(newPosition - ballPosition) < 10) {
              setBalls((prevBalls) =>
                prevBalls.map((arenaBalls, arenaIndex) =>
                  arenaIndex === catIndex
                    ? arenaBalls.map((ball, index) =>
                        index === targetBall
                          ? { ...ball, isPicked: true }
                          : ball
                      )
                    : arenaBalls
                )
              );
              hasBall = true;
              newDirection = 'backward';
              isFlipped = !isFlipped;
            }
  
            if (hasBall && newPosition <= 0) {
              hasBall = false;
              if (order === 'left-right') {
                targetBall += 1;
              } else {
                targetBall -= 1;
              }
              newDirection = 'forward';
              isFlipped = !isFlipped;
            }
  
            if (newPosition <= 0) {
              isFlipped = !isFlipped;
            }
  
            return {
              ...cat,
              position: newPosition,
              direction: newDirection,
              isFlipped: isFlipped,
              hasBall: hasBall,
              targetBall: order === 'right-left' ? maxBallIndex - targetBall : targetBall,
            };
          }
          return cat;
        })
      );
    }, adjustedSpeed);
  };

  // Mulai permainan ketika tombol "Mulai" diklik
  const startGame = () => {
    setIsStarted(true);
    runningCat(0, speedCat1, 'left-right');
    runningCat(1, speedCat2, 'right-left');
  };

  const restartGame = () => {
    // reload page
    window.location.reload();
  }

  return (
    <>
      <div className='container'>
        <h1>Perbandingan Kecepatan Ambil Bola Balik Arah</h1>

        {/* Input kecepatan dan tombol mulai */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            Kecepatan Kucing 1:
            <input
              type="text"
              value={speedCat1}
              onChange={(e) => setSpeedCat1(Number(e.target.value))}
              disabled={isStarted}
              style={{ marginLeft: '10px', marginRight: '20px' }}
            />
          </label>
          <label>
            Kecepatan Kucing 2:
            <input
              type="text"
              value={speedCat2}
              onChange={(e) => setSpeedCat2(Number(e.target.value))}
              disabled={isStarted}
              style={{ marginLeft: '10px', marginRight: '20px' }}
            />
          </label>
          <button onClick={ isStarted ? restartGame : startGame}>
            {isStarted ? 'Restart' : 'Start'}
          </button>
        </div>

        <div className="card">
          {arenas?.map((arena: number) => (
            <div 
              className="row" 
              key={`arena-${arena}`}
              style={{
                borderBottom: arena === 0 ? '1px solid rgb(255, 255, 255)' : 'none',
              }}
             >
              <div className="running-area">
                <div
                  className="cat"
                  style={{
                    position: 'absolute',
                    top: -80,
                    left: cats?.[arena]?.position,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <h2 style={{ marginBottom: -5 }}>{cats?.[arena]?.name}</h2>
                  <img
                    src={cats?.[arena]?.image}
                    alt={cats?.[arena]?.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      transform: cats?.[arena]?.isFlipped
                        ? 'rotateY(180deg)'
                        : 'rotateY(0deg)',
                    }}
                  />
                </div>
                <div className="basket" style={{ marginRight: '130px' }} />
                {balls?.[arena].map((ball: any, index: number) => (
                  <div
                    key={`ball-${index}`}
                    style={{
                      width: '130px',
                    }}
                  >
                    <div
                      className="ball"
                      style={{
                        display: ball?.isPicked ? 'none' : 'block',
                      }}
                    >
                      <p style={{color: 'black', fontSize: '18px'}}>{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
