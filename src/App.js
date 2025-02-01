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
        <>
        <li key={player}>
            Player {player}:
            <br></br>
            <ul>
                Leaders:
                {draftedLeaders}
            </ul>
            <ul>
                Civs:
                {draftedCivs}
            </ul>
        </li>
        <br></br>
        </>
    );
}

function Drafted({ ready, players, leaderChoices, civChoices, age, bannedLeaders, bannedCivs }) {
    
    leaderPool = structuredClone(leaders);
    civPool = structuredClone(civsPerAge[age]);
    
    if (!ready) {
        return null;
    }

    for (let i = 0; i < bannedLeaders.length; i++) {
        const index = leaderPool.indexOf(bannedLeaders[i]);
        if (index > -1) {
            leaderPool.splice(index, 1);
        }
    }

    for (let i = 0; i < bannedCivs.length; i++) {
        const index = civPool.indexOf(bannedCivs[i]);
        if (index > -1) {
            civPool.splice(index, 1);
        }
    }

    const errors = [];

    const availableLeaders = leaderPool.length;
    const availableCivs = civPool.length;

    if (players * leaderChoices > availableLeaders) {
        errors.push(<li>Not enough leaders to draft. Currently available: {availableLeaders}</li>)
    }

    if (players * civChoices > availableCivs) {
        errors.push(<li>Not enough civs in {ageNames[age]} age to draft. Currently available: {availableCivs}</li>)
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
        drafts.push(<SingleDraft player={i} leaderChoices={leaderChoices} civChoices={civChoices}/>);
    }

    return (
        <>
            <ul>
                {drafts}
            </ul>
        </>
    );
}

function LeaderBans() {

    const leadersBans = [];

    for (let i = 0; i < leaders.length; i++) {
        leadersBans.push(<label>
                            <input type="checkbox" name={leaders[i]} defaultChecked={false} /> {leaders[i]}
                            <br/>
                         </label>);
    }

    return leadersBans;
}

function AntiquityBans() {

    const antiquityCivs = [];

    for (let i = 0; i < civsPerAge[0].length; i++) {
        antiquityCivs.push(<label>
                            <input type="checkbox" name={civsPerAge[0][i]} defaultChecked={false} /> {civsPerAge[0][i]}
                            <br/>
                         </label>);
    }

    return antiquityCivs;
}

function ExplorationBans() {

    const explorationCivs = [];

    for (let i = 0; i < civsPerAge[1].length; i++) {
        explorationCivs.push(<label>
                            <input type="checkbox" name={civsPerAge[1][i]} defaultChecked={false} /> {civsPerAge[1][i]}
                            <br/>
                         </label>);
    }

    return explorationCivs;
}

function ModernBans() {

    const modernCivs = [];

    for (let i = 0; i < civsPerAge[2].length; i++) {
        modernCivs.push(<label>
                            <input type="checkbox" name={civsPerAge[2][i]} defaultChecked={false} /> {civsPerAge[2][i]}
                            <br/>
                         </label>);
    }

    return modernCivs;
}

export default function Drafter() {

    const [players, setPlayers] = useState(3);
    const [leaderChoices, setLeaderChoices] = useState(3);
    const [civChoices, setCivChoices] = useState(3);
    const [age, setAge] = useState(0);
    const [bannedLeaders, setBannedLeaders] = useState([]);
    const [bannedCivs, setBannedCivs] = useState([]);
    
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

        const newBannedLeaders = [];
        const newBannedCivs = [];

        for (let i = 0; i < leaders.length; i++) {
            if (form[leaders[i]]) {
                newBannedLeaders.push(leaders[i]);
            } 
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < civsPerAge[i].length; j++) {
                if (form[civsPerAge[i][j]]) {
                    newBannedCivs.push(civsPerAge[i][j]);
                }
            }
        }

        console.log(newBannedLeaders);
        
        setBannedLeaders(newBannedLeaders);
        setBannedCivs(newBannedCivs);

        setReady(true);
        
        console.log(`marcin ma malego`);
        forceUpdate();
    }

    return (
        <>
            <div class="alignment">
                <div class="center">
                    <form method="post" onSubmit={generate}>
                        <div class="left">
                            <label>
                            Number of players 
                            <br></br>
                            <input name="playerNumber" type="number" defaultValue={3}/>
                            </label>
                            <hr />
                            <label>
                            Leader choices per player
                            <br></br>
                            <input name="leaderChoicesNumber" type="number" defaultValue={3}/>
                            </label>
                            <hr />
                            <label>
                            Civ choices per player
                            <br></br>
                            <input name="civChoicesNumber" type="number" defaultValue={3} />
                            </label>
                            <hr />
                            <p class="ages">
                                Age:
                                <label><input type="radio" name="age" value="0" defaultChecked={true}/> Antiquity</label>
                                <label><input type="radio" name="age" value="1" /> Exploration</label>
                                <label><input type="radio" name="age" value="2" /> Modern</label>
                            </p>
                            <hr />
                            <button type="submit" class="generateButton"> Draft </button>
                            <Drafted
                                ready={ready}
                                players={players}
                                leaderChoices={leaderChoices}
                                civChoices={civChoices}
                                age={age}
                                bannedLeaders={bannedLeaders}
                                bannedCivs={bannedCivs}
                            />
                        </div>
                        <div class="right">
                            <p>BANS</p>
                            <hr />
                            <div class="fleksi">
                                <div>
                                    <p>Leaders</p>
                                    <LeaderBans/>
                                </div>
                                <div>
                                    <p>Antiquity Civs</p>
                                    <AntiquityBans/>
                                </div>
                                <div>
                                    <p>Exploration Civs</p>
                                    <ExplorationBans/>
                                </div>
                                <div>
                                    <p>Modern Civs</p>
                                    <ModernBans/>
                                </div>
                            </div>
                        </div>
                    </form>  
                </div>
            </div>
        </>
    );
}
  
  