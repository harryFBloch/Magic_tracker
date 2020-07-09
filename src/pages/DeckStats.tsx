import React, { ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, Game, Deck, actions, ThunkDispatchType } from '../store';
import classes from './DeckStats.module.css';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonTextarea, IonButton } from '@ionic/react';
import Toolbar from '../components/common/Toolbar';
import Loading from '../components/common/Loading';
import RenderSVG from '../components/common/RenderSVG';
import { ICONS } from '../icons';
import { bindActionCreators } from 'redux';

interface ReduxStateProps {
  decks: Deck[];
  games: Game[];
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  decks: state.decks.decks,
  games: state.games.gameHistory,
});

interface URLComponentProps {
  deckID: string
}

const mode = (arr: string[]): string => {
  let foundMode = arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
  if (foundMode) {
    return foundMode
  } else {
    return ''
  }
}
interface ReduxDispatchProps {
  updateNote: (deckID: number, notes: string) => void;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  updateNote: actions.decks.updateDeckNote,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps<URLComponentProps>

export const DeckStats = ({ match, decks, games, updateNote }: Props): ReactElement => {
  
     
  
    const deck = decks[Number(match.params.deckID)]
    //TODO: fix this janky work around
    let n = ''
    if (deck) {
      n = deck.notes
    }
    const [note, setNote] = useState(n);

    if (deck) {
      const deckHistory: Game[] = [];
      let wins: string[] = [];
      let losses: string[] = [];

      games.forEach((game: Game) => {
        if (game.deckID === deck.id) {
          deckHistory.push(game);
          if (game.win) {
            wins.push(`${game.opponentUsername} - ${game.opponentDeck}`);
          } else {
            losses.push(`${game.opponentUsername} - ${game.opponentDeck}`);
          }
        }
      })

      const mostWins = mode([...wins]);
      const mostLosses = mode([...losses]);
      const gamesPlayed = wins.length + losses.length;
      const winPercent = (wins.length*100/gamesPlayed).toFixed()
    
      const renderHistory = (game: Game, index: number): ReactElement => (
        <div key={index} className={classes.historyLabelContainer}>
          <RenderSVG icon={game.win ? ICONS.WIN : ICONS.SKULL} height='32'/>
          <span>{`${game.opponentUsername} - ${game.opponentDeck} - ${game.myScore}-${game.opponentScore}`}</span>
        </div>
      )

      const renderRightButton = (): ReactElement => (
        <IonButton disabled={note.length === 0} onClick={() => updateNote(deck.id, note)}>
          Save Note
        </IonButton>
      )

      const sortedGames = deckHistory.sort((a, b) => a.date - b.date)
    
      return (
        <IonPage>
          <Toolbar back rightButtons={renderRightButton()}/>
          <IonContent className={classes.content}>
            <div className={classes.pageContainer}>
              <h2 className={classes.title}>{deck.name}</h2>

              <div className={classes.card}>
                <h4 className={classes.cardTitle}>Deck Stats</h4>
                <p className={classes.stat}>{`Wins: ${wins.length} - Losses: ${losses.length} - Win%: ${winPercent}%`}</p>
                <p className={classes.stat}>{`Games Played: ${gamesPlayed}`}</p>
                <p className={classes.stat}>{`Most wins: ${mostWins}`}</p>
                <p className={classes.stat}>{`Most losses: ${mostLosses}`}</p>
              </div>

              <div className={classes.card}>
                <h4 className={classes.cardTitle}>Game History</h4>
                <IonContent className={classes.cardContent}>
                  {sortedGames.map((game, index) => renderHistory(game, index))}
                </IonContent>
              </div>

              <div className={classes.card}>
                <h4 className={classes.cardTitle}>Notes</h4>
                <IonTextarea value={note} onIonChange={(event) => setNote(String(event.detail.value))} className={classes.notes}/>
              </div>

            </div>
          </IonContent>
        </IonPage>
      )
    } else {
      return <Loading/>
    } 
   

} 


export default connect(mapStateToProps, mapDispatchToProps)(DeckStats);