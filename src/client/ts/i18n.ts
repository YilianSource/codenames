import React from "react";

import { Language } from "../../shared/codenames";

/**
 * Provides functionality for internationalization in terms of languages.
 */
class i18n {
    /**
     * The current language.
     */
    public language: Language = this.determineLanguage();
    /**
     * The current definition of terms, based on the current language.
     */
    public definition: LanguageDefinition | undefined = undefined;

    /**
     * Initializes a new instance of the utility, loading a default language.
     */
    constructor() {
        this.loadLanguage(this.language);
    }

    /**
     * Determines the language currently saved in the local storage. Falls back the specified default language.
     */
    determineLanguage(defaultLanguage: Language = Language.English): Language {
        return window.localStorage.getItem('lang') as Language || defaultLanguage;
    }
    /**
     * Saves the specified language to the local storage.
     */
    setLanguage(language: Language) {
        window.localStorage.setItem('lang', language);
    }
    /**
     * Loads the definitions of the specified language. Note that this does not save the language to the local storage.
     */
    loadLanguage(lang: Language) {
        if (definitions[lang] == undefined) {
            console.warn(`No language with key '${lang}' exists. Translations might throw errors.`);
        }

        this.language = lang;
        this.definition = definitions[lang];
    }

    /**
     * Formats the specified language entry using the specified arguments.
     * Arguments are sequentially consumed and replace text in the format '{index}' in the entry.
     */
    format(key: LangKey, ...args: any[]): string;
    /**
     * Formats the specified language entry using the specified arguments.
     * Allows the usage of named arguments, which replace text in the format '{name}' in the entry. 
     */
    format(key: LangKey, args?: any[] | { [key: string]: any }): string {
        if (this.definition == undefined) {
            throw new Error("Language key formatting failed, no language loaded.");
        }

        // Fall back to an empty string if no defintion was found.
        let entry = this.definition[key] || '';
        if (args !== undefined && entry !== '') {
            // The rest parameter are not implicitly converted to an array with a single element, so we fix this.
            if (!Array.isArray(args) && typeof args !== "object") { args = [args]; }

            if (Array.isArray(args)) {
                // Enumerate over the array and replace the indexed placeholders in the entry.
                for (let i = 0; i < args.length; i++) {
                    entry = entry.replace("{" + i + "}", args[i]);
                }
            }
            else {
                // Enumerate over the arguments and replace the named placeholders in the entry.
                for (let key in args) {
                    entry = entry.replace("{" + key + "}", args[key]);
                }
            }
        }

        return entry;
    }

    /**
     *  Formats the specified language entry using the specified arguments and returns the result as a React element.
     */
    formatHtml(key: LangKey, ...args: any[]): React.ReactElement;
    /**
     * Formats the specified language entry using the specified arguments and returns the result as a React element.
     */
    formatHtml(key: LangKey, args?: any[] | { [key: string]: any }): React.ReactElement {
        return React.createElement("span", { dangerouslySetInnerHTML: { __html: this.format(key, args) }, className: "i18n-generated" });
    }
}

type LanguageDefinition = { [key in LangKey]?: string };
export const enum LangKey {
    LobbyTitle = "lobbyTitle",
    LobbyGameId = "lobbyGameId",
    LobbyDescription1 = "lobbyDescription1",
    LobbyDescription2 = "lobbyDescription2",
    LobbyMissing = "lobbyMissing",
    LobbyStart = "lobbyStart",

    HintWord = "hintWord",
    HintAmount = "hintAmount",
    HintIncludesCardWord = "hintIncludesCardWord",
    HintSubmit = "hintSubmit",
    HintPleaseWait = "hintPleaseWait",

    EndTurn = "endTurn",
    TeamHasWon = "teamHasWon",
    PlayAgainButton = "playAgainButton",
    PlayAgainRequest = "playAgainRequest",

    TeamRed = "teamRed",
    TeamBlue = "teamBlue",
    TeamSwitch = "teamSwitch",
    
    GameMaster = "gameMaster",
    Host = "host"
}

const definitions: { [lang in Language]: LanguageDefinition } = {
    [Language.German]: {
        [LangKey.LobbyTitle]: "Lobby",
        [LangKey.LobbyGameId]: 'Andere Spieler können über den Code <span class="font-mono">{0}</span> beitreten!',
        [LangKey.LobbyDescription1]: "Stellt sicher, dass jedes Team mindestens <b>zwei</b> Spieler hat.",
        [LangKey.LobbyDescription2]: "Sobald ihr bereit seid, muss der Veranstalter ({0}) auf <b>Start</b> drücken!",
        [LangKey.LobbyMissing]: "{team} hat noch {missing} Spieler zu wenig.",
        [LangKey.LobbyStart]: "Start!",

        [LangKey.HintWord]: "Hinweis",
        [LangKey.HintAmount]: "Wortanzahl",
        [LangKey.HintIncludesCardWord]: "Der Hinweis darf keines der Wörter auf den Karten beinhalten.",
        [LangKey.HintSubmit]: "Hinweis abschicken!",
        [LangKey.HintPleaseWait]: "Bitte wartet, während der Spielleiter ({0}) sich einen Hinweis ausdenkt!",

        [LangKey.EndTurn]: "Zug beenden",
        [LangKey.TeamHasWon]: "{0} hat das Spiel gewonnen!",
        [LangKey.PlayAgainButton]: "Nochmal spielen!",
        [LangKey.PlayAgainRequest]: "Bittet den Spielleiter ({0}) ein neues Spiel zu starten!",

        [LangKey.TeamRed]: "Team Rot",
        [LangKey.TeamBlue]: "Team Blau",
        [LangKey.TeamSwitch]: "Team wechseln",

        [LangKey.GameMaster]: "Spielleiter",
        [LangKey.Host]: "Veranstalter"
    },
    [Language.English]: {
        [LangKey.LobbyTitle]: "Lobby",
        [LangKey.LobbyGameId]: 'Other players can join via the code <span class="font-mono">{0}</span>!',
        [LangKey.LobbyDescription1]: "Make sure both teams have at least <b>two</b> players.",
        [LangKey.LobbyDescription2]: "Once you are ready, the host ({0}) needs to press <b>Start</b>!",
        [LangKey.LobbyMissing]: "{team} is missing {missing} player(s)!",
        [LangKey.LobbyStart]: "Start!",

        [LangKey.HintWord]: "Hint Word",
        [LangKey.HintAmount]: "Amount",
        [LangKey.HintIncludesCardWord]: "The word may not include any word on the cards.",
        [LangKey.HintSubmit]: "Submit Hint!",
        [LangKey.HintPleaseWait]: "Please wait while the game master ({0}) is choosing a hint.",

        [LangKey.EndTurn]: "End turn",
        [LangKey.TeamHasWon]: "{0} has won the game!",
        [LangKey.PlayAgainButton]: "Play again!",
        [LangKey.PlayAgainRequest]: "Ask the host ({0}) to start a new game!",

        [LangKey.TeamRed]: "Team Red",
        [LangKey.TeamBlue]: "Team Blue",
        [LangKey.TeamSwitch]: "Switch team",

        [LangKey.GameMaster]: "Game Master",
        [LangKey.Host]: "Host"
    }
}

export default new i18n();