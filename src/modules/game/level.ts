export class Level {
    /**
     * Name of the faction
     * 
     * @returns 'USA'|'Werhmacht'|'Brits'|'Panzer Elite'|'UNKNOWN'
     */
    public faction: string;

    /**
     * Rank level, max level is 20
     * 
     * @returns 0-20
     */
    public ranklevel: number;

    /**
     * Rank title
     * 
     * @returns string
     */
    public title: string;

    /**
     * Rank emblem path
     * 
     * @returns string
     */
    public icon: string;

    constructor(faction: 'USA'|'Werhmacht'|'Brits'|'Panzer Elite'|'UNKNOWN', ranklevel: number) {
        this.faction = faction;
        this.ranklevel = ranklevel === -1 ? 1 : ranklevel === 0 ? 1 : ranklevel;
        this.icon = '';

        if( faction === 'USA' ) {
            this.icon = require('@/assets/ranks/usa/us_' + this.ranklevel.toString().padStart(2, '0') + '.png');
        }

        if( faction === 'Werhmacht' ) {
            this.icon = require('@/assets/ranks/werhmacht/heer_' + this.ranklevel.toString().padStart(2, '0') + '.png');
        }

        if( faction === 'Brits' ) {
            this.icon = require('@/assets/ranks/brits/brit_' + this.ranklevel.toString().padStart(2, '0') + '.png');
        }

        if( faction === 'Panzer Elite' ) {
            this.icon = require('@/assets/ranks/panzer-elite/panzer_' + this.ranklevel.toString().padStart(2, '0') + '.png');
        }
        
        this.title = 'TEST';
    }

    public getTitle(ranklevel: number) {
        //
    }

    public toObject() {
        return {
            faction: this.faction,
            ranklevel: this.ranklevel,
            title: this.title,
            icon: this.icon
        }
    }
}