function getRandomCharacterImage() {
    const characterImageFiles = [ 'Monster_01.svg', 'Monster_02.svg', 'Monster_03.svg', 'Monster_04.svg', 'Monster_05.svg', 'Monster_06.svg', 'Monster_07.svg', 'Monster_08.svg', 'Monster_09.svg', 'Monster_10.svg', 'Monster_11.svg', 'Monster_12.svg', 'Monster_13.svg', 'Monster_14.svg', 'Monster_15.svg', 'Monster_16.svg', 'Monster_17.svg', 'Monster_18.svg', 'Monster_19.svg', 'Monster_20.svg'];
    return 'svg/'+characterImageFiles[Math.floor(Math.random()*characterImageFiles.length)];
} 

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            currentRound: 1,
            winner: null,
            playerLogMessages: [],
            monsterLogMessages: [],
            playerImage: getRandomCharacterImage(),
            monsterImage: getRandomCharacterImage()
        }
    },
    computed: {
        monsterBarStyles() {
            if(this.monsterHealth <= 0) {
                return {width: '100%'};
            } else {
                return {width: (100 - this.monsterHealth) + '%'};
            }
        },
        playerBarStyles() {
            if(this.playerHealth <= 0) {
                return {width: '100%'};
            } else {
                return {width: (100 - this.playerHealth) + '%'};
            }            
        },
        monsterStyles() {
            if(this.monsterHealth <= 0) {
                return {opacity: '0.5'};
            } else if(this.winner === 'monster') {
                return {opacity: '1'};
            } else {
                //return {filter: 'grayscale('+(100 - this.monsterHealth)+'%)', opacity: (this.monsterHealth / 200) + 0.5};
                return {opacity: (this.monsterHealth / 200) + 0.5};
            }
        },   
        playerStyles() {
            if(this.playerHealth <= 0) {
                return {opacity: '0.5'};
            } else if(this.winner === 'player') {
                return {opacity: '1'};
            } else {
                //return {filter: 'grayscale('+(100 - this.playerHealth)+'%)', opacity: (this.monsterHealth/200) + 0.5};
                return {opacity: (this.monsterHealth/200) + 0.5};
            }
        },           
        monsterClasses() {
            const animationClasses = ['animate__shakeX', 'animate__swing', 'animate__wobble', 'animate__tada'];

            if(this.monsterHealth <= 0) {
                return ['animate__animated', 'animate__rotateOut'];
            } else if( this.monsterHealth === 100) {
                return ['animate__animated', 'animate__jackInTheBox'];
            } else {
                return ['animate__animated', animationClasses[Math.floor(Math.random()*animationClasses.length)]];
            }            
        },   
        playerClasses() {
            const animationClasses = ['animate__jello', 'animate__shakeY', 'animate__heartBeat', 'animate__rubberBand'];
            
            if(this.playerHealth <= 0) {
                return ['animate__animated', 'animate__rotateOut'];
            } else if( this.playerHealth === 100) {
                return ['animate__animated', 'animate__jackInTheBox'];
            } else {
                return ['animate__animated', animationClasses[Math.floor(Math.random()*animationClasses.length)]];
            }             
        },            
        monsterHealthPercentage() {
            return (this.monsterHealth <= 0) ? '0%' : this.monsterHealth + '%';
        },     
        playerHealthPercentage() {
            return (this.playerHealth <= 0) ? '0%' : this.playerHealth + '%';
        },           
        mayUseSpecialAttack() {
            return (this.currentRound - 1) % 3 === 0;
        }     
    },
    watch: {
        playerHealth(value) {
            if(value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if(value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }            
        }
    },
    methods: {
        attackPlayer() {
            const damage = getRandomValue(8, 15);
            this.playerHealth -= damage;
            this.addLogMessage('monster', 'Counter Attack', '-'+damage);
        },        
        attackMonster() {
            this.currentRound++;
            const damage = getRandomValue(5, 12);
            this.monsterHealth -= damage;
            this.addLogMessage('player', 'Attack', '-'+damage);
            this.attackPlayer();
        },
        specialAttackMonster() {
            this.currentRound++;
            const damage = getRandomValue(10, 25);
            this.monsterHealth -= damage;
            this.addLogMessage('player', 'Special Attack', '-'+damage);
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            if(this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'Heal', '+'+healValue);
            this.attackPlayer();
        },
        startNewGame() {
            this.monsterHealth = 100;
            this.playerHealth = 100;
            this.currentRound = 1;
            this.winner = null;
            this.playerLogMessages = [];
            this.monsterLogMessages = [];
        },
        surrender() {
            this.winner = 'monster';
        },
        addLogMessage(who, what, value) {
            if(who === 'player') {
                this.playerLogMessages.unshift({
                    actionBy: who,
                    actionType: what,
                    actionValue: value
                });
            } else if(who === 'monster') {
                this.monsterLogMessages.unshift({
                    actionBy: who,
                    actionType: what,
                    actionValue: value
                });
            }
        }       
    }
});

app.mount('#game');