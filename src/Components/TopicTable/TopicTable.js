import React, {useContext, useEffect} from "react";
import "./TopicTable.scss";
import {Link} from "react-router-dom";
import {Context} from "../../Store/appContext";
import GameCard from "./GameCard/GameCard"

export function TopicTable() {

    const {store, actions} = useContext(Context);
    const{loadGameData} = actions

    useEffect(() => {
        loadGameData()
    },[loadGameData])
    

    const gameList = !store.gameData
        ? "Loading..."
        : store
            .gameData
            .map(game => {
                return <Link to="/game_details" key={game.id}>
                    <GameCard 
                        gameId={game.id}
                        imageToDisplay={game.background_image}
                        clip={game.clip.clip} 
                        gameName={game.name}
                        releasedDay={game.released}
                        rating={game.rating}
                        ratingCount={game.ratings_count}
                        suggestionsCount={game.suggestions_count}/>
                </Link>
            })

            
            return (
                <div className="tableContainer">
                    <div className="gameCardBox">
                        {gameList}
                    </div>
                </div>
            );
        }
