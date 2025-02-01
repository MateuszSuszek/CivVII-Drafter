import { useState } from "react";
import { useReducer } from "react";

const leaders = ["Ada Lovelace", "Amina", "Ashoka, World Conqueror", "Ashoka, World Renouncer", "Augustus", "Benjamin Franklin", "Catherine The Great", "Charlemagne", "Confucius", "Friedrich, Baroque",
                 "Friedrich, Oblique", "Harriet Tubman", "Hatshepsut", "Himiko, High Shaman", "Himiko, Queen of Wa", "Ibn Battuta", "Isabella", "José Rizal", "Lafayette", "Machiavelli", "Napoleon, Emperor",
                 "Napoleon, Revolutionary", "Pachacuti", "Simón Bolívar", "Tecumseh", "Trung Trac", "Xerxes, King of Kings", "Xerxes, the Achaemenid"];

const civsPerAge = [["Aksumite", "Carthaginian", "Egyptian", "Greek", "Han", "Khmer", "Mauryan", "Maya", "Mississipian", "Persian", "Roman"], 
                    ["Abbasid", "Bulgarian", "Chola", "Hawaiian", "Incan", "Majapahit", "Ming", "Mongolian", "Norman", "Shawnee", "Songhai", "Spanish"],
                    ["American", "British", "Buganda", "French Imperial", "Meiji Japanese", "Mexican", "Mughal", "Nepalese", "Prussian", "Qing", "Russian", "Siamese"]];

const ageNames = ["Antiquity", "Exploration", "Modern"];

let leaderPool = [];
let civPool = [];

function SingleDraft({ player, leaderChoices, civChoices }) {

    const draftedLeaders = [];
    const draftedCivs = [];

    for (let i = 0; i < leaderChoices; i++) {
        let index = Math.floor(Math.random() * leaderPool.length); 
        draftedLeaders.push(<li>{leaderPool[index]}</li>);
        leaderPool.splice(index, 1);
    }

    for (let i = 0; i < civChoices; i++) {
        let index = Math.floor(Math.random() * civPool.length); 
        draftedCivs.push(<li>{civPool[index]}</li>);
        civPool.splice(index, 1);
    }

    return (
        <li key={player}>
            Player {player}:
            <ul>
                Leaders:
                {draftedLeaders}
            </ul>
            <ul>
                Civs:
                {draftedCivs}
            </ul>
        </li>
    );
}

function Drafted({ ready, players, leaderChoices, civChoices, age }) {
    
    leaderPool = structuredClone(leaders);
    civPool = structuredClone(civsPerAge[age]);
    
    if (!ready) {
        return null;
    }

    const errors = [];

    const availableLeaders = leaders.length;
    const availableCivs = civsPerAge[age].length;

    if (players * leaderChoices > availableLeaders) {
        errors.push(<li>Not enough leaders to draft. Currently in game: {leaders.length}</li>)
    }

    if (players * civChoices > availableCivs) {
        errors.push(<li>Not enough civs in {ageNames[age]} age to draft. Currently in game: {availableCivs}</li>)
    }

    if (errors.length > 0) {
        return (
            <>
                <ul>
                    {errors}
                </ul>
            </>    
        );
    }

    const drafts = [];

    for (let i = 1; i <= players; i++) {
        drafts.push(<SingleDraft player={i} leaderChoices={leaderChoices} civChoices={civChoices}/>)
    }

    return (
        <>
            <ul>
                {drafts}
            </ul>
        </>
    );
}

export default function Drafter() {

    const [players, setPlayers] = useState(3);
    const [leaderChoices, setLeaderChoices] = useState(3);
    const [civChoices, setCivChoices] = useState(3);
    const [age, setAge] = useState(0);
    
    const [ready, setReady] = useState(false);

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    
    function generate(e) {

        e.preventDefault();
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData.entries());

        setPlayers(form.playerNumber);
        setLeaderChoices(form.leaderChoicesNumber);
        setCivChoices(form.civChoicesNumber);
        setAge(form.age);

        setReady(true);
        
        console.log(`marcin ma malego`);
        forceUpdate();
    }

    return (
        <>
            <form method="post" onSubmit={generate}>
                <label>
                Number of players: <input name="playerNumber" type="number" defaultValue={3}/>
                </label>
                <hr />
                <label>
                Leader choices per player: <input name="leaderChoicesNumber" type="number" defaultValue={3}/>
                </label>
                <label>
                Civ choices per player: <input name="civChoicesNumber" type="number" defaultValue={3}/>
                </label>
                <p>
                    Age:
                    <label><input type="radio" name="age" value="0" defaultChecked={true}/> Antiquity</label>
                    <label><input type="radio" name="age" value="1" /> Exploration</label>
                    <label><input type="radio" name="age" value="2" /> Modern</label>
                </p>
                <hr />
                
                <button type="submit" className="generateButton"> Generate </button>
            </form>
            <Drafted
                ready={ready}
                players={players}
                leaderChoices={leaderChoices}
                civChoices={civChoices}
                age={age}
            />
        </>
    );
}
  
  