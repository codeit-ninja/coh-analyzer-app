import fs from 'fs';
import { TypedEmitter } from 'tiny-typed-emitter';
import { App } from '@/modules/app.module';
import { remote } from 'electron';
import Player from '../player.module';
import Events from './events.module';

export interface LogFileState {
    size: number;
    lines: string[];
}

export interface iPlayerStats {
    steamId: BigInt;
    slotId: number;
    rank: number;
}

export interface LogFileEvents {
    'player-joined': () => void;
    'player-left': () => void;
    'game-started': () => void;
    'game-ended': () => void;
    'lobby-created': () => void;
    'needs-repopulation': () => void;
    'populating-player': (player: Player) => void;
    'fetch-player-stats': (player: iPlayerStats) => void;
}

export class Log {
    protected static _instance: Log;

    protected prevState?: LogFileState;

    protected watcher?: NodeJS.Timeout;

    public start() {
        this.prevState = this.currState;
        this.watcher = setInterval(() => {
            if(this.prevState?.size !== this.currState.size) {
                this.parseLog();
                
                this.prevState = this.currState;
            }
        }, 500);
    }

    public stop() {
        if( this.watcher ) clearInterval( this.watcher );
    }

    protected parseLog() {
        const lines = this.currState.lines.slice(this.prevState?.lines.length, this.currState.lines.length);

        lines.forEach(line => {
            //console.log(line);
            if(line.includes('starting local hosting')) {
                Events.emit('lobby-created');
            }

            // Lobby is a basic match
            if(line.match(/BASIC_MATCH/)) {
                console.log('type is basic match')
            }

            /**
             * If anything changes in the lobby, send notification to the lobby that we need to repopulate
             * GameInfo::ResetInfo fires on all kinds of changes
             * 
             * Examples
             * Player joins/leaves
             * Map changes
             * Close slot,
             * Set slot as Ai
             */
            if(line.match(/GameInfo::ResetInfo/)) {
                Events.emit('needs-repopulation');
            }

            // Player joined lobby
            if(line.match(/Host accepted Peer (?<peerId>\d+) into the match/)) {
                Events.emit('player-joined');
            }

            /**
             * Actual line example
             * 00:00:00.00   PopulateGameInfoInternal - Player #0 - [Id 189301, Type 0, Team 0, Race 0]
             * 
             * When this is logged it means that the lobby changed.
             * For example, a player joins or leaves the lobby.
             */
            const populatePlayer = line.match(/Player\s+(?<slotId>[#\d])+\s-\s\[Id\s(?<playerId>\d+|-1), Type (?<type>\d+), Team (?<team>\d+), Race (?<race>\d+)/);
            
            if(populatePlayer) {
                if( ! populatePlayer.groups ) return;
                
                const player = new Player({ 
                    slotId: parseInt(populatePlayer.groups.slotId), 
                    playerId: parseInt(populatePlayer.groups.playerId), 
                    type: parseInt(populatePlayer.groups.type), 
                    team: parseInt(populatePlayer.groups.team), 
                    race: parseInt(populatePlayer.groups.race),
                    rank: -1
                })

                Events.emit('populating-player', player)

                //console.log(Lobby.instance.getAllPlayers());
            }

            /**
             * Actual line example
             * 00:00:00.00   RLINK -- Match Started - [00000000:0002e375 /steam/76561198036527204], slot =  1, ranking =   -1
             * 
             * Regex captures 
             * steamId <76561198036527204>
             * slotId <1>
             * rank <-1>
             * 
             * This line is generated when the match started
             */
            const playerAdditionalInfo = line.match(/RLINK\s+--\s+Match Started -\s+\[[\d:\w\s]+\/steam\/(?<steamId>\d+)\],\s+slot\s+=\s+(?<slotId>\d+),\s+ranking\s+=\s+(?<rank>\d+|-1)/);

            if(playerAdditionalInfo) {
                if( ! playerAdditionalInfo.groups ) return;

                const stats = {
                    steamId: BigInt(playerAdditionalInfo.groups.steamId),
                    slotId: parseInt(playerAdditionalInfo.groups.slotId),
                    rank: parseInt(playerAdditionalInfo.groups.rank),
                };

                Events.emit('fetch-player-stats', stats)
            }
            
            if(line.match(/^[\d:.]+\s+RLINK -- WorldwideAutomatchService::OnStartComplete - detected successful game start/)) {
                Events.emit('game-started');
            }

            if(line.match(/GameObj::DoGameOverPopup/)) {
                Events.emit('game-ended');
            }
        })
    }

    protected get currState(): LogFileState {
        return {
            size: fs.statSync(App.config.cohLogPath).size,
            lines: fs.readFileSync(App.config.cohLogPath).toString().split(/\r?\n|\r/)
        }
    }
}