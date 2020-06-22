import React, { ReactElement, useState, useEffect } from 'react';
import classes from './Player.module.css';
import { createGesture, GestureDetail } from '@ionic/core';

interface Props {
  playerName: string;
  opponent?: boolean;
  justPlay?: boolean;
  score: number;
  setScore: (opponent: boolean, newScore: number) => Promise<void>;
  handleGameOver: (win: boolean) => void;
}

export const Player = ({ playerName, opponent = false , score, setScore, handleGameOver }: Props): ReactElement => {
  const [animateHealth, setAnimateHealth] = useState(false);

  const container = document.getElementById(`${playerName}-container`);

  useEffect(() => {
    if (animateHealth) {
      let timer = setTimeout(() => {
        setAnimateHealth(false);
      }, 4000)
      return () => {
        clearTimeout(timer);
      }
    }
  }, [animateHealth])


  const handleFinishSwipe = (detail: GestureDetail): void => {
    let addLife = detail.deltaX > 0
    let newScore = 0

    //health up or down
    if (!opponent) {
      newScore = addLife ? score + 1 : score - 1;
    } else {
      newScore = !addLife ? score + 1 : score - 1;
    }
    //setscore or game over
    if (newScore > 0) {
      setScore(opponent, newScore);
    } else {
      handleGameOver(opponent ? true : false);
    }

    if (animateHealth === false) {
      setAnimateHealth(true);
    }
  }

  if ( container ) {
    const swipe = createGesture({
      el: container,
      onEnd: (detail) => {handleFinishSwipe(detail)},
      gestureName: `${playerName}-swipe`
    })
    swipe.enable();
  }
  

  return (
      <div className={`${classes.playerContainer} ${opponent ? classes.flippedPlayer : ''}`} 
      id={`${playerName}-container`}>
        <div >
          <div className={classes.playerName}>{playerName}</div>
          <div className={classes.cloneCircleContainer}>
            <div className={`${classes.scoreCounter} 
                ${animateHealth ? classes.circle : ''} ${classes.circleClone}`}
                style={{animationDelay: '0s'}}/>

            <div className={`${classes.scoreCounter} 
              ${animateHealth ? classes.circle : ''} ${classes.circleClone}`}
              style={{animationDelay: '1s'}}/>
            
            <div className={`${classes.scoreCounter} 
              ${animateHealth ? classes.circle : ''} ${classes.circleClone}`}
              style={{animationDelay: '2s'}}/>
            
            <div className={`${classes.scoreCounter} 
              ${animateHealth ? classes.circle : ''} ${classes.circleClone}`}
              style={{animationDelay: '3s'}}/>

          </div>
            <div className={`${classes.scoreCounter}`}>
              <div className={classes.scoreText}>{score}</div>
          </div>
        </div>
      </div>
  )
}

export default Player;